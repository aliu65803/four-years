import {
  DEFAULT_RELATIONSHIPS,
  DEFAULT_STATS,
  relationshipLabels,
  sceneDefinitionsById,
  semesterDefinitions,
  semesterFocuses
} from "@/lib/game/data";
import {
  Relationships,
  SaveData,
  SceneDefinition,
  SemesterId,
  StatKey,
  Stats
} from "@/lib/game/types";

export const SAVE_VERSION = 3;

export function getSaveStorageKey(userId: string) {
  return `four-years-save:${userId}`;
}

export function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function applyEffects(stats: Stats, effects: Partial<Stats>) {
  const nextStats = { ...stats };

  (Object.keys(effects) as StatKey[]).forEach((key) => {
    nextStats[key] = clampStat(nextStats[key] + (effects[key] ?? 0));
  });

  return nextStats;
}

export function applyRelationshipEffects(
  relationships: Relationships,
  effects: Partial<Relationships> | undefined
) {
  if (!effects) {
    return relationships;
  }

  const nextRelationships = { ...relationships };

  (Object.keys(effects) as (keyof Relationships)[]).forEach((key) => {
    nextRelationships[key] = clampStat(nextRelationships[key] + (effects[key] ?? 0));
  });

  return nextRelationships;
}

export function createNewSave(playerName: string, playerId: string): SaveData {
  return {
    version: SAVE_VERSION,
    playerName,
    playerId,
    currentSemesterId: "freshman-fall",
    step: "arrival",
    focusIds: [],
    stats: { ...DEFAULT_STATS },
    relationships: { ...DEFAULT_RELATIONSHIPS },
    sceneIndex: 0,
    choiceHistory: [],
    reflection: "",
    semesterHistory: [],
    updatedAt: new Date().toISOString()
  };
}

export function getFocusById(id: string) {
  return semesterFocuses.find((focus) => focus.id === id);
}

export function getSemesterDefinition(semesterId: SemesterId) {
  return semesterDefinitions[semesterId];
}

export function getSemesterScenePlan(save: Pick<SaveData, "currentSemesterId" | "focusIds" | "stats" | "relationships">) {
  if (save.currentSemesterId === "freshman-fall") {
    const fallCapstone = save.focusIds.includes("campus-job")
      ? sceneDefinitionsById["student-center-shift"]
      : sceneDefinitionsById["library-late-floor"];

    return [
      sceneDefinitionsById["professor-office-hours"],
      sceneDefinitionsById["dorm-rooftop"],
      fallCapstone
    ];
  }

  if (save.currentSemesterId === "freshman-spring") {
    const aldenScene =
      save.stats.academics >= 66 || save.relationships.professorAlden >= 56
        ? sceneDefinitionsById["alden-journal-invite"]
        : sceneDefinitionsById["alden-reset-conference"];

    const minaScene =
      save.relationships.mina >= 56 ? sceneDefinitionsById["mina-almost-confession"] : sceneDefinitionsById["mina-group-static"];

    const variableScene = save.focusIds.includes("campus-job")
      ? sceneDefinitionsById["student-center-promotion"]
      : sceneDefinitionsById["library-symposium"];

    return [aldenScene, minaScene, sceneDefinitionsById["home-friends-call"], variableScene];
  }

  if (save.currentSemesterId === "sophomore-fall") {
    const aldenScene =
      save.relationships.professorAlden >= 62 || save.stats.academics >= 74
        ? sceneDefinitionsById["alden-independent-study"]
        : sceneDefinitionsById["alden-shifting-center"];

    const derekScene =
      save.relationships.derek >= 42 ? sceneDefinitionsById["derek-study-break"] : sceneDefinitionsById["derek-open-mic"];

    const minaScene =
      save.relationships.mina >= 62 ? sceneDefinitionsById["mina-crossfade"] : sceneDefinitionsById["mina-parallel-lives"];

    const variableScene = save.focusIds.includes("campus-job")
      ? sceneDefinitionsById["apartment-budget"]
      : sceneDefinitionsById["major-declaration"];

    return [aldenScene, derekScene, minaScene, variableScene];
  }

  if (save.currentSemesterId === "sophomore-spring") {
    const derekScene =
      save.relationships.derek >= 48 ? sceneDefinitionsById["derek-night-walk"] : sceneDefinitionsById["derek-study-break"];

    const variableScene = save.focusIds.includes("campus-job")
      ? sceneDefinitionsById["future-fair"]
      : sceneDefinitionsById["independent-showcase"];

    return [derekScene, sceneDefinitionsById["home-friends-visit"], sceneDefinitionsById["mina-fault-line"], variableScene];
  }

  if (save.currentSemesterId === "junior-fall") {
    const aldenScene =
      save.relationships.professorAlden >= 66 || save.stats.academics >= 82
        ? sceneDefinitionsById["alden-rec-letter"]
        : sceneDefinitionsById["alden-professionalization"];

    const variableScene = save.focusIds.includes("campus-job")
      ? sceneDefinitionsById["internship-fair"]
      : sceneDefinitionsById["research-deadline"];

    return [aldenScene, sceneDefinitionsById["derek-calendar-night"], sceneDefinitionsById["mina-anchor-night"], variableScene];
  }

  if (save.currentSemesterId === "junior-spring" && save.stats.mental <= 45) {
    return [
      sceneDefinitionsById["derek-burnout-checkin"],
      sceneDefinitionsById["mina-poster-room"],
      sceneDefinitionsById["burnout-wall"],
      sceneDefinitionsById["offer-email"]
    ];
  }

  if (save.currentSemesterId === "junior-spring") {
    const derekScene =
      save.relationships.derek >= 60 ? sceneDefinitionsById["derek-burnout-checkin"] : sceneDefinitionsById["derek-night-walk"];

    const variableScene = save.focusIds.includes("campus-job")
      ? sceneDefinitionsById["offer-email"]
      : sceneDefinitionsById["internship-fair"];

    return [derekScene, sceneDefinitionsById["home-friends-visit"], sceneDefinitionsById["mina-poster-room"], variableScene];
  }

  if (save.currentSemesterId === "senior-fall") {
    const aldenScene =
      save.relationships.professorAlden >= 70 || save.stats.academics >= 86
        ? sceneDefinitionsById["alden-farewell-advice"]
        : sceneDefinitionsById["alden-last-draft"];

    const variableScene = save.focusIds.includes("campus-job")
      ? sceneDefinitionsById["leadership-handoff"]
      : sceneDefinitionsById["capstone-choice"];

    return [aldenScene, sceneDefinitionsById["derek-postgrad-talk"], sceneDefinitionsById["mina-keepsake-night"], variableScene];
  }

  const variableScene = save.focusIds.includes("campus-job")
    ? sceneDefinitionsById["graduation-morning"]
    : sceneDefinitionsById["capstone-choice"];

  return [sceneDefinitionsById["derek-graduation-quiet"], sceneDefinitionsById["mina-last-bench"], variableScene, sceneDefinitionsById["graduation-morning"]];
}

export function getSceneFromPlan(
  save: Pick<SaveData, "currentSemesterId" | "focusIds" | "stats" | "relationships">,
  index: number
) {
  return getSemesterScenePlan(save)[index] ?? null;
}

export function getVisitedLocationIds(save: SaveData) {
  const plan = getSemesterScenePlan(save);
  const visited = new Set<string>([
    save.currentSemesterId === "freshman-fall" ? "campus-gate" : "north-dorm",
    "north-dorm"
  ]);

  for (let i = 0; i < save.choiceHistory.length; i += 1) {
    const scene = plan[i];
    if (scene) {
      visited.add(scene.locationId);
    }
  }

  const currentScene = plan[save.sceneIndex];
  if (save.step === "scene" && currentScene) {
    visited.add(currentScene.locationId);
  }

  if (save.step === "reflection" || save.step === "summary") {
    visited.add("lake-path");
  }

  return visited;
}

export function summarizeSemester(save: SaveData) {
  const semester = getSemesterDefinition(save.currentSemesterId);
  const focusText = save.focusIds
    .map((id) => getFocusById(id)?.label)
    .filter(Boolean)
    .join(", ");

  return `During ${semester.title}, ${save.playerName} prioritized ${focusText}. Their cumulative stats now sit at academics ${save.stats.academics}, social life ${save.stats.social}, mental health ${save.stats.mental}, and finances ${save.stats.finances}.`;
}

export function describeRelationships(relationships: Relationships) {
  return Object.entries(relationships)
    .map(([key, value]) => `${relationshipLabels[key as keyof Relationships]} ${value}`)
    .join(", ");
}

export function getDominantStat(stats: Stats) {
  return (Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "academics") as StatKey;
}

export function getLowestStat(stats: Stats) {
  return (Object.entries(stats).sort((a, b) => a[1] - b[1])[0]?.[0] ?? "mental") as StatKey;
}

export function buildReflection(save: SaveData) {
  const dominant = getDominantStat(save.stats);
  const lowest = getLowestStat(save.stats);

  if (save.currentSemesterId === "freshman-spring") {
    const minaText =
      save.relationships.mina >= 58
        ? "Mina now feels less like a lucky first-semester encounter and more like proof that college can actually give you real people."
        : "Even the friendships that matter are starting to reveal how much effort it takes to turn new closeness into something lasting.";
    const homeText =
      save.relationships.homeFriends >= 70
        ? "Back home did not disappear, but it changed shape once you learned how to talk honestly across the distance."
        : "The people who knew you first are still there, but spring taught you that love does not always protect a friendship from drift.";

    return `${minaText} ${homeText} ${save.playerName} is more confident now, but confidence has not made life simpler. It has only made the tradeoffs clearer.`;
  }

  if (save.currentSemesterId === "sophomore-fall") {
    const derekText =
      save.relationships.derek >= 52
        ? "Derek arrived like a version of ease you no longer trust automatically, which is probably why you keep thinking about him anyway."
        : "Some new people feel promising precisely because they do not yet know the old stories you still carry.";
    const minaText =
      save.relationships.mina >= 60
        ? "Mina has become part of the architecture of your college life, which is exactly why keeping the friendship strong now takes intention instead of luck."
        : "Not every important connection breaks loudly. Some just begin asking more maintenance than either person expected to need.";

    return `${derekText} ${minaText} Sophomore fall taught ${save.playerName} that confidence is not the same thing as clarity. It only gives you the courage to feel the split more fully.`;
  }

  if (save.currentSemesterId === "sophomore-spring") {
    const futureText =
      save.stats.academics >= 78 || save.stats.finances >= 70
        ? "The future has started taking shape in visible ways now, which is thrilling right up until it becomes terrifying."
        : "The future still feels blurry, but blur can be its own kind of truth when certainty would be a lie.";
    const romanceText =
      save.relationships.derek >= 58
        ? "Derek made it harder to pretend that wanting something new is the same as being ready for it."
        : "Love, or almost-love, stayed at the edge of your life this year, asking questions you did not always answer.";

    return `${futureText} ${romanceText} By the end of sophomore spring, ${save.playerName} understands that adulthood is beginning not when everything makes sense, but when you keep choosing anyway.`;
  }

  if (save.currentSemesterId === "junior-fall") {
    const derekText =
      save.relationships.derek >= 66
        ? "Derek has become proof that a real relationship can survive pressure, but only if you let love take up actual time instead of leftover time."
        : "Even a real relationship can start feeling theoretical if ambition gets every first and best hour of you.";
    const futureText =
      save.stats.academics >= 84 || save.stats.finances >= 74
        ? "The future finally looks close enough to touch, which is exciting right up until it starts feeling like a verdict."
        : "The future keeps demanding a version of confidence you do not always feel, but junior fall taught you how to keep moving anyway.";

    return `${derekText} ${futureText} Junior fall gave ${save.playerName} velocity. The harder question is whether velocity is the same thing as a life you can sustain.`;
  }

  if (save.currentSemesterId === "junior-spring") {
    const minaText =
      save.relationships.mina >= 68
        ? "Mina became the person who could still find the human shape of you after ambition had flattened the rest."
        : "You learned that even the friendships that anchor you need honesty and maintenance when life gets this sharp.";
    const burnoutText =
      save.stats.mental <= 48
        ? "Burnout stopped being a metaphor this semester. It became something with a body, a cost, and a voice."
        : "You held yourself together impressively this semester, but not without learning how fragile impressive can be.";

    return `${minaText} ${burnoutText} By the end of junior spring, ${save.playerName} is no longer wondering whether adulthood is beginning. It already has.`;
  }

  if (save.currentSemesterId === "senior-fall") {
    const derekText =
      save.relationships.derek >= 72
        ? "Derek stopped being a campus chapter and became someone you now have to imagine in the grammar of a real life."
        : "Love stayed real this year, but senior fall proved that even real love has to survive logistics, fear, and separate futures.";
    const minaText =
      save.relationships.mina >= 72
        ? "Mina became one of the people who will always be inside your definition of home, no matter where you live next."
        : "You learned that even anchor friendships need to be chosen on purpose when everyone is starting to leave.";

    return `${derekText} ${minaText} Senior fall taught ${save.playerName} that endings are not only about loss. They are also about deciding what deserves to be carried forward.`;
  }

  if (save.currentSemesterId === "senior-spring") {
    const futureTone =
      save.stats.finances >= 78 || save.stats.academics >= 88
        ? "You leave college with a future sharp enough to name."
        : "You leave college without every answer, but with a truer sense of what kind of life you can actually inhabit.";
    const relationshipTone =
      save.relationships.derek >= 74 && save.relationships.mina >= 72
        ? "The people you chose became part of the ending, which is another way of saying they became part of the beginning too."
        : "Not everything survived unchanged, but enough did to prove that the person you became here was real.";

    return `${futureTone} ${relationshipTone} ${save.playerName} arrives at graduation understanding that adulthood is not a solved equation. It is a life you keep consenting to, one concrete choice at a time.`;
  }

  const openings: Record<StatKey, string> = {
    academics: "You leave the semester with your backpack heavier and your confidence quieter, but real.",
    social: "By December, campus feels less like a maze and more like a map with names on it.",
    mental: "The biggest thing you built this semester was not a resume line but a way to keep breathing inside the noise.",
    finances: "You learned that survival has its own intelligence, and every careful decision carried a private cost."
  };

  const tensions: Record<StatKey, string> = {
    academics: "Still, your classes kept asking who you become when effort alone is not enough.",
    social: "Still, there were nights when laughter ended and uncertainty rushed back in.",
    mental: "Still, protecting yourself often meant letting something else go.",
    finances: "Still, every dollar saved seemed to steal time from somewhere softer."
  };

  return `${openings[dominant]} ${tensions[lowest]} ${save.playerName} is not finished becoming someone yet, but freshman fall gave them the first outline.`;
}

export function getNextSemesterId(currentSemesterId: SemesterId) {
  if (currentSemesterId === "freshman-fall") {
    return "freshman-spring";
  }

  if (currentSemesterId === "freshman-spring") {
    return "sophomore-fall";
  }

  if (currentSemesterId === "sophomore-fall") {
    return "sophomore-spring";
  }

  if (currentSemesterId === "sophomore-spring") {
    return "junior-fall";
  }

  if (currentSemesterId === "junior-fall") {
    return "junior-spring";
  }

  if (currentSemesterId === "junior-spring") {
    return "senior-fall";
  }

  if (currentSemesterId === "senior-fall") {
    return "senior-spring";
  }

  return null;
}

export function normalizeSave(rawSave: SaveData): SaveData {
  if (
    rawSave.version >= SAVE_VERSION &&
    rawSave.currentSemesterId &&
    rawSave.relationships &&
    typeof rawSave.relationships.derek === "number" &&
    rawSave.semesterHistory
  ) {
    return rawSave;
  }

  const baseSave: SaveData = {
    version: SAVE_VERSION,
    playerName: rawSave.playerName,
    playerId: rawSave.playerId,
    currentSemesterId: rawSave.currentSemesterId ?? "freshman-fall",
    step: rawSave.step,
    focusIds: rawSave.focusIds ?? [],
    stats: rawSave.stats ?? { ...DEFAULT_STATS },
    relationships: { ...DEFAULT_RELATIONSHIPS, ...(rawSave.relationships ?? {}) },
    sceneIndex: rawSave.sceneIndex ?? 0,
    choiceHistory: rawSave.choiceHistory ?? [],
    reflection: rawSave.reflection ?? "",
    semesterHistory: rawSave.semesterHistory ?? [],
    updatedAt: rawSave.updatedAt ?? new Date().toISOString()
  };

  const fallPlan = getSemesterScenePlan(baseSave);
  const migratedRelationships = baseSave.choiceHistory.reduce((acc, entry, index) => {
    const scene = fallPlan[index];
    const choice = scene?.choices.find((candidate) => candidate.id === entry.choiceId);
    return applyRelationshipEffects(acc, choice?.relationshipEffects);
  }, { ...DEFAULT_RELATIONSHIPS });

  return {
    ...baseSave,
    relationships: migratedRelationships
  };
}

export function buildSemesterAdvance(save: SaveData): SaveData | null {
  const nextSemesterId = getNextSemesterId(save.currentSemesterId);
  if (!nextSemesterId) {
    return null;
  }

  return {
    ...save,
    currentSemesterId: nextSemesterId,
    step: "arrival" as const,
    focusIds: [],
    sceneIndex: 0,
    choiceHistory: [],
    reflection: "",
    semesterHistory: [
      ...save.semesterHistory,
      {
        semesterId: save.currentSemesterId,
        focusIds: save.focusIds,
        choiceHistory: save.choiceHistory,
        reflection: save.reflection,
        completedAt: new Date().toISOString()
      }
    ],
    updatedAt: new Date().toISOString()
  };
}
