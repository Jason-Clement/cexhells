requirejs.config({
  baseUrl: "js",
});

require(["lib/domReady!", "app/App"], function (d, a) {

  var canvas = document.getElementById("canvas");
  canvas.oncontextmenu = function() { return false; };
  var wrapper = document.getElementById("wrapper");
  var ctx = canvas.getContext("2d");

  function reDraw() {
    a.App.start(canvas);
  }

  function resizeCanvas() {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    reDraw();
  }
  
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
});