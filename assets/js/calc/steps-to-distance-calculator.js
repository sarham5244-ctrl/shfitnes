(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "metric";
  var fields = {
    steps: { input: document.getElementById("steps"), errorEl: document.getElementById("steps-error"), min: 100, max: 100000, label: "steps" },
    height: { input: document.getElementById("height"), errorEl: document.getElementById("height-error"), min: 120, max: 230, label: "height" },
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 30, max: 250, label: "weight" },
  };

  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var heightSuffix = fields.height.input.parentElement.querySelector(".input-suffix");
    var weightSuffix = fields.weight.input.parentElement.querySelector(".input-suffix");
    if (value === "imperial") {
      heightSuffix.textContent = "in";
      fields.height.min = 47; fields.height.max = 91; fields.height.input.min = 47; fields.height.input.max = 91; fields.height.input.placeholder = "e.g. 70";
      weightSuffix.textContent = "lb";
      fields.weight.min = 66; fields.weight.max = 550; fields.weight.input.min = 66; fields.weight.input.max = 550; fields.weight.input.placeholder = "e.g. 172";
    } else {
      heightSuffix.textContent = "cm";
      fields.height.min = 120; fields.height.max = 230; fields.height.input.min = 120; fields.height.input.max = 230; fields.height.input.placeholder = "e.g. 178";
      weightSuffix.textContent = "kg";
      fields.weight.min = 30; fields.weight.max = 250; fields.weight.input.min = 30; fields.weight.input.max = 250; fields.weight.input.placeholder = "e.g. 78";
    }
  });

  function calculate() {
    var steps = U.validateField(fields.steps);
    var height = U.validateField(fields.height);
    var weightRaw = U.validateField(fields.weight);
    if (steps === null || height === null || weightRaw === null) { U.hideResult(panel); return; }

    var heightCm = currentUnits === "imperial" ? U.inToCm(height) : height;
    var weightKg = currentUnits === "imperial" ? U.lbToKg(weightRaw) : weightRaw;

    var strideM = (heightCm * 0.414) / 100;
    var distanceKm = (steps * strideM) / 1000;
    var timeMin = (distanceKm / 5) * 60;
    var calories = steps * 0.0005 * weightKg;

    var isImperial = currentUnits === "imperial";
    var displayDistance = isImperial ? distanceKm / 1.60934 : distanceKm;
    var displayStride = isImperial ? U.cmToIn(strideM * 100) : strideM * 100;

    document.getElementById("out-distance").textContent = U.fmt(displayDistance, 2) + (isImperial ? " mi" : " km");
    document.getElementById("out-time").textContent = U.fmt(timeMin) + " min";
    document.getElementById("out-calories").textContent = U.fmt(calories) + " kcal";
    document.getElementById("out-stride").textContent = U.fmt(displayStride, isImperial ? 1 : 0) + (isImperial ? " in" : " cm");

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
