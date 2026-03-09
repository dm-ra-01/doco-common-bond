/**
 * Supabase client for supabase-common-bond.
 *
 * Credentials are injected at build-time via Docusaurus customFields
 * (set as environment variables in Cloudflare Pages or .env.local).
 *
 * REC-01, REC-18, REC-20, REC-24: Used by all governance register
 * React components for client-side data fetching.
 *
 * SEC-01: All data access requires authenticated session with
 * app_metadata.role = 'management' (enforced at Supabase RLS layer).
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';

// Module-level singleton — shared across all components in the same page.
let _client: SupabaseClient | null = null;

function getClient(url: string, key: string): SupabaseClient {
    if (!_client) {
        _client = createClient(url, key);
    }
    return _client;
}

/** Returns the singleton Supabase client, or null if credentials are absent. */
export function useSupabaseClient(): SupabaseClient | null {
    const { siteConfig } = useDocusaurusContext();
    const ref = useRef<SupabaseClient | null>(null);

    const url = siteConfig.customFields?.supabaseUrl as string | undefined;
    const key = siteConfig.customFields?.supabasePublishableKey as string | undefined;

    if (!url || !key) return null;
    ref.current = getClient(url, key);
    return ref.current;
}

/** Returns the current Auth session (null = unauthenticated). Subscribes to auth state changes. */
export function useSession(): Session | null {
    const client = useSupabaseClient();
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        if (!client) return;

        // Load existing session immediately
        client.auth.getSession().then(({ data }) => setSession(data.session));

        // Subscribe to future auth state changes
        const { data: { subscription } } = client.auth.onAuthStateChange((_event, s) => {
            setSession(s);
        });

        return () => subscription.unsubscribe();
    }, [client]);

    return session;
}

/** Sign in with email + password. Returns error string on failure, null on success. */
export async function signIn(
    client: SupabaseClient,
    email: string,
    password: string,
): Promise<string | null> {
    const { error } = await client.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
}

/** Sign out and clear the singleton client so auth state resets. */
export async function signOut(client: SupabaseClient): Promise<void> {
    await client.auth.signOut();
    _client = null;
}

