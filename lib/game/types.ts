export type StatKey = "academics" | "social" | "mental" | "finances";
export type RelationshipKey = "professorAlden" | "mina" | "homeFriends" | "derek";
export type SemesterId =
  | "freshman-fall"
  | "freshman-spring"
  | "sophomore-fall"
  | "sophomore-spring"
  | "junior-fall"
  | "junior-spring"
  | "senior-fall"
  | "senior-spring";

export type Stats = Record<StatKey, number>;
export type Relationships = Record<RelationshipKey, number>;

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
  relationshipEffects?: Partial<Relationships>;
  flags?: string[];
  nextFlavorPrompt: string;
};

export type SceneDefinition = {
  id: string;
  title: string;
  setting: string;
  background: string;
  character: string;
  locationId: string;
  locationLabel: string;
  summary: string;
  promptSeed: string;
  choices: SceneChoice[];
};

export type SemesterDefinition = {
  id: SemesterId;
  title: string;
  badge: string;
  arrivalTitle: string;
  arrivalCopy: string;
  plannerPrompt: string;
  reflectionPrompt: string;
};

export type SemesterRecord = {
  semesterId: SemesterId;
  focusIds: string[];
  choiceHistory: {
    sceneId: string;
    choiceId: string;
  }[];
  reflection: string;
  completedAt: string;
};

export type StoryStep = "arrival" | "planner" | "scene" | "reflection" | "summary";

export type SaveData = {
  version: number;
  playerName: string;
  playerId: string;
  currentSemesterId: SemesterId;
  step: StoryStep;
  focusIds: string[];
  stats: Stats;
  relationships: Relationships;
  sceneIndex: number;
  choiceHistory: {
    sceneId: string;
    choiceId: string;
  }[];
  reflection: string;
  semesterHistory: SemesterRecord[];
  updatedAt: string;
};
