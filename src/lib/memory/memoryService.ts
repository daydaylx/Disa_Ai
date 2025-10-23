interface GlobalMemory {
  name?: string;
  hobbies?: string[];
  background?: string;
  preferences?: Record<string, any>;
}

export class MemoryStore {
  static getGlobalMemory(): GlobalMemory | null {
    try {
      const data = localStorage.getItem("disa-ai-global-memory");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveGlobalMemory(memory: GlobalMemory): void {
    try {
      localStorage.setItem("disa-ai-global-memory", JSON.stringify(memory));
    } catch (error) {
      throw new Error(`Failed to save global memory: ${error}`);
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem("disa-ai-global-memory");
      // Clear other memory-related items
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("disa-ai-conversation-")) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      throw new Error(`Failed to clear memory: ${error}`);
    }
  }
}
