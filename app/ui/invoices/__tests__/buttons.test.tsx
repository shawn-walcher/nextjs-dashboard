import React from "react";
import { render, screen } from "@testing-library/react";
import { CreateInvoice, UpdateInvoice, DeleteInvoice } from "../buttons";

// Mock Next.js Link component
jest.mock("next/link", () => {
  const MockedLink = ({ children, href, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockedLink.displayName = "Link";
  return MockedLink;
});

// Mock the actions
jest.mock("@/app/lib/actions", () => ({
  deleteInvoice: {
    bind: jest.fn((id: string) => jest.fn()),
  },
}));

// Mock heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  PencilIcon: () => <div data-testid="pencil-icon">Pencil</div>,
  PlusIcon: () => <div data-testid="plus-icon">Plus</div>,
  TrashIcon: () => <div data-testid="trash-icon">Trash</div>,
}));

describe("Invoice Buttons Components", () => {
  describe("CreateInvoice", () => {
    it("should render create invoice button", () => {
      // Arrange & Act
      render(<CreateInvoice />);

      // Assert
      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/dashboard/invoices/create",
      );
    });

    it("should render button text", () => {
      // Arrange & Act
      render(<CreateInvoice />);

      // Assert
      expect(screen.getByText("Create Invoice")).toBeInTheDocument();
    });

    it("should render plus icon", () => {
      // Arrange & Act
      render(<CreateInvoice />);

      // Assert
      expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    });

    it("should have correct styling classes", () => {
      // Arrange & Act
      const { container } = render(<CreateInvoice />);

      // Assert
      const link = container.querySelector("a");
      expect(link).toHaveClass("flex");
      expect(link).toHaveClass("h-10");
      expect(link).toHaveClass("bg-blue-600");
      expect(link).toHaveClass("text-white");
      expect(link).toHaveClass("rounded-lg");
    });

    it("should hide text on small screens", () => {
      // Arrange & Act
      const { container } = render(<CreateInvoice />);

      // Assert
      const textSpan = container.querySelector("span.hidden");
      expect(textSpan).toBeInTheDocument();
      expect(textSpan).toHaveClass("md:block");
    });
  });

  describe("UpdateInvoice", () => {
    it("should render edit button with correct link", () => {
      // Arrange & Act
      render(<UpdateInvoice id="123" />);

      // Assert
      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/dashboard/invoices/123/edit",
      );
    });

    it("should render pencil icon", () => {
      // Arrange & Act
      render(<UpdateInvoice id="123" />);

      // Assert
      expect(screen.getByTestId("pencil-icon")).toBeInTheDocument();
    });

    it("should have correct styling classes", () => {
      // Arrange & Act
      const { container } = render(<UpdateInvoice id="123" />);

      // Assert
      const link = container.querySelector("a");
      expect(link).toHaveClass("rounded-md");
      expect(link).toHaveClass("border");
      expect(link).toHaveClass("p-2");
      expect(link).toHaveClass("hover:bg-gray-100");
    });

    it("should handle different invoice IDs", () => {
      // Arrange & Act
      render(<UpdateInvoice id="abc-def-ghi" />);

      // Assert
      expect(screen.getByRole("link")).toHaveAttribute(
        "href",
        "/dashboard/invoices/abc-def-ghi/edit",
      );
    });
  });

  describe("DeleteInvoice", () => {
    it("should render delete button", () => {
      // Arrange & Act
      render(<DeleteInvoice id="123" />);

      // Assert
      expect(screen.getByRole("button", { hidden: true })).toBeInTheDocument();
    });

    it("should render delete button as submit type", () => {
      // Arrange & Act
      render(<DeleteInvoice id="123" />);

      // Assert
      expect(screen.getByRole("button", { hidden: true })).toHaveAttribute(
        "type",
        "submit",
      );
    });

    it("should be in a form element", () => {
      // Arrange & Act
      const { container } = render(<DeleteInvoice id="123" />);

      // Assert
      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("should have sr-only delete text", () => {
      // Arrange & Act
      render(<DeleteInvoice id="123" />);

      // Assert
      expect(screen.getByText("Delete")).toHaveClass("sr-only");
    });

    it("should render trash icon", () => {
      // Arrange & Act
      render(<DeleteInvoice id="123" />);

      // Assert
      expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
    });

    it("should have correct button styling", () => {
      // Arrange & Act
      const { container } = render(<DeleteInvoice id="123" />);

      // Assert
      const button = container.querySelector("button");
      expect(button).toHaveClass("rounded-md");
      expect(button).toHaveClass("border");
      expect(button).toHaveClass("p-2");
      expect(button).toHaveClass("hover:bg-gray-100");
    });

    it("should bind deleteInvoice with invoice id", () => {
      // Arrange
      const { deleteInvoice } = require("@/app/lib/actions");

      // Act
      render(<DeleteInvoice id="456" />);

      // Assert
      expect(deleteInvoice.bind).toHaveBeenCalledWith(null, "456");
    });

    it("should handle different invoice IDs", () => {
      // Arrange
      const { deleteInvoice } = require("@/app/lib/actions");
      deleteInvoice.bind.mockClear();

      // Act
      render(<DeleteInvoice id="xyz-789" />);

      // Assert
      expect(deleteInvoice.bind).toHaveBeenCalledWith(null, "xyz-789");
    });
  });
});
