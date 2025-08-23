import { fireEvent,render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { PersonaQuickBar } from "../components/PersonaQuickBar";
import * as personasMod from "../config/personas";

describe("PersonaQuickBar", () => {
  it("rendert Buttons und setzt Auswahl", () => {
    vi.spyOn(personasMod, "usePersonaSelection").mockReturnValue({
      personas: [
        { id: "a", label: "A", prompt: "pA" },
        { id: "b", label: "B", prompt: "pB" },
      ],
      personaId: "a",
      setPersonaId: vi.fn(),
      active: { id: "a", label: "A", prompt: "pA" },
      loading: false,
    } as any);

    render(<PersonaQuickBar />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();

    fireEvent.click(screen.getByText("B"));
    // Erwartung: setPersonaId wird aufgerufen
    const hook = personasMod.usePersonaSelection() as any;
    expect(hook.setPersonaId).toHaveBeenCalled();
  });
});
