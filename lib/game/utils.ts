import {
  DEFAULT_COMMUNICATION,
  DEFAULT_RELATIONSHIPS,
  DEFAULT_STATS,
  communicationLabels,
  relationshipLabels,
  sceneDefinitionsById,
  semesterDefinitions,
  semesterFocuses
} from "@/lib/game/data";
import {
  CommunicationHistory,
  CommunicationThreadKey,
  Relationships,
  SaveData,
  SceneDefinition,
  SemesterId,
  StatKey,
  Stats
} from "@/lib/game/types";

export const SAVE_VERSION = 4;

type PhoneChoice = {
  id: string;
  label: string;
  description: string;
  previewReply: string;
  statEffects?: Partial<Stats>;
  relationshipEffects?: Partial<Relationships>;
  threadEffects?: Partial<Record<CommunicationThreadKey, { sent?: number; ignored?: number }>>;
  flags?: string[];
};

type PhoneThreadDefinition = {
  id: CommunicationThreadKey;
  title: string;
  from: string;
  intro: string;
  messages: string[];
  choices: PhoneChoice[];
};

type EndingCard = {
  title: string;
  subtitle: string;
  epilogue: string;
  identityLine: string;
};

type ArchiveEntry = {
  semesterId: SemesterId;
  title: string;
  badge: string;
  yearLabel: string;
  memoryTitle: string;
  memoryNote: string;
  reflectionExcerpt: string;
  focusText: string;
  choiceCount: number;
  isCurrent: boolean;
};

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

export function applyCommunicationEffects(
  communication: CommunicationHistory,
  effects: Partial<Record<CommunicationThreadKey, { sent?: number; ignored?: number }>> | undefined,
  lastChoiceId: string,
  threadId: CommunicationThreadKey
) {
  const nextCommunication: CommunicationHistory = {
    homeFriends: { ...communication.homeFriends },
    mina: { ...communication.mina },
    derek: { ...communication.derek }
  };

  const base = nextCommunication[threadId];
  nextCommunication[threadId] = {
    ...base,
    lastChoiceId
  };

  if (!effects) {
    return nextCommunication;
  }

  (Object.keys(effects) as CommunicationThreadKey[]).forEach((key) => {
    const current = nextCommunication[key];
    const delta = effects[key];
    nextCommunication[key] = {
      sent: Math.max(0, current.sent + (delta?.sent ?? 0)),
      ignored: Math.max(0, current.ignored + (delta?.ignored ?? 0)),
      lastChoiceId: key === threadId ? lastChoiceId : current.lastChoiceId
    };
  });

  return nextCommunication;
}

export function createNewSave(playerName: string, playerId: string): SaveData {
  return {
    version: SAVE_VERSION,
    playerName,
    playerId,
    currentSemesterId: "freshman-fall",
    pendingSemesterId: null,
    step: "arrival",
    focusIds: [],
    stats: { ...DEFAULT_STATS },
    relationships: { ...DEFAULT_RELATIONSHIPS },
    communication: {
      homeFriends: { ...DEFAULT_COMMUNICATION.homeFriends },
      mina: { ...DEFAULT_COMMUNICATION.mina },
      derek: { ...DEFAULT_COMMUNICATION.derek }
    },
    sceneIndex: 0,
    phoneThreadIndex: 0,
    choiceHistory: [],
    storyFlags: [],
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

export function describeCommunication(communication: CommunicationHistory) {
  return (Object.keys(communicationLabels) as CommunicationThreadKey[])
    .map((key) => {
      const thread = communication[key];
      return `${communicationLabels[key]} replied ${thread.sent} times`;
    })
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

export function getPhoneThreads(save: SaveData): PhoneThreadDefinition[] {
  const homeFriendsStrong = save.communication.homeFriends.sent >= 2 || save.relationships.homeFriends >= 72;
  const minaStrong = save.communication.mina.sent >= 2 || save.relationships.mina >= 62;
  const derekReady = save.currentSemesterId !== "freshman-fall" && save.currentSemesterId !== "freshman-spring";
  const derekStrong = save.relationships.derek >= 58 || save.communication.derek.sent >= 2;

  const homeFriendsThread: PhoneThreadDefinition = {
    id: "homeFriends",
    title: "Back Home Group Chat",
    from: "Home Friends",
    intro: "The ride between semesters always makes your phone feel heavier.",
    messages: homeFriendsStrong
      ? [
          "Back Home Group Chat",
          "When are you free over break?",
          "We keep missing each other and it is getting weird in a way I do not want to ignore."
        ]
      : [
          "Back Home Group Chat",
          "We should see you while you are home.",
          "It feels like we only get the shortened version of your life now."
        ],
    choices: [
      {
        id: "home-friends-full-reply",
        label: "Send a real reply",
        description: "Name what changed and still reach toward them.",
        previewReply: "I miss you. I also know I have been hard to catch. I want to do better while I am home.",
        statEffects: { mental: 2, social: 3 },
        relationshipEffects: { homeFriends: 6 },
        threadEffects: { homeFriends: { sent: 1 } },
        flags: ["kept_home_ties"]
      },
      {
        id: "home-friends-brief-reply",
        label: "Keep it warm but short",
        description: "Stay kind without opening the whole feeling.",
        previewReply: "Yes please. I have missed you all too. Let me figure out my schedule and text back.",
        statEffects: { social: 2 },
        relationshipEffects: { homeFriends: 2 },
        threadEffects: { homeFriends: { sent: 1 } }
      },
      {
        id: "home-friends-ignore",
        label: "Leave it unread a little longer",
        description: "Put off the ache of answering.",
        previewReply: "...",
        statEffects: { mental: -2 },
        relationshipEffects: { homeFriends: -5 },
        threadEffects: { homeFriends: { ignored: 1 } },
        flags: ["let_home_drift"]
      }
    ]
  };

  const minaThread: PhoneThreadDefinition = {
    id: "mina",
    title: "Mina",
    from: "Mina",
    intro: "Some people from campus survive the break in your head even before they text first.",
    messages: minaStrong
      ? [
          "Mina",
          "I still have your voice in my head every time something stupid happens on campus.",
          "Do not vanish on me over break, okay?"
        ]
      : [
          "Mina",
          "Campus already feels different without people around.",
          "We should not let the break turn us into one of those friendships that only exists in memory."
        ],
    choices: [
      {
        id: "mina-make-plans",
        label: "Make real plans",
        description: "Treat the friendship like something worth maintaining on purpose.",
        previewReply: "Deal. Let’s pick an actual time to call next week instead of trusting chance.",
        statEffects: { social: 3, mental: 2 },
        relationshipEffects: { mina: 6 },
        threadEffects: { mina: { sent: 1 } },
        flags: ["chose_new_friends"]
      },
      {
        id: "mina-steady-reply",
        label: "Send something steady",
        description: "Warm, honest, not dramatic.",
        previewReply: "I’m here. I know breaks can make everything feel blurry, but I do not want to drift either.",
        statEffects: { social: 2, mental: 1 },
        relationshipEffects: { mina: 4 },
        threadEffects: { mina: { sent: 1 } }
      },
      {
        id: "mina-put-it-off",
        label: "Tell yourself you’ll answer later",
        description: "Assume the friendship can carry the silence.",
        previewReply: "...",
        statEffects: { mental: -1 },
        relationshipEffects: { mina: -4 },
        threadEffects: { mina: { ignored: 1 } },
        flags: ["let_new_friends_drift"]
      }
    ]
  };

  const derekThread: PhoneThreadDefinition = {
    id: "derek",
    title: "Derek",
    from: "Derek",
    intro: "By the time Derek starts mattering, his messages tend to arrive like they already know your nervous system.",
    messages: derekStrong
      ? [
          "Derek",
          "Miss your face.",
          "Also: how do we keep being real to each other when both of our schedules are trying to become architecture?"
        ]
      : [
          "Derek",
          "No pressure, but I keep thinking about that last conversation.",
          "You can text me back like a person who is curious, not like a person auditioning for certainty."
        ],
    choices: [
      {
        id: "derek-open-up",
        label: "Text him back honestly",
        description: "Let the relationship use real language.",
        previewReply: "I keep thinking about it too. I do not want us to become something I only make time for by accident.",
        statEffects: { social: 3, mental: 2 },
        relationshipEffects: { derek: 7 },
        threadEffects: { derek: { sent: 1 } },
        flags: ["made_room_for_love"]
      },
      {
        id: "derek-light-reply",
        label: "Keep it warm and light",
        description: "Stay in contact without saying everything.",
        previewReply: "That is annoyingly thoughtful of you. Text me again tomorrow when I’m less dramatic.",
        statEffects: { social: 2 },
        relationshipEffects: { derek: 4 },
        threadEffects: { derek: { sent: 1 } }
      },
      {
        id: "derek-silence",
        label: "Leave the message sitting",
        description: "Protect yourself by not deepening the thread tonight.",
        previewReply: "...",
        statEffects: { mental: -1 },
        relationshipEffects: { derek: -5 },
        threadEffects: { derek: { ignored: 1 } },
        flags: ["kept_love_at_distance"]
      }
    ]
  };

  if (save.currentSemesterId === "freshman-fall") {
    return [homeFriendsThread, minaThread];
  }

  if (save.currentSemesterId === "freshman-spring") {
    return [homeFriendsThread, minaThread];
  }

  if (save.currentSemesterId === "sophomore-fall") {
    return [homeFriendsThread, minaThread, derekThread];
  }

  if (save.currentSemesterId === "sophomore-spring") {
    return [homeFriendsThread, minaThread, derekThread];
  }

  if (save.currentSemesterId === "junior-fall") {
    return [minaThread, derekThread, homeFriendsThread];
  }

  if (save.currentSemesterId === "junior-spring") {
    return [derekThread, minaThread, homeFriendsThread];
  }

  if (save.currentSemesterId === "senior-fall") {
    return [derekThread, minaThread, homeFriendsThread];
  }

  return [];
}

export function getCurrentPhoneThread(save: SaveData) {
  return getPhoneThreads(save)[save.phoneThreadIndex] ?? null;
}

function hasFlag(save: SaveData, flag: string) {
  return save.storyFlags.includes(flag);
}

export function buildEndingCard(save: SaveData): EndingCard {
  const careerScore = save.stats.academics + save.stats.finances;
  const connectionScore = save.relationships.mina + save.relationships.derek + save.relationships.homeFriends;
  const supportScore = save.communication.mina.sent + save.communication.derek.sent + save.communication.homeFriends.sent;
  const ignoredScore = save.communication.mina.ignored + save.communication.derek.ignored + save.communication.homeFriends.ignored;

  const ambitious = careerScore >= 160 || hasFlag(save, "choose-clear-career") || hasFlag(save, "accept-possibility");
  const balanced = save.stats.mental >= 62 && supportScore >= 5;
  const connected = connectionScore >= 210 && supportScore >= 4;
  const burnedOut = save.stats.mental <= 44 || hasFlag(save, "force-through-wall") || ignoredScore >= 4;
  const loveHeld = save.relationships.derek >= 72 && supportScore >= 2;
  const homeHeld = save.relationships.homeFriends >= 74 && save.communication.homeFriends.sent >= 2;

  if (ambitious && connected && loveHeld && balanced) {
    return {
      title: "Balanced And Ready",
      subtitle: "You built a future without letting it turn you into a stranger to yourself.",
      epilogue:
        "After graduation, the job offer became real, but so did dinner plans, call schedules, and the people who helped you remember that achievement only matters if a life can fit around it. Derek felt like a partner in the future, not a campus souvenir. Mina stayed part of your everyday language. Even home learned a new shape instead of disappearing.",
      identityLine: "You left college ambitious, loved, and still inhabitable from the inside."
    };
  }

  if (ambitious && !connected) {
    return {
      title: "Impressive And Alone",
      subtitle: "You earned the future you worked for, but not without thinning out the parts of life that were supposed to hold you.",
      epilogue:
        "The post-grad path arrived sharp and recognizable, exactly the kind of outcome earlier versions of you would have envied. The cost was quieter: missed texts, half-kept promises, and the realization that being admired is not the same thing as being accompanied. You left with momentum, but also with the knowledge that momentum cannot answer you back.",
      identityLine: "You became undeniable, and then had to ask whether undeniable was enough."
    };
  }

  if (connected && !ambitious) {
    return {
      title: "Held Together By People",
      subtitle: "The future stayed blurrier than you wanted, but your life felt real because other people were inside it with you.",
      epilogue:
        "Graduation did not hand you a single clean answer about work or direction. What it did leave you with was sturdier: the habit of replying, the courage to ask for someone, the kind of friendship and love that make uncertainty feel survivable. Mina remained a form of home. Derek felt like someone you chose in daylight, not just under pressure. Even back home softened because you stopped pretending silence was harmless.",
      identityLine: "You left college more connected than certain, and that turned out to be its own kind of strength."
    };
  }

  if (burnedOut) {
    return {
      title: "Burned Out Into Honesty",
      subtitle: "You reached the finish line carrying too much, but at least by the end you had stopped calling the weight success.",
      epilogue:
        "Senior year made it impossible to confuse exhaustion with achievement forever. Whether the future looked impressive on paper or not, the deeper change was that you finally learned how to name what ambition had been taking from you. The people who stayed close did so because you let them see the unspectacular truth. The life after graduation did not begin as a victory lap. It began as a recovery you actually meant.",
      identityLine: "You left college tired, honest, and less willing to disappear inside your own performance."
    };
  }

  if (homeHeld && connected) {
    return {
      title: "Rooted In More Than One Place",
      subtitle: "You did not have to choose between the people who knew you first and the people who met the version you became.",
      epilogue:
        "For a long time, it seemed like every new attachment required an old one to loosen. By graduation, that theory had been proven incomplete. You answered enough messages, named enough distance, and showed up enough times to let different parts of your life coexist without demanding sameness. The result was not perfection. It was continuity.",
      identityLine: "You left college carrying both origin and reinvention without letting either cancel the other."
    };
  }

  return {
    title: "Still Becoming, But On Purpose",
    subtitle: "Not every question resolved, but by the end you were finally choosing your life instead of only reacting to it.",
    epilogue:
      "Graduation arrived with some loose ends still visible: futures not fully named, relationships still learning their next form, and a version of adulthood that looked less like certainty than practice. Still, something important had changed. You had begun answering people more honestly, answering yourself more slowly, and building a life with enough intention that uncertainty no longer felt like failure.",
    identityLine: "You left college unfinished in the healthiest possible way: alive to your own choices."
  };
}

function getMemoryTitle(focusIds: string[]) {
  if (focusIds.includes("honors-grind")) {
    return "You chased the sharpened version of yourself.";
  }

  if (focusIds.includes("friendship-first")) {
    return "You let other people change the shape of campus.";
  }

  if (focusIds.includes("campus-job")) {
    return "You learned that survival has its own choreography.";
  }

  if (focusIds.includes("self-preservation")) {
    return "You protected the part of yourself that could still feel things.";
  }

  return "You kept becoming someone one semester at a time.";
}

function getArchiveYearLabel(semesterId: SemesterId) {
  if (semesterId.startsWith("freshman")) {
    return "Year One";
  }

  if (semesterId.startsWith("sophomore")) {
    return "Year Two";
  }

  if (semesterId.startsWith("junior")) {
    return "Year Three";
  }

  return "Year Four";
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}

export function buildMemoryArchive(save: SaveData): ArchiveEntry[] {
  const historyEntries = save.semesterHistory.map((record) => {
    const semester = getSemesterDefinition(record.semesterId);
    const focusText = record.focusIds
      .map((id) => getFocusById(id)?.label)
      .filter(Boolean)
      .join(" • ");

    return {
      semesterId: record.semesterId,
      title: semester.title,
      badge: semester.badge,
      yearLabel: getArchiveYearLabel(record.semesterId),
      memoryTitle: getMemoryTitle(record.focusIds),
      memoryNote: record.choiceHistory.length > 0 ? `${record.choiceHistory.length} major moments carried this chapter.` : "A quieter chapter still left a mark.",
      reflectionExcerpt: truncateText(record.reflection || "You carried something forward from this semester, even if it took time to name it.", 180),
      focusText,
      choiceCount: record.choiceHistory.length,
      isCurrent: false
    };
  });

  const shouldIncludeCurrent =
    save.step === "summary" || save.step === "phone" || (save.currentSemesterId === "senior-spring" && save.step === "reflection");

  if (shouldIncludeCurrent) {
    const semester = getSemesterDefinition(save.currentSemesterId);
    historyEntries.push({
      semesterId: save.currentSemesterId,
      title: semester.title,
      badge: semester.badge,
      yearLabel: getArchiveYearLabel(save.currentSemesterId),
      memoryTitle: getMemoryTitle(save.focusIds),
      memoryNote:
        save.currentSemesterId === "senior-spring"
          ? "The archive has finally caught up to graduation."
          : `${save.choiceHistory.length} major moments shaped this semester before the next one arrived.`,
      reflectionExcerpt: truncateText(
        save.reflection || "The semester is still settling into language.",
        180
      ),
      focusText: save.focusIds
        .map((id) => getFocusById(id)?.label)
        .filter(Boolean)
        .join(" • "),
      choiceCount: save.choiceHistory.length,
      isCurrent: true
    });
  }

  return historyEntries.reverse();
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
    rawSave.semesterHistory &&
    rawSave.communication &&
    typeof rawSave.phoneThreadIndex === "number" &&
    Array.isArray(rawSave.storyFlags)
  ) {
    return rawSave;
  }

  const baseSave: SaveData = {
    version: SAVE_VERSION,
    playerName: rawSave.playerName,
    playerId: rawSave.playerId,
    currentSemesterId: rawSave.currentSemesterId ?? "freshman-fall",
    pendingSemesterId: rawSave.pendingSemesterId ?? null,
    step: rawSave.step,
    focusIds: rawSave.focusIds ?? [],
    stats: rawSave.stats ?? { ...DEFAULT_STATS },
    relationships: { ...DEFAULT_RELATIONSHIPS, ...(rawSave.relationships ?? {}) },
    communication: {
      homeFriends: { ...DEFAULT_COMMUNICATION.homeFriends, ...(rawSave.communication?.homeFriends ?? {}) },
      mina: { ...DEFAULT_COMMUNICATION.mina, ...(rawSave.communication?.mina ?? {}) },
      derek: { ...DEFAULT_COMMUNICATION.derek, ...(rawSave.communication?.derek ?? {}) }
    },
    sceneIndex: rawSave.sceneIndex ?? 0,
    phoneThreadIndex: rawSave.phoneThreadIndex ?? 0,
    choiceHistory: rawSave.choiceHistory ?? [],
    storyFlags: rawSave.storyFlags ?? [],
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
    pendingSemesterId: nextSemesterId,
    step: "phone" as const,
    focusIds: [],
    sceneIndex: 0,
    phoneThreadIndex: 0,
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

export function finishPhoneStep(save: SaveData): SaveData | null {
  if (!save.pendingSemesterId) {
    return null;
  }

  return {
    ...save,
    currentSemesterId: save.pendingSemesterId,
    pendingSemesterId: null,
    step: "arrival",
    phoneThreadIndex: 0,
    updatedAt: new Date().toISOString()
  };
}
