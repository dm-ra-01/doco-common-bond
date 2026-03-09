/**
 * SuppliersDashboard
 *
 * Live dashboard for public.suppliers — the Supplier Security Register.
 * Replaces the static Markdown supplier cards in supplier-register.md.
 * Wrapped in <GovernanceAuthGate> on the MDX page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface Supplier {
    id: string;
    name: string;
    service_description: string;
    data_classification: string;
    hosting: string;
    criticality: string;
    security_trust_url: string | null;
    certifications: string | null;
    dpa_status: string;
    dpa_action: string | null;
    last_reviewed_at: string;
    review_due_date: string | null;
}

const DPA_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Executed': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    'In Progress': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Not Executed': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'Not Required': { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
};

const CRIT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Critical': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'High': { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
    'Medium': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'Low': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
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

export function SuppliersDashboard() {
    const supabase = useSupabaseClient();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterDpa, setFilterDpa] = useState('all');
    const [filterCrit, setFilterCrit] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) { setError('Supabase client not configured.'); setLoading(false); return; }
        supabase
            .from('suppliers')
            .select('id,name,service_description,data_classification,hosting,criticality,security_trust_url,certifications,dpa_status,dpa_action,last_reviewed_at,review_due_date')
            .is('archived_at', null)
            .order('criticality')
            .order('name')
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setSuppliers(data as Supplier[]); }
                setLoading(false);
            });
    }, [supabase]);

    const dpaStatuses = ['Executed', 'In Progress', 'Not Executed', 'Not Required'];
    const criticalities = ['Critical', 'High', 'Medium', 'Low'];

    const filtered = useMemo(() => suppliers.filter(s => {
        if (filterDpa !== 'all' && s.dpa_status !== filterDpa) return false;
        if (filterCrit !== 'all' && s.criticality !== filterCrit) return false;
        if (search && !s.id.toLowerCase().includes(search.toLowerCase()) &&
            !s.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [suppliers, filterDpa, filterCrit, search]);

    const dpaActionRequired = suppliers.filter(s => s.dpa_status === 'Not Executed').length;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Supplier Register…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {/* DPA action alert */}
            {dpaActionRequired > 0 && (
                <div style={{
                    padding: '12px 16px', marginBottom: '16px', borderRadius: '8px',
                    backgroundColor: '#fff7ed', border: '1px solid #fdba74', color: '#9a3412'
                }}>
                    ⚠️ <strong>{dpaActionRequired} supplier{dpaActionRequired > 1 ? 's' : ''}</strong> require DPA execution. Filter by "Not Executed" to view.
                </div>
            )}

            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {dpaStatuses.map(s => {
                    const count = suppliers.filter(sup => sup.dpa_status === s).length;
                    const c = DPA_COLORS[s];
                    return (
                        <div key={s} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
                            <div style={{ fontSize: '0.75em', fontWeight: 700, color: c.text, textTransform: 'uppercase' }}>DPA: {s}</div>
                            <div style={{ fontSize: '1.8em', fontWeight: 700, color: c.text }}>{count}</div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input type="search" placeholder="Search ID or name…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em', minWidth: '180px' }} />
                <select value={filterDpa} onChange={e => setFilterDpa(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All DPA statuses</option>
                    {dpaStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterCrit} onChange={e => setFilterCrit(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All criticality levels</option>
                    {criticalities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {suppliers.length} active suppliers
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Supplier</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Service</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Classification</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Criticality</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>DPA Status</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Trust</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Last Reviewed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.9em' }}>{s.id}</td>
                                <td style={{ padding: '7px 12px', fontWeight: 500 }}>{s.name}</td>
                                <td style={{ padding: '7px 12px', color: '#374151' }}>{s.service_description}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{s.data_classification}</td>
                                <td style={{ padding: '7px 12px' }}><Badge label={s.criticality} colors={CRIT_COLORS} /></td>
                                <td style={{ padding: '7px 12px' }}><Badge label={s.dpa_status} colors={DPA_COLORS} /></td>
                                <td style={{ padding: '7px 12px' }}>
                                    {s.security_trust_url
                                        ? <a href={s.security_trust_url} target="_blank" rel="noopener noreferrer"
                                            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>🔒 Trust page</a>
                                        : <span style={{ color: '#9ca3af' }}>—</span>}
                                </td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{s.last_reviewed_at}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No suppliers match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
