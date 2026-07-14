(function () {
  var input = document.getElementById('notfound-search');
  if (!input) return;
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = 'calculators/index.html?q=' + encodeURIComponent(input.value.trim());
    }
  });
})();
