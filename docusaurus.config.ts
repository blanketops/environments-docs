import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
    alt: 'BlanketOps Logo',
    src: 'img/logo.svg', // replace later with your own logo
  },
  items: [
    {
      type: 'docSidebar',
      sidebarId: 'tutorialSidebar',
      position: 'left',
      label: 'Docs',
    },
    {
      to: '/docs/model/state-machine',
      label: 'Model',
      position: 'left',
    },
    {
      to: '/docs/why/delivery-drifts',
      label: 'Why',
      position: 'left',
    },
    {
      href: 'https://github.com/ntlaletsi70/blanketops-environments',
      label: 'GitHub',
      position: 'right',
    },
  ],
},
footer: {
  style: 'dark',
  links: [
    {
      title: 'Platform',
      items: [
        {
          label: 'Model',
          to: '/docs/model/state-machine',
        },
        {
          label: 'Why Delivery Drifts',
          to: '/docs/why/delivery-drifts',
        },
        {
          label: 'Concepts',
          to: '/docs/concepts/serviceunit',
        },
      ],
    },
    {
      title: 'Project',
      items: [
        {
          label: 'GitHub',
          href: 'https://github.com/ntlaletsi70/blanketops-environments',
        },
      ],
    },
    {
      title: 'Community',
      items: [
        {
          label: 'Roadmap',
          to: '/docs/roadmap',
        },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} BlanketOps. Deterministic Software Delivery.`,
},

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
