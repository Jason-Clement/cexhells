(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s
})({
  1: [function (require, module, exports) {
    // Generated code -- http://www.redblobgames.com/grids/hexagons/
    "use strict";



    function Point(x, y) {
      return {
        x: x,
        y: y
      };
    }




    function Hex(q, r, s) {
      return {
        q: q,
        r: r,
        s: s
      };
    }

    function hex_add(a, b) {
      return Hex(a.q + b.q, a.r + b.r, a.s + b.s);
    }

    function hex_subtract(a, b) {
      return Hex(a.q - b.q, a.r - b.r, a.s - b.s);
    }

    function hex_scale(a, k) {
      return Hex(a.q * k, a.r * k, a.s * k);
    }

    var hex_directions = [Hex(1, 0, -1), Hex(1, -1, 0), Hex(0, -1, 1), Hex(-1, 0, 1), Hex(-1, 1, 0), Hex(0, 1, -1)];

    function hex_direction(direction) {
      return hex_directions[direction];
    }

    function hex_neighbor(hex, direction) {
      return hex_add(hex, hex_direction(direction));
    }

    var hex_diagonals = [Hex(2, -1, -1), Hex(1, -2, 1), Hex(-1, -1, 2), Hex(-2, 1, 1), Hex(-1, 2, -1), Hex(1, 1, -2)];

    function hex_diagonal_neighbor(hex, direction) {
      return hex_add(hex, hex_diagonals[direction]);
    }

    function hex_length(hex) {
      return Math.trunc((Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2);
    }

    function hex_distance(a, b) {
      return hex_length(hex_subtract(a, b));
    }

    function hex_round(h) {
      var q = Math.trunc(Math.round(h.q));
      var r = Math.trunc(Math.round(h.r));
      var s = Math.trunc(Math.round(h.s));
      var q_diff = Math.abs(q - h.q);
      var r_diff = Math.abs(r - h.r);
      var s_diff = Math.abs(s - h.s);
      if (q_diff > r_diff && q_diff > s_diff) {
        q = -r - s;
      } else
      if (r_diff > s_diff) {
        r = -q - s;
      } else {
        s = -q - r;
      }
      return Hex(q, r, s);
    }

    function hex_lerp(a, b, t) {
      return Hex(a.q * (1 - t) + b.q * t, a.r * (1 - t) + b.r * t, a.s * (1 - t) + b.s * t);
    }

    function hex_linedraw(a, b) {
      var N = hex_distance(a, b);
      var a_nudge = Hex(a.q + 0.000001, a.r + 0.000001, a.s - 0.000002);
      var b_nudge = Hex(b.q + 0.000001, b.r + 0.000001, b.s - 0.000002);
      var results = [];
      var step = 1.0 / Math.max(N, 1);
      for (var i = 0; i <= N; i++) {
        results.push(hex_round(hex_lerp(a_nudge, b_nudge, step * i)));
      }
      return results;
    }




    function OffsetCoord(col, row) {
      return {
        col: col,
        row: row
      };
    }

    var EVEN = 1;
    var ODD = -1;

    function qoffset_from_cube(offset, h) {
      var col = h.q;
      var row = h.r + Math.trunc((h.q + offset * (h.q & 1)) / 2);
      return OffsetCoord(col, row);
    }

    function qoffset_to_cube(offset, h) {
      var q = h.col;
      var r = h.row - Math.trunc((h.col + offset * (h.col & 1)) / 2);
      var s = -q - r;
      return Hex(q, r, s);
    }

    function roffset_from_cube(offset, h) {
      var col = h.q + Math.trunc((h.r + offset * (h.r & 1)) / 2);
      var row = h.r;
      return OffsetCoord(col, row);
    }

    function roffset_to_cube(offset, h) {
      var q = h.col - Math.trunc((h.row + offset * (h.row & 1)) / 2);
      var r = h.row;
      var s = -q - r;
      return Hex(q, r, s);
    }




    function Orientation(f0, f1, f2, f3, b0, b1, b2, b3, start_angle) {
      return {
        f0: f0,
        f1: f1,
        f2: f2,
        f3: f3,
        b0: b0,
        b1: b1,
        b2: b2,
        b3: b3,
        start_angle: start_angle
      };
    }




    function Layout(orientation, size, origin) {
      return {
        orientation: orientation,
        size: size,
        origin: origin
      };
    }

    var layout_pointy = Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
    var layout_flat = Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);

    function hex_to_pixel(layout, h) {
      var M = layout.orientation;
      var size = layout.size;
      var origin = layout.origin;
      var x = (M.f0 * h.q + M.f1 * h.r) * size.x;
      var y = (M.f2 * h.q + M.f3 * h.r) * size.y;
      return Point(x + origin.x, y + origin.y);
    }

    function pixel_to_hex(layout, p) {
      var M = layout.orientation;
      var size = layout.size;
      var origin = layout.origin;
      var pt = Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
      var q = M.b0 * pt.x + M.b1 * pt.y;
      var r = M.b2 * pt.x + M.b3 * pt.y;
      return Hex(q, r, -q - r);
    }

    function hex_corner_offset(layout, corner) {
      var M = layout.orientation;
      var size = layout.size;
      var angle = 2.0 * Math.PI * (M.start_angle - corner) / 6;
      return Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
    }

    function polygon_corners(layout, h) {
      var corners = [];
      var center = hex_to_pixel(layout, h);
      for (var i = 0; i < 6; i++) {
        var offset = hex_corner_offset(layout, i);
        corners.push(Point(center.x + offset.x, center.y + offset.y));
      }
      return corners;
    }

  }, {}],
  2: [function (require, module, exports) {
    // From http://www.redblobgames.com/
    // Copyright 2015 Red Blob Games <redblobgames@gmail.com>
    // License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

    // I'm going to directly use the output of the codegen project!
    var H = require("./codegen/output/lib.js");

    function drawHex(ctx, layout, hex) {
      var corners = H.polygon_corners(layout, hex);
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.moveTo(corners[5].x, corners[5].y);
      for (var i = 0; i < 6; i++) {
        ctx.lineTo(corners[i].x, corners[i].y);
      }
      ctx.stroke();
    }


    function colorForHex(hex) {
      // Match the color style used in the main article
      if (hex.q == 0 && hex.r == 0 && hex.s == 0) {
        return "hsl(0, 50%, 0%)";
      } else if (hex.q == 0) {
        return "hsl(90, 70%, 35%)";
      } else if (hex.r == 0) {
        return "hsl(200, 100%, 35%)";
      } else if (hex.s == 0) {
        return "hsl(300, 40%, 50%)";
      } else {
        return "hsl(0, 0%, 50%)";
      }
    }


    function drawHexLabel(ctx, layout, hex) {
      var center = H.hex_to_pixel(layout, hex);
      ctx.fillStyle = colorForHex(hex);
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((hex.q == 0 && hex.r == 0 && hex.s == 0) ? "q,r,s" : (hex.q + "," + hex.r + "," + hex.s), center.x, center.y);
    }


    function permuteQRS(q, r, s) {
      return H.Hex(q, r, s);
    }

    function permuteSRQ(q, r, s) {
      return H.Hex(s, r, q);
    }

    function permuteSQR(q, r, s) {
      return H.Hex(s, q, r);
    }

    function permuteRQS(q, r, s) {
      return H.Hex(r, q, s);
    }

    function permuteRSQ(q, r, s) {
      return H.Hex(r, s, q);
    }

    function permuteQSR(q, r, s) {
      return H.Hex(q, s, r);
    }

    function shapeParallelogram(q1, r1, q2, r2, constructor) {
      var hexes = [];
      for (var q = q1; q <= q2; q++) {
        for (var r = r1; r <= r2; r++) {
          hexes.push(constructor(q, r, -q - r));
        }
      }
      return hexes;
    }


    function shapeTriangle1(size) {
      var hexes = [];
      for (var q = 0; q <= size; q++) {
        for (var r = 0; r <= size - q; r++) {
          hexes.push(H.Hex(q, r, -q - r));
        }
      }
      return hexes;
    }


    function shapeTriangle2(size) {
      var hexes = [];
      for (var q = 0; q <= size; q++) {
        for (var r = size - q; r <= size; r++) {
          hexes.push(H.Hex(q, r, -q - r));
        }
      }
      return hexes;
    }


    function shapeHexagon(size) {
      var hexes = [];
      for (var q = -size; q <= size; q++) {
        var r1 = Math.max(-size, -q - size);
        var r2 = Math.min(size, -q + size);
        for (var r = r1; r <= r2; r++) {
          hexes.push(H.Hex(q, r, -q - r));
        }
      }
      return hexes;
    }


    function shapeRectangle(w, h, constructor) {
      var hexes = [];
      var i1 = -Math.floor(w / 2),
        i2 = i1 + w;
      var j1 = -Math.floor(h / 2),
        j2 = j1 + h;
      for (var j = j1; j < j2; j++) {
        var jOffset = -Math.floor(j / 2);
        for (var i = i1 + jOffset; i < i2 + jOffset; i++) {
          hexes.push(constructor(i, j, -i - j));
        }
      }
      return hexes;
    }


    function drawGrid(id, backgroundColor, withLabels, layout, hexes) {
      var canvas = document.getElementById(id);
      var ctx = canvas.getContext('2d');
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      if (window.devicePixelRatio && window.devicePixelRatio != 1) {
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }

      if (hexes === undefined) {
        hexes = shapeRectangle(15, 15, permuteQRS);
      }

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      ctx.translate(width / 2, height / 2);
      hexes.forEach(function (hex) {
        drawHex(ctx, layout, hex);
        if (withLabels) drawHexLabel(ctx, layout, hex);
      });
    }

    drawGrid("layout-test-orientation-pointy", "hsl(60, 10%, 90%)", true,
      H.Layout(H.layout_pointy, H.Point(25, 25), H.Point(0, 0)));
    drawGrid("layout-test-orientation-flat", "hsl(60, 10%, 85%)", true,
      H.Layout(H.layout_flat, H.Point(25, 25), H.Point(0, 0)));

    drawGrid("layout-test-size-1", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(10, 10), H.Point(0, 0)));
    drawGrid("layout-test-size-2", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_pointy, H.Point(20, 20), H.Point(0, 0)));
    drawGrid("layout-test-size-3", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(40, 40), H.Point(0, 0)));

    drawGrid("layout-test-size-tall", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_flat, H.Point(15, 25), H.Point(0, 0)));
    drawGrid("layout-test-size-wide", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_flat, H.Point(25, 15), H.Point(0, 0)));

    drawGrid("layout-test-y-down", "hsl(60, 10%, 85%)", true,
      H.Layout(H.layout_pointy, H.Point(25, 25), H.Point(0, 0)));
    drawGrid("layout-test-y-up", "hsl(60, 10%, 90%)", true,
      H.Layout(H.layout_pointy, H.Point(25, -25), H.Point(0, 0)));

    drawGrid("shape-pointy-parallelogram-qr", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(15, 15), H.Point(0, 0)),
      shapeParallelogram(-2, -2, 2, 2, permuteQRS));
    drawGrid("shape-pointy-parallelogram-sq", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_pointy, H.Point(15, 15), H.Point(0, 0)),
      shapeParallelogram(-2, -2, 2, 2, permuteSQR));
    drawGrid("shape-pointy-parallelogram-rs", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(13, 13), H.Point(0, 0)),
      shapeParallelogram(-2, -2, 2, 2, permuteRSQ));

    drawGrid("shape-flat-parallelogram-qr", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_flat, H.Point(15, 15), H.Point(0, 0)),
      shapeParallelogram(-2, -2, 2, 2, permuteQRS));
    drawGrid("shape-flat-parallelogram-sq", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_flat, H.Point(13, 13), H.Point(0, 0)),
      shapeParallelogram(-2, -2, 2, 2, permuteSQR));
    drawGrid("shape-flat-parallelogram-rs", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_flat, H.Point(15, 15), H.Point(0, 0)),
      shapeParallelogram(-2, -2, 2, 2, permuteRSQ));

    drawGrid("shape-pointy-triangle-1", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(15, 15), H.Point(-70, -60)),
      shapeTriangle1(5));
    drawGrid("shape-pointy-triangle-2", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_pointy, H.Point(15, 15), H.Point(-130, -60)),
      shapeTriangle2(5));

    drawGrid("shape-flat-triangle-1", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_flat, H.Point(15, 15), H.Point(-60, -70)),
      shapeTriangle1(5));
    drawGrid("shape-flat-triangle-2", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_flat, H.Point(15, 15), H.Point(-60, -130)),
      shapeTriangle2(5));

    drawGrid("shape-pointy-hexagon", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(15, 15), H.Point(0, 0)),
      shapeHexagon(3));
    drawGrid("shape-flat-hexagon", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_flat, H.Point(15, 15), H.Point(0, 0)),
      shapeHexagon(3));

    drawGrid("shape-pointy-rectangle-qr", "hsl(200, 20%, 87%)", false,
      H.Layout(H.layout_pointy, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteQRS));
    drawGrid("shape-pointy-rectangle-rs", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteRSQ));
    drawGrid("shape-pointy-rectangle-sq", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_pointy, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteSQR));
    drawGrid("shape-pointy-rectangle-rq", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteRQS));
    drawGrid("shape-pointy-rectangle-sr", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_pointy, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteSRQ));
    drawGrid("shape-pointy-rectangle-qs", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_pointy, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteQSR));

    drawGrid("shape-flat-rectangle-qr", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_flat, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteQRS));
    drawGrid("shape-flat-rectangle-rs", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_flat, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteRSQ));
    drawGrid("shape-flat-rectangle-sq", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_flat, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteSQR));
    drawGrid("shape-flat-rectangle-rq", "hsl(200, 15%, 85%)", false,
      H.Layout(H.layout_flat, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteRQS));
    drawGrid("shape-flat-rectangle-sr", "hsl(60, 10%, 90%)", false,
      H.Layout(H.layout_flat, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteSRQ));
    drawGrid("shape-flat-rectangle-qs", "hsl(60, 10%, 85%)", false,
      H.Layout(H.layout_flat, H.Point(10, 10), H.Point(0, 0)),
      shapeRectangle(8, 6, permuteQSR));

  }, {
    "./codegen/output/lib.js": 1
  }]
}, {}, [2]);