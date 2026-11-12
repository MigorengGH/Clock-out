# Shift & Overtime Calculator — Bangi Workplace Hub

A modern, responsive web application designed for workplace attendance tracking, shift countdowns, overtime (OT) milestones, localized **Waktu Solat (JAKIM SGR01)**, and live **Bangi weather forecasting**.

---

## 📋 Shift, Attendance & Overtime Rules

### 1. Clock-In & Punctuality Policy
- **Authorized Arrival Window:** `7:00 AM – 9:30 AM`
- **On-Time Clock-In:** Any arrival between `07:00 AM` and `09:30 AM` is logged as **On Time**.
- **Late Arrival:** Clock-in after `09:30 AM` (e.g. 09:31 AM, 09:45 AM, 10:00 AM) is immediately flagged as **Late Arrival**, calculating the exact minutes of tardiness while maintaining the full required shift duration.
- **Early Arrival:** Clock-in before `07:00 AM` is noted as early.

### 2. Standard Work Shift
- **Shift Duration:** `9 hours 30 minutes`
  - *Example (Early Shift):* Clock-in at **7:00 AM** → Standard clock-out at **4:30 PM**.
  - *Example (Cutoff Shift):* Clock-in at **9:30 AM** → Standard clock-out at **7:00 PM**.
  - *Example (Late Shift):* Clock-in at **9:45 AM** → Late by 15 mins → Standard clock-out at **7:15 PM**.

### 3. Overtime (OT) Milestones
- **Minimum Overtime (Tier 1):** `1 hour 10 minutes`
  - Staying less than 1h 10m past the standard shift does not qualify for overtime.
  - *Example:* Clock-in at **7:00 AM** → First OT tier starts at **5:40 PM** (10h 40m total).
- **Subsequent Overtime:** Increments every **30 minutes** after the minimum:
  - **Tier 1:** Standard + 1h 10m → **1h 10m OT** (10h 40m total duty)
  - **Tier 2:** Standard + 1h 40m → **1h 40m OT** (11h 10m total duty)
  - **Tier 3:** Standard + 2h 10m → **2h 10m OT** (11h 40m total duty)
  - **Tier 4:** Standard + 2h 40m → **2h 40m OT** (12h 10m total duty)
  - **Tier 5:** Standard + 3h 10m → **3h 10m OT** (12h 40m total duty)
  - **Tier 6:** Standard + 3h 40m → **3h 40m OT** (13h 10m total duty)
  - **Tier 7:** Standard + 4h 10m → **4h 10m OT** (13h 40m total duty)
  - **Tier 8:** Standard + 4h 40m → **4h 40m OT** (14h 10m total duty)

---

## 🕌 Waktu Solat Bangi (JAKIM SGR01 Zone)

- **Prayer Times Coverage:** Subuh (Fajr), Syuruk (Sunrise), Zohor (Dhuhr), Asar (Asr), Maghrib (Sunset), and Isyak (Isha).
- **Official Source & Offline Fallback:** Queries official Malaysian Islamic timings with a built-in astronomical solar calculation engine for Bangi (2.9288° N, 101.7801° E), ensuring 100% reliability both online and offline.
- **Active & Upcoming Indicator:** Live countdown to the next prayer (e.g. `Next: Asar in 1h 24m`) and dynamic active prayer highlight.
- **Shift Overlap Detection:** Automatically highlights which prayer times coincide with the worker's shift.

---

## ⛅ Live Bangi Weather Forecast

- **Telemetry:** Real-time temperature (°C), "Feels Like" thermal index, relative humidity (%), precipitation probability (%), and wind speed (km/h) for Bangi, Selangor.
- **Shift Advisory:** Automated alerts (e.g., afternoon thunderstorm warning) to help workers plan their commute and overtime departures.

---

## 🚀 Key Features & UI Enhancements

1. **Punctuality Inspector & Banner:**
   - Visual status badges: `🟢 On Time`, `🔴 Late Arrival`, `🔵 Early Arrival`.
   - Real-time minute calculation for late arrivals.
   - Quick punctuality presets (`07:00 AM`, `07:30 AM`, `08:00 AM`, `08:30 AM`, `09:00 AM`, `09:30 AM Cutoff`, and `09:45 AM Late Demo`).
2. **Standard Clock-Out & Copy Support:**
   - Prominent hero box with one-click copy button.
3. **Live Shift Tracker:**
   - Dynamic animated progress bar tracking % of standard shift completed.
   - Real-time countdowns to standard clock-out and subsequent overtime milestones.
4. **Overtime Cards & Interactive Table:**
   - Prominent cards for top tiers.
   - Full interactive table with total duty hours, status, one-click copy, and "Test in Departure Checker" buttons.
5. **Custom Departure Checker:**
   - Input any target departure time to see whether it qualifies for OT, which tier is earned, or how many minutes remain to unlock the next tier.
6. **Design & System Options:**
   - Dark Mode / Light Mode with local storage persistence.
   - 12-Hour (AM/PM) / 24-Hour time format toggle.
   - 100% offline Lucide icon dictionary fallback.

---

## 💻 How to Run

Zero external build tools or dependencies required (pure HTML5, CSS3, vanilla JavaScript):

### Option 1: Open directly in your browser
```bash
open index.html
```

### Option 2: Local HTTP server
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080`.
