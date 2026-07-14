(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "metric";
  var wantsLoading = "no";
  var fields = {
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 30, max: 250, label: "weight" },
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
  U.wireSegmented(form, "loading", function (value) { wantsLoading = value; });

  var loadingRow = document.getElementById("loading-row");
  var noteEl = document.getElementById("out-note").querySelector("span");

  function calculate() {
    var weightRaw = U.validateField(fields.weight);
    if (weightRaw === null) { U.hideResult(panel); return; }

    var weightKg = currentUnits === "imperial" ? U.lbToKg(weightRaw) : weightRaw;
    var maintenance = weightKg * 0.03;

    document.getElementById("out-maintenance").textContent = U.fmt(maintenance, 1) + "g / day";

    if (wantsLoading === "yes") {
      var loading = weightKg * 0.3;
      document.getElementById("out-loading").textContent = U.fmt(loading, 1) + "g";
      document.getElementById("out-per-dose").textContent = U.fmt(loading / 4, 1) + "g";
      loadingRow.style.display = "grid";
      noteEl.textContent = "Take the loading dose split into 4 servings for 5-7 days, then drop to the maintenance dose daily, including rest days.";
    } else {
      loadingRow.style.display = "none";
      noteEl.textContent = "Take your maintenance dose daily, including rest days — consistency matters more than timing.";
    }

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
    loadingRow.style.display = "grid";
  });
})();
