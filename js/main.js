requirejs.config({
  baseUrl: "js",
});

require(["lib/domReady!", "app/App"], function (d, a) {
  a.App.start(document.getElementById("canvas"));
});