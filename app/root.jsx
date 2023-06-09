import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError
} from "@remix-run/react";

import MainNavigation from "./components/MainNavigation";

import styles from "~/styles/main.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles }
  ];
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
          <title>Something went wrong</title>
        </head>
        <body>
          <header><MainNavigation/></header>
          <main className='error'>
            <h1>An error ocurred!</h1>
            <p>{error.message}</p>
            <p>Back to <Link to="/">safety</Link>!</p>
          </main>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );

  }

}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header><MainNavigation/></header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

