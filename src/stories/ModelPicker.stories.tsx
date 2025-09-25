import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { vi } from "vitest";

import ModelPicker from "../components/ModelPicker";
import * as modelCatalog from "../config/models";

// Mock the model catalog
const mockModels = [
  {
    id: "openai/gpt-4o",
    label: "GPT-4o",
    provider: "OpenAI",
    ctx: 128000,
    pricing: { in: 0.005, out: 0.015 },
    safety: "moderate",
    tags: [],
  },
  {
    id: "google/gemini-pro-1.5",
    label: "Gemini Pro 1.5",
    provider: "Google",
    ctx: 1000000,
    pricing: { in: 0.0025, out: 0.0075 },
    safety: "moderate",
    tags: ["google"],
  },
  {
    id: "anthropic/claude-3-opus",
    label: "Claude 3 Opus",
    provider: "Anthropic",
    ctx: 200000,
    pricing: { in: 0.015, out: 0.075 },
    safety: "strict",
    tags: [],
  },
  {
    id: "mistralai/mistral-large",
    label: "Mistral Large",
    provider: "Mistral",
    ctx: 32000,
    pricing: { in: 0.008, out: 0.024 },
    safety: "moderate",
    tags: [],
  },
  {
    id: "codellama/codellama-70b",
    label: "Code Llama 70B",
    provider: "Meta",
    ctx: 16000,
    pricing: { in: 0.001, out: 0.001 },
    safety: "moderate",
    tags: ["code"],
  },
  {
    id: "microsoft/phi-3-mini",
    label: "Phi-3 Mini",
    provider: "Microsoft",
    ctx: 4000,
    pricing: { in: 0, out: 0 },
    safety: "free",
    tags: ["free"],
  },
];

// Properly mock the module function using Vitest
vi.spyOn(modelCatalog, "loadModelCatalog").mockResolvedValue(mockModels);

const meta: Meta<typeof ModelPicker> = {
  title: "App/ModelPicker",
  component: ModelPicker,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    value: { control: "text" },
    onChange: { action: "onChange" },
  },
  // Use a render function to manage state for the controlled component
  render: (args) => {
    const [value, setValue] = React.useState(args.value || mockModels[0].id);

    const handleChange = (newValue: string) => {
      setValue(newValue);
      args.onChange(newValue);
    };

    return (
      <div className="bg-bg-base p-4">
        <ModelPicker {...args} value={value} onChange={handleChange} />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    policyFromRole: "any",
  },
};

export const FilteredByRolePolicy: Story = {
  args: {
    policyFromRole: "strict",
    // In a real scenario, the list would be pre-filtered by the logic.
    // Here, we just show the warning banner.
  },
};
