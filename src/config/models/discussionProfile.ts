export const DISCUSSION_MODEL_PROFILE = {
  id: "meta-llama/llama-3.1-8b-instruct",
  label: "Discussion Short",
  parameters: {
    temperature: 0.8,
    top_p: 0.9,
    presence_penalty: 0.2,
    max_tokens: 480,
  },
} as const;

export type DiscussionModelProfile = typeof DISCUSSION_MODEL_PROFILE;
