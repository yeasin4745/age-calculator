# Age Calculator

A lightweight, responsive age calculator built with **HTML, CSS, and Vanilla JavaScript**. The application calculates a user’s exact age from their birth date and birth time, refreshes the result in real time, and displays a live countdown to the next birthday.

> Enter your birth date and birth time once to view your age in years, months, days, hours, minutes, and seconds.

[Live Demo][1] · [View Repository][2]

## Features

| Feature | Description |
|---|---|
| Date and time input | Accepts both a birth date and a birth time, including seconds. |
| Exact age calculation | Shows years, months, days, hours, minutes, and seconds. |
| Real-time updates | Refreshes the age, elapsed totals, and birthday countdown every second. |
| Elapsed time totals | Displays total days, total hours, total minutes, and total seconds lived. |
| Birthday countdown | Shows the remaining days, hours, minutes, and seconds until the next birthday. |
| Input validation | Detects missing values, invalid date/time values, future birth moments, and ages above 150 years. |
| Dark mode | Includes a light/dark theme toggle with the selected theme saved in `localStorage`. |
| Responsive design | Works across desktop, tablet, and mobile screen sizes. |
| No dependencies | Uses only browser-native APIs and does not require a framework or build process. |

## How to Use

1. Open the [Live Demo][1] or run the project locally.
2. Select your **Birth Date**.
3. Select your **Birth Time**. The default time is `00:00:00`.
4. Click **Calculate Age**. The result also updates automatically when both inputs are changed.
5. Keep the page open to see the exact age and countdown refresh every second.
6. Use the theme button in the top-right corner to switch between light and dark mode.

## Example

If a user enters:

| Input | Example value |
|---|---|
| Birth Date | `2000-01-15` |
| Birth Time | `14:30:45` |

The application calculates the elapsed age from that exact local date and time, rather than treating the birth moment as midnight.

## Project Structure

```text
age-calculator/
├── index.html    # Application structure and user interface
├── style.css     # Responsive layout, themes, animations, and visual styles
├── script.js     # Validation, age calculations, countdown, and live updates
├── README.md     # Project documentation
└── Redmi.md      # Live preview reference
```

## Run Locally

This project is a static website, so no package installation or build step is required.

### Option 1: Open directly

Clone the repository and open `index.html` in a modern web browser:

```bash
git clone https://github.com/yeasin4745/age-calculator.git
cd age-calculator
```

Then double-click `index.html`, or open it with your browser.

### Option 2: Use a local development server

A local server is recommended when developing or testing browser behavior:

```bash
python3 -m http.server 5500
```

Open [http://localhost:5500](http://localhost:5500) in your browser.

## Technical Overview

The project uses a simple three-file architecture:

| File | Responsibility |
|---|---|
| `index.html` | Defines the input controls, result cards, theme button, and accessible status areas. |
| `style.css` | Provides the responsive interface, light/dark theme variables, cards, buttons, and animations. |
| `script.js` | Parses local date/time values, validates input, calculates elapsed age, updates the DOM, and controls the live interval. |

After a valid calculation, the application stores the selected birth moment in memory and refreshes the displayed values with a one-second interval. When the input becomes incomplete or invalid, the interval stops and stale results are hidden.

The entered date and time are interpreted in the user’s **local browser timezone**. This keeps the result aligned with the clock shown on the user’s own device.

## Validation Rules

The calculator applies the following rules before displaying results:

- Both the birth date and birth time must be provided.
- The birth date/time must be a valid browser date/time value.
- A birth moment in the future is rejected.
- Ages above 150 years are rejected.
- Changing either input recalculates the result when both values are available.

## Development

The project intentionally avoids frameworks and external libraries so that the calculation flow remains easy to inspect and learn from. To modify the interface, update `index.html` and `style.css`. To change the calculation behavior or validation, update `script.js`.

Before committing changes, run the following checks:

```bash
node --check script.js
git diff --check
```

For a manual check, verify a normal past birth moment, a future birth moment, a missing input, a birthday boundary, and the one-second live refresh behavior.

## Deployment

Because this is a static site, it can be deployed using services such as **Vercel, GitHub Pages, Netlify, or Cloudflare Pages**. Use the repository root as the project directory and leave the build command empty. The entry point is `index.html`.

## Contributing

Contributions are welcome. Create a feature branch, make a focused change, test it in a browser, and open a pull request with a clear description of the change.

```bash
git checkout -b feature/your-change
git add .
git commit -m "feat: describe your change"
git push origin feature/your-change
```

## License

No license file is currently included in this repository. Add an appropriate open-source license before redistributing or reusing the project publicly.

## References

[1]: https://age-calculator-lime-beta.vercel.app/ "Age Calculator Live Demo"
[2]: https://github.com/yeasin4745/age-calculator "Age Calculator GitHub Repository"
