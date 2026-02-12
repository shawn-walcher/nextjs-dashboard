import React from "react";
import { render, screen } from "@testing-library/react";
import Pagination from "../pagination";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/invoices",
  useSearchParams: () => new URLSearchParams("page=1"),
}));

// Mock Link component
jest.mock("next/link", () => {
  const MockedLink = ({ children, href }: any) => <a href={href}>{children}</a>;
  MockedLink.displayName = "Link";
  return MockedLink;
});

// Mock heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  ArrowLeftIcon: () => <div data-testid="arrow-left-icon">Left</div>,
  ArrowRightIcon: () => <div data-testid="arrow-right-icon">Right</div>,
}));

// Mock the utils module to provide generatePagination
jest.mock("@/app/lib/utils", () => ({
  generatePagination: jest.fn((currentPage: number, totalPages: number) => {
    // Simple implementation for testing
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }),
}));

describe("Pagination Component", () => {
  it("should render pagination controls", () => {
    // Arrange & Act
    const { container } = render(<Pagination totalPages={5} />);

    // Assert
    const inlineFlex = container.querySelector("div.inline-flex");
    expect(inlineFlex).toBeInTheDocument();
  });

  it("should render left and right arrow buttons", () => {
    // Arrange & Act
    render(<Pagination totalPages={5} />);

    // Assert
    expect(screen.getAllByTestId("arrow-left-icon")).toHaveLength(1);
    expect(screen.getAllByTestId("arrow-right-icon")).toHaveLength(1);
  });

  it("should render page numbers for total pages", () => {
    // Arrange & Act
    render(<Pagination totalPages={5} />);

    // Assert
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should disable left arrow on first page", () => {
    // Arrange & Act
    const { container } = render(<Pagination totalPages={5} />);

    // Assert - First div (left arrow) should have pointer-events-none and text-gray-300
    const divs = container.querySelectorAll("div.flex.h-10.w-10");
    const leftArrow = divs[0]; // First arrow is left
    expect(leftArrow).toHaveClass("pointer-events-none");
    expect(leftArrow).toHaveClass("text-gray-300");
  });

  it("should have right arrow enabled on first page", () => {
    // Arrange & Act
    const { container } = render(<Pagination totalPages={5} />);

    // Assert
    const links = screen.getAllByRole("link");
    // One of the links should be the right arrow next page link
    const rightArrowLink = links.find((link) =>
      link.getAttribute("href")?.includes("page=2"),
    );
    expect(rightArrowLink).toBeInTheDocument();
  });

  it("should render ellipsis for large page numbers", () => {
    // Arrange & Act
    render(<Pagination totalPages={50} />);

    // Assert
    expect(screen.getByText("...")).toBeInTheDocument();
  });

  it("should create correct page URLs", () => {
    // Arrange & Act
    const { container } = render(<Pagination totalPages={5} />);

    // Assert
    const pageLinks = screen.getAllByRole("link");
    const page2Link = pageLinks.find((link) =>
      link.getAttribute("href")?.includes("page=2"),
    );
    expect(page2Link?.getAttribute("href")).toContain("page=2");
  });

  it("should render with single page", () => {
    // Arrange & Act
    render(<Pagination totalPages={1} />);

    // Assert
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should handle zero total pages", () => {
    // Arrange & Act
    const { container } = render(<Pagination totalPages={0} />);

    // Assert - Should render empty or just the arrows
    const divs = container.querySelectorAll("div.flex.h-10.w-10");
    expect(divs.length).toBeGreaterThanOrEqual(2); // At least left and right arrows
  });
});
