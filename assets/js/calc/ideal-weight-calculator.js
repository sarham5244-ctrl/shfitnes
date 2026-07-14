(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "metric";
  var currentSex = "male";

  var fields = {
    height: { input: document.getElementById("height"), errorEl: document.getElementById("height-error"), min: 120, max: 230, label: "height" },
  };

  U.wireSegmented(form, "sex", function (value) { currentSex = value; });
  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var suffixEl = fields.height.input.parentElement.querySelector(".input-suffix");
    if (value === "imperial") {
      suffixEl.textContent = "in";
      fields.height.min = 47; fields.height.max = 91; fields.height.input.min = 47; fields.height.input.max = 91; fields.height.input.placeholder = "e.g. 70";
    } else {
      suffixEl.textContent = "cm";
      fields.height.min = 120; fields.height.max = 230; fields.height.input.min = 120; fields.height.input.max = 230; fields.height.input.placeholder = "e.g. 178";
    }
  });

  function calculate() {
    var height = U.validateField(fields.height);
    if (height === null) { U.hideResult(panel); return; }

    var heightCm = currentUnits === "imperial" ? U.inToCm(height) : height;
    var heightIn = U.cmToIn(heightCm);
    var inchesOver5ft = Math.max(heightIn - 60, 0);

    var hamwi, devine, robinson;
    if (currentSex === "male") {
      hamwi = 48.0 + 2.7 * inchesOver5ft;
      devine = 50.0 + 2.3 * inchesOver5ft;
      robinson = 52.0 + 1.9 * inchesOver5ft;
    } else {
      hamwi = 45.5 + 2.2 * inchesOver5ft;
      devine = 45.5 + 2.3 * inchesOver5ft;
      robinson = 49.0 + 1.7 * inchesOver5ft;
    }

    var average = (hamwi + devine + robinson) / 3;
    var unitLabel = currentUnits === "imperial" ? " lb" : " kg";

    function disp(kg) {
      var v = currentUnits === "imperial" ? U.kgToLb(kg) : kg;
      return U.fmt(v, 1) + unitLabel;
    }

    document.getElementById("out-average").textContent = disp(average);
    document.getElementById("out-hamwi").textContent = disp(hamwi);
    document.getElementById("out-devine").textContent = disp(devine);
    document.getElementById("out-robinson").textContent = disp(robinson);

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
