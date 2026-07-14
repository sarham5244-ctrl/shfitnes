(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "kg";
  var currentSex = "male";

  var fields = {
    bodyweight: { input: document.getElementById("bodyweight"), errorEl: document.getElementById("bodyweight-error"), min: 30, max: 250, label: "bodyweight" },
    total: { input: document.getElementById("total"), errorEl: document.getElementById("total-error"), min: 20, max: 1500, label: "total lifted" },
  };

  U.wireSegmented(form, "sex", function (value) { currentSex = value; });
  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var bwSuffix = fields.bodyweight.input.parentElement.querySelector(".input-suffix");
    var totalSuffix = fields.total.input.parentElement.querySelector(".input-suffix");
    bwSuffix.textContent = value;
    totalSuffix.textContent = value;
    if (value === "lb") {
      fields.bodyweight.min = 66; fields.bodyweight.max = 550; fields.bodyweight.input.min = 66; fields.bodyweight.input.max = 550; fields.bodyweight.input.placeholder = "e.g. 183";
      fields.total.min = 44; fields.total.max = 3300; fields.total.input.min = 44; fields.total.input.max = 3300; fields.total.input.placeholder = "e.g. 1100";
    } else {
      fields.bodyweight.min = 30; fields.bodyweight.max = 250; fields.bodyweight.input.min = 30; fields.bodyweight.input.max = 250; fields.bodyweight.input.placeholder = "e.g. 83";
      fields.total.min = 20; fields.total.max = 1500; fields.total.input.min = 20; fields.total.input.max = 1500; fields.total.input.placeholder = "e.g. 500";
    }
  });

  var WILKS = {
    male: [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8],
    female: [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8],
  };
  // 4th-degree polynomial: denom = a*x^4 + b*x^3 + c*x^2 + d*x + e
  var DOTS = {
    male: [-0.000001093, 0.0007391293, -0.1918759221, 24.0900756, -307.75076],
    female: [-0.0000010706, 0.0005158568, -0.1126655495, 13.6175032, -57.96288],
  };

  function wilksCoefficient(coeffs, x) {
    var denom = coeffs[0] + coeffs[1] * x + coeffs[2] * Math.pow(x, 2) + coeffs[3] * Math.pow(x, 3) + coeffs[4] * Math.pow(x, 4) + coeffs[5] * Math.pow(x, 5);
    return 500 / denom;
  }

  function dotsCoefficient(coeffs, x) {
    var denom = coeffs[0] * Math.pow(x, 4) + coeffs[1] * Math.pow(x, 3) + coeffs[2] * Math.pow(x, 2) + coeffs[3] * x + coeffs[4];
    return 500 / denom;
  }

  function calculate() {
    var bwRaw = U.validateField(fields.bodyweight);
    var totalRaw = U.validateField(fields.total);
    if (bwRaw === null || totalRaw === null) { U.hideResult(panel); return; }

    var bwKg = currentUnits === "lb" ? U.lbToKg(bwRaw) : bwRaw;
    var totalKg = currentUnits === "lb" ? U.lbToKg(totalRaw) : totalRaw;

    var wilksCoef = wilksCoefficient(WILKS[currentSex], bwKg);
    var dotsCoef = dotsCoefficient(DOTS[currentSex], bwKg);

    var wilksScore = wilksCoef * totalKg;
    var dotsScore = dotsCoef * totalKg;

    document.getElementById("out-wilks").textContent = U.fmt(wilksScore, 1);
    document.getElementById("out-dots").textContent = U.fmt(dotsScore, 1);

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
