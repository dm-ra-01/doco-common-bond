/**
 * CorrectiveActionsDashboard
 *
 * Live dashboard for public.corrective_actions — the CA Log.
 * Replaces the static Markdown CA entries in corrective-actions.md.
 * Wrapped in <GovernanceAuthGate> on the MDX page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface CorrectiveAction {
    id: string;
    nc_id: string | null;
    description: string;
    status: string;
    owner: string;
    due_date: string | null;
    closed_date: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Closed': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'In Progress': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Open': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'Planned': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
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

export function CorrectiveActionsDashboard() {
    const supabase = useSupabaseClient();
    const [cas, setCas] = useState<CorrectiveAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) { setError('Supabase client not configured.'); setLoading(false); return; }
        supabase
            .from('corrective_actions')
            .select('id,nc_id,description,status,owner,due_date,closed_date')
            .is('archived_at', null)
            .order('id')
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setCas(data as CorrectiveAction[]); }
                setLoading(false);
            });
    }, [supabase]);

    const statuses = ['Open', 'In Progress', 'Planned', 'Closed'];
    const filtered = useMemo(() => cas.filter(c => {
        if (filterStatus !== 'all' && c.status !== filterStatus) return false;
        if (search && !c.id.toLowerCase().includes(search.toLowerCase()) &&
            !c.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [cas, filterStatus, search]);

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Corrective Actions…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    const openCount = cas.filter(c => c.status === 'Open' || c.status === 'In Progress').length;

    return (
        <div style={{ marginTop: '16px' }}>
            {openCount > 0 && (
                <div style={{
                    padding: '12px 16px', marginBottom: '16px', borderRadius: '8px',
                    backgroundColor: '#fff7ed', border: '1px solid #fdba74', color: '#9a3412'
                }}>
                    ⚠️ <strong>{openCount} action{openCount === 1 ? '' : 's'}</strong> are Open or In Progress.
                </div>
            )}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {statuses.map(s => {
                    const count = cas.filter(c => c.status === s).length;
                    const col = STATUS_COLORS[s];
                    return (
                        <div key={s} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: col.bg, border: `1px solid ${col.border}` }}>
                            <div style={{ fontSize: '0.75em', fontWeight: 700, color: col.text, textTransform: 'uppercase' }}>{s}</div>
                            <div style={{ fontSize: '1.8em', fontWeight: 700, color: col.text }}>{count}</div>
                        </div>
                    );
                })}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input type="search" placeholder="Search ID or description…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em', minWidth: '200px' }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {cas.length} corrective actions
            </p>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>NC Ref</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Description</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Owner</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Due</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Closed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.9em' }}>{c.id}</td>
                                <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: '0.9em', color: '#6b7280' }}>
                                    {c.nc_id ?? <span style={{ color: '#9ca3af' }}>—</span>}
                                </td>
                                <td style={{ padding: '7px 12px' }}>{c.description}</td>
                                <td style={{ padding: '7px 12px' }}><Badge label={c.status} colors={STATUS_COLORS} /></td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{c.owner}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                    {c.due_date ?? <span style={{ color: '#9ca3af' }}>—</span>}
                                </td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                                    {c.closed_date ?? <span style={{ color: '#9ca3af' }}>—</span>}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No corrective actions match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
