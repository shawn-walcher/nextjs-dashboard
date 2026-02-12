import React from "react";
import { render, screen } from "@testing-library/react";
import InvoicesTable from "../table";

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
      data-testid="invoice-image"
    />
  ),
}));

// Mock the data fetching function
jest.mock("@/app/lib/data", () => ({
  fetchFilteredInvoices: jest.fn(async (query: string, currentPage: number) => [
    {
      id: "1",
      customer_id: "cust-1",
      amount: 5000,
      status: "paid",
      date: "2024-01-15",
      name: "John Doe",
      email: "john@example.com",
      image_url: "/john.jpg",
    },
    {
      id: "2",
      customer_id: "cust-2",
      amount: 3000,
      status: "pending",
      date: "2024-01-10",
      name: "Jane Smith",
      email: "jane@example.com",
      image_url: "/jane.jpg",
    },
  ]),
}));

// Mock the UpdateInvoice and DeleteInvoice buttons
jest.mock("@/app/ui/invoices/buttons", () => ({
  UpdateInvoice: ({ id }: { id: string }) => (
    <a href={`/edit/${id}`} data-testid={`update-${id}`}>
      Edit
    </a>
  ),
  DeleteInvoice: ({ id }: { id: string }) => (
    <button data-testid={`delete-${id}`}>Delete</button>
  ),
}));

// Mock the InvoiceStatus component
jest.mock("@/app/ui/invoices/status", () => {
  return function DummyStatus({ status }: { status: string }) {
    return <span data-testid="invoice-status">{status}</span>;
  };
});

// Mock the utility functions
jest.mock("@/app/lib/utils", () => ({
  formatDateToLocal: jest.fn((date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US");
  }),
  formatCurrency: jest.fn((cents: number) => `$${(cents / 100).toFixed(2)}`),
}));

describe("InvoicesTable Component", () => {
  it("should render invoices table", async () => {
    // Arrange & Act
    const { container } = render(
      await InvoicesTable({ query: "", currentPage: 1 }),
    );

    // Assert
    const table = container.querySelector("table");
    expect(table).toBeInTheDocument();
  });

  it("should render table headers", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("should render all invoices", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const doe = screen.getAllByText("John Doe");
    expect(doe.length).toBeGreaterThan(0);
    const smith = screen.getAllByText("Jane Smith");
    expect(smith.length).toBeGreaterThan(0);
  });

  it("should render customer names in table rows", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const nameElements = screen.getAllByText(/Doe|Smith/);
    expect(nameElements.length).toBeGreaterThan(0);
  });

  it("should render customer emails", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const email1 = screen.getAllByText("john@example.com");
    expect(email1.length).toBeGreaterThan(0);
    const email2 = screen.getAllByText("jane@example.com");
    expect(email2.length).toBeGreaterThan(0);
  });

  it("should render formatted currency amounts", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const amounts = screen.getAllByText("$50.00");
    expect(amounts.length).toBeGreaterThan(0);
    const amounts2 = screen.getAllByText("$30.00");
    expect(amounts2.length).toBeGreaterThan(0);
  });

  it("should render invoice statuses", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const statusElements = screen.getAllByTestId("invoice-status");
    expect(statusElements.length).toBe(4); // 2 mobile + 2 desktop
  });

  it("should render customer images", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const images = screen.getAllByTestId("invoice-image");
    expect(images.length).toBeGreaterThan(0);
  });

  it("should render update buttons for each invoice", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const update1 = screen.getAllByTestId("update-1");
    expect(update1.length).toBe(2); // Mobile + Desktop
    const update2 = screen.getAllByTestId("update-2");
    expect(update2.length).toBe(2); // Mobile + Desktop
  });

  it("should render delete buttons for each invoice", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const delete1 = screen.getAllByTestId("delete-1");
    expect(delete1.length).toBe(2); // Mobile + Desktop
    const delete2 = screen.getAllByTestId("delete-2");
    expect(delete2.length).toBe(2); // Mobile + Desktop
  });

  it("should have correct container structure", async () => {
    // Arrange & Act
    const { container } = render(
      await InvoicesTable({ query: "", currentPage: 1 }),
    );

    // Assert
    const flowRoot = container.querySelector("div.flow-root");
    expect(flowRoot).toBeInTheDocument();
  });

  it("should have responsive table layout", async () => {
    // Arrange & Act
    const { container } = render(
      await InvoicesTable({ query: "", currentPage: 1 }),
    );

    // Assert
    const mobileDiv = container.querySelector("div.md\\:hidden");
    expect(mobileDiv).toBeInTheDocument();
  });

  it("should pass query parameter to data fetching", async () => {
    // Arrange
    const { fetchFilteredInvoices } = require("@/app/lib/data");
    fetchFilteredInvoices.mockClear();

    // Act
    await InvoicesTable({ query: "john", currentPage: 1 });

    // Assert
    expect(fetchFilteredInvoices).toHaveBeenCalledWith("john", 1);
  });

  it("should pass pagination parameter to data fetching", async () => {
    // Arrange
    const { fetchFilteredInvoices } = require("@/app/lib/data");
    fetchFilteredInvoices.mockClear();

    // Act
    await InvoicesTable({ query: "", currentPage: 2 });

    // Assert
    expect(fetchFilteredInvoices).toHaveBeenCalledWith("", 2);
  });

  it("should handle empty invoice list", async () => {
    // Arrange
    const { fetchFilteredInvoices } = require("@/app/lib/data");
    fetchFilteredInvoices.mockResolvedValueOnce([]);

    // Act
    const { container } = render(
      await InvoicesTable({ query: "", currentPage: 1 }),
    );

    // Assert
    const tbody = container.querySelector("tbody");
    expect(tbody?.children.length).toBe(0);
  });

  it("should render table with correct styling classes", async () => {
    // Arrange & Act
    const { container } = render(
      await InvoicesTable({ query: "", currentPage: 1 }),
    );

    // Assert
    const table = container.querySelector("table");
    expect(table).toHaveClass("hidden");
    expect(table).toHaveClass("md:table");
    expect(table).toHaveClass("text-gray-900");
  });

  it("should format dates for display", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const { formatDateToLocal } = require("@/app/lib/utils");
    expect(formatDateToLocal).toHaveBeenCalled();
  });

  it("should format currency for display", async () => {
    // Arrange & Act
    render(await InvoicesTable({ query: "", currentPage: 1 }));

    // Assert
    const { formatCurrency } = require("@/app/lib/utils");
    expect(formatCurrency).toHaveBeenCalled();
  });
});
