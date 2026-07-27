import localFont from "next/font/local";

export const generalGrotesque = localFont({
  src: [
    {
      path: "../public/fonts/GeneralGrotesque-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GeneralGrotesque-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-general-grotesque",
  display: "swap",
  preload: true,
});

export const ivory = localFont({
  src: [
    {
      path: "../public/fonts/IvoryLLWeb-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IvoryLLWeb-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/IvoryLLWeb-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/IvoryLLWeb-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/IvoryLLWeb-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/IvoryLLWeb-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/IvoryLLWeb-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/IvoryLLWeb-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ivory-ll",
  display: "swap",
  preload: true,
});
