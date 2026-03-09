/**
 * Supabase client for supabase-common-bond.
 *
 * Credentials are injected at build-time via Docusaurus customFields
 * (set as environment variables in Cloudflare Pages or .env.local).
 *
 * REC-01, REC-18, REC-20, REC-24: Used by all governance register
 * React components for client-side data fetching.
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { useRef } from 'react';

// Keep a module-level singleton so the client is shared across components
// that call this hook in the same page render tree.
let _client: SupabaseClient | null = null;

export function useSupabaseClient(): SupabaseClient | null {
    const { siteConfig } = useDocusaurusContext();
    const ref = useRef<SupabaseClient | null>(null);

    const url = siteConfig.customFields?.supabaseUrl as string | undefined;
    const key = siteConfig.customFields?.supabasePublishableKey as string | undefined;

    if (!url || !key) {
        return null;
    }

    // Reuse the singleton across renders
    if (!_client) {
        _client = createClient(url, key);
    }
    ref.current = _client;
    return ref.current;
}
