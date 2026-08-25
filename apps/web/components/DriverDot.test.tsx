import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import type { Driver } from "@f1-dashboard/types";
import { DriverDot } from "./DriverDot";

const driver: Driver = {
  driver_number: 1,
  broadcast_name: "M VERSTAPPEN",
  full_name: "Max Verstappen",
  first_name: "Max",
  last_name: "Verstappen",
  name_acronym: "VER",
  team_name: "Red Bull Racing",
  team_colour: "3671C6",
  country_code: "NED",
  headshot_url: null,
  session_key: 9161,
  meeting_key: 1219,
};

function renderDot(props: Partial<Parameters<typeof DriverDot>[0]> = {}) {
  return render(
    <svg>
      <DriverDot
        driver={driver}
        x={10}
        y={10}
        isSelected={false}
        isHovered={false}
        hasSelection={false}
        onHoverStart={vi.fn()}
        onHoverEnd={vi.fn()}
        onClick={vi.fn()}
        {...props}
      />
    </svg>,
  );
}

describe("DriverDot", () => {
  it("renders at full opacity by default", () => {
    const { container } = renderDot();
    const circle = container.querySelector("circle")!;
    expect(circle).toHaveAttribute("opacity", "1");
  });

  it("dims to 0.3 opacity when another driver is selected", () => {
    const { container } = renderDot({ hasSelection: true, isSelected: false });
    const circle = container.querySelector("circle")!;
    expect(circle).toHaveAttribute("opacity", "0.3");
  });

  it("stays at full opacity and shows a selection ring when selected", () => {
    const { container } = renderDot({ hasSelection: true, isSelected: true });
    const circle = container.querySelector("circle")!;
    expect(circle).toHaveAttribute("opacity", "1");
    expect(circle).toHaveAttribute("r", "6");
    expect(circle.getAttribute("stroke")).not.toBe("none");
  });

  it("has a larger radius when hovered but not selected", () => {
    const { container } = renderDot({ isHovered: true });
    const circle = container.querySelector("circle")!;
    expect(circle).toHaveAttribute("r", "5");
  });

  it("is keyboard focusable and exposes an accessible label", () => {
    const { container } = renderDot();
    const circle = container.querySelector("circle")!;
    expect(circle).toHaveAttribute("tabindex", "0");
    expect(circle).toHaveAttribute("role", "button");
    expect(circle.getAttribute("aria-label")).toContain("Max Verstappen");
  });
});
