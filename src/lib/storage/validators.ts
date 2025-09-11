import { z } from "zod";

/**
 * Safe localStorage/sessionStorage operations with validation
 * Defensive programming against corrupted data, quota errors, private mode
 */

export interface StorageValidator<T> {
  schema: z.ZodSchema<T>;
  default: T;
}

/**
 * Safe storage read with validation and fallback
 */
export function safeStorageGet<T>(
  storage: Storage,
  key: string,
  validator: StorageValidator<T>,
): T {
  try {
    const raw = storage.getItem(key);
    if (!raw) return validator.default;
    
    const parsed = JSON.parse(raw) as unknown;
    const result = validator.schema.safeParse(parsed);
    
    return result.success ? result.data : validator.default;
  } catch {
    return validator.default;
  }
}

/**
 * Safe storage write with error handling
 */
export function safeStorageSet<T>(
  storage: Storage,
  key: string,
  value: T,
): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded, private mode, etc.
    return false;
  }
}

/**
 * Safe storage removal
 */
export function safeStorageRemove(storage: Storage, key: string): boolean {
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Common validators for typical app data
 */
export const validators = {
  /** String with length constraints */
  string: (maxLength = 1000): StorageValidator<string> => ({
    schema: z.string().max(maxLength),
    default: "",
  }),
  
  /** Boolean flag */
  boolean: (defaultValue = false): StorageValidator<boolean> => ({
    schema: z.boolean(),
    default: defaultValue,
  }),
  
  /** Number with range constraints */
  number: (min = 0, max = Number.MAX_SAFE_INTEGER, defaultValue = 0): StorageValidator<number> => ({
    schema: z.number().min(min).max(max).finite(),
    default: defaultValue,
  }),
  
  /** String array with size limits */
  stringArray: (maxItems = 100, maxLength = 100): StorageValidator<string[]> => ({
    schema: z.array(z.string().max(maxLength)).max(maxItems),
    default: [],
  }),
  
  /** Generic object with schema */
  object: <T>(schema: z.ZodSchema<T>, defaultValue: T): StorageValidator<T> => ({
    schema,
    default: defaultValue,
  }),
} as const;