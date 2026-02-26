import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Delivery Is Deterministic State',
    description: (
      <>
        BlanketOps models software delivery as governed state progression —
        not pipelines, not scripts, not glued tools. Every stage transition is
        explicit, observable, and structurally enforced.
      </>
    ),
  },
  {
    title: 'Entropy Reduction by Design',
    description: (
      <>
        Each CRD transition constrains system possibility space. From
        GitHubEvent to ServiceUnit, uncertainty narrows. Velocity increases
        without structural decay.
      </>
    ),
  },
  {
    title: 'Governed Reconciliation',
    description: (
      <>
        Reconciliation is not blind patching. BlanketOps enforces stage
        contracts. If a transition violates structure, it fails visibly.
        Coerced reconciliation is eliminated.
      </>
    ),
  },
];

function Feature({ title, description, delay }: FeatureItem & { delay: number }) {
  return (
    <div
      className={clsx('col col--4', styles.featureWrapper)}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={clsx(styles.featureCard, 'text--center padding-horiz--lg')}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} delay={idx * 0.25} />
          ))}
        </div>
      </div>
    </section>
  );
}
