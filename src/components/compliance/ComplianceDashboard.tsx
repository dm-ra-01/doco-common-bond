import React from 'react';
import { ControlStatus } from './ComplianceComponents';

export const ComplianceDashboard = () => {
    const stats = {
        clauses: { implemented: 7, partial: 4, todo: 4, total: 15 },
        controls: { implemented: 42, partial: 18, todo: 32, oos: 1, total: 93 },
    };

    const calculatePercent = (val: number, total: number) => Math.round((val / total) * 100);

    return (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <h3 style={{ marginTop: 0 }}>ISMS Clauses (4-10)</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <ControlStatus status="implemented" /> {calculatePercent(stats.clauses.implemented, stats.clauses.total)}%
                    <ControlStatus status="partial" /> {calculatePercent(stats.clauses.partial, stats.clauses.total)}%
                    <ControlStatus status="todo" /> {calculatePercent(stats.clauses.todo, stats.clauses.total)}%
                </div>
                <div style={{ height: '12px', width: '100%', backgroundColor: '#e5e7eb', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', width: `${calculatePercent(stats.clauses.implemented, stats.clauses.total)}%`, backgroundColor: '#22c55e' }}></div>
                    <div style={{ height: '100%', width: `${calculatePercent(stats.clauses.partial, stats.clauses.total)}%`, backgroundColor: '#eab308' }}></div>
                    <div style={{ height: '100%', width: `${calculatePercent(stats.clauses.todo, stats.clauses.total)}%`, backgroundColor: '#ef4444' }}></div>
                </div>
            </div>

            <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <h3 style={{ marginTop: 0 }}>Annex A Controls (93)</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <ControlStatus status="implemented" /> {calculatePercent(stats.controls.implemented, stats.controls.total)}%
                    <ControlStatus status="partial" /> {calculatePercent(stats.controls.partial, stats.controls.total)}%
                    <ControlStatus status="todo" /> {calculatePercent(stats.controls.todo, stats.controls.total)}%
                    <ControlStatus status="out-of-scope" /> {calculatePercent(stats.controls.oos, stats.controls.total)}%
                </div>
                <div style={{ height: '12px', width: '100%', backgroundColor: '#e5e7eb', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', width: `${calculatePercent(stats.controls.implemented, stats.controls.total)}%`, backgroundColor: '#22c55e' }}></div>
                    <div style={{ height: '100%', width: `${calculatePercent(stats.controls.partial, stats.controls.total)}%`, backgroundColor: '#eab308' }}></div>
                    <div style={{ height: '100%', width: `${calculatePercent(stats.controls.todo, stats.controls.total)}%`, backgroundColor: '#ef4444' }}></div>
                    <div style={{ height: '100%', width: `${calculatePercent(stats.controls.oos, stats.controls.total)}%`, backgroundColor: '#9ca3af' }}></div>
                </div>
            </div>
        </div>
    );
};
