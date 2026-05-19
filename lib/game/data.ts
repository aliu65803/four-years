import {
  CommunicationHistory,
  CommunicationThreadKey,
  RelationshipKey,
  Relationships,
  SceneDefinition,
  SemesterDefinition,
  SemesterFocus,
  SemesterId,
  Stats
} from "@/lib/game/types";

export const DEFAULT_STATS: Stats = {
  academics: 50,
  social: 50,
  mental: 50,
  finances: 50
};

export const DEFAULT_RELATIONSHIPS: Relationships = {
  professorAlden: 45,
  mina: 45,
  homeFriends: 72,
  derek: 30
};

export const DEFAULT_COMMUNICATION: CommunicationHistory = {
  homeFriends: {
    sent: 0,
    ignored: 0,
    lastChoiceId: ""
  },
  mina: {
    sent: 0,
    ignored: 0,
    lastChoiceId: ""
  },
  derek: {
    sent: 0,
    ignored: 0,
    lastChoiceId: ""
  }
};

export const relationshipLabels: Record<RelationshipKey, string> = {
  professorAlden: "Professor Alden",
  mina: "Mina",
  homeFriends: "Home Friends",
  derek: "Derek"
};

export const communicationLabels: Record<CommunicationThreadKey, string> = {
  homeFriends: "Home Friends",
  mina: "Mina",
  derek: "Derek"
};

export const semesterDefinitions: Record<SemesterId, SemesterDefinition> = {
  "freshman-fall": {
    id: "freshman-fall",
    title: "Freshman Fall",
    badge: "Year One, Semester One",
    arrivalTitle: "Move-in day",
    arrivalCopy:
      "Campus keeps introducing itself in fragments: cart wheels on brick, parents pretending not to worry, and a dorm room that still smells like fresh paint.",
    plannerPrompt:
      "Choose exactly three priorities. This first semester is about what gets your time when everything suddenly matters at once.",
    reflectionPrompt: "Year one, chapter one"
  },
  "freshman-spring": {
    id: "freshman-spring",
    title: "Freshman Spring",
    badge: "Year One, Semester Two",
    arrivalTitle: "Winter return",
    arrivalCopy:
      "You come back to campus knowing where the shortcuts are now. The confidence is real, but so is the awkwardness of carrying old friendships and new ones at the same time.",
    plannerPrompt:
      "Spring feels less like surviving and more like choosing who you are becoming. Pick exactly three priorities to shape the semester.",
    reflectionPrompt: "Year one, chapter two"
  },
  "sophomore-fall": {
    id: "sophomore-fall",
    title: "Sophomore Fall",
    badge: "Year Two, Semester One",
    arrivalTitle: "Back on campus",
    arrivalCopy:
      "You return knowing the routines now. Sophomore year feels less like being new and more like being pulled in different directions by the versions of yourself that all want to win.",
    plannerPrompt:
      "You are no longer just adjusting. Pick exactly three priorities to decide which version of your life gets to become real this fall.",
    reflectionPrompt: "Year two, chapter one"
  },
  "sophomore-spring": {
    id: "sophomore-spring",
    title: "Sophomore Spring",
    badge: "Year Two, Semester Two",
    arrivalTitle: "Late winter thaw",
    arrivalCopy:
      "Spring starts before you feel finished with fall. Sophomore year is asking harder questions now: who do you love, what are you building, and which future are you quietly moving toward?",
    plannerPrompt:
      "This semester turns pressure into shape. Pick exactly three priorities to decide how your future and your relationships pull against each other.",
    reflectionPrompt: "Year two, chapter two"
  },
  "junior-fall": {
    id: "junior-fall",
    title: "Junior Fall",
    badge: "Year Three, Semester One",
    arrivalTitle: "The fast year",
    arrivalCopy:
      "Junior year begins like a conveyor belt already in motion. Applications, expectations, and people who believe in you all arrive at once, and none of them wait politely.",
    plannerPrompt:
      "Everything wants to accelerate now. Pick exactly three priorities to decide what survives the velocity of junior fall.",
    reflectionPrompt: "Year three, chapter one"
  },
  "junior-spring": {
    id: "junior-spring",
    title: "Junior Spring",
    badge: "Year Three, Semester Two",
    arrivalTitle: "Proof season",
    arrivalCopy:
      "This spring asks for proof. The future stops being abstract and starts arriving as decisions, deadlines, and the quiet cost of staying ambitious for too long.",
    plannerPrompt:
      "Junior spring is where momentum turns into consequence. Pick exactly three priorities to decide what kind of future this pressure is building.",
    reflectionPrompt: "Year three, chapter two"
  },
  "senior-fall": {
    id: "senior-fall",
    title: "Senior Fall",
    badge: "Year Four, Semester One",
    arrivalTitle: "Almost the last year",
    arrivalCopy:
      "Senior year begins with the strange loneliness of already being on your way out. Campus still belongs to you, but it also feels like it is slowly learning how to continue without you.",
    plannerPrompt:
      "Senior fall is about closure, leadership, and the shape of the life waiting after graduation. Pick exactly three priorities to decide what deserves your last long season here.",
    reflectionPrompt: "Year four, chapter one"
  },
  "senior-spring": {
    id: "senior-spring",
    title: "Senior Spring",
    badge: "Year Four, Semester Two",
    arrivalTitle: "Last semester",
    arrivalCopy:
      "The last semester arrives before you feel ready. Every ordinary day starts glowing at the edges, as if campus already knows this is the final time it will hold this version of you.",
    plannerPrompt:
      "Senior spring is about endings, commitment, and choosing the life that begins after this one. Pick exactly three priorities to decide what survives the crossing.",
    reflectionPrompt: "Year four, chapter two"
  }
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

export const sceneDefinitionsById: Record<string, SceneDefinition> = {
  "professor-office-hours": {
    id: "professor-office-hours",
    title: "Office Hours",
    setting: "Your strict writing professor studies you over a half-moon pair of glasses.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "The first major essay comes back covered in notes. You can ignore the sting, get defensive, or step closer to the challenge.",
    promptSeed: "A strict but fair college professor speaking to a nervous freshman in early fall semester.",
    choices: [
      {
        id: "lean-in",
        label: "Ask how to improve",
        description: "Swallow the embarrassment and ask for concrete advice.",
        statEffects: { academics: 10, mental: -2 },
        relationshipEffects: { professorAlden: 8 },
        flags: ["professor_respects_you"],
        nextFlavorPrompt: "The professor notices the student is trying hard and gives sharper, caring advice."
      },
      {
        id: "deflect",
        label: "Play it cool",
        description: "Act like the feedback does not bother you and promise to handle it.",
        statEffects: { social: 2, academics: -5, mental: -3 },
        relationshipEffects: { professorAlden: -6 },
        nextFlavorPrompt: "The student is masking insecurity with confidence, and the professor can tell."
      },
      {
        id: "spiral",
        label: "Admit you're overwhelmed",
        description: "Tell the truth: the transition is hitting harder than expected.",
        statEffects: { mental: 6, academics: 2, social: -2 },
        relationshipEffects: { professorAlden: 5 },
        flags: ["professor_showed_grace"],
        nextFlavorPrompt: "The conversation softens when the student honestly admits they are struggling."
      }
    ]
  },
  "dorm-rooftop": {
    id: "dorm-rooftop",
    title: "Rooftop Air",
    setting: "A new friend sneaks you onto the dorm roof with convenience-store hot chocolate.",
    background: "/backgrounds/rooftop-night.svg",
    character: "Mina",
    locationId: "north-dorm",
    locationLabel: "North Dorm",
    summary:
      "Mina talks like you have known each other longer than a week. You can open up, keep the moment light, or leave early to get ahead on work.",
    promptSeed: "A warm, witty new college friend sharing a quiet rooftop moment with a freshman on a chilly evening.",
    choices: [
      {
        id: "open-up",
        label: "Tell Mina what scares you",
        description: "Let someone see the version of you that is still adjusting.",
        statEffects: { social: 10, mental: 4 },
        relationshipEffects: { mina: 10 },
        flags: ["mina_trusts_you"],
        nextFlavorPrompt: "The new friendship deepens because the player chose vulnerability."
      },
      {
        id: "keep-joking",
        label: "Keep it playful",
        description: "Trade stories, laugh a lot, and stay on the surface for now.",
        statEffects: { social: 7, mental: 1 },
        relationshipEffects: { mina: 5 },
        nextFlavorPrompt: "The scene stays bright and funny, with easy chemistry and a little distance."
      },
      {
        id: "head-back",
        label: "Leave to study",
        description: "Tell Mina you should go before the workload gets worse.",
        statEffects: { academics: 6, social: -4, mental: -2 },
        relationshipEffects: { mina: -7 },
        nextFlavorPrompt: "The player chooses responsibility over connection, and the mood shifts."
      }
    ]
  },
  "student-center-shift": {
    id: "student-center-shift",
    title: "Closing Shift",
    setting: "The student center is nearly empty when your shift drifts into midnight.",
    background: "/backgrounds/student-center.svg",
    character: "Yourself",
    locationId: "student-center",
    locationLabel: "Student Center",
    summary:
      "An extra shift could help, but you are already tired. Do you stay, trade the shift, or spend the hour catching your breath with notes and tea?",
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
  },
  "library-late-floor": {
    id: "library-late-floor",
    title: "Quiet Floor",
    setting: "The library's top floor glows softly under green-shaded lamps while rain taps against the windows.",
    background: "/backgrounds/student-center.svg",
    character: "Yourself",
    locationId: "library",
    locationLabel: "Library",
    summary:
      "With no shift to run to, the night opens in front of you. You can lock into your reading, drift into a reflective break, or join a nearby study table that waves you over.",
    promptSeed: "A calm late-night college library scene about deciding what to do with unexpected time.",
    choices: [
      {
        id: "lock-in",
        label: "Stay focused",
        description: "Turn the quiet into momentum and get ahead on your work.",
        statEffects: { academics: 8, mental: -2 },
        nextFlavorPrompt: "The player uses the open night to get serious and quietly impress themselves."
      },
      {
        id: "window-breath",
        label: "Take a soft reset",
        description: "Close the notebook for a minute and let yourself breathe.",
        statEffects: { mental: 8, academics: 2 },
        nextFlavorPrompt: "The player chooses reflection and steadiness over constant pressure."
      },
      {
        id: "join-table",
        label: "Join the study table",
        description: "Sit with a group from class and let the night feel less solitary.",
        statEffects: { social: 6, academics: 4 },
        nextFlavorPrompt: "The player finds belonging in a low-key academic space."
      }
    ]
  },
  "alden-journal-invite": {
    id: "alden-journal-invite",
    title: "Marked Pages",
    setting: "Professor Alden catches you after class and asks if you have considered joining the student journal revision team.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "Spring begins with an invitation that feels a little like recognition and a little like pressure. You can say yes immediately, ask for room to think, or dodge the offer altogether.",
    promptSeed: "A returning professor notices a freshman has matured and offers them a chance to step up academically.",
    choices: [
      {
        id: "accept-journal",
        label: "Say yes",
        description: "Step into the challenge and let yourself be seen.",
        statEffects: { academics: 9, mental: -2 },
        relationshipEffects: { professorAlden: 9 },
        nextFlavorPrompt: "The player accepts a meaningful academic opportunity and feels both proud and nervous."
      },
      {
        id: "ask-time",
        label: "Ask for time",
        description: "You want the chance, but not at the cost of drowning.",
        statEffects: { mental: 4, academics: 4 },
        relationshipEffects: { professorAlden: 4 },
        nextFlavorPrompt: "The player responds thoughtfully, balancing ambition with self-protection."
      },
      {
        id: "turn-away",
        label: "Step back",
        description: "Tell him your plate is already too full.",
        statEffects: { mental: 2, academics: -4 },
        relationshipEffects: { professorAlden: -5 },
        nextFlavorPrompt: "The player chooses caution over visibility, and the relationship cools slightly."
      }
    ]
  },
  "alden-reset-conference": {
    id: "alden-reset-conference",
    title: "Reset Conference",
    setting: "Professor Alden asks you to stay after class for a quick conference about how to approach spring differently.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "The conversation is more measured this time. You can lean into structure, defend your habits, or admit you want a fresh start.",
    promptSeed: "A professor and freshman revisit a rocky first-semester dynamic and decide how spring should feel.",
    choices: [
      {
        id: "take-structure",
        label: "Take the plan",
        description: "Accept the framework and try to prove you can grow.",
        statEffects: { academics: 7, mental: -1 },
        relationshipEffects: { professorAlden: 6 },
        nextFlavorPrompt: "The player accepts structure and starts repairing trust."
      },
      {
        id: "push-back",
        label: "Push back",
        description: "Tell him you do not want every weakness translated into a system.",
        statEffects: { mental: -2, academics: -3, social: 2 },
        relationshipEffects: { professorAlden: -6 },
        nextFlavorPrompt: "The player resists the professor's framing and tension resurfaces."
      },
      {
        id: "fresh-start",
        label: "Ask for a fresh start",
        description: "Be honest that you handled last semester badly and want to do better.",
        statEffects: { mental: 3, academics: 4 },
        relationshipEffects: { professorAlden: 7 },
        nextFlavorPrompt: "The player chooses humility and the conversation softens."
      }
    ]
  },
  "mina-almost-confession": {
    id: "mina-almost-confession",
    title: "Snow Glow",
    setting: "Mina drags you to a campus winter lights event and, somewhere between laughing and people-watching, admits she is scared everyone will go home this summer and come back different.",
    background: "/backgrounds/snow-quad.svg",
    character: "Mina",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "This is less about romance than about whether college friendships can become real enough to survive change. You can reassure her, admit you are scared too, or joke the moment away because seriousness still makes you nervous.",
    promptSeed: "Two close freshman friends talk honestly about how new college friendships might change them under winter lights.",
    choices: [
      {
        id: "reassure-her",
        label: "Reassure her",
        description: "Tell Mina she matters enough that you will not let the friendship go passive.",
        statEffects: { social: 8, mental: 1 },
        relationshipEffects: { mina: 10 },
        nextFlavorPrompt: "The player actively chooses to protect a meaningful new friendship."
      },
      {
        id: "admit-youre-scared-too",
        label: "Admit you are scared too",
        description: "Say the hard part out loud: you are afraid of losing both old people and new ones.",
        statEffects: { social: 6, mental: 3 },
        relationshipEffects: { mina: 8, homeFriends: 1 },
        nextFlavorPrompt: "The player builds friendship through shared vulnerability about change and distance."
      },
      {
        id: "joke-it-off",
        label: "Joke it off",
        description: "Keep the night bright, even if that means leaving the deeper feeling untouched.",
        statEffects: { social: 3, mental: -1 },
        relationshipEffects: { mina: -2 },
        nextFlavorPrompt: "The player keeps the friendship easy on the surface instead of going deeper."
      }
    ]
  },
  "mina-group-static": {
    id: "mina-group-static",
    title: "Group Static",
    setting: "Mina pulls you into a crowded student union booth after class, but both of you are busy enough now that friendship has started needing effort instead of momentum.",
    background: "/backgrounds/student-union.svg",
    character: "Mina",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "Spring makes the friendship less automatic, not less important. You can meet her where she is, overcompensate, or quietly keep some distance.",
    promptSeed: "A freshman friendship that formed quickly now has to survive real schedules, stress, and effort.",
    choices: [
      {
        id: "meet-her",
        label: "Meet her honestly",
        description: "Ask how she is really doing instead of performing ease.",
        statEffects: { social: 7, mental: 2 },
        relationshipEffects: { mina: 7 },
        nextFlavorPrompt: "The player chooses steady friendship maintenance over easy surface momentum."
      },
      {
        id: "perform-fine",
        label: "Act extra chill",
        description: "Try to smooth over the weirdness with jokes and momentum.",
        statEffects: { social: 4, mental: -2 },
        relationshipEffects: { mina: 1 },
        nextFlavorPrompt: "The player tries to cover distance with humor instead of deeper effort."
      },
      {
        id: "hold-back",
        label: "Hold back",
        description: "Stay polite, but stop reaching for more than that.",
        statEffects: { mental: 1, social: -3 },
        relationshipEffects: { mina: -5 },
        nextFlavorPrompt: "The player stops reaching and the new friendship cools."
      }
    ]
  },
  "home-friends-call": {
    id: "home-friends-call",
    title: "Group Chat Static",
    setting: "Your high school friends keep texting pictures from the university they all chose together, and you finally answer a late-night call.",
    background: "/backgrounds/phone-glow.svg",
    character: "Home Friends",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "They still love you, but their lives overlap in ways yours no longer does. You can be honest about the distance, pretend everything still feels the same, or skip the call and send a short reply instead.",
    promptSeed: "A freshman at a different college struggles to stay close to a tight-knit friend group back home.",
    choices: [
      {
        id: "be-honest",
        label: "Name the distance",
        description: "Tell them you miss them and also do not know how to fit back into the old rhythm.",
        statEffects: { mental: 4, social: 4 },
        relationshipEffects: { homeFriends: 8 },
        nextFlavorPrompt: "The player brings honesty to a drifting friendship and gives it a real chance."
      },
      {
        id: "play-along",
        label: "Keep it easy",
        description: "Laugh, catch up, and leave the deeper feeling untouched.",
        statEffects: { social: 5, mental: -1 },
        relationshipEffects: { homeFriends: 3 },
        nextFlavorPrompt: "The player keeps things bright and familiar, even if some truth stays unsaid."
      },
      {
        id: "send-text",
        label: "Send a quick text",
        description: "You are too tired for the ache of hearing all their voices together tonight.",
        statEffects: { mental: -2, academics: 2 },
        relationshipEffects: { homeFriends: -7 },
        nextFlavorPrompt: "The player avoids the call and feels the distance widen."
      }
    ]
  },
  "student-center-promotion": {
    id: "student-center-promotion",
    title: "Shift Swap Season",
    setting: "By spring, the student center supervisor already trusts you enough to ask whether you want steadier hours.",
    background: "/backgrounds/student-center.svg",
    character: "Yourself",
    locationId: "student-center",
    locationLabel: "Student Center",
    summary:
      "More hours could make money less scary, but your life is finally fuller now. You can take the shift block, negotiate, or stay where you are.",
    promptSeed: "A college student weighs money, stability, and bandwidth while being offered more work hours.",
    choices: [
      {
        id: "take-hours",
        label: "Take the hours",
        description: "Choose the financial relief, even if it narrows everything else.",
        statEffects: { finances: 10, mental: -5, social: -2 },
        nextFlavorPrompt: "The player prioritizes money and pays for it with energy."
      },
      {
        id: "negotiate-hours",
        label: "Negotiate balance",
        description: "Ask for a version that helps without swallowing the semester.",
        statEffects: { finances: 6, mental: 2, academics: 1 },
        nextFlavorPrompt: "The player advocates for a more sustainable balance."
      },
      {
        id: "keep-it-light",
        label: "Stay where you are",
        description: "You choose steadiness over every extra dollar.",
        statEffects: { mental: 4, finances: -2 },
        nextFlavorPrompt: "The player chooses breathing room and accepts the financial compromise."
      }
    ]
  },
  "library-symposium": {
    id: "library-symposium",
    title: "Open Tables",
    setting: "The library hosts a tiny spring symposium where students workshop projects over coffee and half-finished drafts.",
    background: "/backgrounds/student-union.svg",
    character: "Yourself",
    locationId: "library",
    locationLabel: "Library",
    summary:
      "No one forces you to be here. You can present your work, circulate and connect, or disappear into the stacks when the room starts to feel too full.",
    promptSeed: "A spring campus event where a freshman decides whether to be visible or retreat.",
    choices: [
      {
        id: "present-work",
        label: "Present something",
        description: "Let your work take up a little space in public.",
        statEffects: { academics: 8, mental: -1, social: 2 },
        nextFlavorPrompt: "The player chooses visibility and quiet courage."
      },
      {
        id: "circulate",
        label: "Work the room",
        description: "Talk to people, swap ideas, and let the night turn social.",
        statEffects: { social: 8, academics: 3 },
        nextFlavorPrompt: "The player treats an academic room like a social opportunity."
      },
      {
        id: "hide-in-stacks",
        label: "Hide in the stacks",
        description: "You came, which is enough for tonight.",
        statEffects: { mental: 3, academics: 2, social: -3 },
        nextFlavorPrompt: "The player chooses gentleness over pressure in a crowded room."
      }
    ]
  },
  "alden-independent-study": {
    id: "alden-independent-study",
    title: "Independent Study",
    setting: "Professor Alden catches you in the hallway with a folder tucked under his arm and asks whether you have considered an independent study next term.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "He speaks to you like someone who has already started imagining your future. You can lean into the trust, ask what it would cost, or say you are not sure you want your life narrowed around one talent.",
    promptSeed: "A sophomore student is being treated like a serious mentee by a demanding professor.",
    choices: [
      {
        id: "say-yes-study",
        label: "Lean in",
        description: "Tell him the challenge sounds real in exactly the way you need.",
        statEffects: { academics: 10, mental: -2 },
        relationshipEffects: { professorAlden: 8 },
        nextFlavorPrompt: "The player accepts a mentorship opportunity and feels the exhilaration of being taken seriously."
      },
      {
        id: "ask-cost-study",
        label: "Ask what it costs",
        description: "You want the opportunity, but not if it erases the rest of your life.",
        statEffects: { academics: 5, mental: 3 },
        relationshipEffects: { professorAlden: 4 },
        nextFlavorPrompt: "The player negotiates ambition with a stronger sense of personal boundaries."
      },
      {
        id: "step-sideways-study",
        label: "Step sideways",
        description: "Say you are not ready to become only the best version of one thing.",
        statEffects: { mental: 4, academics: -3, social: 2 },
        relationshipEffects: { professorAlden: -4 },
        nextFlavorPrompt: "The player resists being defined by academic excellence alone."
      }
    ]
  },
  "alden-shifting-center": {
    id: "alden-shifting-center",
    title: "Shifting Center",
    setting: "Professor Alden returns your paper with one note underlined twice: You are capable of more than this if you stop writing around yourself.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "Sophomore fall makes his expectations feel heavier. You can rise to them, argue that not everything needs to be a referendum on your potential, or admit you do not know what you want anymore.",
    promptSeed: "A sophomore and a demanding professor renegotiate ambition when expectations start to feel personal.",
    choices: [
      {
        id: "rise-to-it",
        label: "Rise to it",
        description: "Take the note seriously and let it sharpen you.",
        statEffects: { academics: 8, mental: -2 },
        relationshipEffects: { professorAlden: 6 },
        nextFlavorPrompt: "The player answers pressure with discipline."
      },
      {
        id: "push-back-limits",
        label: "Push back",
        description: "Tell him you are tired of every weakness becoming a performance review.",
        statEffects: { mental: -3, academics: -3, social: 2 },
        relationshipEffects: { professorAlden: -7 },
        nextFlavorPrompt: "The player finally challenges the professor's authority over their sense of worth."
      },
      {
        id: "admit-uncertain",
        label: "Admit uncertainty",
        description: "Say the truth: you do not know which version of your life you are trying to build.",
        statEffects: { mental: 4, academics: 3 },
        relationshipEffects: { professorAlden: 3 },
        nextFlavorPrompt: "The player speaks from uncertainty instead of defensiveness."
      }
    ]
  },
  "derek-open-mic": {
    id: "derek-open-mic",
    title: "Mic Check",
    setting: "You linger after a student union open mic and end up helping a stranger coil cables while he teases you for pretending you were only staying out of politeness.",
    background: "/backgrounds/student-union.svg",
    character: "Derek",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "Derek is easy to talk to in the dangerous way that makes you answer honestly before you mean to. You can flirt back, keep it friendly, or disappear before the moment gets any sharper.",
    promptSeed: "A sophomore meets a new romantic prospect with an easy sense of humor after a campus open mic.",
    choices: [
      {
        id: "flirt-back",
        label: "Flirt back",
        description: "Match his energy and let the air change.",
        statEffects: { social: 8, mental: 2 },
        relationshipEffects: { derek: 12 },
        nextFlavorPrompt: "The player chooses immediate chemistry and enjoys how natural it feels."
      },
      {
        id: "friendly-banter",
        label: "Keep it easy",
        description: "Stay warm, but leave the line between interest and friendliness blurry.",
        statEffects: { social: 5, mental: 1 },
        relationshipEffects: { derek: 6 },
        nextFlavorPrompt: "The player keeps the meeting light, leaving room for something later."
      },
      {
        id: "duck-out",
        label: "Duck out",
        description: "Offer a quick excuse before the newness can become vulnerability.",
        statEffects: { mental: -1, social: -2 },
        relationshipEffects: { derek: -3 },
        nextFlavorPrompt: "The player avoids a promising connection because new feelings feel risky."
      }
    ]
  },
  "derek-study-break": {
    id: "derek-study-break",
    title: "Study Break",
    setting: "You keep running into Derek on purpose or by accident, until one night he drops into the chair across from you in the student union with two coffees and a grin.",
    background: "/backgrounds/student-union.svg",
    character: "Derek",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "The flirtation is gentler here, less electric but more deliberate. You can let him stay, test the possibility, or keep the conversation carefully surface-level.",
    promptSeed: "A slow-burn romantic prospect keeps finding reasons to stay in the player's orbit.",
    choices: [
      {
        id: "let-him-stay",
        label: "Let him stay",
        description: "Give the moment a little more room than feels safe.",
        statEffects: { social: 7, mental: 2 },
        relationshipEffects: { derek: 9 },
        nextFlavorPrompt: "The player allows a slow connection to deepen."
      },
      {
        id: "test-possibility",
        label: "Ask a real question",
        description: "See whether his ease has something more thoughtful underneath it.",
        statEffects: { social: 4, academics: 1, mental: 1 },
        relationshipEffects: { derek: 7 },
        nextFlavorPrompt: "The player chooses curiosity and finds unexpected depth."
      },
      {
        id: "keep-surface",
        label: "Keep it surface-level",
        description: "Do not let this become the most interesting part of your week.",
        statEffects: { mental: 1, social: -1 },
        relationshipEffects: { derek: -1 },
        nextFlavorPrompt: "The player protects themselves by refusing to let the moment matter too much."
      }
    ]
  },
  "mina-crossfade": {
    id: "mina-crossfade",
    title: "Crossfade",
    setting: "Mina still knows how to find you in a crowded room, but sophomore fall keeps proving that even strong friendships can get lost inside overloaded weeks and new versions of yourselves.",
    background: "/backgrounds/snow-quad.svg",
    character: "Mina",
    locationId: "north-dorm",
    locationLabel: "North Dorm",
    summary:
      "The question is not whether you care about each other. It is whether you will keep choosing the friendship when life gets more crowded. You can name that effort, trust the friendship silently, or let the distance keep writing the story for you.",
    promptSeed: "Two close college friends decide whether strong friendship is something you maintain deliberately or lose passively.",
    choices: [
      {
        id: "name-the-effort",
        label: "Name the effort",
        description: "Tell Mina you do not want to become the kind of friends who only remember each other fondly.",
        statEffects: { social: 7, mental: 1 },
        relationshipEffects: { mina: 9 },
        nextFlavorPrompt: "The player actively commits to preserving an important college friendship."
      },
      {
        id: "trust-it",
        label: "Trust it quietly",
        description: "Believe the friendship can survive without every feeling being spoken aloud.",
        statEffects: { social: 5, mental: 2 },
        relationshipEffects: { mina: 4 },
        nextFlavorPrompt: "The player trusts the strength of the friendship without making a speech about it."
      },
      {
        id: "let-distance-grow",
        label: "Let distance grow",
        description: "Tell yourself it is normal if friendships fade a little as life gets fuller.",
        statEffects: { mental: -1, social: -4 },
        relationshipEffects: { mina: -8 },
        nextFlavorPrompt: "The player stops protecting the friendship and feels it loosen."
      }
    ]
  },
  "mina-parallel-lives": {
    id: "mina-parallel-lives",
    title: "Parallel Lives",
    setting: "You and Mina keep catching each other between obligations, familiar enough to smile immediately but not always enough to stay.",
    background: "/backgrounds/student-union.svg",
    character: "Mina",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "Sophomore fall can make once-intense friendships feel strangely procedural. You can try to reconnect, let the drift happen, or admit you miss having a real new-life person on campus.",
    promptSeed: "A once-easy college friendship is slipping into parallel routines unless someone deliberately chooses otherwise.",
    choices: [
      {
        id: "reconnect",
        label: "Try to reconnect",
        description: "Reach for the friendship instead of assuming it will hold itself together.",
        statEffects: { social: 6, mental: 2 },
        relationshipEffects: { mina: 7 },
        nextFlavorPrompt: "The player chooses intentional friendship maintenance over passive drift."
      },
      {
        id: "let-drift",
        label: "Let it drift",
        description: "Not every friendship survives becoming more complicated.",
        statEffects: { mental: -1, academics: 2 },
        relationshipEffects: { mina: -5 },
        nextFlavorPrompt: "The player lets a meaningful new friendship weaken through inaction."
      },
      {
        id: "say-you-miss-it",
        label: "Say you miss it",
        description: "Be a little embarrassing and tell the truth anyway.",
        statEffects: { mental: 3, social: 4 },
        relationshipEffects: { mina: 5 },
        nextFlavorPrompt: "The player uses honesty to try to preserve an important college friendship."
      }
    ]
  },
  "apartment-budget": {
    id: "apartment-budget",
    title: "Budget Spreadsheet",
    setting: "Your friends start talking about next year's housing, and suddenly every option comes with a number attached to it.",
    background: "/backgrounds/phone-glow.svg",
    character: "Yourself",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "Sophomore fall makes money feel less theoretical. You can chase the cheapest option, negotiate for a healthier middle ground, or choose comfort and trust your future self to absorb the cost.",
    promptSeed: "A sophomore student faces the first real housing budget conversation and what it reveals about their priorities.",
    choices: [
      {
        id: "cheapest-option",
        label: "Chase the cheapest option",
        description: "Protect your future wallet even if the living situation looks shaky.",
        statEffects: { finances: 9, mental: -3 },
        nextFlavorPrompt: "The player chooses financial caution over comfort."
      },
      {
        id: "balanced-lease",
        label: "Negotiate balance",
        description: "You want a place that feels livable, not just survivable.",
        statEffects: { finances: 4, mental: 4, social: 2 },
        nextFlavorPrompt: "The player pushes for a more sustainable compromise."
      },
      {
        id: "comfort-first",
        label: "Choose comfort",
        description: "Pick the option that would let you breathe, even if it costs more.",
        statEffects: { mental: 6, finances: -5 },
        nextFlavorPrompt: "The player values stability and accepts the financial consequence."
      }
    ]
  },
  "major-declaration": {
    id: "major-declaration",
    title: "Declaration Form",
    setting: "The major declaration portal sits open on your laptop while every adult voice in your head starts speaking at once.",
    background: "/backgrounds/phone-glow.svg",
    character: "Yourself",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "Sophomore year demands language for the future. You can commit confidently, follow what feels practical, or leave the form half-finished while you buy yourself more time.",
    promptSeed: "A sophomore student faces the pressure of declaring a major and choosing a future identity.",
    choices: [
      {
        id: "commit-confidently",
        label: "Commit confidently",
        description: "Choose the path that feels most like your sharpened self.",
        statEffects: { academics: 8, mental: -1 },
        nextFlavorPrompt: "The player embraces a stronger sense of direction."
      },
      {
        id: "choose-practical",
        label: "Choose practicality",
        description: "Make the decision that feels safest for the life after college.",
        statEffects: { finances: 4, academics: 4, mental: -2 },
        nextFlavorPrompt: "The player chooses stability over romance in their academic future."
      },
      {
        id: "delay-form",
        label: "Delay it",
        description: "You need more time than everyone else seems to think is reasonable.",
        statEffects: { mental: 3, academics: -2, social: 1 },
        nextFlavorPrompt: "The player resists premature certainty and buys themselves breathing room."
      }
    ]
  },
  "derek-night-walk": {
    id: "derek-night-walk",
    title: "Night Walk",
    setting: "Derek finds you after an event and asks if you are walking back to the dorms alone, like he has already decided to keep you company.",
    background: "/backgrounds/snow-quad.svg",
    character: "Derek",
    locationId: "lake-path",
    locationLabel: "Lake Path",
    summary:
      "The conversation has crossed into that dangerous soft place where flirting starts to feel like trust. You can let him in, tell him you are still confused about someone else, or keep the night warm but temporary.",
    promptSeed: "A slow-burn campus romance reaches the point where one honest conversation could change everything.",
    choices: [
      {
        id: "let-him-in",
        label: "Let him in",
        description: "Say what you actually want and stop pretending you are only curious.",
        statEffects: { social: 8, mental: 2 },
        relationshipEffects: { derek: 12 },
        nextFlavorPrompt: "The player moves from flirtation into genuine romantic vulnerability."
      },
      {
        id: "admit-confusion",
        label: "Admit confusion",
        description: "Tell him the truth: you are still figuring out what closeness and change are supposed to feel like now.",
        statEffects: { mental: 4, social: 3 },
        relationshipEffects: { derek: 6 },
        nextFlavorPrompt: "The player answers tenderness with honesty about growing up, not with certainty."
      },
      {
        id: "keep-temporary",
        label: "Keep it temporary",
        description: "Let the moment stay lovely without making promises to it.",
        statEffects: { social: 3, mental: 1 },
        relationshipEffects: { derek: 2 },
        nextFlavorPrompt: "The player protects themselves by refusing to define a promising connection."
      }
    ]
  },
  "home-friends-visit": {
    id: "home-friends-visit",
    title: "Visit Weekend",
    setting: "A visit from your hometown friends should feel easy, but by now all of you have grown in directions that do not line up cleanly anymore.",
    background: "/backgrounds/student-union.svg",
    character: "Home Friends",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "The affection is still real, but so is the discomfort of realizing you no longer occupy the same shape in one another's lives. You can be present, pick a fight about what changed, or quietly perform the old version of yourself for one more weekend.",
    promptSeed: "Old friends reunite in college and realize history cannot prevent change.",
    choices: [
      {
        id: "be-present-visit",
        label: "Be present",
        description: "Accept that it is different and love them from who you are now.",
        statEffects: { mental: 4, social: 5 },
        relationshipEffects: { homeFriends: 7 },
        nextFlavorPrompt: "The player chooses mature affection over nostalgia."
      },
      {
        id: "fight-about-change",
        label: "Pick the fight",
        description: "Call out the hurt instead of acting like nobody notices it.",
        statEffects: { mental: -2, social: 1 },
        relationshipEffects: { homeFriends: -6 },
        nextFlavorPrompt: "The player forces the group to confront the distance and risks making it worse."
      },
      {
        id: "perform-old-self",
        label: "Perform the old self",
        description: "Make the jokes, play the role, and deal with the loneliness later.",
        statEffects: { social: 4, mental: -4 },
        relationshipEffects: { homeFriends: 1 },
        nextFlavorPrompt: "The player keeps the peace by slipping back into a version of themselves they have outgrown."
      }
    ]
  },
  "mina-fault-line": {
    id: "mina-fault-line",
    title: "Fault Line",
    setting: "By sophomore spring, you and Mina know each other well enough that the friendship can no longer survive on assumption alone.",
    background: "/backgrounds/student-union.svg",
    character: "Mina",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "The real question is whether your new college life includes each other on purpose, or only by habit. You can ask for honesty about the friendship, ask for space, or keep choosing each other without making it dramatic.",
    promptSeed: "A long-running close college friendship reaches the point where maintenance, drift, and honesty all matter.",
    choices: [
      {
        id: "ask-for-honesty",
        label: "Ask for honesty",
        description: "Talk about whether the friendship still fits the people you are becoming.",
        statEffects: { social: 7, mental: 1 },
        relationshipEffects: { mina: 8 },
        nextFlavorPrompt: "The player asks for honest friendship instead of pretending the drift is not happening."
      },
      {
        id: "ask-for-space",
        label: "Ask for space",
        description: "You need breathing room before the friendship starts to feel like another responsibility.",
        statEffects: { mental: 5, social: -3 },
        relationshipEffects: { mina: -5 },
        nextFlavorPrompt: "The player chooses self-protection even though it costs a meaningful friendship some closeness."
      },
      {
        id: "friendship-one-more-time",
        label: "Choose the friendship",
        description: "Make concrete plans, show up, and let action matter more than over-analysis.",
        statEffects: { social: 4, mental: 1 },
        relationshipEffects: { mina: 3 },
        nextFlavorPrompt: "The player chooses steady friendship through action rather than overcomplicating it."
      }
    ]
  },
  "future-fair": {
    id: "future-fair",
    title: "Future Fair",
    setting: "The career center fills the gym with recruiters, glossy pamphlets, and twenty different versions of panic dressed up as ambition.",
    background: "/backgrounds/student-center.svg",
    character: "Yourself",
    locationId: "student-center",
    locationLabel: "Student Center",
    summary:
      "Sophomore spring suddenly makes the future feel like an audience. You can network aggressively, ask practical questions, or leave halfway through and admit the room is making it hard to breathe.",
    promptSeed: "A sophomore student faces career anxiety in a room designed to reward confidence.",
    choices: [
      {
        id: "network-hard",
        label: "Network hard",
        description: "Perform certainty until it starts to feel almost real.",
        statEffects: { finances: 4, academics: 5, mental: -3, social: 4 },
        nextFlavorPrompt: "The player meets future pressure by becoming visibly ambitious."
      },
      {
        id: "ask-practical-questions",
        label: "Ask practical questions",
        description: "Forget the performance and look for something useful.",
        statEffects: { academics: 4, finances: 3, mental: 1 },
        nextFlavorPrompt: "The player seeks grounded direction instead of prestige."
      },
      {
        id: "leave-halfway",
        label: "Leave halfway",
        description: "You would rather disappoint a room than abandon yourself inside it.",
        statEffects: { mental: 5, academics: -2, finances: -1 },
        nextFlavorPrompt: "The player chooses emotional honesty over external expectations."
      }
    ]
  },
  "independent-showcase": {
    id: "independent-showcase",
    title: "Showcase Night",
    setting: "A small showcase of student work turns into a test of whether you will let other people see what you are becoming.",
    background: "/backgrounds/student-union.svg",
    character: "Yourself",
    locationId: "library",
    locationLabel: "Library",
    summary:
      "You can step forward, support someone else from the edges, or keep your work private and promise yourself it is only temporary.",
    promptSeed: "A sophomore is forced to decide whether growth means becoming visible.",
    choices: [
      {
        id: "step-forward-showcase",
        label: "Step forward",
        description: "Let your work be witnessed, even if it trembles a little.",
        statEffects: { academics: 8, social: 4, mental: -1 },
        nextFlavorPrompt: "The player chooses visibility and discovers a steadier confidence."
      },
      {
        id: "support-from-edges",
        label: "Support someone else",
        description: "Show up meaningfully without standing in the center yourself.",
        statEffects: { social: 5, mental: 2, academics: 2 },
        nextFlavorPrompt: "The player finds value in presence without spotlight."
      },
      {
        id: "keep-private",
        label: "Keep it private",
        description: "Not every becoming has to happen in public yet.",
        statEffects: { mental: 3, academics: 1, social: -2 },
        nextFlavorPrompt: "The player protects something unfinished instead of exposing it too early."
      }
    ]
  },
  "alden-rec-letter": {
    id: "alden-rec-letter",
    title: "Recommendation Draft",
    setting: "Professor Alden asks you to stop by with your resume and a list of programs because he wants to write you a recommendation that actually sounds like you.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "He is less a gatekeeper now than a mentor with a sharp eye for what you are capable of becoming. You can accept the help fully, ask for honesty about your chances, or admit you are not sure the future you built still fits.",
    promptSeed: "A junior student meets with a trusted mentor about recommendation letters and future direction.",
    choices: [
      {
        id: "accept-mentor-help",
        label: "Accept the help",
        description: "Let someone who knows your work speak for you in a bigger room.",
        statEffects: { academics: 8, mental: 1 },
        relationshipEffects: { professorAlden: 6 },
        nextFlavorPrompt: "The player allows mentorship to become a real support structure instead of only pressure."
      },
      {
        id: "ask-for-honesty-career",
        label: "Ask for honesty",
        description: "You want the truth more than comfort about how competitive this path is.",
        statEffects: { academics: 5, mental: -1, finances: 2 },
        relationshipEffects: { professorAlden: 4 },
        nextFlavorPrompt: "The player asks for a realistic future instead of a flattering one."
      },
      {
        id: "admit-future-doubt",
        label: "Admit your doubt",
        description: "Tell him you are not sure whether the version of success everyone sees is one you can actually live inside.",
        statEffects: { mental: 4, academics: 2 },
        relationshipEffects: { professorAlden: 5 },
        nextFlavorPrompt: "The player chooses honesty about future anxiety in front of a trusted mentor."
      }
    ]
  },
  "alden-professionalization": {
    id: "alden-professionalization",
    title: "Professionalization",
    setting: "Professor Alden reviews your application materials with the kind of precision that makes your future feel both possible and exhausting.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "Junior year has taught you how to perform competence, but not always how to survive it. You can lean into the polish, push back on the performance, or ask how to stay ambitious without turning hollow.",
    promptSeed: "A junior student and mentor talk about professional polish, ambition, and the emotional cost of performance.",
    choices: [
      {
        id: "lean-into-polish",
        label: "Lean into it",
        description: "If the future wants a sharper version of you, you can become one.",
        statEffects: { academics: 7, finances: 3, mental: -3 },
        relationshipEffects: { professorAlden: 4 },
        nextFlavorPrompt: "The player accepts professionalization even though it costs softness."
      },
      {
        id: "push-back-performance",
        label: "Push back",
        description: "Tell him you are tired of feeling like a project under revision.",
        statEffects: { mental: -1, social: 2, academics: -2 },
        relationshipEffects: { professorAlden: -3 },
        nextFlavorPrompt: "The player resists turning their whole self into a polished application."
      },
      {
        id: "ask-for-balance",
        label: "Ask for balance",
        description: "You want to stay ambitious without losing the part of you that still feels human.",
        statEffects: { mental: 4, academics: 3 },
        relationshipEffects: { professorAlden: 5 },
        nextFlavorPrompt: "The player asks a mentor how to stay whole while chasing a future."
      }
    ]
  },
  "derek-calendar-night": {
    id: "derek-calendar-night",
    title: "Calendar Night",
    setting: "Derek sits cross-legged on your floor with both of your schedules open, trying to figure out when being together counts as quality time instead of accidental overlap.",
    background: "/backgrounds/phone-glow.svg",
    character: "Derek",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "The relationship is real now, which means logistics can hurt feelings if neither of you is careful. You can prioritize the relationship, ask for flexibility, or keep insisting you can do everything without giving anything up.",
    promptSeed: "A junior college couple tries to stay close while both schedules become genuinely difficult.",
    choices: [
      {
        id: "prioritize-us",
        label: "Prioritize us",
        description: "Make real time for the relationship before busyness decides everything for you.",
        statEffects: { social: 8, mental: 3, academics: -1 },
        relationshipEffects: { derek: 10 },
        nextFlavorPrompt: "The player chooses their real relationship as something worth scheduling and protecting."
      },
      {
        id: "ask-for-flexibility",
        label: "Ask for flexibility",
        description: "Be honest that you need support, not a perfect version of commitment.",
        statEffects: { mental: 4, social: 4 },
        relationshipEffects: { derek: 7 },
        nextFlavorPrompt: "The player builds a healthier relationship by asking for support instead of pretending they can do everything."
      },
      {
        id: "insist-you-can-do-it-all",
        label: "Insist you can do it all",
        description: "Tell yourself love should fit around ambition without demanding anything extra.",
        statEffects: { academics: 3, mental: -4, social: -3 },
        relationshipEffects: { derek: -8 },
        nextFlavorPrompt: "The player tries to keep total control and the relationship feels the strain immediately."
      }
    ]
  },
  "derek-burnout-checkin": {
    id: "derek-burnout-checkin",
    title: "Burnout Check-In",
    setting: "Derek watches you answer an email with your jaw clenched and quietly asks when you last had a day that did not feel like triage.",
    background: "/backgrounds/phone-glow.svg",
    character: "Derek",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "He is emotionally open in a way that makes avoidance harder. You can tell the truth, minimize everything, or ask him to help you step out of your own momentum for one night.",
    promptSeed: "A caring junior-year boyfriend notices burnout before the player is ready to admit it.",
    choices: [
      {
        id: "tell-the-truth-burnout",
        label: "Tell the truth",
        description: "Say out loud that ambition has started to feel like an emergency.",
        statEffects: { mental: 5, social: 4 },
        relationshipEffects: { derek: 8 },
        nextFlavorPrompt: "The player allows emotional honesty inside a real relationship under pressure."
      },
      {
        id: "minimize-it",
        label: "Minimize it",
        description: "Call it a busy week even though both of you know that is not the whole story.",
        statEffects: { academics: 2, mental: -4 },
        relationshipEffects: { derek: -5 },
        nextFlavorPrompt: "The player hides their burnout and the relationship loses some trust."
      },
      {
        id: "ask-for-help-rest",
        label: "Ask for help resting",
        description: "Let him help you remember that a person is not only a machine for outcomes.",
        statEffects: { mental: 7, social: 3, academics: -1 },
        relationshipEffects: { derek: 10 },
        nextFlavorPrompt: "The player lets love become restorative instead of one more obligation."
      }
    ]
  },
  "mina-anchor-night": {
    id: "mina-anchor-night",
    title: "Anchor Night",
    setting: "Mina shows up with takeout, tosses you a fork, and starts recapping campus gossip until your breathing finally leaves emergency mode.",
    background: "/backgrounds/student-union.svg",
    character: "Mina",
    locationId: "north-dorm",
    locationLabel: "North Dorm",
    summary:
      "She knows how to read you now without making you explain everything. You can let her hold the weight with you, admit how scared you are of falling behind, or keep pretending you are the one who always has it handled.",
    promptSeed: "A junior-year best friend recognizes burnout and grounds the player with familiarity and care.",
    choices: [
      {
        id: "let-her-help",
        label: "Let her help",
        description: "Stop acting like support only counts if you never needed it.",
        statEffects: { mental: 6, social: 5 },
        relationshipEffects: { mina: 8 },
        nextFlavorPrompt: "The player leans on a trusted best friend and feels steadier because of it."
      },
      {
        id: "admit-fear-falling-behind",
        label: "Admit the fear",
        description: "Tell Mina you are terrified everyone else can sustain this pace better than you can.",
        statEffects: { mental: 5, social: 4, academics: 1 },
        relationshipEffects: { mina: 9 },
        nextFlavorPrompt: "The player trusts their best friend with real junior-year fear."
      },
      {
        id: "keep-performing",
        label: "Keep performing competence",
        description: "Brush it off and keep the conversation easy, even though your body is saying otherwise.",
        statEffects: { social: 2, mental: -4 },
        relationshipEffects: { mina: -4 },
        nextFlavorPrompt: "The player refuses support and even a strong friendship feels the distance."
      }
    ]
  },
  "mina-poster-room": {
    id: "mina-poster-room",
    title: "Poster Room",
    setting: "You and Mina end up alone in a club room after an event, taking down posters and talking more honestly than the night originally allowed.",
    background: "/backgrounds/student-union.svg",
    character: "Mina",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "She feels like the person who remembers who you were before your resume started talking louder than you did. You can ask her to keep calling you back to yourself, promise to show up for her too, or insist you are fine even when neither of you believes it.",
    promptSeed: "A junior-year best friend becomes the emotional anchor who remembers the player's fuller self.",
    choices: [
      {
        id: "ask-her-anchor-you",
        label: "Ask her to anchor you",
        description: "Tell Mina you need someone who notices when you disappear into ambition.",
        statEffects: { mental: 6, social: 5 },
        relationshipEffects: { mina: 10 },
        nextFlavorPrompt: "The player explicitly chooses their best friend as a grounding force."
      },
      {
        id: "promise-mutual-care",
        label: "Promise mutual care",
        description: "Make the friendship feel active, not one-sided.",
        statEffects: { social: 6, mental: 3 },
        relationshipEffects: { mina: 7 },
        nextFlavorPrompt: "The player strengthens a best friendship through mutual commitment."
      },
      {
        id: "insist-youre-fine",
        label: "Insist you are fine",
        description: "Protect the image, even if it costs honesty.",
        statEffects: { mental: -3, social: -2 },
        relationshipEffects: { mina: -5 },
        nextFlavorPrompt: "The player chooses performance over trust inside an important friendship."
      }
    ]
  },
  "internship-fair": {
    id: "internship-fair",
    title: "Internship Fair",
    setting: "The conference center is full of polished shoes, elevator pitches, and tables that make the future feel like a contest you were supposed to prepare for years ago.",
    background: "/backgrounds/student-center.svg",
    character: "Yourself",
    locationId: "student-center",
    locationLabel: "Student Center",
    summary:
      "You can work the room hard, target a few real opportunities, or leave early when the performance of confidence starts to feel physically expensive.",
    promptSeed: "A junior-year internship fair turns career pressure into something immediate and embodied.",
    choices: [
      {
        id: "work-room-hard",
        label: "Work the room hard",
        description: "Become impressive on purpose and do not let the nerves show.",
        statEffects: { academics: 5, finances: 5, social: 4, mental: -4 },
        nextFlavorPrompt: "The player chooses visible ambition and pays for it in energy."
      },
      {
        id: "target-real-opps",
        label: "Target real opportunities",
        description: "Pick the tables that actually fit your future instead of trying to win the whole room.",
        statEffects: { academics: 4, finances: 4, mental: 1 },
        nextFlavorPrompt: "The player chooses grounded strategy over performative hustle."
      },
      {
        id: "leave-early-fair",
        label: "Leave early",
        description: "Protect your nervous system before panic becomes the loudest thing in the room.",
        statEffects: { mental: 4, academics: -1, finances: -1 },
        nextFlavorPrompt: "The player refuses to sacrifice themselves completely to career performance."
      }
    ]
  },
  "research-deadline": {
    id: "research-deadline",
    title: "Research Deadline",
    setting: "A major project, a looming deadline, and three unanswered emails make the week feel like one long held breath.",
    background: "/backgrounds/professor-office.svg",
    character: "Yourself",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "You can brute-force your way through, ask for collaboration, or admit the timeline is breaking something in you that grades cannot measure.",
    promptSeed: "A junior-year research or portfolio crunch scene about ambition, burnout, and asking for help.",
    choices: [
      {
        id: "bruteforce-deadline",
        label: "Brute-force it",
        description: "Get it done no matter what else has to bend.",
        statEffects: { academics: 9, mental: -6, social: -2 },
        nextFlavorPrompt: "The player chooses achievement at a clear emotional cost."
      },
      {
        id: "ask-collaboration",
        label: "Ask for collaboration",
        description: "Treat support as a strategy instead of a weakness.",
        statEffects: { academics: 5, social: 4, mental: 2 },
        nextFlavorPrompt: "The player protects both the work and themselves by asking for help."
      },
      {
        id: "admit-breakpoint",
        label: "Admit the breakpoint",
        description: "Acknowledge that ambition has crossed into self-erasure.",
        statEffects: { mental: 5, academics: -2 },
        nextFlavorPrompt: "The player chooses self-awareness over relentless forward motion."
      }
    ]
  },
  "offer-email": {
    id: "offer-email",
    title: "Offer Email",
    setting: "The subject line lands in your inbox at 11:43 p.m., and suddenly the future becomes a thing with a city name, a paycheck, and a version of you attached to it.",
    background: "/backgrounds/phone-glow.svg",
    character: "Yourself",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "You can accept the possibility with excitement, spiral about what it means, or share the moment with someone before you let anxiety rewrite it.",
    promptSeed: "A junior student receives a major internship or opportunity email and has to metabolize what it means.",
    choices: [
      {
        id: "accept-possibility",
        label: "Let yourself feel proud",
        description: "For one minute, do not turn success into another problem to solve.",
        statEffects: { academics: 6, finances: 5, mental: 2 },
        nextFlavorPrompt: "The player allows themselves uncomplicated pride in a future breakthrough."
      },
      {
        id: "spiral-about-offer",
        label: "Spiral",
        description: "Immediately start asking what this locks you into and what it says about the rest of your life.",
        statEffects: { mental: -5, academics: 2 },
        nextFlavorPrompt: "The player responds to success with anxiety about the future it creates."
      },
      {
        id: "share-before-spiral",
        label: "Tell someone first",
        description: "Let joy be witnessed before fear gets to edit it.",
        statEffects: { mental: 4, social: 4, finances: 3 },
        nextFlavorPrompt: "The player anchors a major success in relationship before panic can isolate them."
      }
    ]
  },
  "burnout-wall": {
    id: "burnout-wall",
    title: "Burnout Wall",
    setting: "The wall finally arrives on an ordinary afternoon: blank document, shaking hands, and the unbearable suspicion that you have been sprinting on borrowed emotion for months.",
    background: "/backgrounds/phone-glow.svg",
    character: "Yourself",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "You can force yourself through it, call someone and say you are not okay, or shut everything and sleep because your body has started making decisions your mind would not.",
    promptSeed: "A junior student hits the burnout wall and has to decide whether to keep performing or finally stop.",
    choices: [
      {
        id: "force-through-wall",
        label: "Force through",
        description: "Keep moving even if it turns you into something meaner and emptier.",
        statEffects: { academics: 4, mental: -8, social: -3 },
        nextFlavorPrompt: "The player chooses continued performance even after hitting a true emotional wall."
      },
      {
        id: "call-someone",
        label: "Call someone",
        description: "Let another person witness the part of success that does not look impressive.",
        statEffects: { mental: 7, social: 5 },
        relationshipEffects: { derek: 4, mina: 4 },
        nextFlavorPrompt: "The player interrupts burnout by reaching for human connection instead of isolation."
      },
      {
        id: "sleep-now",
        label: "Sleep now",
        description: "Trust your body more than your panic for one night.",
        statEffects: { mental: 6, academics: -2 },
        nextFlavorPrompt: "The player lets rest be the decision even when ambition hates it."
      }
    ]
  },
  "alden-farewell-advice": {
    id: "alden-farewell-advice",
    title: "Farewell Advice",
    setting: "Professor Alden asks you to stop by his office, not for a deadline this time but because he wants to know where you think your mind belongs after graduation.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "He is still exacting, but the conversation has shifted into something close to respect. You can accept his belief in you, ask whether the future has to be so singular, or admit you are more afraid of leaving than you expected.",
    promptSeed: "A senior student has a final meaningful mentor conversation about what kind of future they should choose.",
    choices: [
      {
        id: "accept-his-belief",
        label: "Accept his belief",
        description: "Let mentorship land as something earned and real.",
        statEffects: { academics: 7, mental: 2 },
        relationshipEffects: { professorAlden: 6 },
        nextFlavorPrompt: "The player accepts a mentor's deep belief in their future with grounded pride."
      },
      {
        id: "ask-for-broader-life",
        label: "Ask for a broader life",
        description: "Tell him you want a future that feels livable, not just impressive.",
        statEffects: { mental: 5, academics: 2, social: 1 },
        relationshipEffects: { professorAlden: 4 },
        nextFlavorPrompt: "The player pushes beyond prestige and asks for a life that still feels human."
      },
      {
        id: "admit-fear-of-leaving",
        label: "Admit you are afraid",
        description: "Say the thing ambition kept disguising: you do not know how to stop being this version of yourself.",
        statEffects: { mental: 6, academics: 1 },
        relationshipEffects: { professorAlden: 5 },
        nextFlavorPrompt: "The player lets a trusted mentor witness their fear of becoming someone new after graduation."
      }
    ]
  },
  "alden-last-draft": {
    id: "alden-last-draft",
    title: "Last Draft",
    setting: "Professor Alden returns one of your final papers with fewer notes than usual and the unnerving sense that you are now being read as a peer in the making.",
    background: "/backgrounds/professor-office.svg",
    character: "Professor Alden",
    locationId: "humanities",
    locationLabel: "Humanities Hall",
    summary:
      "Senior fall reframes criticism into inheritance. You can embrace the rigor, ask what matters beyond excellence, or admit you are tired of being legible only through work.",
    promptSeed: "A senior student's long mentor relationship culminates in a final demanding but respectful academic exchange.",
    choices: [
      {
        id: "embrace-rigor",
        label: "Embrace the rigor",
        description: "Take the final challenge and let it sharpen your closing semester.",
        statEffects: { academics: 8, mental: -2 },
        relationshipEffects: { professorAlden: 4 },
        nextFlavorPrompt: "The player accepts one last demanding push from a mentor they respect."
      },
      {
        id: "ask-beyond-excellence",
        label: "Ask what matters beyond excellence",
        description: "Refuse to let your life be graded only by polish and output.",
        statEffects: { mental: 4, academics: 2, social: 1 },
        relationshipEffects: { professorAlden: 5 },
        nextFlavorPrompt: "The player challenges a narrow definition of success while keeping the mentor relationship intact."
      },
      {
        id: "say-you-are-tired",
        label: "Say you are tired",
        description: "Not defiant, just honest: the cost has started to show.",
        statEffects: { mental: 5, academics: -2 },
        relationshipEffects: { professorAlden: 3 },
        nextFlavorPrompt: "The player speaks plainly about the fatigue behind their ambition."
      }
    ]
  },
  "derek-postgrad-talk": {
    id: "derek-postgrad-talk",
    title: "Post-Grad Talk",
    setting: "Derek takes your hand on a long walk after dinner and asks the question both of you have been circling for weeks: what does us look like after graduation?",
    background: "/backgrounds/snow-quad.svg",
    character: "Derek",
    locationId: "lake-path",
    locationLabel: "Lake Path",
    summary:
      "The relationship is real enough now that the future can either deepen it or expose its limits. You can imagine a shared future, ask for patience and flexibility, or protect the love by refusing to promise more than you can live.",
    promptSeed: "A real college relationship reaches the senior-year question of whether love can survive post-grad change.",
    choices: [
      {
        id: "imagine-shared-future",
        label: "Imagine a shared future",
        description: "Let love be concrete enough to plan around.",
        statEffects: { social: 8, mental: 4 },
        relationshipEffects: { derek: 10 },
        nextFlavorPrompt: "The player allows a real relationship to become part of their future planning."
      },
      {
        id: "ask-for-patience",
        label: "Ask for patience",
        description: "Tell him you want this, but not in a way that crushes either of your futures.",
        statEffects: { mental: 5, social: 5 },
        relationshipEffects: { derek: 7 },
        nextFlavorPrompt: "The player chooses love with honesty about uncertainty and timing."
      },
      {
        id: "refuse-to-promise",
        label: "Refuse to promise",
        description: "You love what is real now more than you trust predictions about later.",
        statEffects: { mental: 2, social: -2 },
        relationshipEffects: { derek: -6 },
        nextFlavorPrompt: "The player protects themselves from false certainty even though it hurts the relationship."
      }
    ]
  },
  "derek-graduation-quiet": {
    id: "derek-graduation-quiet",
    title: "Graduation Quiet",
    setting: "The night before graduation, Derek sits beside you in the half-packed room and lets the silence do some of the talking first.",
    background: "/backgrounds/phone-glow.svg",
    character: "Derek",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "This is what it feels like when love has survived enough pressure to become gentle. You can tell him exactly what he has meant to you, ask how to keep choosing each other in motion, or admit that endings make you afraid to trust even the good things.",
    promptSeed: "A senior couple shares a quiet, honest moment before graduation and the beginning of real adulthood.",
    choices: [
      {
        id: "tell-him-what-he-meant",
        label: "Tell him what he meant",
        description: "Say the grateful, terrifying truth of what it means to have been loved well here.",
        statEffects: { mental: 5, social: 7 },
        relationshipEffects: { derek: 10 },
        nextFlavorPrompt: "The player lets real love be named clearly at the threshold of graduation."
      },
      {
        id: "ask-how-to-keep-choosing",
        label: "Ask how to keep choosing each other",
        description: "Let the future become a practical conversation instead of only a feeling.",
        statEffects: { social: 6, finances: 1, mental: 3 },
        relationshipEffects: { derek: 7 },
        nextFlavorPrompt: "The player turns love into a shared practice for the life after college."
      },
      {
        id: "admit-ending-fear",
        label: "Admit you are afraid",
        description: "Tell him endings make you suspicious even of the things you want to keep.",
        statEffects: { mental: 4, social: 3 },
        relationshipEffects: { derek: 5 },
        nextFlavorPrompt: "The player brings fear honestly into a mature relationship instead of hiding behind composure."
      }
    ]
  },
  "mina-keepsake-night": {
    id: "mina-keepsake-night",
    title: "Keepsake Night",
    setting: "Mina spreads old flyers, photos, and ridiculous keepsakes across the floor like she is making evidence that your college life really happened.",
    background: "/backgrounds/student-union.svg",
    character: "Mina",
    locationId: "north-dorm",
    locationLabel: "North Dorm",
    summary:
      "Best friendship in senior year is less about proving closeness and more about remembering each other correctly. You can help her make meaning of it, admit how much the friendship held you together, or joke your way around the ache because endings feel too real tonight.",
    promptSeed: "Two college best friends reflect on the life they built together as graduation approaches.",
    choices: [
      {
        id: "make-meaning-together",
        label: "Make meaning together",
        description: "Treat memory like part of the friendship, not just a leftover from it.",
        statEffects: { mental: 5, social: 6 },
        relationshipEffects: { mina: 8 },
        nextFlavorPrompt: "The player deepens a best friendship by honoring its history with intention."
      },
      {
        id: "admit-she-held-you-together",
        label: "Admit what she meant",
        description: "Tell Mina she became one of the ways this place ever felt livable.",
        statEffects: { mental: 6, social: 5 },
        relationshipEffects: { mina: 10 },
        nextFlavorPrompt: "The player names their best friend as a real emotional anchor of college life."
      },
      {
        id: "joke-around-ache",
        label: "Joke around it",
        description: "Stay funny and bright because grief for endings still embarrasses you a little.",
        statEffects: { social: 3, mental: -1 },
        relationshipEffects: { mina: 1 },
        nextFlavorPrompt: "The player protects themselves from the ache of leaving by staying on the surface."
      }
    ]
  },
  "mina-last-bench": {
    id: "mina-last-bench",
    title: "Last Bench",
    setting: "You and Mina sit on the same campus bench you used to collapse onto after impossible weeks, except now the impossible week is almost over forever.",
    background: "/backgrounds/snow-quad.svg",
    character: "Mina",
    locationId: "lake-path",
    locationLabel: "Lake Path",
    summary:
      "She is the person who knows the most versions of you from this place. You can promise the friendship a future, thank her without making promises you cannot keep, or admit you do not know how to leave without grieving harder than you expected.",
    promptSeed: "A final senior-year best-friend scene about gratitude, continuity, and what survives after college.",
    choices: [
      {
        id: "promise-future-friendship",
        label: "Promise the future",
        description: "Treat the friendship as something you plan to keep building after graduation.",
        statEffects: { social: 7, mental: 4 },
        relationshipEffects: { mina: 9 },
        nextFlavorPrompt: "The player chooses to carry a college best friendship forward deliberately."
      },
      {
        id: "thank-her-honestly",
        label: "Thank her honestly",
        description: "Let gratitude be enough without forcing a certainty neither of you can guarantee.",
        statEffects: { mental: 5, social: 5 },
        relationshipEffects: { mina: 7 },
        nextFlavorPrompt: "The player honors a best friendship with mature gratitude and realistic love."
      },
      {
        id: "admit-grief-leaving",
        label: "Admit the grief",
        description: "Say out loud that leaving this life hurts more than you thought it would.",
        statEffects: { mental: 6, social: 4 },
        relationshipEffects: { mina: 8 },
        nextFlavorPrompt: "The player trusts their best friend with the grief of ending a shared chapter."
      }
    ]
  },
  "leadership-handoff": {
    id: "leadership-handoff",
    title: "Leadership Handoff",
    setting: "You spend an evening teaching younger students how to run something you used to be overwhelmed just to enter.",
    background: "/backgrounds/student-union.svg",
    character: "Yourself",
    locationId: "student-union",
    locationLabel: "Student Union",
    summary:
      "Senior fall turns you into the older student in the room. You can mentor generously, cling a little too tightly to being needed, or step back and let the next version of campus happen without you.",
    promptSeed: "A senior student faces the emotional complexity of leadership, legacy, and letting go.",
    choices: [
      {
        id: "mentor-generously",
        label: "Mentor generously",
        description: "Give away what you learned like it was always meant to leave your hands.",
        statEffects: { social: 6, academics: 3, mental: 2 },
        nextFlavorPrompt: "The player handles leadership as stewardship instead of self-protection."
      },
      {
        id: "cling-to-being-needed",
        label: "Cling to being needed",
        description: "You are not ready to stop being central here yet.",
        statEffects: { social: 2, mental: -3, academics: 2 },
        nextFlavorPrompt: "The player struggles to separate meaning from indispensability."
      },
      {
        id: "step-back-gracefully",
        label: "Step back gracefully",
        description: "Make room for the next people without turning it into a personal loss.",
        statEffects: { mental: 4, social: 4 },
        nextFlavorPrompt: "The player practices leaving well instead of resisting it."
      }
    ]
  },
  "capstone-choice": {
    id: "capstone-choice",
    title: "Capstone Choice",
    setting: "A capstone, a job lead, and a half-formed alternate plan all sit on your desk at once, each one insisting it is the most adult version of your future.",
    background: "/backgrounds/phone-glow.svg",
    character: "Yourself",
    locationId: "residence-room",
    locationLabel: "Dorm Room",
    summary:
      "Senior year wants commitment. You can choose the clearest career path, choose the work that feels most alive, or choose room to breathe even if nobody would call that impressive.",
    promptSeed: "A senior student chooses between prestige, passion, and sustainability as graduation approaches.",
    choices: [
      {
        id: "choose-clear-career",
        label: "Choose the clearest career path",
        description: "Stability and momentum matter, and you are tired of pretending they do not.",
        statEffects: { finances: 7, academics: 5, mental: -2 },
        nextFlavorPrompt: "The player chooses a concrete and ambitious future path."
      },
      {
        id: "choose-alive-work",
        label: "Choose the work that feels alive",
        description: "You want a future that still feels like yours from the inside.",
        statEffects: { academics: 4, mental: 4, social: 1 },
        nextFlavorPrompt: "The player chooses meaning and aliveness over the safest prestige route."
      },
      {
        id: "choose-room-to-breathe",
        label: "Choose room to breathe",
        description: "You are done treating exhaustion like proof of seriousness.",
        statEffects: { mental: 7, finances: -2 },
        nextFlavorPrompt: "The player chooses sustainability over the most externally impressive future."
      }
    ]
  },
  "graduation-morning": {
    id: "graduation-morning",
    title: "Graduation Morning",
    setting: "The morning of graduation feels less triumphant than strangely intimate: borrowed gowns, safety pins, texts from people who knew you before any of this, and the knowledge that today is both ending and beginning.",
    background: "/backgrounds/campus-arrival.svg",
    character: "Yourself",
    locationId: "campus-gate",
    locationLabel: "Campus Gate",
    summary:
      "You can stand in the accomplishment, let yourself feel the loss too, or focus on the people beside you instead of the ceremony itself.",
    promptSeed: "A senior student on graduation morning decides how to emotionally meet the ending of college.",
    choices: [
      {
        id: "stand-in-accomplishment",
        label: "Stand in the accomplishment",
        description: "Let yourself feel finished in a way that is proud, not only relieved.",
        statEffects: { academics: 5, mental: 3 },
        nextFlavorPrompt: "The player meets graduation with earned pride."
      },
      {
        id: "feel-the-loss-too",
        label: "Feel the loss too",
        description: "Achievement does not cancel grief for the life that is ending.",
        statEffects: { mental: 6, social: 2 },
        nextFlavorPrompt: "The player allows graduation to be both beautiful and sad."
      },
      {
        id: "focus-on-people",
        label: "Focus on the people",
        description: "Measure this ending by who walks beside you, not only by what you did.",
        statEffects: { social: 6, mental: 4 },
        relationshipEffects: { derek: 2, mina: 2, homeFriends: 2 },
        nextFlavorPrompt: "The player understands graduation through relationships instead of performance."
      }
    ]
  }
};
