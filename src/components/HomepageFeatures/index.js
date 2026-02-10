import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Fairness & Transparency',
    img: 'img/feature-fairness.png',
    description: (
      <>
        Receptor ensures every worker match is based on clear, pre-defined rules,
        eliminating bias and maximizing overall satisfaction across the workforce.
      </>
    ),
  },
  {
    title: 'Automated Allocation',
    img: 'img/feature-allocation.png',
    description: (
      <>
        Our Python-powered matching algorithm handles thousands of data points
        instantly, creating efficient job rotation schedules in seconds.
      </>
    ),
  },
  {
    title: 'Secure Infrastructure',
    img: 'img/feature-secure.png',
    description: (
      <>
        We provide
        robust data protection tailored to the needs of the healthcare and education industries.
      </>
    ),
  },
];

const SectionList = [
  {
    emoji: '🎯',
    title: 'Strategy',
    description: 'Vision, market analysis & EOS operating rhythms.',
    href: '/docs/business-planning/',
  },
  {
    emoji: '🚀',
    title: 'Projects',
    description: 'Active development initiatives & migration tracking.',
    href: '/docs/projects/overview',
  },
  {
    emoji: '📱',
    title: 'Product',
    description: 'Architecture, frontend apps & backend APIs.',
    href: '/docs/app-documentation/architecture',
  },
  {
    emoji: '🔧',
    title: 'Infrastructure',
    description: 'Self-hosted setup, database schema & CI/CD.',
    href: '/docs/infrastructure/development-workspace',
  },
  {
    emoji: '⚖️',
    title: 'Governance',
    description: 'Decision rights, risk management & ethics.',
    href: '/docs/governance-and-legal/',
  },
  {
    emoji: '🛡️',
    title: 'Compliance',
    description: 'ISO 27001 controls & statement of applicability.',
    href: '/docs/compliance/iso27001/',
  },
];

function Feature({ title, description, img }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="card padding--lg margin-bottom--lg" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '120px', height: '120px', marginBottom: '1.5rem', overflow: 'hidden', borderRadius: '12px' }}>
          <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ emoji, title, description, href }) {
  return (
    <div className="col col--4">
      <Link to={href} className={styles.cardLink}>
        <div className={styles.sectionCard}>
          <span className={styles.cardEmoji}>{emoji}</span>
          <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
          <p className={styles.cardDescription}>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
      <section className={styles.sections}>
        <div className="container">
          <Heading as="h2" className={styles.sectionHeading}>
            Documentation
          </Heading>
          <div className="row">
            {SectionList.map((props, idx) => (
              <SectionCard key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
