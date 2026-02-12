import React from "react";
import { render, screen } from "@testing-library/react";
import CustomersTable from "../table";
import { FormattedCustomersTable } from "@/app/lib/definitions";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-testid="customer-image"
    />
  ),
}));

const mockCustomers: FormattedCustomersTable[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image_url: "/john.jpg",
    total_invoices: 5,
    total_pending: "1000",
    total_paid: "2000",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    image_url: "/jane.jpg",
    total_invoices: 3,
    total_pending: "500",
    total_paid: "1500",
  },
];

describe("CustomersTable Component", () => {
  it("should render customers table", async () => {
    // Arrange & Act
    const { container } = render(
      await CustomersTable({ customers: mockCustomers }),
    );

    // Assert
    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();
  });

  it("should render table headers", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Total Invoices")).toBeInTheDocument();
    expect(screen.getByText("Total Pending")).toBeInTheDocument();
    expect(screen.getByText("Total Paid")).toBeInTheDocument();
  });

  it("should render all customers", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    const nameElements = screen.getAllByText(/John Doe|Jane Smith/);
    expect(nameElements.length).toBeGreaterThan(0);
  });

  it("should render customer names in table rows", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    const nameElements = screen.getAllByText(/Doe|Smith/);
    expect(nameElements.length).toBeGreaterThan(0);
  });

  it("should render customer emails", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    const emails = screen.getAllByText(/example.com/);
    expect(emails.length).toBeGreaterThan(0);
  });

  it("should render total invoices count", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render total pending amounts", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    const amounts = screen.getAllByText(/1000|500/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it("should render total paid amounts", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    const amounts = screen.getAllByText(/2000|1500/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it("should render customer images", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    const images = screen.getAllByTestId("customer-image");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should have correct container structure", async () => {
    // Arrange & Act
    const { container } = render(
      await CustomersTable({ customers: mockCustomers }),
    );

    // Assert
    const flowRoot = container.querySelector("div.flow-root");
    expect(flowRoot).toBeInTheDocument();
  });

  it("should have responsive table layout", async () => {
    // Arrange & Act
    const { container } = render(
      await CustomersTable({ customers: mockCustomers }),
    );

    // Assert
    const mobileDiv = container.querySelector("div.md\\:hidden");
    expect(mobileDiv).toBeInTheDocument();
  });

  it("should render mobile cards for each customer", async () => {
    // Arrange & Act
    const { container } = render(
      await CustomersTable({ customers: mockCustomers }),
    );

    // Assert
    const mobileCards = container.querySelectorAll(
      "div.md\\:hidden > div.mb-2",
    );
    expect(mobileCards.length).toBe(2);
  });

  it("should render table with correct styling classes", async () => {
    // Arrange & Act
    const { container } = render(
      await CustomersTable({ customers: mockCustomers }),
    );

    // Assert
    const table = container.querySelector("table");
    expect(table).toHaveClass("hidden");
    expect(table).toHaveClass("md:table");
    expect(table).toHaveClass("text-gray-900");
  });

  it("should handle empty customer list", async () => {
    // Arrange & Act
    const { container } = render(await CustomersTable({ customers: [] }));

    // Assert
    const tbody = container.querySelector("tbody");
    expect(tbody?.children.length).toBe(0);
  });

  it("should render customer names with images in mobile view", async () => {
    // Arrange & Act
    const { container } = render(
      await CustomersTable({ customers: mockCustomers }),
    );

    // Assert
    const images = screen.getAllByTestId("customer-image");
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it("should display pending and paid amounts in mobile cards", async () => {
    // Arrange & Act
    const { container } = render(
      await CustomersTable({ customers: mockCustomers }),
    );

    // Assert
    const pendingLabels = container.querySelectorAll("p");
    const pendingCount = Array.from(pendingLabels).filter(
      (label) => label.textContent === "Pending",
    ).length;
    expect(pendingCount).toBeGreaterThan(0);
  });

  it("should show invoice count in mobile cards", async () => {
    // Arrange & Act
    render(await CustomersTable({ customers: mockCustomers }));

    // Assert
    const invoiceTexts = screen.getAllByText(/invoices/);
    expect(invoiceTexts.length).toBeGreaterThan(0);
  });
});
