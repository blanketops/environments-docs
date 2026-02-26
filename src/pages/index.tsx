import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
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

        <p
          className="hero__subtitle"
          style={{ maxWidth: '800px', margin: '1rem auto' }}
        >
          Deterministic Software Delivery for Kubernetes
        </p>

        <p style={{ fontSize: '1.1rem', opacity: 0.85 }}>
          Move code from IDE to production in minutes — with governed state
          progression and reduced entropy.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <p className="signal-text" style={{ fontSize: '1.1rem' }}>
            GitRepository → GitHubEvent → BuildTrigger → Build → Deploy → Route
            → ServiceUnit
          </p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link
            className="button button--primary button--lg"
            to="/docs/Model/state-machine"
            style={{ marginRight: '1rem' }}
          >
            Read the Model
          </Link>

          <Link
            className="button button--secondary button--lg"
            to="/docs/Getting Started/installation"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Deterministic Software Delivery for Kubernetes"
      description="BlanketOps Environments models software delivery as governed, deterministic state progression using structured CRDs."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />

        {/* Horizontal Mini-CR Flow Section */}
        <section
          style={{
            padding: '7rem 0',
            background: '#0f0f12',
            textAlign: 'center',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              {[
                'GitRepository',
                'GitHubEvent',
                'BuildTrigger',
                'Build',
                'Deploy',
                'Route',
                'ServiceUnit',
              ].map((item, idx, arr) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                  }}
                >
                  {/* Mini CR Card */}
                  <div
                    style={{
                      background: '#15161c',
                      borderRadius: '14px',
                      padding: '1.2rem 1.4rem',
                      border: '1px solid rgba(34, 211, 238, 0.25)',
                      minWidth: '180px',
                      boxShadow:
                        idx === arr.length - 1
                          ? '0 0 25px rgba(34, 211, 238, 0.15)'
                          : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.65rem',
                        opacity: 0.5,
                        marginBottom: '0.4rem',
                        letterSpacing: '0.08em',
                      }}
                    >
                      kind:
                    </div>

                    <div
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color:
                          idx === arr.length - 1
                            ? '#22d3ee'
                            : 'inherit',
                      }}
                    >
                      {item}
                    </div>
                  </div>

                  {/* Arrow */}
                  {idx !== arr.length - 1 && (
                    <div
                      style={{
                        fontSize: '1.2rem',
                        color: '#22d3ee',
                        opacity: 0.6,
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
