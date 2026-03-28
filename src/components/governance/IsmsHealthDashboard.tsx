/**
 * IsmsHealthDashboard
 *
 * REC-20 / MONITOR-01 — ISO 27001 Clause 9.1 ISMS health KPI cards.
 * Fetches from the four v_* views in supabase-common-bond and renders
 * live metric cards for the /docs/registers/isms-health page.
 */
import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '../../lib/supabase';

interface RiskCoverage {
    total_risks: number;
    ongoing: number;
    closed: number;
    transferred: number;
    planned: number;
    accepted: number;
    critical_count: number;
    high_count: number;
    treatment_coverage_pct: number | null;
}

interface SoaCompletion {
    total_controls: number;
    applicable_count: number;
    implemented_count: number;
    partial_count: number;
    completion_pct: number | null;
    partial_completion_pct: number | null;
}

interface SupplierDpa {
    total_suppliers: number;
    dpa_executed: number;
    dpa_pending: number;
    dpa_execution_pct: number | null;
}

interface NcClosure {
    total_ncs: number;
    ncs_closed: number;
    ncs_open: number;
    total_cas: number;
    cas_closed: number;
    nc_closure_pct: number | null;
    ca_closure_pct: number | null;
}

function KpiCard({
    title,
    value,
    unit,
    detail,
    color,
}: {
    title: string;
    value: string | number | null;
    unit?: string;
    detail?: string;
    color: 'green' | 'yellow' | 'red' | 'blue';
}) {
    const colors = {
        green: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
        yellow: { bg: '#fef9c3', border: '#fde047', text: '#854d0e' },
        red: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
        blue: { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
    };
    const c = colors[color];
    return (
        <div style={{
            border: `1px solid ${c.border}`,
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: c.bg,
            flex: '1 1 200px',
            minWidth: '180px',
        }}>
            <div style={{ fontSize: '0.8em', fontWeight: 600, color: c.text, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
            <div style={{ fontSize: '2.2em', fontWeight: 700, color: c.text, lineHeight: 1 }}>
                {value ?? '—'}{unit && <span style={{ fontSize: '0.5em', marginLeft: '2px' }}>{unit}</span>}
            </div>
            {detail && <div style={{ fontSize: '0.8em', color: c.text, marginTop: '6px', opacity: 0.8 }}>{detail}</div>}
        </div>
    );
}

export function IsmsHealthDashboard() {
    const supabase = useSupabaseClient();
    const [risk, setRisk] = useState<RiskCoverage | null>(null);
    const [soa, setSoa] = useState<SoaCompletion | null>(null);
    const [dpa, setDpa] = useState<SupplierDpa | null>(null);
    const [nc, setNc] = useState<NcClosure | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!supabase) {
            setError('Supabase client not configured. Set SUPABASE_PUBLISHABLE_KEY environment variable.');
            setLoading(false);
            return;
        }
        async function load() {
            try {
                const { data, error: rpcError } = await supabase.rpc('rpc_get_isms_health_metrics');
                if (rpcError) throw rpcError;

                setRisk(data.risk as RiskCoverage);
                setSoa(data.soa as SoaCompletion);
                setDpa(data.dpa as SupplierDpa);
                setNc(data.nc as NcClosure);
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [supabase]);

    if (loading) return <div style={{ padding: '20px', color: '#6b7280' }}>Loading ISMS health metrics…</div>;
    if (error) return <div style={{ padding: '20px', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fee2e2' }}>⚠️ {error}</div>;

    const riskColor = (risk?.treatment_coverage_pct ?? 0) >= 80 ? 'green' : (risk?.treatment_coverage_pct ?? 0) >= 60 ? 'yellow' : 'red';
    const soaColor = (soa?.completion_pct ?? 0) >= 80 ? 'green' : (soa?.completion_pct ?? 0) >= 50 ? 'yellow' : 'red';
    const dpaColor = (dpa?.dpa_execution_pct ?? 0) >= 100 ? 'green' : (dpa?.dpa_execution_pct ?? 0) >= 80 ? 'yellow' : 'red';
    const ncColor = (nc?.nc_closure_pct ?? 0) >= 80 ? 'green' : (nc?.nc_closure_pct ?? 0) >= 50 ? 'yellow' : 'red';

    return (
        <div style={{ marginTop: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.9em', marginBottom: '20px' }}>
                Live data from <code>supabase-common-bond</code> · ISO 27001 Clause 9.1 · Last refreshed: {new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })} AEST
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <KpiCard
                    title="Risk Treatment Coverage"
                    value={risk?.treatment_coverage_pct}
                    unit="%"
                    detail={`${risk?.ongoing ?? 0} ongoing · ${risk?.critical_count ?? 0} critical`}
                    color={riskColor as 'green' | 'yellow' | 'red'}
                />
                <KpiCard
                    title="SoA Completion"
                    value={soa?.completion_pct}
                    unit="%"
                    detail={`${soa?.implemented_count ?? 0} / ${soa?.applicable_count ?? 0} applicable controls`}
                    color={soaColor as 'green' | 'yellow' | 'red'}
                />
                <KpiCard
                    title="DPA Execution Rate"
                    value={dpa?.dpa_execution_pct}
                    unit="%"
                    detail={`${dpa?.dpa_executed ?? 0} executed · ${dpa?.dpa_pending ?? 0} pending`}
                    color={dpaColor as 'green' | 'yellow' | 'red'}
                />
                <KpiCard
                    title="NC Closure Rate"
                    value={nc?.nc_closure_pct}
                    unit="%"
                    detail={`${nc?.ncs_open ?? 0} open · CA rate ${nc?.ca_closure_pct ?? 0}%`}
                    color={ncColor as 'green' | 'yellow' | 'red'}
                />
            </div>

            <details style={{ fontSize: '0.85em', color: '#6b7280' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Raw metric detail</summary>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '0.9em' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ textAlign: 'left', padding: '6px 12px' }}>Metric</th>
                            <th style={{ textAlign: 'right', padding: '6px 12px' }}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['Total risks (active)', risk?.total_risks],
                            ['Risks: Critical / High', `${risk?.critical_count} / ${risk?.high_count}`],
                            ['SoA: Total controls', soa?.total_controls],
                            ['SoA: Partial completion %', `${soa?.partial_completion_pct}%`],
                            ['Suppliers total', dpa?.total_suppliers],
                            ['NCs: total / closed', `${nc?.total_ncs} / ${nc?.ncs_closed}`],
                            ['CAs: total / closed', `${nc?.total_cas} / ${nc?.cas_closed}`],
                        ].map(([label, val]) => (
                            <tr key={String(label)} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '6px 12px' }}>{label}</td>
                                <td style={{ padding: '6px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{String(val ?? '—')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </div>
    );
}
