/**
 * SoaDashboard
 *
 * REC-18 / SOA-01 — Statement of Applicability live dashboard.
 * Fetches from public.soa_controls with client-side filtering by
 * applicable status and implementation_status (REC-24).
 */
import React, { useEffect, useState, useMemo } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface SoaControl {
    control_id: string;
    theme: string;
    theme_number: number;
    title: string;
    applicable: boolean;
    justification: string | null;
    implementation_status: string;
    owner: string;
    last_reviewed: string | null;
    review_due_date: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Implemented': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'Partial': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'Planned': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Not Started': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'Not Applicable': { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' },
};

function StatusBadge({ status }: { status: string }) {
    const c = STATUS_COLORS[status] ?? STATUS_COLORS['Not Started'];
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

export function SoaDashboard() {
    const supabase = useSupabaseClient();
    const [controls, setControls] = useState<SoaControl[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterApplicable, setFilterApplicable] = useState<'all' | 'applicable' | 'not_applicable'>('applicable');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterTheme, setFilterTheme] = useState<string>('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) {
            setError('Supabase client not configured.');
            setLoading(false);
            return;
        }
        supabase.from('soa_controls').select('*').order('theme_number').order('control_id')
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setControls(data as SoaControl[]); }
                setLoading(false);
            });
    }, [supabase]);

    const themes = useMemo(() => [...new Set(controls.map(c => c.theme))], [controls]);
    const statuses = ['Implemented', 'Partial', 'Planned', 'Not Started', 'Not Applicable'];

    const filtered = useMemo(() => controls.filter(c => {
        if (filterApplicable === 'applicable' && !c.applicable) return false;
        if (filterApplicable === 'not_applicable' && c.applicable) return false;
        if (filterStatus !== 'all' && c.implementation_status !== filterStatus) return false;
        if (filterTheme !== 'all' && c.theme !== filterTheme) return false;
        if (search && !c.control_id.toLowerCase().includes(search.toLowerCase()) &&
            !c.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [controls, filterApplicable, filterStatus, filterTheme, search]);

    const applicable = controls.filter(c => c.applicable);
    const implemented = applicable.filter(c => c.implementation_status === 'Implemented');
    const completionPct = applicable.length > 0 ? Math.round((implemented.length / applicable.length) * 100) : 0;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading SoA controls…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {/* Completion metric */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#dbeafe', border: '1px solid #93c5fd' }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Completion</div>
                    <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#1e40af' }}>{completionPct}%</div>
                    <div style={{ fontSize: '0.75em', color: '#1e40af' }}>{implemented.length} / {applicable.length} applicable</div>
                </div>
                {statuses.filter(s => s !== 'Not Applicable').map(s => {
                    const count = applicable.filter(c => c.implementation_status === s).length;
                    const col = STATUS_COLORS[s];
                    return (
                        <div key={s} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: col.bg, border: `1px solid ${col.border}` }}>
                            <div style={{ fontSize: '0.75em', fontWeight: 700, color: col.text, textTransform: 'uppercase' }}>{s}</div>
                            <div style={{ fontSize: '1.8em', fontWeight: 700, color: col.text }}>{count}</div>
                        </div>
                    );
                })}
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
                <select value={filterApplicable} onChange={e => setFilterApplicable(e.target.value as 'all' | 'applicable' | 'not_applicable')}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All controls</option>
                    <option value="applicable">Applicable only</option>
                    <option value="not_applicable">Not applicable</option>
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All themes</option>
                    {themes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {controls.length} controls
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Title</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Theme</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Applicable</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(c => (
                            <tr key={c.control_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{c.control_id}</td>
                                <td style={{ padding: '7px 12px' }}>{c.title}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{c.theme_number}. {c.theme}</td>
                                <td style={{ padding: '7px 12px' }}><StatusBadge status={c.implementation_status} /></td>
                                <td style={{ padding: '7px 12px' }}>{c.applicable ? '✅' : '❌'}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No controls match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
