/**
 * Lightweight Syntax Highlighting
 *
 * Regex-based syntax highlighting for common programming languages.
 * No external dependencies - uses simple token-based coloring.
 */

interface Token {
  type: "keyword" | "string" | "comment" | "number" | "function" | "operator" | "text";
  content: string;
}

// Common keywords across languages
const KEYWORDS = new Set([
  // JavaScript/TypeScript
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "break",
  "continue",
  "import",
  "export",
  "default",
  "from",
  "as",
  "async",
  "await",
  "try",
  "catch",
  "finally",
  "class",
  "extends",
  "interface",
  "type",
  "enum",
  "new",
  "this",
  "super",
  "static",
  // Python
  "def",
  "class",
  "import",
  "from",
  "as",
  "return",
  "if",
  "elif",
  "else",
  "for",
  "while",
  "break",
  "continue",
  "pass",
  "lambda",
  "with",
  "try",
  "except",
  "finally",
  "raise",
  "True",
  "False",
  "None",
  "and",
  "or",
  "not",
  "in",
  "is",
  // Java/C#
  "public",
  "private",
  "protected",
  "void",
  "int",
  "string",
  "bool",
  "double",
  "float",
  "char",
  "byte",
  "short",
  "long",
  "boolean",
  "package",
  "namespace",
  "using",
  // Go
  "func",
  "package",
  "import",
  "var",
  "const",
  "type",
  "struct",
  "interface",
  "map",
  "chan",
  "go",
  "defer",
  "range",
  "select",
  "case",
  "default",
  // Rust
  "fn",
  "let",
  "mut",
  "const",
  "static",
  "struct",
  "enum",
  "impl",
  "trait",
  "pub",
  "use",
  "mod",
  "crate",
  "self",
  "super",
  "match",
  "if",
  "else",
  "loop",
  "while",
  "for",
  // Common
  "true",
  "false",
  "null",
  "undefined",
  "nil",
]);

/**
 * Tokenize code into syntax elements
 */
function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    const char = code[i];

    // Skip whitespace
    if (/\s/.test(char!)) {
      let ws = "";
      while (i < code.length && /\s/.test(code[i]!)) {
        ws += code[i];
        i++;
      }
      tokens.push({ type: "text", content: ws });
      continue;
    }

    // Single-line comments (// or # or --)
    if (
      (code[i] === "/" && i + 1 < code.length && code[i + 1] === "/") ||
      code[i] === "#" ||
      (code[i] === "-" && i + 1 < code.length && code[i + 1] === "-")
    ) {
      let comment = "";
      while (i < code.length && code[i] !== "\n") {
        comment += code[i];
        i++;
      }
      tokens.push({ type: "comment", content: comment });
      continue;
    }

    // Multi-line comments (/* */ or """ or ''')
    if (code[i] === "/" && i + 1 < code.length && code[i + 1] === "*") {
      let comment = "";
      while (i < code.length) {
        comment += code[i];
        if (code[i] === "*" && i + 1 < code.length && code[i + 1] === "/") {
          comment += code[i + 1]!;
          i += 2;
          break;
        }
        i++;
      }
      tokens.push({ type: "comment", content: comment });
      continue;
    }

    // Strings (single or double quotes)
    if (char === '"' || char === "'" || char === "`") {
      const quote = char;
      let str = quote;
      i++;
      while (i < code.length) {
        if (code[i] === "\\" && i + 1 < code.length) {
          str += code[i]! + code[i + 1]!;
          i += 2;
          continue;
        }
        if (code[i] === quote) {
          str += code[i];
          i++;
          break;
        }
        str += code[i];
        i++;
      }
      tokens.push({ type: "string", content: str });
      continue;
    }

    // Numbers
    if (/\d/.test(char!)) {
      let num = "";
      while (i < code.length && /[\d._xb]/.test(code[i]!)) {
        num += code[i];
        i++;
      }
      tokens.push({ type: "number", content: num });
      continue;
    }

    // Operators and punctuation
    if (/[+\-*/%=<>!&|^~?:;,.()[\]{}]/.test(char!)) {
      tokens.push({ type: "operator", content: char! });
      i++;
      continue;
    }

    // Words (keywords, functions, identifiers)
    if (/[a-zA-Z_$]/.test(char!)) {
      let word = "";
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i]!)) {
        word += code[i];
        i++;
      }

      // Check if followed by '(' - likely a function
      const nextNonSpace = code.slice(i).match(/^\s*\(/);
      if (nextNonSpace) {
        tokens.push({ type: "function", content: word });
      } else if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", content: word });
      } else {
        tokens.push({ type: "text", content: word });
      }
      continue;
    }

    // Everything else
    tokens.push({ type: "text", content: char! });
    i++;
  }

  return tokens;
}

/**
 * Get CSS class for token type
 */
function getTokenClass(type: Token["type"]): string {
  switch (type) {
    case "keyword":
      return "text-syntax-keyword font-semibold";
    case "string":
      return "text-syntax-string";
    case "comment":
      return "text-syntax-comment italic";
    case "number":
      return "text-syntax-number";
    case "function":
      return "text-syntax-function";
    case "operator":
      return "text-syntax-operator";
    default:
      return "text-ink-primary";
  }
}

/**
 * Highlight code with syntax coloring
 * Returns array of {className, content} objects for rendering
 */
export function highlightCode(code: string): Array<{ className: string; content: string }> {
  const tokens = tokenize(code);
  return tokens.map((token) => ({
    className: getTokenClass(token.type),
    content: token.content,
  }));
}

/**
 * Check if language should use syntax highlighting
 */
export function shouldHighlight(language?: string): boolean {
  if (!language) return false;

  const supported = [
    "javascript",
    "js",
    "jsx",
    "typescript",
    "ts",
    "tsx",
    "python",
    "py",
    "java",
    "csharp",
    "cs",
    "c#",
    "cpp",
    "c++",
    "c",
    "go",
    "rust",
    "rs",
    "php",
    "ruby",
    "rb",
    "swift",
    "kotlin",
    "kt",
    "sql",
    "bash",
    "sh",
    "shell",
    "json",
    "html",
    "css",
    "scss",
  ];

  return supported.includes(language.toLowerCase());
}
