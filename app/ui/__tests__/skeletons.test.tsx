import React from "react";
import { render, screen } from "@testing-library/react";
import {
  CardSkeleton,
  CardsSkeleton,
  RevenueChartSkeleton,
  InvoiceSkeleton,
  LatestInvoicesSkeleton,
  TableRowSkeleton,
  InvoicesMobileSkeleton,
  InvoicesTableSkeleton,
  CustomerTableRowSkeleton,
  CustomersMobileSkeleton,
  CustomersTableSkeleton,
  SearchSkeleton,
} from "../skeletons";
import DashboardSkeleton from "../skeletons";

describe("Skeleton Components", () => {
  describe("CardSkeleton", () => {
    it("should render card skeleton with container", () => {
      // Arrange & Act
      const { container } = render(<CardSkeleton />);

      // Assert
      const outerDiv = container.querySelector("div");
      expect(outerDiv).toBeInTheDocument();
      expect(outerDiv).toHaveClass("rounded-xl");
    });

    it("should have shimmer animation classes", () => {
      // Arrange & Act
      const { container } = render(<CardSkeleton />);

      // Assert
      const outerDiv = container.querySelector("div");
      const className = outerDiv?.className;
      expect(className).toMatch(/animate-\[shimmer/);
    });

    it("should render icon and title skeleton", () => {
      // Arrange & Act
      const { container } = render(<CardSkeleton />);

      // Assert
      const skeletons = container.querySelectorAll("div.bg-gray-200");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("CardsSkeleton", () => {
    it("should render multiple CardSkeleton components", () => {
      // Arrange & Act
      const { container } = render(<CardsSkeleton />);

      // Assert
      const cards = container.querySelectorAll("div.rounded-xl.bg-gray-100");
      expect(cards.length).toBe(4);
    });
  });

  describe("RevenueChartSkeleton", () => {
    it("should render revenue chart skeleton", () => {
      // Arrange & Act
      const { container } = render(<RevenueChartSkeleton />);

      // Assert
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should have shimmer effect", () => {
      // Arrange & Act
      const { container } = render(<RevenueChartSkeleton />);

      // Assert
      const className = container.querySelector("div")?.className;
      expect(className).toMatch(/animate-\[shimmer/);
    });

    it("should render title skeleton", () => {
      // Arrange & Act
      const { container } = render(<RevenueChartSkeleton />);

      // Assert
      const titleSkeleton = container.querySelector("div.h-8.w-36.rounded-md");
      expect(titleSkeleton).toBeInTheDocument();
    });
  });

  describe("InvoiceSkeleton", () => {
    it("should render invoice skeleton row", () => {
      // Arrange & Act
      const { container } = render(<InvoiceSkeleton />);

      // Assert
      expect(container.querySelector("div.flex")).toBeTruthy();
    });

    it("should have correct styling", () => {
      // Arrange & Act
      const { container } = render(<InvoiceSkeleton />);

      // Assert
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass("flex-row");
      expect(skeleton).toHaveClass("justify-between");
    });
  });

  describe("LatestInvoicesSkeleton", () => {
    it("should render latest invoices skeleton", () => {
      // Arrange & Act
      const { container } = render(<LatestInvoicesSkeleton />);

      // Assert
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should contain multiple invoice skeletons", () => {
      // Arrange & Act
      const { container } = render(<LatestInvoicesSkeleton />);

      // Assert
      const borders = container.querySelectorAll("div.border-b");
      expect(borders.length).toBeGreaterThan(0);
    });
  });

  describe("DashboardSkeleton", () => {
    it("should render main dashboard skeleton", () => {
      // Arrange & Act
      const { container } = render(<DashboardSkeleton />);

      // Assert
      expect(container).toBeInTheDocument();
    });

    it("should contain grid layout", () => {
      // Arrange & Act
      const { container } = render(<DashboardSkeleton />);

      // Assert
      const grids = container.querySelectorAll("div.grid");
      expect(grids.length).toBeGreaterThan(0);
    });
  });

  describe("TableRowSkeleton", () => {
    it("should render table row skeleton", () => {
      // Arrange & Act
      const { container } = render(
        <table>
          <tbody>
            <TableRowSkeleton />
          </tbody>
        </table>,
      );

      // Assert
      const row = container.querySelector("tr");
      expect(row).toBeInTheDocument();
    });

    it("should have correct number of cells", () => {
      // Arrange & Act
      const { container } = render(
        <table>
          <tbody>
            <TableRowSkeleton />
          </tbody>
        </table>,
      );

      // Assert
      const cells = container.querySelectorAll("td");
      expect(cells.length).toBe(6);
    });

    it("should have correct styling for rounded corners", () => {
      // Arrange & Act
      const { container } = render(
        <table>
          <tbody>
            <TableRowSkeleton />
          </tbody>
        </table>,
      );

      // Assert
      const row = container.querySelector("tr");
      const className = row?.className;
      expect(className).toContain("rounded");
    });
  });

  describe("InvoicesMobileSkeleton", () => {
    it("should render mobile invoice skeleton", () => {
      // Arrange & Act
      const { container } = render(<InvoicesMobileSkeleton />);

      // Assert
      expect(container.querySelector("div.mb-2")).toBeInTheDocument();
    });

    it("should have mobile-friendly styling", () => {
      // Arrange & Act
      const { container } = render(<InvoicesMobileSkeleton />);

      // Assert
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass("rounded-md");
      expect(skeleton).toHaveClass("bg-white");
    });
  });

  describe("InvoicesTableSkeleton", () => {
    it("should render invoices table skeleton", () => {
      // Arrange & Act
      const { container } = render(<InvoicesTableSkeleton />);

      // Assert
      const table = container.querySelector("table");
      expect(table).toBeInTheDocument();
    });

    it("should have mobile and desktop variants", () => {
      // Arrange & Act
      const { container } = render(<InvoicesTableSkeleton />);

      // Assert
      const mobileSection = container.querySelector("div.md\\:hidden");
      const desktopTable = container.querySelector("table.hidden.md\\:table");
      expect(mobileSection).toBeInTheDocument();
      expect(desktopTable).toBeInTheDocument();
    });

    it("should contain table headers", () => {
      // Arrange & Act
      const { container } = render(<InvoicesTableSkeleton />);

      // Assert
      const headers = container.querySelectorAll("th");
      expect(headers.length).toBeGreaterThan(0);
    });

    it("should render multiple table rows", () => {
      // Arrange & Act
      const { container } = render(<InvoicesTableSkeleton />);

      // Assert
      const rows = container.querySelectorAll("tbody tr");
      expect(rows.length).toBe(6);
    });
  });

  describe("CustomerTableRowSkeleton", () => {
    it("should render customer table row", () => {
      // Arrange & Act
      const { container } = render(
        <table>
          <tbody>
            <CustomerTableRowSkeleton />
          </tbody>
        </table>,
      );

      // Assert
      const row = container.querySelector("tr");
      expect(row).toBeInTheDocument();
    });

    it("should have 5 columns for customer data", () => {
      // Arrange & Act
      const { container } = render(
        <table>
          <tbody>
            <CustomerTableRowSkeleton />
          </tbody>
        </table>,
      );

      // Assert
      const cells = container.querySelectorAll("td");
      expect(cells.length).toBe(5);
    });
  });

  describe("CustomersMobileSkeleton", () => {
    it("should render customers mobile skeleton", () => {
      // Arrange & Act
      const { container } = render(<CustomersMobileSkeleton />);

      // Assert
      expect(container.querySelector("div.mb-2")).toBeInTheDocument();
    });

    it("should render multiple skeleton divs", () => {
      // Arrange & Act
      const { container } = render(<CustomersMobileSkeleton />);

      // Assert
      const skeletons = container.querySelectorAll("div.bg-gray-100");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("CustomersTableSkeleton", () => {
    it("should render customers table skeleton", () => {
      // Arrange & Act
      const { container } = render(<CustomersTableSkeleton />);

      // Assert
      const table = container.querySelector("table");
      expect(table).toBeInTheDocument();
    });

    it("should have both mobile and desktop layouts", () => {
      // Arrange & Act
      const { container } = render(<CustomersTableSkeleton />);

      // Assert
      const mobileSection = container.querySelector("div.md\\:hidden");
      const desktopTable = container.querySelector("table.hidden.md\\:table");
      expect(mobileSection).toBeInTheDocument();
      expect(desktopTable).toBeInTheDocument();
    });

    it("should have correct number of table headers", () => {
      // Arrange & Act
      const { container } = render(<CustomersTableSkeleton />);

      // Assert
      const headers = container.querySelectorAll("th");
      expect(headers.length).toBe(5);
    });

    it("should render multiple customer rows", () => {
      // Arrange & Act
      const { container } = render(<CustomersTableSkeleton />);

      // Assert
      const rows = container.querySelectorAll("tbody tr");
      expect(rows.length).toBe(6);
    });
  });

  describe("SearchSkeleton", () => {
    it("should render search skeleton", () => {
      // Arrange & Act
      const { container } = render(<SearchSkeleton />);

      // Assert
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should have shimmer animation", () => {
      // Arrange & Act
      const { container } = render(<SearchSkeleton />);

      // Assert
      const className = container.querySelector("div")?.className;
      expect(className).toMatch(/animate-\[shimmer/);
    });

    it("should have correct styling", () => {
      // Arrange & Act
      const { container } = render(<SearchSkeleton />);

      // Assert
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass("flex");
      expect(skeleton).toHaveClass("rounded-md");
    });
  });
});
