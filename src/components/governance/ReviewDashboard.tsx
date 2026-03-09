/**
 * ReviewDashboard
 *
 * REC-04 / ALERT-01 — Shows outstanding review alerts from public.review_alerts.
 * Fetches active (undismissed) alerts for all 10 governance tables.
 */
import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface ReviewAlert {
    id: number;
    table_name: string;
    record_id: string;
    review_due_date: string;
    alerted_at: string;
    dismissed: boolean;
}

const TABLE_LABELS: Record<string, string> = {
    audits: 'Audit Registry',
    risks: 'Risk Register',
    nonconformities: 'NC Log',
    corrective_actions: 'Corrective Actions',
    suppliers: 'Supplier Register',
    assets: 'Asset Register',
    training_records: 'Training Records',
    standards: 'Standards Register',
    registers: 'Register of Registers',
    review_alerts: 'Review Alerts',
    soa_controls: 'SoA Controls',
};

function daysUntil(dateStr: string): number {
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

export function ReviewDashboard() {
    const supabase = useSupabaseClient();
    const [alerts, setAlerts] = useState<ReviewAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!supabase) {
            setError('Supabase client not configured.');
            setLoading(false);
            return;
        }
        supabase
            .from('review_alerts')
            .select('*')
            .eq('dismissed', false)
            .order('review_due_date')
            .then(({ data, error: e }) => {
                if (e) setError(e.message); else setAlerts(data as ReviewAlert[]);
                setLoading(false);
            });
    }, [supabase]);

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading review alerts…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    const overdue = alerts.filter(a => daysUntil(a.review_due_date) < 0);
    const dueSoon = alerts.filter(a => daysUntil(a.review_due_date) >= 0 && daysUntil(a.review_due_date) <= 7);
    const upcoming = alerts.filter(a => daysUntil(a.review_due_date) > 7);

    const Section = ({ title, items, color }: { title: string; items: ReviewAlert[]; color: string }) => {
        if (items.length === 0) return null;
        return (
            <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color, marginBottom: '8px' }}>{title} ({items.length})</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '6px 10px' }}>Register</th>
                            <th style={{ textAlign: 'left', padding: '6px 10px' }}>Record</th>
                            <th style={{ textAlign: 'left', padding: '6px 10px' }}>Due Date</th>
                            <th style={{ textAlign: 'left', padding: '6px 10px' }}>Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(a => {
                            const days = daysUntil(a.review_due_date);
                            return (
                                <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '6px 10px' }}>{TABLE_LABELS[a.table_name] ?? a.table_name}</td>
                                    <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{a.record_id}</td>
                                    <td style={{ padding: '6px 10px' }}>{a.review_due_date}</td>
                                    <td style={{ padding: '6px 10px', fontWeight: 600, color }}>
                                        {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d`}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    if (alerts.length === 0) {
        return (
            <div style={{ padding: '20px', color: '#166534', border: '1px solid #86efac', borderRadius: '8px', backgroundColor: '#dcfce7' }}>
                ✅ No outstanding review alerts. All governance records are up to date.
            </div>
        );
    }

    return (
        <div style={{ marginTop: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9em' }}>
                {alerts.length} alert{alerts.length !== 1 ? 's' : ''} pending review · Generated daily at 08:00 AEST by pg_cron
            </p>
            <Section title="🔴 Overdue" items={overdue} color="#991b1b" />
            <Section title="🟠 Due within 7 days" items={dueSoon} color="#9a3412" />
            <Section title="🟡 Upcoming (8–30 days)" items={upcoming} color="#854d0e" />
        </div>
    );
}
