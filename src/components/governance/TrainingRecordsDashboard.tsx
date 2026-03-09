/**
 * TrainingRecordsDashboard
 *
 * Live dashboard for public.training_records — ISMS training events.
 * ISO 27001 Clause 7.2 competency evidence.
 * Replaces the static Markdown competency matrix in training-records.md.
 * Wrapped in <GovernanceAuthGate> on the MDX page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface TrainingRecord {
    id: number;
    staff_id: string;
    staff_name: string;
    training_module: string;
    completed_date: string;
    expiry_date: string | null;
    evidence_url: string | null;
    owner: string;
}

function expiryStatus(expiry: string | null): 'expired' | 'expiring' | 'valid' | 'none' {
    if (!expiry) return 'none';
    const d = new Date(expiry);
    const now = new Date();
    const in90 = new Date(now);
    in90.setDate(in90.getDate() + 90);
    if (d < now) return 'expired';
    if (d < in90) return 'expiring';
    return 'valid';
}

function ExpiryBadge({ expiry }: { expiry: string | null }) {
    const s = expiryStatus(expiry);
    const styles: Record<string, React.CSSProperties> = {
        expired: { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
        expiring: { backgroundColor: '#fff7ed', color: '#9a3412', border: '1px solid #fdba74' },
        valid: { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
        none: { backgroundColor: '#f3f4f6', color: '#9ca3af', border: '1px solid #e5e7eb' },
    };
    const labels = { expired: `⚠️ ${expiry}`, expiring: `🔔 ${expiry}`, valid: expiry!, none: '—' };
    return (
        <span style={{
            padding: '2px 8px', borderRadius: '10px', fontSize: '0.75em', fontWeight: 600,
            whiteSpace: 'nowrap', ...styles[s]
        }}>
            {labels[s]}
        </span>
    );
}

function resolveUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url;
    return '/' + url;
}

export function TrainingRecordsDashboard() {
    const supabase = useSupabaseClient();
    const [records, setRecords] = useState<TrainingRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStaff, setFilterStaff] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!supabase) { setError('Supabase client not configured.'); setLoading(false); return; }
        supabase
            .from('training_records')
            .select('id,staff_id,staff_name,training_module,completed_date,expiry_date,evidence_url,owner')
            .is('archived_at', null)
            .order('staff_id')
            .order('completed_date', { ascending: false })
            .then(({ data, error: e }) => {
                if (e) { setError(e.message); } else { setRecords(data as TrainingRecord[]); }
                setLoading(false);
            });
    }, [supabase]);

    const staffNames = useMemo(() => [...new Set(records.map(r => r.staff_name))].sort(), [records]);

    const filtered = useMemo(() => records.filter(r => {
        if (filterStaff !== 'all' && r.staff_name !== filterStaff) return false;
        if (search && !r.staff_name.toLowerCase().includes(search.toLowerCase()) &&
            !r.training_module.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [records, filterStaff, search]);

    const expiredCount = records.filter(r => expiryStatus(r.expiry_date) === 'expired').length;
    const expiringCount = records.filter(r => expiryStatus(r.expiry_date) === 'expiring').length;

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading Training Records…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            {expiredCount > 0 && (
                <div style={{
                    padding: '12px 16px', marginBottom: '12px', borderRadius: '8px',
                    backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b'
                }}>
                    ⚠️ <strong>{expiredCount} training record{expiredCount === 1 ? '' : 's'}</strong> have expired and require renewal.
                </div>
            )}
            {expiringCount > 0 && (
                <div style={{
                    padding: '12px 16px', marginBottom: '16px', borderRadius: '8px',
                    backgroundColor: '#fff7ed', border: '1px solid #fdba74', color: '#9a3412'
                }}>
                    🔔 <strong>{expiringCount} training record{expiringCount === 1 ? '' : 's'}</strong> expire within the next 90 days.
                </div>
            )}

            {/* Summary cards per staff */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {staffNames.map(name => {
                    const count = records.filter(r => r.staff_name === name).length;
                    const hasExpired = records.some(r => r.staff_name === name && expiryStatus(r.expiry_date) === 'expired');
                    const bg = hasExpired ? '#fee2e2' : '#f3f4f6';
                    const border = hasExpired ? '#fca5a5' : '#e5e7eb';
                    const text = hasExpired ? '#991b1b' : '#374151';
                    return (
                        <div key={name} style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: bg, border: `1px solid ${border}` }}>
                            <div style={{ fontSize: '0.75em', fontWeight: 700, color: text }}>{name}</div>
                            <div style={{ fontSize: '1.8em', fontWeight: 700, color: text }}>{count}</div>
                            <div style={{ fontSize: '0.75em', color: text }}>training events</div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input type="search" placeholder="Search staff or module…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em', minWidth: '200px' }} />
                <select value={filterStaff} onChange={e => setFilterStaff(e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.9em' }}>
                    <option value="all">All staff</option>
                    {staffNames.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>

            <p style={{ color: '#6b7280', fontSize: '0.85em', marginBottom: '8px' }}>
                Showing {filtered.length} of {records.length} training events
            </p>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Staff</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Training Module</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Completed</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Expiry</th>
                            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Evidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 12px', fontWeight: 500 }}>{r.staff_name}</td>
                                <td style={{ padding: '7px 12px', fontFamily: 'monospace', fontSize: '0.9em', color: '#6b7280' }}>{r.staff_id}</td>
                                <td style={{ padding: '7px 12px' }}>{r.training_module}</td>
                                <td style={{ padding: '7px 12px', color: '#6b7280', whiteSpace: 'nowrap' }}>{r.completed_date}</td>
                                <td style={{ padding: '7px 12px' }}><ExpiryBadge expiry={r.expiry_date} /></td>
                                <td style={{ padding: '7px 12px' }}>
                                    {r.evidence_url
                                        ? <a href={resolveUrl(r.evidence_url)} target="_blank" rel="noopener noreferrer"
                                            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>📎 View</a>
                                        : <span style={{ color: '#9ca3af' }}>—</span>}
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>No training records match the selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
