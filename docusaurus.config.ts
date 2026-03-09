import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Common Bond Corporate',
  tagline: 'Strategy, Governance, and Compliance for the Common Bond ecosystem.',
  favicon: 'img/common-bond-mark.svg',

  url: 'https://docs.commonbond.au',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'dm-ra-01',
  projectName: 'doco-common-bond',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/dm-ra-01/doco-common-bond/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/common-bond-mark.svg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Common Bond',
      logo: {
        alt: 'Common Bond Logo',
        src: 'img/common-bond-mark.svg',
      },
      items: [
        {
          type: 'dropdown',
          label: 'Business',
          position: 'left',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'strategySidebar',
              label: 'Strategy',
            },
            {
              type: 'docSidebar',
              sidebarId: 'operationsSidebar',
              label: 'Operations',
            },
            {
              type: 'docSidebar',
              sidebarId: 'governanceSidebar',
              label: 'Governance',
            },
            {
              type: 'docSidebar',
              sidebarId: 'complianceSidebar',
              label: 'Compliance',
            },
            {
              type: 'docSidebar',
              sidebarId: 'registersSidebar',
              label: 'Registers',
            },
          ],
        },
        {
          type: 'dropdown',
          label: 'Engineering',
          position: 'left',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'engineeringSidebar',
              label: 'Standards',
            },
            {
              type: 'docSidebar',
              sidebarId: 'productSidebar',
              label: 'Product',
            },
            {
              type: 'docSidebar',
              sidebarId: 'auditsSidebar',
              label: 'Audits',
            },
          ],
        },
        { to: '/knowledge-graph', label: '🧠 Map', position: 'right' },
        {
          href: 'https://github.com/dm-ra-01/doco-common-bond',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation Ecosystem',
          items: [
            {
              label: 'Receptor Ecosystem',
              href: 'https://docs.commonbond.au/receptor',
            },
            {
              label: 'Rotator Legacy Archive',
              href: 'https://docs.commonbond.au/rotator',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Common Bond. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
