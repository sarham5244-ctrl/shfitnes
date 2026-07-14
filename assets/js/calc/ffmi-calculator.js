(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "metric";
  var currentSex = "male";

  var fields = {
    height: { input: document.getElementById("height"), errorEl: document.getElementById("height-error"), min: 120, max: 230, label: "height" },
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 30, max: 250, label: "weight" },
    bodyfat: { input: document.getElementById("bodyfat"), errorEl: document.getElementById("bodyfat-error"), min: 3, max: 60, label: "body fat percentage" },
  };

  U.wireSegmented(form, "sex", function (value) { currentSex = value; });
  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var heightSuffix = fields.height.input.parentElement.querySelector(".input-suffix");
    var weightSuffix = fields.weight.input.parentElement.querySelector(".input-suffix");
    if (value === "imperial") {
      heightSuffix.textContent = "in";
      fields.height.min = 47; fields.height.max = 91; fields.height.input.min = 47; fields.height.input.max = 91; fields.height.input.placeholder = "e.g. 70";
      weightSuffix.textContent = "lb";
      fields.weight.min = 66; fields.weight.max = 550; fields.weight.input.min = 66; fields.weight.input.max = 550; fields.weight.input.placeholder = "e.g. 180";
    } else {
      heightSuffix.textContent = "cm";
      fields.height.min = 120; fields.height.max = 230; fields.height.input.min = 120; fields.height.input.max = 230; fields.height.input.placeholder = "e.g. 178";
      weightSuffix.textContent = "kg";
      fields.weight.min = 30; fields.weight.max = 250; fields.weight.input.min = 30; fields.weight.input.max = 250; fields.weight.input.placeholder = "e.g. 82";
    }
  });

  var marker = document.getElementById("range-marker");
  var catEl = document.getElementById("out-category");

  function categoryFor(ffmi, sex) {
    var offset = sex === "female" ? 4.5 : 0;
    var v = ffmi + offset;
    if (v < 18) return { label: "Below average", cls: "cat-under" };
    if (v < 20) return { label: "Average", cls: "cat-moderate" };
    if (v < 22) return { label: "Above average", cls: "cat-healthy" };
    if (v < 25) return { label: "Very muscular", cls: "cat-healthy" };
    return { label: "Exceptional", cls: "cat-high" };
  }

  function calculate() {
    var height = U.validateField(fields.height);
    var weightRaw = U.validateField(fields.weight);
    var bodyfat = U.validateField(fields.bodyfat);
    if (height === null || weightRaw === null || bodyfat === null) { U.hideResult(panel); return; }

    var heightCm = currentUnits === "imperial" ? U.inToCm(height) : height;
    var weightKg = currentUnits === "imperial" ? U.lbToKg(weightRaw) : weightRaw;
    var heightM = heightCm / 100;

    var ffm = weightKg * (1 - bodyfat / 100);
    var rawFfmi = ffm / (heightM * heightM);
    var normFfmi = rawFfmi + 6.1 * (1.8 - heightM);

    var cat = categoryFor(normFfmi, currentSex);
    catEl.textContent = cat.label;
    catEl.className = "result-category " + cat.cls;
    U.setMarker(marker, Math.max(0, Math.min(100, ((normFfmi - 15) / (30 - 15)) * 100)));

    document.getElementById("out-ffmi").textContent = U.fmt(normFfmi, 1);
    document.getElementById("out-raw-ffmi").textContent = U.fmt(rawFfmi, 1);
    var displayFfm = currentUnits === "imperial" ? U.kgToLb(ffm) : ffm;
    document.getElementById("out-ffm").textContent = U.fmt(displayFfm, 1) + (currentUnits === "imperial" ? " lb" : " kg");

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
