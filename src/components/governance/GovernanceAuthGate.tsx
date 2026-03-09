/**
 * GovernanceAuthGate
 *
 * SEC-01: Wraps all governance register components. Renders a
 * polished email/password login form when no authenticated session
 * exists. If session exists but user lacks app_metadata.role = 'management',
 * renders an access-denied message.
 *
 * Uses Supabase Auth email/password; Google OAuth integration is planned.
 */
import React, { ReactNode, useState } from 'react';
import { signIn, signOut, useSession, useSupabaseClient } from '../../lib/supabase';
import styles from './GovernanceAuthGate.module.css';

interface Props {
    children: ReactNode;
}

export default function GovernanceAuthGate({ children }: Props) {
    const client = useSupabaseClient();
    const session = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Client not yet initialised (credentials missing in env)
    if (!client) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.icon}>⚙️</div>
                    <h2>Configuration Required</h2>
                    <p>Supabase credentials are not configured. Set <code>SUPABASE_URL</code> and <code>SUPABASE_PUBLISHABLE_KEY</code> in Cloudflare Pages environment variables.</p>
                </div>
            </div>
        );
    }

    // No session → show login form
    if (!session) {
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            const err = await signIn(client, email, password);
            if (err) setError(err);
            setLoading(false);
        };

        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.icon}>🔐</div>
                    <h2>Governance Portal</h2>
                    <p className={styles.subtitle}>Sign in to access ISMS registers and compliance data.</p>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <label htmlFor="gov-email">Email</label>
                        <input
                            id="gov-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="you@example.com"
                        />
                        <label htmlFor="gov-password">Password</label>
                        <input
                            id="gov-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="••••••••"
                        />
                        {error && <p className={styles.error}>{error}</p>}
                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                    <p className={styles.hint}>Google sign-in coming soon.</p>
                </div>
            </div>
        );
    }

    // Session exists — check management role
    const role = (session.user.app_metadata as Record<string, string>)?.role;
    if (role !== 'management') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.icon}>🚫</div>
                    <h2>Access Restricted</h2>
                    <p>Your account (<strong>{session.user.email}</strong>) does not have the <code>management</code> role required to access this register.</p>
                    <p>Contact the system administrator if you believe this is an error.</p>
                    <button className={styles.button} onClick={() => signOut(client)}>Sign Out</button>
                </div>
            </div>
        );
    }

    // Authenticated management user — render the governance content
    return (
        <>
            <div className={styles.sessionBar}>
                <span>Signed in as <strong>{session.user.email}</strong></span>
                <button className={styles.signOutBtn} onClick={() => signOut(client)}>Sign out</button>
            </div>
            {children}
        </>
    );
}
