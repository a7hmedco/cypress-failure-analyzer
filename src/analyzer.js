// src/analyzer.js
import fs from 'fs-extra';
import Papa from 'papaparse';

/**
 * Defines rules for categorizing and prioritizing error messages, including specific details.
 * Rules are evaluated in order; the first match wins.
 * Details within a category are also evaluated in order.
 */
const ERROR_CATEGORIZATION_RULES = [
  // Critical errors
  {
    regex: /^TypeError:/,
    category: 'TypeError',
    priority: 'Critical',
    details: [
      { regex: /is not a function/, detailMessage: 'Method is not a function' },
      { regex: /.*/, detailMessage: 'Generic TypeError' },
    ],
  },
  {
    regex: /^ReferenceError:/,
    category: 'ReferenceError',
    priority: 'Critical',
    details: [
      { regex: /is not defined/, detailMessage: 'Variable/Function not defined' },
      { regex: /.*/, detailMessage: 'Generic ReferenceError' },
    ],
  },
  {
    regex: /Because this error occurred during a `before each` hook/,
    category: 'Before Each Hook Failure',
    priority: 'Critical',
    details: [
      { regex: /Timed out after waiting `\d+ms` for your remote page to load/, detailMessage: 'Page Load Timeout in Before Each' },
      { regex: /.*/, detailMessage: 'Generic Before Each Failure' },
    ],
  },
  {
    regex: /is not a function/, // Catches dynamic TypeError messages not starting with 'TypeError:'
    category: 'TypeError (Runtime)',
    priority: 'Critical',
    details: [
      { regex: /.*/, detailMessage: 'Method is not a function (Runtime)' },
    ],
  },
  {
    regex: /is not defined/, // Catches dynamic ReferenceError messages not starting with 'ReferenceError:'
    category: 'ReferenceError (Runtime)',
    priority: 'Critical',
    details: [
      { regex: /.*/, detailMessage: 'Variable/Function not defined (Runtime)' },
    ],
  },

  // High priority errors
  {
    regex: /^AssertionError:/,
    category: 'AssertionError',
    priority: 'High',
    details: [
      { regex: /Timed out retrying after \d+ms: \[object Object\]: expected 'https:\/\/auth\.microtecstage\.com\/Account\/Login\?returnUrl=/, detailMessage: 'Login URL Mismatch' },
      { regex: /expected '' to match/, detailMessage: 'Empty String Match Failure' },
      { regex: /expected \d+ to equal \d+/, detailMessage: 'Numeric Equality Assertion Failed' },
      { regex: /Expected to find element: `([^`]+)`, but never found it\./, detailMessage: 'Element Not Found (Selector: $1)' }, // Capture selector
      { regex: /Expected to find content: '([^']+)' within the selector: '([^']+)' but never did\./, detailMessage: 'Content Not Found (Content: $1, Selector: $2)' }, // Capture content and selector
      { regex: /expected '<label\.form-label\.paragraph_b18>' to be 'visible'/, detailMessage: 'Label Visibility Assertion Failed' },
      { regex: /Timed out retrying after/, detailMessage: 'Generic Assertion Timeout' },
      { regex: /.*/, detailMessage: 'Generic AssertionError' }, // Catch-all for AssertionError
    ],
  },
  {
    regex: /Error: Table is not visible/,
    category: 'UI Visibility Error',
    priority: 'High',
    details: [
      { regex: /.*/, detailMessage: 'Table Component Not Visible' }, // Specific custom error
    ],
  },

  // Medium priority errors
  {
    regex: /^CypressError:/,
    category: 'CypressError',
    priority: 'Medium',
    details: [
      { regex: /`cy\.visit\(\)` failed trying to load/, detailMessage: 'Cypress Visit Load Failure' },
      { regex: /`cy\.click\(\)` failed because the page updated while this command was executing/, detailMessage: 'Cypress Click Stale Element' },
      { regex: /`cy\.click\(\)` failed because this element/, detailMessage: 'Cypress Click Covered Element' },
      { regex: /`cy\.wait\(\)` timed out waiting `\d+ms` for the(?: \d+(?:st|nd|rd|th))? request to the route: `([^`]+)`\. No request ever occurred\./, detailMessage: 'Cypress Wait Request Timeout (Route: $1)' }, // Capture route
      { regex: /`match` requires its argument be a `RegExp`/, detailMessage: 'Cypress Match Argument Invalid' },
      { regex: /`cy\.scrollIntoView\(\)` can only be used to scroll to \d+ element, you tried to scroll to \d+ elements\./, detailMessage: 'Cypress Scroll Multi-Element' },
      { regex: /is being covered by another element/, detailMessage: 'Element Covered by Another' },
      { regex: /No request ever occurred\./, detailMessage: 'Cypress Request Never Occurred' }, // Generic request wait timeout
      { regex: /.*/, detailMessage: 'Generic CypressError' }, // Catch-all for CypressError
    ],
  },

  // Default / Low priority
  {
    regex: /.*/,
    category: 'Other/Unknown',
    priority: 'Low',
    details: [
      { regex: /.*/, detailMessage: 'Unclassified Error Detail' },
    ],
  },
];

/**
 * Categorizes an error message, assigns a priority, and extracts specific detail.
 * @param {string} errorMessage - The error message from the test failure.
 * @returns {{category: string, priority: string, detail: string}} An object containing the determined category, priority, and specific detail.
 */
function getErrorCategoryAndPriority(errorMessage) {
  if (!errorMessage) {
    return { category: 'No Error Message', priority: 'Low', detail: 'No error message provided' };
  }

  const cleanedMessage = errorMessage.replace(/\n/g, ' ').trim();

  for (const rule of ERROR_CATEGORIZATION_RULES) {
    if (rule.regex.test(cleanedMessage)) {
      for (const detailRule of rule.details) {
        const match = cleanedMessage.match(detailRule.regex);
        if (match) {
          let detailMessage = detailRule.detailMessage;
          if (match.length > 1) {
            for (let i = 1; i < match.length; i++) {
              detailMessage = detailMessage.replace(`$${i}`, match[i]);
            }
          }
          return { category: rule.category, priority: rule.priority, detail: detailMessage };
        }
      }
      return { category: rule.category, priority: rule.priority, detail: `Generic ${rule.category}` };
    }
  }

  return { category: 'Uncategorized', priority: 'Unknown', detail: 'No matching category or detail found' };
}

/**
 * Analyzes a merged Mochawesome JSON report and generates a CSV of failed tests.
 * @param {string} inputPath - Path to the merged Mochawesome JSON report (e.g., 'mergedReport.json').
 * @param {string} outputPath - Path to the output CSV file (e.g., 'failed_tests_report.csv').
 */
export async function analyzeCypressFailures(inputPath, outputPath) {
  try {
    console.log(`Reading report from: ${inputPath}`);
    const rawData = await fs.readJson(inputPath);

    const reportData = [];

    const processTest = (suitePath, suiteTitle, test) => {
      if (test.fail) {
        let errorMessage = test.err ? test.err.message : 'N/A';
        let errorStack = test.err ? test.err.estack : 'N/A';

        // Clean up error messages for better readability in CSV (remove ANSI escape codes)
        errorMessage = errorMessage.replace(/\u001b\[.*?m/g, '').trim();
        errorStack = errorStack.replace(/\u001b\[.*?m/g, '').trim();

        const { category, priority, detail } = getErrorCategoryAndPriority(errorMessage);

        reportData.push({
          suite_file: suitePath,
          suite_title: suiteTitle,
          test_title: test.fullTitle || test.title,
          FailingCategory: category,
          FailingCategoryDetail: detail,
          Priority: priority,
          err_message: errorMessage,
          err_estack: errorStack,
        });
      }
    };

    const processSuites = (suitePath, suites) => {
      suites.forEach(suite => {
        const currentSuitePath = suite.fullFile || suitePath;
        const currentSuiteTitle = suite.title;

        suite.tests.forEach(test => processTest(currentSuitePath, currentSuiteTitle, test));

        if (suite.suites && suite.suites.length > 0) {
          processSuites(currentSuitePath, suite.suites);
        }
      });
    };

    if (!rawData || !Array.isArray(rawData.results)) {
        console.warn("Input JSON does not contain a valid 'results' array. No tests to process.");
        // Create an empty CSV file with headers if input is invalid
        await fs.writeFile(outputPath, Papa.unparse([], { header: true }));
        console.log(`Empty report generated successfully: ${outputPath}`);
        return;
    }

    rawData.results.forEach(specFileResult => {
      const specFilePath = specFileResult.fullFile || specFileResult.file;

      specFileResult.tests.forEach(test => processTest(specFilePath, specFileResult.title || 'Root Suite', test));

      if (specFileResult.suites && specFileResult.suites.length > 0) {
        processSuites(specFilePath, specFileResult.suites);
      }
    });

    if (reportData.length === 0) {
      console.log('No failed tests found to report.');
      await fs.writeFile(outputPath, Papa.unparse([], { header: true })); // Ensure an empty CSV with headers is created
      console.log(`Empty report generated successfully: ${outputPath}`);
      return;
    }

    const csv = Papa.unparse(reportData, {
      header: true,
    });

    await fs.writeFile(outputPath, csv);
    console.log(`Failed tests report generated successfully: ${outputPath}`);

  } catch (error) {
    console.error('Error generating failed tests report:', error.message);
    throw error; // Re-throw to be caught by CLI handler for proper process exit
  }
}