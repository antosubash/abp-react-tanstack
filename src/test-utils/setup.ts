import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { setupServer } from "msw/node";
import { allHandlers } from "./mock-handlers";

// Extend expect with jest-dom matchers
expect.extend(matchers);

// Set up MSW server
export const server = setupServer(...allHandlers);

// Start server before all tests
beforeAll(() => {
	server.listen({
		onUnhandledRequest: "warn",
	});
});

// Reset handlers after each test
afterEach(() => {
	server.resetHandlers();
	cleanup();
});

// Close server after all tests
afterAll(() => {
	server.close();
});
