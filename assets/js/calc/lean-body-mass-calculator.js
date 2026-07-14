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
      fields.weight.min = 66; fields.weight.max = 550; fields.weight.input.min = 66; fields.weight.input.max = 550; fields.weight.input.placeholder = "e.g. 172";
    } else {
      heightSuffix.textContent = "cm";
      fields.height.min = 120; fields.height.max = 230; fields.height.input.min = 120; fields.height.input.max = 230; fields.height.input.placeholder = "e.g. 178";
      weightSuffix.textContent = "kg";
      fields.weight.min = 30; fields.weight.max = 250; fields.weight.input.min = 30; fields.weight.input.max = 250; fields.weight.input.placeholder = "e.g. 78";
    }
  });

  function calculate() {
    var height = U.validateField(fields.height);
    var weightRaw = U.validateField(fields.weight);
    if (height === null || weightRaw === null) { U.hideResult(panel); return; }

    var heightCm = currentUnits === "imperial" ? U.inToCm(height) : height;
    var weightKg = currentUnits === "imperial" ? U.lbToKg(weightRaw) : weightRaw;

    var lbm = currentSex === "male"
      ? 0.407 * weightKg + 0.267 * heightCm - 19.2
      : 0.252 * weightKg + 0.473 * heightCm - 48.3;
    lbm = Math.max(lbm, 0);

    var fatMass = Math.max(weightKg - lbm, 0);
    var fatPct = (fatMass / weightKg) * 100;

    var unitLabel = currentUnits === "imperial" ? " lb" : " kg";
    function disp(kg) {
      var v = currentUnits === "imperial" ? U.kgToLb(kg) : kg;
      return U.fmt(v, 1) + unitLabel;
    }

    document.getElementById("out-lbm").textContent = disp(lbm);
    document.getElementById("out-fat-mass").textContent = disp(fatMass);
    document.getElementById("out-fat-pct").textContent = U.fmt(fatPct, 1) + "%";

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
