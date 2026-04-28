import { DEFAULT_STATS, semesterFocuses, semesterScenes } from "@/lib/game/data";
import { SaveData, StatKey, Stats } from "@/lib/game/types";

export const SAVE_VERSION = 1;
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

export function createNewSave(playerName: string, playerId: string): SaveData {
  return {
    version: SAVE_VERSION,
    playerName,
    playerId,
    step: "arrival",
    focusIds: [],
    stats: { ...DEFAULT_STATS },
    sceneIndex: 0,
    choiceHistory: [],
    reflection: "",
    updatedAt: new Date().toISOString()
  };
}

export function slugifyPlayer(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "freshman";
}

export function getFocusById(id: string) {
  return semesterFocuses.find((focus) => focus.id === id);
}

export function getSceneByIndex(index: number) {
  return semesterScenes[index] ?? null;
}

export function summarizeSemester(save: SaveData) {
  const focusText = save.focusIds
    .map((id) => getFocusById(id)?.label)
    .filter(Boolean)
    .join(", ");

  return `Player ${save.playerName} prioritized ${focusText}. Final stats were academics ${save.stats.academics}, social ${save.stats.social}, mental health ${save.stats.mental}, finances ${save.stats.finances}.`;
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
