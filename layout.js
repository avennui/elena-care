import "./globals.css";

export const metadata = {
  title: "Elena Care",
  description: "Care coordination for Elena Valdez",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#050507" />
      </head>
      <body className="bg-bg text-t1 min-h-screen">
        {children}
      </body>
    </html>
  );
}
