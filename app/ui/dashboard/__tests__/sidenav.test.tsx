import { render, screen } from "@testing-library/react";
import SideNav from "@/app/ui/dashboard/sidenav";

// Mock dependencies
jest.mock("@/app/lib/actions", () => ({
  logout: jest.fn(),
}));

jest.mock("@/app/ui/dashboard/nav-links", () => {
  return function NavLinksMock() {
    return <div data-testid="nav-links">NavLinks</div>;
  };
});

jest.mock("@/app/ui/acme-logo", () => {
  return function AcmeLogoMock() {
    return <div data-testid="acme-logo">ACME Logo</div>;
  };
});

jest.mock("next/link", () => {
  return function LinkMock({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} data-testid="logo-link">
        {children}
      </a>
    );
  };
});

jest.mock("@heroicons/react/24/outline", () => ({
  PowerIcon: () => <svg data-testid="power-icon">Power</svg>,
}));

describe("SideNav Component", () => {
  it("should render the component with all main elements", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    expect(screen.getByTestId("acme-logo")).toBeInTheDocument();
    expect(screen.getByTestId("nav-links")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /sign out/i,
      }),
    ).toBeInTheDocument();
  });

  it("should render ACME logo as a link to home", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const logoLink = screen.getByTestId("logo-link");
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("should render ACME logo component inside link", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const acmeLogo = screen.getByTestId("acme-logo");
    expect(acmeLogo).toBeInTheDocument();
  });

  it("should render NavLinks component for navigation", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const navLinks = screen.getByTestId("nav-links");
    expect(navLinks).toBeInTheDocument();
  });

  it("should render Sign Out button", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const signOutButton = screen.getByRole("button", {
      name: /sign out/i,
    });
    expect(signOutButton).toBeInTheDocument();
  });

  it("should render Power icon in Sign Out button", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const powerIcon = screen.getByTestId("power-icon");
    expect(powerIcon).toBeInTheDocument();
  });

  it("should have Sign Out button with proper styling", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const signOutButton = screen.getByRole("button", {
      name: /sign out/i,
    });
    expect(signOutButton).toHaveClass("flex");
    expect(signOutButton).toHaveClass("rounded-md");
    expect(signOutButton).toHaveClass("bg-gray-50");
    expect(signOutButton).toHaveClass("font-medium");
  });

  it("should have Sign Out button with hover effects", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const signOutButton = screen.getByRole("button", {
      name: /sign out/i,
    });
    expect(signOutButton).toHaveClass("hover:bg-sky-100");
    expect(signOutButton).toHaveClass("hover:text-blue-600");
  });

  it("should wrap Sign Out button in a form for server submission", () => {
    // Arrange & Act
    const { container } = render(<SideNav />);

    // Assert
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    const button = form?.querySelector("button");
    expect(button).toBeInTheDocument();
  });

  it("should have Sign Out text that is responsive", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const signOutButton = screen.getByRole("button", {
      name: /sign out/i,
    });
    // Text should be hidden on mobile and visible on md+
    const textElement = signOutButton.querySelector("div");
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass("hidden");
    expect(textElement).toHaveClass("md:block");
  });

  it("should render main container with flex layout", () => {
    // Arrange & Act
    const { container } = render(<SideNav />);

    // Assert
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("h-full");
    expect(mainDiv).toHaveClass("flex-col");
  });

  it("should have responsive padding on main container", () => {
    // Arrange & Act
    const { container } = render(<SideNav />);

    // Assert
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("px-3");
    expect(mainDiv).toHaveClass("py-4");
    expect(mainDiv).toHaveClass("md:px-2");
  });

  it("should have spacer div for desktop layout", () => {
    // Arrange & Act
    const { container } = render(<SideNav />);

    // Assert
    const spacers = container.querySelectorAll(".hidden.h-auto.w-full.grow");
    expect(spacers.length).toBeGreaterThan(0);
    const spacer = spacers[0] as HTMLElement;
    expect(spacer).toHaveClass("rounded-md");
    expect(spacer).toHaveClass("bg-gray-50");
    expect(spacer).toHaveClass("md:block");
  });

  it("should have responsive button section", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert
    const signOutButton = screen.getByRole("button", {
      name: /sign out/i,
    });
    expect(signOutButton).toHaveClass("md:flex-none");
    expect(signOutButton).toHaveClass("md:justify-start");
  });

  it("should include all three main navigation sections", () => {
    // Arrange & Act
    render(<SideNav />);

    // Assert - Logo, NavLinks, and Button
    expect(screen.getByTestId("logo-link")).toBeInTheDocument(); // Logo section
    expect(screen.getByTestId("nav-links")).toBeInTheDocument(); // Middle nav section
    expect(
      screen.getByRole("button", {
        name: /sign out/i,
      }),
    ).toBeInTheDocument(); // Sign out section
  });
});
