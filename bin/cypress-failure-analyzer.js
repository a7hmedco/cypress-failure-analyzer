#!/usr/bin/env node

// This line tells the operating system to execute this file using Node.js

import { analyzeCypressFailures } from "../src/analyzer.js"; // Import the core logic
import path from "path";
import { fileURLToPath } from "url";

// Node.js ES Modules (ESM) don't have __dirname and __filename directly.
// These lines recreate them for compatibility if needed (though not strictly for this CLI in its current form).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple command-line argument parsing
const args = process.argv.slice(2); // Remove 'node' and script name from argv

let inputPath = "mergedReport.json"; // Default input file name
let outputPath = "failed_tests_report.csv"; // Default output file name

// Parse arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" || args[i] === "-i") {
    inputPath = args[i + 1];
    i++; // Skip the next argument as it's the value
  } else if (args[i] === "--output" || args[i] === "-o") {
    outputPath = args[i + 1];
    i++; // Skip the next argument as it's the value
  } else if (args[i] === "--help" || args[i] === "-h") {
    // Display help information and exit
    console.log(`
Usage: cypress-failure-analyzer [options]

Options:
  -i, --input <path>   Path to the merged Mochawesome JSON report (default: mergedReport.json)
  -o, --output <path>  Path to the output CSV file (default: failed_tests_report.csv)
  -h, --help           Display help information
    `);
    process.exit(0); // Exit successfully after showing help
  }
}

// Run the analysis
async function run() {
  try {
    await analyzeCypressFailures(inputPath, outputPath);
    process.exit(0); // Exit successfully
  } catch (error) {
    // Error caught from analyzeCypressFailures
    console.error("An unhandled error occurred during report generation.");
    console.error(error); // Log the full error
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
}

run();
