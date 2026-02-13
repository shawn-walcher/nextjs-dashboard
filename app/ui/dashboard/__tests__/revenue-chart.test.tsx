import React from "react";
import { render, screen } from "@testing-library/react";
import RevenueChart from "../revenue-chart";

// Mock fonts
jest.mock("@/app/ui/fonts", () => ({
  lusitana: { className: "mock-lusitana" },
}));

// Mock hero icons
jest.mock("@heroicons/react/24/outline", () => ({
  CalendarIcon: () => <span data-testid="calendar-icon">calendar</span>,
}));

// Mock recharts components
jest.mock("recharts", () => {
  const React = require("react");
  return {
    BarChart: ({ data, children }: any) => (
      <div data-testid="bar-chart">
        {children}
        {data &&
          data.map((item: any) => (
            <div key={item.month} data-testid={`month-${item.month}`}>
              {item.month}: ${item.revenue}
            </div>
          ))}
      </div>
    ),
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

const mockData = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 4000 },
];

describe("Revenue Chart Component", () => {
  it("should render chart title", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByText("Recent Revenue")).toBeInTheDocument();
  });

  it("should apply lusitana font to title", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    const title = screen.getByText("Recent Revenue");
    expect(title).toHaveClass("mock-lusitana");
  });

  it("should render month labels", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("month-Jan")).toBeInTheDocument();
    expect(screen.getByTestId("month-Feb")).toBeInTheDocument();
    expect(screen.getByTestId("month-Mar")).toBeInTheDocument();
  });

  it("should render calendar icon", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
  });

  it("should render last 12 months label", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByText("Last 12 months")).toBeInTheDocument();
  });

  it("should render chart container with proper styling", () => {
    // Arrange & Act
    const { container } = render(<RevenueChart data={mockData} />);

    // Assert
    const chartDiv = container.querySelector(".w-full.md\\:col-span-4");
    expect(chartDiv).toBeInTheDocument();
  });

  it("should render bar chart component", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("should render chart with rounded corners", () => {
    // Arrange & Act
    const { container } = render(<RevenueChart data={mockData} />);

    // Assert
    const chartBox = container.querySelector(".rounded-xl");
    expect(chartBox).toHaveClass("bg-gray-50");
    expect(chartBox).toHaveClass("p-4");
  });

  it("should render no data message when data is empty", () => {
    // Arrange & Act
    render(<RevenueChart data={[]} />);

    // Assert
    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("should render no data message when data is null", () => {
    // Arrange & Act
    render(<RevenueChart data={null as any} />);

    // Assert
    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("should render chart axes", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
  });

  it("should render responsive container", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("should render chart grid", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("grid")).toBeInTheDocument();
  });

  it("should render tooltip component", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("should render bar component", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    expect(screen.getByTestId("bar")).toBeInTheDocument();
  });

  it("should render title with proper text styling", () => {
    // Arrange & Act
    render(<RevenueChart data={mockData} />);

    // Assert
    const title = screen.getByText("Recent Revenue");
    expect(title).toHaveClass("mb-4");
    expect(title).toHaveClass("text-xl");
  });
});
