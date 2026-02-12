import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";

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
});
