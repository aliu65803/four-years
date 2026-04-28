import { SceneDefinition, SemesterFocus, Stats } from "@/lib/game/types";

export const DEFAULT_STATS: Stats = {
  academics: 50,
  social: 50,
  mental: 50,
  finances: 50
};

export const semesterFocuses: SemesterFocus[] = [
  {
    id: "honors-grind",
    label: "Honors Grind",
    description: "Take the hardest schedule you can manage and try to impress everyone.",
    statEffects: { academics: 12, mental: -8, social: -4 },
    flavor: "You tell yourself that if you start strong enough, maybe the rest of college will stop feeling so uncertain."
  },
  {
    id: "friendship-first",
    label: "Friendship First",
    description: "Say yes to floor dinners, club fairs, and every awkward invitation.",
    statEffects: { social: 12, mental: 6, academics: -5 },
    flavor: "You decide that if college is a new world, the bravest thing you can do is let people in."
  },
  {
    id: "campus-job",
    label: "Campus Job",
    description: "Pick up hours at the student center to keep your budget from shrinking.",
    statEffects: { finances: 12, mental: -3, academics: -2 },
    flavor: "You start counting coffee purchases in your head before they happen."
  },
  {
    id: "self-preservation",
    label: "Self Preservation",
    description: "Protect your sleep, find therapy resources, and make quiet routines on purpose.",
    statEffects: { mental: 12, academics: 3, social: -3 },
    flavor: "You learn early that surviving college is its own kind of ambition."
  }
];

export const semesterScenes: SceneDefinition[] = [
  {
    id: "professor-office-hours",
    title: "Office Hours",
    setting: "Your strict writing professor studies you over a half-moon pair of glasses.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    summary: "The first major essay comes back covered in notes. You can ignore the sting, get defensive, or step closer to the challenge.",
    promptSeed: "A strict but fair college professor speaking to a nervous freshman in early fall semester.",
    choices: [
      {
        id: "lean-in",
        label: "Ask how to improve",
        description: "Swallow the embarrassment and ask for concrete advice.",
        statEffects: { academics: 10, mental: -2 },
        flags: ["professor_respects_you"],
        nextFlavorPrompt: "The professor notices the student is trying hard and gives sharper, caring advice."
      },
      {
        id: "deflect",
        label: "Play it cool",
        description: "Act like the feedback does not bother you and promise to handle it.",
        statEffects: { social: 2, academics: -5, mental: -3 },
        nextFlavorPrompt: "The student is masking insecurity with confidence, and the professor can tell."
      },
      {
        id: "spiral",
        label: "Admit you're overwhelmed",
        description: "Tell the truth: the transition is hitting harder than expected.",
        statEffects: { mental: 6, academics: 2, social: -2 },
        flags: ["professor_showed_grace"],
        nextFlavorPrompt: "The conversation softens when the student honestly admits they are struggling."
      }
    ]
  },
  {
    id: "dorm-rooftop",
    title: "Rooftop Air",
    setting: "A new friend sneaks you onto the dorm roof with convenience-store hot chocolate.",
    background: "/backgrounds/rooftop-night.svg",
    character: "Mina",
    summary: "Mina talks like you have known each other longer than a week. You can open up, keep the moment light, or leave early to get ahead on work.",
    promptSeed: "A warm, witty new college friend sharing a quiet rooftop moment with a freshman on a chilly evening.",
    choices: [
      {
        id: "open-up",
        label: "Tell Mina what scares you",
        description: "Let someone see the version of you that is still adjusting.",
        statEffects: { social: 10, mental: 4 },
        flags: ["mina_trusts_you"],
        nextFlavorPrompt: "The new friendship deepens because the player chose vulnerability."
      },
      {
        id: "keep-joking",
        label: "Keep it playful",
        description: "Trade stories, laugh a lot, and stay on the surface for now.",
        statEffects: { social: 7, mental: 1 },
        nextFlavorPrompt: "The scene stays bright and funny, with easy chemistry and a little distance."
      },
      {
        id: "head-back",
        label: "Leave to study",
        description: "Tell Mina you should go before the workload gets worse.",
        statEffects: { academics: 6, social: -4, mental: -2 },
        nextFlavorPrompt: "The player chooses responsibility over connection, and the mood shifts."
      }
    ]
  },
  {
    id: "student-center-shift",
    title: "Closing Shift",
    setting: "The student center is nearly empty when your shift drifts into midnight.",
    background: "/backgrounds/student-center.svg",
    character: "Yourself",
    summary: "An extra shift could help, but you are already tired. Do you stay, trade the shift, or spend the hour catching your breath with notes and tea?",
    promptSeed: "A reflective slice-of-life college scene about exhaustion, money pressure, and choosing what to carry.",
    choices: [
      {
        id: "stay-late",
        label: "Take the extra hour",
        description: "The paycheck matters and you can sleep later.",
        statEffects: { finances: 9, mental: -6, academics: -2 },
        nextFlavorPrompt: "The player keeps pushing even though they are stretched thin."
      },
      {
        id: "trade-shift",
        label: "Text a coworker to cover",
        description: "Protect tomorrow, even if your budget tightens a little.",
        statEffects: { mental: 8, finances: -4 },
        nextFlavorPrompt: "The player chooses rest and has to live with the financial tradeoff."
      },
      {
        id: "reset-hour",
        label: "Stay, but for yourself",
        description: "Spend the quiet hour journaling and reviewing class notes before heading home.",
        statEffects: { academics: 4, mental: 5, finances: 2 },
        nextFlavorPrompt: "The player turns a lonely hour into a small act of stability."
      }
    ]
  }
];
