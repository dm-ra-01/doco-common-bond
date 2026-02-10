import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const SECTIONS = [
  {
    emoji: '📊',
    title: 'Strategy & Vision',
    description: 'V/TO, strategic architecture evaluation, market analysis, and growth roadmap.',
    link: '/docs/business-planning/strategy-vision/vto',
  },
  {
    emoji: '🏷️',
    title: 'Brand & Product',
    description: 'Brand identity, naming conventions, service catalog, and product definition.',
    link: '/docs/business-planning/brand/',
  },
  {
    emoji: '📈',
    title: 'Market & Sales',
    description: 'Portfolio analysis, go-to-market strategy, and competitive positioning.',
    link: '/docs/business-planning/market-sales/portfolio-analysis',
  },
  {
    emoji: '⚖️',
    title: 'Governance & Legal',
    description: 'ASIC registration, ABN status, corporate structure, and foundational agreements.',
    link: '/docs/governance-and-legal/',
  },
  {
    emoji: '🛡️',
    title: 'ISO 27001 Compliance',
    description: 'Information security clauses, organizational and technological controls.',
    link: '/docs/compliance/iso27001/clauses/',
  },
  {
    emoji: '💼',
    title: 'Financial Planning',
    description: 'Revenue modelling, pricing strategy, and financial projections.',
    link: '/docs/business-planning/financial/',
  },
  {
    emoji: '🧠',
    title: 'Knowledge Map',
    description: 'Interactive graph of all corporate documentation and their relationships.',
    link: '/knowledge-graph',
  },
];

const SIBLINGS = [
  { label: 'Receptor Ecosystem', href: 'https://docs.commonbond.au/receptor/', emoji: '⚙️' },
  { label: 'Rotator Legacy Archive', href: 'https://docs.commonbond.au/rotator/', emoji: '📜' },
];

function HeroSection() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.heroActions}>
          <Link className={styles.heroPrimary} to="/docs/intro">
            Get Started
          </Link>
          <Link className={styles.heroSecondary} to="/knowledge-graph">
            🧠 Knowledge Map
          </Link>
        </div>
      </div>
    </header>
  );
}

function SectionCard({ emoji, title, description, link }: typeof SECTIONS[0]) {
  return (
    <Link to={link} className={styles.sectionCard}>
      <span className={styles.cardEmoji}>{emoji}</span>
      <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Strategy, governance, and compliance documentation for Common Bond.">
      <HeroSection />
      <main className={styles.main}>
        <section className={styles.grid}>
          {SECTIONS.map((section) => (
            <SectionCard key={section.title} {...section} />
          ))}
        </section>

        <section className={styles.siblings}>
          <Heading as="h2" className={styles.siblingsTitle}>Other Documentation Sites</Heading>
          <div className={styles.siblingLinks}>
            {SIBLINGS.map((s) => (
              <a key={s.label} href={s.href} className={styles.siblingCard}>
                <span className={styles.cardEmoji}>{s.emoji}</span>
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
