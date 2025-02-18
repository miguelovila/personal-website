import { ThemeProvider } from "@/components/theme-provider";
import PlausibleProvider from "next-plausible";
import type { Metadata, Viewport } from "next";
import { BASE_URL, OPEN_GRAPH_IMAGE } from "@/config";
import "@/styles/globals.css";

const title = "Miguel Vila";
const description =
  "Hi, I'm Miguel Vila. I'm a computer engineer with a passion for Linux, Open Source and Trail Running converting caffeine into low quality code since 2003!";
const url = BASE_URL;

export const metadata: Metadata = {
  title: {
    template: `${title} - %s`,
    default: `${title} - Webpage`,
  },
  description,
  authors: [
    {
      name: title,
      url,
    },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-chrome-512x512",
      url: "/android-chrome-512x512.png",
    },
  },
  metadataBase: new URL(url),
  openGraph: {
    title: {
      template: `${title} - %s`,
      default: `${title} - Webpage`,
    },
    description,
    url,
    siteName: title,
    images: [
      {
        url: OPEN_GRAPH_IMAGE,
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: `${title} - %s`,
      default: `${title} - Webpage`,
    },
    description,
    creator: "@miguelovila",
    images: [OPEN_GRAPH_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#ff8e2c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="keywords"
          content="Miguel Vila, Linux, Open Source, Trail Running, Web Development, Software Development, Programming, miguelovila, mxv.pt, miguelovila.pt"
        />
        <script
          src="https://afarkas.github.io/lazysizes/lazysizes.min.js"
          async
        ></script>
        <script
          defer
          data-domain="miguelovila.pt"
          src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.tagged-events.js"
        ></script>
      </head>
      <body>
        <PlausibleProvider domain="miguelovila.pt" trackOutboundLinks={true}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
