import type LayoutConfigTypes from "@/core/config/LayoutConfigTypes";

const config: LayoutConfigTypes = {
  general: {
    mode: "light",
  },
  main: {
    type: "default",
    primaryColor: "#009EF7",
    logo: {
      dark: "media/logos/default-dark.svg",
      light: "media/logos/default.svg",
    },
  },
  illustrations: {
    set: "sketchy-1",
  },
  scrollTop: {
    display: true,
  },
  header: {
    display: true,
    menuIcon: "font",
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  toolbar: {
    display: true,
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  pageTitle: {
    display: true,
    breadcrumb: false,
    direction: "column",
  },
  aside: {
    display: true,
    theme: "dark",
    fixed: true,
    menuIcon: "font",
    minimized: false,
    minimize: true,
    hoverable: true,
  },
  content: {
    width: "fluid",
  },
  footer: {
    width: "fluid",
  },
};

export default config;
