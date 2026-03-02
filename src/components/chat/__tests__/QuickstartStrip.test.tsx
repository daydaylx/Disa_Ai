import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { Quickstart } from "@/config/quickstarts";

import { QuickstartStrip } from "../QuickstartStrip";

function createQuickstart(id: string, title: string): Quickstart {
  return {
    id,
    title,
    description: `${title} Beschreibung`,
    icon: null,
    system: "system",
    user: "user",
    category: "kultur",
  };
}

describe("QuickstartStrip", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not reshuffle when quickstarts are recreated with the same ids", () => {
    const randomSpy = vi.spyOn(Math, "random");
    const onSelect = vi.fn();
    const initialQuickstarts = Array.from({ length: 8 }, (_, index) =>
      createQuickstart(`q-${index + 1}`, `Titel ${index + 1}`),
    );

    const { rerender } = render(
      <QuickstartStrip quickstarts={initialQuickstarts} onSelect={onSelect} />,
    );

    const randomCallsAfterInitialRender = randomSpy.mock.calls.length;
    const recreatedQuickstarts = initialQuickstarts.map((quickstart) => ({ ...quickstart }));

    rerender(<QuickstartStrip quickstarts={recreatedQuickstarts} onSelect={onSelect} />);

    expect(randomSpy.mock.calls.length).toBe(randomCallsAfterInitialRender);
  });

  it("updates picks when quickstart ids change", () => {
    const onSelect = vi.fn();
    const initialQuickstarts = Array.from({ length: 8 }, (_, index) =>
      createQuickstart(`q-${index + 1}`, `Titel ${index + 1}`),
    );

    const { rerender } = render(
      <QuickstartStrip quickstarts={initialQuickstarts} onSelect={onSelect} />,
    );

    const updatedQuickstarts = [
      createQuickstart("q-new-1", "Neues Thema 1"),
      createQuickstart("q-new-2", "Neues Thema 2"),
    ];

    rerender(<QuickstartStrip quickstarts={updatedQuickstarts} onSelect={onSelect} />);

    expect(screen.getByRole("button", { name: /neues thema 1/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /neues thema 2/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /titel 1/i })).not.toBeInTheDocument();
  });
});
