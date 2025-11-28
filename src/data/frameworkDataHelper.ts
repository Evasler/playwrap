/**
 * @description This module provides a centralized data store for sharing essential objects
 * across various modules of the test framework.
 */

import type { APIRequest, Browser } from "@playwright/test";
import type { ErrorListenerOptions } from "../types/frameworkTypes.js";

/** Playwright's API request context for making API calls */
let apiRequest: APIRequest;

/** Base URL of the application under test */
let baseUrl: string;

/** Playwright's Browser instance for UI testing */
let browser: Browser;

/** Configuration options for error listener behavior */
let errorListenerOptions: ErrorListenerOptions;

/**
 * @param contextIndex The index of the browser context
 * @returns The browser context at the specified index
 * @throws Error if the context does not exist
 */
function getContext(contextIndex: number) {
  const context = browser.contexts()[contextIndex];
  if (!context) throw new Error(`Context [${contextIndex}] does not exist`);
  return context;
}

/**
 * Initializes the framework data with required objects and configuration
 *
 * @param frameworkData - Object containing the required framework data
 * @param frameworkData.apiRequest - Playwright's API request context
 * @param frameworkData.baseUrl - Base URL of the application under test
 * @param frameworkData.browser - Playwright's Browser instance
 * @param frameworkData.errorListenerOptions - Error listener configuration
 */
function init(frameworkData: {
  apiRequest: APIRequest;
  baseUrl: string;
  browser: Browser;
  errorListenerOptions: ErrorListenerOptions;
}) {
  apiRequest = frameworkData.apiRequest;
  baseUrl = frameworkData.baseUrl;
  browser = frameworkData.browser;
  errorListenerOptions = frameworkData.errorListenerOptions;
}

/**
 * @param contextIndex The index of the browser context
 * @param pageIndex The index of the page within the context
 * @returns The page at the specified index within the context
 * @throws Error if the page does not exist
 */
function getPage(contextIndex: number, pageIndex: number) {
  const page = getContext(contextIndex).pages()[pageIndex];
  if (!page)
    throw new Error(
      `Page [${pageIndex}] does not exist for Context [${contextIndex}]`
    );
  return page;
}

/**
 * Helper module that serves as a centralized store for framework-level data.
 *
 * This module provides access to core Playwright objects and configuration settings
 * that need to be shared across different parts of the test framework. It facilitates
 * a method-chaining pattern by providing consistent access to these objects
 * throughout the test execution lifecycle.
 */
export const frameworkDataHelper = {
  apiRequest() {
    return apiRequest;
  },
  baseUrl() {
    return baseUrl;
  },
  browser() {
    return browser;
  },
  errorListenerOptions() {
    return errorListenerOptions;
  },
  init,
  getContext,
  getPage,
} as const;
