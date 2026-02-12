import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "../cards";

// Mock hero icons
jest.mock("@heroicons/react/24/outline", () => ({
  BanknotesIcon: () => <span data-testid="banknotes-icon">banknotes</span>,
  ClockIcon: () => <span data-testid="clock-icon">clock</span>,
  UserGroupIcon: () => <span data-testid="users-icon">users</span>,
  InboxIcon: () => <span data-testid="inbox-icon">inbox</span>,
}));

// Mock fonts
jest.mock("@/app/ui/fonts", () => ({
  lusitana: { className: "mock-lusitana" },
}));

describe("Card Component", () => {
  it("should render card with title", () => {
    // Arrange & Act
    render(<Card title="Collected" value={5000} type="collected" />);

    // Assert
    expect(screen.getByText("Collected")).toBeInTheDocument();
  });

  it("should render card with numeric value", () => {
    // Arrange & Act
    render(<Card title="Collected" value={5000} type="collected" />);

    // Assert
    expect(screen.getByText("5000")).toBeInTheDocument();
  });

  it("should render card with string value", () => {
    // Arrange & Act
    render(<Card title="Test" value="$5,000.00" type="collected" />);

    // Assert
    expect(screen.getByText("$5,000.00")).toBeInTheDocument();
  });

  it("should render collected icon for collected type", () => {
    // Arrange & Act
    render(<Card title="Collected" value={5000} type="collected" />);

    // Assert
    expect(screen.getByTestId("banknotes-icon")).toBeInTheDocument();
  });

  it("should render pending icon for pending type", () => {
    // Arrange & Act
    render(<Card title="Pending" value={3000} type="pending" />);

    // Assert
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
  });

  it("should render customers icon for customers type", () => {
    // Arrange & Act
    render(<Card title="Total Customers" value={10} type="customers" />);

    // Assert
    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
  });

  it("should render invoices icon for invoices type", () => {
    // Arrange & Act
    render(<Card title="Total Invoices" value={25} type="invoices" />);

    // Assert
    expect(screen.getByTestId("inbox-icon")).toBeInTheDocument();
  });

  it("should have proper card structure", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const card = container.querySelector("div.rounded-xl");
    expect(card).toHaveClass("bg-gray-50");
    expect(card).toHaveClass("shadow-sm");
  });

  it("should have proper header structure", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const header = container.querySelector("div.flex");
    expect(header).toHaveClass("p-4");
  });

  it("should have title with correct styling", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const title = screen.getByText("Collected");
    expect(title).toHaveClass("text-sm");
    expect(title).toHaveClass("font-medium");
  });

  it("should have icon with correct styling", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const icon = screen.getByTestId("banknotes-icon");
    const wrapper = icon.parentElement;
    expect(wrapper).toBeInTheDocument();
  });

  it("should have value with proper styling classes", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const valueElement = screen.getByText("5000");
    expect(valueElement).toHaveClass("text-2xl");
    expect(valueElement).toHaveClass("truncate");
    expect(valueElement).toHaveClass("px-4");
    expect(valueElement).toHaveClass("py-8");
  });

  it("should apply lusitana font to value", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const valueElement = screen.getByText("5000");
    expect(valueElement).toHaveClass("mock-lusitana");
  });

  it("should render zero value", () => {
    // Arrange & Act
    render(<Card title="Pending" value={0} type="pending" />);

    // Assert
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should render large numeric value", () => {
    // Arrange & Act
    render(<Card title="Collected" value={999999} type="collected" />);

    // Assert
    expect(screen.getByText("999999")).toBeInTheDocument();
  });

  it("should handle all card types", () => {
    // Arrange
    const types = ["collected", "pending", "invoices", "customers"] as const;

    // Act & Assert
    types.forEach((type) => {
      const { container } = render(
        <Card title={`Test ${type}`} value={100} type={type} />,
      );
      expect(screen.getByText(`Test ${type}`)).toBeInTheDocument();
    });
  });

  it("should have icon margin styling", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const title = screen.getByText("Collected");
    expect(title).toHaveClass("ml-2");
  });

  it("should have value with bg-white", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const valueElement = screen.getByText("5000");
    expect(valueElement).toHaveClass("bg-white");
  });

  it("should have value with rounded-xl", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const valueElement = screen.getByText("5000");
    expect(valueElement).toHaveClass("rounded-xl");
  });

  it("should display text center", () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Collected" value={5000} type="collected" />,
    );

    // Assert
    const valueElement = screen.getByText("5000");
    expect(valueElement).toHaveClass("text-center");
  });
});
