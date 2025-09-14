export type KeyRecord = { id: string; value: string };

export class KeyStore {
  get(_id: string): KeyRecord | undefined {
    return undefined;
  }
  set(_rec: KeyRecord): void {}
}

export default new KeyStore();
