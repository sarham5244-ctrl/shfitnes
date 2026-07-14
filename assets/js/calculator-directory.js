(function () {
  var CALCULATORS = [
    { name: 'Macro Calculator', slug: 'macro-calculator', category: 'nutrition', desc: 'Turn your daily calorie target into a protein, carb and fat split.' },
    { name: 'Protein Intake Calculator', slug: 'protein-intake-calculator', category: 'nutrition', desc: 'Find your recommended daily protein target and per-meal split.' },
    { name: 'Water Intake Calculator', slug: 'water-intake-calculator', category: 'nutrition', desc: 'Estimate your daily hydration target from weight and activity.' },
    { name: 'Creatine Dosage Calculator', slug: 'creatine-dosage-calculator', category: 'nutrition', desc: 'Get a maintenance dose and optional loading phase guide.' },
    { name: 'Body Fat Percentage Calculator', slug: 'body-fat-percentage-calculator', category: 'body-composition', desc: 'Estimate body fat using the US Navy circumference method.' },
    { name: 'FFMI Calculator', slug: 'ffmi-calculator', category: 'body-composition', desc: 'Calculate your Fat-Free Mass Index and muscularity category.' },
    { name: 'Ideal Weight Calculator', slug: 'ideal-weight-calculator', category: 'body-composition', desc: 'Compare healthy weight ranges across three classic formulas.' },
    { name: 'Lean Body Mass Calculator', slug: 'lean-body-mass-calculator', category: 'body-composition', desc: 'Find your lean mass and fat mass from weight and body fat %.' },
    { name: 'One Rep Max Calculator', slug: 'one-rep-max-calculator', category: 'strength', desc: 'Estimate your 1RM and training percentage zones.' },
    { name: 'Weight Plate Calculator', slug: 'weight-plate-calculator', category: 'strength', desc: 'Work out exactly which plates to load on the bar.' },
    { name: 'Wilks / DOTS Calculator', slug: 'wilks-dots-calculator', category: 'strength', desc: 'Score your relative powerlifting strength across lifts.' },
    { name: 'Heart Rate Zone Calculator', slug: 'heart-rate-zone-calculator', category: 'cardio', desc: 'Get personalised training heart rate zones for cardio.' },
    { name: 'Running Pace Calculator', slug: 'running-pace-calculator', category: 'cardio', desc: 'Calculate pace, speed and race finish time predictions.' },
    { name: 'VO2 Max Calculator', slug: 'vo2-max-calculator', category: 'cardio', desc: 'Estimate cardiovascular fitness using the Cooper Test.' },
    { name: 'Calories Burned Calculator', slug: 'calories-burned-calculator', category: 'cardio', desc: 'Estimate calories burned across 9 common activities.' },
    { name: 'Steps to Distance Calculator', slug: 'steps-to-distance-calculator', category: 'cardio', desc: 'Convert daily steps into distance, time and calories.' }
  ];

  var CATEGORY_ICONS = {
    nutrition: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/></svg>',
    'body-composition': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6l7-4z"/></svg>',
    strength: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M4 12a2 2 0 100-4 2 2 0 000 4zM4 12a2 2 0 100 4 2 2 0 000-4zM20 12a2 2 0 100-4 2 2 0 000 4zM20 12a2 2 0 100 4 2 2 0 000-4z"/></svg>',
    cardio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>'
  };
  var CATEGORY_LABEL = {
    nutrition: 'Nutrition',
    'body-composition': 'Body composition',
    strength: 'Strength',
    cardio: 'Cardio & activity'
  };

  var grid = document.getElementById('calc-grid');
  var emptyState = document.getElementById('directory-empty');
  var countEl = document.getElementById('directory-count');
  var searchInput = document.getElementById('calc-search');
  var pills = document.querySelectorAll('.filter-pill');

  var activeFilter = 'all';
  var activeQuery = '';

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    var idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return escapeHtml(text);
    var before = escapeHtml(text.slice(0, idx));
    var match = escapeHtml(text.slice(idx, idx + query.length));
    var after = escapeHtml(text.slice(idx + query.length));
    return before + '<mark>' + match + '</mark>' + after;
  }

  function render() {
    var query = activeQuery.trim().toLowerCase();
    var filtered = CALCULATORS.filter(function (c) {
      var matchesCategory = activeFilter === 'all' || c.category === activeFilter;
      var matchesQuery = !query || c.name.toLowerCase().indexOf(query) !== -1 || c.desc.toLowerCase().indexOf(query) !== -1;
      return matchesCategory && matchesQuery;
    });

    countEl.textContent = 'Showing ' + filtered.length + ' of ' + CALCULATORS.length + ' calculators';
    emptyState.classList.toggle('is-visible', filtered.length === 0);

    grid.innerHTML = filtered.map(function (c) {
      return '<a class="calc-card" href="' + c.slug + '.html">' +
        '<div class="icon-badge">' + CATEGORY_ICONS[c.category] + '</div>' +
        '<h3>' + highlight(c.name, query) + '</h3>' +
        '<p>' + highlight(c.desc, query) + '</p>' +
        '<span class="calc-card-tag">' + CATEGORY_LABEL[c.category] + '</span>' +
        '</a>';
    }).join('');
  }

  searchInput.addEventListener('input', function () {
    activeQuery = searchInput.value;
    render();
  });

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.setAttribute('aria-pressed', 'false'); });
      pill.setAttribute('aria-pressed', 'true');
      activeFilter = pill.getAttribute('data-filter');
      render();
    });
  });

  // support ?q= and ?category= query params for deep-linking from search/category pages
  var params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    searchInput.value = params.get('q');
    activeQuery = params.get('q');
  }
  if (params.get('category') && CATEGORY_LABEL[params.get('category')]) {
    activeFilter = params.get('category');
    pills.forEach(function (p) {
      p.setAttribute('aria-pressed', p.getAttribute('data-filter') === activeFilter ? 'true' : 'false');
    });
  }

  render();
})();
