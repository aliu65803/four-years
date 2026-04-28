export type StatKey = "academics" | "social" | "mental" | "finances";

export type Stats = Record<StatKey, number>;

export type SemesterFocus = {
  id: string;
  label: string;
  description: string;
  statEffects: Partial<Stats>;
  flavor: string;
};

export type SceneChoice = {
  id: string;
  label: string;
  description: string;
  statEffects: Partial<Stats>;
  flags?: string[];
  nextFlavorPrompt: string;
};

export type SceneDefinition = {
  id: string;
  title: string;
  setting: string;
  background: string;
  character: string;
  summary: string;
  promptSeed: string;
  choices: SceneChoice[];
};

export type StoryStep = "arrival" | "planner" | "scene" | "reflection" | "summary";

export type SaveData = {
  version: number;
  playerName: string;
  playerId: string;
  step: StoryStep;
  focusIds: string[];
  stats: Stats;
  sceneIndex: number;
  choiceHistory: {
    sceneId: string;
    choiceId: string;
  }[];
  reflection: string;
  updatedAt: string;
};
