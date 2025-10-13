import { describe, expect, it } from "vitest";

import { DISCUSSION_FALLBACK_QUESTIONS, shapeDiscussionResponse } from "../../discussion/shape";

describe("shapeDiscussionResponse", () => {
  it("trims to max sentences and ensures question", () => {
    const raw =
      "Erstens finde ich das Thema spannend. Außerdem gibt es so viele Blickwinkel, die wir betrachten können. Manche Leute sagen, es sei übertrieben, andere halten es für unausweichlich. Vermutlich liegen beide Seiten daneben. Ich persönlich neige zu vorsichtigem Optimismus, obwohl wir vieles nicht wissen. Und natürlich bleibt die Frage, wie wir konkret damit umgehen. Was meinst du dazu? Dennoch gibt es Widerstände, die man nicht unterschätzen sollte. Wir sollten den Aufwand realistisch einschätzen. Vielleicht hilft eine kleine Analogie: Es fühlt sich an wie ein Straßenfest, das jedes Jahr ein bisschen größer wird. Letztlich zählt, ob wir dranbleiben. Würdest du mitziehen?";

    const result = shapeDiscussionResponse(raw, {
      minSentences: 5,
      maxSentences: 10,
      fallbackQuestions: DISCUSSION_FALLBACK_QUESTIONS,
    });

    expect(result.sentences.length).toBeLessThanOrEqual(10);
    expect(result.text.split(".").length).toBeGreaterThan(1);
    expect(result.text.trim().endsWith("?")).toBe(true);
  });

  it("adds fallback question when missing", () => {
    const raw =
      "Ich sehe da vor allem Chancen. Wir wissen natürlich nicht, ob der Plan funktioniert. Trotzdem bin ich vorsichtig positiv.";

    const result = shapeDiscussionResponse(raw, {
      minSentences: 5,
      maxSentences: 10,
      fallbackQuestions: DISCUSSION_FALLBACK_QUESTIONS,
    });

    expect(result.fallbackUsed).toBe(true);
    expect(result.text.endsWith("?")).toBe(true);
  });

  it("shortens long question", () => {
    const raw =
      "Das könnte durchaus passieren. Ich vermute, dass wir noch Überraschungen sehen. Trotzdem bleibe ich skeptisch, weil einfach zu viele Variablen offen sind. Wie siehst du das, wenn du alle Auswirkungen auf die gesamte Lieferkette und die internationale Zusammenarbeit mitdenkst?";

    const result = shapeDiscussionResponse(raw, {
      minSentences: 5,
      maxSentences: 10,
      fallbackQuestions: DISCUSSION_FALLBACK_QUESTIONS,
    });

    const lastSentence = result.sentences[result.sentences.length - 1] ?? "";
    const wordCount = lastSentence.split(/\s+/).filter(Boolean).length;
    expect(wordCount).toBeLessThanOrEqual(12);
    expect(lastSentence.endsWith("?")).toBe(true);
    expect(result.questionTrimmed).toBe(true);
  });
});
