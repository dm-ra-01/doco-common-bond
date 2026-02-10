import React from 'react';

interface ControlStatusProps {
    status: string;
}

export const ControlStatus: React.FC<ControlStatusProps> = ({ status }) => {
    const statusConfig: Record<string, { label: string; class: string; icon: string }> = {
        'implemented': { label: 'Implemented', class: 'status-badge-green', icon: '✅' },
        'partial': { label: 'Partial', class: 'status-badge-yellow', icon: '⚠️' },
        'todo': { label: 'TODO', class: 'status-badge-red', icon: '📝' },
        'out-of-scope': { label: 'Out of Scope', class: 'status-badge-gray', icon: '🚫' },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig['todo'];

    return (
        <span className={`status-badge ${config.class}`} style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.8em',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: config.class === 'status-badge-green' ? '#dcfce7' : config.class === 'status-badge-yellow' ? '#fef9c3' : config.class === 'status-badge-red' ? '#fee2e2' : '#f3f4f6',
            color: config.class === 'status-badge-green' ? '#166534' : config.class === 'status-badge-yellow' ? '#854d0e' : config.class === 'status-badge-red' ? '#991b1b' : '#374151',
            border: `1px solid ${config.class === 'status-badge-green' ? '#bbf7d0' : config.class === 'status-badge-yellow' ? '#fef08a' : config.class === 'status-badge-red' ? '#fecaca' : '#e5e7eb'}`
        }}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

interface EvidenceLinkProps {
    label: string;
    url: string;
    type: 'git' | 'file' | 'link';
}

export const EvidenceLink: React.FC<EvidenceLinkProps> = ({ label, url, type }) => {
    const icons: Record<string, string> = {
        'git': '🎋',
        'file': '📄',
        'link': '🔗',
    };
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            fontSize: '0.9em',
            color: '#0891b2',
            marginRight: '10px'
        }}>
            {icons[type] || '🔗'} {label}
        </a>
    );
};
