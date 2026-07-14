(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "metric";
  var fields = {
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 30, max: 250, label: "weight" },
    exercise: { input: document.getElementById("exercise"), errorEl: document.getElementById("exercise-error"), min: 0, max: 300, label: "exercise minutes" },
  };

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
    var exerciseRaw = U.validateField(fields.exercise);
    if (weightRaw === null || exerciseRaw === null) { U.hideResult(panel); return; }

    var weightKg = currentUnits === "imperial" ? U.lbToKg(weightRaw) : weightRaw;
    var climate = document.getElementById("climate").value;

    var baseMl = weightKg * 33;
    var exerciseMl = exerciseRaw * 12;
    var climateMl = climate === "hot" ? 500 : 0;
    var totalMl = baseMl + exerciseMl + climateMl;
    var litres = totalMl / 1000;

    document.getElementById("out-litres").textContent = U.fmt(litres, 1) + " L";
    document.getElementById("out-cups").textContent = U.fmt(totalMl / 250, 0) + " cups";
    document.getElementById("out-bottles").textContent = U.fmt(totalMl / 500, 1) + " bottles";
    document.getElementById("out-base").textContent = U.fmt(baseMl / 1000, 1) + " L";

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
