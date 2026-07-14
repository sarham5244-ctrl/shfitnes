(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "kg";
  var fields = {
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 30, max: 250, label: "weight" },
    duration: { input: document.getElementById("duration"), errorEl: document.getElementById("duration-error"), min: 1, max: 300, label: "duration" },
  };

  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var suffixEl = fields.weight.input.parentElement.querySelector(".input-suffix");
    if (value === "lb") {
      suffixEl.textContent = "lb";
      fields.weight.min = 66; fields.weight.max = 550; fields.weight.input.min = 66; fields.weight.input.max = 550; fields.weight.input.placeholder = "e.g. 172";
    } else {
      suffixEl.textContent = "kg";
      fields.weight.min = 30; fields.weight.max = 250; fields.weight.input.min = 30; fields.weight.input.max = 250; fields.weight.input.placeholder = "e.g. 78";
    }
  });

  function calculate() {
    var weightRaw = U.validateField(fields.weight);
    var duration = U.validateField(fields.duration);
    if (weightRaw === null || duration === null) { U.hideResult(panel); return; }

    var weightKg = currentUnits === "lb" ? U.lbToKg(weightRaw) : weightRaw;
    var met = parseFloat(document.getElementById("activity").value);

    var calPerMin = (met * weightKg * 3.5) / 200;
    var total = calPerMin * duration;

    document.getElementById("out-total").textContent = U.fmt(total) + " kcal";
    document.getElementById("out-per-min").textContent = U.fmt(calPerMin, 1) + " kcal";
    document.getElementById("out-per-hour").textContent = U.fmt(calPerMin * 60) + " kcal";

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
