import React, { useState } from "react";

import { Modal } from "./Modal";

export function TestModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Test Modal</button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel="Test Modal">
        <div>
          <h2>Test Modal Content</h2>
          <p>This is a test modal to verify our implementation.</p>
          <button onClick={() => setIsOpen(false)}>Close Modal</button>
        </div>
      </Modal>
    </div>
  );
}
