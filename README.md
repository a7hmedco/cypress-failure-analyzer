Title: "cypress-failure-analyzer: Cypress Failed Tests Report Generator"

## 4. Setup and Prerequisites

Before running the script, ensure you have the following:

- **Node.js:** Installed on your system (version 14.x or higher recommended).
- **`mergedReport.json`:** A merged Mochawesome JSON report. You typically generate this by configuring Mochawesome to produce individual JSON reports for each spec file and then merging them using a utility like `mochawesome-merge`. Place this file in the directory where you'll run the command, or specify its path using the `--input` option.

### Installation

You can install `cypress-failure-analyzer` globally to use it as a command-line tool anywhere:

```bash
npm install -g cypress-failure-analyzer
```

```bash
npm install --save-dev cypress-failure-analyzer
```

## 5. Usage

1.  **Generate `mergedReport.json`:** After running your Cypress tests, ensure you have a `mergedReport.json` file.
2.  **Run the Analyzer:** Open your terminal or command prompt, navigate to the directory containing your `mergedReport.json` (or where you want the output CSV), and execute:

    **Basic Usage (uses default `mergedReport.json` and outputs to `failed_tests_report.csv`):**

    ```bash
    cypress-failure-analyzer
    ```

    **Specify Input and Output Paths:**

    ```bash
    cypress-failure-analyzer --input path/to/your/custom-report.json --output my-failure-report.csv
    ```

    **Shorthand Options:**

    ```bash
    cypress-failure-analyzer -i mochawesome-report.json -o detailed-failures.csv
    ```

    **Display Help:**

    ```bash
    cypress-failure-analyzer --help
    ```
