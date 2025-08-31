import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi } from "vitest";

import PersonaQuickBar from "../components/PersonaQuickBar";

const setStyleIdMock = vi.fn();

vi.mock("../config/personas", () => ({
  usePersonaSelection: () => ({
    styles: [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ],
    styleId: "a",
    setStyleId: setStyleIdMock,
    loading: false,
    error: null,
    current: { id: "a", name: "A" },
  }),
}));

describe("PersonaQuickBar", () => {
  test("rendert Buttons und setzt Auswahl", () => {
    render(<PersonaQuickBar />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();

    fireEvent.click(screen.getByText("B"));
    expect(setStyleIdMock).toHaveBeenCalledWith("b");
  });
});
