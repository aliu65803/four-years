"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  DEFAULT_STATS,
  relationshipLabels,
  semesterDefinitions,
  semesterFocuses
} from "@/lib/game/data";
import { RelationshipKey, SaveData, SceneChoice, SceneDefinition, Stats } from "@/lib/game/types";
import {
  applyCommunicationEffects,
  applyEffects,
  applyRelationshipEffects,
  buildEndingCard,
  buildMemoryArchive,
  buildReflection,
  buildSemesterAdvance,
  createNewSave,
  describeCommunication,
  describeRelationships,
  finishPhoneStep,
  getCurrentPhoneThread,
  getNextSemesterId,
  getSaveStorageKey,
  getSceneFromPlan,
  getSemesterDefinition,
  getSemesterScenePlan,
  getVisitedLocationIds,
  normalizeSave,
  summarizeSemester
} from "@/lib/game/utils";

type FlavorState = {
  text: string;
  provider: string;
  loading: boolean;
};

const statColors: Record<keyof Stats, string> = {
  academics: "bg-sky",
  social: "bg-coral",
  mental: "bg-teal",
  finances: "bg-gold"
};

const relationshipColors: Record<RelationshipKey, string> = {
  professorAlden: "bg-gold",
  mina: "bg-coral",
  homeFriends: "bg-sky",
  derek: "bg-teal"
};

function StatMeter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xl uppercase tracking-[0.18em] text-parchment">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-5 border-2 border-ink bg-ink/60">
        <div className={clsx("h-full transition-all duration-500", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function YearbookArchive({ entries }: { entries: ReturnType<typeof buildMemoryArchive> }) {
  return (
    <section className="pixel-panel bg-[#f1e3bf] p-5 text-ink">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase leading-relaxed text-ink">Yearbook Archive</p>
          <p className="mt-3 text-2xl leading-6 text-ink/80">A little scrapbook of what each semester actually left behind.</p>
        </div>
        <div className="rounded-none border-2 border-ink/40 bg-[#fff4db] px-3 py-2 text-xl uppercase tracking-[0.18em] text-coral">
          {entries.length} pages
        </div>
      </div>

      <div className="yearbook-stack mt-5">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <article key={`${entry.semesterId}-${entry.isCurrent ? "current" : "past"}`} className={clsx("yearbook-card", entry.isCurrent && "is-current")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-[10px] uppercase leading-relaxed text-coral sm:text-xs">{entry.yearLabel}</p>
                  <h3 className="mt-2 text-3xl uppercase tracking-[0.12em]">{entry.title}</h3>
                </div>
                <span className="yearbook-badge">{entry.badge}</span>
              </div>
              <p className="mt-4 text-2xl leading-6 text-ink/90">{entry.memoryTitle}</p>
              <p className="mt-4 text-xl leading-6 text-ink/70">{entry.reflectionExcerpt}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="yearbook-stamp">
                  <p className="font-display text-[10px] uppercase leading-relaxed text-ink/70 sm:text-xs">Priorities</p>
                  <p className="mt-2 text-xl leading-6">{entry.focusText || "Still forming."}</p>
                </div>
                <div className="yearbook-stamp">
                  <p className="font-display text-[10px] uppercase leading-relaxed text-ink/70 sm:text-xs">Memory note</p>
                  <p className="mt-2 text-xl leading-6">{entry.memoryNote}</p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="yearbook-card">
            <p className="text-2xl leading-6 text-ink/75">The yearbook starts filling itself the first time a semester ends.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function PhoneChoiceCard({
  label,
  description,
  previewReply,
  onChoose
}: {
  label: string;
  description: string;
  previewReply: string;
  onChoose: () => void;
}) {
  return (
    <button type="button" onClick={onChoose} className="pixel-button rounded-none bg-parchment p-4 text-left text-ink">
      <p className="font-display text-xs uppercase leading-relaxed">{label}</p>
      <p className="mt-3 text-2xl leading-6">{description}</p>
      <p className="mt-4 border-t-2 border-ink/20 pt-4 text-xl italic text-ink/70">{previewReply}</p>
    </button>
  );
}

function FocusCard({
  id,
  label,
  description,
  selected,
  onClick
}: {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={clsx(
        "pixel-button h-full rounded-none p-4 text-left",
        selected ? "bg-teal text-ink" : "bg-parchment text-ink"
      )}
    >
      <p className="font-display text-xs uppercase leading-relaxed">{label}</p>
      <p className="mt-3 text-2xl leading-6">{description}</p>
    </button>
  );
}

function SceneChoiceCard({
  choice,
  onChoose,
  disabled
}: {
  choice: SceneChoice;
  onChoose: (choice: SceneChoice) => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChoose(choice)}
      className="pixel-button rounded-none bg-parchment p-4 text-left text-ink"
    >
      <p className="font-display text-xs uppercase leading-relaxed">{choice.label}</p>
      <p className="mt-3 text-2xl leading-6">{choice.description}</p>
    </button>
  );
}

function RelationshipMeter({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xl uppercase tracking-[0.18em] text-parchment">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-4 border-2 border-ink bg-ink/60">
        <div className={clsx("h-full transition-all duration-500", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function PixelDormAnimation() {
  return (
    <section className="pixel-panel overflow-hidden bg-[#243451] p-5 text-parchment">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase leading-relaxed text-sky">Little campus loop</p>
          <p className="mt-3 text-2xl leading-6 text-parchment/90">
            A tiny version of your player sprite wandering home after a long day.
          </p>
        </div>
        <div className="rounded-none border-2 border-parchment/40 bg-[#172238] px-3 py-2 text-xl uppercase tracking-[0.18em] text-gold">
          Idle
        </div>
      </div>

      <div className="pixel-diorama mt-5">
        <div className="pixel-moon" />
        <div className="pixel-building pixel-building-left">
          <span className="window w1" />
          <span className="window w2" />
          <span className="window w3" />
          <span className="window w4" />
        </div>
        <div className="pixel-building pixel-building-right">
          <span className="window w1" />
          <span className="window w2" />
          <span className="window w3" />
          <span className="window w4" />
        </div>
        <div className="pixel-cloud pixel-cloud-one" />
        <div className="pixel-cloud pixel-cloud-two" />
        <div className="pixel-stars">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="pixel-walkway" />
        <div className="pixel-grass pixel-grass-left" />
        <div className="pixel-grass pixel-grass-right" />
        <div className="pixel-player">
          <span className="head" />
          <span className="torso" />
          <span className="bag" />
          <span className="leg leg-left" />
          <span className="leg leg-right" />
          <span className="shadow" />
        </div>
      </div>
    </section>
  );
}

function CampusMap({ visited, activeLocationId }: { visited: Set<string>; activeLocationId?: string }) {
  const locations = [
    { id: "campus-gate", label: "Campus Gate", top: "12%", left: "20%" },
    { id: "humanities", label: "Humanities Hall", top: "28%", left: "60%" },
    { id: "north-dorm", label: "North Dorm", top: "54%", left: "24%" },
    { id: "student-center", label: "Student Center", top: "68%", left: "64%" },
    { id: "library", label: "Library", top: "48%", left: "78%" },
    { id: "student-union", label: "Student Union", top: "24%", left: "80%" },
    { id: "residence-room", label: "Dorm Room", top: "80%", left: "28%" },
    { id: "lake-path", label: "Lake Path", top: "84%", left: "42%" }
  ];

  return (
    <section className="pixel-panel bg-[#22314f] p-5 text-parchment">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase leading-relaxed text-sky">Campus map</p>
          <p className="mt-3 text-2xl leading-6 text-parchment/90">Track the corners of campus that shaped this semester.</p>
        </div>
        <div className="rounded-none border-2 border-parchment/40 bg-[#172238] px-3 py-2 text-xl uppercase tracking-[0.18em] text-gold">
          {visited.size} stops
        </div>
      </div>

      <div className="campus-map mt-5">
        <div className="campus-path campus-path-one" />
        <div className="campus-path campus-path-two" />
        <div className="campus-lake" />
        {locations.map((location) => {
          const isVisited = visited.has(location.id);
          const isActive = activeLocationId === location.id;

          return (
            <div
              key={location.id}
              className={clsx("campus-pin", isVisited && "is-visited", isActive && "is-active")}
              style={{ top: location.top, left: location.left }}
            >
              <span className="campus-pin-dot" />
              <span className="campus-pin-label">{location.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getPlayerName(user: ReturnType<typeof useUser>["user"]) {
  if (!user) {
    return "Freshman";
  }

  return user.firstName || user.username || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "Freshman";
}

export function GameShell() {
  const { isLoaded, user } = useUser();
  const [save, setSave] = useState<SaveData | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [syncMessage, setSyncMessage] = useState("Sign in to sync your semester.");
  const [flavor, setFlavor] = useState<FlavorState>({
    text: "Welcome to move-in day. The year is about to start making choices back at you.",
    provider: "fallback",
    loading: false
  });

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setSave(null);
      setHydrated(true);
      setSyncMessage("Sign in to sync your semester.");
      return;
    }

    const storageKey = getSaveStorageKey(user.id);
    const rawSave = window.localStorage.getItem(storageKey);

    if (rawSave) {
      try {
        setSave(normalizeSave(JSON.parse(rawSave) as SaveData));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    const loadSave = async () => {
      const response = await fetch("/api/save");
      if (!response.ok) {
        setHydrated(true);
        return;
      }

      const result = (await response.json()) as { save: SaveData | null };
      if (result.save) {
        const normalized = normalizeSave(result.save);
        setSave(normalized);
        window.localStorage.setItem(storageKey, JSON.stringify(normalized));
        setSyncMessage("Supabase save loaded.");
      } else if (rawSave) {
        setSyncMessage("Loaded local save. Remote slot is still empty.");
      } else {
        setSyncMessage("No save yet. Start your first semester.");
      }
      setHydrated(true);
    };

    void loadSave();
  }, [isLoaded, user]);

  useEffect(() => {
    if (!save || !user) {
      return;
    }

    window.localStorage.setItem(getSaveStorageKey(user.id), JSON.stringify(save));

    const persist = async () => {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(save)
      });

      const result = (await response.json()) as { persisted: boolean; reason?: string };
      setSyncMessage(result.persisted ? "Supabase save synced." : "Saved locally. Add Clerk and Supabase env vars to sync online.");
      if (result.reason && result.reason !== "missing-env") {
        setSyncMessage(`Saved locally. Remote sync skipped: ${result.reason}`);
      }
    };

    void persist();
  }, [save, user]);

  const semester = useMemo(() => (save ? getSemesterDefinition(save.currentSemesterId) : semesterDefinitions["freshman-fall"]), [save]);
  const scenePlan = useMemo(() => (save ? getSemesterScenePlan(save) : []), [save]);
  const currentScene = useMemo(() => (save ? getSceneFromPlan(save, save.sceneIndex) : null), [save]);
  const currentPhoneThread = useMemo(() => (save ? getCurrentPhoneThread(save) : null), [save]);
  const visitedLocationIds = useMemo(() => (save ? getVisitedLocationIds(save) : new Set<string>()), [save]);
  const nextSemesterId = useMemo(() => (save ? getNextSemesterId(save.currentSemesterId) : null), [save]);
  const endingCard = useMemo(() => (save?.currentSemesterId === "senior-spring" && save.step === "summary" ? buildEndingCard(save) : null), [save]);
  const archiveEntries = useMemo(() => (save ? buildMemoryArchive(save) : []), [save]);

  const previewStats = useMemo(() => {
    if (!save) {
      return DEFAULT_STATS;
    }

    return save.focusIds.reduce((acc, focusId) => {
      const focus = semesterFocuses.find((entry) => entry.id === focusId);
      return focus ? applyEffects(acc, focus.statEffects) : acc;
    }, { ...save.stats });
  }, [save]);

  const startGame = () => {
    if (!user) {
      return;
    }

    const playerName = getPlayerName(user);
    setSave(createNewSave(playerName.trim(), user.id));
    setFlavor({
      text: `${playerName} drags the last box into a dorm room that smells like fresh paint and possibility.`,
      provider: "fallback",
      loading: false
    });
  };

  const continueToPlanner = () => {
    if (!save) {
      return;
    }

    setSave({
      ...save,
      step: "planner",
      updatedAt: new Date().toISOString()
    });
  };

  const toggleFocus = (focusId: string) => {
    if (!save || save.step !== "planner") {
      return;
    }

    const current = save.focusIds;
    const exists = current.includes(focusId);
    const next = exists ? current.filter((id) => id !== focusId) : current.length < 3 ? [...current, focusId] : current;

    setSave({
      ...save,
      focusIds: next,
      updatedAt: new Date().toISOString()
    });
  };

  const confirmPlanner = () => {
    if (!save || save.focusIds.length !== 3) {
      return;
    }

    const stats = save.focusIds.reduce((acc, focusId) => {
      const focus = semesterFocuses.find((entry) => entry.id === focusId);
      return focus ? applyEffects(acc, focus.statEffects) : acc;
    }, { ...save.stats });

    const selectedText = save.focusIds
      .map((focusId) => semesterFocuses.find((entry) => entry.id === focusId)?.flavor)
      .filter(Boolean)
      .join(" ");

    setSave({
      ...save,
      stats,
      step: "scene",
      sceneIndex: 0,
      updatedAt: new Date().toISOString()
    });
    setFlavor({
      text: selectedText,
      provider: "fallback",
      loading: false
    });
  };

  const handleChoice = async (scene: SceneDefinition, choice: SceneChoice) => {
    if (!save) {
      return;
    }

    const nextStats = applyEffects(save.stats, choice.statEffects);
    const nextRelationships = applyRelationshipEffects(save.relationships, choice.relationshipEffects);
    setFlavor((current) => ({ ...current, loading: true }));

    const response = await fetch("/api/flavor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        playerName: save.playerName,
        character: scene.character,
        sceneTitle: scene.title,
        sceneSummary: `${scene.summary} Relationships: ${describeRelationships(nextRelationships)}.`,
        promptSeed: scene.promptSeed,
        nextFlavorPrompt: choice.nextFlavorPrompt,
        stats: nextStats
      })
    });

    const result = (await response.json()) as { dialogue: string; provider: string };
    const nextSceneIndex = save.sceneIndex + 1;
    const nextStep = nextSceneIndex >= scenePlan.length ? "reflection" : "scene";

    setSave({
      ...save,
      stats: nextStats,
      relationships: nextRelationships,
      storyFlags: [...new Set([...save.storyFlags, choice.id, ...(choice.flags ?? [])])],
      sceneIndex: nextSceneIndex,
      step: nextStep,
      choiceHistory: [...save.choiceHistory, { sceneId: scene.id, choiceId: choice.id }],
      reflection: nextStep === "reflection" ? buildReflection({ ...save, stats: nextStats, relationships: nextRelationships }) : "",
      updatedAt: new Date().toISOString()
    });
    setFlavor({
      text: result.dialogue,
      provider: result.provider,
      loading: false
    });
  };

  const handlePhoneChoice = (choiceId: string) => {
    if (!save || save.step !== "phone" || !currentPhoneThread) {
      return;
    }

    const choice = currentPhoneThread.choices.find((entry) => entry.id === choiceId);
    if (!choice) {
      return;
    }

    const nextStats = applyEffects(save.stats, choice.statEffects ?? {});
    const nextRelationships = applyRelationshipEffects(save.relationships, choice.relationshipEffects);
    const nextCommunication = applyCommunicationEffects(
      save.communication,
      choice.threadEffects,
      choice.id,
      currentPhoneThread.id
    );
    const nextThreadIndex = save.phoneThreadIndex + 1;

    setSave({
      ...save,
      stats: nextStats,
      relationships: nextRelationships,
      communication: nextCommunication,
      phoneThreadIndex: nextThreadIndex,
      storyFlags: [...new Set([...save.storyFlags, choice.id, ...(choice.flags ?? [])])],
      updatedAt: new Date().toISOString()
    });
    setFlavor({
      text: choice.previewReply === "..." ? "You let the silence carry more than the message did." : choice.previewReply,
      provider: "fallback",
      loading: false
    });
  };

  const continueFromPhone = () => {
    if (!save) {
      return;
    }

    const advanced = finishPhoneStep(save);
    if (!advanced) {
      return;
    }

    setSave(advanced);
    const nextSemester = getSemesterDefinition(advanced.currentSemesterId);
    setFlavor({
      text: `${save.playerName} returns for ${nextSemester.title.toLowerCase()} with a few more answered messages and a slightly clearer sense of who still feels reachable.`,
      provider: "fallback",
      loading: false
    });
  };

  const finishReflection = () => {
    if (!save) {
      return;
    }

    setSave({
      ...save,
      step: "summary",
      updatedAt: new Date().toISOString()
    });
  };

  const advanceSemester = () => {
    if (!save) {
      return;
    }

    const advanced = buildSemesterAdvance(save);
    if (!advanced) {
      return;
    }

    setSave(advanced);
    const nextSemester = getSemesterDefinition(advanced.currentSemesterId);
    setFlavor({
      text: `${save.playerName} returns for ${nextSemester.title.toLowerCase()}. They know the campus better now, but the people in it have become harder to read.`,
      provider: "fallback",
      loading: false
    });
  };

  const restart = () => {
    if (user) {
      window.localStorage.removeItem(getSaveStorageKey(user.id));
    }
    setSave(null);
    setFlavor({
      text: "A different college version of you is waiting if you want to see it.",
      provider: "fallback",
      loading: false
    });
    setSyncMessage("No save yet. Start your first semester.");
  };

  if (!hydrated) {
    return <main className="mx-auto min-h-screen max-w-6xl p-6 text-3xl text-parchment">Loading semester...</main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="pixel-panel scanlines relative overflow-hidden bg-ink/90">
          <div className="relative min-h-[720px] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-parchment/50 pb-4">
              <div>
                <p className="font-display text-[10px] uppercase leading-relaxed text-sky sm:text-xs">{semester.badge}</p>
                <h1 className="mt-3 text-4xl uppercase tracking-[0.12em] text-parchment sm:text-6xl">{semester.title}</h1>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-parchment px-4 py-3 text-right text-ink">
                  <p className="font-display text-[10px] uppercase sm:text-xs">Save Status</p>
                  <p className="mt-2 max-w-[16rem] text-2xl leading-6">{syncMessage}</p>
                </div>
                <SignedIn>
                  <div className="bg-parchment p-3 text-ink">
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
            </div>

            <SignedOut>
              <div className="mt-8 space-y-6">
                <div className="space-y-5 bg-ink/50 p-5">
                  <p className="font-display text-xs uppercase leading-relaxed text-gold">Authentication</p>
                  <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">
                    Sign in to keep your stats, relationships, and semester history attached to your account across the whole college arc.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <SignUpButton mode="modal">
                    <button type="button" className="pixel-button rounded-none bg-coral px-6 py-4 font-display text-xs uppercase text-ink">
                      Create Account
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button type="button" className="pixel-button rounded-none bg-gold px-6 py-4 font-display text-xs uppercase text-ink">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </div>
            </SignedOut>

            <SignedIn>
              {!save && (
                <div className="mt-8 space-y-6">
                  <div className="space-y-5 bg-ink/50 p-5">
                    <p className="font-display text-xs uppercase leading-relaxed text-gold">Begin the story</p>
                    <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">
                      Freshman year starts with uncertainty, and the version of you that survives it will be shaped one semester at a time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startGame}
                    className="pixel-button rounded-none bg-coral px-6 py-4 font-display text-xs uppercase text-ink"
                  >
                    Start the Semester
                  </button>
                  <p className="text-2xl text-parchment/80">This save will belong to {getPlayerName(user)} and carry forward across future semesters.</p>
                </div>
              )}

              {save?.step === "arrival" && (
                <div className="mt-8 space-y-6">
                  <div className="relative overflow-hidden border-4 border-parchment/60 bg-[#253759]">
                    <Image src="/backgrounds/campus-arrival.svg" alt={semester.arrivalTitle} width={1200} height={800} className="h-[320px] w-full object-cover" />
                  </div>
                  <div className="space-y-4 bg-ink/55 p-5">
                    <p className="font-display text-xs uppercase leading-relaxed text-gold">{semester.arrivalTitle}</p>
                    <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">{semester.arrivalCopy}</p>
                    <p className="text-2xl text-parchment/85">{save.playerName}, this semester already knows what you carried out of the last one.</p>
                  </div>
                  <button
                    type="button"
                    onClick={continueToPlanner}
                    className="pixel-button rounded-none bg-gold px-6 py-4 font-display text-xs uppercase text-ink"
                  >
                    Open Semester Planner
                  </button>
                </div>
              )}

              {save?.step === "planner" && (
                <div className="mt-8 space-y-6">
                  <div className="space-y-3 bg-ink/55 p-5">
                    <p className="font-display text-xs uppercase leading-relaxed text-sky">Planner</p>
                    <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">{semester.plannerPrompt}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {semesterFocuses.map((focus) => (
                      <FocusCard
                        key={focus.id}
                        id={focus.id}
                        label={focus.label}
                        description={focus.description}
                        selected={save.focusIds.includes(focus.id)}
                        onClick={toggleFocus}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-ink/55 p-5">
                    <p className="text-2xl text-parchment">Selected: {save.focusIds.length}/3</p>
                    <button
                      type="button"
                      onClick={confirmPlanner}
                      disabled={save.focusIds.length !== 3}
                      className="pixel-button rounded-none bg-teal px-6 py-4 font-display text-xs uppercase text-ink"
                    >
                      Lock in the Semester
                    </button>
                  </div>
                </div>
              )}

              {save?.step === "scene" && currentScene && (
                <div className="mt-8 space-y-6">
                  <div className="relative overflow-hidden border-4 border-parchment/60 bg-[#253759]">
                    <Image src={currentScene.background} alt={currentScene.title} width={1200} height={800} className="h-[320px] w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-4">
                      <p className="font-display text-[10px] uppercase leading-relaxed text-sky sm:text-xs">{currentScene.character}</p>
                      <h2 className="mt-2 text-3xl uppercase tracking-[0.12em] text-parchment sm:text-4xl">{currentScene.title}</h2>
                    </div>
                  </div>
                  <div className="space-y-4 bg-ink/55 p-5">
                    <p className="font-display text-xs uppercase leading-relaxed text-gold">{currentScene.locationLabel}</p>
                    <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">{currentScene.setting}</p>
                    <p className="text-2xl text-parchment/85">{currentScene.summary}</p>
                  </div>
                  <div className="grid gap-4">
                    {currentScene.choices.map((choice) => (
                      <SceneChoiceCard key={choice.id} choice={choice} onChoose={(selected) => void handleChoice(currentScene, selected)} disabled={flavor.loading} />
                    ))}
                  </div>
                </div>
              )}

              {save?.step === "reflection" && (
                <div className="mt-8 space-y-6">
                  <div className="relative overflow-hidden border-4 border-parchment/60 bg-[#253759]">
                    <Image src="/backgrounds/reflection-walk.svg" alt="Reflection walk" width={1200} height={800} className="h-[320px] w-full object-cover" />
                  </div>
                  <div className="space-y-4 bg-ink/55 p-5">
                    <p className="font-display text-xs uppercase leading-relaxed text-gold">{semester.reflectionPrompt}</p>
                    <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">{save.reflection}</p>
                  </div>
                  <button
                    type="button"
                    onClick={finishReflection}
                    className="pixel-button rounded-none bg-gold px-6 py-4 font-display text-xs uppercase text-ink"
                  >
                    Sit With It
                  </button>
                </div>
              )}

              {save?.step === "summary" && (
                <div className="mt-8 space-y-6">
                  <div className="space-y-4 bg-ink/55 p-5">
                    <p className="font-display text-xs uppercase leading-relaxed text-sky">Semester complete</p>
                    <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">{summarizeSemester(save)}</p>
                    <p className="text-2xl text-parchment/85">
                      Relationship totals now read {describeRelationships(save.relationships)}. Future semesters can open or close depending on what you built here.
                    </p>
                    <p className="text-2xl text-parchment/75">{describeCommunication(save.communication)}.</p>
                  </div>
                  {endingCard ? (
                    <div className="space-y-4 border-4 border-parchment/50 bg-[#21324f] p-5">
                      <p className="font-display text-xs uppercase leading-relaxed text-gold">Graduation outcome</p>
                      <h2 className="text-4xl uppercase tracking-[0.12em] text-parchment sm:text-5xl">{endingCard.title}</h2>
                      <p className="text-3xl leading-8 text-parchment/90">{endingCard.subtitle}</p>
                      <p className="text-2xl leading-7 text-parchment/85">{endingCard.epilogue}</p>
                      <p className="text-2xl italic text-gold">{endingCard.identityLine}</p>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-4">
                    {nextSemesterId ? (
                      <button
                        type="button"
                        onClick={advanceSemester}
                        className="pixel-button rounded-none bg-teal px-6 py-4 font-display text-xs uppercase text-ink"
                      >
                        Check Your Phone
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={restart}
                      className="pixel-button rounded-none bg-coral px-6 py-4 font-display text-xs uppercase text-ink"
                    >
                      Restart the Story
                    </button>
                  </div>
                </div>
              )}

              {save?.step === "phone" && currentPhoneThread && (
                <div className="mt-8 space-y-6">
                  <div className="relative overflow-hidden border-4 border-parchment/60 bg-[#253759]">
                    <Image src="/backgrounds/phone-glow.svg" alt={currentPhoneThread.title} width={1200} height={800} className="h-[320px] w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-4">
                      <p className="font-display text-[10px] uppercase leading-relaxed text-sky sm:text-xs">Between semesters</p>
                      <h2 className="mt-2 text-3xl uppercase tracking-[0.12em] text-parchment sm:text-4xl">{currentPhoneThread.title}</h2>
                    </div>
                  </div>
                  <div className="space-y-4 bg-ink/55 p-5">
                    <p className="font-display text-xs uppercase leading-relaxed text-gold">{currentPhoneThread.from}</p>
                    <p className="text-2xl text-parchment/85">{currentPhoneThread.intro}</p>
                    <div className="space-y-3">
                      {currentPhoneThread.messages.map((message, index) => (
                        <div key={`${currentPhoneThread.id}-${index}`} className={clsx("max-w-[34rem] p-4 text-2xl leading-6", index === 0 ? "ml-auto bg-teal text-ink" : "bg-parchment text-ink")}>
                          {message}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {currentPhoneThread.choices.map((choice) => (
                      <PhoneChoiceCard
                        key={choice.id}
                        label={choice.label}
                        description={choice.description}
                        previewReply={choice.previewReply}
                        onChoose={() => handlePhoneChoice(choice.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {save?.step === "phone" && !currentPhoneThread && save.pendingSemesterId && (
                <div className="mt-8 space-y-6">
                  <div className="space-y-4 bg-ink/55 p-5">
                    <p className="font-display text-xs uppercase leading-relaxed text-sky">Between semesters</p>
                    <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">
                      The break passed through calls, half-kept plans, and the quiet proof that some connections survived because you acted like they mattered.
                    </p>
                    <p className="text-2xl text-parchment/85">
                      Next up: {getSemesterDefinition(save.pendingSemesterId).title}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={continueFromPhone}
                    className="pixel-button rounded-none bg-gold px-6 py-4 font-display text-xs uppercase text-ink"
                  >
                    Return to Campus
                  </button>
                </div>
              )}
            </SignedIn>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="pixel-panel bg-parchment p-5 text-ink">
            <p className="font-display text-xs uppercase leading-relaxed text-ink">Current flavor</p>
            <p className="mt-4 text-3xl leading-8">{flavor.loading ? "Writing the moment..." : flavor.text}</p>
            <p className="mt-4 text-xl uppercase tracking-[0.18em] text-ink/70">Dialogue source: {flavor.provider}</p>
          </section>

          <section className="pixel-panel bg-ink/85 p-5">
            <p className="font-display text-xs uppercase leading-relaxed text-gold">Cumulative stats</p>
            <div className="mt-5 space-y-5">
              <StatMeter label="Academics" value={(save?.step === "planner" ? previewStats.academics : save?.stats.academics) ?? DEFAULT_STATS.academics} color={statColors.academics} />
              <StatMeter label="Social" value={(save?.step === "planner" ? previewStats.social : save?.stats.social) ?? DEFAULT_STATS.social} color={statColors.social} />
              <StatMeter label="Mental" value={(save?.step === "planner" ? previewStats.mental : save?.stats.mental) ?? DEFAULT_STATS.mental} color={statColors.mental} />
              <StatMeter label="Finances" value={(save?.step === "planner" ? previewStats.finances : save?.stats.finances) ?? DEFAULT_STATS.finances} color={statColors.finances} />
            </div>
          </section>

          {save ? (
            <section className="pixel-panel bg-ink/85 p-5">
              <p className="font-display text-xs uppercase leading-relaxed text-sky">Relationships</p>
              <div className="mt-5 space-y-5">
                {(Object.keys(save.relationships) as RelationshipKey[]).map((key) => (
                  <RelationshipMeter
                    key={key}
                    label={relationshipLabels[key]}
                    value={save.relationships[key]}
                    color={relationshipColors[key]}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {save ? <YearbookArchive entries={archiveEntries} /> : null}

          <CampusMap visited={visitedLocationIds} activeLocationId={currentScene?.locationId} />

          <PixelDormAnimation />
        </aside>
      </div>
    </main>
  );
}
