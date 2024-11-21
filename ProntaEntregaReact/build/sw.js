if (!self.define) {
  let e,
    i = {};
  const s = (s, n) => (
    (s = new URL(s + ".js", n).href),
    i[s] ||
      new Promise((i) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = i), document.head.appendChild(e);
        } else (e = s), importScripts(s), i();
      }).then(() => {
        let e = i[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, r) => {
    const o =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (i[o]) return;
    let t = {};
    const d = (e) => s(e, o),
      f = { module: { uri: o }, exports: t, require: d };
    i[o] = Promise.all(n.map((e) => f[e] || d(e))).then((e) => (r(...e), t));
  };
}
define(["./workbox-3e911b1d"], function (e) {
  "use strict";
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "assets/index-CpPWKbH4.js", revision: null },
        { url: "assets/index-U5Bb13Gq.css", revision: null },
        { url: "index.html", revision: "9ad104f9a552895d6566f7ed1e353281" },
        { url: "registerSW.js", revision: "1872c500de691dce40960bb85481de07" },
        {
          url: "serviceworker.js",
          revision: "07a254fe7de231eca09f4e531f6c4229",
        },
        {
          url: "icons/prontalogo_192.png",
          revision: "3af0f1749dff432b2db0ae287b340b82",
        },
        {
          url: "icons/prontalogo_512.png",
          revision: "3af0f1749dff432b2db0ae287b340b82",
        },
        {
          url: "manifest.webmanifest",
          revision: "3ef753aa465f0dd4c8bd668b1b63fe0f",
        },
      ],
      {},
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html")),
    );
});
