(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;
  var errorEl = document.getElementById('contact-form-error');
  var successEl = document.getElementById('contact-form-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('contact-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var message = document.getElementById('contact-message').value.trim();
    var subject = document.getElementById('contact-subject').value;
    var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    var valid = name && emailValid && message;
    errorEl.classList.toggle('is-visible', !valid);
    if (!valid) return;

    var subjectLabel = {
      feedback: 'General feedback',
      'calculator-request': 'Calculator request',
      bug: 'Report an issue',
      other: 'Other'
    }[subject] || 'Message';

    var mailBody = 'From: ' + name + ' (' + email + ')\n\n' + message;
    var mailto = 'mailto:hello@shfitnesstools.com.au' +
      '?subject=' + encodeURIComponent('[SH Fitness Tools] ' + subjectLabel) +
      '&body=' + encodeURIComponent(mailBody);

    window.location.href = mailto;
    successEl.style.display = 'block';
  });
})();
