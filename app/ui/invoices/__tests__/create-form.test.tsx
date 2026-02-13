import React, { useActionState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateInvoiceForm from "../create-form";
import { CustomerField } from "@/app/lib/types/definitions";

// Mock Next.js Link component
jest.mock("next/link", () => {
  const MockedLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockedLink.displayName = "Link";
  return MockedLink;
});

// Mock hero icons
jest.mock("@heroicons/react/24/outline", () => ({
  UserCircleIcon: () => <span data-testid="user-icon">user-icon</span>,
  CurrencyDollarIcon: () => (
    <span data-testid="currency-icon">currency-icon</span>
  ),
  ClockIcon: () => <span data-testid="clock-icon">clock-icon</span>,
  CheckIcon: () => <span data-testid="check-icon">check-icon</span>,
}));

// Mock Button component
jest.mock("@/app/ui/button", () => ({
  Button: function MockButton({
    type,
    children,
    ...props
  }: {
    type: string;
    children: React.ReactNode;
  }) {
    return (
      <button type={type as "button" | "submit" | "reset"} {...props}>
        {children}
      </button>
    );
  },
}));

// Mock the createInvoice action
jest.mock("@/app/lib/actions", () => ({
  createInvoice: jest.fn(async () => ({ message: null, errors: {} })),
}));

const mockCustomers: CustomerField[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
];

describe("Create Invoice Form", () => {
  it("should render the form", () => {
    // Arrange & Act
    const { container } = render(
      <CreateInvoiceForm customers={mockCustomers} />,
    );

    // Assert
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
  });

  it("should render customer select dropdown", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });

  it("should render customer options", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const options = Array.from(select.options);
    const optionTexts = options.map((opt) => opt.text);
    expect(optionTexts).toContain("John Doe");
    expect(optionTexts).toContain("Jane Smith");
    expect(optionTexts).toContain("Bob Johnson");
  });

  it("should render amount input", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const input = screen.getByPlaceholderText("Enter USD amount");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("step", "0.01");
  });

  it("should render status radio buttons", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const pendingRadio = screen.getByDisplayValue("pending");
    const paidRadio = screen.getByDisplayValue("paid");
    expect(pendingRadio).toBeInTheDocument();
    expect(paidRadio).toBeInTheDocument();
  });

  it("should render pending and paid status labels", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const labels = screen.getAllByText(/Pending|Paid/);
    expect(labels.length).toBeGreaterThan(0);
  });

  it("should render status icons", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("should render customer icon", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
  });

  it("should render currency icon", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    expect(screen.getByTestId("currency-icon")).toBeInTheDocument();
  });

  it("should render cancel link", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const cancelLink = screen.getByRole("link", { name: /Cancel/i });
    expect(cancelLink).toHaveAttribute("href", "/dashboard/invoices");
  });

  it("should render create button", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const button = screen.getByRole("button", { name: /Create Invoice/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("should have customer dropdown with no default selection", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("");
  });

  it("should allow selecting a customer", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Act
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "1");

    // Assert
    expect((select as HTMLSelectElement).value).toBe("1");
  });

  it("should allow entering amount", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Act
    const input = screen.getByPlaceholderText("Enter USD amount");
    await user.type(input, "100");

    // Assert
    expect((input as HTMLInputElement).value).toBe("100");
  });

  it("should allow selecting pending status", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Act
    const pendingRadio = screen.getByDisplayValue("pending");
    await user.click(pendingRadio);

    // Assert
    expect((pendingRadio as HTMLInputElement).checked).toBe(true);
  });

  it("should allow selecting paid status", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Act
    const paidRadio = screen.getByDisplayValue("paid");
    await user.click(paidRadio);

    // Assert
    expect((paidRadio as HTMLInputElement).checked).toBe(true);
  });

  it("should have proper form structure", () => {
    // Arrange & Act
    const { container } = render(
      <CreateInvoiceForm customers={mockCustomers} />,
    );

    // Assert
    const form = container.querySelector("form") as HTMLFormElement;
    expect(form).toHaveAttribute("action");
  });

  it("should have customer error region with aria-live", () => {
    // Arrange & Act
    const { container } = render(
      <CreateInvoiceForm customers={mockCustomers} />,
    );

    // Assert
    const errorRegion = container.querySelector('[aria-live="polite"]');
    expect(errorRegion).toBeInTheDocument();
    expect(errorRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("should have amount error region with aria-live", () => {
    // Arrange & Act
    const { container } = render(
      <CreateInvoiceForm customers={mockCustomers} />,
    );

    // Assert
    const errorRegions = container.querySelectorAll('[aria-live="polite"]');
    expect(errorRegions.length).toBeGreaterThan(0);
  });

  it("should have status error region with aria-live", () => {
    // Arrange & Act
    const { container } = render(
      <CreateInvoiceForm customers={mockCustomers} />,
    );

    // Assert
    const errorRegions = container.querySelectorAll('[aria-live="polite"]');
    expect(errorRegions.length).toBeGreaterThan(1);
  });

  it("should render status fieldset", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const fieldset = screen.getByRole("group");
    expect(fieldset).toBeInTheDocument();
  });

  it("should render customer label", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    expect(screen.getByLabelText("Choose customer")).toBeInTheDocument();
  });

  it("should render amount label", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    expect(screen.getByLabelText("Choose an amount")).toBeInTheDocument();
  });

  it("should render status legend", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    expect(screen.getByText("Set the invoice status")).toBeInTheDocument();
  });

  it("should have customer select with id and name attributes", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select).toHaveAttribute("id", "customer");
    expect(select).toHaveAttribute("name", "customerId");
  });

  it("should have amount input with id and name attributes", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const input = screen.getByPlaceholderText(
      "Enter USD amount",
    ) as HTMLInputElement;
    expect(input).toHaveAttribute("id", "amount");
    expect(input).toHaveAttribute("name", "amount");
  });

  it("should have status radios with correct name", () => {
    // Arrange & Act
    render(<CreateInvoiceForm customers={mockCustomers} />);

    // Assert
    const pendingRadio = screen.getByDisplayValue(
      "pending",
    ) as HTMLInputElement;
    const paidRadio = screen.getByDisplayValue("paid") as HTMLInputElement;
    expect(pendingRadio).toHaveAttribute("name", "status");
    expect(paidRadio).toHaveAttribute("name", "status");
  });
});
