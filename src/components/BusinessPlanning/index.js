import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';

export function FrameworkCard({ title, description, icon, href, children }) {
    return (
        <div className="card margin-bottom--lg shadow--md" style={{ height: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--ifm-color-emphasis-200)' }}>
            <div className="card__header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                {icon && <span style={{ fontSize: '2rem' }}>{icon}</span>}
                <Heading as="h3" style={{ margin: 0 }}>{title}</Heading>
            </div>
            <div className="card__body">
                {description && <p>{description}</p>}
                {children}
            </div>
            {href && (
                <div className="card__footer">
                    <a href={href} className="button button--primary button--block">Learn More</a>
                </div>
            )}
        </div>
    );
}

export function MatrixGrid({ children, columns = 2 }) {
    return (
        <div className="row">
            {React.Children.map(children, (child) => (
                <div className={clsx('col', `col--${12 / columns}`, 'margin-bottom--md')}>
                    {child}
                </div>
            ))}
        </div>
    );
}

export function StrategicPillar({ title, outcome, icon }) {
    return (
        <div className="padding--md text--center" style={{ border: '2px dashed var(--ifm-color-primary)', borderRadius: '16px', height: '100%' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{icon}</div>
            <Heading as="h4">{title}</Heading>
            <div className="badge badge--success" style={{ fontSize: '1rem' }}>{outcome}</div>
        </div>
    );
}
