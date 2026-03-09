/**
 * NonconformityDashboard
 *
 * Live dashboard for public.nonconformities — the NC Log.
 * Replaces the static Markdown table in nonconformity-log.md.
 * Wrapped in <GovernanceAuthGate> on the MDX page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface Nonconformity {
    id: string;
    identified_date: string;
    source: string;
    description: string;
    root_cause: string;
    ca_id: string | null;
    status: string;
    owner: string;
    review_due_date: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Closed': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'In Progress': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Open': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

function Badge({ label, colors }: { label: string; colors: Record<string, { bg: string; text: string; border: string }> }) {
    const c = colors[label] ?? { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
    return (
        <span style={{
            padding: '2px 8px', borderRadius: '10px', fontSize: '0.75em', fontWeight: 600,
            backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`, whiteSpace: 'nowrap'
        }}>
            {label}
        </span>
    );
}

export function NonconformityDashboard() {
    const supabase = useSupabaseClient();
    const [ncs, setNcs] = useState<Nonconformity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) { setError('Supabase client not configured.'); setLoading(false); return; }
        supabase
            .from('nonconformities')
            .select('id,identified_date,source,description,root_cause,ca_id,status,owner,review_due_date')
            .is('archived_at', null)
            .order('identified_date', { ascending: false })
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setNcs(data as Nonconformity[]); }
                setLoading(false);
            });
    }, [supabase]);

    const statuses = ['Open', 'In Progress', 'Closed'];

    const filtered = useMemo(() => ncs.filter(n => {
        if (filterStatus !== 'all' && n.status !== filterStatus) return false;
        if (search && !n.id.toLowerCase().includes(search.toLowerCase()) &&
            !n.description.toLowerCase().includes(search.toLowerCase()) &&
            !n.source.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [ncs, filterStatus, search]);

    const openCount = ncs.filter(n => n.status === 'Open').length;
    const inProgressCount = ncs.filter(n => n.status === 'In Progress').length;
    const closedCount = ncs.filter(n => n.status === 'Closed').length;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Non-Conformity Log…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {openCount > 0 && (
                <div style={{
                    padding: '12px 16px', marginBottom: '16px', borderRadius: '8px',
                    backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b'
                }}>
                    ⚠️ <strong>{openCount} open non-conformit{openCount === 1 ? 'y' : 'ies'}</strong> require corrective action.
                </div>
            )}

            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {[['Open', openCount, STATUS_COLORS['Open']], ['In Progress', inProgressCount, STATUS_COLORS['In Progress']], ['Closed', closedCount, STATUS_COLORS['Closed']]].map(([label, count, c]) => (
                    <div key={label as string} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: (c as any).bg, border: `1px solid ${(c as any).border}` }}>
                        <div style={{ fontSize: '0.75em', fontWeight: 700, color: (c as any).text, textTransform: 'uppercase' }}>{label as string}</div>
                        <div style={{ fontSize: '1.8em', fontWeight: 700, color: (c as any).text }}>{count as number}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input type="search" placeholder="Search ID, description, or source…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em', minWidth: '220px' }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {ncs.length} non-conformities
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Source</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Description</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Root Cause</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>CA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(n => (
                            <tr key={n.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.9em' }}>{n.id}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{n.identified_date}</td>
                                <td style={{ padding: '7px 12px', color: '#374151' }}>{n.source}</td>
                                <td style={{ padding: '7px 12px' }}>{n.description}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280' }}>{n.root_cause}</td>
                                <td style={{ padding: '7px 12px' }}><Badge label={n.status} colors={STATUS_COLORS} /></td>
                                <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: '0.9em', whiteSpace: 'nowrap', color: '#2563eb' }}>
                                    {n.ca_id ?? <span style={{ color: '#9ca3af' }}>—</span>}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No non-conformities match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
