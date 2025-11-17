/**
 * @description This module extends Playwright's base test fixture with custom fixtures for
 * error handling, browser context management, and test lifecycle hooks.
 * It provides a foundation for creating more maintainable and feature-rich tests.
 */

import { test as base, type APIRequest, type Browser } from "@playwright/test";
import type { ErrorListenerOptions } from "../types/frameworkTypes.js";
import tabDataHelper from "../data/tabDataHelper.js";
import testDataHelper from "../data/testDataHelper.js";
import frameworkDataHelper from "../data/frameworkDataHelper.js";
import browserHelper from "../channel/browserHelper.js";
import stepSequenceHelper from "../chaining/stepSequenceHelper.js";

/**
 * Extended test fixture that enhances Playwright's base test fixture with additional capabilities
 */
const baseFixture = base.extend<
  {
    /**
     * Configuration options for error listener behavior.
     * Controls whether tests fail on JavaScript errors, connection errors, or request errors.
     */
    errorListenerOptions: ErrorListenerOptions;

    /**
     * Automatic fixture that handles data initialization, and browser teardown.
     */
    auto: void;
  },
  object
>({
  errorListenerOptions: [
    {
      failOnJsError: false,
      failOnConnectionError: false,
      failOnRequestError: false,
    },
    { option: true },
  ],

  /**
   * Automatic fixture that runs before and after each test
   * Handles:
   * - Initializing test data
   * - Closing all browser contexts
   */
  auto: [
    async ({ playwright, browser, baseURL, errorListenerOptions }, use) => {
      initTestData(baseURL, playwright.request, browser, errorListenerOptions);
      await use();
      await browserHelper.closeAllContexts();
    },
    { auto: true },
  ],
});

export default baseFixture;

/**
 * Initializes test data and framework data for a test run
 *
 * @param baseUrl - Base URL for the application under test
 * @param apiRequest - Playwright APIRequest object for making API calls
 * @param browser - Playwright Browser instance
 * @param errorListenerOptions - Configuration for error handling behavior
 * @throws Error if baseURL is undefined
 */
function initTestData(
  baseUrl: string | undefined,
  apiRequest: APIRequest,
  browser: Browser,
  errorListenerOptions: ErrorListenerOptions
) {
  if (!baseUrl) throw new Error("baseURL is undefined");
  tabDataHelper.resetPageTypes();
  testDataHelper.resetTestData();
  stepSequenceHelper.resetStepSequence();
  frameworkDataHelper.init({
    apiRequest: apiRequest,
    baseUrl: baseUrl,
    browser: browser,
    errorListenerOptions: errorListenerOptions,
  });
}
