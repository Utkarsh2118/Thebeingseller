const siteConfig = {
  developmentApiBaseUrl: 'http://localhost:5000',
  productionApiBaseUrl: 'https://thebeingseller-api.onrender.com',
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
const yearElement = document.getElementById('year');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const newsFeatureTitle = document.getElementById('newsFeatureTitle');
const newsFeatureSummary = document.getElementById('newsFeatureSummary');
const newsFeatureTag = document.getElementById('newsFeatureTag');
const newsList = document.getElementById('newsList');
const messageInput = document.getElementById('message');
const messageCounter = document.getElementById('messageCounter');
const quickTemplateButtons = document.querySelectorAll('.quick-template');

const apiBaseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? siteConfig.developmentApiBaseUrl
  : siteConfig.productionApiBaseUrl;

const REQUEST_TIMEOUT_MS = 15000;
let isContactSubmitting = false;

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

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const achievementCard = element.closest('.achievement-card');
      const target = Number(element.dataset.target || 0);
      const suffix = element.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      if (achievementCard) {
        achievementCard.classList.add('is-active');
      }

      const tick = (timestamp) => {
        const progress = Math.min((timestamp - start) / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = `${value.toLocaleString()}${suffix}`;

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };

      window.requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

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

const getCurrentTheme = () => (document.body.classList.contains('light-theme') ? 'light' : 'dark');

const updateThemeColor = () => {
  if (!themeColorMeta) {
    return;
  }

  themeColorMeta.setAttribute('content', getCurrentTheme() === 'light' ? '#f8f9fa' : '#07111d');
};

const initializeMarketSessionStrip = () => {
  const sessionStrip = document.getElementById('marketSessionStrip');
  const sessionLabel = document.getElementById('sessionLabel');
  const sessionNote = document.getElementById('sessionNote');
  const sessionClock = document.getElementById('sessionClock');

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
        clock,
      };
    }

    if (minutes >= 540 && minutes < 555) {
      return {
        stateClass: 'is-preopen',
        label: 'Pre-open Session Active',
        note: 'Regular trading opens at 09:15 IST',
        clock,
      };
    }

    if (minutes >= 555 && minutes < 930) {
      return {
        stateClass: 'is-open',
        label: 'Market Open',
        note: 'NSE cash market closes at 15:30 IST',
        clock,
      };
    }

    return {
      stateClass: 'is-closed',
      label: 'Market Closed',
      note: 'Pre-open resumes at 09:00 IST on trading days',
      clock,
    };
  };

  const renderSession = () => {
    const state = getSessionState();
    sessionStrip.classList.remove('is-open', 'is-preopen', 'is-closed');
    sessionStrip.classList.add(state.stateClass);
    sessionLabel.textContent = state.label;
    sessionNote.textContent = state.note;
    sessionClock.textContent = state.clock;
  };

  renderSession();
  window.setInterval(renderSession, 30000);
};

initializeMarketSessionStrip();

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

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }

  updateThemeColor();

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
      themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
      document.body.classList.remove('light-theme');
      themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
    }

    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    updateThemeColor();
    refreshMarketWidgets();
  });
};

initializeThemeToggle();

let hasLoadedChart = false;
let hasLoadedTickerTape = false;

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
      { proName: 'NSE:NIFTY', title: 'Nifty' },
      { proName: 'BSE:SENSEX', title: 'Sensex' },
      { proName: 'NSE:BANKNIFTY', title: 'BankNifty' },
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
  if (!chartContainer) {
    return;
  }

  const initializeWidget = () => {
    if (!window.TradingView) {
      chartContainer.innerHTML = '<p style="padding: 1rem; color: #96abc1;">Unable to load TradingView chart right now.</p>';
      return;
    }

    chartContainer.innerHTML = '';
    new window.TradingView.widget({
      autosize: true,
      width: '100%',
      height: 600,
      symbol: 'NSE:NIFTY',
      interval: '15',
      timezone: 'Asia/Kolkata',
      theme: getCurrentTheme(),
      style: '1',
      locale: 'en',
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_legend: false,
      save_image: false,
      withdateranges: true,
      details: false,
      allow_symbol_change: false,
      studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
      container_id: 'tradingview-chart',
    });
  };

  if (window.TradingView) {
    initializeWidget();
    return;
  }

  const existingScript = document.querySelector('script[data-tradingview-script="true"]');
  if (existingScript) {
    existingScript.addEventListener('load', initializeWidget, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://s3.tradingview.com/tv.js';
  script.async = true;
  script.dataset.tradingviewScript = 'true';
  script.addEventListener('load', initializeWidget, { once: true });
  document.body.appendChild(script);
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
      contactForm.reset();
      if (messageInput) {
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      ['name', 'email', 'phone', 'message'].forEach((fieldName) => setFieldErrorState(fieldName, false));
    } catch (error) {
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
    description: 'Consumer Price Index � key indicator for RBI rate path expectations.',
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
    description: 'Major index-heavy stocks begin reporting quarterly results � index mover.',
    category: 'Earnings',
    impact: 'high',
  },
  {
    date: 'Apr 29',
    day: 'Tuesday',
    event: 'US Federal Reserve Meeting',
    description: 'Fed rate decision and forward guidance � global risk sentiment impact.',
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
