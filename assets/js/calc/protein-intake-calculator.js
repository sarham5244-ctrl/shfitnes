(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "metric";
  var fields = {
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 30, max: 250, label: "weight" },
  };

  var FACTORS = { general: 1.4, active: 1.8, cutting: 2.2, building: 2.0 };

  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var weightInput = fields.weight.input;
    var suffixEl = weightInput.parentElement.querySelector(".input-suffix");
    if (value === "imperial") {
      suffixEl.textContent = "lb";
      weightInput.min = 66; weightInput.max = 550; fields.weight.min = 66; fields.weight.max = 550;
      weightInput.placeholder = "e.g. 172";
    } else {
      suffixEl.textContent = "kg";
      weightInput.min = 30; weightInput.max = 250; fields.weight.min = 30; fields.weight.max = 250;
      weightInput.placeholder = "e.g. 78";
    }
  });

  function calculate() {
    var weightRaw = U.validateField(fields.weight);
    if (weightRaw === null) { U.hideResult(panel); return; }

    var weightKg = currentUnits === "imperial" ? U.lbToKg(weightRaw) : weightRaw;
    var goal = document.getElementById("goal").value;
    var meals = parseInt(document.getElementById("meals").value, 10);

    var perKg = FACTORS[goal];
    var proteinG = perKg * weightKg;
    var calories = proteinG * 4;

    document.getElementById("out-protein").textContent = U.fmt(proteinG) + "g / day";
    document.getElementById("out-per-meal").textContent = U.fmt(proteinG / meals) + "g";
    document.getElementById("out-per-kg").textContent = perKg.toFixed(1) + "g/kg";
    document.getElementById("out-calories").textContent = U.fmt(calories) + " kcal";

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
