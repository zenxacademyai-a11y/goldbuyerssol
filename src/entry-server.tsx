/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// SSR DOM Polyfill for libraries like Leaflet that access window/document on module import
if (typeof globalThis.window === "undefined") {
  const dummyEl = {
    style: {},
    setAttribute: () => {},
    appendChild: () => dummyEl,
    removeChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
  };

  const dummyDoc = {
    createElement: () => dummyEl,
    createElementNS: () => dummyEl,
    createTextNode: () => dummyEl,
    head: dummyEl,
    body: dummyEl,
    documentElement: dummyEl,
    getElementById: () => null,
    getElementsByTagName: () => [dummyEl],
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const dummyNav = {
    userAgent: "mozilla/5.0 (windows nt 10.0; win64; x64) applewebkit/537.36 (khtml, like gecko) chrome/120.0.0.0 safari/537.36",
    appVersion: "5.0 (windows nt 10.0; win64; x64)",
    platform: "Win32",
    languages: ["en-US", "en"],
    language: "en-US",
    deviceMemory: 8,
  };

  const dummyWin = {
    location: { pathname: "/", search: "", hash: "", href: "https://goldbuyerscolombo.com", origin: "https://goldbuyerscolombo.com" },
    navigator: dummyNav,
    document: dummyDoc,
    screen: { deviceXDPI: 96, logicalXDPI: 96, width: 1920, height: 1080, colorDepth: 24 },
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    requestAnimationFrame: (cb: any) => setTimeout(cb, 16),
    cancelAnimationFrame: (id: any) => clearTimeout(id),
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
    HTMLCanvasElement: class {},
    Image: class {},
  };

  (globalThis as any).window = dummyWin;
  (globalThis as any).document = dummyDoc;
  (globalThis as any).location = dummyWin.location;
  try {
    Object.defineProperty(globalThis, "navigator", {
      value: dummyNav,
      writable: true,
      configurable: true,
    });
  } catch (e) {
    // ignore
  }
}

import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.js";
import { BlogPost } from "./types.js";

interface RenderOptions {
  initialView?: "home" | "blog" | "admin" | "about" | "contact" | "branches" | "rates" | "calculator" | "faq" | "services";
  initialBlogSlug?: string | null;
  initialServiceId?: string | null;
  initialBranchId?: string | null;
  initialBlogsData?: BlogPost[];
}

export function render(options: RenderOptions = {}) {
  return renderToString(
    <App
      initialView={options.initialView}
      initialBlogSlug={options.initialBlogSlug}
      initialServiceId={options.initialServiceId}
      initialBranchId={options.initialBranchId}
      initialBlogsData={options.initialBlogsData}
    />
  );
}
