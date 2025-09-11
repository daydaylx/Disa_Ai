import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NetworkBanner } from "../components/NetworkBanner";

describe("NetworkBanner", () => {
  it("zeigt Banner wenn offline", () => {
    Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
    render(<NetworkBanner />);
    expect(screen.getByText(/Offline/)).toBeInTheDocument();
  });

  it("zeigt nichts wenn online", () => {
    Object.defineProperty(navigator, "onLine", { value: true, configurable: true });
    render(<NetworkBanner />);
    expect(screen.queryByText(/Offline/)).toBeNull();
  });
});
