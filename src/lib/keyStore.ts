export type KeyRecord = { id: string; value: string };

export class KeyStore {
  get(_id: string): KeyRecord | undefined {
    return undefined;
  }
  set(_rec: KeyRecord): void {}
}

export function migrateLegacyKeyFromLocalStorage(): void {
  // Placeholder for legacy key migration
}

export default new KeyStore();
