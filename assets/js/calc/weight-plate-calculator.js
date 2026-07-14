(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "kg";
  var fields = {
    target: { input: document.getElementById("target"), errorEl: document.getElementById("target-error"), min: 20, max: 500, label: "target weight" },
  };

  var PLATES = {
    kg: [25, 20, 15, 10, 5, 2.5, 1.25],
    lb: [45, 35, 25, 10, 5, 2.5],
  };
  var PLATE_COLORS = {
    25: "#D64545", 20: "var(--carb)", 15: "var(--fat)", 10: "var(--lean)", 5: "#94A3A0", 2.5: "#CBD5D1", 1.25: "#E5E9E7",
    45: "#D64545", 35: "var(--carb)",
  };

  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var suffixEl = fields.target.input.parentElement.querySelector(".input-suffix");
    suffixEl.textContent = value;
    if (value === "lb") {
      fields.target.min = 45; fields.target.max = 1100; fields.target.input.min = 45; fields.target.input.max = 1100; fields.target.input.placeholder = "e.g. 225";
    } else {
      fields.target.min = 20; fields.target.max = 500; fields.target.input.min = 20; fields.target.input.max = 500; fields.target.input.placeholder = "e.g. 100";
    }
  });

  var visual = document.getElementById("plate-visual");
  var listEl = document.getElementById("plate-list");
  var noteEl = document.getElementById("out-note").querySelector("span");

  function loadPlates(perSide, units) {
    var available = PLATES[units];
    var remaining = perSide;
    var used = [];
    var tolerance = units === "kg" ? 0.01 : 0.01;
    var guard = 0;
    for (var i = 0; i < available.length && guard < 100; i++) {
      var plate = available[i];
      while (remaining + tolerance >= plate && guard < 100) {
        used.push(plate);
        remaining -= plate;
        guard++;
      }
    }
    return { used: used, remaining: remaining };
  }

  function calculate() {
    var target = U.validateField(fields.target);
    if (target === null) { U.hideResult(panel); return; }

    var barWeight = parseFloat(document.getElementById("bar").value);
    // bar select is defined in kg; convert if using lb
    if (currentUnits === "lb") {
      var barMap = { "20": 45, "15": 33, "10": 22, "0": 0 };
      barWeight = barMap[String(document.getElementById("bar").value)] !== undefined ? barMap[String(document.getElementById("bar").value)] : barWeight;
    }

    var perSideTarget = (target - barWeight) / 2;
    if (perSideTarget < 0) {
      fields.target.errorEl.querySelector("span").textContent = "Target weight should be more than the bar alone.";
      fields.target.errorEl.classList.add("is-visible");
      fields.target.input.classList.add("is-invalid");
      U.hideResult(panel);
      return;
    }

    var result = loadPlates(perSideTarget, currentUnits);
    var achievedPerSide = perSideTarget - result.remaining;
    var achievedTotal = barWeight + achievedPerSide * 2;

    document.getElementById("out-per-side").textContent = U.fmt(achievedPerSide, 2).replace(/\.00$/, "") + " " + currentUnits + " / side";

    visual.innerHTML = result.used.map(function (p) {
      var color = PLATE_COLORS[p] || "var(--lean)";
      var height = 40 + (p / (currentUnits === "kg" ? 25 : 45)) * 60;
      return '<div style="width:14px; height:' + height + 'px; background:' + color + '; border-radius:3px; border:1px solid rgba(0,0,0,0.15);" title="' + p + ' ' + currentUnits + '"></div>';
    }).join("");

    if (result.used.length === 0) {
      listEl.innerHTML = '<div class="meal-split-row"><span class="msr-name">Bar only</span><span class="msr-g">' + barWeight + ' ' + currentUnits + '</span></div>';
    } else {
      var counts = {};
      result.used.forEach(function (p) { counts[p] = (counts[p] || 0) + 1; });
      listEl.innerHTML = Object.keys(counts).sort(function (a, b) { return b - a; }).map(function (p) {
        return '<div class="meal-split-row"><span class="msr-name">' + p + ' ' + currentUnits + ' plates</span><span class="msr-g">×' + counts[p] + ' per side</span></div>';
      }).join("");
    }

    if (Math.abs(target - achievedTotal) > 0.02) {
      noteEl.textContent = "Closest achievable weight with a standard plate set is " + U.fmt(achievedTotal, 2).replace(/\.00$/, "") + " " + currentUnits + " (your target wasn't exactly reachable).";
    } else {
      noteEl.textContent = "Assumes a standard plate set. If your gym's plates differ, the exact combination may vary slightly.";
    }

    U.showResult(panel);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    U.hideResult(panel);
    visual.innerHTML = "";
    listEl.innerHTML = "";
  });
})();
