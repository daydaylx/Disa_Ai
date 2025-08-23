import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, expect, test, describe } from "vitest";
import PersonaQuickBar from "../components/PersonaQuickBar";

let setStyleIdMock: ReturnType<typeof vi.fn>;

vi.mock("../config/personas", () => {
  setStyleIdMock = vi.fn();
  return {
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
  };
});

describe("PersonaQuickBar", () => {
  test("rendert Buttons und setzt Auswahl", () => {
    render(<PersonaQuickBar />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();

    fireEvent.click(screen.getByText("B"));
    expect(setStyleIdMock).toHaveBeenCalledWith("b");
  });
});
