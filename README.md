## 🚀 Transform Chaotic Cypress Failure Logs into Actionable Insights\!

Are you tired of manually sifting through overwhelming Cypress test failure logs? Do you struggle to quickly identify the root cause, priority, and specific details of your test exceptions?

`cypress-failure-analyzer` is your solution\! This powerful **CLI tool** processes your [Mochawesome](https://www.google.com/search?q=https://github.com/mochajs/mochawesome) JSON reports, intelligently categorizing and prioritizing each failed test. The result? A clean, organized **CSV report** that empowers faster debugging, clearer communication, and more efficient test automation.

-----

## ✨ Key Features

  * **Automated CSV Reporting:** Converts complex Mochawesome JSON into an easy-to-read CSV format.
  * **Intelligent Failure Categorization:** Automatically classifies failures into types like `AssertionError`, `TypeError`, `CypressError`, `Before Each Hook Failure`, and more.
  * **Dynamic Priority Assignment:** Assigns a severity (Critical, High, Medium, Low) to each failure, guiding your debugging efforts.
  * **Granular Failure Details:** Extracts specific information from error messages (e.g., "Element Not Found (Selector: `tbody tr`)", "Cypress Wait Request Timeout (Route: `/api/data`)").
  * **Cleaned Error Messages & Stack Traces:** Removes distracting ANSI escape codes for improved readability.
  * **Highly Customizable:** Easily extend or modify the built-in error categorization rules to fit your project's unique needs.
  * **CLI-Friendly:** Simple command-line interface for seamless integration into your CI/CD pipelines.

-----

## 🎯 Objective

The primary goal of `cypress-failure-analyzer` is to eliminate the manual overhead of post-test run analysis. By providing a structured, categorized, and prioritized report of failed Cypress tests, it enables:

  * **Rapid Triage:** Quickly understand the impact and urgency of issues.
  * **Streamlined Debugging:** Focus on the most critical and impactful failures first.
  * **Improved Reporting:** Generate clear, data-driven reports for team members and stakeholders.
  * **Trend Analysis:** Identify recurring failure patterns to enhance application stability and test suite robustness.

-----

## 📦 Installation

You can install `cypress-failure-analyzer` either globally (recommended for CLI usage) or as a development dependency in your Cypress project.

### Global Installation (Recommended for CLI)

```bash
npm install -g cypress-failure-analyzer
```

This allows you to run the `cypress-failure-analyzer` command directly from any directory.

### Local Installation (Project-Specific)

```bash
npm install --save-dev cypress-failure-analyzer
```

If installed locally, you would typically run it via `npx cypress-failure-analyzer` or by defining a script in your `package.json` (e.g., `"analyze:failures": "cypress-failure-analyzer"`).

-----

## 🚀 Usage

### Prerequisites

  * **Node.js (v14+):** Ensure Node.js is installed on your system.
  * **Mochawesome Report:** You need a merged Mochawesome JSON report, typically named `mergedReport.json`.
      * Configure your Cypress tests to generate Mochawesome JSON reports (e.g., via `cypress.config.js`).
      * Use a tool like [`mochawesome-merge`](https://www.google.com/search?q=%5Bhttps://www.npmjs.com/package/mochawesome-merge%5D\(https://www.npmjs.com/package/mochawesome-merge\)) to combine individual spec reports into a single `mergedReport.json` file.

### Running the Analyzer

Navigate to the directory where your `mergedReport.json` file is located (or where you want the output CSV to be generated).

**1. Basic Usage (uses default `mergedReport.json` and outputs to `failed_tests_report.csv`):**

```bash
cypress-failure-analyzer
```

**2. Specify Input and Output Paths:**

```bash
cypress-failure-analyzer --input path/to/your/mergedReport.json --output my-failure-report.csv
```

**3. Shorthand Options:**

```bash
cypress-failure-analyzer -i mochawesome-report.json -o detailed-failures.csv
```

**4. Display Help Information:**

```bash
cypress-failure-analyzer --help
```

### Example Workflow:

```bash
# 1. Run Cypress tests (assuming Mochawesome reporter is configured)
npx cypress run --reporter mochawesome --reporter-options 'reportDir=cypress/results,overwrite=false,json=true'

# 2. Merge Mochawesome JSON reports
npx mochawesome-merge "cypress/results/*.json" > mergedReport.json

# 3. Analyze the merged report and generate CSV
cypress-failure-analyzer -i mergedReport.json -o failed_tests_summary.csv

# 4. Open 'failed_tests_summary.csv' in your favorite spreadsheet software!
```

-----

## 📊 Output CSV Columns

The generated CSV file (`failed_tests_report.csv` or your specified output name) will contain the following columns, providing a comprehensive overview of each failed test:

| Column Name             | Description                                                                 |
| :---------------------- | :-------------------------------------------------------------------------- |
| `suite_file`            | The full path to the Cypress spec file where the test is defined.           |
| `suite_title`           | The title of the `describe` block (test suite) containing the failed test.  |
| `test_title`            | The full title of the individual failed test (`it` block).                  |
| `FailingCategory`       | Broad classification of the error (e.g., `AssertionError`, `TypeError`).    |
| `FailingCategoryDetail` | Specific detail about the failure within its category (e.g., `Element Not Found (Selector: X)`). |
| `Priority`              | The assigned severity of the failure: `Critical`, `High`, `Medium`, `Low`.  |
| `err_message`           | The raw, cleaned error message from Cypress/Mocha.                          |

-----

## Understanding Common Cypress Test Failures

`cypress-failure-analyzer` categorizes errors to help you quickly grasp their nature. Here's a brief explanation of the common failure types you'll encounter:

### 🔴 Critical Priority Failures: Immediate Attention Required\!

These often indicate fundamental issues with your test environment, application setup, or core JavaScript logic. They can halt entire test suites.

  * **`TypeError` / `TypeError (Runtime)`:**
      * **What it is:** A JavaScript error when an operation is performed on a value of an unexpected type (e.g., trying to call a method on `undefined`).
      * **Common Causes:** Trying to interact with an element that genuinely doesn't exist, incorrect object property access, issues within custom commands.
      * **Actionable Insight:** Check element existence, variable definitions, and custom command implementations.
  * **`ReferenceError` / `ReferenceError (Runtime)`:**
      * **What it is:** A JavaScript error when a variable or function is referenced but has not been declared or is out of scope.
      * **Common Causes:** Typos in names, forgetting `import` statements, scope issues.
      * **Actionable Insight:** Verify spelling, ensure proper imports, and check variable scopes.
  * **`Before Each Hook Failure`:**
      * **What it is:** An error occurring within a `before()` or `beforeEach()` hook, which usually prevents subsequent tests from running.
      * **Common Causes:** Failed logins, `cy.visit()` issues, critical setup data not loading.
      * **Actionable Insight:** Debug the setup hook in isolation; verify prerequisites for your tests (e.g., application health, authentication).

### 🟠 High Priority Failures: Application Under Test Misbehavior\!

These are direct signs that your application isn't behaving as expected or has a visible bug.

  * **`AssertionError`:**
      * **What it is:** Your `expect()` assertion failed, meaning the actual state of the application didn't match the expected state. Often accompanied by "Timed out retrying..." messages.
      * **Common Causes:**
          * **Element Not Found:** Selector is incorrect, element not rendered, or removed from DOM.
          * **Content/Value Mismatch:** Text, URL, API response status, or attribute value isn't as expected.
          * **Visibility Issues:** Element exists but is hidden or obscured.
      * **Actionable Insight:** Verify selectors, check for application regressions, investigate dynamic rendering issues, confirm API responses.
  * **`UI Visibility Error`:**
      * **What it is:** A custom error (likely from your test utilities) indicating a specific UI component was not visible when expected.
      * **Common Causes:** Component rendering issues, race conditions, CSS hiding the element.
      * **Actionable Insight:** Inspect UI component state and styling.

### 🟡 Medium Priority Failures: Interactivity & Timing Challenges

These often point to flakiness, timing issues, or how Cypress interacts with dynamic UI elements.

  * **`CypressError`:**
      * **What it is:** A general error thrown by Cypress itself, related to command execution.
      * **Common Causes & Details:**
          * **`Cypress Visit Load Failure`:** `cy.visit()` couldn't load the page (app down, wrong URL, network issues).
          * **`Cypress Click Stale Element`:** DOM changed after Cypress found an element but before it could click it.
          * **`Cypress Click Covered Element`:** An element you tried to click was covered by another UI element.
          * **`Cypress Wait Request Timeout`:** `cy.wait()` didn't intercept an expected network request.
          * **`Cypress Match Argument Invalid`:** Incorrect argument type provided to a Cypress command (e.g., non-RegExp to `cy.contains`).
          * **`Cypress Scroll Multi-Element`:** Selector used with `cy.scrollIntoView()` returned multiple elements.
      * **Actionable Insight:** Review timing (add more explicit waits), refine selectors, ensure necessary network requests are made, check for UI overlays.

### ⚫ Other/Unknown Priority Failures

  * **`Other/Unknown` / `Unclassified Error Detail`:**
      * **What it is:** Any error message that doesn't match the predefined categorization rules.
      * **Actionable Insight:** Manually inspect these. If a new, recurring pattern emerges, consider contributing or adding a new rule to `ERROR_CATEGORIZATION_RULES` for future automation.

-----

## 🛠️ Customizing Categorization Rules

The power of `cypress-failure-analyzer` lies in its extensible `ERROR_CATEGORIZATION_RULES`. If you need to tailor the categorization to your specific project's error patterns:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cypress-failure-analyzer.git
    cd cypress-failure-analyzer
    npm install
    ```
2.  **Edit `src/analyzer.js`:**
    Modify the `ERROR_CATEGORIZATION_RULES` array.
      * **Add New Categories:** Add new objects to the main array.
      * **Add New Details:** Add new objects to the `details` array within an existing category.
      * **Utilize Capture Groups:** Use parentheses `()` in your `regex` (e.g., ` Expected to find element:  `([^`]+)`) and reference them in your `detailMessage` as `$1`, `$2`, etc.
      * **Order Matters:** Rules are matched in the order they appear. Place more specific or critical rules higher up.
3.  **Test your changes locally:** Follow the "Local Testing" steps mentioned above.
4.  **Re-link/Publish:** If you wish to use your custom version globally, you can `npm link` it from your cloned directory or even publish your own scoped package to npm.

-----

## 🤝 Contributing

We welcome contributions to make `cypress-failure-analyzer` even better\!

  * **Bug Reports:** If you find a bug, please open an issue with detailed steps to reproduce.
  * **Feature Requests:** Have an idea for a new feature? Share it by opening an issue.
  * **Pull Requests:** Feel free to fork the repository, make your changes, and submit a pull request. We especially appreciate contributions that enhance error categorization rules or add new output formats.

-----

## 📜 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](https://github.com/MohamedSci/cypress-failure-analyzer/blob/main/LICENSE) file for details.

-----

## 👨‍💻 Author

Mohamed Said Ibrahim  [Linkedin](https://www.linkedin.com/in/mohamedsaidibrahim/)
[Medium](https://medium.com/@mohamedsaidibrahim)
-----