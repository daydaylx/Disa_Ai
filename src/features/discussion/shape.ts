const SENTENCE_REGEX = /[^.!?]+[.!?]+|[^.!?]+$/g;

export interface DiscussionShapeOptions {
  minSentences: number;
  maxSentences: number;
  fallbackQuestions: string[];
}

export interface DiscussionShapeResult {
  text: string;
  sentences: string[];
  trimmed: boolean;
  fallbackUsed: boolean;
  questionTrimmed: boolean;
  originalSentenceCount: number;
}

export function shapeDiscussionResponse(
  rawText: string,
  options: DiscussionShapeOptions,
): DiscussionShapeResult {
  const normalized = normalizeParagraph(rawText);
  const sentences = splitSentences(normalized);
  const originalSentenceCount = sentences.length;

  let trimmed = false;
  let working = sentences;
  if (working.length > options.maxSentences) {
    working = working.slice(0, options.maxSentences);
    trimmed = true;
  }

  if (working.length === 0) {
    working = [normalized].filter(Boolean);
  }

  const {
    sentences: ensured,
    fallbackUsed,
    questionTrimmed,
  } = ensureClosingQuestion(working, options.maxSentences, options.fallbackQuestions);

  if (ensured.length < options.minSentences) {
    console.warn("Discussion response shorter als Mindestanzahl Sätze", {
      minRequired: options.minSentences,
      sentences: ensured.length,
      text: normalized,
    });
  }

  const text = ensured.join(" ").replace(/\s+/g, " ").trim();

  return {
    text,
    sentences: ensured,
    trimmed,
    fallbackUsed,
    questionTrimmed,
    originalSentenceCount,
  };
}

function normalizeParagraph(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitSentences(text: string): string[] {
  const matches = text.match(SENTENCE_REGEX);
  if (!matches) return [];
  return matches
    .map((part) => part.trim())
    .filter(Boolean)
    .map((sentence) => ensureSentencePunctuation(sentence));
}

function ensureSentencePunctuation(sentence: string): string {
  const trimmed = sentence.trim();
  if (/([.!?]|…)$/.test(trimmed)) return trimmed;
  return `${trimmed}.`;
}

function ensureClosingQuestion(
  sentences: string[],
  maxSentences: number,
  fallbackQuestions: string[],
): { sentences: string[]; fallbackUsed: boolean; questionTrimmed: boolean } {
  if (sentences.length === 0) {
    const fallback =
      fallbackQuestions[0] ??
      fallbackQuestions[fallbackQuestions.length - 1] ??
      "Was denkst du darüber?";
    return { sentences: [ensureQuestion(fallback)], fallbackUsed: true, questionTrimmed: false };
  }

  const lastIndex = sentences.length - 1;
  let lastSentence = sentences[lastIndex] ?? "";
  let fallbackUsed = false;
  let questionTrimmed = false;

  const trimmedLast = lastSentence.trim();
  const wordCount = countWords(trimmedLast);
  const isQuestion = /\?\s*$/.test(trimmedLast);

  if (isQuestion && wordCount <= 12) {
    return { sentences, fallbackUsed, questionTrimmed };
  }

  if (isQuestion && wordCount > 12) {
    lastSentence = trimQuestionToWords(trimmedLast, 12);
    questionTrimmed = true;
    const updated = [...sentences];
    updated[lastIndex] = lastSentence;
    return { sentences: updated, fallbackUsed, questionTrimmed };
  }

  const fallback =
    fallbackQuestions[sentences.length % Math.max(1, fallbackQuestions.length)] ??
    fallbackQuestions[0] ??
    "Was denkst du darüber?";
  fallbackUsed = true;
  const question = ensureQuestion(fallback);

  if (sentences.length >= maxSentences) {
    const updated = [...sentences];
    updated[lastIndex] = question;
    return { sentences: updated, fallbackUsed, questionTrimmed };
  }

  return { sentences: [...sentences, question], fallbackUsed, questionTrimmed };
}

function ensureQuestion(text: string): string {
  const cleaned = text.trim().replace(/[?!]+$/g, "");
  return `${cleaned}?`;
}

function trimQuestionToWords(question: string, maxWords: number): string {
  const words = question.replace(/[?]+$/g, "").split(/\s+/).filter(Boolean);
  const limited = words.slice(0, Math.max(1, maxWords));
  return `${limited.join(" ")}?`;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export const DISCUSSION_FALLBACK_QUESTIONS = [
  "Was spricht aus deiner Sicht am meisten dagegen?",
  "Welcher Punkt überzeugt dich am ehesten?",
  "Wo würdest du die Grenze ziehen?",
];
