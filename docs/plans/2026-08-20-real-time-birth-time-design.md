# Birth Time and Real-Time Age Calculator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow users to enter both their birth date and birth time, then keep all age and birthday values synchronized with the current time.

**Architecture:** Keep the existing three-file Vanilla JavaScript structure. Replace the date-only input with separate date and time controls, normalize them into one local `Date` object, and use a single calculation pipeline for exact age, elapsed totals, and the next birthday countdown. After a valid calculation, refresh the displayed values once per second and clear the interval whenever the input becomes invalid or the page is unloaded.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, browser `Date`, `setInterval`, and existing localStorage theme support.

---

## Design Decisions

The recommended approach is separate `date` and `time` inputs rather than a single `datetime-local` control. This preserves the current date-picker behavior, makes the new time requirement obvious on mobile and desktop, and allows a clear default time of `00:00` without relying on browser-specific combined control presentation.

The live calculation will show exact age as years, months, days, hours, minutes, and seconds. Existing total-days, total-hours, and total-minutes cards will continue to work and will update every second; a total-seconds card will be added so the live behavior is visible immediately. The next birthday countdown will include days, hours, minutes, and seconds and will use the entered birth time on the matching month and day.

Validation will reject missing date or time, malformed values, future birth moments, and ages over 150 years. Date and time values will be parsed as local time to match the user’s entered clock time. The calculation will handle month lengths and birthdays that fall on February 29 by using the last valid day of February in non-leap years.

## Implementation Tasks

### Task 1: Update the HTML input and result cards

**Files:**
- Modify: `index.html`

Add a `time` input with `id="birthTime"`, keep the date input as `id="dob"`, update the input label to mention both values, and add a `Total Seconds` result card. Add a small live status element with `id="liveStatus"` to make the continuous refresh state clear.

### Task 2: Add responsive styles for the paired inputs and live status

**Files:**
- Modify: `style.css`

Add a two-column `.input-grid` that collapses to one column on narrow screens. Reuse the existing input styling through `.date-input, .time-input`, and style the live status with the existing theme variables. Do not add comments to the production code.

### Task 3: Replace date-only calculations with time-aware calculations

**Files:**
- Modify: `script.js`

Implement helpers to read and validate both controls, construct a local birth `Date`, calculate calendar age plus time remainder, calculate total elapsed seconds/minutes/hours/days, and calculate the next birthday countdown. Store the active birth moment and interval ID in module-level state. `handleCalculate` will validate and render once, while `startLiveUpdates` will refresh via `setInterval(..., 1000)`.

### Task 4: Wire live updates and input changes

**Files:**
- Modify: `script.js`

Start live updates after a successful calculation, stop them when validation fails, recalculate when either input changes, support Enter from both inputs, and clean up the interval on `beforeunload`. The UI must never display stale results after a changed or invalid input.

### Task 5: Verify and commit

**Files:**
- Test: `index.html`, `style.css`, `script.js`
- Commit: repository history

Run static syntax checks, inspect the final diff, verify the DOM IDs match the JavaScript selectors, and test the calculator with a past birth moment, a birthday boundary, a future time, and an invalid/missing input. Commit with a focused feature message and push the commit to `origin/main`.

## Verification Commands

```bash
node --check script.js

git diff --check

git status --short
```

Manual browser verification should confirm that changing the date or time updates the result without requiring a second click, and that seconds increment while the page remains open.
