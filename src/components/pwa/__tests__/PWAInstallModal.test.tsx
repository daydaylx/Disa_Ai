import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePWAInstall } from "../../../hooks/usePWAInstall";
import { PWAInstallModal } from "../PWAInstallModal";

vi.mock("../../../hooks/usePWAInstall");

describe("PWAInstallModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sollte nichts rendern, wenn die App bereits installiert ist (standalone)", () => {
    const triggerInstall = vi.fn().mockResolvedValue("accepted");
    const dismiss = vi.fn();
    vi.mocked(usePWAInstall).mockReturnValue({
      isStandalone: true,
      canInstall: true,
      isIOS: false,
      showPrompt: true,
      installed: false,
      triggerInstall,
      dismiss,
      hasUserInteracted: true,
    });

    render(<PWAInstallModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sollte nichts rendern, wenn showPrompt false ist", () => {
    const triggerInstall = vi.fn().mockResolvedValue("accepted");
    const dismiss = vi.fn();
    vi.mocked(usePWAInstall).mockReturnValue({
      isStandalone: false,
      canInstall: true,
      isIOS: false,
      showPrompt: false,
      installed: false,
      triggerInstall,
      dismiss,
      hasUserInteracted: true,
    });

    render(<PWAInstallModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sollte Modal mit Install-Button für Chrome/Android rendern", () => {
    const triggerInstall = vi.fn().mockResolvedValue("accepted");
    const dismiss = vi.fn();
    vi.mocked(usePWAInstall).mockReturnValue({
      isStandalone: false,
      canInstall: true,
      isIOS: false,
      showPrompt: true,
      installed: false,
      triggerInstall,
      dismiss,
      hasUserInteracted: true,
    });

    render(<PWAInstallModal />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/als app installieren/i)).toBeInTheDocument();
    expect(screen.getAllByText(/installieren/i)).toHaveLength(2);
    expect(screen.getByText(/später/i)).toBeInTheDocument();
  });

  it("sollte Modal mit iOS-Instruktionen für iOS rendern", () => {
    const triggerInstall = vi.fn().mockResolvedValue("accepted");
    const dismiss = vi.fn();
    vi.mocked(usePWAInstall).mockReturnValue({
      isStandalone: false,
      canInstall: false,
      isIOS: true,
      showPrompt: true,
      installed: false,
      triggerInstall,
      dismiss,
      hasUserInteracted: true,
    });

    render(<PWAInstallModal />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/als app hinzufügen/i)).toBeInTheDocument();
    expect(screen.getByText(/öffne die teilen-funktion/i)).toBeInTheDocument();
    expect(screen.getByText(/wähle "zum home-bildschirm"/i)).toBeInTheDocument();
    expect(screen.getByText(/verstanden/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /installieren/i })).not.toBeInTheDocument();
  });

  it("sollte triggerInstall aufrufen, wenn auf Installieren geklickt wird", async () => {
    const triggerInstall = vi.fn().mockResolvedValue("accepted");
    const dismiss = vi.fn();
    vi.mocked(usePWAInstall).mockReturnValue({
      isStandalone: false,
      canInstall: true,
      isIOS: false,
      showPrompt: true,
      installed: false,
      triggerInstall,
      dismiss,
      hasUserInteracted: true,
    });

    render(<PWAInstallModal />);

    const installButton = screen.getByRole("button", { name: /installieren/i });
    await userEvent.click(installButton);

    await waitFor(() => {
      expect(triggerInstall).toHaveBeenCalled();
    });
  });

  it("sollte dismiss aufrufen, wenn auf Später geklickt wird", async () => {
    const triggerInstall = vi.fn().mockResolvedValue("dismissed");
    const dismiss = vi.fn();
    vi.mocked(usePWAInstall).mockReturnValue({
      isStandalone: false,
      canInstall: true,
      isIOS: false,
      showPrompt: true,
      installed: false,
      triggerInstall,
      dismiss,
      hasUserInteracted: true,
    });

    render(<PWAInstallModal />);

    const laterButton = screen.getByText(/später/i);
    await userEvent.click(laterButton);

    expect(dismiss).toHaveBeenCalledWith("dismissed");
  });

  it("sollte dismiss aufrufen, wenn auf Verstanden (iOS) geklickt wird", async () => {
    const triggerInstall = vi.fn().mockResolvedValue("dismissed");
    const dismiss = vi.fn();
    vi.mocked(usePWAInstall).mockReturnValue({
      isStandalone: false,
      canInstall: false,
      isIOS: true,
      showPrompt: true,
      installed: false,
      triggerInstall,
      dismiss,
      hasUserInteracted: true,
    });

    render(<PWAInstallModal />);

    const understoodButton = screen.getByText(/verstanden/i);
    await userEvent.click(understoodButton);

    expect(dismiss).toHaveBeenCalledWith("dismissed");
  });

  it("sollte dismiss aufrufen, wenn TriggerInstall dismissed zurückgibt", async () => {
    const triggerInstall = vi.fn().mockResolvedValue("dismissed");
    const dismiss = vi.fn();
    vi.mocked(usePWAInstall).mockReturnValue({
      isStandalone: false,
      canInstall: true,
      isIOS: false,
      showPrompt: true,
      installed: false,
      triggerInstall,
      dismiss,
      hasUserInteracted: true,
    });

    render(<PWAInstallModal />);

    const installButton = screen.getByRole("button", { name: /installieren/i });
    await userEvent.click(installButton);

    await waitFor(() => {
      expect(dismiss).toHaveBeenCalledWith("dismissed");
    });
  });
});
