/**
 * StandardsDashboard
 *
 * REC-07 / REC-24 — Standards Register live dashboard.
 * Fetches from public.standards with client-side filtering by
 * domain and status. Filter dropdowns + text search (REC-24).
 *
 * SEC-01: Wrapped in <GovernanceAuthGate> — management role required.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface Standard {
    standard_id: string;
    title: string;
    domain: string;
    standard_type: string;
    version: string | null;
    status: string;
    owner: string;
    review_due_date: string | null;
    last_reviewed: string | null;
    archived_at: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Active': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'Draft': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'Retired': { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' },
    'Under Review': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
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

function reviewDueSoon(dateStr: string | null): boolean {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const soon = new Date();
    soon.setDate(soon.getDate() + 30);
    return due <= soon;
}

export function StandardsDashboard() {
    const supabase = useSupabaseClient();
    const [standards, setStandards] = useState<Standard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterDomain, setFilterDomain] = useState('all');
    const [filterStatus, setFilterStatus] = useState('Active');
    const [filterType, setFilterType] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) {
            setError('Supabase client not configured.');
            setLoading(false);
            return;
        }
        supabase
            .from('standards')
            .select('standard_id,title,domain,standard_type,version,status,owner,review_due_date,last_reviewed,archived_at')
            .is('archived_at', null)
            .order('domain')
            .order('standard_id')
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setStandards(data as Standard[]); }
                setLoading(false);
            });
    }, [supabase]);

    const domains = useMemo(() => [...new Set(standards.map(s => s.domain))].sort(), [standards]);
    const types = useMemo(() => [...new Set(standards.map(s => s.standard_type))].sort(), [standards]);
    const statuses = ['Active', 'Draft', 'Under Review', 'Retired'];

    const filtered = useMemo(() => standards.filter(s => {
        if (filterDomain !== 'all' && s.domain !== filterDomain) return false;
        if (filterStatus !== 'all' && s.status !== filterStatus) return false;
        if (filterType !== 'all' && s.standard_type !== filterType) return false;
        if (search && !s.standard_id.toLowerCase().includes(search.toLowerCase()) &&
            !s.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [standards, filterDomain, filterStatus, filterType, search]);

    const activeCount = standards.filter(s => s.status === 'Active').length;
    const dueSoonCount = standards.filter(s => reviewDueSoon(s.review_due_date)).length;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Standards Register…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#dcfce7', border: '1px solid #86efac' }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Active</div>
                    <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#166534' }}>{activeCount}</div>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>Review Due ≤30 days</div>
                    <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#9a3412' }}>{dueSoonCount}</div>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Total</div>
                    <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#374151' }}>{standards.length}</div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input
                    type="search"
                    placeholder="Search ID or title…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em', minWidth: '180px' }}
                />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All domains</option>
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All types</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {standards.length} standards
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Title</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Domain</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Version</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Owner</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Review Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(s => (
                            <tr key={s.standard_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.standard_id}</td>
                                <td style={{ padding: '7px 12px' }}>{s.title}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280' }}>{s.domain}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280' }}>{s.standard_type}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280' }}>{s.version ?? '—'}</td>
                                <td style={{ padding: '7px 12px' }}><StatusBadge status={s.status} /></td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{s.owner}</td>
                                <td style={{ padding: '7px 12px', whiteSpace: 'nowrap', color: reviewDueSoon(s.review_due_date) ? '#9a3412' : '#374151', fontWeight: reviewDueSoon(s.review_due_date) ? 600 : 400 }}>
                                    {s.review_due_date ?? '—'}
                                    {reviewDueSoon(s.review_due_date) && ' ⚠️'}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No standards match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
