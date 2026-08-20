import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'BlanketOps Environments',
  tagline: 'Deterministic Software Delivery on Kubernetes',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://blanketopsenvironments.netlify.app/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'blanketops', // Usually your GitHub org/user name.
  projectName: 'environments-docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          editUrl: 'https://github.com/blanketops/environments-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/blanketops/environments-docs/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'BlanketOps Environments',
      logo: {
        alt: 'BlanketOps Environments Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'modelSidebar',
          label: 'Model',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'whySidebar',
          label: 'Why',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'conceptsSidebar',
          label: 'Concepts',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'Roadmap',
          label: 'Roadmap',
          position: 'left',
        },
        {
          href: 'https://github.com/blanketops/environments-cli',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Project',
          items: [
            {
              href: 'https://github.com/blanketops/environments-cli',
              label: 'GitHub',
            },
          ],
        },
        {
          title: 'Roadmap',
          items: [
            {
              label: 'Roadmap',
              to: '/docs/Roadmap',
            },
          ],
        },
        {
          // Generated Go package docs (gomarkdoc) live in each repo's own
          // docs/code/ on GitHub rather than on this site — see
          // .github/workflows/code-docs.yml in each repo.
          title: 'Code Reference',
          items: [
            {
              label: 'environments',
              href: 'https://github.com/blanketops/environments/tree/main/docs/code',
            },
            {
              label: 'environments-controller',
              href: 'https://github.com/blanketops/environments-controller/tree/main/docs/code',
            },
            {
              label: 'environments-api',
              href: 'https://github.com/blanketops/environments-api/tree/main/docs/code',
            },
            {
              label: 'environments-cli',
              href: 'https://github.com/blanketops/environments-cli/tree/main/docs/code',
            },
            {
              label: 'environments-docs',
              href: 'https://github.com/blanketops/environments-docs/tree/main/docs/code',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} BlanketOps Environments. Deterministic Software Delivery.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
