/**
 * RiskRegisterDashboard
 *
 * REC-01 / REC-24 / REC-25 — Risk Register live dashboard.
 * Fetches from public.risks with client-side filtering by status,
 * risk level, and free-text search. Evidence links rendered inline
 * for any risk where evidence_url is populated (REC-25).
 *
 * SEC-01: Wrapped in <GovernanceAuthGate> — unauthenticated visitors
 * see the login form; non-management roles see access-denied message.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface Risk {
    risk_id: string;
    title: string;
    category: string;
    likelihood: number;
    impact: number;
    risk_level: string;
    status: string;
    treatment_strategy: string;
    evidence_url: string | null;
    evidence_description: string | null;
    owner: string;
    review_due_date: string | null;
    archived_at: string | null;
}

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Critical': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'High': { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
    'Medium': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'Low': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Ongoing': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Planned': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'Closed': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'Accepted': { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
    'Transferred': { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
};

function Badge({
    label,
    colors,
}: {
    label: string;
    colors: Record<string, { bg: string; text: string; border: string }>;
}) {
    const c = colors[label] ?? { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
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
        }}>{label}</span>
    );
}

export function RiskRegisterDashboard() {
    const supabase = useSupabaseClient();
    const [risks, setRisks] = useState<Risk[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) {
            setError('Supabase client not configured.');
            setLoading(false);
            return;
        }
        supabase
            .from('risks')
            .select('risk_id,title,category,likelihood,impact,risk_level,status,treatment_strategy,evidence_url,evidence_description,owner,review_due_date,archived_at')
            .is('archived_at', null)
            .order('risk_level', { ascending: false })
            .order('risk_id')
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setRisks(data as Risk[]); }
                setLoading(false);
            });
    }, [supabase]);

    const categories = useMemo(() => [...new Set(risks.map(r => r.category))].sort(), [risks]);
    const levels = ['Critical', 'High', 'Medium', 'Low'];
    const statuses = ['Ongoing', 'Planned', 'Accepted', 'Transferred', 'Closed'];

    const filtered = useMemo(() => risks.filter(r => {
        if (filterStatus !== 'all' && r.status !== filterStatus) return false;
        if (filterLevel !== 'all' && r.risk_level !== filterLevel) return false;
        if (filterCategory !== 'all' && r.category !== filterCategory) return false;
        if (search && !r.risk_id.toLowerCase().includes(search.toLowerCase()) &&
            !r.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [risks, filterStatus, filterLevel, filterCategory, search]);

    // Summary counts
    const byCriticality = (lvl: string) => risks.filter(r => r.risk_level === lvl).length;
    const activeCount = risks.filter(r => r.status === 'Ongoing' || r.status === 'Planned').length;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Risk Register…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {levels.map(lvl => {
                    const count = byCriticality(lvl);
                    const c = LEVEL_COLORS[lvl] ?? LEVEL_COLORS['Low'];
                    return (
                        <div key={lvl} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
                            <div style={{ fontSize: '0.75em', fontWeight: 700, color: c.text, textTransform: 'uppercase' }}>{lvl}</div>
                            <div style={{ fontSize: '1.8em', fontWeight: 700, color: c.text }}>{count}</div>
                        </div>
                    );
                })}
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#dbeafe', border: '1px solid #93c5fd' }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Active Treatments</div>
                    <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#1e40af' }}>{activeCount}</div>
                    <div style={{ fontSize: '0.75em', color: '#1e40af' }}>Ongoing + Planned</div>
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
                <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All risk levels</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {risks.length} active risks
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Title</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Category</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Level</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>L × I</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Treatment</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Evidence</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.risk_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.risk_id}</td>
                                <td style={{ padding: '7px 12px' }}>{r.title}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{r.category}</td>
                                <td style={{ padding: '7px 12px' }}><Badge label={r.risk_level} colors={LEVEL_COLORS} /></td>
                                <td style={{ padding: '7px 12px', whiteSpace: 'nowrap', color: '#374151' }}>{r.likelihood}×{r.impact}</td>
                                <td style={{ padding: '7px 12px' }}><Badge label={r.status} colors={STATUS_COLORS} /></td>
                                <td style={{ padding: '7px 12px', color: '#374151' }}>{r.treatment_strategy}</td>
                                <td style={{ padding: '7px 12px' }}>
                                    {r.evidence_url
                                        ? <a href={r.evidence_url} target="_blank" rel="noopener noreferrer"
                                            title={r.evidence_description ?? 'Evidence link'}
                                            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                                            📎 View
                                        </a>
                                        : <span style={{ color: '#9ca3af' }}>—</span>
                                    }
                                </td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{r.owner}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={9} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No risks match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
