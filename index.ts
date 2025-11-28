import { baseFixture } from "./src/fixtures/playwrap.js";
import { stepSequenceHelper } from "./src/chaining/stepSequenceHelper.js";
import { browserHelper } from "./src/channel/browserHelper.js";
import { requestHelper } from "./src/channel/requestHelper.js";
import { frameworkDataHelper } from "./src/data/frameworkDataHelper.js";
import { testDataHelper } from "./src/data/testDataHelper.js";
import { type ErrorListenerOptions } from "./src/types/frameworkTypes.js";

const { addStep, stepSequence } = stepSequenceHelper;
const {
  workingTab,
  openNewTabInCurrentContext,
  openNewTabInNewContext,
  switchWorkingTab,
  closeContext,
  closeTab,
} = browserHelper;
const {
  workingRequestContext,
  putExtraHeader,
  getExtraHeaders,
  openNewContext,
  openNewThrowAwayContext,
  switchWorkingContext,
} = requestHelper;
const { baseUrl, browser } = frameworkDataHelper;
const { pushTestData, getTestData } = testDataHelper;
export {
  baseUrl,
  browser,
  stepSequence,
  addStep,
  workingTab,
  openNewTabInCurrentContext,
  openNewTabInNewContext,
  switchWorkingTab,
  closeContext,
  closeTab,
  workingRequestContext,
  putExtraHeader,
  getExtraHeaders,
  openNewContext,
  openNewThrowAwayContext,
  switchWorkingContext,
  baseFixture,
  pushTestData,
  getTestData,
  type ErrorListenerOptions,
};
