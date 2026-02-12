import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button Component", () => {
  it("should render button with children text", () => {
    // Arrange & Act
    render(<Button>Click me</Button>);

    // Assert
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("should apply custom className to button", () => {
    // Arrange
    const customClass = "custom-class";

    // Act
    render(<Button className={customClass}>Custom</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toHaveClass(customClass);
  });

  it("should handle click events", () => {
    // Arrange
    const handleClick = jest.fn();

    // Act
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should support disabled state", () => {
    // Arrange
    const handleClick = jest.fn();

    // Act
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Assert
    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should support aria-disabled attribute", () => {
    // Arrange & Act
    render(<Button aria-disabled="true">Disabled</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("should support type attribute", () => {
    // Arrange & Act
    render(<Button type="submit">Submit</Button>);

    // Assert
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("should pass through other HTML attributes", () => {
    // Arrange & Act
    render(
      <Button data-testid="custom-button" title="Test Title">
        Button
      </Button>,
    );

    // Assert
    const button = screen.getByTestId("custom-button");
    expect(button).toHaveAttribute("title", "Test Title");
  });

  it("should render with default className", () => {
    // Arrange & Act
    render(<Button>Default</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toHaveClass("flex");
    expect(button).toHaveClass("h-10");
    expect(button).toHaveClass("bg-blue-500");
  });

  it("should merge custom className with default styles", () => {
    // Arrange & Act
    render(<Button className="extra-class">Merged</Button>);

    // Assert
    const button = screen.getByRole("button");
    expect(button).toHaveClass("extra-class");
    expect(button).toHaveClass("bg-blue-500");
  });
});
