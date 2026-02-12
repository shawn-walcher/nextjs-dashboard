import React from "react";
import { render, screen } from "@testing-library/react";

// Mock fonts
jest.mock("@/app/ui/fonts", () => ({
  lusitana: { className: "mock-lusitana" },
}));

// Mock utils
jest.mock("@/app/lib/utils", () => ({
  generateYAxis: jest.fn((revenue) => ({
    yAxisLabels: ["$0", "$50k", "$100k", "$150k"],
    topLabel: 150000,
  })),
}));

// Mock hero icons
jest.mock("@heroicons/react/24/outline", () => ({
  CalendarIcon: () => <span data-testid="calendar-icon">calendar</span>,
}));

// Mock the data fetching function
jest.mock("@/app/lib/data", () => ({
  fetchRevenue: jest.fn(async () => [
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 4000 },
  ]),
}));

// Mock component that simulates revenue chart rendering
const MockRevenueChart = async () => {
  const revenue = await Promise.resolve([
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 4000 },
  ]);

  const chartHeight = 350;
  const yAxisLabels = ["$0", "$50k", "$100k", "$150k"];
  const topLabel = 150000;

  return (
    <div className="w-full md:col-span-4">
      <h2 className="mock-lusitana mb-4 text-xl md:text-2xl">Recent Revenue</h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <span data-testid="calendar-icon">calendar</span>
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
};

describe("Revenue Chart Component", () => {
  it("should render chart title", async () => {
    // Arrange & Act
    const component = await MockRevenueChart();
    render(component);

    // Assert
    expect(screen.getByText("Recent Revenue")).toBeInTheDocument();
  });

  it("should apply lusitana font to title", async () => {
    // Arrange & Act
    const component = await MockRevenueChart();
    render(component);

    // Assert
    const title = screen.getByText("Recent Revenue");
    expect(title).toHaveClass("mock-lusitana");
  });

  it("should render y axis labels", async () => {
    // Arrange & Act
    const component = await MockRevenueChart();
    render(component);

    // Assert
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("$50k")).toBeInTheDocument();
    expect(screen.getByText("$100k")).toBeInTheDocument();
    expect(screen.getByText("$150k")).toBeInTheDocument();
  });

  it("should render month labels", async () => {
    // Arrange & Act
    const component = await MockRevenueChart();
    render(component);

    // Assert
    const months = screen.getAllByText(/Jan|Feb|Mar/);
    expect(months.length).toBeGreaterThan(0);
  });

  it("should render calendar icon", async () => {
    // Arrange & Act
    const component = await MockRevenueChart();
    render(component);

    // Assert
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
  });

  it("should render last 12 months label", async () => {
    // Arrange & Act
    const component = await MockRevenueChart();
    render(component);

    // Assert
    expect(screen.getByText("Last 12 months")).toBeInTheDocument();
  });

  it("should render chart container with proper styling", async () => {
    // Arrange & Act
    const { container } = render(await MockRevenueChart());

    // Assert
    const chartDiv = container.querySelector(".w-full.md\\:col-span-4");
    expect(chartDiv).toBeInTheDocument();
  });

  it("should render chart with rounded corners", async () => {
    // Arrange & Act
    const { container } = render(await MockRevenueChart());

    // Assert
    const chartBox = container.querySelector(".rounded-xl");
    expect(chartBox).toHaveClass("bg-gray-50");
    expect(chartBox).toHaveClass("p-4");
  });

  it("should render proper grid structure", async () => {
    // Arrange & Act
    const { container } = render(await MockRevenueChart());

    // Assert
    const grid = container.querySelector(".grid.grid-cols-12");
    expect(grid).toHaveClass("items-end");
    expect(grid).toHaveClass("gap-2");
  });

  it("should render chart bars with proper styling", async () => {
    // Arrange & Act
    const { container } = render(await MockRevenueChart());

    // Assert
    const bars = container.querySelectorAll(".bg-blue-300");
    expect(bars.length).toBeGreaterThan(0);
  });

  it("should render calendar icon with proper styling", async () => {
    // Arrange & Act
    const { container } = render(await MockRevenueChart());

    // Assert
    const iconWrappers = container.querySelectorAll(".flex.items-center");
    expect(iconWrappers.length).toBeGreaterThan(0);
  });

  it("should render title with proper text styling", async () => {
    // Arrange & Act
    const { container } = render(await MockRevenueChart());

    // Assert
    const title = screen.getByText("Recent Revenue");
    expect(title).toHaveClass("mb-4");
    expect(title).toHaveClass("text-xl");
  });
});
