// Work Shift & Overtime Calculator Logic
(function () {
  'use strict';

  // Constants
  const REGULAR_WORK_MINUTES = 9 * 60 + 30; // 9 hours 30 minutes = 570 minutes
  const MIN_OT_MINUTES = 70; // 1 hour 10 minutes = 70 minutes
  const OT_STEP_MINUTES = 30; // 30 minutes step
  const OT_TIER_COUNT = 8; // Generate 8 tiers up to ~4h 40m OT

  // Lucide SVG Icons Dictionary (Ensures 100% offline & instant rendering)
  const LUCIDE_SVGS = {
    'timer': '<svg class="lucide lucide-timer" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>',
    'clock': '<svg class="lucide lucide-clock" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'moon': '<svg class="lucide lucide-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    'sun': '<svg class="lucide lucide-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    'map-pin': '<svg class="lucide lucide-map-pin" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
    'log-in': '<svg class="lucide lucide-log-in" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>',
    'log-out': '<svg class="lucide lucide-log-out" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
    'trending-up': '<svg class="lucide lucide-trending-up" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    'calculator': '<svg class="lucide lucide-calculator" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
    'copy': '<svg class="lucide lucide-copy" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    'crosshair': '<svg class="lucide lucide-crosshair" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>',
    'info': '<svg class="lucide lucide-info" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    'check': '<svg class="lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    'check-circle-2': '<svg class="lucide lucide-check-circle-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    'alert-triangle': '<svg class="lucide lucide-alert-triangle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>'
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

  // State
  let is24HourFormat = false;
  let currentTheme = 'light';

  // DOM Elements
  const clockInInput = document.getElementById('clockInInput');
  const btnSetNow = document.getElementById('btnSetNow');
  const btnMinus15 = document.getElementById('btnMinus15');
  const btnPlus15 = document.getElementById('btnPlus15');
  const presetChips = document.querySelectorAll('.chip');
  const liveClockBadge = document.getElementById('liveClockBadge');
  const standardClockOutTime = document.getElementById('standardClockOutTime');
  const standardClockOutSub = document.getElementById('standardClockOutSub');
  const summaryClockIn = document.getElementById('summaryClockIn');
  const summaryClockOut = document.getElementById('summaryClockOut');
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
  const statusMessage = document.getElementById('statusMessage');
  const statusPercentage = document.getElementById('statusPercentage');
  const progressBarFill = document.getElementById('progressBarFill');
  const timeCountdown = document.getElementById('timeCountdown');

  // Initialize
  function init() {
    loadSettings();
    setupEventListeners();
    startLiveClock();

    // Default clock-in if empty: 07:00 or saved value
    const savedTime = localStorage.getItem('last_clock_in') || '07:00';
    clockInInput.value = savedTime;

    updateAllCalculations();
    renderLucideIcons();
  }

  // Load Saved Preferences
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
      highlightActivePreset();
      updateAllCalculations();
    });

    btnMinus15.addEventListener('click', () => {
      adjustClockIn(-15);
    });

    btnPlus15.addEventListener('click', () => {
      adjustClockIn(15);
    });

    btnSetNow.addEventListener('click', () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      clockInInput.value = `${h}:${m}`;
      localStorage.setItem('last_clock_in', clockInInput.value);
      highlightActivePreset();
      updateAllCalculations();
    });

    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        clockInInput.value = chip.dataset.time;
        localStorage.setItem('last_clock_in', clockInInput.value);
        highlightActivePreset();
        updateAllCalculations();
      });
    });

    formatToggle.addEventListener('click', () => {
      is24HourFormat = !is24HourFormat;
      formatLabel.textContent = is24HourFormat ? '24-Hour' : '12-Hour';
      localStorage.setItem('clockout_format', is24HourFormat ? '24h' : '12h');
      updateAllCalculations();
    });

    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
    });

    customOutInput.addEventListener('input', updateChecker);
  }

  function adjustClockIn(deltaMinutes) {
    let currentMins = parseTimeString(clockInInput.value);
    if (currentMins === null) currentMins = 7 * 60;
    let newMins = (currentMins + deltaMinutes + 24 * 60) % (24 * 60);
    const h = Math.floor(newMins / 60).toString().padStart(2, '0');
    const m = (newMins % 60).toString().padStart(2, '0');
    clockInInput.value = `${h}:${m}`;
    localStorage.setItem('last_clock_in', clockInInput.value);
    highlightActivePreset();
    updateAllCalculations();
  }

  function highlightActivePreset() {
    const currentVal = clockInInput.value;
    presetChips.forEach(chip => {
      if (chip.dataset.time === currentVal) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // Live Clock & Status
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
      liveClockBadge.textContent = `Live: ${clockStr}`;

      updateProgressAndCountdown(now);
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  // Calculation Core
  function updateAllCalculations() {
    const inMinutes = parseTimeString(clockInInput.value);
    if (inMinutes === null) return;

    // 1. Standard Clock Out (in + 9h 30m)
    const stdOutMinutes = inMinutes + REGULAR_WORK_MINUTES;

    standardClockOutTime.textContent = formatMinutes(stdOutMinutes);
    standardClockOutSub.textContent = `${formatMinutes(inMinutes, false)} + 9h 30m shift`;
    summaryClockIn.textContent = formatMinutes(inMinutes, false);
    summaryClockOut.textContent = formatMinutes(stdOutMinutes);

    // 2. Build OT Tiers
    renderOvertimeTiers(inMinutes, stdOutMinutes);

    // 3. Update Custom Checker
    updateChecker();

    // 4. Update Progress
    updateProgressAndCountdown(new Date());
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

    // Render Cards (First 4 prominent tiers)
    otTiersGrid.innerHTML = '';
    const cardsToShow = tiers.slice(0, 4);

    cardsToShow.forEach(tier => {
      const card = document.createElement('div');
      card.className = 'ot-card-item';
      card.id = `ot-card-${tier.tierIndex}`;
      card.title = 'Click to test this departure time';
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

    // Render Table (Full list)
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
            <button class="copy-btn" onclick="navigator.clipboard.writeText('${tier.clockOutTimeStr}').then(() => alert('Copied ${tier.clockOutTimeStr}!'))" title="Copy time">
              <i data-lucide="copy" class="lucide-icon"></i> Copy
            </button>
            <button class="copy-btn" data-time24="${tier.time24}" title="Check this time in departure calculator">
              <i data-lucide="crosshair" class="lucide-icon"></i> Test
            </button>
          </div>
        </td>
      `;
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

  // Progress Bar & Countdown
  function updateProgressAndCountdown(now) {
    const inMinutes = parseTimeString(clockInInput.value);
    if (inMinutes === null) return;

    const stdOutMinutes = inMinutes + REGULAR_WORK_MINUTES;
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

    // Relative to today's shift
    let diffFromStart = nowMinutes - inMinutes;
    // Handle midnight wrap if shift started yesterday or overnight
    if (diffFromStart < -12 * 60) {
      diffFromStart += 24 * 60;
    }

    if (diffFromStart < 0) {
      // Shift hasn't started yet today
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

        // Highlight active cards/rows
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
      checkerResultDesc.textContent = 'Select a planned clock out time above to see recognized overtime details.';
      return;
    }

    const stdOutMinutes = inMinutes + REGULAR_WORK_MINUTES;

    // Calculate duration worked
    let durationMinutes = customOutMinutes - inMinutes;
    if (durationMinutes < 0) {
      // Crossed midnight
      durationMinutes += 24 * 60;
    }

    let extraMinutes = customOutMinutes - stdOutMinutes;
    if (extraMinutes < -12 * 60) extraMinutes += 24 * 60;

    if (extraMinutes < 0) {
      // Left early
      const earlyMins = Math.abs(extraMinutes);
      checkerResultBox.className = 'checker-result-box no-ot';
      checkerResultTitle.innerHTML = `<i data-lucide="alert-triangle" class="lucide-icon" style="vertical-align: -2px; color: var(--accent-blue);"></i> Early Departure (${formatDuration(durationMinutes)} total)`;
      checkerResultDesc.textContent = `You are leaving ${formatDuration(earlyMins)} before standard shift completion (${formatMinutes(stdOutMinutes)}). No overtime earned.`;
      renderLucideIcons(checkerResultTitle);
      return;
    }

    if (extraMinutes < MIN_OT_MINUTES) {
      // Stayed past regular hours, but less than 1h 10m minimum OT requirement
      const neededMore = MIN_OT_MINUTES - extraMinutes;
      const minOTOutTime = stdOutMinutes + MIN_OT_MINUTES;

      checkerResultBox.className = 'checker-result-box invalid-ot';
      checkerResultTitle.innerHTML = `<i data-lucide="alert-triangle" class="lucide-icon" style="vertical-align: -2px; color: var(--accent-amber);"></i> Under Minimum OT Threshold (+${formatDuration(extraMinutes)} past shift)`;
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
    checkerResultTitle.innerHTML = `<i data-lucide="check-circle-2" class="lucide-icon" style="vertical-align: -2px; color: var(--accent-green);"></i> Recognized OT: Tier ${otTiersEarned} (+${formatDuration(approvedOTMinutes)} OT)`;
    renderLucideIcons(checkerResultTitle);

    let desc = `Total extra time: ${formatDuration(extraMinutes)}. You qualify for Tier ${otTiersEarned} (${formatDuration(approvedOTMinutes)} OT). Total on-duty: ${formatDuration(REGULAR_WORK_MINUTES + approvedOTMinutes)}.`;

    if (minsToNextTier > 0) {
      desc += ` Pro-tip: Stay ${minsToNextTier} more minutes (until ${formatMinutes(nextTierTargetTime)}) to unlock Tier ${otTiersEarned + 1} (+${formatDuration(nextTierMins)} OT)!`;
    }

    checkerResultDesc.textContent = desc;
  }

  // Start app safely regardless of when script evaluates
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
