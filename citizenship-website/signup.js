/* =============================================================
   Interlake ICSC — signup
   - 4-step wizard with 3D page turns (plain long form without JS)
   - Live 3D "Tutoring Pass" card that fills in as you type,
     flips to show your week on the schedule step
   - N/A switches, per-day schedule picker, review + edit
   - Confetti launch on submit
   Field names are unchanged so FormSubmit emails look the same.
   ============================================================= */
(function () {
  "use strict";

  var section = document.getElementById("signup");
  var form = document.getElementById("signup-form");
  if (!section || !form) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var panels = $$(".su-panel", form);
  var steps = $$(".su-step", form);
  var LAST = panels.length - 1;
  var bar = $(".su-progress span", form);
  var btnNext = $(".su-next", form);
  var btnBack = $(".su-prev", form);
  var stepOf = $(".su-stepof", form);
  var email = $("#email");
  var phone = $("#phone");
  var nativeLang = $("#native_language");
  var testDate = $("#test_date");
  var skip = $("#skip_schedule");
  var dayList = $("#day_list");
  var dayRows = $$(".su-day", dayList);
  var card = $("#su-card");
  var cardEls = {};
  $$("[data-card]", card).forEach(function (el) { cardEls[el.getAttribute("data-card")] = el; });

  var cur = 0, sending = false, manualFlip = null, swapTimer = null;

  /* ---------- i18n helpers (I18N lives in script.js) ---------- */
  function lang() {
    var l = (document.documentElement.lang || "en").slice(0, 2);
    return typeof I18N !== "undefined" && I18N[l] ? l : "en";
  }
  function t(key, n) {
    var dict = typeof I18N !== "undefined" ? (I18N[lang()] || I18N.en) : {};
    var s = dict[key] || (typeof I18N !== "undefined" && I18N.en[key]) || "";
    return n == null ? s : s.replace("{n}", n);
  }
  function locale() { return { en: "en-US", es: "es-US", zh: "zh-CN" }[lang()]; }

  /* ---------- wizard mode ---------- */
  form.classList.add("is-wizard");
  form.setAttribute("novalidate", "");
  panels.forEach(function (p) { $(".su-panel-title", p).setAttribute("tabindex", "-1"); });

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function emailOk() { return EMAIL_RE.test(email.value.trim()); }
  function setEmailError(on) {
    var field = email.closest(".su-field");
    field.classList.toggle("is-invalid", on);
    $("#email-err").hidden = !on;
    email.setAttribute("aria-invalid", on ? "true" : "false");
    if (on) {
      field.classList.remove("shake");
      void field.offsetWidth; // restart the shake
      field.classList.add("shake");
    }
  }
  email.addEventListener("input", function () {
    if (email.closest(".su-field").classList.contains("is-invalid") && emailOk()) setEmailError(false);
  });

  function validate(i) {
    if (i === 0 && !emailOk()) { setEmailError(true); return false; }
    return true;
  }

  function show(panel, focus) {
    panels.forEach(function (p) { p.classList.remove("is-active", "is-leaving"); });
    panel.classList.add("is-active");
    if (focus) $(".su-panel-title", panel).focus({ preventScroll: true });
  }

  function go(i, focus) {
    i = Math.max(0, Math.min(LAST, i));
    if (i === cur) return;
    if (i > cur) {
      for (var k = cur; k < i; k++) {
        if (!validate(k)) {
          if (k !== cur) go(k);
          if (k === 0) setTimeout(function () { email.focus(); }, reduced ? 0 : 260);
          return;
        }
      }
    }
    form.setAttribute("data-dir", i > cur ? "fwd" : "back");
    cur = i;
    manualFlip = null;
    var to = panels[i];

    clearTimeout(swapTimer);
    if (reduced) {
      show(to, focus);
    } else {
      panels.forEach(function (p) { if (p.classList.contains("is-active")) p.classList.add("is-leaving"); });
      swapTimer = setTimeout(function () { show(to, focus); }, 190);
    }
    if (i === LAST) renderReview();
    paintChrome();
    syncCard();

    // keep the top of the form in view when a tall step shrinks
    var r = form.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.6) {
      window.scrollTo({ top: window.pageYOffset + r.top - 90, behavior: reduced ? "auto" : "smooth" });
    }
  }

  function paintChrome() {
    steps.forEach(function (s, k) {
      s.classList.toggle("is-active", k === cur);
      s.classList.toggle("is-done", k < cur);
      var b = $("button", s);
      if (k === cur) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    bar.style.transform = "scaleX(" + (cur + 1) / panels.length + ")";
    btnBack.style.visibility = cur === 0 ? "hidden" : "visible";
    btnNext.hidden = cur === LAST;
    stepOf.textContent = t("su.stepof", cur + 1);
  }

  btnNext.addEventListener("click", function () { go(cur + 1, true); });
  btnBack.addEventListener("click", function () { go(cur - 1, true); });
  steps.forEach(function (s, k) { $("button", s).addEventListener("click", function () { go(k, true); }); });

  // Enter in a text field moves forward instead of submitting early
  form.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || cur === LAST) return;
    if (!/^(email|tel|text|date)$/.test(e.target.type || "")) return;
    e.preventDefault();
    go(cur + 1, true);
  });

  /* ---------- N/A switches ---------- */
  $$("input[data-na-for]", form).forEach(function (cb) {
    var field = document.getElementById(cb.getAttribute("data-na-for"));
    if (!field) return;
    var wrap = field.closest(".su-field");
    var isDate = field.type === "date";
    cb.addEventListener("change", function () {
      if (cb.checked) {
        field.dataset.prev = field.value;
        if (isDate) field.type = "text"; // a date input can't hold "N/A"
        field.value = "N/A";
        field.readOnly = true; // read-only (not disabled) so "N/A" is still submitted
      } else {
        field.readOnly = false;
        if (isDate) field.type = "date";
        field.value = field.dataset.prev || "";
      }
      wrap.classList.toggle("is-na", cb.checked);
      syncCard();
    });
  });

  /* ---------- schedule picker ---------- */
  function schedule() {
    return dayRows.map(function (row) {
      return {
        row: row,
        day: row.getAttribute("data-day"),
        key: $(".su-day-name", row).getAttribute("data-i18n"),
        times: $$(".chip input:checked", row).map(function (c) { return c.value; }),
        total: $$(".chip input", row).length
      };
    });
  }

  function slotsText(n) { return n === 1 ? t("su.slot1") : t("su.slots", n); }

  function updateSchedule() {
    var n = 0;
    schedule().forEach(function (d) {
      n += d.times.length;
      $(".su-day-count", d.row).textContent = d.times.length || "";
      d.row.classList.toggle("has-picks", d.times.length > 0);
    });
    $(".su-slot-total", form).textContent = n ? slotsText(n) : "";
    syncCard();
  }

  dayRows.forEach(function (row) {
    var toggle = $(".day-toggle", row);
    toggle.addEventListener("change", function () {
      row.classList.toggle("is-open", toggle.checked);
      // closing a day clears its times so hidden picks never get submitted
      if (!toggle.checked) $$(".chip input", row).forEach(function (c) { c.checked = false; });
      updateSchedule();
    });
    $$(".chip input", row).forEach(function (c) { c.addEventListener("change", updateSchedule); });
  });

  skip.addEventListener("change", function () {
    dayList.classList.toggle("is-disabled", skip.checked);
    dayList.inert = skip.checked;
    if (skip.checked) {
      $$('input[type="checkbox"]', dayList).forEach(function (c) { c.checked = false; });
      dayRows.forEach(function (r) { r.classList.remove("is-open"); });
    }
    updateSchedule();
  });

  /* ---------- live pass card ---------- */
  function parseDate(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function fmtDate(d) {
    return d.toLocaleDateString(locale(), { month: "short", day: "numeric", year: "numeric" });
  }

  function syncCard() {
    var e = email.value.trim();
    cardEls.email.textContent = e || "you@example.com";
    cardEls.email.classList.toggle("is-empty", !e);
    cardEls.lang.textContent = nativeLang.value.trim() || "—";

    var d = parseDate(testDate.value);
    cardEls.date.textContent = d ? fmtDate(d) : (testDate.value || "—");
    var count = "";
    if (d) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var days = Math.round((d - today) / 86400000);
      if (days === 0) count = t("su.today");
      else if (days === 1) count = t("su.day1");
      else if (days > 1) count = t("su.days", days);
    }
    cardEls.count.textContent = count;

    var n = 0;
    schedule().forEach(function (dd) {
      n += dd.times.length;
      var col = $('.su-wday[data-wday="' + dd.day + '"]', card);
      col.style.setProperty("--fill", dd.times.length / dd.total);
      col.classList.toggle("is-on", dd.times.length > 0);
    });
    cardEls.slots.textContent = skip.checked ? t("su.sched.none") : slotsText(n);

    card.classList.toggle("is-flipped", manualFlip !== null ? manualFlip : cur === 2);
    card.classList.toggle("is-ready", cur === LAST && emailOk());
  }

  function localizeWeek() {
    var labels = t("su.wk").split(",");
    $$(".su-wlabel", card).forEach(function (el, i) { if (labels[i]) el.textContent = labels[i]; });
  }

  form.addEventListener("input", syncCard);
  form.addEventListener("change", syncCard);

  var stage = $(".su-stage");
  stage.addEventListener("click", function () {
    manualFlip = !card.classList.contains("is-flipped");
    syncCard();
  });

  /* ---------- review step ---------- */
  function renderReview() {
    var dl = $("#su-review");
    dl.innerHTML = "";
    function row(label, value, step) {
      var wrap = document.createElement("div");
      wrap.className = "su-rv-row" + (value ? "" : " is-muted");
      wrap.style.setProperty("--i", dl.children.length);
      var dt = document.createElement("dt"); dt.textContent = label;
      var dd = document.createElement("dd"); dd.textContent = value || t("su.none");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "su-rv-edit";
      b.textContent = t("su.edit");
      b.addEventListener("click", function () { go(step, true); });
      wrap.appendChild(dt); wrap.appendChild(dd); wrap.appendChild(b);
      dl.appendChild(wrap);
    }
    var d = parseDate(testDate.value);
    var picked = schedule().filter(function (x) { return x.times.length; });
    var sched = picked.map(function (x) { return t(x.key) + ": " + x.times.join(", "); }).join("\n");

    row(t("su.rv.email"), email.value.trim(), 0);
    row(t("form.phone"), phone.value.trim(), 0);
    row(t("form.lang"), nativeLang.value.trim(), 1);
    row(t("su.card.test"), d ? fmtDate(d) : testDate.value.trim(), 1);
    row(t("su.rv.sched"), skip.checked ? t("su.sched.none") : sched, 2);
  }

  /* ---------- submit ---------- */
  function confetti(origin) {
    if (reduced) return;
    var r = origin.getBoundingClientRect();
    var layer = document.createElement("div");
    layer.className = "su-confetti";
    layer.setAttribute("aria-hidden", "true");
    layer.style.left = r.left + r.width / 2 + "px";
    layer.style.top = r.top + r.height / 2 + "px";
    var colors = ["#f5c542", "#ffdd6b", "#14306a", "#1e4391", "#ffffff", "#c0392b"];
    for (var i = 0; i < 80; i++) {
      var p = document.createElement("i");
      var a = Math.random() * Math.PI * 2, dist = 110 + Math.random() * 280;
      p.style.setProperty("--dx", Math.cos(a) * dist + "px");
      p.style.setProperty("--dy", Math.sin(a) * dist * 0.8 - 170 + "px");
      p.style.setProperty("--rot", Math.random() * 900 - 450 + "deg");
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 90 + "ms";
      layer.appendChild(p);
    }
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 1900);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    if (cur < LAST) { go(cur + 1, true); return; }
    if (!emailOk()) { go(0); setTimeout(function () { validate(0); email.focus(); }, reduced ? 0 : 260); return; }

    sending = true;
    form.classList.add("is-sending");
    $(".su-submit-text", form).textContent = t("su.sending");
    card.classList.remove("is-flipped");
    card.classList.add("is-launch");
    confetti($(".su-submit", form));
    setTimeout(function () { HTMLFormElement.prototype.submit.call(form); }, reduced ? 0 : 950);
  });

  // coming back with the browser's Back button: un-stick the sending state
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    sending = false;
    form.classList.remove("is-sending");
    card.classList.remove("is-launch");
    $(".su-submit-text", form).textContent = t("form.submit");
  });

  /* ---------- section motion: entrance, pointer glow, card tilt ---------- */
  if (!reduced && "IntersectionObserver" in window) {
    section.classList.add("anim-ready");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { section.classList.add("is-in"); io.disconnect(); }
      });
    }, { threshold: 0.12 });
    io.observe(section);
    setTimeout(function () { section.classList.add("is-in"); }, 9000); // failsafe
  }

  if (!reduced && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    var tilt = $(".su-tilt"), pending = null;
    section.addEventListener("pointermove", function (ev) {
      if (pending) return;
      var x = ev.clientX, y = ev.clientY;
      pending = requestAnimationFrame(function () {
        pending = null;
        var sr = section.getBoundingClientRect();
        section.style.setProperty("--gx", x - sr.left + "px");
        section.style.setProperty("--gy", y - sr.top + "px");

        var r = stage.getBoundingClientRect();
        var px = Math.max(-1, Math.min(1, (x - (r.left + r.width / 2)) / (window.innerWidth / 2)));
        var py = Math.max(-1, Math.min(1, (y - (r.top + r.height / 2)) / (window.innerHeight / 2)));
        tilt.style.setProperty("--ry", (-16 + px * 26).toFixed(2) + "deg");
        tilt.style.setProperty("--rx", (9 - py * 16).toFixed(2) + "deg");
        card.style.setProperty("--mx", (50 + px * 45).toFixed(1) + "%");
        card.style.setProperty("--my", (40 + py * 40).toFixed(1) + "%");
      });
    });
    section.addEventListener("pointerleave", function () {
      tilt.style.removeProperty("--ry");
      tilt.style.removeProperty("--rx");
    });
  }

  /* ---------- language switch ---------- */
  document.addEventListener("icsc:lang", function () {
    localizeWeek();
    paintChrome();
    updateSchedule();
    if (cur === LAST) renderReview();
    if (sending) $(".su-submit-text", form).textContent = t("su.sending");
  });

  localizeWeek();
  paintChrome();
  updateSchedule();
})();
