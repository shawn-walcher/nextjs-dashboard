import { render, screen } from "@testing-library/react";
import Breadcrumbs from "../breadcrumbs";

// Mock Next.js Link component
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockLink.displayName = "Link";
  return MockLink;
});

// Mock the fonts
jest.mock("@/app/ui/fonts", () => ({
  lusitana: {
    className: "mock-lusitana",
  },
}));

describe("Breadcrumbs Component", () => {
  it("should render navigation with breadcrumb label", () => {
    // Arrange
    const breadcrumbs = [{ label: "Home", href: "/" }];

    // Act
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("should render all breadcrumb items", () => {
    // Arrange
    const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Invoices", href: "/dashboard/invoices" },
      { label: "Create", href: "/dashboard/invoices/create" },
    ];

    // Act
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Invoices")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("should render links with correct hrefs", () => {
    // Arrange
    const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Invoices", href: "/dashboard/invoices" },
    ];

    // Act
    render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/dashboard/invoices");
  });

  it("should show separators between breadcrumb items", () => {
    // Arrange
    const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Invoices", href: "/dashboard/invoices" },
      { label: "Create", href: "/dashboard/invoices/create" },
    ];

    // Act
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const spans = container.querySelectorAll("span.mx-3");
    expect(spans).toHaveLength(2); // 3 items = 2 separators
    spans.forEach((span) => {
      expect(span.textContent).toBe("/");
    });
  });

  it("should not show separator after last breadcrumb", () => {
    // Arrange
    const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Final", href: "/final" },
    ];

    // Act
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const separators = container.querySelectorAll("span.mx-3");
    expect(separators).toHaveLength(1); // Only 1 separator between 2 items
  });

  it("should apply active styling to current page", () => {
    // Arrange
    const breadcrumbs = [
      { label: "Home", href: "/", active: false },
      { label: "Current", href: "/current", active: true },
    ];

    // Act
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const listItems = container.querySelectorAll("li");
    expect(listItems[0]).toHaveClass("text-gray-500");
    expect(listItems[1]).toHaveClass("text-gray-900");
  });

  it("should set aria-current attribute for active breadcrumb", () => {
    // Arrange
    const breadcrumbs = [
      { label: "Home", href: "/" },
      { label: "Current", href: "/current", active: true },
    ];

    // Act
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const listItems = container.querySelectorAll("li");
    expect(listItems[1]).toHaveAttribute("aria-current", "true");
  });

  it("should render empty breadcrumbs list", () => {
    // Arrange
    const breadcrumbs: any[] = [];

    // Act
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const ol = container.querySelector("ol");
    expect(ol?.children.length).toBe(0);
  });

  it("should render single breadcrumb without separator", () => {
    // Arrange
    const breadcrumbs = [{ label: "Home", href: "/" }];

    // Act
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const separators = container.querySelectorAll("span.mx-3");
    expect(separators).toHaveLength(0);
  });

  it("should apply lusitana font class to ol element", () => {
    // Arrange
    const breadcrumbs = [{ label: "Home", href: "/" }];

    // Act
    const { container } = render(<Breadcrumbs breadcrumbs={breadcrumbs} />);

    // Assert
    const ol = container.querySelector("ol");
    expect(ol).toHaveClass("mock-lusitana");
  });
});
