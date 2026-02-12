import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditInvoiceForm from "../edit-form";
import { CustomerField, InvoiceForm } from "@/app/lib/definitions";

// Mock Next.js Link component
jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "Link";
  return MockLink;
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
    type: "submit" | "reset" | "button";
    children: React.ReactNode;
  }) {
    return (
      <button type={type} {...props}>
        {children}
      </button>
    );
  },
}));

// Mock the updateInvoice action
jest.mock("@/app/lib/actions", () => ({
  updateInvoice: jest.fn(async () => ({ message: null, errors: {} })),
}));

const mockCustomers: CustomerField[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
];

const mockInvoice: InvoiceForm = {
  id: "invoice-1",
  customer_id: "1",
  amount: 5000,
  status: "pending",
};

describe("Edit Invoice Form", () => {
  it("should render the form", () => {
    // Arrange & Act
    const { container } = render(
      <EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />,
    );

    // Assert
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
  });

  it("should render customer select dropdown", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });

  it("should set customer dropdown to invoice customer_id", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("1");
  });

  it("should render customer options", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const options = Array.from(select.options);
    const optionTexts = options.map((opt) => opt.text);
    expect(optionTexts).toContain("John Doe");
    expect(optionTexts).toContain("Jane Smith");
    expect(optionTexts).toContain("Bob Johnson");
  });

  it("should render amount input with default value", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const input = screen.getByPlaceholderText(
      "Enter USD amount",
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("5000");
  });

  it("should render status radio with correct default", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const pendingRadio = screen.getByDisplayValue(
      "pending",
    ) as HTMLInputElement;
    const paidRadio = screen.getByDisplayValue("paid") as HTMLInputElement;
    expect(pendingRadio.checked).toBe(true);
    expect(paidRadio.checked).toBe(false);
  });

  it("should render paid status as default when invoice status is paid", () => {
    // Arrange
    const paidInvoice: InvoiceForm = { ...mockInvoice, status: "paid" };

    // Act
    render(<EditInvoiceForm invoice={paidInvoice} customers={mockCustomers} />);

    // Assert
    const pendingRadio = screen.getByDisplayValue(
      "pending",
    ) as HTMLInputElement;
    const paidRadio = screen.getByDisplayValue("paid") as HTMLInputElement;
    expect(pendingRadio.checked).toBe(false);
    expect(paidRadio.checked).toBe(true);
  });

  it("should render cancel link", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const cancelLink = screen.getByRole("link", { name: /Cancel/i });
    expect(cancelLink).toHaveAttribute("href", "/dashboard/invoices");
  });

  it("should render edit button", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const button = screen.getByRole("button", { name: /Edit Invoice/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "submit");
  });

  it("should render customer label", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    expect(screen.getByLabelText("Choose customer")).toBeInTheDocument();
  });

  it("should render amount label", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    expect(screen.getByLabelText("Choose an amount")).toBeInTheDocument();
  });

  it("should render status legend", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    expect(screen.getByText("Set the invoice status")).toBeInTheDocument();
  });

  it("should render customer icon", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
  });

  it("should render currency icon", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    expect(screen.getByTestId("currency-icon")).toBeInTheDocument();
  });

  it("should render status icons", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("should allow changing customer selection", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Act
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "2");

    // Assert
    expect((select as HTMLSelectElement).value).toBe("2");
  });

  it("should allow changing amount", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Act
    const input = screen.getByPlaceholderText("Enter USD amount");
    await user.clear(input);
    await user.type(input, "7500");

    // Assert
    expect((input as HTMLInputElement).value).toBe("7500");
  });

  it("should allow changing status to paid", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Act
    const paidRadio = screen.getByDisplayValue("paid");
    await user.click(paidRadio);

    // Assert
    expect((paidRadio as HTMLInputElement).checked).toBe(true);
  });

  it("should have proper form structure", () => {
    // Arrange & Act
    const { container } = render(
      <EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />,
    );

    // Assert
    const form = container.querySelector("form") as HTMLFormElement;
    expect(form).toHaveAttribute("action");
  });

  it("should have customer error region with aria-live", () => {
    // Arrange & Act
    const { container } = render(
      <EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />,
    );

    // Assert
    const errorRegion = container.querySelector('[aria-live="polite"]');
    expect(errorRegion).toBeInTheDocument();
    expect(errorRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("should have multiple error regions with aria-live", () => {
    // Arrange & Act
    const { container } = render(
      <EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />,
    );

    // Assert
    const errorRegions = container.querySelectorAll('[aria-live="polite"]');
    expect(errorRegions.length).toBeGreaterThan(1);
  });

  it("should render status fieldset", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const fieldset = screen.getByRole("group");
    expect(fieldset).toBeInTheDocument();
  });

  it("should have customer select with correct id and name", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select).toHaveAttribute("id", "customer");
    expect(select).toHaveAttribute("name", "customerId");
  });

  it("should have amount input with correct id and name", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const input = screen.getByPlaceholderText(
      "Enter USD amount",
    ) as HTMLInputElement;
    expect(input).toHaveAttribute("id", "amount");
    expect(input).toHaveAttribute("name", "amount");
  });

  it("should have status radios with name status", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const pendingRadio = screen.getByDisplayValue(
      "pending",
    ) as HTMLInputElement;
    const paidRadio = screen.getByDisplayValue("paid") as HTMLInputElement;
    expect(pendingRadio).toHaveAttribute("name", "status");
    expect(paidRadio).toHaveAttribute("name", "status");
  });

  it("should have amount input with number type", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const input = screen.getByPlaceholderText(
      "Enter USD amount",
    ) as HTMLInputElement;
    expect(input).toHaveAttribute("type", "number");
  });

  it("should have amount input with step 0.01", () => {
    // Arrange & Act
    render(<EditInvoiceForm invoice={mockInvoice} customers={mockCustomers} />);

    // Assert
    const input = screen.getByPlaceholderText(
      "Enter USD amount",
    ) as HTMLInputElement;
    expect(input).toHaveAttribute("step", "0.01");
  });
});
