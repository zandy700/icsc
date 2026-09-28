/* =============================================================
   Interlake ICSC — motion & 3D
   - Scroll reveals (with hard failsafe)
   - Count-up stats
   - 3D tilt on cards
   - Three.js floating citizenship objects (hero centerpiece)
   All effects are opt-out under prefers-reduced-motion and degrade
   gracefully when WebGL / IntersectionObserver are unavailable.
   ============================================================= */
/* Adaptive resolution: start at a capped pixel ratio and step it down
   if the GPU can't hold ~50fps, so the page never drops to a 30Hz feel. */
function icscAutoRes(renderer, maxDpr, onChange) {
  var dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  var acc = 0, n = 0, last = 0;
  function sample(now) {
    if (last) { var d = now - last; if (d < 100) { acc += d; n++; } }
    last = now;
    if (n >= 40) {
      var avg = acc / n; acc = 0; n = 0;
      if (avg > 19 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        onChange();
      }
    }
  }
  sample.reset = function () { last = 0; acc = 0; n = 0; };
  return sample;
}

(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var REVEAL_SEL =
    ".section-title, .section-lead, .card, .steps li, .review, " +
    ".stats-band .stat, #contact .contact-grid > *";

  /* ---------- 1. Scroll reveal ---------- */
  (function reveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(REVEAL_SEL));
    if (!els.length) return;
    function showAll() { els.forEach(function (el) { el.classList.add("in"); }); }

    if (reduced || !("IntersectionObserver" in window)) { showAll(); return; }

    // stagger siblings so grids cascade in
    els.forEach(function (el) {
      var sibs = Array.prototype.slice.call(el.parentElement.children).filter(function (c) {
        return els.indexOf(c) !== -1;
      });
      var i = sibs.indexOf(el);
      el.style.transitionDelay = Math.min(i, 6) * 80 + "ms";
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // absolute failsafe: never leave content hidden
    setTimeout(showAll, 4000);
  })();

  /* ---------- 2. Count-up stats ---------- */
  (function counters() {
    var nums = Array.prototype.slice.call(document.querySelectorAll(".stat-num [data-count]"));
    if (!nums.length) return;

    function run(el) {
      var target = +el.getAttribute("data-count"), dur = 1500, t0 = performance.now();
      (function step(t) {
        var p = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * e);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }

    if (reduced || !("IntersectionObserver" in window)) {
      nums.forEach(function (n) { n.textContent = n.getAttribute("data-count"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------- 3. 3D tilt on cards ---------- */
  (function tilt() {
    if (reduced) return;
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    var els = document.querySelectorAll(".card, .review, .steps li");
    var MAX = 8;
    els.forEach(function (el) {
      el.addEventListener("mousemove", function (ev) {
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transition = "transform .08s linear";
        el.style.transform =
          "perspective(820px) rotateX(" + (-py * MAX).toFixed(2) + "deg) rotateY(" +
          (px * MAX).toFixed(2) + "deg) translateZ(6px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transition = "transform .5s cubic-bezier(.2,.7,.2,1)";
        el.style.transform = "";
      });
    });
  })();

  /* ---------- 4. Three.js floating citizenship objects ---------- */
  (function scene() {
    if (reduced) return;                        // fallback coverage card stays visible
    var THREE = window.THREE;
    var host = document.getElementById("hero3d");
    if (!THREE || !host) return;
    var canvas = host.querySelector(".hero-canvas");
    if (!canvas) return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: (window.devicePixelRatio || 1) < 1.5, alpha: true, powerPreference: "high-performance" });
    } catch (err) { return; }                   // no WebGL -> fallback card stays

    var small = window.innerWidth < 700;
    var autoRes = icscAutoRes(renderer, 1.5, function () { resize(); });
    renderer.setClearColor(0x000000, 0);

    host.classList.add("webgl-on");             // hide fallback, show canvas

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    scene.add(new THREE.AmbientLight(0xfff4d6, 0.75));
    var key = new THREE.DirectionalLight(0xffffff, 0.95); key.position.set(5, 6, 7); scene.add(key);
    var fill = new THREE.DirectionalLight(0x9db8ff, 0.4); fill.position.set(-6, -2, 4); scene.add(fill);

    var NAVY = 0x14306a, GOLD = 0xf5c542, PAPER = 0xfffef7, STONE = 0xf1f3f9;

    function starShape(outer, inner, points) {
      var s = new THREE.Shape(), step = Math.PI / points;
      for (var i = 0; i < 2 * points; i++) {
        var r = (i % 2) ? inner : outer, a = i * step - Math.PI / 2;
        var x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
      }
      s.closePath(); return s;
    }
    function goldMat() { return new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.45, roughness: 0.32 }); }

    function makeStar() {
      var geo = new THREE.ExtrudeGeometry(starShape(0.7, 0.3, 5),
        { depth: 0.28, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2 });
      geo.center();
      return new THREE.Mesh(geo, goldMat());
    }
    function makeBook() {
      var g = new THREE.Group();
      var page = new THREE.MeshStandardMaterial({ color: PAPER, roughness: 0.85 });
      var cover = new THREE.MeshStandardMaterial({ color: NAVY, roughness: 0.5, metalness: 0.12 });
      var lp = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.06, 1.35), page);
      var rp = lp.clone();
      lp.position.set(-0.56, 0, 0); lp.rotation.z = 0.20;
      rp.position.set(0.56, 0, 0); rp.rotation.z = -0.20;
      var lc = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.06, 1.5), cover);
      var rc = lc.clone();
      lc.position.set(-0.58, -0.10, 0); lc.rotation.z = 0.20;
      rc.position.set(0.58, -0.10, 0); rc.rotation.z = -0.20;
      g.add(lc, rc, lp, rp);
      return g;
    }
    function makePassport() {
      var g = new THREE.Group();
      var body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.35, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x0f2350, roughness: 0.5, metalness: 0.2 }));
      g.add(body);
      var em = new THREE.Mesh(new THREE.ExtrudeGeometry(starShape(0.17, 0.075, 5),
        { depth: 0.05, bevelEnabled: false }), goldMat());
      em.position.set(0, 0.26, 0.09);
      g.add(em);
      var lineMat = goldMat();
      for (var i = 0; i < 2; i++) {
        var ln = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.055, 0.02), lineMat);
        ln.position.set(0, -0.22 - i * 0.2, 0.09);
        g.add(ln);
      }
      return g;
    }
    function makeDome() {
      var g = new THREE.Group();
      var stone = new THREE.MeshStandardMaterial({ color: STONE, roughness: 0.65 });
      var base = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.72, 0.34, 26), stone); base.position.y = -0.42;
      var drum = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.52, 0.36, 26), stone); drum.position.y = -0.1;
      var dome = new THREE.Mesh(new THREE.SphereGeometry(0.46, 26, 16, 0, Math.PI * 2, 0, Math.PI / 2), stone); dome.position.y = 0.08;
      var spire = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.26, 14), goldMat()); spire.position.y = 0.5;
      g.add(base, drum, dome, spire);
      // simple column ring
      var colMat = stone;
      for (var i = 0; i < 8; i++) {
        var a = (i / 8) * Math.PI * 2;
        var col = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), colMat);
        col.position.set(Math.cos(a) * 0.5, -0.1, Math.sin(a) * 0.5);
        g.add(col);
      }
      return g;
    }
    function makeSparkle() {
      return new THREE.Mesh(new THREE.TetrahedronGeometry(0.12), goldMat());
    }

    var group = new THREE.Group();
    scene.add(group);

    function place(obj, x, y, z, scale) {
      obj.position.set(x, y, z);
      if (scale) obj.scale.setScalar(scale);
      obj.userData = {
        baseY: y,
        rx: (Math.random() - 0.5) * 0.006,
        ry: 0.004 + Math.random() * 0.006,
        amp: 0.12 + Math.random() * 0.14,
        phase: Math.random() * Math.PI * 2,
        spd: 0.6 + Math.random() * 0.5
      };
      group.add(obj);
    }

    var star = makeStar();
    place(star, 0, 0.35, 0.2, 1.0);
    place(makeBook(), -1.55, -1.35, -0.2, 1.0);
    place(makePassport(), 1.55, -0.15, -0.5, 0.95);
    place(makeDome(), 0.15, 1.95, -0.9, 0.92);

    var sparkleCount = small ? 4 : 7;
    for (var i = 0; i < sparkleCount; i++) {
      var sp = makeSparkle();
      place(sp,
        (Math.random() - 0.5) * 4.6,
        (Math.random() - 0.5) * 4.6,
        (Math.random() - 0.5) * 1.5 - 0.3,
        0.6 + Math.random() * 0.8);
    }

    // pointer parallax
    var pointerX = 0, pointerY = 0, spinY = 0, extraY = 0, tiltX = 0;
    window.addEventListener("mousemove", function (e) {
      pointerX = (e.clientX / window.innerWidth) - 0.5;
      pointerY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    function resize() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    // only render while visible
    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) {
        visible = ents[0].isIntersecting;
        if (visible) tick();
      }, { threshold: 0.01 }).observe(host);
    }

    var clock = new THREE.Clock();
    var running = false;
    function tick() {
      if (running) return;
      running = true;
      autoRes.reset();
      clock.getDelta();
      (function loop(now) {
        if (!visible) { running = false; return; }
        if (now) autoRes(now);
        var dt = Math.min(clock.getDelta(), 0.05);
        var t = clock.elapsedTime;
        var k = dt * 60;                          // same speed at 60, 120 or 144Hz
        group.children.forEach(function (o) {
          var u = o.userData;
          o.rotation.x += u.rx * k; o.rotation.y += u.ry * k;
          o.position.y = u.baseY + Math.sin(t * u.spd + u.phase) * u.amp;
        });
        spinY += dt * 0.16;
        extraY += ((pointerX * 0.5) - extraY) * Math.min(1, 0.05 * k);
        tiltX += ((pointerY * 0.45) - tiltX) * Math.min(1, 0.05 * k);
        group.rotation.y = spinY + extraY;
        group.rotation.x = tiltX;
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
      })();
    }
    tick();
  })();
})();

/* =============================================================
   3D flag journey (pinned scroll section)
   A cloth-simulated American flag in a night sky. As you scroll the
   sky warms toward dawn, the camera sweeps around the rippling flag,
   and drifting gold stardust gathers into a giant star that frames
   it for the final "Sign up" beat. Falls back to a static poster
   when WebGL / desktop / motion isn't available.
   ============================================================= */
(function flagJourney() {
  "use strict";
  var THREE = window.THREE;
  var section = document.getElementById("scrub");
  if (!section) return;
  var sticky = section.querySelector(".scrub-sticky");
  var canvas = section.querySelector(".scrub-canvas");
  var beats  = Array.prototype.slice.call(section.querySelectorAll(".scrub-beat"));
  var cta    = section.querySelector(".scrub-cta");
  var bar    = section.querySelector(".scrub-progress span");
  var hint   = section.querySelector(".scrub-hint");
  var dawn   = section.querySelector(".scrub-dawn");
  var N = beats.length;

  var desktop = window.matchMedia("(min-width: 761px)");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function beatOpacity(i, p) {
    var c = (i + 0.5) / N, w = 0.62 / N;
    if (i === 0 && p <= c) return 1;
    if (i === N - 1 && p >= c) return 1;
    return Math.max(0, 1 - Math.abs(p - c) / w);
  }
  function paintCaptions(p) {
    for (var i = 0; i < N; i++) {
      var o = beatOpacity(i, p);
      beats[i].style.opacity = o.toFixed(3);
      beats[i].style.setProperty("--beat-y", ((1 - o) * 18).toFixed(1) + "px");
    }
    var last = beatOpacity(N - 1, p);
    if (cta) { cta.style.opacity = last.toFixed(3); cta.classList.toggle("is-on", last > 0.6); }
    if (bar) bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    if (hint) hint.style.opacity = p > 0.03 ? "0" : "1";
    if (dawn) dawn.style.opacity = p.toFixed(3);
  }
  function computeProgress() {
    var rect = section.getBoundingClientRect();
    var dist = rect.height - window.innerHeight;
    if (dist <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / dist));
  }

  var canGL = (function () {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  })();

  // Not eligible -> leave the static poster + first caption (no pin)
  if (!THREE || !canGL || !desktop.matches || reduced.matches) return;

  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: (window.devicePixelRatio || 1) < 1.5, alpha: true, powerPreference: "high-performance" }); }
  catch (e) { return; }
  var autoRes = icscAutoRes(renderer, 1.5, function () { resize(); });
  renderer.setClearColor(0x000000, 0);

  section.classList.add("is-live");

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);

  scene.add(new THREE.AmbientLight(0x9fb3ff, 0.42));
  var key = new THREE.DirectionalLight(0xfff0d6, 1.15); key.position.set(6, 5, 9); scene.add(key);
  var rim = new THREE.DirectionalLight(0x7fa6ff, 0.7); rim.position.set(-8, 3, -6); scene.add(rim);
  var glow = new THREE.PointLight(0xffc766, 0, 30); glow.position.set(3, 1, 4); scene.add(glow);

  /* ---- flag texture: 13 stripes, 50-star canton ---- */
  function flagTexture() {
    var W = 1520, H = 800, c = document.createElement("canvas");
    c.width = W; c.height = H;
    var g = c.getContext("2d"), sh = H / 13;
    for (var i = 0; i < 13; i++) { g.fillStyle = i % 2 ? "#ffffff" : "#b22234"; g.fillRect(0, i * sh, W, sh + 1); }
    var cw = W * 0.4, ch = sh * 7;
    g.fillStyle = "#3c3b6e"; g.fillRect(0, 0, cw, ch);
    g.fillStyle = "#ffffff";
    function star(cx, cy, r) {
      g.beginPath();
      for (var k = 0; k < 10; k++) {
        var rr = k % 2 ? r * 0.38 : r, a = k * Math.PI / 5 - Math.PI / 2;
        g[k ? "lineTo" : "moveTo"](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      g.closePath(); g.fill();
    }
    var dx = cw / 12, dy = ch / 10;
    for (var row = 0; row < 9; row++) {
      var six = row % 2 === 0;
      for (var col = 0; col < (six ? 6 : 5); col++) {
        star(dx * (six ? 1 + col * 2 : 2 + col * 2), dy * (row + 1), dy * 0.4);
      }
    }
    // subtle fabric weave
    g.globalAlpha = 0.05; g.fillStyle = "#000";
    for (var y = 0; y < H; y += 4) g.fillRect(0, y, W, 1);
    g.globalAlpha = 1;
    var t = new THREE.CanvasTexture(c);
    t.anisotropy = renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 1;
    return t;
  }

  var FW = 6, FH = 3.16, SX = 44, SY = 22;
  var flagGeo = new THREE.PlaneGeometry(FW, FH, SX, SY);
  flagGeo.translate(FW / 2, 0, 0);               // hoist edge sits on the pole (x = 0)
  var pos = flagGeo.attributes.position;
  var base = new Float32Array(pos.array);
  var flag = new THREE.Mesh(flagGeo, new THREE.MeshStandardMaterial({
    map: flagTexture(), side: THREE.DoubleSide, roughness: 0.78, metalness: 0.02
  }));
  var rig = new THREE.Group(); scene.add(rig);
  flag.position.set(0, 1.9, 0); rig.add(flag);

  var poleMat = new THREE.MeshStandardMaterial({ color: 0xdfe3ea, metalness: 0.75, roughness: 0.28 });
  var goldMat = new THREE.MeshStandardMaterial({ color: 0xf5c542, metalness: 0.85, roughness: 0.25, emissive: 0x3a2600 });
  var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 12, 20), poleMat);
  pole.position.set(-0.06, -2.4, 0); rig.add(pole);
  var finial = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), goldMat);
  finial.position.set(-0.06, 3.72, 0); rig.add(finial);

  function waveFlag(t, wind) {
    var a = base, arr = pos.array;
    for (var i = 0; i < arr.length; i += 3) {
      var x = a[i], y = a[i + 1], u = x / FW;        // 0 at the pole, 1 at the fly end
      var amp = (0.12 + 0.5 * wind) * u;
      var z = amp * Math.sin(x * 1.25 - t * (2.3 + wind * 1.6) + y * 0.35)
            + amp * 0.35 * Math.sin(x * 2.9 - t * 3.7 + y * 1.1);
      arr[i] = x - u * u * 0.18 * (1 - wind);          // slight slack when the wind is low
      arr[i + 1] = y - u * u * 0.3 * (1 - wind) + amp * 0.12 * Math.sin(x * 2 - t * 2.1);
      arr[i + 2] = z;
    }
    pos.needsUpdate = true;
    flagGeo.computeVertexNormals();
  }

  /* ---- gold stardust that gathers into a star ---- */
  var COUNT = 1600;
  var from = new Float32Array(COUNT * 3), to = new Float32Array(COUNT * 3), phase = new Float32Array(COUNT);
  var starPts = [];
  for (var k = 0; k < 10; k++) {
    var rr = k % 2 ? 2.7 : 6.8, ang = k * Math.PI / 5 + Math.PI / 2;
    starPts.push([Math.cos(ang) * rr, Math.sin(ang) * rr]);
  }
  for (var n = 0; n < COUNT; n++) {
    from[n * 3] = (Math.random() - 0.5) * 34;
    from[n * 3 + 1] = (Math.random() - 0.5) * 20 + 1;
    from[n * 3 + 2] = -14 + Math.random() * 20;
    var seg = n % 10, f = Math.random(), A = starPts[seg], B = starPts[(seg + 1) % 10];
    var jitter = (Math.random() - 0.5) * 0.18;
    to[n * 3] = 3 + A[0] + (B[0] - A[0]) * f + jitter;
    to[n * 3 + 1] = 1.9 + A[1] + (B[1] - A[1]) * f + jitter;
    to[n * 3 + 2] = -3.2 + (Math.random() - 0.5) * 0.4;
    phase[n] = Math.random() * Math.PI * 2;
  }
  var dustGeo = new THREE.BufferGeometry();
  var dustPos = new Float32Array(from);
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  var dot = (function () {
    var c = document.createElement("canvas"); c.width = c.height = 64;
    var g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,226,140,0.9)");
    gr.addColorStop(1, "rgba(255,200,80,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  var dustMat = new THREE.PointsMaterial({
    size: 0.2, map: dot, color: 0xffd76a, transparent: true, opacity: 0.85,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  scene.add(new THREE.Points(dustGeo, dustMat));

  /* ---- scroll choreography ---- */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(e0, e1, x) { var t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }
  // camera keyframes: [p, x, y, z, lookX, lookY]
  var KEYS = [
    [0.00, -3.5, 0.2, 13.5, 3.0, 2.9],   // low, wide: flag high against the night
    [0.45, 9.5, 2.6, 7.5, 3.4, 2.3],     // swing round the fly end: cloth in full 3D
    [0.72, 4.5, 3.4, 9.5, 2.8, 2.6],     // over the top
    [1.00, 3.0, 0.9, 17.5, 3.0, 2.4]     // pull back: flag framed by the golden star
  ];
  var look = new THREE.Vector3(), pointer = { x: 0, y: 0 }, sp = { x: 0, y: 0 };
  window.addEventListener("mousemove", function (e) {
    pointer.x = e.clientX / window.innerWidth - 0.5;
    pointer.y = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  function cameraAt(p) {
    var i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
    var A = KEYS[i], B = KEYS[i + 1], t = smooth(A[0], B[0], p);
    sp.x += (pointer.x - sp.x) * 0.08; sp.y += (pointer.y - sp.y) * 0.08;
    camera.position.set(lerp(A[1], B[1], t) + sp.x * 1.4, lerp(A[2], B[2], t) - sp.y * 0.8, lerp(A[3], B[3], t));
    look.set(lerp(A[4], B[4], t), lerp(A[5], B[5], t), 0);
    camera.lookAt(look);
  }

  function frame(p, now) {
    var t = now * 0.001;
    var wind = 0.35 + 0.65 * smooth(0.05, 0.5, p) - 0.2 * smooth(0.8, 1, p);
    waveFlag(t, wind);
    cameraAt(p);

    var gather = smooth(0.58, 0.95, p);
    for (var n = 0; n < COUNT; n++) {
      var j = n * 3, drift = 0.25 * (1 - gather);
      dustPos[j]     = lerp(from[j], to[j], gather) + Math.sin(t * 0.4 + phase[n]) * drift;
      dustPos[j + 1] = lerp(from[j + 1], to[j + 1], gather) + Math.cos(t * 0.33 + phase[n]) * drift;
      dustPos[j + 2] = lerp(from[j + 2], to[j + 2], gather);
    }
    dustGeo.attributes.position.needsUpdate = true;
    dustMat.size = lerp(0.2, 0.26, gather) * (0.9 + 0.1 * Math.sin(t * 3));
    glow.intensity = 1.6 * gather;
    key.color.setRGB(1, lerp(0.94, 0.86, p), lerp(0.84, 0.66, p));   // warmer as dawn breaks
    renderer.render(scene, camera);
  }

  function resize() {
    var w = sticky.clientWidth || section.clientWidth;
    var h = sticky.clientHeight || window.innerHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // wide screens: captions sit on the left, so frame the flag in the right half
    if (w >= 1000) camera.setViewOffset(w, h, -w * 0.2, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  var visible = true, running = false, lastP = -1;
  function start() { if (running) return; running = true; autoRes.reset(); requestAnimationFrame(loop); }
  function loop(now) {
    if (!visible) { running = false; return; }
    autoRes(now);
    var p = computeProgress();
    frame(p, now);
    if (Math.abs(p - lastP) > 0.0005) { paintCaptions(p); lastP = p; }   // touch the DOM only when scroll moved
    requestAnimationFrame(loop);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); },
      { threshold: 0.001 }).observe(section);
  }
  frame(0, performance.now());
  paintCaptions(0);
  start();
})();
