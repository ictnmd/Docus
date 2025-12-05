// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
//chỉnh phần trên nội dung, tiêu đề web
const config = {
  title: "Chem4HighSchool",
  tagline: "Hoá học THPT",
  favicon: "https://raw.githubusercontent.com/NCThanh1109/KHKT/main/dk.png",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://docus-5pu.pages.dev",
  baseUrl: "/",
  organizationName: "NCThanh1109",
  projectName: "Docus",
  deploymentBranch: "main",
  onBrokenLinks: "throw",
  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "test:content",
      },
    },
  ],
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // say want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeMathjax],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      colorMode: {
        respectPrefersColorScheme: true,
      },

      //chỉnh sidebar trên
      navbar: {
        title: "Chem4HighSchool",
        logo: {
          alt: "Chem4HighSchool Logo",
          src: "https://raw.githubusercontent.com/NCThanh1109/KHKT/main/dk.png",
          width: 32,
          height: 32,
        },
        hideOnScroll: false,
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "📚 Danh mục",
          },
          {
            to: "/docs/hoa-10/tn1",
            label: "Lớp 10",
            position: "left",
          },
          {
            to: "/docs/hoa-11/tn1",
            label: "Lớp 11",
            position: "left",
          },
          {
            to: "/docs/hoa-12/tn1",
            label: "Lớp 12",
            position: "left",
          },
          {
            type: "search",
            position: "right",
          },
        ],
      },
      //chỉnh sidebar dưới, thông tin cung cấp
      footer: {
        style: "light",
        links: [
          {
            title: "Nội dung học tập",
            items: [
              {
                label: "Hoá học 10",
                to: "/docs/category/hoá-học-10",
              },
              {
                label: "Hoá học 11",
                to: "/docs/category/hoá-học-11",
              },
              {
                label: "Hoá học 12",
                to: "/docs/category/hoá-học-12",
              },
            ],
          },
          {
            title: "Tài nguyên",
            items: [
              {
                label: "Kiến thức chung",
                to: "/docs/category/kiến-thức-chung",
              },
              {
                label: "Câu hỏi",
                to: "/docs/category/câu-hỏi-trắc-nghiệm",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Chem4HighSchool. Nền tảng học tập hóa học cho học sinh THPT.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
