import { SaveData, SemesterId, StoryStep } from "@/lib/game/types";
import { SAVE_VERSION, clampStat } from "@/lib/game/utils";

export type FlavorRequest = {
  playerName: string;
  character: string;
  sceneTitle: string;
  sceneSummary: string;
  promptSeed: string;
  nextFlavorPrompt: string;
  stats: {
    academics: number;
    social: number;
    mental: number;
    finances: number;
  };
};

const MAX_PLAYER_NAME_LENGTH = 48;
const MAX_SHORT_TEXT_LENGTH = 120;
const MAX_MEDIUM_TEXT_LENGTH = 320;
const MAX_LONG_TEXT_LENGTH = 600;
const MAX_SAVE_BODY_BYTES = 32_000;
const MAX_FLAVOR_BODY_BYTES = 4_000;
const STORY_STEPS: StoryStep[] = ["arrival", "planner", "scene", "reflection", "summary", "phone"];
const SEMESTER_IDS: SemesterId[] = [
  "freshman-fall",
  "freshman-spring",
  "sophomore-fall",
  "sophomore-spring",
  "junior-fall",
  "junior-spring",
  "senior-fall",
  "senior-spring"
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeString(value: unknown, maxLength: number, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().slice(0, maxLength);
}

function normalizeStringArray(value: unknown, maxItems: number, maxLength: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .slice(0, maxItems)
    .map((entry) => entry.trim().slice(0, maxLength))
    .filter(Boolean);
}

function normalizeStats(value: unknown) {
  const stats = isRecord(value) ? value : {};

  return {
    academics: clampStat(Number(stats.academics) || 0),
    social: clampStat(Number(stats.social) || 0),
    mental: clampStat(Number(stats.mental) || 0),
    finances: clampStat(Number(stats.finances) || 0)
  };
}

function normalizeRelationships(value: unknown) {
  const relationships = isRecord(value) ? value : {};

  return {
    professorAlden: clampStat(Number(relationships.professorAlden) || 0),
    mina: clampStat(Number(relationships.mina) || 0),
    homeFriends: clampStat(Number(relationships.homeFriends) || 0),
    derek: clampStat(Number(relationships.derek) || 0)
  };
}

function normalizeCommunication(value: unknown) {
  const communication = isRecord(value) ? value : {};

  const normalizeThread = (threadValue: unknown) => {
    const thread = isRecord(threadValue) ? threadValue : {};

    return {
      sent: Math.max(0, Math.min(24, Number(thread.sent) || 0)),
      ignored: Math.max(0, Math.min(24, Number(thread.ignored) || 0)),
      lastChoiceId: normalizeString(thread.lastChoiceId, MAX_SHORT_TEXT_LENGTH)
    };
  };

  return {
    homeFriends: normalizeThread(communication.homeFriends),
    mina: normalizeThread(communication.mina),
    derek: normalizeThread(communication.derek)
  };
}

function normalizeCommunicationThreadIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .filter((entry) => entry === "homeFriends" || entry === "mina" || entry === "derek")
    .slice(0, 3);
}

export function getBodySizeBytes(body: unknown) {
  return Buffer.byteLength(JSON.stringify(body ?? {}), "utf8");
}

export function validateFlavorRequest(body: unknown) {
  if (!isRecord(body)) {
    return { ok: false as const, reason: "invalid-body" };
  }

  if (getBodySizeBytes(body) > MAX_FLAVOR_BODY_BYTES) {
    return { ok: false as const, reason: "body-too-large" };
  }

  return {
    ok: true as const,
    value: {
      playerName: normalizeString(body.playerName, MAX_PLAYER_NAME_LENGTH, "Freshman"),
      character: normalizeString(body.character, MAX_SHORT_TEXT_LENGTH, "Someone"),
      sceneTitle: normalizeString(body.sceneTitle, MAX_SHORT_TEXT_LENGTH, "A quiet moment"),
      sceneSummary: normalizeString(body.sceneSummary, MAX_LONG_TEXT_LENGTH),
      promptSeed: normalizeString(body.promptSeed, MAX_MEDIUM_TEXT_LENGTH),
      nextFlavorPrompt: normalizeString(body.nextFlavorPrompt, MAX_MEDIUM_TEXT_LENGTH),
      stats: normalizeStats(body.stats)
    } satisfies FlavorRequest
  };
}

export function validateSaveData(body: unknown, userId: string) {
  if (!isRecord(body)) {
    return { ok: false as const, reason: "invalid-body" };
  }

  if (getBodySizeBytes(body) > MAX_SAVE_BODY_BYTES) {
    return { ok: false as const, reason: "body-too-large" };
  }

  const currentSemesterId = SEMESTER_IDS.includes(body.currentSemesterId as SemesterId)
    ? (body.currentSemesterId as SemesterId)
    : "freshman-fall";
  const pendingSemesterId =
    body.pendingSemesterId && SEMESTER_IDS.includes(body.pendingSemesterId as SemesterId)
      ? (body.pendingSemesterId as SemesterId)
      : null;
  const step = STORY_STEPS.includes(body.step as StoryStep) ? (body.step as StoryStep) : "arrival";
  const choiceHistory = Array.isArray(body.choiceHistory)
    ? body.choiceHistory
        .filter(isRecord)
        .slice(0, 64)
        .map((entry) => ({
          sceneId: normalizeString(entry.sceneId, MAX_SHORT_TEXT_LENGTH),
          choiceId: normalizeString(entry.choiceId, MAX_SHORT_TEXT_LENGTH)
        }))
        .filter((entry) => entry.sceneId && entry.choiceId)
    : [];
  const semesterHistory = Array.isArray(body.semesterHistory)
    ? body.semesterHistory
        .filter(isRecord)
        .slice(0, 8)
        .map((entry) => ({
          semesterId: SEMESTER_IDS.includes(entry.semesterId as SemesterId)
            ? (entry.semesterId as SemesterId)
            : "freshman-fall",
          focusIds: normalizeStringArray(entry.focusIds, 4, MAX_SHORT_TEXT_LENGTH),
          choiceHistory: Array.isArray(entry.choiceHistory)
            ? entry.choiceHistory
                .filter(isRecord)
                .slice(0, 64)
                .map((choice) => ({
                  sceneId: normalizeString(choice.sceneId, MAX_SHORT_TEXT_LENGTH),
                  choiceId: normalizeString(choice.choiceId, MAX_SHORT_TEXT_LENGTH)
                }))
                .filter((choice) => choice.sceneId && choice.choiceId)
            : [],
          reflection: normalizeString(entry.reflection, MAX_LONG_TEXT_LENGTH),
          completedAt: normalizeString(entry.completedAt, 40, new Date().toISOString())
        }))
    : [];

  const sanitizedSave: SaveData = {
    version: SAVE_VERSION,
    playerName: normalizeString(body.playerName, MAX_PLAYER_NAME_LENGTH, "Freshman"),
    playerId: userId,
    currentSemesterId,
    pendingSemesterId,
    step,
    focusIds: normalizeStringArray(body.focusIds, 3, MAX_SHORT_TEXT_LENGTH),
    stats: normalizeStats(body.stats),
    relationships: normalizeRelationships(body.relationships),
    communication: normalizeCommunication(body.communication),
    semesterTextedThreadIds: normalizeCommunicationThreadIds(body.semesterTextedThreadIds),
    sceneIndex: Math.max(0, Math.min(8, Number(body.sceneIndex) || 0)),
    phoneThreadIndex: Math.max(0, Math.min(4, Number(body.phoneThreadIndex) || 0)),
    choiceHistory,
    storyFlags: normalizeStringArray(body.storyFlags, 128, MAX_SHORT_TEXT_LENGTH),
    reflection: normalizeString(body.reflection, MAX_LONG_TEXT_LENGTH),
    semesterHistory,
    updatedAt: new Date().toISOString()
  };

  return {
    ok: true as const,
    value: sanitizedSave
  };
}
