/**
 * AuditRegistryDashboard
 *
 * Live dashboard for public.audits — the canonical cross-ecosystem
 * audit registry. Replaces the static Markdown table in internal-audit.md.
 * Wrapped in <GovernanceAuthGate> on the MDX page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface Audit {
    slug: string;
    title: string;
    scope: string;
    auditor: string;
    status: string;
    nc_raised: string | null;
    audit_url: string | null;
    recommendations_url: string | null;
    audit_date: string;
    review_due_date: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Closed': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'Implementing': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Findings Issued': { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
    'Drafting': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
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

export function AuditRegistryDashboard() {
    const supabase = useSupabaseClient();
    const [audits, setAudits] = useState<Audit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) { setError('Supabase client not configured.'); setLoading(false); return; }
        supabase
            .from('audits')
            .select('slug,title,scope,auditor,status,nc_raised,audit_url,recommendations_url,audit_date,review_due_date')
            .is('archived_at', null)
            .order('audit_date', { ascending: false })
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setAudits(data as Audit[]); }
                setLoading(false);
            });
    }, [supabase]);

    const statuses = ['Closed', 'Implementing', 'Findings Issued', 'Drafting'];

    const filtered = useMemo(() => audits.filter(a => {
        if (filterStatus !== 'all' && a.status !== filterStatus) return false;
        if (search && !a.slug.toLowerCase().includes(search.toLowerCase()) &&
            !a.title.toLowerCase().includes(search.toLowerCase()) &&
            !a.scope.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [audits, filterStatus, search]);

    const countByStatus = (s: string) => audits.filter(a => a.status === s).length;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Audit Registry…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {statuses.map(s => {
                    const count = countByStatus(s);
                    const c = STATUS_COLORS[s];
                    return (
                        <div key={s} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
                            <div style={{ fontSize: '0.75em', fontWeight: 700, color: c.text, textTransform: 'uppercase' }}>{s}</div>
                            <div style={{ fontSize: '1.8em', fontWeight: 700, color: c.text }}>{count}</div>
                        </div>
                    );
                })}
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>Total</div>
                    <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#374151' }}>{audits.length}</div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input type="search" placeholder="Search slug, title, or scope…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em', minWidth: '220px' }} />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {audits.length} audits
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Slug</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Title</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Scope</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Auditor</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>NC</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Docs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => (
                            <tr key={a.slug} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.9em' }}>{a.slug}</td>
                                <td style={{ padding: '7px 12px' }}>{a.title}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280' }}>{a.scope}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{a.auditor}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{a.audit_date}</td>
                                <td style={{ padding: '7px 12px' }}><Badge label={a.status} colors={STATUS_COLORS} /></td>
                                <td style={{ padding: '7px 12px', whiteSpace: 'nowrap' }}>
                                    {a.nc_raised
                                        ? <span style={{ fontFamily: 'monospace', color: '#9a3412', fontSize: '0.9em' }}>{a.nc_raised}</span>
                                        : <span style={{ color: '#9ca3af' }}>—</span>}
                                </td>
                                <td style={{ padding: '7px 12px', whiteSpace: 'nowrap' }}>
                                    {a.audit_url && <a href={a.audit_url} target="_blank" rel="noopener noreferrer"
                                        style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500, marginRight: '8px' }}>📋 Audit</a>}
                                    {a.recommendations_url && <a href={a.recommendations_url} target="_blank" rel="noopener noreferrer"
                                        style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>📝 Recs</a>}
                                    {!a.audit_url && !a.recommendations_url && <span style={{ color: '#9ca3af' }}>—</span>}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No audits match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
