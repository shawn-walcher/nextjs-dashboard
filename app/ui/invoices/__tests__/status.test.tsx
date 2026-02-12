import React from "react";
import { render, screen } from "@testing-library/react";
import InvoiceStatus from "../status";

// Mock the heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  CheckIcon: () => <div data-testid="check-icon">Check Icon</div>,
  ClockIcon: () => <div data-testid="clock-icon">Clock Icon</div>,
}));

describe("InvoiceStatus Component", () => {
  it("should render pending status with correct text", () => {
    // Arrange & Act
    render(<InvoiceStatus status="pending" />);

    // Assert
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should render paid status with correct text", () => {
    // Arrange & Act
    render(<InvoiceStatus status="paid" />);

    // Assert
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("should show clock icon for pending status", () => {
    // Arrange & Act
    render(<InvoiceStatus status="pending" />);

    // Assert
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
  });

  it("should show check icon for paid status", () => {
    // Arrange & Act
    render(<InvoiceStatus status="paid" />);

    // Assert
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("should not show clock icon for paid status", () => {
    // Arrange & Act
    render(<InvoiceStatus status="paid" />);

    // Assert
    expect(screen.queryByTestId("clock-icon")).not.toBeInTheDocument();
  });

  it("should not show check icon for pending status", () => {
    // Arrange & Act
    render(<InvoiceStatus status="pending" />);

    // Assert
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  it("should apply correct styling for pending status", () => {
    // Arrange & Act
    const { container } = render(<InvoiceStatus status="pending" />);

    // Assert
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-gray-100");
    expect(span).toHaveClass("text-gray-500");
  });

  it("should apply correct styling for paid status", () => {
    // Arrange & Act
    const { container } = render(<InvoiceStatus status="paid" />);

    // Assert
    const span = container.querySelector("span");
    expect(span).toHaveClass("bg-green-500");
    expect(span).toHaveClass("text-white");
  });

  it("should have common styling classes", () => {
    // Arrange & Act
    const { container } = render(<InvoiceStatus status="pending" />);

    // Assert
    const span = container.querySelector("span");
    expect(span).toHaveClass("inline-flex");
    expect(span).toHaveClass("items-center");
    expect(span).toHaveClass("rounded-full");
    expect(span).toHaveClass("px-2");
    expect(span).toHaveClass("py-1");
    expect(span).toHaveClass("text-xs");
  });

  it("should render unknown status without text or icon", () => {
    // Arrange & Act
    const { container } = render(<InvoiceStatus status="unknown" />);

    // Assert
    const span = container.querySelector("span");
    expect(span?.textContent).toBe("");
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("clock-icon")).not.toBeInTheDocument();
  });

  it("should render empty string status without text or icon", () => {
    // Arrange & Act
    const { container } = render(<InvoiceStatus status="" />);

    // Assert
    const span = container.querySelector("span");
    expect(span?.textContent).toBe("");
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("clock-icon")).not.toBeInTheDocument();
  });
});
