import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardMetrics } from "../dashboard-metrics";

describe("DashboardMetrics", () => {
	const defaultProps = {
		totalTasks: 100,
		doneTasks: 75,
		inProcessTasks: 25,
		completionRate: 75.0,
	};

	it("should render all metric cards", () => {
		render(<DashboardMetrics {...defaultProps} />);

		expect(screen.getByTestId("metric-total-tasks")).toBeInTheDocument();
		expect(screen.getByTestId("metric-completed-tasks")).toBeInTheDocument();
		expect(screen.getByTestId("metric-in-progress-tasks")).toBeInTheDocument();
		expect(screen.getByTestId("metric-completion-rate")).toBeInTheDocument();
	});

	it("should display correct values", () => {
		render(<DashboardMetrics {...defaultProps} />);

		// Use test IDs to get specific values
		expect(screen.getByTestId("metric-total-tasks")).toHaveTextContent("100");
		expect(screen.getByTestId("metric-completed-tasks")).toHaveTextContent(
			"75",
		);
		expect(screen.getByTestId("metric-in-progress-tasks")).toHaveTextContent(
			"25",
		);
		expect(screen.getByTestId("metric-completion-rate")).toHaveTextContent(
			"75.0%",
		);
	});

	it("should display completion rate with one decimal place", () => {
		const props = { ...defaultProps, completionRate: 66.6667 };
		render(<DashboardMetrics {...props} />);

		expect(screen.getByTestId("metric-completion-rate")).toHaveTextContent(
			"66.7%",
		);
	});

	it("should handle zero values", () => {
		const zeroProps = {
			totalTasks: 0,
			doneTasks: 0,
			inProcessTasks: 0,
			completionRate: 0,
		};

		render(<DashboardMetrics {...zeroProps} />);

		expect(screen.getByTestId("metric-total-tasks")).toHaveTextContent("0");
		expect(screen.getByTestId("metric-completed-tasks")).toHaveTextContent("0");
		expect(screen.getByTestId("metric-in-progress-tasks")).toHaveTextContent(
			"0",
		);
		expect(screen.getByTestId("metric-completion-rate")).toHaveTextContent(
			"0.0%",
		);
	});

	it("should handle edge case with all tasks completed", () => {
		const allCompletedProps = {
			totalTasks: 50,
			doneTasks: 50,
			inProcessTasks: 0,
			completionRate: 100,
		};

		render(<DashboardMetrics {...allCompletedProps} />);

		expect(screen.getByTestId("metric-total-tasks")).toHaveTextContent("50");
		expect(screen.getByTestId("metric-completed-tasks")).toHaveTextContent(
			"50",
		);
		expect(screen.getByTestId("metric-in-progress-tasks")).toHaveTextContent(
			"0",
		);
		expect(screen.getByTestId("metric-completion-rate")).toHaveTextContent(
			"100.0%",
		);
	});

	it("should have correct card titles", () => {
		render(<DashboardMetrics {...defaultProps} />);

		expect(screen.getByText("Total Tasks")).toBeInTheDocument();
		expect(screen.getByText("Completed")).toBeInTheDocument();
		expect(screen.getByText("In Progress")).toBeInTheDocument();
		expect(screen.getByText("Completion Rate")).toBeInTheDocument();
	});

	it("should have descriptive text", () => {
		render(<DashboardMetrics {...defaultProps} />);

		expect(screen.getByText("All project tasks")).toBeInTheDocument();
		expect(screen.getByText("Completion rate")).toBeInTheDocument();
		expect(screen.getByText("Remaining")).toBeInTheDocument();
		expect(screen.getByText("Overall progress")).toBeInTheDocument();
	});
});
