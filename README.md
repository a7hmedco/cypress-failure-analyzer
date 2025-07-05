# Cypress Failure Analyzer 🐞

![Cypress Failure Analyzer](https://img.shields.io/badge/Cypress%20Failure%20Analyzer-v1.0.0-brightgreen.svg)
![npm](https://img.shields.io/badge/npm-v6.14.8-blue.svg)
![GitHub issues](https://img.shields.io/github/issues/a7hmedco/cypress-failure-analyzer.svg)

Welcome to the **Cypress Failure Analyzer**! This tool generates reports for failed tests in Cypress, helping you identify issues quickly and effectively. Whether you are working on end-to-end testing, debugging, or error analysis, this tool is designed to streamline your testing workflow.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Report Generation](#report-generation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Automated Report Generation**: Generate detailed reports for failed tests.
- **Easy Integration**: Works seamlessly with your existing Cypress setup.
- **Customizable Output**: Tailor the report format to fit your needs.
- **Error Analysis**: Quickly pinpoint issues to improve test reliability.
- **Support for Mochawesome**: Leverage Mochawesome for enhanced reporting capabilities.

## Installation

To get started, clone the repository:

```bash
git clone https://github.com/a7hmedco/cypress-failure-analyzer.git
cd cypress-failure-analyzer
```

Then, install the necessary dependencies:

```bash
npm install
```

For the latest version and updates, visit the [Releases](https://github.com/a7hmedco/cypress-failure-analyzer/releases) section.

## Usage

After installation, you can use the Cypress Failure Analyzer in your testing workflow. Run your Cypress tests as you normally would:

```bash
npx cypress run
```

Once the tests complete, you can generate the failure report:

```bash
npx cypress-failure-analyzer
```

This command will create a report that summarizes the failed tests, including error messages and stack traces.

## Configuration

You can customize the behavior of the Cypress Failure Analyzer by modifying the configuration file. Create a file named `cypress-failure-analyzer.config.js` in your project root. Here is an example configuration:

```javascript
module.exports = {
  outputDir: 'cypress/reports',
  reportFormat: 'html', // Options: 'html', 'json', 'text'
  includeScreenshots: true,
  errorDetails: true,
};
```

Adjust the options according to your needs. The generated reports will be saved in the specified `outputDir`.

## Report Generation

The Cypress Failure Analyzer generates reports that provide a clear overview of the failed tests. Each report includes:

- **Test Name**: The name of the test that failed.
- **Error Message**: A description of the error encountered.
- **Stack Trace**: A detailed stack trace for debugging.
- **Screenshots**: Optional screenshots from the test run.

To view the generated report, navigate to the output directory specified in your configuration file.

## Contributing

We welcome contributions to improve the Cypress Failure Analyzer. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch and create a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or support, please open an issue in the repository or contact the maintainer:

- **Ahmed Co.**: [a7hmedco](https://github.com/a7hmedco)

---

For the latest releases and updates, visit the [Releases](https://github.com/a7hmedco/cypress-failure-analyzer/releases) section. Download the latest version and execute it to enhance your testing process. 

Thank you for using the Cypress Failure Analyzer! We hope it helps you improve your testing efficiency and accuracy. Happy testing!