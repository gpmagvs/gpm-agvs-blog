// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GPM 派車系統整合文件',
  tagline: 'AGV 派車、排程與 API 整合文件',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://gpmagvs.github.io',
  baseUrl: '/gpm-agvs-blog/',

  organizationName: 'gpm',
  projectName: 'gpm-agvs-blog',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          blogTitle: '更新履歷',
          blogDescription: 'AGVSystem 與 VMSystem 專案更新履歷',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'GPM 派車系統',
        logo: {
          alt: 'GPM 派車系統 Logo',
          src: 'img/GPM_Logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'mainSidebar',
            position: 'left',
            label: '文件',
          },
          {
            type: 'docSidebar',
            sidebarId: 'apiSidebar',
            position: 'left',
            label: 'API',
          },
          { to: '/blog', label: '更新履歷', position: 'left' },
          { to: '/docs/faq', label: '常見問題', position: 'left' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文件',
            items: [
              {
                label: '系統架構',
                to: '/docs/architecture/overview',
              },
              {
                label: 'API 概覽',
                to: '/docs/api/overview',
              },
              {
                label: '常見問題',
                to: '/docs/faq',
              },
            ],
          },
          {
            title: '更多',
            items: [
              {
                label: '更新履歷',
                to: '/blog',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} GPM AGV. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['json', 'bash'],
      },
    }),
};

export default config;
