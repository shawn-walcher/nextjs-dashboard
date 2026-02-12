import {
  formatCurrency,
  formatDateToLocal,
  generateYAxis,
  generatePagination,
} from "@/app/lib/utils";

describe("Utils", () => {
  describe("formatCurrency", () => {
    it("should format currency correctly from cents to dollars", () => {
      // Arrange
      const amountInCents = 1000; // 10.00

      // Act
      const result = formatCurrency(amountInCents);

      // Assert
      expect(result).toBe("$10.00");
    });

    it("should handle zero amount", () => {
      // Arrange
      const amountInCents = 0;

      // Act
      const result = formatCurrency(amountInCents);

      // Assert
      expect(result).toBe("$0.00");
    });

    it("should handle large amounts", () => {
      // Arrange
      const amountInCents = 999999; // 9,999.99

      // Act
      const result = formatCurrency(amountInCents);

      // Assert
      expect(result).toBe("$9,999.99");
    });

    it("should handle negative amounts", () => {
      // Arrange
      const amountInCents = -5000; // -50.00

      // Act
      const result = formatCurrency(amountInCents);

      // Assert
      expect(result).toBe("-$50.00");
    });

    it("should format with consistent decimal places", () => {
      // Arrange
      const testCases = [
        { input: 100, expected: "$1.00" },
        { input: 1, expected: "$0.01" },
        { input: 10000, expected: "$100.00" },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(formatCurrency(input)).toBe(expected);
      });
    });
  });

  describe("formatDateToLocal", () => {
    it("should format date string correctly to en-US locale", () => {
      // Arrange - Use noon UTC to avoid timezone day boundary issues
      const dateStr = "2024-01-15T12:00:00.000Z";

      // Act
      const result = formatDateToLocal(dateStr, "en-US");

      // Assert - Check month and year, date may vary by timezone
      expect(result).toMatch(/January|Jan/);
      expect(result).toMatch(/2024/);
    });

    it("should use en-US locale by default", () => {
      // Arrange - Use noon UTC to avoid timezone day boundary issues
      const dateStr = "2024-06-20T12:00:00.000Z";

      // Act
      const result = formatDateToLocal(dateStr);

      // Assert - Check month and year, date may vary by timezone
      expect(result).toMatch(/June|Jun/);
      expect(result).toMatch(/2024/);
    });

    it("should handle different date formats", () => {
      // Arrange - Use noon UTC to avoid timezone day boundary issues
      const dateStr = "2024-12-25T12:00:00.000Z";

      // Act
      const result = formatDateToLocal(dateStr);

      // Assert - Check month and year, date may vary by timezone
      expect(result).toMatch(/December|Dec/);
      expect(result).toMatch(/2024/);
    });

    it("should fail gracefully with invalid date", () => {
      // Arrange
      const dateStr = "invalid-date";

      // Act & Assert - Should handle invalid date gracefully
      expect(() => {
        formatDateToLocal(dateStr);
      }).not.toThrow();
      const result = formatDateToLocal(dateStr);
      expect(result).toBe("Invalid Date");
    });

    it("should format date with different locales", () => {
      // Arrange - Use noon UTC to avoid timezone day boundary issues
      const dateStr = "2024-03-10T12:00:00.000Z";

      // Act - Test German locale
      const deResult = formatDateToLocal(dateStr, "de-DE");

      // Assert - Just check format is valid (timezone-independent)
      expect(deResult).toBeTruthy();
      expect(deResult).not.toBe("Invalid Date");
      expect(deResult).toMatch(/2024/);
    });
  });

  describe("generateYAxis", () => {
    it("should generate y-axis labels for small revenue amounts", () => {
      // Arrange
      const revenue = [
        { month: "Jan", revenue: 500 },
        { month: "Feb", revenue: 750 },
      ];

      // Act
      const result = generateYAxis(revenue);

      // Assert
      expect(result.topLabel).toBe(1000);
      expect(result.yAxisLabels).toEqual(["$1K", "$0K"]);
    });

    it("should generate y-axis labels for large revenue amounts", () => {
      // Arrange
      const revenue = [
        { month: "Jan", revenue: 15000 },
        { month: "Feb", revenue: 12500 },
      ];

      // Act
      const result = generateYAxis(revenue);

      // Assert
      expect(result.topLabel).toBe(15000);
      expect(result.yAxisLabels).toContain("$15K");
      expect(result.yAxisLabels).toContain("$0K");
    });

    it("should handle single data point", () => {
      // Arrange
      const revenue = [{ month: "Jan", revenue: 5000 }];

      // Act
      const result = generateYAxis(revenue);

      // Assert
      expect(result.topLabel).toBe(5000);
      expect(result.yAxisLabels).toContain("$5K");
      expect(result.yAxisLabels).toContain("$0K");
    });

    it("should handle zero revenue", () => {
      // Arrange
      const revenue = [{ month: "Jan", revenue: 0 }];

      // Act
      const result = generateYAxis(revenue);

      // Assert
      expect(result.topLabel).toBe(0);
      expect(result.yAxisLabels).toEqual(["$0K"]);
    });

    it("should properly round up to nearest thousand", () => {
      // Arrange
      const revenue = [{ month: "Jan", revenue: 3100 }];

      // Act
      const result = generateYAxis(revenue);

      // Assert
      expect(result.topLabel).toBe(4000);
      expect(result.yAxisLabels).toContain("$4K");
    });
  });

  describe("generatePagination", () => {
    it("should return all pages when total pages is 7 or less", () => {
      // Arrange
      const currentPage = 2;
      const totalPages = 5;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should return all pages when total pages is exactly 7", () => {
      // Arrange
      const currentPage = 4;
      const totalPages = 7;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("should show first 3, ellipsis, and last 2 pages when on first 3 pages", () => {
      // Arrange
      const currentPage = 2;
      const totalPages = 10;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, 2, 3, "...", 9, 10]);
    });

    it("should show first page, first 3 pages, ellipsis, and last 2 pages when on page 1", () => {
      // Arrange
      const currentPage = 1;
      const totalPages = 15;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, 2, 3, "...", 14, 15]);
    });

    it("should show first 2, ellipsis, and last 3 pages when on last 3 pages", () => {
      // Arrange
      const currentPage = 9;
      const totalPages = 10;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, 2, "...", 8, 9, 10]);
    });

    it("should show first 2, ellipsis, and last 3 pages when on last page", () => {
      // Arrange
      const currentPage = 10;
      const totalPages = 10;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, 2, "...", 8, 9, 10]);
    });

    it("should show middle pagination when on middle page", () => {
      // Arrange
      const currentPage = 5;
      const totalPages = 10;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, "...", 4, 5, 6, "...", 10]);
    });

    it("should handle single page", () => {
      // Arrange
      const currentPage = 1;
      const totalPages = 1;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1]);
    });

    it("should handle two pages", () => {
      // Arrange
      const currentPage = 1;
      const totalPages = 2;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, 2]);
    });

    it("should show correct pagination for page 4 of 10", () => {
      // Arrange
      const currentPage = 4;
      const totalPages = 10;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert - Page 4 is in the middle, so shows page ± 1 neighbors
      expect(result).toEqual([1, "...", 3, 4, 5, "...", 10]);
    });

    it("should show correct pagination for page 6 of 10", () => {
      // Arrange
      const currentPage = 6;
      const totalPages = 10;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert
      expect(result).toEqual([1, "...", 5, 6, 7, "...", 10]);
    });

    it("should show correct pagination for page 8 of 10", () => {
      // Arrange
      const currentPage = 8;
      const totalPages = 10;

      // Act
      const result = generatePagination(currentPage, totalPages);

      // Assert - Page 8 is >= 10 - 2 = 8, so shows last 3 pages
      expect(result).toEqual([1, 2, "...", 8, 9, 10]);
    });
  });
});
