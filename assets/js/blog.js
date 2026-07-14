(function () {
  var newsletterForm = document.getElementById('newsletter-form');
  if (!newsletterForm) return;
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('newsletter-email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    document.getElementById('newsletter-success').classList.add('is-visible');
    newsletterForm.reset();
  });
})();
