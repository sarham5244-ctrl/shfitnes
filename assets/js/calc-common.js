/* ============================================================
   calc-common.js — shared helpers for every calculator page.
   Loaded on every /calculators/*.html page alongside main.js
   and that page's own small calculator script.
   ============================================================ */

window.SHFTCalc = (function () {
  "use strict";

  /* ---------------- unit conversion ---------------- */
  var LB_PER_KG = 2.20462262;
  var CM_PER_IN = 2.54;

  function lbToKg(lb) { return lb / LB_PER_KG; }
  function kgToLb(kg) { return kg * LB_PER_KG; }
  function inToCm(inches) { return inches * CM_PER_IN; }
  function cmToIn(cm) { return cm / CM_PER_IN; }
  function ftInToCm(feet, inches) { return inToCm((feet || 0) * 12 + (inches || 0)); }
  function cmToFtIn(cm) {
    var totalIn = cmToIn(cm);
    var feet = Math.floor(totalIn / 12);
    var inches = Math.round(totalIn - feet * 12);
    if (inches === 12) { feet += 1; inches = 0; }
    return { feet: feet, inches: inches };
  }

  /* ---------------- validation ---------------- */
  // field: { input: HTMLElement, errorEl: HTMLElement, min, max, label }
  function validateField(field) {
    var raw = field.input.value.trim();
    var value = parseFloat(raw);
    var invalid = raw === "" || Number.isNaN(value) || value < field.min || value > field.max;

    field.input.classList.toggle("is-invalid", invalid);
    if (field.errorEl) {
      field.errorEl.classList.toggle("is-visible", invalid);
      if (invalid) {
        field.errorEl.querySelector("span") && (field.errorEl.querySelector("span").textContent =
          raw === "" ? "Enter your " + field.label + "." : field.label + " should be between " + field.min + " and " + field.max + ".");
      }
    }
    return invalid ? null : value;
  }

  function clearField(field) {
    field.input.classList.remove("is-invalid");
    if (field.errorEl) field.errorEl.classList.remove("is-visible");
  }

  /* ---------------- formatting ---------------- */
  function fmt(value, decimals) {
    if (decimals === undefined) decimals = 0;
    if (!Number.isFinite(value)) return "—";
    return value.toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  /* ---------------- result panel show/hide ---------------- */
  function showResult(panel) { panel.classList.remove("is-empty"); }
  function hideResult(panel) { panel.classList.add("is-empty"); }

  /* ---------------- pie / donut chart helper ----------------
     circles: array of { el: <circle>, value: number } sharing one
     total; sets stroke-dasharray/dashoffset around the ring so
     they read clockwise from the top (wrapper already has
     transform: rotate(-90deg)). radius must match the circle's
     r attribute. */
  function paintRing(circles, radius) {
    var circumference = 2 * Math.PI * radius;
    var total = circles.reduce(function (sum, c) { return sum + Math.max(c.value, 0); }, 0) || 1;
    var offset = 0;
    circles.forEach(function (c) {
      var portion = Math.max(c.value, 0) / total;
      var dash = portion * circumference;
      c.el.setAttribute("stroke-dasharray", dash.toFixed(2) + " " + circumference.toFixed(2));
      c.el.setAttribute("stroke-dashoffset", (-offset).toFixed(2));
      offset += dash;
    });
  }

  /* ---------------- range bar marker ---------------- */
  // percent: 0-100, clamps for safety
  function setMarker(markerEl, percent) {
    var clamped = Math.max(0, Math.min(100, percent));
    markerEl.style.left = clamped + "%";
  }

  /* ---------------- segmented control (unit toggle etc.) ----------------
     wires a group of radio inputs sharing `name` to call
     onChange(value) whenever selection changes, and returns the
     currently checked value. */
  function wireSegmented(form, name, onChange) {
    var inputs = form.querySelectorAll('input[name="' + name + '"]');
    inputs.forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked) onChange(input.value);
      });
    });
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : null;
  }

  return {
    lbToKg: lbToKg,
    kgToLb: kgToLb,
    inToCm: inToCm,
    cmToIn: cmToIn,
    ftInToCm: ftInToCm,
    cmToFtIn: cmToFtIn,
    validateField: validateField,
    clearField: clearField,
    fmt: fmt,
    showResult: showResult,
    hideResult: hideResult,
    paintRing: paintRing,
    setMarker: setMarker,
    wireSegmented: wireSegmented,
  };
})();
