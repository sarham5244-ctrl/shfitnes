(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var fields = {
    age: { input: document.getElementById("age"), errorEl: document.getElementById("age-error"), min: 10, max: 90, label: "age" },
  };

  var zoneList = document.getElementById("zone-list");
  var ZONES = [
    { name: "Zone 1 — Recovery", min: 0.5, max: 0.6, desc: "Very light, active recovery" },
    { name: "Zone 2 — Fat burn", min: 0.6, max: 0.7, desc: "Light, conversational pace" },
    { name: "Zone 3 — Aerobic", min: 0.7, max: 0.8, desc: "Moderate, steady effort" },
    { name: "Zone 4 — Anaerobic", min: 0.8, max: 0.9, desc: "Hard, uncomfortable pace" },
    { name: "Zone 5 — Max effort", min: 0.9, max: 1.0, desc: "All-out, unsustainable" },
  ];

  function calculate() {
    var age = U.validateField(fields.age);
    if (age === null) { U.hideResult(panel); return; }

    var restingRaw = document.getElementById("resting").value.trim();
    var resting = restingRaw === "" ? null : parseFloat(restingRaw);
    if (resting !== null && (Number.isNaN(resting) || resting < 30 || resting > 120)) {
      document.getElementById("resting-error").querySelector("span").textContent = "Resting heart rate should be between 30 and 120, or left blank.";
      document.getElementById("resting-error").classList.add("is-visible");
      document.getElementById("resting").classList.add("is-invalid");
      U.hideResult(panel);
      return;
    }
    document.getElementById("resting-error").classList.remove("is-visible");
    document.getElementById("resting").classList.remove("is-invalid");

    var maxHr = 220 - age;
    document.getElementById("out-maxhr").textContent = U.fmt(maxHr) + " bpm";

    zoneList.innerHTML = ZONES.map(function (z) {
      var lo, hi;
      if (resting !== null) {
        lo = (maxHr - resting) * z.min + resting;
        hi = (maxHr - resting) * z.max + resting;
      } else {
        lo = maxHr * z.min;
        hi = maxHr * z.max;
      }
      return '<div class="meal-split-row"><span class="msr-name">' + z.name + '<br><span style="font-weight:400; color:var(--text-tertiary); font-size:.78rem;">' + z.desc + '</span></span><span class="msr-g">' + U.fmt(lo) + '-' + U.fmt(hi) + ' bpm</span></div>';
    }).join("");

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    document.getElementById("resting-error").classList.remove("is-visible");
    document.getElementById("resting").classList.remove("is-invalid");
    U.hideResult(panel);
    zoneList.innerHTML = "";
  });
})();
