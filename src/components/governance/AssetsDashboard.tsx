/**
 * AssetsDashboard
 *
 * Live dashboard for public.assets — the Information Asset Register.
 * Four categories: Information, Software / Services, Hardware, People.
 * Replaces the static Markdown tables in asset-register.md.
 * Wrapped in <GovernanceAuthGate> on the MDX page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface Asset {
    asset_id: string;
    name: string;
    category: string;
    description: string;
    owner: string;
    classification: string | null;
    location: string;
    recovery_priority: string;
    supplier_id: string | null;
}

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Critical': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
    'High': { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' },
    'Medium': { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    'Low': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Information': { bg: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' },
    'Software / Services': { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    'Hardware': { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
    'People': { bg: '#dcfce7', text: '#166534', border: '#86efac' },
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

export function AssetsDashboard() {
    const supabase = useSupabaseClient();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) { setError('Supabase client not configured.'); setLoading(false); return; }
        supabase
            .from('assets')
            .select('asset_id,name,category,description,owner,classification,location,recovery_priority,supplier_id')
            .is('archived_at', null)
            .order('category')
            .order('asset_id')
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setAssets(data as Asset[]); }
                setLoading(false);
            });
    }, [supabase]);

    const categories = ['Information', 'Software / Services', 'Hardware', 'People'];
    const priorities = ['Critical', 'High', 'Medium', 'Low'];

    const filtered = useMemo(() => assets.filter(a => {
        if (filterCategory !== 'all' && a.category !== filterCategory) return false;
        if (filterPriority !== 'all' && a.recovery_priority !== filterPriority) return false;
        if (search && !a.asset_id.toLowerCase().includes(search.toLowerCase()) &&
            !a.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [assets, filterCategory, filterPriority, search]);

    const countByCat = (cat: string) => assets.filter(a => a.category === cat).length;
    const criticalCount = assets.filter(a => a.recovery_priority === 'Critical').length;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Asset Register…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {/* Summary cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {categories.map(cat => {
                    const count = countByCat(cat);
                    const c = CATEGORY_COLORS[cat];
                    return (
                        <div key={cat} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
                            <div style={{ fontSize: '0.75em', fontWeight: 700, color: c.text, textTransform: 'uppercase' }}>{cat}</div>
                            <div style={{ fontSize: '1.8em', fontWeight: 700, color: c.text }}>{count}</div>
                        </div>
                    );
                })}
                <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5' }}>
                    <div style={{ fontSize: '0.75em', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' }}>Critical Recovery</div>
                    <div style={{ fontSize: '1.8em', fontWeight: 700, color: '#991b1b' }}>{criticalCount}</div>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input type="search" placeholder="Search ID or name…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em', minWidth: '180px' }} />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All recovery priorities</option>
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {assets.length} active assets
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Asset Name</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Category</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Classification</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Location</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Recovery</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => (
                            <tr key={a.asset_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '0.9em' }}>{a.asset_id}</td>
                                <td style={{ padding: '7px 12px', fontWeight: 500 }}>{a.name}</td>
                                <td style={{ padding: '7px 12px' }}><Badge label={a.category} colors={CATEGORY_COLORS} /></td>
                                <td style={{ padding: '7px 12px', color: '#6b7280' }}>{a.classification ?? '—'}</td>
                                <td style={{ padding: '7px 12px', color: '#374151' }}>{a.location}</td>
                                <td style={{ padding: '7px 12px' }}><Badge label={a.recovery_priority} colors={PRIORITY_COLORS} /></td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{a.owner}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No assets match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
