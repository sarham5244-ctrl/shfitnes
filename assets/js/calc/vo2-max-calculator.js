(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "m";
  var currentSex = "male";

  var fields = {
    distance: { input: document.getElementById("distance"), errorEl: document.getElementById("distance-error"), min: 800, max: 5000, label: "distance" },
    age: { input: document.getElementById("age"), errorEl: document.getElementById("age-error"), min: 10, max: 90, label: "age" },
  };

  U.wireSegmented(form, "sex", function (value) { currentSex = value; });
  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var suffixEl = fields.distance.input.parentElement.querySelector(".input-suffix");
    if (value === "mi") {
      suffixEl.textContent = "mi";
      fields.distance.min = 0.5; fields.distance.max = 3.1; fields.distance.input.min = 0.5; fields.distance.input.max = 3.1; fields.distance.input.step = 0.01; fields.distance.input.placeholder = "e.g. 1.5";
    } else {
      suffixEl.textContent = "m";
      fields.distance.min = 800; fields.distance.max = 5000; fields.distance.input.min = 800; fields.distance.input.max = 5000; fields.distance.input.step = 10; fields.distance.input.placeholder = "e.g. 2400";
    }
  });

  var marker = document.getElementById("range-marker");
  var catEl = document.getElementById("out-category");

  function categoryFor(vo2, age, sex) {
    // simplified generic thresholds, not heavily age/sex segmented
    var base = sex === "male" ? 0 : -6;
    var v = vo2 - base;
    if (v < 30) return { label: "Below average", cls: "cat-under", pct: (vo2 / 30) * 20 };
    if (v < 40) return { label: "Average", cls: "cat-moderate", pct: 20 + ((vo2 - 30) / 10) * 25 };
    if (v < 50) return { label: "Good", cls: "cat-healthy", pct: 45 + ((vo2 - 40) / 10) * 25 };
    return { label: "Excellent", cls: "cat-high", pct: Math.min(70 + ((vo2 - 50) / 15) * 30, 100) };
  }

  function calculate() {
    var distance = U.validateField(fields.distance);
    var age = U.validateField(fields.age);
    if (distance === null || age === null) { U.hideResult(panel); return; }

    var distanceM = currentUnits === "mi" ? distance * 1609.34 : distance;
    var vo2 = (distanceM - 504.9) / 44.73;
    vo2 = Math.max(vo2, 10);

    var cat = categoryFor(vo2, age, currentSex);
    catEl.textContent = cat.label;
    catEl.className = "result-category " + cat.cls;
    U.setMarker(marker, cat.pct);

    document.getElementById("out-vo2").textContent = U.fmt(vo2, 1) + " ml/kg/min";

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
