/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="/images/logo.svg"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/images/logo.svg"
          rel="icon"
          sizes="32x32"
          type="image/svg"
        />
        <link
          href="/images/logo.svg"
          rel="icon"
          sizes="16x16"
          type="image/svg"
        />
        <link href="/favicon/site.webmanifest" rel="manifest" />
        <link
          color="#000000"
          href="/favicon/safari-pinned-tab.svg"
          rel="mask-icon"
        />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="/favicon/favicon.ico" rel="shortcut icon" />

        <script
            type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC8yHTwoEE8uXkVcbHU686lvwvhtCzD6QI&libraries=places&loading=async"
        />
        
      </Head>
      <body className="overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
