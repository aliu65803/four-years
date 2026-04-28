import Anthropic from "@anthropic-ai/sdk";

type FlavorOptions = {
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

function buildFallbackFlavor(options: FlavorOptions) {
  const pressure =
    options.stats.mental < 40
      ? "Your exhaustion shows around the edges, even when you try to keep your expression steady."
      : "You still feel new here, but not quite as breakable as you did on move-in day.";

  const confidence =
    options.stats.academics > 60
      ? "You answer with more certainty than you expected from yourself."
      : "You choose your words carefully, like each one has to prove you belong.";

  return `${options.character} meets ${options.playerName} inside ${options.sceneTitle}. ${options.sceneSummary} ${pressure} ${confidence}`;
}

export async function generateFlavorDialogue(options: FlavorOptions) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackFlavor(options);
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const response = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
    max_tokens: 180,
    temperature: 0.9,
    system:
      "You are writing a short, emotionally grounded bit of flavor dialogue for a college coming-of-age game. Write 3-5 sentences in second person, keep continuity consistent, and avoid melodrama.",
    messages: [
      {
        role: "user",
        content: `Player: ${options.playerName}
Character: ${options.character}
Scene: ${options.sceneTitle}
Scene summary: ${options.sceneSummary}
Story seed: ${options.promptSeed}
Choice consequence: ${options.nextFlavorPrompt}
Stats: academics ${options.stats.academics}, social ${options.stats.social}, mental health ${options.stats.mental}, finances ${options.stats.finances}`
      }
    ]
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  return text || buildFallbackFlavor(options);
}
