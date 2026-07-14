(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var fields = {
    age: { input: document.getElementById("age"), errorEl: document.getElementById("age-error"), min: 15, max: 90, label: "age" },
    height: { input: document.getElementById("height"), errorEl: document.getElementById("height-error"), min: 120, max: 230, label: "height" },
    weight: { input: document.getElementById("weight"), errorEl: document.getElementById("weight-error"), min: 30, max: 250, label: "weight" },
  };

  var currentUnits = "metric";

  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var heightInput = fields.height.input;
    var weightInput = fields.weight.input;
    var heightSuffixEl = heightInput.parentElement.querySelector(".input-suffix");
    var weightSuffixEl = weightInput.parentElement.querySelector(".input-suffix");
    if (value === "imperial") {
      heightSuffixEl.textContent = "in";
      heightInput.min = 47; heightInput.max = 91; fields.height.min = 47; fields.height.max = 91;
      heightInput.placeholder = "e.g. 70";
      weightSuffixEl.textContent = "lb";
      weightInput.min = 66; weightInput.max = 550; fields.weight.min = 66; fields.weight.max = 550;
      weightInput.placeholder = "e.g. 172";
    } else {
      heightSuffixEl.textContent = "cm";
      heightInput.min = 120; heightInput.max = 230; fields.height.min = 120; fields.height.max = 230;
      heightInput.placeholder = "e.g. 178";
      weightSuffixEl.textContent = "kg";
      weightInput.min = 30; weightInput.max = 250; fields.weight.min = 30; fields.weight.max = 250;
      weightInput.placeholder = "e.g. 78";
    }
  });
  U.wireSegmented(form, "sex", function () {});

  function calculate() {
    var age = U.validateField(fields.age);
    var heightRaw = U.validateField(fields.height);
    var weightRaw = U.validateField(fields.weight);
    if (age === null || heightRaw === null || weightRaw === null) {
      U.hideResult(panel);
      return;
    }

    var heightCm = currentUnits === "imperial" ? U.inToCm(heightRaw) : heightRaw;
    var weightKg = currentUnits === "imperial" ? U.lbToKg(weightRaw) : weightRaw;
    var sex = form.querySelector('input[name="sex"]:checked').value;
    var activityMult = parseFloat(document.getElementById("activity").value);
    var goal = document.getElementById("goal").value;

    var bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
    var tdee = bmr * activityMult;

    var calories;
    if (goal === "lose") calories = tdee * 0.8;
    else if (goal === "gain") calories = tdee * 1.1;
    else calories = tdee;

    var proteinPerKg = goal === "lose" ? 2.2 : goal === "gain" ? 2.0 : 1.8;
    var proteinG = proteinPerKg * weightKg;
    var proteinCals = proteinG * 4;

    var fatCals = calories * 0.25;
    var fatG = fatCals / 9;

    var carbCals = Math.max(calories - proteinCals - fatCals, 0);
    var carbG = carbCals / 4;

    document.getElementById("out-calories").textContent = U.fmt(calories);
    document.getElementById("out-bmr").textContent = U.fmt(bmr);
    document.getElementById("out-tdee").textContent = U.fmt(tdee);
    document.getElementById("out-per-kg").textContent = U.fmt(calories / weightKg, 1);

    document.getElementById("out-protein-g").textContent = U.fmt(proteinG) + "g";
    document.getElementById("out-carb-g").textContent = U.fmt(carbG) + "g";
    document.getElementById("out-fat-g").textContent = U.fmt(fatG) + "g";

    document.getElementById("out-protein-pct").textContent = U.fmt((proteinCals / calories) * 100) + "%";
    document.getElementById("out-carb-pct").textContent = U.fmt((carbCals / calories) * 100) + "%";
    document.getElementById("out-fat-pct").textContent = U.fmt((fatCals / calories) * 100) + "%";

    U.paintRing([
      { el: document.getElementById("ring-protein"), value: proteinCals },
      { el: document.getElementById("ring-carb"), value: carbCals },
      { el: document.getElementById("ring-fat"), value: fatCals },
    ], 60);

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    calculate();
  });

  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
  });
})();
