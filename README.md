# Shift & Overtime Calculator

A web application designed to calculate exact clock-out times and overtime (OT) milestones based on custom work schedules.

---

## 📋 Shift & Overtime Rules

- **Standard Work Shift:** `9 hours 30 minutes`
  - *Example:* Clock-in at **7:00 AM** → Standard clock-out at **4:30 PM**.
- **Minimum Overtime (Tier 1):** `1 hour 10 minutes`
  - Staying less than 1h 10m past standard shift does not qualify for overtime.
  - *Example:* Clock-in at **7:00 AM** → First OT tier starts at **5:40 PM** (10h 40m total).
- **Subsequent Overtime:** Increments every **30 minutes** after the minimum:
  - **Tier 1:** Standard + 1h 10m (e.g. 5:40 PM) → **1h 10m OT** (10h 40m total)
  - **Tier 2:** Standard + 1h 40m (e.g. 6:10 PM) → **1h 40m OT** (11h 10m total)
  - **Tier 3:** Standard + 2h 10m (e.g. 6:40 PM) → **2h 10m OT** (11h 40m total)
  - **Tier 4:** Standard + 2h 40m (e.g. 7:10 PM) → **2h 40m OT** (12h 10m total)
  - **Tier 5:** Standard + 3h 10m (e.g. 7:40 PM) → **3h 10m OT** (12h 40m total)
  - **Tier 6:** Standard + 3h 40m (e.g. 8:10 PM) → **3h 40m OT** (13h 10m total)

---

## 🚀 Features

1. **Clock-In Picker & Quick Adjustments:**
   - HTML5 time input with quick presets (`7:00 AM`, `7:30 AM`, `8:00 AM`, `8:30 AM`, `9:00 AM`, `9:30 AM`).
   - One-click **"📍 Right Now"** button to set current time.
   - Convenient **-15m / +15m** stepper buttons.
2. **Live Shift Tracker:**
   - Real-time progress bar showing percentage of shift completed.
   - Dynamic countdown timer towards standard clock out or next overtime tier.
3. **Overtime Milestone Cards & Table:**
   - Prominent cards for upcoming tiers.
   - Complete breakdown table with total duty hours, status, and one-click copy to clipboard.
4. **Target Departure Checker:**
   - Input any custom departure time to immediately see if it qualifies for OT, what tier it earns, and how many minutes are needed to reach the next tier.
5. **Display & Styling:**
   - Modern **Lucide Icons** integration across headers, buttons, and alert cards.
   - Clean **Flat Design** with crisp borders, flat colors, and zero heavy drop-shadows.
   - Toggle between **12-Hour (AM/PM)** and **24-Hour** time displays.
   - **Dark Mode / Light Mode** with local storage persistence.
   - Fully responsive design for mobile phones, tablets, and desktops.

---

## 💻 How to Run

Because this is a zero-dependency web app (pure HTML, CSS, JavaScript), you can run it in multiple ways:

### Option 1: Open directly in your browser
Double-click `index.html` or open it with your favorite browser:
```bash
open index.html
```

### Option 2: Local development server (Python)
If you prefer running a local HTTP server:
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.
