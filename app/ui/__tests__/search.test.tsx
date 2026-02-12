import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Search from "@/app/ui/search";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Mock the Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe("Search Component", () => {
  const mockReplace = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();

    // Arrange: Setup mock implementations
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
    (usePathname as jest.Mock).mockReturnValue("/dashboard/invoices");
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it("renders the search input with placeholder", () => {
    // Arrange
    const placeholder = "Search invoices...";

    // Act
    render(<Search placeholder={placeholder} />);

    // Assert
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
  });

  it("updates URL parameters when user types", async () => {
    // Arrange
    const placeholder = "Search invoices...";
    render(<Search placeholder={placeholder} />);
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    // Act
    fireEvent.change(input, { target: { value: "test search" } });

    // Assert
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled();
      const callArgs = mockReplace.mock.calls[0][0];
      // Check for query parameter (both %20 and + are valid URL encodings for space)
      expect(callArgs).toMatch(/query=test(\+|%20)search/);
    });
  });

  it("resets page parameter to 1 when search term changes", async () => {
    // Arrange
    const placeholder = "Search invoices...";
    mockSearchParams.set("page", "5");
    render(<Search placeholder={placeholder} />);
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    // Act
    fireEvent.change(input, { target: { value: "new search" } });

    // Assert
    await waitFor(() => {
      const callArgs = mockReplace.mock.calls[0][0];
      expect(callArgs).toContain("page=1");
    });
  });

  it("removes query parameter when search is cleared", async () => {
    // Arrange
    const placeholder = "Search invoices...";
    mockSearchParams.set("query", "existing");
    render(<Search placeholder={placeholder} />);
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    // Act
    fireEvent.change(input, { target: { value: "" } });

    // Assert
    await waitFor(() => {
      const callArgs = mockReplace.mock.calls[0][0];
      expect(callArgs).not.toContain("query=");
    });
  });

  it("displays existing search query on mount", () => {
    // Arrange
    const existingQuery = "existing search";
    mockSearchParams.set("query", existingQuery);
    const placeholder = "Search invoices...";

    // Act
    render(<Search placeholder={placeholder} />);

    // Assert
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    expect(input.value).toBe(existingQuery);
  });

  it("renders the magnifying glass icon", () => {
    // Arrange & Act
    const { container } = render(<Search placeholder="Search..." />);

    // Assert
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
