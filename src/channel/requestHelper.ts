/**
 * @description This module provides a helper for managing API request contexts in Playwright tests.
 * It allows creating, switching between, and managing multiple request contexts,
 * along with their associated headers. The module maintains two types of contexts:
 * 1. Persistent contexts - Can be created and switched between during test execution
 * 2. Throw-away contexts - Created for one-time use and cannot be focused again
 *
 * Each context can have its own set of extra headers that will be applied to requests.
 */

import { type APIRequestContext, test, expect } from "@playwright/test";
import { frameworkDataHelper } from "../data/frameworkDataHelper.js";

const requestContexts: APIRequestContext[] = [];
const throwAwayContexts: APIRequestContext[] = [];
const requestContextsExtraHeaders: (undefined | Map<string, string>)[] = [];
const throwAwayContextsExtraHeaders: (undefined | Map<string, string>)[] = [];

let workingRequestContext: APIRequestContext;

/**
 * @returns The index of the focused request context in the requestContexts array,
 * or -1 if the focused context is a throw-away context
 */
function workingRequestContextIndex() {
  return requestContexts.indexOf(workingRequestContext);
}

/**
 * Sets the focused Request Context.
 * @param requestContextIndex - The index of the context to set as focused
 */
function updateWorkingRequestContext(requestContextIndex: number) {
  const requestContext = requestContexts[requestContextIndex];
  if (!requestContext)
    throw new Error(`Request Context [${requestContextIndex}] not found`);
  workingRequestContext = requestContext;
}

/**
 * Adds or updates a custom header for the currently focused request context.
 * The header will be available for all subsequent requests made with this context.
 *
 * @param key - The header name
 * @param value - The header value
 */
function putExtraHeader(key: string, value: string) {
  const contextIndex = workingRequestContextIndex();
  if (contextIndex >= 0) {
    requestContextsExtraHeaders[contextIndex] ??= new Map<string, string>();
    requestContextsExtraHeaders[contextIndex].set(key, value);
    return;
  }
  const throwAwayContextIndex = throwAwayContexts.indexOf(
    workingRequestContext
  );
  if (throwAwayContextIndex >= 0) {
    throwAwayContextsExtraHeaders[throwAwayContextIndex] ??= new Map<
      string,
      string
    >();
    throwAwayContextsExtraHeaders[throwAwayContextIndex].set(key, value);
  }
}

/**
 * Retrieves all custom headers associated with the currently focused request context.
 *
 * @returns An object containing all custom headers (key-value pairs),
 * or undefined if no custom headers are set
 * @throws If the focused request context cannot be found
 */
function getExtraHeaders() {
  const contextIndex = workingRequestContextIndex();
  if (contextIndex >= 0) {
    const extraHeaders = requestContextsExtraHeaders[contextIndex];
    return !extraHeaders || extraHeaders.size == 0
      ? undefined
      : Object.fromEntries(extraHeaders);
  }
  const throwAwayContextIndex = throwAwayContexts.indexOf(
    workingRequestContext
  );
  if (throwAwayContextIndex >= 0) {
    const extraHeaders = throwAwayContextsExtraHeaders[throwAwayContextIndex];
    return !extraHeaders || extraHeaders.size == 0
      ? undefined
      : Object.fromEntries(extraHeaders);
  }
  throw new Error("Could not find workingRequestContext's Extra Headers");
}

/**
 * Creates a new persistent request context and sets it as the focused context.
 * This context can be referenced later using switchWorkingContext.
 *
 * @param openNewContextCb A callback that creates and returns a new APIRequestContext.
 */
async function openNewContext(
  openNewContextCb?: () => Promise<APIRequestContext>
) {
  await test.step(`Opening new Context`, async () => {
    console.log(`Opening new Context`);
    const newContext = openNewContextCb
      ? await openNewContextCb()
      : await frameworkDataHelper.apiRequest().newContext();
    requestContexts.push(newContext);
    updateWorkingRequestContext(requestContexts.length - 1);
  });
}

/**
 * Creates a new throw-away request context and sets it as the focused context.
 * This context cannot be referenced later (single-use only).
 */
async function openNewThrowAwayContext() {
  await test.step(`Opening new Throw Away Context`, async () => {
    console.log(`Opening new Throw Away Context`);
    let newContext = await frameworkDataHelper.apiRequest().newContext();
    throwAwayContexts.push(newContext);
    workingRequestContext = newContext;
  });
}

/**
 * Changes the focused request context to one of the previously created persistent contexts.
 *
 * @param requestContextIndex - The index of the context to make focused
 * @returns A step that switches to the specified context
 * @throws If the specified index is out of range or already focused
 */
function switchWorkingContext(requestContextIndex: number) {
  return test.step(`Switching working Context to [${requestContextIndex}]`, () => {
    console.log(`Switching working Context to [${requestContextIndex}]`);
    expect(
      requestContextIndex,
      `Context [${requestContextIndex}] not found`
    ).toBeLessThan(requestContexts.length);
    expect(
      requestContextIndex,
      `Already working on context [${requestContextIndex}]`
    ).not.toEqual(workingRequestContextIndex());
    updateWorkingRequestContext(requestContextIndex);
  });
}

/**
 * Helper module for managing API Request context operations.
 */
export const requestHelper = {
  workingRequestContext() {
    return workingRequestContext;
  },
  putExtraHeader,
  getExtraHeaders,
  openNewContext,
  openNewThrowAwayContext,
  switchWorkingContext,
} as const;
