(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "metric";
  var currentSex = "male";
  var hipGroup = document.getElementById("hip-group");

  var fields = {
    height: { input: document.getElementById("height"), errorEl: document.getElementById("height-error"), min: 120, max: 230, label: "height" },
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 30, max: 250, label: "weight" },
    neck: { input: document.getElementById("neck"), errorEl: document.getElementById("neck-error"), min: 20, max: 60, label: "neck measurement" },
    waist: { input: document.getElementById("waist"), errorEl: document.getElementById("waist-error"), min: 50, max: 180, label: "waist measurement" },
    hip: { input: document.getElementById("hip"), errorEl: document.getElementById("hip-error"), min: 50, max: 180, label: "hip measurement" },
  };

  function updateUnitLabels() {
    var suffix = currentUnits === "imperial" ? "in" : "cm";
    [fields.height, fields.neck, fields.waist, fields.hip].forEach(function (f) {
      var suffixEl = f.input.parentElement.querySelector(".input-suffix");
      if (suffixEl) suffixEl.textContent = suffix;
    });
    var weightSuffixEl = fields.weight.input.parentElement.querySelector(".input-suffix");
    if (currentUnits === "imperial") {
      weightSuffixEl.textContent = "lb";
      fields.weight.min = 66; fields.weight.max = 550; fields.weight.input.min = 66; fields.weight.input.max = 550; fields.weight.input.placeholder = "e.g. 172";
    } else {
      weightSuffixEl.textContent = "kg";
      fields.weight.min = 30; fields.weight.max = 250; fields.weight.input.min = 30; fields.weight.input.max = 250; fields.weight.input.placeholder = "e.g. 78";
    }
    if (currentUnits === "imperial") {
      fields.height.min = 47; fields.height.max = 91; fields.height.input.min = 47; fields.height.input.max = 91; fields.height.input.placeholder = "e.g. 70";
      fields.neck.min = 8; fields.neck.max = 24; fields.neck.input.min = 8; fields.neck.input.max = 24; fields.neck.input.placeholder = "e.g. 15";
      fields.waist.min = 20; fields.waist.max = 70; fields.waist.input.min = 20; fields.waist.input.max = 70; fields.waist.input.placeholder = "e.g. 33";
      fields.hip.min = 20; fields.hip.max = 70; fields.hip.input.min = 20; fields.hip.input.max = 70; fields.hip.input.placeholder = "e.g. 39";
    } else {
      fields.height.min = 120; fields.height.max = 230; fields.height.input.min = 120; fields.height.input.max = 230; fields.height.input.placeholder = "e.g. 178";
      fields.neck.min = 20; fields.neck.max = 60; fields.neck.input.min = 20; fields.neck.input.max = 60; fields.neck.input.placeholder = "e.g. 38";
      fields.waist.min = 50; fields.waist.max = 180; fields.waist.input.min = 50; fields.waist.input.max = 180; fields.waist.input.placeholder = "e.g. 85";
      fields.hip.min = 50; fields.hip.max = 180; fields.hip.input.min = 50; fields.hip.input.max = 180; fields.hip.input.placeholder = "e.g. 98";
    }
  }

  U.wireSegmented(form, "units", function (value) { currentUnits = value; updateUnitLabels(); });
  U.wireSegmented(form, "sex", function (value) {
    currentSex = value;
    hipGroup.style.display = value === "female" ? "block" : "none";
  });

  var marker = document.getElementById("range-marker");
  var catEl = document.getElementById("out-category");

  function categoryFor(bf, sex) {
    if (sex === "male") {
      if (bf < 14) return { label: "Athletic", cls: "cat-under", pct: (bf / 6) * 12.5 };
      if (bf < 18) return { label: "Fit", cls: "cat-healthy", pct: 25 + ((bf - 14) / 4) * 12.5 };
      if (bf < 25) return { label: "Average", cls: "cat-moderate", pct: 37.5 + ((bf - 18) / 7) * 25 };
      return { label: "High", cls: "cat-high", pct: Math.min(62.5 + ((bf - 25) / 10) * 37.5, 100) };
    } else {
      if (bf < 21) return { label: "Athletic", cls: "cat-under", pct: (bf / 21) * 25 };
      if (bf < 25) return { label: "Fit", cls: "cat-healthy", pct: 25 + ((bf - 21) / 4) * 12.5 };
      if (bf < 32) return { label: "Average", cls: "cat-moderate", pct: 37.5 + ((bf - 25) / 7) * 25 };
      return { label: "High", cls: "cat-high", pct: Math.min(62.5 + ((bf - 32) / 10) * 37.5, 100) };
    }
  }

  function calculate() {
    var height = U.validateField(fields.height);
    var weightRaw = U.validateField(fields.weight);
    var neck = U.validateField(fields.neck);
    var waist = U.validateField(fields.waist);
    var hip = currentSex === "female" ? U.validateField(fields.hip) : null;

    if (height === null || weightRaw === null || neck === null || waist === null || (currentSex === "female" && hip === null)) {
      U.hideResult(panel);
      return;
    }

    var weightKg = currentUnits === "imperial" ? U.lbToKg(weightRaw) : weightRaw;
    var heightIn = currentUnits === "imperial" ? height : U.cmToIn(height);
    var neckIn = currentUnits === "imperial" ? neck : U.cmToIn(neck);
    var waistIn = currentUnits === "imperial" ? waist : U.cmToIn(waist);
    var hipIn = hip !== null ? (currentUnits === "imperial" ? hip : U.cmToIn(hip)) : 0;

    var bf;
    if (currentSex === "male") {
      bf = 86.010 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
    } else {
      bf = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
    }
    bf = Math.max(bf, 2);

    var cat = categoryFor(bf, currentSex);
    catEl.textContent = cat.label;
    catEl.className = "result-category " + cat.cls;
    U.setMarker(marker, cat.pct);

    document.getElementById("out-bf").textContent = U.fmt(bf, 1) + "%";

    var fatMassKg = weightKg * (bf / 100);
    var leanMassKg = weightKg - fatMassKg;
    var displayFat = currentUnits === "imperial" ? U.kgToLb(fatMassKg) : fatMassKg;
    var displayLean = currentUnits === "imperial" ? U.kgToLb(leanMassKg) : leanMassKg;
    var unitLabel = currentUnits === "imperial" ? " lb" : " kg";
    document.getElementById("out-fat-mass").textContent = U.fmt(displayFat, 1) + unitLabel;
    document.getElementById("out-lean-mass").textContent = U.fmt(displayLean, 1) + unitLabel;

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
    hipGroup.style.display = "none";
  });
})();
