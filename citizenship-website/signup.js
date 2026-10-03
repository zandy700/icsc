/* =============================================================
   Interlake ICSC — signup page (/signup/)
   - 4-step wizard (Contact, About you, Schedule, Review);
     without JS every step shows at once as a plain long form
   - N/A switches, per-day schedule picker, review with Edit links
   Field names are unchanged so FormSubmit emails look the same.
   ============================================================= */
(function () {
  "use strict";

  var form = document.getElementById("signup-form");
  if (!form) return;

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
  var cur = 0, sending = false;

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

  function go(i, focus) {
    i = Math.max(0, Math.min(LAST, i));
    if (i === cur) return;
    if (i > cur && cur === 0 && !emailOk()) {   // only step 1 has a required field
      setEmailError(true);
      email.focus();
      return;
    }
    cur = i;
    panels.forEach(function (p, k) { p.classList.toggle("is-active", k === i); });
    if (i === LAST) renderReview();
    paint();
    if (focus) $(".su-panel-title", panels[i]).focus({ preventScroll: true });

    // keep the top of the form in view when a step changes height
    var r = form.getBoundingClientRect();
    if (r.top < 70) window.scrollTo({ top: window.pageYOffset + r.top - 100, behavior: "smooth" });
  }

  function paint() {
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
        field.readOnly = true;           // read-only (not disabled) so "N/A" is still submitted
      } else {
        field.readOnly = false;
        if (isDate) field.type = "date";
        field.value = field.dataset.prev || "";
      }
      wrap.classList.toggle("is-na", cb.checked);
    });
  });

  /* ---------- schedule picker ---------- */
  function schedule() {
    return dayRows.map(function (row) {
      return {
        row: row,
        key: $(".su-day-name", row).getAttribute("data-i18n"),
        times: $$(".su-times input:checked", row).map(function (c) { return c.value; })
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
  }

  dayRows.forEach(function (row) {
    var toggle = $(".day-toggle", row);
    toggle.addEventListener("change", function () {
      row.classList.toggle("is-open", toggle.checked);
      // closing a day clears its times so hidden picks never get submitted
      if (!toggle.checked) $$(".su-times input", row).forEach(function (c) { c.checked = false; });
      updateSchedule();
    });
    $$(".su-times input", row).forEach(function (c) { c.addEventListener("change", updateSchedule); });
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

  /* ---------- review step ---------- */
  function parseDate(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function renderReview() {
    var dl = $("#su-review");
    dl.innerHTML = "";
    function row(label, value, step) {
      var wrap = document.createElement("div");
      wrap.className = "su-rv-row" + (value ? "" : " is-muted");
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
    row(t("su.rv.test"), d ? d.toLocaleDateString(locale(), { month: "short", day: "numeric", year: "numeric" }) : testDate.value.trim(), 1);
    row(t("su.rv.sched"), skip.checked ? t("su.sched.none") : sched, 2);
  }

  /* ---------- submit ---------- */
  form.addEventListener("submit", function (e) {
    if (sending) { e.preventDefault(); return; }
    if (cur < LAST) { e.preventDefault(); go(cur + 1, true); return; }
    if (!emailOk()) { e.preventDefault(); go(0); setEmailError(true); email.focus(); return; }
    sending = true;
    form.classList.add("is-sending");
    $(".su-submit-text", form).textContent = t("su.sending");
    // let the browser submit normally to FormSubmit
  });

  // coming back with the browser's Back button: un-stick the sending state
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    sending = false;
    form.classList.remove("is-sending");
    $(".su-submit-text", form).textContent = t("form.submit");
  });

  /* ---------- language switch ---------- */
  document.addEventListener("icsc:lang", function () {
    paint();
    updateSchedule();
    if (cur === LAST) renderReview();
    if (sending) $(".su-submit-text", form).textContent = t("su.sending");
  });

  paint();
  updateSchedule();
})();
