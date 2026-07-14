(function () {
  var ARTICLES = [
    { title: 'How to Count Macros (Without Overthinking It)', slug: 'how-to-count-macros', category: 'nutrition', desc: 'A practical, no-fuss approach to daily tracking.', minutes: 6 },
    { title: 'The Best Macro Split for Your Goal', slug: 'best-macro-split-for-your-goal', category: 'nutrition', desc: 'Comparing balanced, high protein, low carb and high carb splits.', minutes: 7 },
    { title: 'Body Recomposition, Explained', slug: 'body-recomposition-explained', category: 'body-composition', desc: 'How macros support building muscle and losing fat together.', minutes: 8 },
    { title: 'Tracking Progress Beyond the Scale', slug: 'tracking-progress-beyond-the-scale', category: 'body-composition', desc: 'Why body fat percentage and measurements tell a fuller story.', minutes: 6 },
    { title: 'Natural Muscle Growth: What to Expect', slug: 'natural-muscle-growth-limits', category: 'training', desc: 'Realistic timelines for building lean mass without shortcuts.', minutes: 7 }
  ];
  var CATEGORY_LABEL = { nutrition: 'Nutrition', 'body-composition': 'Body composition', training: 'Training' };

  var grid = document.getElementById('blog-grid');
  var pills = document.querySelectorAll('#blog-filter-pills .filter-pill');
  var activeFilter = 'all';

  function render() {
    var filtered = ARTICLES.filter(function (a) { return activeFilter === 'all' || a.category === activeFilter; });
    grid.innerHTML = filtered.map(function (a) {
      return '<a class="article-card reveal is-visible" href="' + a.slug + '.html">' +
        '<div class="article-card-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6h16M4 12h16M4 18h10"/></svg></div>' +
        '<div class="article-card-body">' +
          '<span class="eyebrow" style="margin-bottom:10px;">' + CATEGORY_LABEL[a.category] + '</span>' +
          '<h3>' + a.title + '</h3>' +
          '<p>' + a.desc + '</p>' +
          '<span class="article-card-meta">' + a.minutes + ' min read</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.setAttribute('aria-pressed', 'false'); });
      pill.setAttribute('aria-pressed', 'true');
      activeFilter = pill.getAttribute('data-filter');
      render();
    });
  });

  render();
})();
