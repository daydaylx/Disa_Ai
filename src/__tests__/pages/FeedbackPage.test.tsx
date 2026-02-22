import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FeedbackPage from "@/pages/FeedbackPage";
import { ToastsProvider } from "@/ui";

function renderFeedbackPage() {
  return render(
    <MemoryRouter>
      <ToastsProvider>
        <FeedbackPage />
      </ToastsProvider>
    </MemoryRouter>,
  );
}

describe("FeedbackPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("zeigt den Empty-State für Anhänge und deaktivierten Submit ohne Nachricht", () => {
    renderFeedbackPage();

    expect(screen.getByText("Noch keine Screenshots hinzugefügt.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Feedback absenden/i })).toBeDisabled();
  });

  it("zeigt den Loading-State während des Sendens", async () => {
    const user = userEvent.setup();
    let resolveFetch: (value: Response) => void = () => {};
    const pendingFetch = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });

    vi.spyOn(globalThis, "fetch").mockReturnValue(pendingFetch);

    renderFeedbackPage();

    await user.type(screen.getByLabelText("Deine Nachricht"), "Testnachricht");
    await user.click(screen.getByRole("button", { name: /Feedback absenden/i }));

    expect(screen.getByText("Wird gesendet...")).toBeInTheDocument();
    expect(screen.getAllByText("Feedback wird gesendet.").length).toBeGreaterThan(0);

    resolveFetch({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as Response);

    await waitFor(() => {
      expect(screen.queryByText("Wird gesendet...")).not.toBeInTheDocument();
    });
  });

  it("zeigt den Error-State bei fehlgeschlagenem Submit", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ success: false }),
    } as Response);

    renderFeedbackPage();

    await user.type(screen.getByLabelText("Deine Nachricht"), "Testnachricht");
    await user.click(screen.getByRole("button", { name: /Feedback absenden/i }));

    expect((await screen.findAllByText("Senden fehlgeschlagen")).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Serverfehler. Wir arbeiten daran!").length).toBeGreaterThan(0);
  });
});
