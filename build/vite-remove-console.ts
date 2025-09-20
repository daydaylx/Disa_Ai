import type { Plugin } from 'vite';

interface RemoveConsoleOptions {
  /**
   * Console methods to remove in production
   * @default ['log', 'debug', 'info']
   */
  remove?: string[];

  /**
   * Console methods to keep even in production
   * @default ['warn', 'error']
   */
  keep?: string[];

  /**
   * Only remove in production builds
   * @default true
   */
  productionOnly?: boolean;
}

/**
 * Vite plugin to remove console statements in production builds
 */
export function removeConsolePlugin(options: RemoveConsoleOptions = {}): Plugin {
  const {
    remove = ['log', 'debug', 'info'],
    keep = ['warn', 'error'],
    productionOnly = true,
  } = options;

  return {
    name: 'remove-console',
    apply: productionOnly ? 'build' : undefined,

    transform(code: string, id: string) {
      // Skip node_modules and non-JS/TS files
      if (id.includes('node_modules') || !id.match(/\.(js|ts|tsx?)$/)) {
        return null;
      }

      let transformedCode = code;

      // Remove specified console methods
      remove.forEach(method => {
        if (!keep.includes(method)) {
          // Remove console.method() calls but preserve structure
          const regex = new RegExp(
            `console\\.${method}\\s*\\([^)]*\\)\\s*;?`,
            'g'
          );
          transformedCode = transformedCode.replace(regex, '');

          // Remove standalone console.method without parentheses
          const standaloneRegex = new RegExp(
            `\\bconsole\\.${method}\\b(?!\\s*\\()`,
            'g'
          );
          transformedCode = transformedCode.replace(standaloneRegex, 'undefined');
        }
      });

      // Only return if we made changes
      return transformedCode !== code ? {
        code: transformedCode,
        map: null, // Skip source map for performance
      } : null;
    },
  };
}

/**
 * Production-optimized plugin with aggressive console removal
 */
export function aggressiveRemoveConsolePlugin(): Plugin {
  return removeConsolePlugin({
    remove: ['log', 'debug', 'info', 'trace', 'table', 'time', 'timeEnd'],
    keep: ['warn', 'error'],
    productionOnly: true,
  });
}