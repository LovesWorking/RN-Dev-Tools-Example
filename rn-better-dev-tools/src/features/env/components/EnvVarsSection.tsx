import { ScrollView } from "react-native";
import { Settings } from "lucide-react-native";
import { CyberpunkSectionButton } from "@/rn-better-dev-tools/src/shared/ui/console/CyberpunkSectionButton";
import { EnvVarsContent } from "./EnvVarsContent";
import { RequiredEnvVar } from "../types";
import { GameUIEnvContent } from "./GameUIEnvContent";

interface EnvVarsSectionProps {
  onPress: () => void;
  envVarsSubtitle: string;
  requiredEnvVars: RequiredEnvVar[];
}

/**
 * Environment variables section component following composition principles.
 * Encapsulates env vars specific business logic and UI.
 */
export function EnvVarsSection({
  onPress,
  envVarsSubtitle,
}: EnvVarsSectionProps) {
  return (
    <CyberpunkSectionButton
      id="env-vars"
      title="ENV"
      subtitle={envVarsSubtitle}
      icon={Settings}
      iconColor="#10B981"
      iconBackgroundColor="rgba(16, 185, 129, 0.1)"
      onPress={onPress}
      index={0}
    />
  );
}

/**
 * Content component for environment variables detail view.
 * Separates content rendering from section UI.
 */
export function EnvVarsDetailContent({
  requiredEnvVars,
}: {
  requiredEnvVars: RequiredEnvVar[];
}) {
  return (
    <ScrollView
      sentry-label="ignore devtools env vars section scroll"
      style={{ flex: 1, backgroundColor: "#2A2A2A" }}
    >
      <GameUIEnvContent requiredEnvVars={requiredEnvVars} />
    </ScrollView>
  );
}
