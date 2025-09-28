import React from "react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";

// A simple wrapper to create sections for the showcase
const ShowcaseSection = ({
  title,
  children,
  ...props
}: {
  title: string;
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <div className="mb-12" {...props}>
    <h2 className="mb-4 border-b pb-2 text-2xl font-bold">{title}</h2>
    <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">{children}</div>
  </div>
);

// A wrapper for demonstrating component states
const StateWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4">
    <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">{title}</p>
    <div className="flex flex-wrap items-center gap-4">{children}</div>
  </div>
);

export default function DesignSystemPage() {
  return (
    <div className="bg-white p-8 text-black dark:bg-black dark:text-white">
      <h1 className="mb-8 text-4xl font-bold">Design System Showcase</h1>

      {/* Buttons Showcase */}
      <ShowcaseSection title="Buttons" data-testid="showcase-buttons">
        <StateWrapper title="Variants">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </StateWrapper>
        <Separator className="my-6" />
        <StateWrapper title="Sizes">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">⚙️</Button>
        </StateWrapper>
        <Separator className="my-6" />
        <StateWrapper title="Disabled">
          <Button disabled variant="default">
            Default
          </Button>
          <Button disabled variant="destructive">
            Destructive
          </Button>
          <Button disabled variant="outline">
            Outline
          </Button>
        </StateWrapper>
      </ShowcaseSection>

      {/* Cards Showcase */}
      <ShowcaseSection title="Cards" data-testid="showcase-cards">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>This is a basic card.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Here is the card content.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card with an Action</CardTitle>
              <CardDescription>This card has a button in it.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Action Button</Button>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      {/* Inputs Showcase */}
      <ShowcaseSection title="Inputs" data-testid="showcase-inputs">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="input-default">Default</Label>
            <Input id="input-default" placeholder="Enter text..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="input-disabled">Disabled</Label>
            <Input id="input-disabled" placeholder="Enter text..." disabled />
          </div>
        </div>
      </ShowcaseSection>
    </div>
  );
}
