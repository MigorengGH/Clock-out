// Shift & Overtime Calculator — Bangi Workplace Hub
(function () {
  'use strict';

  // Constants & Rules
  const REGULAR_WORK_MINUTES = 9 * 60 + 30; // 9 hours 30 minutes = 570 mins
  const CLOCK_IN_START_MINUTES = 7 * 60; // 07:00 AM = 420 mins
  const CLOCK_IN_CUTOFF_MINUTES = 9 * 60 + 30; // 09:30 AM = 570 mins
  const MIN_OT_MINUTES = 70; // 1 hour 10 minutes = 70 mins
  const OT_STEP_MINUTES = 30; // 30 minutes interval
  const OT_TIER_COUNT = 8; // 8 overtime milestones

  // Bangi, Selangor Coordinates (JAKIM SGR01 Zone)
  const BANGI_LAT = 2.9288;
  const BANGI_LNG = 101.7801;
  const BANGI_TZ = 8; // UTC+8

  // Embedded Lucide SVGs for guaranteed offline & instant rendering
  const LUCIDE_SVGS = {
    'timer': '<svg class="lucide lucide-timer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>',
    'clock': '<svg class="lucide lucide-clock" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'moon': '<svg class="lucide lucide-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    'sun': '<svg class="lucide lucide-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    'map-pin': '<svg class="lucide lucide-map-pin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
    'log-in': '<svg class="lucide lucide-log-in" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>',
    'log-out': '<svg class="lucide lucide-log-out" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
    'trending-up': '<svg class="lucide lucide-trending-up" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    'calculator': '<svg class="lucide lucide-calculator" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
    'copy': '<svg class="lucide lucide-copy" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    'crosshair': '<svg class="lucide lucide-crosshair" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>',
    'info': '<svg class="lucide lucide-info" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    'check': '<svg class="lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    'check-circle-2': '<svg class="lucide lucide-check-circle-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    'alert-triangle': '<svg class="lucide lucide-alert-triangle" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
    'shield-check': '<svg class="lucide lucide-shield-check" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
    'compass': '<svg class="lucide lucide-compass" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    'cloud-sun': '<svg class="lucide lucide-cloud-sun" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>',
    'cloud-rain': '<svg class="lucide lucide-cloud-rain" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>',
    'cloud-lightning': '<svg class="lucide lucide-cloud-lightning" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>',
    'droplets': '<svg class="lucide lucide-droplets" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.09 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>',
    'wind': '<svg class="lucide lucide-wind" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7A2.5 2.5 0 1 1 19 12H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
    'refresh-cw': '<svg class="lucide lucide-refresh-cw" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    'chevron-up': '<svg class="lucide lucide-chevron-up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>',
    'chevron-down': '<svg class="lucide lucide-chevron-down" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    'arrow-up': '<svg class="lucide lucide-arrow-up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>',
    'arrow-down': '<svg class="lucide lucide-arrow-down" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>'
  };

  function renderLucideIcons(root = document) {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
      return;
    }
    const iconEls = root.querySelectorAll('[data-lucide]');
    iconEls.forEach(el => {
      const name = el.getAttribute('data-lucide');
      if (LUCIDE_SVGS[name]) {
        const temp = document.createElement('span');
        temp.innerHTML = LUCIDE_SVGS[name];
        const svg = temp.firstElementChild;
        if (svg) {
          el.replaceWith(svg);
        }
      }
    });
  }

  // App State
  let is24HourFormat = false;
  let currentTheme = 'light';
  let bangiPrayerTimes = null; // { Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak } in minutes from midnight
  let cachedHourlyForecast = null; // Hourly meteorological cache

  // DOM Elements
  const liveClockText = document.getElementById('liveClockText');
  const clockInInput = document.getElementById('clockInInput');
  const btnSetNow = document.getElementById('btnSetNow');
  const btnArrowUp = document.getElementById('btnArrowUp');
  const btnArrowDown = document.getElementById('btnArrowDown');
  const punctualityBadge = document.getElementById('punctualityBadge');
  const punctualityBanner = document.getElementById('punctualityBanner');
  const bannerIconCol = document.getElementById('bannerIconCol');
  const bannerTitle = document.getElementById('bannerTitle');
  const bannerDesc = document.getElementById('bannerDesc');
  const heroTimeBox = document.getElementById('heroTimeBox');
  const heroLateTag = document.getElementById('heroLateTag');
  const standardClockOutTime = document.getElementById('standardClockOutTime');
  const standardClockOutSub = document.getElementById('standardClockOutSub');
  const summaryClockIn = document.getElementById('summaryClockIn');
  const summaryClockOut = document.getElementById('summaryClockOut');
  const btnCopyStandardTime = document.getElementById('btnCopyStandardTime');
  const otTiersGrid = document.getElementById('otTiersGrid');
  const otTableBody = document.getElementById('otTableBody');
  const customOutInput = document.getElementById('customOutInput');
  const checkerResultBox = document.getElementById('checkerResultBox');
  const checkerResultTitle = document.getElementById('checkerResultTitle');
  const checkerResultDesc = document.getElementById('checkerResultDesc');
  const formatToggle = document.getElementById('formatToggle');
  const formatLabel = document.getElementById('formatLabel');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  const btnRefreshData = document.getElementById('btnRefreshData');
  const statusMessage = document.getElementById('statusMessage');
  const statusPercentage = document.getElementById('statusPercentage');
  const progressBarFill = document.getElementById('progressBarFill');
  const timeCountdown = document.getElementById('timeCountdown');

  // Waktu Solat Elements
  const nextPrayerPill = document.getElementById('nextPrayerPill');
  const nextPrayerName = document.getElementById('nextPrayerName');
  const nextPrayerCountdown = document.getElementById('nextPrayerCountdown');
  const prayerShiftNote = document.getElementById('prayerShiftNote');

  // Weather Elements
  const weatherDatePill = document.getElementById('weatherDatePill');
  const weatherHeroIcon = document.getElementById('weatherHeroIcon');
  const currentTemp = document.getElementById('currentTemp');
  const feelsLike = document.getElementById('feelsLike');
  const weatherCondition = document.getElementById('weatherCondition');
  const tempRange = document.getElementById('tempRange');
  const weatherHumidity = document.getElementById('weatherHumidity');
  const weatherRainProb = document.getElementById('weatherRainProb');
  const weatherWind = document.getElementById('weatherWind');
  const weatherAdviceText = document.getElementById('weatherAdviceText');
  const hourlyForecastStrip = document.getElementById('hourlyForecastStrip');

  // Initialization
  function init() {
    loadSettings();
    setupEventListeners();
    startLiveClock();

    // Default clock-in: 08:00 or saved value
    const savedTime = localStorage.getItem('last_clock_in') || '08:00';
    clockInInput.value = savedTime;

    // Load Local Bangi Data (Solat & Weather)
    loadBangiPrayerTimes();
    loadBangiWeather();

    updateAllCalculations();
    renderLucideIcons();
  }

  // Load User Preferences
  function loadSettings() {
    const savedFormat = localStorage.getItem('clockout_format');
    if (savedFormat === '24h') {
      is24HourFormat = true;
      formatLabel.textContent = '24-Hour';
    } else {
      is24HourFormat = false;
      formatLabel.textContent = '12-Hour';
    }

    const savedTheme = localStorage.getItem('clockout_theme');
    if (savedTheme) {
      currentTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
    } else {
      currentTheme = 'light';
    }
    applyTheme(currentTheme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const iconName = theme === 'dark' ? 'sun' : 'moon';
    themeIcon.innerHTML = `<i data-lucide="${iconName}" class="lucide-icon"></i>`;
    renderLucideIcons(themeIcon);
    localStorage.setItem('clockout_theme', theme);
  }

  // Time Utilities
  function parseTimeString(timeStr) {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours * 60 + minutes; // total minutes from midnight
  }

  function formatMinutes(totalMinutes, forceNextDayLabel = true) {
    let dayOffset = Math.floor(totalMinutes / (24 * 60));
    let normalized = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);

    let h = Math.floor(normalized / 60);
    const m = normalized % 60;
    const mStr = m.toString().padStart(2, '0');

    let timeStr = '';
    if (is24HourFormat) {
      timeStr = `${h.toString().padStart(2, '0')}:${mStr}`;
    } else {
      const period = h >= 12 ? 'PM' : 'AM';
      let h12 = h % 12;
      if (h12 === 0) h12 = 12;
      timeStr = `${h12.toString().padStart(2, '0')}:${mStr} ${period}`;
    }

    if (forceNextDayLabel && dayOffset > 0) {
      timeStr += ` (+${dayOffset}d)`;
    }
    return timeStr;
  }

  function formatDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }

  // Event Listeners
  function setupEventListeners() {
    clockInInput.addEventListener('input', () => {
      localStorage.setItem('last_clock_in', clockInInput.value);
      updateAllCalculations();
    });

    // Keyboard Arrow Up / Down inside clockInInput
    clockInInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        adjustClockIn(e.shiftKey ? 5 : 15);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        adjustClockIn(e.shiftKey ? -5 : -15);
      }
    });

    if (btnArrowUp) {
      btnArrowUp.addEventListener('click', (e) => {
        adjustClockIn(e.shiftKey ? 5 : 15);
      });
    }

    if (btnArrowDown) {
      btnArrowDown.addEventListener('click', (e) => {
        adjustClockIn(e.shiftKey ? -5 : -15);
      });
    }

    btnSetNow.addEventListener('click', () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      clockInInput.value = `${h}:${m}`;
      localStorage.setItem('last_clock_in', clockInInput.value);
      updateAllCalculations();
    });

    formatToggle.addEventListener('click', () => {
      is24HourFormat = !is24HourFormat;
      formatLabel.textContent = is24HourFormat ? '24-Hour' : '12-Hour';
      localStorage.setItem('clockout_format', is24HourFormat ? '24h' : '12h');
      updateAllCalculations();
      renderPrayerTimesUI();
      renderHourlyForecast();
    });

    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
    });

    btnRefreshData.addEventListener('click', () => {
      loadBangiPrayerTimes(true);
      loadBangiWeather(true);
    });

    btnCopyStandardTime.addEventListener('click', () => {
      const text = standardClockOutTime.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btnCopyStandardTime.innerHTML;
        btnCopyStandardTime.innerHTML = '<i data-lucide="check" class="lucide-icon"></i> Copied to Clipboard!';
        renderLucideIcons(btnCopyStandardTime);
        setTimeout(() => {
          btnCopyStandardTime.innerHTML = originalText;
          renderLucideIcons(btnCopyStandardTime);
        }, 2000);
      });
    });

    customOutInput.addEventListener('input', updateChecker);
  }

  function adjustClockIn(deltaMinutes) {
    let currentMins = parseTimeString(clockInInput.value);
    if (currentMins === null) currentMins = 8 * 60;
    let newMins = (currentMins + deltaMinutes + 24 * 60) % (24 * 60);
    const h = Math.floor(newMins / 60).toString().padStart(2, '0');
    const m = (newMins % 60).toString().padStart(2, '0');
    clockInInput.value = `${h}:${m}`;
    localStorage.setItem('last_clock_in', clockInInput.value);
    updateAllCalculations();
  }

  // Live Clock & Status Tick
  function startLiveClock() {
    function updateClock() {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      let clockStr = '';
      if (is24HourFormat) {
        clockStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      } else {
        const period = h >= 12 ? 'PM' : 'AM';
        let h12 = h % 12;
        if (h12 === 0) h12 = 12;
        clockStr = `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ${period}`;
      }
      liveClockText.textContent = `Live: ${clockStr}`;

      updateProgressAndCountdown(now);
      updatePrayerLiveStatus(now);
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // Punctuality & Clock-In Evaluation (7:00 AM – 9:30 AM Window)
  function evaluatePunctuality(inMinutes) {
    if (inMinutes === null) return { status: 'unknown' };

    if (inMinutes < CLOCK_IN_START_MINUTES) {
      // Early arrival (before 7:00 AM)
      const earlyMins = CLOCK_IN_START_MINUTES - inMinutes;
      return {
        status: 'early',
        earlyMins,
        badgeText: '🔵 Early Arrival',
        bannerTitle: `Early Arrival (${formatDuration(earlyMins)} before 7:00 AM)`,
        bannerDesc: `Normal clock-in schedule begins at 7:00 AM. Shift of 9h 30m still calculated from your entered arrival time.`
      };
    } else if (inMinutes <= CLOCK_IN_CUTOFF_MINUTES) {
      // On-time (between 7:00 AM and 9:30 AM)
      return {
        status: 'ontime',
        badgeText: '🟢 On Time',
        bannerTitle: 'On-Time Clock-In Verified',
        bannerDesc: 'Worker clocked in on schedule within the authorized 7:00 AM – 9:30 AM window.'
      };
    } else {
      // Late arrival (past 9:30 AM)
      const lateMins = inMinutes - CLOCK_IN_CUTOFF_MINUTES;
      return {
        status: 'late',
        lateMins,
        badgeText: `🔴 Late (${formatDuration(lateMins)})`,
        bannerTitle: `LATE ARRIVAL WARNING: Late by ${formatDuration(lateMins)}!`,
        bannerDesc: `Authorized clock-in window closed at 09:30 AM. Clocking in at ${formatMinutes(inMinutes, false)} is flagged as late. You must still complete full 9h 30m standard shift.`
      };
    }
  }

  // Core Calculations
  function updateAllCalculations() {
    const inMinutes = parseTimeString(clockInInput.value);
    if (inMinutes === null) return;

    // 1. Punctuality Evaluation
    const punc = evaluatePunctuality(inMinutes);
    punctualityBadge.className = `punctuality-badge ${punc.status}`;
    punctualityBadge.textContent = punc.badgeText;

    punctualityBanner.className = `punctuality-banner ${punc.status}`;
    bannerTitle.textContent = punc.bannerTitle;
    bannerDesc.textContent = punc.bannerDesc;

    if (punc.status === 'late') {
      bannerIconCol.innerHTML = '<i data-lucide="alert-triangle" class="lucide-icon"></i>';
      heroTimeBox.classList.add('hero-late');
      heroLateTag.style.display = 'inline-block';
      heroLateTag.textContent = `Late by ${formatDuration(punc.lateMins)}`;
    } else if (punc.status === 'early') {
      bannerIconCol.innerHTML = '<i data-lucide="info" class="lucide-icon"></i>';
      heroTimeBox.classList.remove('hero-late');
      heroLateTag.style.display = 'none';
    } else {
      bannerIconCol.innerHTML = '<i data-lucide="check-circle-2" class="lucide-icon"></i>';
      heroTimeBox.classList.remove('hero-late');
      heroLateTag.style.display = 'none';
    }
    renderLucideIcons(bannerIconCol);

    // 2. Standard Clock Out (in + 9h 30m)
    const stdOutMinutes = inMinutes + REGULAR_WORK_MINUTES;

    standardClockOutTime.textContent = formatMinutes(stdOutMinutes);
    standardClockOutSub.textContent = `${formatMinutes(inMinutes, false)} clock-in + 9h 30m standard shift`;
    summaryClockIn.textContent = formatMinutes(inMinutes, false);
    summaryClockOut.textContent = formatMinutes(stdOutMinutes);

    // 3. Render OT Milestones
    renderOvertimeTiers(inMinutes, stdOutMinutes);

    // 4. Update Custom Checker
    updateChecker();

    // 5. Update Progress & Prayer overlap
    updateProgressAndCountdown(new Date());
    updatePrayerShiftOverlap(inMinutes, stdOutMinutes);
    renderHourlyForecast(inMinutes, stdOutMinutes);
  }

  function getOTTiers(inMinutes, stdOutMinutes) {
    const tiers = [];
    for (let i = 0; i < OT_TIER_COUNT; i++) {
      const otDurationMinutes = MIN_OT_MINUTES + (i * OT_STEP_MINUTES);
      const totalShiftMinutes = REGULAR_WORK_MINUTES + otDurationMinutes;
      const clockOutMinutes = inMinutes + totalShiftMinutes;

      // 24-hour HH:MM for input fields
      const normMins = ((clockOutMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
      const rawH = Math.floor(normMins / 60).toString().padStart(2, '0');
      const rawM = (normMins % 60).toString().padStart(2, '0');
      const time24 = `${rawH}:${rawM}`;

      tiers.push({
        tierIndex: i + 1,
        otDurationMinutes,
        totalShiftMinutes,
        clockOutMinutes,
        time24,
        otDurationLabel: formatDuration(otDurationMinutes),
        totalWorkLabel: formatDuration(totalShiftMinutes),
        clockOutTimeStr: formatMinutes(clockOutMinutes)
      });
    }
    return tiers;
  }

  function renderOvertimeTiers(inMinutes, stdOutMinutes) {
    const tiers = getOTTiers(inMinutes, stdOutMinutes);

    // Render Cards (Top 4 tiers)
    otTiersGrid.innerHTML = '';
    const cardsToShow = tiers.slice(0, 4);

    cardsToShow.forEach(tier => {
      const card = document.createElement('div');
      card.className = 'ot-card-item';
      card.id = `ot-card-${tier.tierIndex}`;
      card.title = 'Click to test this departure time in checker';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="ot-badge-row">
          <span class="tier-number">Tier ${tier.tierIndex} ${tier.tierIndex === 1 ? '(Min OT)' : ''}</span>
          <span class="ot-duration-tag">+${tier.otDurationLabel}</span>
        </div>
        <div class="ot-out-time">${tier.clockOutTimeStr}</div>
        <div class="ot-total-work">Total: ${tier.totalWorkLabel} on duty</div>
      `;
      card.addEventListener('click', () => {
        customOutInput.value = tier.time24;
        updateChecker();
        customOutInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      otTiersGrid.appendChild(card);
    });

    // Render Table (Full 8 tiers)
    otTableBody.innerHTML = '';
    tiers.forEach(tier => {
      const tr = document.createElement('tr');
      tr.id = `ot-row-${tier.tierIndex}`;
      tr.innerHTML = `
        <td><strong>Tier ${tier.tierIndex}</strong></td>
        <td><span class="tag tag-amber">+${tier.otDurationLabel} OT</span></td>
        <td><strong class="mono" style="font-size: 1.05rem;">${tier.clockOutTimeStr}</strong></td>
        <td class="mono">${tier.totalWorkLabel}</td>
        <td><span class="tier-status-text" id="tier-status-${tier.tierIndex}">Upcoming</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="copy-btn copy-action-btn" title="Copy time to clipboard">
              <i data-lucide="copy" class="lucide-icon"></i> Copy
            </button>
            <button class="copy-btn" data-time24="${tier.time24}" title="Check this time in departure calculator">
              <i data-lucide="crosshair" class="lucide-icon"></i> Test
            </button>
          </div>
        </td>
      `;

      const copyBtn = tr.querySelector('.copy-action-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(tier.clockOutTimeStr).then(() => {
            copyBtn.innerHTML = '<i data-lucide="check" class="lucide-icon"></i> Copied';
            renderLucideIcons(copyBtn);
            setTimeout(() => {
              copyBtn.innerHTML = '<i data-lucide="copy" class="lucide-icon"></i> Copy';
              renderLucideIcons(copyBtn);
            }, 1800);
          });
        });
      }

      const testBtn = tr.querySelector('[data-time24]');
      if (testBtn) {
        testBtn.addEventListener('click', () => {
          customOutInput.value = tier.time24;
          updateChecker();
          customOutInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
      otTableBody.appendChild(tr);
    });
    renderLucideIcons(otTableBody);
  }

  // Progress Bar & Real-Time Countdown
  function updateProgressAndCountdown(now) {
    const inMinutes = parseTimeString(clockInInput.value);
    if (inMinutes === null) return;

    const stdOutMinutes = inMinutes + REGULAR_WORK_MINUTES;
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    let diffFromStart = nowMinutes - inMinutes;
    if (diffFromStart < -12 * 60) {
      diffFromStart += 24 * 60;
    }

    if (diffFromStart < 0) {
      const startIn = Math.abs(Math.round(diffFromStart));
      statusMessage.textContent = 'Shift starts in the future';
      statusPercentage.textContent = '0%';
      progressBarFill.style.width = '0%';
      progressBarFill.classList.remove('overtime');
      timeCountdown.textContent = `Starts in ~${formatDuration(startIn)}`;
      return;
    }

    if (diffFromStart < REGULAR_WORK_MINUTES) {
      // Normal shift in progress
      const percent = Math.min(100, Math.max(0, (diffFromStart / REGULAR_WORK_MINUTES) * 100));
      const remainingMinutes = Math.max(0, Math.round(REGULAR_WORK_MINUTES - diffFromStart));

      statusMessage.textContent = 'Regular Shift in Progress';
      statusPercentage.textContent = `${Math.round(percent)}%`;
      progressBarFill.style.width = `${percent}%`;
      progressBarFill.classList.remove('overtime');
      timeCountdown.textContent = `Remaining: ${formatDuration(remainingMinutes)} until clock out`;
    } else {
      // Standard shift completed! Now into OT territory
      const extraMinutes = diffFromStart - REGULAR_WORK_MINUTES;
      progressBarFill.classList.add('overtime');

      if (extraMinutes < MIN_OT_MINUTES) {
        // Between standard out and min OT (1h 10m)
        const untilMinOT = Math.round(MIN_OT_MINUTES - extraMinutes);
        statusMessage.textContent = 'Standard shift done! Approaching Min OT';
        statusPercentage.textContent = '100%';
        progressBarFill.style.width = '100%';
        timeCountdown.textContent = `Need ${formatDuration(untilMinOT)} more for 1st OT tier (1h 10m)`;
      } else {
        // Qualified for at least Tier 1 OT!
        const otTiersEarned = 1 + Math.floor((extraMinutes - MIN_OT_MINUTES) / OT_STEP_MINUTES);
        const currentTierDuration = MIN_OT_MINUTES + (otTiersEarned - 1) * OT_STEP_MINUTES;
        const nextTierMinutes = MIN_OT_MINUTES + otTiersEarned * OT_STEP_MINUTES;
        const minsToNextTier = Math.round(nextTierMinutes - extraMinutes);

        statusMessage.textContent = `🎉 In Overtime: Tier ${otTiersEarned} (+${formatDuration(currentTierDuration)})`;
        statusPercentage.textContent = 'OT Active';
        progressBarFill.style.width = '100%';
        timeCountdown.textContent = `Next tier (+${formatDuration(nextTierMinutes)}) in ${formatDuration(minsToNextTier)}`;

        // Highlight active cards & rows
        document.querySelectorAll('.ot-card-item').forEach(c => c.classList.remove('active-ot'));
        const activeCard = document.getElementById(`ot-card-${otTiersEarned}`);
        if (activeCard) activeCard.classList.add('active-ot');

        document.querySelectorAll('#otTableBody tr').forEach(r => r.classList.remove('active-row'));
        const activeRow = document.getElementById(`ot-row-${otTiersEarned}`);
        if (activeRow) {
          activeRow.classList.add('active-row');
          const statusSpan = document.getElementById(`tier-status-${otTiersEarned}`);
          if (statusSpan) {
            statusSpan.innerHTML = '<i data-lucide="check" class="lucide-icon" style="vertical-align: -2px;"></i> Reached';
            renderLucideIcons(statusSpan);
          }
        }
      }
    }
  }

  // Custom Departure Checker
  function updateChecker() {
    const inMinutes = parseTimeString(clockInInput.value);
    const customOutMinutes = parseTimeString(customOutInput.value);

    if (inMinutes === null || customOutMinutes === null) {
      checkerResultBox.className = 'checker-result-box';
      checkerResultTitle.textContent = 'Enter departure time';
      checkerResultDesc.textContent = 'Select a planned departure time above to see overtime calculation results.';
      return;
    }

    const stdOutMinutes = inMinutes + REGULAR_WORK_MINUTES;

    let durationMinutes = customOutMinutes - inMinutes;
    if (durationMinutes < 0) durationMinutes += 24 * 60;

    let extraMinutes = customOutMinutes - stdOutMinutes;
    if (extraMinutes < -12 * 60) extraMinutes += 24 * 60;

    if (extraMinutes < 0) {
      // Early departure
      const earlyMins = Math.abs(extraMinutes);
      checkerResultBox.className = 'checker-result-box no-ot';
      checkerResultTitle.innerHTML = `<i data-lucide="alert-triangle" class="lucide-icon" style="color: var(--primary);"></i> Early Departure (${formatDuration(durationMinutes)} on duty)`;
      checkerResultDesc.textContent = `Leaving ${formatDuration(earlyMins)} before standard shift completion (${formatMinutes(stdOutMinutes)}). No overtime earned.`;
      renderLucideIcons(checkerResultTitle);
      return;
    }

    if (extraMinutes < MIN_OT_MINUTES) {
      // Under minimum OT threshold (unpaid gap)
      const neededMore = MIN_OT_MINUTES - extraMinutes;
      const minOTOutTime = stdOutMinutes + MIN_OT_MINUTES;

      checkerResultBox.className = 'checker-result-box invalid-ot';
      checkerResultTitle.innerHTML = `<i data-lucide="alert-triangle" class="lucide-icon" style="color: var(--accent-amber);"></i> Under Minimum OT Threshold (+${formatDuration(extraMinutes)} past shift)`;
      checkerResultDesc.textContent = `Minimum OT is 1h 10m (70 mins). You worked ${formatDuration(extraMinutes)} extra, which does not qualify for OT yet. Stay ${formatDuration(neededMore)} more until ${formatMinutes(minOTOutTime)} to claim your first 1h 10m OT!`;
      renderLucideIcons(checkerResultTitle);
      return;
    }

    // Qualified for OT
    const otTiersEarned = 1 + Math.floor((extraMinutes - MIN_OT_MINUTES) / OT_STEP_MINUTES);
    const approvedOTMinutes = MIN_OT_MINUTES + (otTiersEarned - 1) * OT_STEP_MINUTES;
    const nextTierMins = MIN_OT_MINUTES + otTiersEarned * OT_STEP_MINUTES;
    const minsToNextTier = nextTierMins - extraMinutes;
    const nextTierTargetTime = stdOutMinutes + nextTierMins;

    checkerResultBox.className = 'checker-result-box valid-ot';
    checkerResultTitle.innerHTML = `<i data-lucide="check-circle-2" class="lucide-icon" style="color: var(--accent-green);"></i> Recognized OT: Tier ${otTiersEarned} (+${formatDuration(approvedOTMinutes)} OT)`;
    renderLucideIcons(checkerResultTitle);

    let desc = `Total extra duty: ${formatDuration(extraMinutes)}. You qualify for Tier ${otTiersEarned} (+${formatDuration(approvedOTMinutes)} OT). Total shift: ${formatDuration(REGULAR_WORK_MINUTES + approvedOTMinutes)}.`;

    if (minsToNextTier > 0) {
      desc += ` Pro-tip: Stay ${minsToNextTier} more minutes (until ${formatMinutes(nextTierTargetTime)}) to unlock Tier ${otTiersEarned + 1} (+${formatDuration(nextTierMins)} OT)!`;
    }

    checkerResultDesc.textContent = desc;
  }

  // Waktu Solat Bangi Engine (JAKIM SGR01 Zone)
  // Mathematical astronomical fallback calculation algorithm for Bangi
  function calculateBangiAstronomicalPrayers(date = new Date()) {
    const lat = BANGI_LAT;
    const lng = BANGI_LNG;
    const tz = BANGI_TZ;

    // Day of year
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const N = Math.floor(diff / oneDay);

    // Approximate Equation of Time and Solar Declination
    const B = 2 * Math.PI * (N - 81) / 365;
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // in minutes
    const decl = 23.45 * Math.sin((360 / 365 * (N - 81)) * (Math.PI / 180)); // degrees

    // Solar noon (Zohor midpoint)
    const noonMins = 12 * 60 + (tz * 15 - lng) * 4 - eot;

    function timeForAngle(alphaDeg, morning = true) {
      const alphaRad = -alphaDeg * (Math.PI / 180);
      const latRad = lat * (Math.PI / 180);
      const declRad = decl * (Math.PI / 180);

      let cosHa = (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(declRad)) / (Math.cos(latRad) * Math.cos(declRad));
      cosHa = Math.max(-1, Math.min(1, cosHa));
      const haDeg = Math.acos(cosHa) * (180 / Math.PI);
      const haMins = haDeg * 4;

      return morning ? noonMins - haMins : noonMins + haMins;
    }

    function timeForAsr(shadowFactor = 1) {
      const latRad = lat * (Math.PI / 180);
      const declRad = decl * (Math.PI / 180);
      const angleRad = Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - declRad))));
      let cosHa = (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(declRad)) / (Math.cos(latRad) * Math.cos(declRad));
      cosHa = Math.max(-1, Math.min(1, cosHa));
      const haDeg = Math.acos(cosHa) * (180 / Math.PI);
      return noonMins + (haDeg * 4);
    }

    // JAKIM calculation parameters: Fajr 20°, Isha 18°, Syuruk 0.833°
    const fajr = Math.round(timeForAngle(20, true) + 2); // 2 mins ihtiyat
    const syuruk = Math.round(timeForAngle(0.833, true) - 2);
    const dhuhr = Math.round(noonMins + 2); // 2 mins ihtiyat
    const asr = Math.round(timeForAsr(1) + 2);
    const maghrib = Math.round(timeForAngle(0.833, false) + 2);
    const isha = Math.round(timeForAngle(18, false) + 2);

    return {
      Subuh: fajr,
      Syuruk: syuruk,
      Zohor: dhuhr,
      Asar: asr,
      Maghrib: maghrib,
      Isyak: isha
    };
  }

  async function loadBangiPrayerTimes(forceRefresh = false) {
    // 1. Initial calibrated fallback so UI is instant and never blank
    const fallback = calculateBangiAstronomicalPrayers();
    bangiPrayerTimes = fallback;
    renderPrayerTimesUI();

    // 2. Fetch official JAKIM SGR01 prayer times from api.waktusolat.app
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      // Primary: Official JAKIM SGR01 Takwim Solat Mirror
      const res = await fetch('https://api.waktusolat.app/v2/solat/SGR01', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.prayers && data.prayers.length) {
          const now = new Date();
          const curDay = now.getDate();
          const today = data.prayers.find(p => p.day === curDay) || data.prayers[curDay - 1] || data.prayers[0];

          if (today) {
            function unixToMins(ts) {
              if (!ts) return null;
              const d = new Date(ts * 1000);
              return d.getHours() * 60 + d.getMinutes();
            }

            bangiPrayerTimes = {
              Subuh: unixToMins(today.fajr) || fallback.Subuh,
              Syuruk: unixToMins(today.syuruk) || fallback.Syuruk,
              Zohor: unixToMins(today.dhuhr) || fallback.Zohor,
              Asar: unixToMins(today.asr) || fallback.Asar,
              Maghrib: unixToMins(today.maghrib) || fallback.Maghrib,
              Isyak: unixToMins(today.isha) || fallback.Isyak
            };

            const zoneTag = document.getElementById('prayerZoneTag');
            if (zoneTag) zoneTag.textContent = 'JAKIM SGR01 (Official e-Solat)';
            renderPrayerTimesUI();
            return;
          }
        }
      }
    } catch (e) {
      console.log('Primary JAKIM SGR01 mirror unreachable, trying e-Solat backup.');
    }

    // Secondary backup: official e-solat.gov.my API
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 4000);

      const res2 = await fetch('https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=SGR01', { signal: controller2.signal });
      clearTimeout(timeoutId2);

      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.prayerTime && data2.prayerTime[0]) {
          const pt = data2.prayerTime[0];
          bangiPrayerTimes = {
            Subuh: parseTimeString(pt.fajr) || fallback.Subuh,
            Syuruk: parseTimeString(pt.syuruk) || fallback.Syuruk,
            Zohor: parseTimeString(pt.dhuhr) || fallback.Zohor,
            Asar: parseTimeString(pt.asr) || fallback.Asar,
            Maghrib: parseTimeString(pt.maghrib) || fallback.Maghrib,
            Isyak: parseTimeString(pt.isha) || fallback.Isyak
          };
          renderPrayerTimesUI();
          return;
        }
      }
    } catch (e2) {
      console.log('e-Solat backup unreachable, trying Aladhan JAKIM method.');
    }

    // Tertiary backup: Aladhan with Method 17 (JAKIM)
    try {
      const controller3 = new AbortController();
      const timeoutId3 = setTimeout(() => controller3.abort(), 4000);

      const res3 = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Bangi&country=Malaysia&method=17', { signal: controller3.signal });
      clearTimeout(timeoutId3);

      if (res3.ok) {
        const data3 = await res3.json();
        if (data3 && data3.data && data3.data.timings) {
          const t = data3.data.timings;
          bangiPrayerTimes = {
            Subuh: parseTimeString(t.Fajr) || fallback.Subuh,
            Syuruk: parseTimeString(t.Sunrise) || fallback.Syuruk,
            Zohor: parseTimeString(t.Dhuhr) || fallback.Zohor,
            Asar: parseTimeString(t.Asr) || fallback.Asar,
            Maghrib: parseTimeString(t.Maghrib) || fallback.Maghrib,
            Isyak: parseTimeString(t.Isha) || fallback.Isyak
          };
          renderPrayerTimesUI();
        }
      }
    } catch (e3) {
      console.log('Using calibrated astronomical calculation for Bangi prayer times.');
    }
  }

  function renderPrayerTimesUI() {
    if (!bangiPrayerTimes) return;

    document.getElementById('time-subuh').textContent = formatMinutes(bangiPrayerTimes.Subuh, false);
    document.getElementById('time-syuruk').textContent = formatMinutes(bangiPrayerTimes.Syuruk, false);
    document.getElementById('time-zohor').textContent = formatMinutes(bangiPrayerTimes.Zohor, false);
    document.getElementById('time-asar').textContent = formatMinutes(bangiPrayerTimes.Asar, false);
    document.getElementById('time-maghrib').textContent = formatMinutes(bangiPrayerTimes.Maghrib, false);
    document.getElementById('time-isyak').textContent = formatMinutes(bangiPrayerTimes.Isyak, false);

    updatePrayerLiveStatus(new Date());

    const inMinutes = parseTimeString(clockInInput.value);
    if (inMinutes !== null) {
      updatePrayerShiftOverlap(inMinutes, inMinutes + REGULAR_WORK_MINUTES);
    }
  }

  function updatePrayerLiveStatus(now) {
    if (!bangiPrayerTimes) return;

    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const prayers = [
      { id: 'subuh', name: 'Subuh', minutes: bangiPrayerTimes.Subuh },
      { id: 'syuruk', name: 'Syuruk', minutes: bangiPrayerTimes.Syuruk },
      { id: 'zohor', name: 'Zohor', minutes: bangiPrayerTimes.Zohor },
      { id: 'asar', name: 'Asar', minutes: bangiPrayerTimes.Asar },
      { id: 'maghrib', name: 'Maghrib', minutes: bangiPrayerTimes.Maghrib },
      { id: 'isyak', name: 'Isyak', minutes: bangiPrayerTimes.Isyak }
    ];

    // Find next upcoming prayer
    let nextPrayer = null;
    let minsUntilNext = 0;

    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].minutes > currentMinutes) {
        nextPrayer = prayers[i];
        minsUntilNext = Math.round(prayers[i].minutes - currentMinutes);
        break;
      }
    }

    if (!nextPrayer) {
      // Next is tomorrow's Subuh
      nextPrayer = prayers[0];
      minsUntilNext = Math.round((24 * 60 - currentMinutes) + prayers[0].minutes);
    }

    nextPrayerName.textContent = nextPrayer.name;
    nextPrayerCountdown.textContent = `in ${formatDuration(minsUntilNext)}`;

    // Highlight slots
    prayers.forEach(p => {
      const el = document.getElementById(`prayer-${p.id}`);
      if (el) {
        el.classList.remove('active-prayer', 'next-prayer');
        if (p.id === nextPrayer.id) {
          el.classList.add('next-prayer');
        }
      }
    });

    // Determine current prayer period
    let currentPrayerId = 'isyak';
    if (currentMinutes >= bangiPrayerTimes.Subuh && currentMinutes < bangiPrayerTimes.Syuruk) {
      currentPrayerId = 'subuh';
    } else if (currentMinutes >= bangiPrayerTimes.Syuruk && currentMinutes < bangiPrayerTimes.Zohor) {
      currentPrayerId = 'syuruk';
    } else if (currentMinutes >= bangiPrayerTimes.Zohor && currentMinutes < bangiPrayerTimes.Asar) {
      currentPrayerId = 'zohor';
    } else if (currentMinutes >= bangiPrayerTimes.Asar && currentMinutes < bangiPrayerTimes.Maghrib) {
      currentPrayerId = 'asar';
    } else if (currentMinutes >= bangiPrayerTimes.Maghrib && currentMinutes < bangiPrayerTimes.Isyak) {
      currentPrayerId = 'maghrib';
    }

    const curEl = document.getElementById(`prayer-${currentPrayerId}`);
    if (curEl) {
      curEl.classList.add('active-prayer');
    }
  }

  function updatePrayerShiftOverlap(inMins, outMins) {
    if (!bangiPrayerTimes) return;

    const prayerList = [
      { id: 'subuh', name: 'Subuh', time: bangiPrayerTimes.Subuh },
      { id: 'syuruk', name: 'Syuruk', time: bangiPrayerTimes.Syuruk },
      { id: 'zohor', name: 'Zohor', time: bangiPrayerTimes.Zohor },
      { id: 'asar', name: 'Asar', time: bangiPrayerTimes.Asar },
      { id: 'maghrib', name: 'Maghrib', time: bangiPrayerTimes.Maghrib },
      { id: 'isyak', name: 'Isyak', time: bangiPrayerTimes.Isyak }
    ];

    const duringShift = [];
    prayerList.forEach(p => {
      const el = document.getElementById(`prayer-${p.id}`);
      if (el) el.classList.remove('during-shift');

      if (p.time >= inMins && p.time <= outMins) {
        duringShift.push(`${p.name} (${formatMinutes(p.time, false)})`);
        if (el) el.classList.add('during-shift');
      }
    });

    if (duringShift.length > 0) {
      prayerShiftNote.innerHTML = `Work shift (${formatMinutes(inMins, false)} – ${formatMinutes(outMins, false)}) covers: <strong>${duringShift.join(', ')}</strong> prayer break times.`;
    } else {
      prayerShiftNote.textContent = `No prayer times coincide directly during this work shift window.`;
    }
  }

  // Bangi Weather Forecast Engine (Open-Meteo)
  const WMO_WEATHER_MAP = {
    0: { desc: 'Clear Skies', icon: 'sun' },
    1: { desc: 'Mainly Clear', icon: 'sun' },
    2: { desc: 'Partly Cloudy', icon: 'cloud-sun' },
    3: { desc: 'Overcast', icon: 'cloud-sun' },
    45: { desc: 'Morning Mist / Fog', icon: 'cloud-sun' },
    48: { desc: 'Depositing Rime Fog', icon: 'cloud-sun' },
    51: { desc: 'Light Drizzle', icon: 'cloud-rain' },
    53: { desc: 'Moderate Drizzle', icon: 'cloud-rain' },
    55: { desc: 'Dense Drizzle', icon: 'cloud-rain' },
    61: { desc: 'Slight Rain', icon: 'cloud-rain' },
    63: { desc: 'Moderate Rain', icon: 'cloud-rain' },
    65: { desc: 'Heavy Rain Showers', icon: 'cloud-rain' },
    80: { desc: 'Scattered Rain Showers', icon: 'cloud-rain' },
    81: { desc: 'Moderate Showers', icon: 'cloud-rain' },
    82: { desc: 'Violent Rain Showers', icon: 'cloud-rain' },
    95: { desc: 'Thunderstorms Likely', icon: 'cloud-lightning' },
    96: { desc: 'Thunderstorms with Hail', icon: 'cloud-lightning' },
    99: { desc: 'Heavy Thunderstorms', icon: 'cloud-lightning' }
  };

  async function loadBangiWeather(forceRefresh = false) {
    // Default / offline fallback values for Bangi's tropical climate
    const defaultWeather = {
      temp: 31,
      feelsLike: 35,
      humidity: 78,
      rainProb: 60,
      wind: 11,
      minTemp: 24,
      maxTemp: 33,
      condition: 'Partly Cloudy with Afternoon Showers',
      icon: 'cloud-sun'
    };

    applyWeatherData(defaultWeather);
    cachedHourlyForecast = generateFallbackHourlyForecast();
    renderHourlyForecast();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${BANGI_LAT}&longitude=${BANGI_LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKuala_Lumpur&forecast_days=2`;

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const cur = data.current || {};
        const daily = data.daily || {};

        const code = cur.weather_code !== undefined ? cur.weather_code : 2;
        const wmo = WMO_WEATHER_MAP[code] || { desc: 'Partly Cloudy', icon: 'cloud-sun' };

        const weatherInfo = {
          temp: Math.round(cur.temperature_2m || 31),
          feelsLike: Math.round(cur.apparent_temperature || (cur.temperature_2m ? cur.temperature_2m + 3 : 34)),
          humidity: Math.round(cur.relative_humidity_2m || 75),
          rainProb: (daily.precipitation_probability_max && daily.precipitation_probability_max[0] !== undefined) ? daily.precipitation_probability_max[0] : 50,
          wind: Math.round(cur.wind_speed_10m || 10),
          minTemp: (daily.temperature_2m_min && daily.temperature_2m_min[0]) ? Math.round(daily.temperature_2m_min[0]) : 24,
          maxTemp: (daily.temperature_2m_max && daily.temperature_2m_max[0]) ? Math.round(daily.temperature_2m_max[0]) : 33,
          condition: wmo.desc,
          icon: wmo.icon
        };

        applyWeatherData(weatherInfo);

        // Parse hourly forecast from Open-Meteo
        if (data.hourly && data.hourly.time && data.hourly.time.length) {
          const now = new Date();
          const curHour = now.getHours();
          const hourlyTimes = data.hourly.time;

          let startIndex = 0;
          for (let i = 0; i < hourlyTimes.length; i++) {
            const d = new Date(hourlyTimes[i]);
            if (d.getHours() === curHour && Math.abs(d.getTime() - now.getTime()) < 3600 * 1000 * 2) {
              startIndex = i;
              break;
            }
          }

          const parsedList = [];
          for (let i = startIndex; i < Math.min(startIndex + 24, hourlyTimes.length); i++) {
            const d = new Date(hourlyTimes[i]);
            const hour = d.getHours();
            const isNow = i === startIndex;
            const hCode = data.hourly.weather_code[i] || 2;
            const hWmo = WMO_WEATHER_MAP[hCode] || { desc: 'Partly Cloudy', icon: 'cloud-sun' };
            const hTemp = Math.round(data.hourly.temperature_2m[i] || 30);
            const hRain = data.hourly.precipitation_probability ? (data.hourly.precipitation_probability[i] || 0) : 0;

            let timeLabel = '';
            if (isNow) {
              timeLabel = 'Now';
            } else if (is24HourFormat) {
              timeLabel = `${hour.toString().padStart(2, '0')}:00`;
            } else {
              const period = hour >= 12 ? 'PM' : 'AM';
              let h12 = hour % 12;
              if (h12 === 0) h12 = 12;
              timeLabel = `${h12} ${period}`;
            }

            parsedList.push({
              hour,
              hourMinutes: hour * 60,
              timeLabel,
              isNow,
              temp: hTemp,
              rainProb: hRain,
              icon: hWmo.icon
            });
          }

          if (parsedList.length > 0) {
            cachedHourlyForecast = parsedList;
            renderHourlyForecast();
          }
        }
      }
    } catch (err) {
      console.log('Using default Bangi tropical meteorological dataset with hourly forecast.');
    }
  }

  function generateFallbackHourlyForecast() {
    const list = [];
    const now = new Date();
    const curHour = now.getHours();

    for (let i = 0; i < 24; i++) {
      const targetHour = (curHour + i) % 24;
      const isNow = i === 0;

      let temp = 28;
      if (targetHour >= 4 && targetHour <= 7) temp = 24 + Math.round((targetHour - 4) * 0.8);
      else if (targetHour > 7 && targetHour <= 14) temp = 26 + Math.round((targetHour - 7) * 1.0);
      else if (targetHour > 14 && targetHour <= 17) temp = 33 - Math.round((targetHour - 14) * 1.0);
      else if (targetHour > 17 && targetHour <= 21) temp = 30 - Math.round((targetHour - 17) * 0.8);
      else temp = 26;

      let rainProb = 15;
      let icon = 'cloud-sun';
      if (targetHour >= 13 && targetHour <= 18) {
        rainProb = 65;
        icon = 'cloud-rain';
      } else if (targetHour >= 19 && targetHour <= 22) {
        rainProb = 35;
        icon = 'cloud-sun';
      } else if (targetHour >= 23 || targetHour <= 5) {
        rainProb = 10;
        icon = 'moon';
      }

      let timeLabel = '';
      if (isNow) {
        timeLabel = 'Now';
      } else if (is24HourFormat) {
        timeLabel = `${targetHour.toString().padStart(2, '0')}:00`;
      } else {
        const period = targetHour >= 12 ? 'PM' : 'AM';
        let h12 = targetHour % 12;
        if (h12 === 0) h12 = 12;
        timeLabel = `${h12} ${period}`;
      }

      list.push({
        hour: targetHour,
        hourMinutes: targetHour * 60,
        timeLabel,
        isNow,
        temp,
        rainProb,
        icon
      });
    }
    return list;
  }

  function renderHourlyForecast(inMinutes = null, stdOutMinutes = null) {
    if (!hourlyForecastStrip) return;
    if (inMinutes === null) inMinutes = parseTimeString(clockInInput.value) || (8 * 60);
    if (stdOutMinutes === null) stdOutMinutes = inMinutes + REGULAR_WORK_MINUTES;

    const hourlyList = cachedHourlyForecast || generateFallbackHourlyForecast();

    hourlyForecastStrip.innerHTML = '';
    hourlyList.forEach(item => {
      const slot = document.createElement('div');
      slot.className = 'hourly-slot' + (item.isNow ? ' is-now' : '');

      let shiftBadge = '';
      const hourMins = item.hourMinutes;

      // Highlight shift points
      if (Math.abs(hourMins - inMinutes) <= 30) {
        slot.classList.add('shift-in-hour');
        shiftBadge = '<span class="hourly-shift-badge badge-in">Clock In</span>';
      } else if (Math.abs(hourMins - stdOutMinutes) <= 30) {
        slot.classList.add('shift-out-hour');
        shiftBadge = '<span class="hourly-shift-badge badge-out">Clock Out</span>';
      } else if (hourMins > stdOutMinutes && hourMins <= stdOutMinutes + 4 * 60) {
        slot.classList.add('shift-ot-hour');
      }

      slot.innerHTML = `
        <span class="hourly-time-label">${item.timeLabel}</span>
        <div class="hourly-icon-wrap">
          <i data-lucide="${item.icon}" class="lucide-icon"></i>
        </div>
        <span class="hourly-rain-prob ${item.rainProb >= 25 ? 'rain-highlight' : ''}">
          ${item.rainProb >= 25 ? item.rainProb + '%' : ''}
        </span>
        <span class="hourly-temp-label">${item.temp}°</span>
        ${shiftBadge}
      `;
      hourlyForecastStrip.appendChild(slot);
    });

    renderLucideIcons(hourlyForecastStrip);
  }

  function applyWeatherData(w) {
    currentTemp.textContent = `${w.temp}°C`;
    feelsLike.textContent = `Feels like ${w.feelsLike}°C`;
    weatherCondition.textContent = w.condition;
    tempRange.textContent = `Min: ${w.minTemp}°C • Max: ${w.maxTemp}°C`;
    weatherHumidity.textContent = `${w.humidity}%`;
    weatherRainProb.textContent = `${w.rainProb}%`;
    weatherWind.textContent = `${w.wind} km/h`;

    weatherHeroIcon.innerHTML = `<i data-lucide="${w.icon}" class="lucide-icon"></i>`;
    renderLucideIcons(weatherHeroIcon);

    // Weather shift advisory
    if (w.rainProb >= 50 || w.condition.toLowerCase().includes('rain') || w.condition.toLowerCase().includes('thunder')) {
      weatherAdviceText.textContent = `High chance of rain (${w.rainProb}%) in Bangi. Keep an umbrella ready for your commute / clock-out!`;
    } else {
      weatherAdviceText.textContent = `Pleasant conditions expected in Bangi. Great day for smooth commutes.`;
    }
  }

  // Safe DOM ready execution
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
