if (!self.define) {
  let s,
    e = {};
  const n = (n, i) => (
    (n = new URL(n + ".js", i).href),
    e[n] ||
      new Promise((e) => {
        if ("document" in self) {
          const s = document.createElement("script");
          ((s.src = n), (s.onload = e), document.head.appendChild(s));
        } else ((s = n), importScripts(n), e());
      }).then(() => {
        let s = e[n];
        if (!s) throw new Error(`Module ${n} didn’t register its module`);
        return s;
      })
  );
  self.define = (i, r) => {
    const l = s || ("document" in self ? document.currentScript.src : "") || location.href;
    if (e[l]) return;
    let a = {};
    const o = (s) => n(s, l),
      t = { module: { uri: l }, exports: a, require: o };
    e[l] = Promise.all(i.map((s) => t[s] || o(s))).then((s) => (r(...s), a));
  };
}
define(["./workbox-239d0d27"], function (s) {
  "use strict";
  (self.skipWaiting(),
    s.clientsClaim(),
    s.precacheAndRoute(
      [
        { url: "assets/css/index-DljMSOaT.css", revision: null },
        { url: "assets/css/main-DJvo1umu.css", revision: null },
        { url: "assets/js/Chat-BMsE6_sD.js", revision: null },
        { url: "assets/js/DatenschutzPage-C-SYxurW.js", revision: null },
        { url: "assets/js/FeatureFlagPanel-C87oBr9f.js", revision: null },
        { url: "assets/js/ImpressumPage-DxXsAhHz.js", revision: null },
        { url: "assets/js/index-CCM_qK8Z.js", revision: null },
        { url: "assets/js/main-DGd8ArMo.js", revision: null },
        { url: "assets/js/mapper-BHHyTRFK.js", revision: null },
        { url: "assets/js/ModelsPage-DKxE5qLb.js", revision: null },
        { url: "assets/js/PageShell-Bdi6k76m.js", revision: null },
        { url: "assets/js/react-vendor-BSeQcPOp.js", revision: null },
        { url: "assets/js/reload-manager-DqJ_LRMs.js", revision: null },
        { url: "assets/js/RolesPage-k1sReb5v.js", revision: null },
        { url: "assets/js/roleStore-BdBZsUHC.js", revision: null },
        { url: "assets/js/router-vendor-DOf7rflG.js", revision: null },
        { url: "assets/js/SettingsApi-DpKpkCgI.js", revision: null },
        { url: "assets/js/SettingsAppearance-CzrO0rrx.js", revision: null },
        { url: "assets/js/SettingsData-CWOO9mlo.js", revision: null },
        { url: "assets/js/SettingsFilters-BTCbKgem.js", revision: null },
        { url: "assets/js/SettingsMemory-vt3gnO_w.js", revision: null },
        { url: "assets/js/SettingsOverviewPage-Dzb_Wd2d.js", revision: null },
        { url: "assets/js/SettingsView-C-_-P_8R.js", revision: null },
        { url: "assets/js/sparkles-DSnlatz3.js", revision: null },
        { url: "assets/js/StudioHome-BUxy5vMg.js", revision: null },
        { url: "assets/js/syntax-vendor-l0sNRNKZ.js", revision: null },
        { url: "assets/js/ui-vendor-DCd7GzZl.js", revision: null },
        { url: "assets/js/upload-BvTCxiLC.js", revision: null },
        { url: "assets/js/use-storage-U1PI0mVK.js", revision: null },
        { url: "assets/js/useRoles-D3BItzm6.js", revision: null },
        { url: "assets/js/useSettings-4jLuXzLy.js", revision: null },
        { url: "assets/js/utils-vendor-B35eaEUR.js", revision: null },
        { url: "datenschutz.html", revision: "497ffb3a2916b25ff7a322009ca801d1" },
        { url: "favicon.ico", revision: "b8cbe5e883578071aabaa331793ac74e" },
        { url: "icons/icon-128.png", revision: "ca35c3b1d05310d9e9b6eda5a5cdf825" },
        { url: "icons/icon-192.png", revision: "0347c212167d24230fd6c3b6b21f3c26" },
        { url: "icons/icon-256.png", revision: "eb94a15d5ba0b0cce4b18555c0f9a418" },
        { url: "icons/icon-48.png", revision: "29606650f7e5117623726c37e09f0c40" },
        { url: "icons/icon-512.png", revision: "90a643973a4cfae83048b03786f0107c" },
        { url: "icons/icon-72.png", revision: "9487d0987857a9ea3536c18f668b51bb" },
        { url: "icons/icon-96.png", revision: "37a1baa161846dc351525977c3a1515e" },
        { url: "icons/icon.svg", revision: "7bf6d29d54bd73dabf655353cdb46e50" },
        { url: "impressum.html", revision: "57f09752e4456510995ffeb6cdd8a7db" },
        { url: "index.html", revision: "30b966d73d2bfff777e4fd85f5fea12a" },
        { url: "manifest.webmanifest", revision: "08fa4467e2c5e1ad3fab70dd5411f244" },
        { url: "offline.html", revision: "c2728fd588f5f7b3a08c44e276008892" },
        { url: "privacy-policy.html", revision: "16f57fa2392cdc92a12d9729714b5fc6" },
        { url: "screenshot-mobile.png", revision: "2ed4cbef9d43462a5b721d50a9b649bf" },
        { url: "stats.html", revision: "179a96ec15ccc0675dc14a16c84ff8f6" },
        { url: "favicon.ico", revision: "b8cbe5e883578071aabaa331793ac74e" },
        { url: "icons/icon-192.png", revision: "0347c212167d24230fd6c3b6b21f3c26" },
        { url: "icons/icon-512.png", revision: "90a643973a4cfae83048b03786f0107c" },
        { url: "manifest.webmanifest", revision: "08fa4467e2c5e1ad3fab70dd5411f244" },
      ],
      {},
    ),
    s.cleanupOutdatedCaches(),
    s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),
    s.registerRoute(
      /^https:\/\/fonts\.googleapis\.com\/.*/i,
      new s.CacheFirst({
        cacheName: "google-fonts-cache",
        plugins: [new s.ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 31536e3 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /.*\/assets\/fonts\/KaTeX.*\.(woff2|woff)$/,
      new s.CacheFirst({
        cacheName: "katex-fonts-cache",
        plugins: [new s.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 15552e3 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /^https:\/\/cdn\.jsdelivr\.net\/npm\/(prismjs|katex)@.*$/i,
      new s.CacheFirst({
        cacheName: "cdn-styles-cache",
        plugins: [new s.ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 10368e3 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /^https:\/\/esm\.sh\/.*/i,
      new s.NetworkFirst({
        cacheName: "esm-runtime-cache",
        networkTimeoutSeconds: 5,
        plugins: [new s.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 604800 })],
      }),
      "GET",
    ),
    s.registerRoute(
      /^https:\/\/openrouter\.ai\/api\/.*/i,
      new s.NetworkFirst({
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        plugins: [new s.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 3600 })],
      }),
      "GET",
    ));
});
//# sourceMappingURL=sw.js.map
