(function () {
  var U = window.SHFTCalc;
  var form = document.getElementById("calc-form");
  var panel = document.getElementById("result-panel");
  if (!form || !panel) return;

  var currentUnits = "km";
  var fields = {
    distance: { input: document.getElementById("distance"), errorEl: document.getElementById("distance-error"), min: 0.1, max: 400, label: "distance" },
  };

  U.wireSegmented(form, "units", function (value) {
    currentUnits = value;
    var suffixEl = fields.distance.input.parentElement.querySelector(".input-suffix");
    suffixEl.textContent = value;
  });

  var timeError = document.getElementById("time-error");
  var raceTable = document.getElementById("race-table");

  var RACES_KM = [
    { name: "5K", dist: 5 },
    { name: "10K", dist: 10 },
    { name: "Half Marathon", dist: 21.0975 },
    { name: "Marathon", dist: 42.195 },
  ];

  function calculate() {
    var distance = U.validateField(fields.distance);
    var hours = parseFloat(document.getElementById("hours").value) || 0;
    var minutes = parseFloat(document.getElementById("minutes").value) || 0;
    var seconds = parseFloat(document.getElementById("seconds").value) || 0;
    var totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (distance === null || totalSeconds <= 0) {
      timeError.querySelector("span").textContent = "Enter a valid time greater than zero.";
      timeError.classList.toggle("is-visible", totalSeconds <= 0);
      U.hideResult(panel);
      return;
    }
    timeError.classList.remove("is-visible");

    var paceSecPerUnit = totalSeconds / distance;
    var speed = distance / (totalSeconds / 3600);

    document.getElementById("out-pace").textContent = formatPace(paceSecPerUnit) + " /" + currentUnits;
    document.getElementById("out-speed").textContent = U.fmt(speed, 1) + " " + currentUnits + "/h";

    var distanceKm = currentUnits === "mi" ? distance * 1.60934 : distance;
    raceTable.innerHTML = RACES_KM.map(function (r) {
      var predictedSeconds = totalSeconds * Math.pow(r.dist / distanceKm, 1.06);
      return '<div class="meal-split-row"><span class="msr-name">' + r.name + '</span><span class="msr-g">' + formatDuration(predictedSeconds) + '</span></div>';
    }).join("");

    U.showResult(panel);
  }

  function formatPace(secPerUnit) {
    var m = Math.floor(secPerUnit / 60);
    var s = Math.round(secPerUnit % 60);
    if (s === 60) { m += 1; s = 0; }
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function formatDuration(totalSec) {
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = Math.round(totalSec % 60);
    if (s === 60) { m += 1; s = 0; }
    if (m === 60) { h += 1; m = 0; }
    if (h > 0) return h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
  document.getElementById("calc-reset").addEventListener("click", function () {
    form.reset();
    Object.values(fields).forEach(U.clearField);
    timeError.classList.remove("is-visible");
    U.hideResult(panel);
    raceTable.innerHTML = "";
  });
})();
