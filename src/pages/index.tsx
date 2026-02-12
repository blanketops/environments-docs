import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container text--center">
        <Heading as="h1" className="hero__title">
          BlanketOps Environments
        </Heading>

        <p className="hero__subtitle" style={{ maxWidth: '800px', margin: '1rem auto' }}>
          Deterministic Software Delivery for Kubernetes
        </p>

        <p style={{ fontSize: '1.1rem', opacity: 0.85 }}>
          Move code from IDE to production in minutes — with governed state
          progression and reduced entropy.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <p className="signal-text" style={{ fontSize: '1.1rem' }}>
            GitRepository → GitHubEvent → BuildTrigger → Build → Deploy → Route → ServiceUnit
          </p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link
            className="button button--primary button--lg"
            to="/docs/model/state-machine"
            style={{ marginRight: '1rem' }}
          >
            Read the Model
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/installation"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Deterministic Software Delivery for Kubernetes"
      description="BlanketOps Environments models software delivery as governed, deterministic state progression using structured CRDs.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
