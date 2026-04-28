import { AuthSetupNeeded } from "@/components/auth-setup-needed";
import { GameShell } from "@/components/game-shell";

export default function HomePage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <AuthSetupNeeded />;
  }

  return <GameShell />;
}
