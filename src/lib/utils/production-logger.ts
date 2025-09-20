/**
 * Production-safe logger that removes console logs in production builds
 */
/* eslint-disable no-console */

type LogLevel = "log" | "warn" | "error" | "info" | "debug";

interface LoggerConfig {
  enabledInProduction: LogLevel[];
  enabledInDevelopment: LogLevel[];
  prefix?: string;
}

class ProductionLogger {
  private config: LoggerConfig;
  private isProduction: boolean;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.isProduction = import.meta.env.PROD;
    this.config = {
      enabledInProduction: ["error"], // Only errors in production
      enabledInDevelopment: ["log", "warn", "error", "info", "debug"], // All in dev
      prefix: "[Disa AI]",
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const enabledLevels = this.isProduction
      ? this.config.enabledInProduction
      : this.config.enabledInDevelopment;

    return enabledLevels.includes(level);
  }

  private formatMessage(message: string, ...args: unknown[]): [string, ...unknown[]] {
    const prefix = this.config.prefix ? `${this.config.prefix} ` : "";
    return [`${prefix}${message}`, ...args];
  }

  log(message: string, ...args: unknown[]): void {
    if (this.shouldLog("log")) {
      console.log(...this.formatMessage(message, ...args));
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(...this.formatMessage(message, ...args));
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(...this.formatMessage(message, ...args));
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.info(...this.formatMessage(message, ...args));
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.debug(...this.formatMessage(message, ...args));
    }
  }

  // Performance logging only in development
  time(label: string): void {
    if (!this.isProduction) {
      console.time(`${this.config.prefix} ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (!this.isProduction) {
      console.timeEnd(`${this.config.prefix} ${label}`);
    }
  }

  // Conditional logging based on environment
  devOnly(callback: () => void): void {
    if (!this.isProduction) {
      callback();
    }
  }

  prodOnly(callback: () => void): void {
    if (this.isProduction) {
      callback();
    }
  }
}

// Create singleton instance
export const logger = new ProductionLogger();

// Convenience exports for common patterns
export const devLog = (message: string, ...args: unknown[]) => {
  logger.devOnly(() => console.log(`[DEV] ${message}`, ...args));
};

export const prodError = (message: string, ...args: unknown[]) => {
  logger.error(message, ...args);
};

// Migration helper - replace console.log with these
export const safeLog = logger.log.bind(logger);
export const safeWarn = logger.warn.bind(logger);
export const safeError = logger.error.bind(logger);
export const safeInfo = logger.info.bind(logger);
export const safeDebug = logger.debug.bind(logger);
