(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "kg";
  var fields = {
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 1, max: 500, label: "weight lifted" },
    reps: { input: document.getElementById("reps"), errorEl: document.getElementById("reps-error"), min: 1, max: 15, label: "reps" },
  };

  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var suffixEl = fields.weight.input.parentElement.querySelector(".input-suffix");
    suffixEl.textContent = value;
  });

  var pctTable = document.getElementById("pct-table");
  var PERCENTAGES = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

  function calculate() {
    var weight = U.validateField(fields.weight);
    var reps = U.validateField(fields.reps);
    if (weight === null || reps === null) { U.hideResult(panel); return; }

    if (reps === 1) {
      // no estimation needed
      var oneRm = weight;
      document.getElementById("out-1rm").textContent = U.fmt(oneRm, 1) + " " + currentUnits;
      document.getElementById("out-epley").textContent = U.fmt(oneRm, 1) + " " + currentUnits;
      document.getElementById("out-brzycki").textContent = U.fmt(oneRm, 1) + " " + currentUnits;
      renderTable(oneRm);
      U.showResult(panel);
      return;
    }

    var epley = weight * (1 + reps / 30);
    var brzycki = weight * 36 / (37 - reps);
    var average = (epley + brzycki) / 2;

    document.getElementById("out-1rm").textContent = U.fmt(average, 1) + " " + currentUnits;
    document.getElementById("out-epley").textContent = U.fmt(epley, 1) + " " + currentUnits;
    document.getElementById("out-brzycki").textContent = U.fmt(brzycki, 1) + " " + currentUnits;

    renderTable(average);
    U.showResult(panel);
  }

  function renderTable(oneRm) {
    pctTable.innerHTML = PERCENTAGES.map(function (p) {
      var w = oneRm * (p / 100);
      return '<div class="meal-split-row"><span class="msr-name">' + p + '%</span><span class="msr-g">' + U.fmt(w, 1) + ' ' + currentUnits + '</span></div>';
    }).join("");
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
    pctTable.innerHTML = "";
  });
})();
