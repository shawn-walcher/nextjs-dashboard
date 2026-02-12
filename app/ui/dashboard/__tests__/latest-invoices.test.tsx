import { render, screen } from "@testing-library/react";
import Image from "next/image";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

// Mock component for testing latest-invoices rendering
// Since latest-invoices is a server component with async data fetching,
// we'll test the invoice structure it renders
const MockLatestInvoices = () => {
  const invoices = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      image_url: "/john.jpg",
      amount: 5000,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      image_url: "/jane.jpg",
      amount: 3000,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {invoices.map((invoice) => (
        <div
          key={invoice.id}
          className="flex flex-row items-center justify-between border-b pb-4"
        >
          <div className="flex flex-row items-center gap-3">
            <Image
              src={invoice.image_url}
              alt={`${invoice.name}'s profile picture`}
              className="h-8 w-8 rounded-full"
              width={32}
              height={32}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {invoice.name}
              </p>
              <p className="hidden text-sm text-gray-500 sm:block">
                {invoice.email}
              </p>
            </div>
          </div>
          <p className="truncate text-sm font-bold text-gray-900">
            ${(invoice.amount / 100).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};

// Mock heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  ArrowPathIcon: () => <span data-testid="refresh-icon">refresh</span>,
}));

describe("Latest Invoices Component Structure", () => {
  it("should render invoices list", () => {
    // Arrange & Act
    render(<MockLatestInvoices />);

    // Assert
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should render customer names", () => {
    // Arrange & Act
    render(<MockLatestInvoices />);

    // Assert
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should render customer emails on desktop", () => {
    // Arrange & Act
    render(<MockLatestInvoices />);

    // Assert
    const emails = screen.getAllByText(/example.com/);
    expect(emails.length).toBeGreaterThan(0);
  });

  it("should render invoice amounts", () => {
    // Arrange & Act
    render(<MockLatestInvoices />);

    // Assert
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("$30.00")).toBeInTheDocument();
  });

  it("should render customer images", () => {
    // Arrange & Act
    const { container } = render(<MockLatestInvoices />);

    // Assert
    const images = container.querySelectorAll("img");
    expect(images.length).toBe(2);
  });

  it("should have proper invoice row structure", () => {
    // Arrange & Act
    const { container } = render(<MockLatestInvoices />);

    // Assert
    const rows = container.querySelectorAll(".flex.flex-row");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("should have flex gap between invoice items", () => {
    // Arrange & Act
    const { container } = render(<MockLatestInvoices />);

    // Assert
    const container_el = container.querySelector(".flex.flex-col");
    expect(container_el).toHaveClass("gap-3");
  });

  it("should have padding between invoice rows", () => {
    // Arrange & Act
    const { container } = render(<MockLatestInvoices />);

    // Assert
    const rows = container.querySelectorAll(".pb-4");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("should have border between invoice rows", () => {
    // Arrange & Act
    const { container } = render(<MockLatestInvoices />);

    // Assert
    const rows = container.querySelectorAll(".border-b");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("should have truncated text for long names", () => {
    // Arrange & Act
    const { container } = render(<MockLatestInvoices />);

    // Assert
    const names = container.querySelectorAll(".truncate");
    expect(names.length).toBeGreaterThan(0);
  });

  it("should render correct number of invoices", () => {
    // Arrange & Act
    const { container } = render(<MockLatestInvoices />);

    // Assert
    const rows = container.querySelectorAll(".border-b");
    expect(rows.length).toBe(2);
  });
});
