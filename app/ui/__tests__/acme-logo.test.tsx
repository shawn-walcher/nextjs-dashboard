import React from "react";
import { render, screen } from "@testing-library/react";
import AcmeLogo from "../acme-logo";

// Mock the heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  GlobeAltIcon: () => <div data-testid="globe-icon">Globe Icon</div>,
}));

// Mock the fonts
jest.mock("@/app/ui/fonts", () => ({
  lusitana: {
    className: "mock-lusitana",
  },
}));

describe("AcmeLogo Component", () => {
  it("should render the logo with text", () => {
    // Arrange & Act
    render(<AcmeLogo />);

    // Assert
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("should render the globe icon", () => {
    // Arrange & Act
    render(<AcmeLogo />);

    // Assert
    expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
  });

  it("should have correct container classes", () => {
    // Arrange & Act
    const { container } = render(<AcmeLogo />);

    // Assert
    const logoContainer = container.querySelector("div");
    expect(logoContainer).toHaveClass("flex");
    expect(logoContainer).toHaveClass("flex-row");
    expect(logoContainer).toHaveClass("items-center");
    expect(logoContainer).toHaveClass("leading-none");
    expect(logoContainer).toHaveClass("text-white");
  });

  it("should apply lusitana font className", () => {
    // Arrange & Act
    const { container } = render(<AcmeLogo />);

    // Assert
    const logoContainer = container.querySelector("div");
    expect(logoContainer).toHaveClass("mock-lusitana");
  });

  it("should render text with correct classes", () => {
    // Arrange & Act
    const { container } = render(<AcmeLogo />);

    // Assert
    const textElement = container.querySelector("p");
    expect(textElement).toHaveClass("text-[44px]");
  });
});
