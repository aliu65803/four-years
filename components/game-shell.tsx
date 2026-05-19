"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import {
  DEFAULT_STATS,
  communicationLabels,
  relationshipLabels,
  semesterDefinitions,
  semesterFocuses
} from "@/lib/game/data";
import { CommunicationThreadKey, RelationshipKey, SaveData, SceneChoice, SceneDefinition, Stats } from "@/lib/game/types";
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
  getPhoneThreadById,
  getPhoneThreads,
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

type TutorialTarget = "story" | "save" | "stats" | "relationships" | "phone" | "yearbook" | "map";

type TutorialStep = {
  target: TutorialTarget;
  title: string;
  body: string;
  kicker: string;
};

const tutorialStorageKey = "four-years-tutorial-seen-v1";

const tutorialSteps: TutorialStep[] = [
  {
    target: "story",
    kicker: "Main panel",
    title: "This is where the semester actually happens.",
    body: "Use this big story area to move through arrival, the semester planner, scene choices, reflection, and each semester summary."
  },
  {
    target: "save",
    kicker: "Save box",
    title: "Saving is manual now.",
    body: "When the game says Unsaved changes, press Save Progress before you leave so this run stays attached to your account."
  },
  {
    target: "stats",
    kicker: "Cumulative stats",
    title: "These numbers shape your future scenes.",
    body: "Academics, Social, Mental, and Finances all carry forward across years and can unlock or close off later story branches."
  },
  {
    target: "relationships",
    kicker: "Relationships",
    title: "Characters remember what you invest in.",
    body: "These meters track how close you are to Mina, Derek, Professor Alden, and your home friends as the story keeps moving."
  },
  {
    target: "phone",
    kicker: "Phone",
    title: "Texting is optional, but not neutral.",
    body: "Pick who you want to text during the semester to boost that relationship. Anyone you ignore cools off a little by the time the term ends."
  },
  {
    target: "yearbook",
    kicker: "Yearbook",
    title: "This archive keeps the emotional history of your run.",
    body: "After each semester, a new memory card gets added here so players can look back at priorities, reflections, and what each chapter meant."
  },
  {
    target: "map",
    kicker: "Campus map",
    title: "The map shows where this semester has taken you.",
    body: "As scenes happen, campus locations light up so the run feels more physical and memorable instead of just a list of choices."
  }
];

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
  const roundedValue = Math.round(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xl uppercase tracking-[0.18em] text-parchment">
        <span>{label}</span>
        <span>{roundedValue}</span>
      </div>
      <div className="h-5 border-2 border-ink bg-ink/60">
        <div className={clsx("h-full transition-all duration-500", color)} style={{ width: `${roundedValue}%` }} />
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

function PhonePanel({
  save,
  selectedThreadId,
  onSelectThread,
  onChooseThreadReply
}: {
  save: SaveData;
  selectedThreadId: CommunicationThreadKey | null;
  onSelectThread: (threadId: CommunicationThreadKey) => void;
  onChooseThreadReply: (threadId: CommunicationThreadKey, choiceId: string) => void;
}) {
  const threads = getPhoneThreads(save);
  const selectedThread = getPhoneThreadById(save, selectedThreadId ?? threads[0]?.id ?? null);

  if (threads.length === 0 || !selectedThread) {
    return null;
  }

  const threadCompleted = save.semesterTextedThreadIds.includes(selectedThread.id);

  return (
    <section className="pixel-panel bg-[#243451] p-5 text-parchment">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase leading-relaxed text-sky">Phone</p>
          <p className="mt-3 text-2xl leading-6 text-parchment/90">Text who you want to keep close this semester. Anyone you leave untouched will cool off a little when the term ends.</p>
        </div>
        <div className="rounded-none border-2 border-parchment/40 bg-[#172238] px-3 py-2 text-xl uppercase tracking-[0.18em] text-gold">
          {save.semesterTextedThreadIds.length}/{threads.length}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="space-y-3">
          {threads.map((thread) => {
            const replied = save.semesterTextedThreadIds.includes(thread.id);

            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => onSelectThread(thread.id)}
                className={clsx(
                  "pixel-button flex w-full items-center justify-between rounded-none px-4 py-3 text-left",
                  selectedThread.id === thread.id ? "bg-teal text-ink" : "bg-parchment text-ink"
                )}
              >
                <div>
                  <p className="font-display text-xs uppercase leading-relaxed">{communicationLabels[thread.id]}</p>
                  <p className="mt-2 text-xl leading-5">{replied ? "Replied this semester" : "Still waiting"}</p>
                </div>
                <span className="text-xl uppercase tracking-[0.14em]">{replied ? "Sent" : "Open"}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-4 bg-ink/45 p-4">
          <p className="font-display text-xs uppercase leading-relaxed text-gold">{selectedThread.from}</p>
          <p className="text-2xl text-parchment/85">{selectedThread.intro}</p>
          <div className="space-y-3">
            {selectedThread.messages.map((message, index) => (
              <div
                key={`${selectedThread.id}-${index}`}
                className={clsx("max-w-[26rem] p-4 text-2xl leading-6", index === 0 ? "ml-auto bg-teal text-ink" : "bg-parchment text-ink")}
              >
                {message}
              </div>
            ))}
          </div>

          {threadCompleted ? (
            <div className="border-2 border-parchment/40 bg-[#172238] p-4 text-2xl leading-6 text-parchment/85">
              You already texted {communicationLabels[selectedThread.id]} this semester. Let the thread rest for now.
            </div>
          ) : (
            <div className="grid gap-4">
              {selectedThread.choices.map((choice) => (
                <PhoneChoiceCard
                  key={choice.id}
                  label={choice.label}
                  description={choice.description}
                  previewReply={choice.previewReply}
                  onChoose={() => onChooseThreadReply(selectedThread.id, choice.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PhonePreviewPanel() {
  return (
    <section className="pixel-panel bg-[#243451] p-5 text-parchment">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase leading-relaxed text-sky">Phone</p>
          <p className="mt-3 text-2xl leading-6 text-parchment/90">
            Your phone is part of the game from the start. Later, this is where you will choose who to text and which relationships to keep alive.
          </p>
        </div>
        <div className="rounded-none border-2 border-parchment/40 bg-[#172238] px-3 py-2 text-xl uppercase tracking-[0.18em] text-gold">
          Preview
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="space-y-3">
          <div className="pixel-button flex w-full items-center justify-between rounded-none bg-teal px-4 py-3 text-left text-ink">
            <div>
              <p className="font-display text-xs uppercase leading-relaxed">Home Friends</p>
              <p className="mt-2 text-xl leading-5">Waiting for freshman year to begin</p>
            </div>
            <span className="text-xl uppercase tracking-[0.14em]">Open</span>
          </div>
        </div>

        <div className="space-y-4 bg-ink/45 p-4">
          <p className="font-display text-xs uppercase leading-relaxed text-gold">Home Friends</p>
          <p className="text-2xl text-parchment/85">The people who knew you before college will keep trying to reach you while you change.</p>
          <div className="space-y-3">
            <div className="max-w-[26rem] bg-teal p-4 text-2xl leading-6 text-ink">Home Friends</div>
            <div className="max-w-[26rem] bg-parchment p-4 text-2xl leading-6 text-ink">Promise you’ll tell us everything once you get there.</div>
            <div className="max-w-[26rem] bg-parchment p-4 text-2xl leading-6 text-ink">No reply needed yet. Just do not disappear on us.</div>
          </div>
          <div className="border-2 border-parchment/40 bg-[#172238] p-4 text-2xl leading-6 text-parchment/85">
            Text choices unlock once your semester begins. For now, this shows where relationship maintenance will live.
          </div>
        </div>
      </div>
    </section>
  );
}

function RelationshipPreviewPanel() {
  return (
    <section className="pixel-panel bg-ink/85 p-5">
      <p className="font-display text-xs uppercase leading-relaxed text-sky">Relationships</p>
      <p className="mt-4 text-2xl leading-6 text-parchment/85">
        These meters will start changing as soon as the story begins. Your choices decide who becomes a passing encounter and who becomes part of your life.
      </p>
      <div className="mt-5 space-y-5">
        {(Object.keys(relationshipLabels) as RelationshipKey[]).map((key) => (
          <RelationshipMeter key={key} label={relationshipLabels[key]} value={0} color={relationshipColors[key]} />
        ))}
      </div>
    </section>
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

function TutorialOverlay({
  step,
  stepIndex,
  totalSteps,
  onClose,
  onNext,
  onBack
}: {
  step: TutorialStep;
  stepIndex: number;
  totalSteps: number;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/75 backdrop-blur-[1px]" />
      <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl pixel-panel bg-parchment p-5 text-ink sm:inset-x-6 sm:bottom-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-[10px] uppercase leading-relaxed text-coral sm:text-xs">{step.kicker}</p>
            <h2 className="mt-3 text-3xl uppercase tracking-[0.12em] sm:text-4xl">{step.title}</h2>
          </div>
          <div className="rounded-none border-2 border-ink/25 bg-[#fff4db] px-3 py-2 text-xl uppercase tracking-[0.18em] text-ink/70">
            {stepIndex + 1}/{totalSteps}
          </div>
        </div>
        <p className="mt-4 text-2xl leading-7 text-ink/85">{step.body}</p>
        <p className="mt-3 text-xl uppercase tracking-[0.16em] text-ink/60">The highlighted part of the screen is what this step is talking about.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={onClose} className="pixel-button rounded-none bg-[#f7d59e] px-5 py-3 font-display text-xs uppercase text-ink">
            Skip tutorial
          </button>
          <button
            type="button"
            onClick={onBack}
            disabled={stepIndex === 0}
            className="pixel-button rounded-none bg-[#d7e1f2] px-5 py-3 font-display text-xs uppercase text-ink"
          >
            Back
          </button>
          <button type="button" onClick={onNext} className="pixel-button rounded-none bg-teal px-5 py-3 font-display text-xs uppercase text-ink">
            {isLastStep ? "Finish tutorial" : "Next tip"}
          </button>
        </div>
      </div>
    </>
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
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedPhoneThreadId, setSelectedPhoneThreadId] = useState<CommunicationThreadKey | null>(null);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);
  const [flavor, setFlavor] = useState<FlavorState>({
    text: "Welcome to move-in day. The year is about to start making choices back at you.",
    provider: "fallback",
    loading: false
  });
  const lastPersistedSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const seen = window.localStorage.getItem(tutorialStorageKey) === "seen";
    setHasSeenTutorial(seen);
  }, [hydrated]);

  useEffect(() => {
    const activeTarget = showTutorial ? tutorialSteps[tutorialStepIndex]?.target : null;
    if (!activeTarget) {
      return;
    }

    const target = document.querySelector<HTMLElement>(`[data-tutorial-target="${activeTarget}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [showTutorial, tutorialStepIndex]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      setSave(null);
      setHydrated(true);
      setHasUnsavedChanges(false);
      lastPersistedSnapshotRef.current = null;
      setSyncMessage("Sign in to sync your semester.");
      return;
    }

    const storageKey = getSaveStorageKey(user.id);
    const rawSave = window.localStorage.getItem(storageKey);
    let cancelled = false;

    if (rawSave) {
      try {
        const normalized = normalizeSave(JSON.parse(rawSave) as SaveData);
        setSave(normalized);
        lastPersistedSnapshotRef.current = JSON.stringify(normalized);
        setHydrated(true);
        setSyncMessage("Loaded local save. Checking online save...");
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    const loadSave = async () => {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 4500);

      try {
        const response = await fetch("/api/save", { signal: controller.signal });
        if (!response.ok) {
          if (!cancelled) {
            if (rawSave) {
              setSyncMessage("Loaded local save. Press Save Progress to sync online.");
            } else {
              setSyncMessage("No save yet. Start your first semester.");
            }
          }
          return;
        }

        const result = (await response.json()) as { save: SaveData | null };
        if (cancelled) {
          return;
        }

        if (result.save) {
          const normalized = normalizeSave(result.save);
          setSave(normalized);
          window.localStorage.setItem(storageKey, JSON.stringify(normalized));
          lastPersistedSnapshotRef.current = JSON.stringify(normalized);
          setSyncMessage("Save loaded. Manual saving is on.");
        } else if (rawSave) {
          setSyncMessage("Loaded local save. Press Save Progress to sync online.");
        } else {
          setSyncMessage("No save yet. Start your first semester.");
        }
      } catch {
        if (!cancelled) {
          setSyncMessage(rawSave ? "Loaded local save. Online save check timed out." : "Online save check timed out. You can still start a new semester.");
        }
      } finally {
        window.clearTimeout(timeoutId);
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    void loadSave();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, user]);

  useEffect(() => {
    if (!save) {
      setHasUnsavedChanges(false);
      return;
    }

    setHasUnsavedChanges(JSON.stringify(save) !== lastPersistedSnapshotRef.current);
  }, [save]);

  const activeTutorialTarget = showTutorial ? tutorialSteps[tutorialStepIndex]?.target ?? null : null;

  const tutorialTargetClass = (target: TutorialTarget) =>
    clsx(activeTutorialTarget === target && "relative z-[60] ring-4 ring-gold ring-offset-4 ring-offset-[#121522]");

  const closeTutorial = () => {
    window.localStorage.setItem(tutorialStorageKey, "seen");
    setHasSeenTutorial(true);
    setShowTutorial(false);
  };

  const openTutorial = () => {
    setTutorialStepIndex(0);
    setShowTutorial(true);
  };

  const nextTutorialStep = () => {
    if (tutorialStepIndex >= tutorialSteps.length - 1) {
      closeTutorial();
      return;
    }

    setTutorialStepIndex((current) => current + 1);
  };

  const previousTutorialStep = () => {
    setTutorialStepIndex((current) => Math.max(0, current - 1));
  };

  const handleManualSave = async () => {
    if (!save || !user || isSaving) {
      return;
    }

    const snapshot = JSON.stringify(save);
    setIsSaving(true);
    setSyncMessage("Saving progress...");

    window.localStorage.setItem(getSaveStorageKey(user.id), snapshot);

    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: snapshot
      });

      const result = (await response.json()) as { persisted: boolean; reason?: string };
      if (result.persisted) {
        lastPersistedSnapshotRef.current = snapshot;
        setHasUnsavedChanges(false);
        setSyncMessage("Progress saved.");
      } else if (result.reason === "missing-env") {
        lastPersistedSnapshotRef.current = snapshot;
        setHasUnsavedChanges(false);
        setSyncMessage("Saved locally. Add Clerk and Supabase env vars to sync online.");
      } else {
        setSyncMessage(`Save skipped: ${result.reason ?? "unknown error"}`);
      }
    } catch {
      setSyncMessage("Save failed. Try again in a moment.");
    } finally {
      setIsSaving(false);
    }
  };

  const semester = useMemo(() => (save ? getSemesterDefinition(save.currentSemesterId) : semesterDefinitions["freshman-fall"]), [save]);
  const scenePlan = useMemo(() => (save ? getSemesterScenePlan(save) : []), [save]);
  const currentScene = useMemo(() => (save ? getSceneFromPlan(save, save.sceneIndex) : null), [save]);
  const visitedLocationIds = useMemo(() => (save ? getVisitedLocationIds(save) : new Set<string>()), [save]);
  const nextSemesterId = useMemo(() => (save ? getNextSemesterId(save.currentSemesterId) : null), [save]);
  const endingCard = useMemo(() => (save?.currentSemesterId === "senior-spring" && save.step === "summary" ? buildEndingCard(save) : null), [save]);
  const archiveEntries = useMemo(() => (save ? buildMemoryArchive(save) : []), [save]);
  const availablePhoneThreads = useMemo(() => (save ? getPhoneThreads(save) : []), [save]);

  const previewStats = useMemo(() => {
    if (!save) {
      return DEFAULT_STATS;
    }

    return save.focusIds.reduce((acc, focusId) => {
      const focus = semesterFocuses.find((entry) => entry.id === focusId);
      return focus ? applyEffects(acc, focus.statEffects) : acc;
    }, { ...save.stats });
  }, [save]);

  useEffect(() => {
    if (!save) {
      setSelectedPhoneThreadId(null);
      return;
    }

    const availableThreadIds = availablePhoneThreads.map((thread) => thread.id);
    if (availableThreadIds.length === 0) {
      setSelectedPhoneThreadId(null);
      return;
    }

    if (!selectedPhoneThreadId || !availableThreadIds.includes(selectedPhoneThreadId)) {
      setSelectedPhoneThreadId(availableThreadIds[0]);
    }
  }, [availablePhoneThreads, save, selectedPhoneThreadId]);

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

  const handlePhoneChoice = (threadId: CommunicationThreadKey, choiceId: string) => {
    if (!save) {
      return;
    }

    if (save.semesterTextedThreadIds.includes(threadId)) {
      return;
    }

    const currentPhoneThread = getPhoneThreadById(save, threadId);
    const choice = currentPhoneThread?.choices.find((entry) => entry.id === choiceId);
    if (!choice || !currentPhoneThread) {
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

    setSave({
      ...save,
      stats: nextStats,
      relationships: nextRelationships,
      communication: nextCommunication,
      semesterTextedThreadIds: [...save.semesterTextedThreadIds, threadId],
      storyFlags: [...new Set([...save.storyFlags, choice.id, ...(choice.flags ?? [])])],
      updatedAt: new Date().toISOString()
    });
    setFlavor({
      text: choice.previewReply === "..." ? "You let the silence carry more than the message did." : choice.previewReply,
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
      text: `${save.playerName} returns for ${nextSemester.title.toLowerCase()}. Some connections feel steadier because you fed them. The neglected ones are harder to pretend about now.`,
      provider: "fallback",
      loading: false
    });
  };

  const restart = () => {
    if (user) {
      window.localStorage.removeItem(getSaveStorageKey(user.id));
    }
    lastPersistedSnapshotRef.current = null;
    setHasUnsavedChanges(false);
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
      {showTutorial ? (
        <TutorialOverlay
          step={tutorialSteps[tutorialStepIndex]}
          stepIndex={tutorialStepIndex}
          totalSteps={tutorialSteps.length}
          onClose={closeTutorial}
          onNext={nextTutorialStep}
          onBack={previousTutorialStep}
        />
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section data-tutorial-target="story" className={clsx("pixel-panel scanlines relative overflow-hidden bg-ink/90", tutorialTargetClass("story"))}>
          <div className="relative min-h-[720px] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-parchment/50 pb-4">
              <div>
                <p className="font-display text-[10px] uppercase leading-relaxed text-sky sm:text-xs">{semester.badge}</p>
                <h1 className="mt-3 text-4xl uppercase tracking-[0.12em] text-parchment sm:text-6xl">{semester.title}</h1>
              </div>
              <div className="flex items-start gap-3">
                <div data-tutorial-target="save" className={clsx("bg-parchment px-4 py-3 text-right text-ink", tutorialTargetClass("save"))}>
                  <p className="font-display text-[10px] uppercase sm:text-xs">Save Status</p>
                  <p className="mt-2 max-w-[16rem] text-2xl leading-6">{syncMessage}</p>
                  <SignedIn>
                    {save ? (
                      <button
                        type="button"
                        onClick={handleManualSave}
                        disabled={isSaving}
                        className="pixel-button mt-4 w-full rounded-none bg-coral px-4 py-3 font-display text-[10px] uppercase text-ink disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/60 sm:text-xs"
                      >
                        {isSaving ? "Saving..." : "Save Progress"}
                      </button>
                    ) : null}
                  </SignedIn>
                  <SignedIn>
                    {save ? (
                      <p className="mt-3 text-base uppercase tracking-[0.18em] text-ink/70">
                        {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
                      </p>
                    ) : null}
                  </SignedIn>
                  <button
                    type="button"
                    onClick={openTutorial}
                    className="pixel-button mt-4 w-full rounded-none bg-sky px-4 py-3 font-display text-[10px] uppercase text-ink sm:text-xs"
                  >
                    Tutorial
                  </button>
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
                    <p className="font-display text-xs uppercase leading-relaxed text-gold">Welcome to Four Years</p>
                    <p className="text-3xl leading-8 text-parchment sm:text-4xl sm:leading-10">
                      Freshman year starts with uncertainty, and the version of you that survives it will be shaped one semester at a time.
                    </p>
                    <p className="text-2xl leading-7 text-parchment/80">
                      Start with the tutorial if you want a guided tour of the planner, stats, relationships, phone, and yearbook before you make your first choice.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={openTutorial}
                      className="pixel-button rounded-none bg-gold px-6 py-4 font-display text-xs uppercase text-ink"
                    >
                      Start with Tutorial
                    </button>
                    <button
                      type="button"
                      onClick={startGame}
                      className="pixel-button rounded-none bg-coral px-6 py-4 font-display text-xs uppercase text-ink"
                    >
                      Start the Semester
                    </button>
                  </div>
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
                        Start {getSemesterDefinition(nextSemesterId).title}
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

              <div className={clsx("mt-8", tutorialTargetClass("yearbook"))} data-tutorial-target="yearbook">
                <YearbookArchive entries={archiveEntries} />
              </div>

            </SignedIn>
          </div>
        </section>

        <aside className="space-y-6">
          <section data-tutorial-target="stats" className={clsx("pixel-panel bg-ink/85 p-5", tutorialTargetClass("stats"))}>
            <p className="font-display text-xs uppercase leading-relaxed text-gold">Cumulative stats</p>
            <div className="mt-5 space-y-5">
              <StatMeter label="Academics" value={(save?.step === "planner" ? previewStats.academics : save?.stats.academics) ?? DEFAULT_STATS.academics} color={statColors.academics} />
              <StatMeter label="Social" value={(save?.step === "planner" ? previewStats.social : save?.stats.social) ?? DEFAULT_STATS.social} color={statColors.social} />
              <StatMeter label="Mental" value={(save?.step === "planner" ? previewStats.mental : save?.stats.mental) ?? DEFAULT_STATS.mental} color={statColors.mental} />
              <StatMeter label="Finances" value={(save?.step === "planner" ? previewStats.finances : save?.stats.finances) ?? DEFAULT_STATS.finances} color={statColors.finances} />
            </div>
          </section>

          <div data-tutorial-target="relationships" className={tutorialTargetClass("relationships")}>
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
            ) : (
              <RelationshipPreviewPanel />
            )}
          </div>

          <div data-tutorial-target="phone" className={tutorialTargetClass("phone")}>
            {save ? (
              <PhonePanel
                save={save}
                selectedThreadId={selectedPhoneThreadId}
                onSelectThread={setSelectedPhoneThreadId}
                onChooseThreadReply={handlePhoneChoice}
              />
            ) : (
              <PhonePreviewPanel />
            )}
          </div>

          <div data-tutorial-target="map" className={tutorialTargetClass("map")}>
            <CampusMap visited={visitedLocationIds} activeLocationId={currentScene?.locationId} />
          </div>

          <PixelDormAnimation />
        </aside>
      </div>
    </main>
  );
}
