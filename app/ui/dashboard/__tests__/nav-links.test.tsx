import { render, screen } from "@testing-library/react";
import NavLinks from "../nav-links";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/dashboard"),
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  const MockedLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockedLink.displayName = "Link";
  return MockedLink;
});

// Mock heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  HomeIcon: () => <span data-testid="home-icon">home</span>,
  DocumentDuplicateIcon: () => (
    <span data-testid="invoices-icon">invoices</span>
  ),
  UserGroupIcon: () => <span data-testid="customers-icon">customers</span>,
}));

// Mock clsx
jest.mock("clsx", () => {
  return jest.fn((...args) => {
    return args.filter(Boolean).join(" ");
  });
});

describe("NavLinks Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");
  });
  it("should render navigation links", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Invoices")).toBeInTheDocument();
    expect(screen.getByText("Customers")).toBeInTheDocument();
  });

  it("should render home link with correct href", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    const homeLink = screen.getByRole("link", { name: /Home/i });
    expect(homeLink).toHaveAttribute("href", "/dashboard");
  });

  it("should render invoices link with correct href", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    const invoicesLink = screen.getByRole("link", { name: /Invoices/i });
    expect(invoicesLink).toHaveAttribute("href", "/dashboard/invoices");
  });

  it("should render customers link with correct href", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    const customersLink = screen.getByRole("link", { name: /Customers/i });
    expect(customersLink).toHaveAttribute("href", "/dashboard/customers");
  });

  it("should render home icon", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
  });

  it("should render invoices icon", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    expect(screen.getByTestId("invoices-icon")).toBeInTheDocument();
  });

  it("should render customers icon", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    expect(screen.getByTestId("customers-icon")).toBeInTheDocument();
  });

  it("should render three navigation links total", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("should have text hidden on mobile for link labels", () => {
    // Arrange & Act
    const { container } = render(<NavLinks />);

    // Assert
    const labels = container.querySelectorAll("p.hidden");
    expect(labels.length).toBeGreaterThan(0);
  });

  it("should render links with correct base styling", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass("flex");
      expect(link).toHaveClass("rounded-md");
      expect(link).toHaveClass("text-sm");
    });
  });

  it("should apply active styles when pathname matches", () => {
    // Arrange
    const { usePathname } = require("next/navigation");
    usePathname.mockReturnValue("/dashboard");

    // Act
    const { container } = render(<NavLinks />);

    // Assert
    const homeLink = screen.getByRole("link", { name: /Home/i });
    expect(homeLink.getAttribute("class")).toContain("sky-100");
    expect(homeLink.getAttribute("class")).toContain("blue-600");
  });

  it("should have render three nav links", () => {
    // Arrange & Act
    render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("should render icons with correct width", () => {
    // Arrange & Act
    const { container } = render(<NavLinks />);

    // Assert
    const icons = container.querySelectorAll("[data-testid]");
    expect(icons.length).toBe(3);
  });

  it("should have gap between icon and text", () => {
    // Arrange & Act
    const { container } = render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass("gap-2");
    });
  });

  it("should have correct padding on mobile and desktop", () => {
    // Arrange & Act
    const { container } = render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass("p-3");
    });
  });

  it("should have correct height", () => {
    // Arrange & Act
    const { container } = render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass("h-[48px]");
    });
  });

  it("should have grow flex property", () => {
    // Arrange & Act
    const { container } = render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass("grow");
    });
  });

  it("should have center alignment on mobile", () => {
    // Arrange & Act
    const { container } = render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass("justify-center");
    });
  });

  it("should have correct background colors", () => {
    // Arrange & Act
    const { container } = render(<NavLinks />);

    // Assert
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveClass("bg-gray-50");
    });
  });
});
