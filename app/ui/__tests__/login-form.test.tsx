import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../login-form";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
}));

// Mock the authenticate action
jest.mock("@/app/lib/actions", () => ({
  authenticate: jest.fn(),
}));

// Mock the Button component
jest.mock("@/app/ui/button", () => ({
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

// Mock fonts
jest.mock("@/app/ui/fonts", () => ({
  lusitana: {
    className: "mock-lusitana",
  },
}));

// Mock React for useActionState
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useActionState: jest.fn((action, initialState) => [
      undefined,
      jest.fn(),
      false,
    ]),
  };
});

// Mock heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  AtSymbolIcon: () => <div data-testid="at-symbol">Email Icon</div>,
  KeyIcon: () => <div data-testid="key-icon">Key Icon</div>,
  ExclamationCircleIcon: () => (
    <div data-testid="exclamation-icon">Error Icon</div>
  ),
}));

jest.mock("@heroicons/react/20/solid", () => ({
  ArrowRightIcon: () => <div data-testid="arrow-icon">Arrow Icon</div>,
}));

describe("LoginForm Component", () => {
  it("should render login form", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    expect(screen.getByText("Please log in to continue.")).toBeInTheDocument();
  });

  it("should render email input field", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.type).toBe("email");
    expect(emailInput.name).toBe("email");
  });

  it("should render password input field", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.type).toBe("password");
    expect(passwordInput.name).toBe("password");
  });

  it("should render login button", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const button = screen.getByRole("button", { name: /log in/i });
    expect(button).toBeInTheDocument();
  });

  it("should render email icon", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    expect(screen.getByTestId("at-symbol")).toBeInTheDocument();
  });

  it("should render key icon for password", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    expect(screen.getByTestId("key-icon")).toBeInTheDocument();
  });

  it("should render arrow icon in button", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
  });

  it("should require email field", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput.required).toBe(true);
  });

  it("should require password field", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;
    expect(passwordInput.required).toBe(true);
  });

  it("should enforce minimum password length", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;
    expect(passwordInput.minLength).toBe(6);
  });

  it("should have correct email placeholder", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const emailInput = screen.getByPlaceholderText(/enter your email address/i);
    expect(emailInput).toBeInTheDocument();
  });

  it("should have correct password placeholder", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it("should have live region for error messages", () => {
    // Arrange & Act
    const { container } = render(<LoginForm />);

    // Assert
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("should have form element", () => {
    // Arrange & Act
    const { container } = render(<LoginForm />);

    // Assert
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
  });

  it("should have hidden redirectTo field", () => {
    // Arrange & Act
    const { container } = render(<LoginForm />);

    // Assert
    const hiddenInput = container.querySelector(
      'input[type="hidden"][name="redirectTo"]',
    ) as HTMLInputElement;
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput.value).toBe("/dashboard");
  });

  it("should apply lusitana font to heading", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const heading = screen.getByText("Please log in to continue.");
    expect(heading).toHaveClass("mock-lusitana");
  });

  it("should render structured form layout", () => {
    // Arrange & Act
    const { container } = render(<LoginForm />);

    // Assert
    const formContainer = container.querySelector("div.rounded-lg");
    expect(formContainer).toBeInTheDocument();
    expect(formContainer).toHaveClass("bg-gray-50");
  });

  it("should have correct spacing classes on form", () => {
    // Arrange & Act
    const { container } = render(<LoginForm />);

    // Assert
    const form = container.querySelector("form");
    expect(form).toHaveClass("space-y-3");
  });

  it("should use button component for login", () => {
    // Arrange & Act
    render(<LoginForm />);

    // Assert
    const button = screen.getByRole("button", { name: /log in/i });
    expect(button).toHaveClass("mt-4");
    expect(button).toHaveClass("w-full");
  });
});
