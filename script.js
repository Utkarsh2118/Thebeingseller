const siteConfig = {
  developmentApiBaseUrl: "http://127.0.0.1:5000",
  productionApiBaseUrl: "https://thebeingseller-api.onrender.com",
};

const newsItems = [
  {
    tag: 'Macro',
    time: '2m ago',
    title: 'Indian benchmark indices trade firm as financials support upside momentum.',
    summary: 'Nifty and Sensex remain in focus as traders monitor institutional participation and sector rotation.',
  },
  {
    tag: 'Banking',
    time: '5m ago',
    title: 'BankNifty stays on watch for breakout continuation above key intraday structure.',
    summary: 'Banking leadership continues to influence broader sentiment and short-term index direction.',
  },
  {
    tag: 'Derivatives',
    time: '8m ago',
    title: 'Options traders monitor implied volatility for directional conviction and hedge placement.',
    summary: 'Volatility behavior remains central to premium-selling and breakout strategies across index derivatives.',
  },
  {
    tag: 'Risk',
    time: '11m ago',
    title: 'Risk-managed positioning remains critical ahead of major macro and policy-driven sessions.',
    summary: 'Traders continue to focus on disciplined sizing, stop placement, and event-driven market reactions.',
  },
];

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('main section[id], header[id]');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const submitButton = document.querySelector('.submit-btn');
const contactSuccessPanel = document.getElementById('contactSuccessPanel');
const contactSuccessRef = document.getElementById('contactSuccessRef');
const yearElement = document.getElementById('year');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const newsFeatureTitle = document.getElementById('newsFeatureTitle');
const newsFeatureSummary = document.getElementById('newsFeatureSummary');
const newsFeatureTag = document.getElementById('newsFeatureTag');
const newsList = document.getElementById('newsList');
const messageInput = document.getElementById('message');
const messageCounter = document.getElementById('messageCounter');
const quickTemplateButtons = document.querySelectorAll('.quick-template');
const pageLoader = document.getElementById('pageLoader');
const loaderBar = document.getElementById('loaderBar');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const testimonialSlider = document.getElementById('testimonialSlider');
const testimonialCards = document.querySelectorAll('#testimonialSlider .trust-proof-card');
const testimonialDots = document.querySelectorAll('#testimonialSlider .testimonial-dot');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const rrCalculateBtn = document.getElementById('rrCalculateBtn');
const positionCalculateBtn = document.getElementById('positionCalculateBtn');
const whatIfSimulateBtn = document.getElementById('whatIfSimulateBtn');
const heroSignalConfidence = document.getElementById('heroSignalConfidence');
const heroSignalVolatility = document.getElementById('heroSignalVolatility');
const heroSignalWindow = document.getElementById('heroSignalWindow');
const marketStatusBadge = document.getElementById('marketStatusBadge');
const chartFallback = document.getElementById('chartFallback');

const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? (siteConfig.developmentApiBaseUrl || siteConfig.productionApiBaseUrl)
  : siteConfig.productionApiBaseUrl;

const REQUEST_TIMEOUT_MS = 60000;
let isContactSubmitting = false;

// Market Status Checker
const marketHolidays2024_2026 = [
  '2024-01-26', '2024-03-25', '2024-04-11', '2024-04-17', '2024-04-21', '2024-05-23',
  '2024-08-15', '2024-08-26', '2024-09-16', '2024-10-02', '2024-10-12', '2024-10-31',
  '2024-11-01', '2024-11-15', '2024-12-25',
  '2025-01-26', '2025-03-14', '2025-04-11', '2025-04-18', '2025-05-23', '2025-08-15',
  '2025-08-29', '2025-10-02', '2025-10-20', '2025-10-29', '2025-11-01', '2025-12-25',
  '2026-01-15', '2026-01-26', '2026-03-03', '2026-03-26', '2026-03-31', '2026-04-03',
  '2026-04-14', '2026-05-01', '2026-05-28', '2026-06-26', '2026-09-14', '2026-10-02',
  '2026-10-20', '2026-11-10', '2026-11-24', '2026-12-25'
];

const isMarketOpen = () => {
  // Get current time in IST
  const now = new Date();
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  
  // Get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = istTime.getDay();
  
  // Check if weekend (Saturday = 6, Sunday = 0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // Format date as YYYY-MM-DD
  const year = istTime.getFullYear();
  const month = String(istTime.getMonth() + 1).padStart(2, '0');
  const day = String(istTime.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  
  // Check if holiday
  if (marketHolidays2024_2026.includes(dateString)) {
    return false;
  }
  
  // Check market hours: 9:15 AM to 3:30 PM IST
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  const openTime = 9 * 60 + 15; // 9:15 AM = 555 minutes
  const closeTime = 15 * 60 + 30; // 3:30 PM = 930 minutes
  
  return totalMinutes >= openTime && totalMinutes < closeTime;
};

const applyMarketStatus = () => {
  const marketOpen = isMarketOpen();
  const body = document.body;
  const page = document.documentElement;
  
  if (marketOpen) {
    body.classList.add('market-open');
    page.classList.add('market-open');
    // Show market live badge
    if (marketStatusBadge) {
      marketStatusBadge.classList.add('is-visible');
      marketStatusBadge.textContent = '📊 Market LIVE';
    }
  } else {
    body.classList.remove('market-open');
    page.classList.remove('market-open');
    // Hide market live badge
    if (marketStatusBadge) {
      marketStatusBadge.classList.remove('is-visible');
      marketStatusBadge.textContent = '🔒 Market Closed';
    }
  }
};

// Check market status on load and every minute
applyMarketStatus();
window.setInterval(applyMarketStatus, 60000);

// Debug: Test market status (call in console: testMarketStatus())
window.testMarketStatus = () => {
  const isOpen = isMarketOpen();
  console.log('Market Status:', isOpen ? '✅ OPEN' : '❌ CLOSED');
  console.log('Current time (IST):', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  console.log('Has market-open class:', document.body.classList.contains('market-open'));
  console.log('Market status badge status:', marketStatusBadge?.textContent);
};

const initializePageLoader = () => {
  if (!pageLoader || !loaderBar) {
    return;
  }

  const hasSeenLoader = sessionStorage.getItem('ts_loader_seen') === '1';

  if (hasSeenLoader) {
    pageLoader.classList.add('is-hidden');
    return;
  }

  document.body.classList.add('is-loading');
  let progress = 8;
  loaderBar.style.width = `${progress}%`;

  const ticker = window.setInterval(() => {
    progress = Math.min(progress + Math.random() * 11, 90);
    loaderBar.style.width = `${progress}%`;
  }, 120);

  const closeLoader = () => {
    window.clearInterval(ticker);
    loaderBar.style.width = '100%';

    window.setTimeout(() => {
      pageLoader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      sessionStorage.setItem('ts_loader_seen', '1');
    }, 260);
  };

  window.addEventListener('load', closeLoader, { once: true });
  window.setTimeout(closeLoader, 1800);
};

initializePageLoader();

const initializeRevealStagger = () => {
  const sectionRevealIndex = new Map();

  revealElements.forEach((element) => {
    const parentSection = element.closest('section') || element.closest('header');

    if (!parentSection) {
      return;
    }

    const currentIndex = sectionRevealIndex.get(parentSection) || 0;
    const delay = Math.min(currentIndex * 90, 540);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    sectionRevealIndex.set(parentSection, currentIndex + 1);
  });
};

initializeRevealStagger();

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const initializeAchievementCounters = () => {
  if (!counters.length) {
    return;
  }

  const animateCounter = (element) => {
    if (element.dataset.countupDone === '1') {
      return;
    }

    const achievementCard = element.closest('.achievement-card');
    const target = Number(element.dataset.target || 0);
    const suffix = element.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    element.dataset.countupDone = '1';

    if (achievementCard) {
      achievementCard.classList.add('is-active');
    }

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const value = Math.floor(progress * target);
      element.textContent = `${value.toLocaleString()}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
        return;
      }

      element.textContent = `${target.toLocaleString()}${suffix}`;
    };

    window.requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -12% 0px' }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // Fallback: if IntersectionObserver timing misses, force animate after initial render.
  window.setTimeout(() => {
    counters.forEach((counter) => animateCounter(counter));
  }, 2800);
};

initializeAchievementCounters();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        entry.target.classList.remove('is-inview');
        return;
      }

      entry.target.classList.add('is-inview');

      const currentId = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('is-active', href === `#${currentId}`);
      });
    });
  },
  {
    rootMargin: '-35% 0px -50% 0px',
    threshold: 0.01,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const renderNews = () => {
  if (!newsList || !newsFeatureTitle || !newsFeatureSummary || !newsFeatureTag) {
    return;
  }

  if (!newsItems.length) {
    newsFeatureTag.textContent = 'Update';
    newsFeatureTitle.textContent = 'Market news feed is syncing.';
    newsFeatureSummary.textContent = 'Please check back shortly for refreshed headlines.';
    newsList.innerHTML = '<p class="widget-fallback">Headlines will appear automatically after sync.</p>';
    return;
  }

  newsFeatureTitle.textContent = newsItems[0].title;
  newsFeatureSummary.textContent = newsItems[0].summary;
  newsFeatureTag.textContent = newsItems[0].tag;

  newsList.innerHTML = newsItems
    .map(
      (item, index) => `
        <article class="news-item" data-index="${index}">
          <div class="news-item-top">
            <span class="news-item-tag">${item.tag}</span>
            <span class="news-item-time">${item.time}</span>
          </div>
          <strong>${item.title}</strong>
          <p>${item.summary}</p>
        </article>
      `
    )
    .join('');

  const itemNodes = newsList.querySelectorAll('.news-item');
  const setActiveNews = (index) => {
    const item = newsItems[index];
    newsFeatureTitle.textContent = item.title;
    newsFeatureSummary.textContent = item.summary;
    newsFeatureTag.textContent = item.tag;
    itemNodes.forEach((node) => {
      node.classList.toggle('is-active', Number(node.dataset.index) === index);
    });
  };

  setActiveNews(0);

  itemNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      setActiveNews(Number(node.dataset.index));
    });
  });

  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % newsItems.length;
    setActiveNews(index);
  }, 4500);
};

renderNews();

const initializeScrollProgress = () => {
  if (!scrollProgressBar) {
    return;
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pageHeight > 0 ? Math.min((scrollTop / pageHeight) * 100, 100) : 0;
    scrollProgressBar.style.width = `${progress}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
};

initializeScrollProgress();

const initializeTestimonialSlider = () => {
  if (!testimonialSlider || !testimonialCards.length) {
    return;
  }

  let activeIndex = 0;
  let intervalId;

  const renderSlide = (index) => {
    activeIndex = (index + testimonialCards.length) % testimonialCards.length;

    testimonialCards.forEach((card, cardIndex) => {
      const isActive = cardIndex === activeIndex;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-hidden', String(!isActive));
    });

    testimonialDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', String(isActive));
    });
  };

  const restartAutoPlay = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
    }

    intervalId = window.setInterval(() => {
      renderSlide(activeIndex + 1);
    }, 9000);
  };

  testimonialPrev?.addEventListener('click', () => {
    renderSlide(activeIndex - 1);
    restartAutoPlay();
  });

  testimonialNext?.addEventListener('click', () => {
    renderSlide(activeIndex + 1);
    restartAutoPlay();
  });

  testimonialDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.slideTo || 0);
      renderSlide(index);
      restartAutoPlay();
    });
  });

  testimonialSlider.addEventListener('mouseenter', () => {
    if (intervalId) {
      window.clearInterval(intervalId);
    }
  });

  testimonialSlider.addEventListener('mouseleave', () => {
    restartAutoPlay();
  });

  renderSlide(0);
  restartAutoPlay();
};

initializeTestimonialSlider();

const initializeHeroSignals = () => {
  if (!heroSignalConfidence || !heroSignalVolatility || !heroSignalWindow) {
    return;
  }

  const snapshots = [
    { confidence: 'Nifty & BankNifty', volatility: 'Options & Derivatives', window: 'Risk-First' },
    { confidence: 'Index Options', volatility: 'Price Action', window: 'Plan Before Entry' },
    { confidence: 'Nifty & BankNifty', volatility: 'Structured Hedging', window: 'Defined Risk' },
  ];

  let activeSnapshot = 0;

  const renderSnapshot = (snapshot) => {
    heroSignalConfidence.textContent = snapshot.confidence;
    heroSignalVolatility.textContent = snapshot.volatility;
    heroSignalWindow.textContent = snapshot.window;
  };

  renderSnapshot(snapshots[activeSnapshot]);

  window.setInterval(() => {
    activeSnapshot = (activeSnapshot + 1) % snapshots.length;
    renderSnapshot(snapshots[activeSnapshot]);
  }, 4400);
};

initializeHeroSignals();

const formatInr = (value) => `INR ${Math.round(value).toLocaleString('en-IN')}`;

const initializeRiskToolkit = () => {
  const entryPriceInput = document.getElementById('entryPrice');
  const stopPriceInput = document.getElementById('stopPrice');
  const targetPriceInput = document.getElementById('targetPrice');
  const rrOutput = document.getElementById('rrOutput');

  const capitalAmountInput = document.getElementById('capitalAmount');
  const riskPercentInput = document.getElementById('riskPercent');
  const slPointsInput = document.getElementById('slPoints');
  const positionOutput = document.getElementById('positionOutput');

  if (!rrCalculateBtn || !positionCalculateBtn || !rrOutput || !positionOutput) {
    return;
  }

  rrCalculateBtn.addEventListener('click', () => {
    const entry = Number(entryPriceInput?.value || 0);
    const stop = Number(stopPriceInput?.value || 0);
    const target = Number(targetPriceInput?.value || 0);

    if (!(entry > 0) || !(stop > 0) || !(target > 0)) {
      rrOutput.innerHTML = '<p>Please enter valid positive values for entry, stop, and target.</p>';
      return;
    }

    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);

    if (risk === 0) {
      rrOutput.innerHTML = '<p>Entry and stop cannot be identical. Define a meaningful stop-loss distance.</p>';
      return;
    }

    const ratio = reward / risk;
    const ratioLabel = ratio >= 2 ? 'good' : ratio >= 1.3 ? 'ok' : 'risky';
    const verdict = ratio >= 2 ? 'Favorable Setup' : ratio >= 1.3 ? 'Tradable Setup' : 'High-Risk Setup';

    rrOutput.innerHTML = `
      <strong>R:R Ratio = 1 : ${ratio.toFixed(2)}</strong>
      <p>Risk per unit: <strong>${risk.toFixed(2)}</strong> points | Reward per unit: <strong>${reward.toFixed(2)}</strong> points</p>
      <span class="rr-chip ${ratioLabel}">${verdict}</span>
    `;
  });

  positionCalculateBtn.addEventListener('click', () => {
    const capital = Number(capitalAmountInput?.value || 0);
    const riskPercent = Number(riskPercentInput?.value || 0);
    const slPoints = Number(slPointsInput?.value || 0);

    if (!(capital > 0) || !(riskPercent > 0) || !(slPoints > 0)) {
      positionOutput.innerHTML = '<p>Please enter valid values for capital, risk %, and stop distance.</p>';
      return;
    }

    const maxRiskAmount = (capital * riskPercent) / 100;
    const quantity = Math.max(Math.floor(maxRiskAmount / slPoints), 0);

    positionOutput.innerHTML = `
      <strong>Recommended Quantity: ${quantity.toLocaleString('en-IN')} units</strong>
      <p>Max capital at risk: <strong>${formatInr(maxRiskAmount)}</strong></p>
      <p>Per-trade risk model keeps drawdown controlled over a sequence of trades.</p>
    `;
  });

  const riskProfiles = {
    conservative: {
      riskPercent: 0.5,
      slPoints: 90,
      note: 'Conservative profile loaded: lower risk exposure with wider stop-distance planning.',
    },
    balanced: {
      riskPercent: 1.0,
      slPoints: 70,
      note: 'Balanced profile loaded: moderate risk with practical stop-distance assumptions.',
    },
    aggressive: {
      riskPercent: 1.5,
      slPoints: 50,
      note: 'Aggressive profile loaded: higher risk per trade with tighter stop control required.',
    },
  };

  const whatIfButtons = document.querySelectorAll('.whatif-btn');
  const whatIfSummary = document.getElementById('whatIfSummary');
  const simOptionType = document.getElementById('simOptionType');
  const simStrikePrice = document.getElementById('simStrikePrice');
  const simPremiumReceived = document.getElementById('simPremiumReceived');
  const simStopLossPremium = document.getElementById('simStopLossPremium');
  const simTargetPremium = document.getElementById('simTargetPremium');
  const simLotSize = document.getElementById('simLotSize');
  const simCapital = document.getElementById('simCapital');
  const simRiskPercent = document.getElementById('simRiskPercent');
  const whatIfSimOutput = document.getElementById('whatIfSimOutput');
  const simPresetButtons = document.querySelectorAll('.sim-preset-btn');
  const simPresetSummary = document.getElementById('simPresetSummary');

  const simulatorPresets = {
    'bnf-call': {
      label: 'BankNifty Weekly CE Sell',
      optionType: 'call',
      strike: 49500,
      premium: 210,
      stopPremium: 320,
      targetPremium: 110,
      lotSize: 30,
      capital: 600000,
      riskPercent: 1,
      note: 'OTM call sell idea with controlled premium stop and decay-based target.',
    },
    'bnf-put': {
      label: 'BankNifty Weekly PE Sell',
      optionType: 'put',
      strike: 48500,
      premium: 195,
      stopPremium: 295,
      targetPremium: 95,
      lotSize: 30,
      capital: 600000,
      riskPercent: 1,
      note: 'OTM put sell sample with risk-defined SL and disciplined target exit.',
    },
    'nifty-ic': {
      label: 'Nifty Iron Condor Side',
      optionType: 'call',
      strike: 22600,
      premium: 105,
      stopPremium: 160,
      targetPremium: 55,
      lotSize: 75,
      capital: 500000,
      riskPercent: 0.8,
      note: 'Single-side condor leg simulation to estimate risk load before full structure.',
    },
  };

  whatIfButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const profile = riskProfiles[button.dataset.riskProfile || ''];
      if (!profile) {
        return;
      }

      if (riskPercentInput) {
        riskPercentInput.value = String(profile.riskPercent);
      }

      if (slPointsInput) {
        slPointsInput.value = String(profile.slPoints);
      }

      whatIfButtons.forEach((node) => node.classList.toggle('is-active', node === button));

      if (whatIfSummary) {
        whatIfSummary.textContent = profile.note;
      }

      positionCalculateBtn.click();
    });
  });

  if (whatIfSimulateBtn && whatIfSimOutput) {
    whatIfSimulateBtn.addEventListener('click', () => {
      const optionType = simOptionType?.value || 'call';
      const strike = Number(simStrikePrice?.value || 0);
      const premium = Number(simPremiumReceived?.value || 0);
      const stopPremium = Number(simStopLossPremium?.value || 0);
      const targetPremium = Number(simTargetPremium?.value || 0);
      const lotSize = Number(simLotSize?.value || 0);
      const capital = Number(simCapital?.value || 0);
      const riskPercent = Number(simRiskPercent?.value || 0);

      if (!(strike > 0) || !(premium > 0) || !(stopPremium > 0) || !(targetPremium > 0) || !(lotSize > 0)) {
        whatIfSimOutput.innerHTML = '<p>Please enter valid positive values for strike, premium, stop, target, and lot size.</p>';
        return;
      }

      if (stopPremium <= premium) {
        whatIfSimOutput.innerHTML = '<p>Stop-loss premium should be above premium received for a short premium trade.</p>';
        return;
      }

      if (targetPremium >= premium) {
        whatIfSimOutput.innerHTML = '<p>Target exit premium should be below premium received to model a profitable decay exit.</p>';
        return;
      }

      const riskPerLot = (stopPremium - premium) * lotSize;
      const rewardPerLot = (premium - targetPremium) * lotSize;
      const breakEven = optionType === 'call' ? strike + premium : strike - premium;
      const rrRatio = rewardPerLot / riskPerLot;
      const maxRiskAmount = capital > 0 && riskPercent > 0 ? (capital * riskPercent) / 100 : 0;
      const suggestedLots = maxRiskAmount > 0 ? Math.floor(maxRiskAmount / riskPerLot) : 0;
      const ratioLabel = rrRatio >= 2 ? 'good' : rrRatio >= 1.3 ? 'ok' : 'risky';
      const outlook = rrRatio >= 2 ? 'Favorable' : rrRatio >= 1.3 ? 'Tradable' : 'High-Risk';

      whatIfSimOutput.innerHTML = `
        <strong>${optionType === 'call' ? 'Short Call' : 'Short Put'} Simulation: ${outlook}</strong>
        <p>Break-even level: <strong>${breakEven.toFixed(2)}</strong> | Planned R:R: <strong>1 : ${rrRatio.toFixed(2)}</strong></p>
        <span class="rr-chip ${ratioLabel}">${outlook} Scenario</span>
        <div class="sim-metrics">
          <span>Planned max loss per lot: <strong>${formatInr(riskPerLot)}</strong></span>
          <span>Planned reward per lot: <strong>${formatInr(rewardPerLot)}</strong></span>
          <span>Risk budget per trade: <strong>${formatInr(maxRiskAmount)}</strong></span>
          <span>Suggested lots: <strong>${suggestedLots.toLocaleString('en-IN')}</strong></span>
        </div>
      `;
    });
  }

  simPresetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const preset = simulatorPresets[button.dataset.simPreset || ''];

      if (!preset) {
        return;
      }

      if (simOptionType) {
        simOptionType.value = preset.optionType;
      }

      if (simStrikePrice) {
        simStrikePrice.value = String(preset.strike);
      }

      if (simPremiumReceived) {
        simPremiumReceived.value = String(preset.premium);
      }

      if (simStopLossPremium) {
        simStopLossPremium.value = String(preset.stopPremium);
      }

      if (simTargetPremium) {
        simTargetPremium.value = String(preset.targetPremium);
      }

      if (simLotSize) {
        simLotSize.value = String(preset.lotSize);
      }

      if (simCapital) {
        simCapital.value = String(preset.capital);
      }

      if (simRiskPercent) {
        simRiskPercent.value = String(preset.riskPercent);
      }

      simPresetButtons.forEach((node) => node.classList.toggle('is-active', node === button));

      if (simPresetSummary) {
        simPresetSummary.textContent = `${preset.label} loaded: ${preset.note}`;
      }

      whatIfSimulateBtn?.click();
    });
  });
};

initializeRiskToolkit();

const initializeConsultationSelector = () => {
  const profileSelector = document.getElementById('profileSelector');
  const planOutput = document.getElementById('consultationPlanOutput');

  if (!profileSelector || !planOutput) {
    return;
  }

  const plans = {
    beginner: {
      title: 'Beginner Plan',
      summary: 'Primary focus: capital protection, clean risk habits, and process-first execution.',
      points: [
        'Recommended style: limited-frequency index setups',
        'Risk model: 0.5% to 1.0% per trade',
        'First 7-day plan: checklist discipline + stop-loss consistency',
      ],
    },
    active: {
      title: 'Active Trader Plan',
      summary: 'Primary focus: execution consistency, session planning, and behavior control under volatility.',
      points: [
        'Recommended style: level-based intraday structure trades',
        'Risk model: 0.8% to 1.2% per trade',
        'First 7-day plan: opening-hour protocol + post-session review loop',
      ],
    },
    options: {
      title: 'Options Seller Plan',
      summary: 'Primary focus: premium capture with risk-defined structures and event-window control.',
      points: [
        'Recommended style: spread-based options framework',
        'Risk model: exposure caps with hedge triggers',
        'First 7-day plan: event-risk map + adjustment checklist',
      ],
    },
  };

  const renderPlan = (key) => {
    const plan = plans[key] || plans.beginner;
    planOutput.innerHTML = `
      <h3>${plan.title}</h3>
      <p>${plan.summary}</p>
      <ul>
        <li>${plan.points[0]}</li>
        <li>${plan.points[1]}</li>
        <li>${plan.points[2]}</li>
      </ul>
    `;
  };

  profileSelector.querySelectorAll('.profile-option').forEach((button) => {
    button.addEventListener('click', () => {
      const profile = button.dataset.profile || 'beginner';

      profileSelector.querySelectorAll('.profile-option').forEach((node) => {
        const isActive = node === button;
        node.classList.toggle('is-active', isActive);
        node.setAttribute('aria-selected', String(isActive));
      });

      renderPlan(profile);
    });
  });
};

initializeConsultationSelector();

const initializeSampleReportDownload = () => {
  const downloadButton = document.getElementById('downloadSampleReportBtn');
  const sampleReportStatus = document.getElementById('sampleReportStatus');

  if (!downloadButton) {
    return;
  }

  downloadButton.addEventListener('click', () => {
    const now = new Date();
    const dateLabel = now.toLocaleDateString('en-GB');
    const reportText = [
      'THEBEINGSELLER - SAMPLE WEEKLY MARKET PLAN',
      `Generated: ${dateLabel}`,
      '',
      '1) Weekly Bias',
      '- Primary trend: Neutral-to-bullish',
      '- Preferred side: Buy-on-dips above key support',
      '',
      '2) Key Levels',
      '- Resistance zone: 22,420 to 22,480',
      '- Support zone: 22,110 to 22,040',
      '',
      '3) Risk Zones',
      '- High volatility windows: Opening 45 minutes, major macro events',
      '- Reduce size during event spikes',
      '',
      '4) Setup Watchlist',
      '- Breakout continuation with volume confirmation',
      '- Failed breakdown reversal near support',
      '',
      '5) Invalidation Plan',
      '- Exit on structure break below planned invalidation',
      '- Never average losers beyond risk plan',
      '',
      'Disclaimer: Educational planning sample. Not a guaranteed return document.',
    ].join('\n');

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const fileUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = `thebeingseller-sample-report-${now.toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(fileUrl);

    if (sampleReportStatus) {
      sampleReportStatus.textContent = 'Sample report downloaded successfully.';
    }
  });
};

initializeSampleReportDownload();

const initializeContactAssist = () => {
  if (messageInput && messageCounter) {
    messageInput.setAttribute('maxlength', '300');

    const updateCounter = () => {
      messageCounter.textContent = `${messageInput.value.length} / 300`;
    };

    updateCounter();
    messageInput.addEventListener('input', updateCounter);
  }

  quickTemplateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!messageInput) {
        return;
      }

      messageInput.value = button.dataset.template || '';
      messageInput.dispatchEvent(new Event('input', { bubbles: true }));
      messageInput.focus();
    });
  });
};

initializeContactAssist();

const initializeMagneticCtaAndCursorGlow = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (finePointer && !reducedMotion) {
    document.body.classList.add('cursor-glow-enabled');

    let rafId = null;
    let pendingX = 0;
    let pendingY = 0;

    const paintGlow = () => {
      document.body.style.setProperty('--cursor-x', `${pendingX}px`);
      document.body.style.setProperty('--cursor-y', `${pendingY}px`);
      rafId = null;
    };

    window.addEventListener('mousemove', (event) => {
      pendingX = event.clientX;
      pendingY = event.clientY;

      if (rafId === null) {
        rafId = window.requestAnimationFrame(paintGlow);
      }
    });
  }

  if (reducedMotion || !finePointer) {
    return;
  }

  const magneticTargets = document.querySelectorAll('.hero-actions .btn, .contact-quick-actions .quick-template');

  magneticTargets.forEach((target) => {
    target.classList.add('is-magnetic');

    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + (rect.width / 2));
      const offsetY = event.clientY - (rect.top + (rect.height / 2));

      const moveX = offsetX * 0.16;
      const moveY = (offsetY * 0.16) - 2;
      target.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
    });

    const resetMagnet = () => {
      target.style.transform = '';
    };

    target.addEventListener('pointerleave', resetMagnet);
    target.addEventListener('blur', resetMagnet);
  });
};

initializeMagneticCtaAndCursorGlow();

const THEME_MINIMAL_PRO = 'minimal-pro';
const THEME_PREMIUM_LIGHT = 'premium-light';

const normalizeTheme = (value) => {
  if (value === 'light') {
    return THEME_PREMIUM_LIGHT;
  }

  if (value === 'dark') {
    return THEME_MINIMAL_PRO;
  }

  return value === THEME_PREMIUM_LIGHT ? THEME_PREMIUM_LIGHT : THEME_MINIMAL_PRO;
};

const getCurrentTheme = () => (document.body.classList.contains('light-theme') ? 'light' : 'dark');

const updateThemeColor = () => {
  if (!themeColorMeta) {
    return;
  }

  themeColorMeta.setAttribute('content', getCurrentTheme() === 'light' ? '#f6f3eb' : '#06101c');
};

const initializeMarketSessionStrip = () => {
  const sessionStrip = document.getElementById('marketSessionStrip');
  const sessionLabel = document.getElementById('sessionLabel');
  const sessionNote = document.getElementById('sessionNote');
  const sessionClock = document.getElementById('sessionClock');
  const sessionPersona = document.getElementById('sessionPersona');
  const heroSessionPersona = document.getElementById('heroSessionPersona');

  if (!sessionStrip || !sessionLabel || !sessionNote || !sessionClock) {
    return;
  }

  const formatIstParts = () => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date());
    const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const hour = Number(lookup.hour || 0);
    const minute = Number(lookup.minute || 0);
    const weekday = lookup.weekday || 'Mon';

    return {
      weekday,
      minutes: (hour * 60) + minute,
      clock: `${lookup.hour}:${lookup.minute} IST`,
    };
  };

  const getSessionState = () => {
    const { weekday, minutes, clock } = formatIstParts();
    const isWeekend = weekday === 'Sat' || weekday === 'Sun';

    if (isWeekend) {
      return {
        stateClass: 'is-closed',
        label: 'Market Closed (Weekend)',
        note: 'Next session starts Monday at 09:00 IST',
        mode: 'Weekend Review',
        focus: 'Review weekly journal, update risk limits, and prepare next-session watchlists.',
        persona: 'Desk Tone: Deep review mode, no forced action.',
        heroPersona: 'Session Personality: Journal review, thesis refinement, and calm planning.',
        clock,
      };
    }

    if (minutes >= 540 && minutes < 555) {
      return {
        stateClass: 'is-preopen',
        label: 'Pre-open Session Active',
        note: 'Regular trading opens at 09:15 IST',
        mode: 'Pre-open',
        focus: 'Track gap cues, opening levels, and event-risk conditions before first execution.',
        persona: 'Desk Tone: Alert and selective, waiting for opening structure.',
        heroPersona: 'Session Personality: Prepare levels, define invalidation, then execute with patience.',
        clock,
      };
    }

    if (minutes >= 555 && minutes < 630) {
      return {
        stateClass: 'is-open',
        label: 'Market Open (Opening Hour)',
        note: 'High volatility window - prioritize execution discipline',
        mode: 'Opening Hour',
        focus: 'Prioritize volatility control, clear invalidation levels, and avoid impulsive entries.',
        persona: 'Desk Tone: Fast and disciplined, only A+ setups.',
        heroPersona: 'Session Personality: High-energy tape, strict stops, zero impulsive trades.',
        clock,
      };
    }

    if (minutes >= 630 && minutes < 870) {
      return {
        stateClass: 'is-open',
        label: 'Market Open (Mid Session)',
        note: 'Trend confirmation window for cleaner setups',
        mode: 'Mid Session',
        focus: 'Focus on trend continuation, level retests, and structured position sizing.',
        persona: 'Desk Tone: Structured execution with trend-following patience.',
        heroPersona: 'Session Personality: Smooth pace, selective continuation and pullback entries.',
        clock,
      };
    }

    if (minutes >= 870 && minutes < 930) {
      return {
        stateClass: 'is-open',
        label: 'Market Open (Closing Hour)',
        note: 'Prepare closing review and next-session plan',
        mode: 'Closing Hour',
        focus: 'Reduce late-session overtrading and update next-session watchlist with key levels.',
        persona: 'Desk Tone: Defensive closeout, protect gains first.',
        heroPersona: 'Session Personality: Capital protection and clean end-of-day execution.',
        clock,
      };
    }

    return {
      stateClass: 'is-closed',
      label: 'Market Closed',
      note: 'Pre-open resumes at 09:00 IST on trading days',
      mode: 'Post-market Review',
      focus: 'Review executions, update journal notes, and refine the next-day playbook.',
      persona: 'Desk Tone: Reflection mode with planning bias.',
      heroPersona: 'Session Personality: Analyze mistakes, lock lessons, and prep tomorrow.',
      clock,
    };
  };

  const renderSession = () => {
    const modeChip = document.getElementById('marketModeChip');
    const modeFocus = document.getElementById('marketModeFocus');
    const state = getSessionState();
    sessionStrip.classList.remove('is-open', 'is-preopen', 'is-closed');
    sessionStrip.classList.add(state.stateClass);
    sessionLabel.textContent = state.label;
    sessionNote.textContent = state.note;
    sessionClock.textContent = state.clock;

    if (modeChip) {
      modeChip.textContent = `Session Mode: ${state.mode}`;
    }

    if (modeFocus) {
      modeFocus.textContent = `Focus: ${state.focus}`;
    }

    if (sessionPersona) {
      sessionPersona.textContent = state.persona;
    }

    if (heroSessionPersona) {
      heroSessionPersona.textContent = state.heroPersona;
    }

    document.body.setAttribute('data-market-session', state.mode.toLowerCase().replace(/\s+/g, '-'));
  };

  renderSession();
  window.setInterval(renderSession, 30000);
};

initializeMarketSessionStrip();

const initializeMarketMoodThermometer = () => {
  const gauge = document.getElementById('marketMoodGauge');
  const valueNode = document.getElementById('marketMoodValue');
  const zoneNode = document.getElementById('marketMoodZone');
  const titleNode = document.getElementById('marketMoodTitle');
  const guidanceNode = document.getElementById('marketMoodGuidance');
  const stanceNode = document.getElementById('marketMoodStance');
  const riskNode = document.getElementById('marketMoodRisk');
  const markerNode = document.getElementById('marketMoodMarker');

  if (!gauge || !valueNode || !zoneNode || !titleNode || !guidanceNode || !stanceNode || !riskNode || !markerNode) {
    return;
  }

  const moodSnapshots = [
    {
      score: 76,
      zoneLabel: 'Green Zone',
      zoneClass: 'mood-zone-safe',
      title: 'High Confidence Tape',
      guidance: 'Trend quality is favorable. Trade only validated pullbacks with defined invalidation.',
      stance: 'Trend continuation setups',
      risk: 'Normal sizing is allowed, but keep hard stops in place.',
      color: '#1fb89f',
    },
    {
      score: 62,
      zoneLabel: 'Caution Zone',
      zoneClass: 'mood-zone-caution',
      title: 'Balanced Confidence',
      guidance: 'Momentum is tradable but selective. Wait for clean confirmations and avoid forcing setups.',
      stance: 'Selective long or mean-reversion entries',
      risk: 'Keep per-trade risk capped near 1%.',
      color: '#d5ae5a',
    },
    {
      score: 34,
      zoneLabel: 'Protection Zone',
      zoneClass: 'mood-zone-protect',
      title: 'Low Conviction Market',
      guidance: 'Conditions are noisy. Prioritize capital defense over trade frequency.',
      stance: 'No-trade or micro-size only',
      risk: 'Reduce exposure and skip marginal setups.',
      color: '#ff7a7a',
    },
    {
      score: 69,
      zoneLabel: 'Caution Zone',
      zoneClass: 'mood-zone-caution',
      title: 'Watchlist-Driven Session',
      guidance: 'Setup quality can improve around key levels. Execute only A-grade structures.',
      stance: 'Event-aligned intraday entries',
      risk: 'Hold size moderate and avoid revenge trades.',
      color: '#d5ae5a',
    },
  ];

  let activeMoodIndex = 0;

  const renderMood = (snapshot) => {
    const boundedScore = Math.max(0, Math.min(100, snapshot.score));
    valueNode.textContent = String(boundedScore);
    titleNode.textContent = snapshot.title;
    guidanceNode.textContent = snapshot.guidance;
    stanceNode.textContent = snapshot.stance;
    riskNode.textContent = snapshot.risk;
    zoneNode.textContent = snapshot.zoneLabel;

    zoneNode.classList.remove('mood-zone-safe', 'mood-zone-caution', 'mood-zone-protect');
    zoneNode.classList.add(snapshot.zoneClass);

    gauge.style.setProperty('--mood-score', String(boundedScore));
    gauge.style.setProperty('--mood-color', snapshot.color);
    markerNode.style.left = `${boundedScore}%`;
    gauge.setAttribute('aria-label', `Market confidence score ${boundedScore} out of 100`);
  };

  renderMood(moodSnapshots[activeMoodIndex]);

  window.setInterval(() => {
    activeMoodIndex = (activeMoodIndex + 1) % moodSnapshots.length;
    renderMood(moodSnapshots[activeMoodIndex]);
  }, 6200);
};

initializeMarketMoodThermometer();

const initializeSentimentMotion = () => {
  const sentimentVisual = document.querySelector('.bull-bear-visual');
  const moodChip = document.getElementById('bbMoodChip');
  const bullPressure = document.getElementById('bbBullPressure');
  const bearPressure = document.getElementById('bbBearPressure');

  if (!sentimentVisual || !moodChip || !bullPressure || !bearPressure) {
    return;
  }

  const marketSnapshots = [
    { mood: 'bullish', label: 'Bullish Bias', bull: '+1.84%', bear: '-0.78%' },
    { mood: 'neutral', label: 'Balanced Tape', bull: '+0.62%', bear: '-0.51%' },
    { mood: 'bearish', label: 'Bearish Bias', bull: '+0.38%', bear: '-1.42%' },
    { mood: 'bullish', label: 'Bullish Momentum', bull: '+1.29%', bear: '-0.67%' },
  ];

  let activeIndex = 0;

  const applySnapshot = (snapshot) => {
    sentimentVisual.classList.remove('is-bullish', 'is-bearish', 'is-neutral');
    sentimentVisual.classList.add(`is-${snapshot.mood}`);
    moodChip.textContent = snapshot.label;
    bullPressure.textContent = snapshot.bull;
    bearPressure.textContent = snapshot.bear;
  };

  applySnapshot(marketSnapshots[activeIndex]);

  window.setInterval(() => {
    activeIndex = (activeIndex + 1) % marketSnapshots.length;
    applySnapshot(marketSnapshots[activeIndex]);
  }, 5200);
};

initializeSentimentMotion();

const initializeThemeToggle = () => {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const applyTheme = (themeMode) => {
    const normalizedTheme = normalizeTheme(themeMode);
    const isPremiumLight = normalizedTheme === THEME_PREMIUM_LIGHT;

    document.body.classList.toggle('light-theme', isPremiumLight);
    document.documentElement.setAttribute('data-theme', normalizedTheme);

    if (isPremiumLight) {
      themeToggle.innerHTML = '<i class="bi bi-brightness-high-fill"></i><span>Premium Light</span>';
      themeToggle.setAttribute('aria-label', 'Switch to Minimal Pro theme');
      themeToggle.setAttribute('title', 'Current: Premium Light');
    } else {
      themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i><span>Minimal Pro</span>';
      themeToggle.setAttribute('aria-label', 'Switch to Premium Light theme');
      themeToggle.setAttribute('title', 'Current: Minimal Pro');
    }

    localStorage.setItem('theme', normalizedTheme);
    updateThemeColor();
  };

  const savedTheme = normalizeTheme(localStorage.getItem('theme') || THEME_MINIMAL_PRO);
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light-theme')
      ? THEME_MINIMAL_PRO
      : THEME_PREMIUM_LIGHT;

    applyTheme(nextTheme);
    refreshMarketWidgets();
  });
};

initializeThemeToggle();

let hasLoadedChart = false;
let hasLoadedTickerTape = false;
let activeTradingViewChartScript = null;

const setChartFallback = (message) => {
  if (!chartFallback) {
    return;
  }

  chartFallback.textContent = message;
};

const loadTickerTape = () => {
  const tickerContainer = document.getElementById('marketTickerTape');
  if (!tickerContainer || !tickerContainer.parentElement) {
    return;
  }

  const widgetShell = tickerContainer.parentElement;
  tickerContainer.innerHTML = '';
  widgetShell.querySelectorAll('script[data-ticker-tape-script="true"]').forEach((scriptNode) => scriptNode.remove());

  const script = document.createElement('script');
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
  script.async = true;
  script.dataset.tickerTapeScript = 'true';
  script.text = JSON.stringify({
    symbols: [
      { proName: 'NSE:BANKNIFTY', title: 'BankNifty' },
      { proName: 'BSE:SENSEX', title: 'Sensex' },
      { proName: 'NSE:NIFTY', title: 'Nifty 50' },
    ],
    showSymbolLogo: false,
    isTransparent: true,
    displayMode: 'adaptive',
    colorTheme: getCurrentTheme(),
    locale: 'en',
  });

  widgetShell.appendChild(script);
};

const loadTradingViewChart = () => {
  const chartContainer = document.getElementById('tradingview-chart');
  if (!chartContainer) return;

  chartContainer.replaceChildren();

  // Remove only advanced-chart scripts so we don't break other widgets like ticker tape.
  document
    .querySelectorAll('script[data-tradingview-advanced-chart="true"], script[src*="embed-widget-advanced-chart.js"]')
    .forEach((scriptNode) => scriptNode.remove());

  const container = document.createElement('div');
  container.className = 'tradingview-widget-container';
  container.style.width = '100%';
  container.style.height = '100%';

  const widget = document.createElement('div');
  widget.className = 'tradingview-widget-container__widget';
  widget.style.width = '100%';
  widget.style.height = '100%';
  container.appendChild(widget);

  const loader = document.createElement('script');
  loader.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
  loader.async = true;
  loader.dataset.tradingviewAdvancedChart = 'true';
  loader.text = JSON.stringify({
    autosize: true,
    symbol: 'BSE:SENSEX',
    interval: '15',
    timezone: 'Asia/Kolkata',
    theme: getCurrentTheme(),
    style: '1',
    locale: 'en',
    allow_symbol_change: false,
    hide_top_toolbar: false,
    hide_side_toolbar: false,
    enable_publishing: false,
    save_image: false,
    withdateranges: true,
    support_host: 'https://www.tradingview.com',
  });

  let fallbackTimeout = null;
  loader.addEventListener('load', () => {
    if (fallbackTimeout) {
      window.clearTimeout(fallbackTimeout);
    }

    setChartFallback('');
  });

  loader.addEventListener('error', () => {
    if (fallbackTimeout) {
      window.clearTimeout(fallbackTimeout);
    }

    setChartFallback('Live chart is temporarily unavailable. Please refresh or check your network.');
  });

  fallbackTimeout = window.setTimeout(() => {
    setChartFallback('Chart feed is taking longer than expected. Data provider may be slow right now.');
  }, 9000);

  container.appendChild(loader);
  chartContainer.appendChild(container);
  activeTradingViewChartScript = loader;
};

const refreshMarketWidgets = () => {
  if (hasLoadedTickerTape) {
    loadTickerTape();
  }

  if (hasLoadedChart) {
    loadTradingViewChart();
  }
};

const initializeMarketWidgets = () => {
  const tickerShell = document.querySelector('.ticker-shell');
  const chartContainer = document.getElementById('tradingview-chart');

  const widgetObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (entry.target === tickerShell && !hasLoadedTickerTape) {
          hasLoadedTickerTape = true;
          loadTickerTape();
          observer.unobserve(entry.target);
        }

        if (entry.target === chartContainer && !hasLoadedChart) {
          hasLoadedChart = true;
          loadTradingViewChart();
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '180px 0px', threshold: 0.05 }
  );

  if (tickerShell) {
    widgetObserver.observe(tickerShell);
  }

  if (chartContainer) {
    widgetObserver.observe(chartContainer);
  }
};

initializeMarketWidgets();

const validateForm = ({ name, email, phone, message }) => {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+]?[(]?[0-9\s-]{8,20}$/;

  if (name.length < 2) {
    errors.name = 'Please enter your full name.';
  }

  if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!phonePattern.test(phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (message.length < 10) {
    errors.message = 'Please enter a message with at least 10 characters.';
  }

  return errors;
};

const setFieldErrorState = (fieldName, hasError) => {
  const field = contactForm?.querySelector(`[name="${fieldName}"]`);
  if (!field) {
    return;
  }

  field.classList.toggle('field-error', hasError);
}

const setFeedback = (message, type) => {
  if (!formFeedback) {
    return;
  }

  formFeedback.textContent = message;
  formFeedback.classList.remove('is-error', 'is-success');
  formFeedback.classList.add(type === 'error' ? 'is-error' : 'is-success');
};

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (isContactSubmitting) {
      return;
    }

    const activeSubmitButton = event.submitter instanceof HTMLButtonElement
      ? event.submitter
      : submitButton;

    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };

    const errors = validateForm(payload);
    ['name', 'email', 'phone', 'message'].forEach((fieldName) => {
      setFieldErrorState(fieldName, Boolean(errors[fieldName]));
    });

    if (Object.keys(errors).length > 0) {
      setFeedback(Object.values(errors)[0], 'error');
      return;
    }

    let timeoutId;

    try {
      isContactSubmitting = true;
      setFeedback('', 'success');
      if (contactSuccessPanel) {
        contactSuccessPanel.hidden = true;
      }

      if (activeSubmitButton) {
        activeSubmitButton.disabled = true;
        activeSubmitButton.textContent = 'Sending...';
      }

      const controller = new AbortController();
      timeoutId = window.setTimeout(() => {
        controller.abort();
      }, REQUEST_TIMEOUT_MS);

      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const responseText = await response.text();
      let result = {};
      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (_error) {
          result = {
            message: responseText,
          };
        }
      }

      if (!response.ok) {
        throw new Error(result.message || 'Unable to submit inquiry right now.');
      }

      setFeedback('Inquiry sent successfully. The trader will contact you soon.', 'success');
      if (contactSuccessPanel) {
        const confirmationTime = new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Asia/Kolkata',
        });

        contactSuccessPanel.hidden = false;
        if (contactSuccessRef) {
          contactSuccessRef.textContent = `Submitted on ${confirmationTime} IST. For faster coordination, continue on WhatsApp.`;
        }
      }
      contactForm.reset();
      if (messageInput) {
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      ['name', 'email', 'phone', 'message'].forEach((fieldName) => setFieldErrorState(fieldName, false));
    } catch (error) {
      if (contactSuccessPanel) {
        contactSuccessPanel.hidden = true;
      }

      if (error.name === 'AbortError') {
        setFeedback('Server response is taking too long. Please try again in a few seconds.', 'error');
      } else {
        setFeedback(error.message || 'Something went wrong while sending your inquiry.', 'error');
      }
    } finally {
      isContactSubmitting = false;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      if (activeSubmitButton) {
        activeSubmitButton.disabled = false;
        activeSubmitButton.textContent = 'Send Inquiry';
      }
    }
  });
}

const initializeTemporaryFeedbackForm = () => {
  const widget = document.getElementById('tempFeedbackWidget');
  const form = document.getElementById('tempFeedbackForm');
  const closeBtn = document.getElementById('tempFeedbackClose');
  const laterBtn = document.getElementById('tempFeedbackLater');
  const submitBtn = document.getElementById('tempFeedbackSubmit');
  const statusNode = document.getElementById('tempFeedbackStatus');
  const openFeedbackBtn = document.getElementById('openFeedbackBtn');

  if (!widget || !form || !submitBtn || !statusNode) {
    return;
  }

  const FEEDBACK_CAMPAIGN_END_ISO = '2026-04-10T23:59:59+05:30';
  const FEEDBACK_DISMISS_KEY = 'ts_temp_feedback_dismissed_v1';
  const FEEDBACK_SUBMITTED_KEY = 'ts_temp_feedback_submitted_v1';
  const MIN_FEEDBACK_ENGAGEMENT_MS = 15000;

  const isExpired = Date.now() > new Date(FEEDBACK_CAMPAIGN_END_ISO).getTime();
  const isDismissed = localStorage.getItem(FEEDBACK_DISMISS_KEY) === '1';
  const isSubmitted = localStorage.getItem(FEEDBACK_SUBMITTED_KEY) === '1';

  if (isExpired) {
    if (openFeedbackBtn) {
      openFeedbackBtn.hidden = true;
    }

    return;
  }

  if (isSubmitted && openFeedbackBtn) {
    openFeedbackBtn.disabled = true;
    openFeedbackBtn.classList.add('is-disabled');
    openFeedbackBtn.textContent = 'Feedback Submitted';
  }

  let isSubmitting = false;
  let hasOpened = false;
  let hasVisitedPageEnd = false;
  let hasMinimumEngagement = false;
  let hasMeaningfulInteraction = false;

  const phonePattern = /^[+]?[(]?[0-9\s-]{8,20}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const openWidgetIfEligible = () => {
    if (hasOpened || !hasVisitedPageEnd || !hasMinimumEngagement || !hasMeaningfulInteraction) {
      return;
    }

    hasOpened = true;
    widget.classList.add('is-open');
  };

  const setStatus = (message, type) => {
    statusNode.textContent = message;
    statusNode.classList.remove('is-error', 'is-success');

    if (type === 'error') {
      statusNode.classList.add('is-error');
    }

    if (type === 'success') {
      statusNode.classList.add('is-success');
    }
  };

  const openWidget = () => {
    widget.classList.add('is-open');
  };

  const hideWidget = (remember = false) => {
    widget.classList.remove('is-open');

    if (remember) {
      localStorage.setItem(FEEDBACK_DISMISS_KEY, '1');
    }
  };

  const markVisitedPageEnd = () => {
    hasVisitedPageEnd = true;
    openWidgetIfEligible();
  };

  if (!isDismissed && !isSubmitted) {
    window.setTimeout(() => {
      hasMinimumEngagement = true;
      openWidgetIfEligible();
    }, MIN_FEEDBACK_ENGAGEMENT_MS);

    const markInteraction = () => {
      hasMeaningfulInteraction = true;
      openWidgetIfEligible();
      window.removeEventListener('click', markInteraction);
      window.removeEventListener('keydown', markInteraction);
    };

    window.addEventListener('click', markInteraction, { passive: true });
    window.addEventListener('keydown', markInteraction);

    const footer = document.querySelector('.site-footer');

    if (footer && 'IntersectionObserver' in window) {
      const footerObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            markVisitedPageEnd();
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.28,
        }
      );

      footerObserver.observe(footer);
    }

    const scrollFallback = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollTop > 140) {
        hasMeaningfulInteraction = true;
      }

      if (pageHeight <= 0) {
        return;
      }

      const progress = (scrollTop / pageHeight) * 100;

      if (progress >= 88) {
        markVisitedPageEnd();
        window.removeEventListener('scroll', scrollFallback);
      }
    };

    window.addEventListener('scroll', scrollFallback, { passive: true });
  }

  openFeedbackBtn?.addEventListener('click', () => {
    if (openFeedbackBtn.disabled) {
      return;
    }

    hasOpened = true;
    openWidget();
  });

  closeBtn?.addEventListener('click', () => hideWidget(true));
  laterBtn?.addEventListener('click', () => hideWidget(true));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const name = String(document.getElementById('tempFeedbackName')?.value || '').trim();
    const email = String(document.getElementById('tempFeedbackEmail')?.value || '').trim();
    const phone = String(document.getElementById('tempFeedbackPhone')?.value || '').trim();
    const rating = String(document.getElementById('tempFeedbackRating')?.value || '').trim();
    const feedbackText = String(document.getElementById('tempFeedbackMessage')?.value || '').trim();

    if (name.length < 2) {
      setStatus('Please enter your full name.', 'error');
      return;
    }

    if (!emailPattern.test(email)) {
      setStatus('Please enter a valid email address.', 'error');
      return;
    }

    if (!phonePattern.test(phone)) {
      setStatus('Please enter a valid phone number.', 'error');
      return;
    }

    if (!rating) {
      setStatus('Please select your experience rating.', 'error');
      return;
    }

    if (feedbackText.length < 10) {
      setStatus('Please add feedback with at least 10 characters.', 'error');
      return;
    }

    const payload = {
      name,
      email,
      phone,
      message: `[Temporary Website Feedback]\nRating: ${rating}\nFeedback: ${feedbackText}`,
    };

    let timeoutId;

    try {
      isSubmitting = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      setStatus('', 'success');

      const controller = new AbortController();
      timeoutId = window.setTimeout(() => {
        controller.abort();
      }, REQUEST_TIMEOUT_MS);

      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const responseText = await response.text();
      let result = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (_error) {
          result = {
            message: responseText,
          };
        }
      }

      if (!response.ok) {
        throw new Error(result.message || 'Unable to submit feedback right now.');
      }

      setStatus('Thanks for your feedback. This helps us improve quickly.', 'success');
      localStorage.setItem(FEEDBACK_SUBMITTED_KEY, '1');

      if (openFeedbackBtn) {
        openFeedbackBtn.disabled = true;
        openFeedbackBtn.classList.add('is-disabled');
        openFeedbackBtn.textContent = 'Feedback Submitted';
      }

      window.setTimeout(() => {
        hideWidget(false);
      }, 1600);
      form.reset();
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatus('Server is taking too long. Please retry in a few seconds.', 'error');
      } else {
        setStatus(error.message || 'Unable to submit feedback right now.', 'error');
      }
    } finally {
      isSubmitting = false;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Feedback';
    }
  });
};

initializeTemporaryFeedbackForm();

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

// -- Economic Calendar -------------------------------------------------------

const economicCalendarEvents = [
  {
    date: 'Apr 04',
    day: 'Friday',
    event: 'RBI Monetary Policy Meeting',
    description: 'Reserve Bank of India interest rate decision and policy statement.',
    category: 'Monetary Policy',
    impact: 'high',
  },
  {
    date: 'Apr 12',
    day: 'Saturday',
    event: 'India Inflation Data (CPI)',
    description: 'Consumer Price Index - key indicator for RBI rate path expectations.',
    category: 'Macro Data',
    impact: 'high',
  },
  {
    date: 'Apr 14',
    day: 'Monday',
    event: 'India WPI Inflation',
    description: 'Wholesale Price Index affecting manufacturing and commodity sector outlook.',
    category: 'Macro Data',
    impact: 'medium',
  },
  {
    date: 'Apr 22',
    day: 'Tuesday',
    event: 'Q4 Corporate Earnings Season',
    description: 'Major index-heavy stocks begin reporting quarterly results - index mover.',
    category: 'Earnings',
    impact: 'high',
  },
  {
    date: 'Apr 29',
    day: 'Tuesday',
    event: 'US Federal Reserve Meeting',
    description: 'Fed rate decision and forward guidance - global risk sentiment impact.',
    category: 'Global',
    impact: 'high',
  },
  {
    date: 'May 15',
    day: 'Thursday',
    event: 'India GDP Data',
    description: 'Quarterly GDP growth print affecting macro positioning and FII flows.',
    category: 'Macro Data',
    impact: 'medium',
  },
  {
    date: 'Jul 05',
    day: 'Saturday',
    event: 'Union Budget Announcement',
    description: 'Annual central government budget with fiscal policy and spending directives.',
    category: 'Fiscal Policy',
    impact: 'high',
  },
  {
    date: 'Oct 10',
    day: 'Friday',
    event: 'US CPI Inflation Release',
    description: 'US inflation data influencing Fed rate trajectory and global capital flows.',
    category: 'Global',
    impact: 'medium',
  },
];

const renderEconomicCalendar = () => {
  const calendarBody = document.getElementById('calendarBody');
  if (!calendarBody) {
    return;
  }

  if (!economicCalendarEvents.length) {
    calendarBody.innerHTML = '<div class="calendar-empty-state">No major events scheduled right now. Please check again later.</div>';
    return;
  }

  calendarBody.innerHTML = economicCalendarEvents
    .map(
      (ev) => `
        <div class="calendar-row${ev.impact === 'high' ? ' is-high' : ''}">
          <div class="cal-date">
            ${ev.date}
            <small>${ev.day}</small>
          </div>
          <div class="cal-event">
            <strong>${ev.event}</strong>
            <p>${ev.description}</p>
          </div>
          <span class="cal-category">${ev.category}</span>
          <span class="impact-badge impact-${ev.impact}">${ev.impact.charAt(0).toUpperCase() + ev.impact.slice(1)}</span>
        </div>
      `
    )
    .join('');
};

renderEconomicCalendar();

// -- Animated Progress & Sentiment Bars -------------------------------------

const initializeAnimatedBars = () => {
  const bars = document.querySelectorAll('[data-anim-width]');
  if (!bars.length) {
    return;
  }

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const bar = entry.target;
        const targetWidth = bar.dataset.animWidth;
        window.setTimeout(() => {
          bar.style.width = `${targetWidth}%`;
        }, 150);
        barObserver.unobserve(bar);
      });
    },
    { threshold: 0.2 }
  );

  bars.forEach((bar) => barObserver.observe(bar));
};

initializeAnimatedBars();

const initializeMindBlowingMotion = () => {
  const heroSection = document.querySelector('.hero');
  const heroPanel = document.querySelector('.hero-panel');
  const signalCards = document.querySelectorAll('.hero-signal-strip article');
  const aboutProfileCard = document.querySelector('.about-profile-card');
  const servicesGrid = document.querySelector('.services-grid');
  const serviceCards = Array.from(document.querySelectorAll('.service-card'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    return;
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  if (heroSection) {
    let heroInView = true;
    let parallaxRafId = null;

    const renderHeroParallax = () => {
      parallaxRafId = null;

      if (!heroInView) {
        return;
      }

      const rect = heroSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const normalized = clamp((rect.top + (rect.height * 0.5) - (viewportHeight * 0.5)) / viewportHeight, -1, 1);
      const offsetY = clamp(normalized * 18, -18, 18);

      document.documentElement.style.setProperty('--hero-parallax-y', `${offsetY.toFixed(2)}px`);
    };

    const queueHeroParallax = () => {
      if (parallaxRafId !== null) {
        return;
      }

      parallaxRafId = window.requestAnimationFrame(renderHeroParallax);
    };

    const heroVisibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== heroSection) {
            return;
          }

          heroInView = entry.isIntersecting;

          if (heroInView) {
            queueHeroParallax();
          }
        });
      },
      { threshold: 0.08 }
    );

    heroVisibilityObserver.observe(heroSection);

    window.addEventListener('scroll', queueHeroParallax, { passive: true });
    window.addEventListener('resize', queueHeroParallax, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        queueHeroParallax();
      }
    });

    queueHeroParallax();
  }

  if (heroPanel && window.matchMedia('(pointer: fine)').matches) {
    let tiltRafId = null;
    let tiltX = 0;
    let tiltY = 0;
    let panelLift = 0;

    const paintTilt = () => {
      tiltRafId = null;
      heroPanel.style.setProperty('--hero-panel-tilt-x', `${tiltX.toFixed(2)}deg`);
      heroPanel.style.setProperty('--hero-panel-tilt-y', `${tiltY.toFixed(2)}deg`);
      heroPanel.style.setProperty('--hero-panel-lift', `${panelLift.toFixed(2)}px`);
    };

    const queueTilt = () => {
      if (tiltRafId !== null) {
        return;
      }

      tiltRafId = window.requestAnimationFrame(paintTilt);
    };

    heroPanel.addEventListener('pointermove', (event) => {
      const rect = heroPanel.getBoundingClientRect();
      const halfWidth = rect.width / 2;
      const halfHeight = rect.height / 2;
      const offsetX = event.clientX - rect.left - halfWidth;
      const offsetY = event.clientY - rect.top - halfHeight;

      tiltX = clamp((-offsetY / halfHeight) * 3.2, -3.2, 3.2);
      tiltY = clamp((offsetX / halfWidth) * 3.2, -3.2, 3.2);
      panelLift = clamp(-Math.hypot(offsetX, offsetY) * 0.018, -9, -1);
      queueTilt();
    });

    const resetTilt = () => {
      tiltX = 0;
      tiltY = 0;
      panelLift = 0;
      queueTilt();
    };

    heroPanel.addEventListener('pointerleave', resetTilt);
    heroPanel.addEventListener('blur', resetTilt);
  }

  if (signalCards.length) {
    let activeCardIndex = 0;

    const paintActiveSignal = (index) => {
      signalCards.forEach((card, cardIndex) => {
        card.classList.toggle('is-live', cardIndex === index);
      });
    };

    paintActiveSignal(activeCardIndex);

    const rotateSignals = () => {
      if (document.hidden) {
        return;
      }

      activeCardIndex = (activeCardIndex + 1) % signalCards.length;
      paintActiveSignal(activeCardIndex);
    };

    window.setInterval(rotateSignals, 2600);
  }

  if (aboutProfileCard) {
    const aboutCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== aboutProfileCard) {
            return;
          }

          aboutProfileCard.classList.toggle('is-scan-active', entry.isIntersecting);
        });
      },
      { threshold: 0.32 }
    );

    aboutCardObserver.observe(aboutProfileCard);
  }

  if (serviceCards.length) {
    let spotlightIndex = 0;
    let servicesInView = true;

    const paintServiceSpotlight = (index) => {
      serviceCards.forEach((card, cardIndex) => {
        card.classList.toggle('is-spotlight', cardIndex === index);
      });
    };

    const rotateServiceSpotlight = () => {
      if (document.hidden || !servicesInView) {
        return;
      }

      spotlightIndex = (spotlightIndex + 1) % serviceCards.length;
      paintServiceSpotlight(spotlightIndex);
    };

    paintServiceSpotlight(spotlightIndex);

    if (servicesGrid) {
      const servicesObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target !== servicesGrid) {
              return;
            }

            servicesInView = entry.isIntersecting;
          });
        },
        { threshold: 0.2 }
      );

      servicesObserver.observe(servicesGrid);
    }

    serviceCards.forEach((card, cardIndex) => {
      card.addEventListener('mouseenter', () => {
        spotlightIndex = cardIndex;
        paintServiceSpotlight(spotlightIndex);
      });
    });

    window.setInterval(rotateServiceSpotlight, 2300);
  }
};

initializeMindBlowingMotion();
