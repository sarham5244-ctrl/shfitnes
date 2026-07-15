(function () {
  var ARTICLES = [
    { title: 'How to Count Macros (Without Overthinking It)', slug: 'how-to-count-macros', category: 'nutrition', desc: 'A practical, no-fuss approach to daily tracking.', minutes: 6 },
    { title: 'The Best Macro Split for Your Goal', slug: 'best-macro-split-for-your-goal', category: 'nutrition', desc: 'Comparing balanced, high protein, low carb and high carb splits.', minutes: 7 },
    { title: 'Body Recomposition, Explained', slug: 'body-recomposition-explained', category: 'body-composition', desc: 'How macros support building muscle and losing fat together.', minutes: 8 },
    { title: 'Tracking Progress Beyond the Scale', slug: 'tracking-progress-beyond-the-scale', category: 'body-composition', desc: 'Why body fat percentage and measurements tell a fuller story.', minutes: 6 },
    { title: 'Natural Muscle Growth: What to Expect', slug: 'natural-muscle-growth-limits', category: 'training', desc: 'Realistic timelines for building lean mass without shortcuts.', minutes: 7 },
    { title: 'How Much Protein Do You Need Per Day?', slug: 'how-much-protein-do-you-need', category: 'nutrition', desc: 'Real gram targets for general health, fat loss and muscle gain.', minutes: 6 },
    { title: 'Calories Explained: Understanding Energy Balance', slug: 'calories-explained-energy-balance', category: 'nutrition', desc: 'What a calorie is and how weight change actually works.', minutes: 5 },
    { title: 'Protein vs Carbs vs Fats: What Does Your Body Need?', slug: 'protein-vs-carbs-vs-fats', category: 'nutrition', desc: 'What each macronutrient actually does in your body.', minutes: 6 },
    { title: 'How to Build a Healthy Meal Plan for Fitness Goals', slug: 'how-to-build-a-healthy-meal-plan', category: 'nutrition', desc: 'A simple, sustainable structure for building meals around your targets.', minutes: 7 },
    { title: 'Pre-Workout Nutrition: What Should You Eat Before Training?', slug: 'pre-workout-nutrition-guide', category: 'nutrition', desc: 'What to eat before training, and how far in advance.', minutes: 5 },
    { title: 'Post-Workout Nutrition: How to Recover Better', slug: 'post-workout-nutrition-recovery', category: 'nutrition', desc: 'What to eat after training to recover faster.', minutes: 5 },
    { title: 'Creatine Explained: Benefits, Safety and How It Works', slug: 'creatine-explained-benefits-safety', category: 'nutrition', desc: 'How creatine works, what the research shows, and how to dose it.', minutes: 6 },
    { title: 'How Much Water Should You Drink When Training?', slug: 'how-much-water-should-you-drink', category: 'nutrition', desc: 'Building a personalised daily hydration target.', minutes: 5 },
    { title: 'How to Lose Fat While Keeping Muscle', slug: 'how-to-lose-fat-while-keeping-muscle', category: 'body-composition', desc: 'The three things that actually determine the outcome.', minutes: 7 },
    { title: 'Calorie Deficit Explained: The Science Behind Fat Loss', slug: 'calorie-deficit-explained', category: 'body-composition', desc: 'How a sustainable deficit actually works.', minutes: 6 },
    { title: 'Common Weight Loss Mistakes Beginners Make', slug: 'common-weight-loss-mistakes', category: 'body-composition', desc: 'The pitfalls that quietly slow down fat loss progress.', minutes: 6 },
    { title: 'Body Fat Percentage Explained: What the Numbers Mean', slug: 'body-fat-percentage-explained', category: 'body-composition', desc: 'What the ranges mean and how to track them for free.', minutes: 6 },
    { title: 'How to Calculate Your Lean Body Mass', slug: 'how-to-calculate-lean-body-mass', category: 'body-composition', desc: 'Why lean mass is a more useful number than total bodyweight.', minutes: 5 },
    { title: 'BMI vs Body Fat Percentage: Which Is Better?', slug: 'bmi-vs-body-fat-percentage', category: 'body-composition', desc: 'What each one is actually useful for, and where BMI falls short.', minutes: 5 },
    { title: 'Progressive Overload Explained: The Key to Muscle Growth', slug: 'progressive-overload-explained', category: 'training', desc: 'Why gradually increasing demand drives long-term results.', minutes: 6 },
    { title: 'How Many Sets and Reps Should You Do?', slug: 'how-many-sets-and-reps-should-you-do', category: 'training', desc: 'Choosing the right rep ranges for your goal.', minutes: 6 },
    { title: 'Strength Training vs Hypertrophy Training', slug: 'strength-training-vs-hypertrophy-training', category: 'training', desc: 'What actually changes between the two approaches.', minutes: 6 },
    { title: 'Beginner Gym Mistakes and How to Avoid Them', slug: 'beginner-gym-mistakes-to-avoid', category: 'training', desc: 'The pitfalls almost every beginner runs into early on.', minutes: 6 },
    { title: 'How Often Should You Train Each Muscle Group?', slug: 'how-often-should-you-train-each-muscle-group', category: 'training', desc: 'What the research says about training frequency.', minutes: 5 },
    { title: 'Cardio vs Weight Training: Which Should You Do?', slug: 'cardio-vs-weight-training', category: 'training', desc: 'What each one does best, and how to combine them.', minutes: 6 },
    { title: 'Rest Days Explained: Why Recovery Matters', slug: 'rest-days-explained-why-recovery-matters', category: 'recovery', desc: 'Why recovery is part of training, not a break from it.', minutes: 5 },
    { title: 'How Sleep Affects Muscle Growth and Performance', slug: 'how-sleep-affects-muscle-growth', category: 'recovery', desc: 'Why sleep is one of the most underrated training tools.', minutes: 6 },
    { title: 'How Muscles Grow: The Science of Hypertrophy', slug: 'how-muscles-grow-science-of-hypertrophy', category: 'fitness-science', desc: 'The biological process behind muscle growth, explained simply.', minutes: 7 },
    { title: 'What Happens to Your Body When You Exercise Regularly?', slug: 'what-happens-to-your-body-when-you-exercise', category: 'fitness-science', desc: 'The physiological changes behind consistent training.', minutes: 6 },
    { title: 'Beginner Fitness Guide: How to Start Your Transformation', slug: 'beginner-fitness-guide-how-to-start', category: 'fitness-science', desc: 'A complete, practical starting point for beginners.', minutes: 8 }
  ];
  var CATEGORY_LABEL = {
    nutrition: 'Nutrition',
    'body-composition': 'Body composition',
    training: 'Training',
    recovery: 'Recovery',
    'fitness-science': 'Fitness science'
  };

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
