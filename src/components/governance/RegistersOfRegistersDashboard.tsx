/**
 * RegistersOfRegistersDashboard
 *
 * REC-07 / REC-24 — Register of Registers live dashboard.
 * Fetches from public.registers with client-side filtering by
 * register_type and status (REC-24).
 *
 * SEC-01: Wrapped in <GovernanceAuthGate> — management role required.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface Register {
    register_id: string;
    name: string;
    register_type: string;
    owner: string;
    location: string;
    governing_standard: string | null;
    review_cadence: string;
    review_due_date: string | null;
    status: string;
    archived_at: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Active': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'In Progress': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Planned': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'Needs Review': { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
};

function StatusBadge({ status }: { status: string }) {
    const c = STATUS_COLORS[status] ?? { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
    return (
        <span style={{
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '0.75em',
            fontWeight: 600,
            backgroundColor: c.bg,
            color: c.text,
            border: `1px solid ${c.border}`,
            whiteSpace: 'nowrap',
        }}>{status}</span>
    );
}

export function RegistersOfRegistersDashboard() {
    const supabase = useSupabaseClient();
    const [registers, setRegisters] = useState<Register[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) {
            setError('Supabase client not configured.');
            setLoading(false);
            return;
        }
        supabase
            .from('registers')
            .select('register_id,name,register_type,owner,location,governing_standard,review_cadence,review_due_date,status,archived_at')
            .is('archived_at', null)
            .order('register_type')
            .order('register_id')
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setRegisters(data as Register[]); }
                setLoading(false);
            });
    }, [supabase]);

    const types = useMemo(() => [...new Set(registers.map(r => r.register_type))].sort(), [registers]);
    const statuses = ['Active', 'In Progress', 'Planned', 'Needs Review'];

    const filtered = useMemo(() => registers.filter(r => {
        if (filterType !== 'all' && r.register_type !== filterType) return false;
        if (filterStatus !== 'all' && r.status !== filterStatus) return false;
        if (search && !r.register_id.toLowerCase().includes(search.toLowerCase()) &&
            !r.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [registers, filterType, filterStatus, search]);

    const activeCount = registers.filter(r => r.status === 'Active').length;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Register of Registers…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#dcfce7', border: '1px solid #86efac' }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Active</div>
                    <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#166534' }}>{activeCount}</div>
                    <div style={{ fontSize: '0.75em', color: '#166534' }}>of {registers.length} total</div>
                </div>
                {types.map(t => {
                    const count = registers.filter(r => r.register_type === t).length;
                    return (
                        <div key={t} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                            <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>{t}</div>
                            <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#374151' }}>{count}</div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input
                    type="search"
                    placeholder="Search ID or name…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em', minWidth: '180px' }}
                />
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All types</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {registers.length} registers
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Register ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Owner</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Location</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Review Cadence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.register_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.register_id}</td>
                                <td style={{ padding: '7px 12px' }}>{r.name}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280' }}>{r.register_type}</td>
                                <td style={{ padding: '7px 12px' }}><StatusBadge status={r.status} /></td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{r.owner}</td>
                                <td style={{ padding: '7px 12px', fontSize: '0.85em' }}>
                                    {r.location.startsWith('/') || r.location.startsWith('http')
                                        ? <a href={r.location} style={{ color: '#2563eb', textDecoration: 'none' }}>{r.location}</a>
                                        : <span style={{ color: '#6b7280' }}>{r.location}</span>
                                    }
                                </td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{r.review_cadence}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No registers match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
