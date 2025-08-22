import { Globe } from 'lucide-react-native';
import { CyberpunkSectionButton } from '@/rn-better-dev-tools/src/shared/ui/console/CyberpunkSectionButton';
import { useNetworkEvents } from '../hooks/useNetworkEvents';

interface NetworkSectionProps {
  onPress: () => void;
}

export function NetworkSection({ onPress }: NetworkSectionProps) {
  const { stats, isEnabled } = useNetworkEvents();

  const getNetworkSubtitle = () => {
    if (stats.totalRequests === 0) {
      return isEnabled ? "Recording" : "Paused";
    }
    
    // Shorter format: "Rec • 3 req" or "3R • 1F" for requests and failed
    const parts = [];
    if (isEnabled) parts.push("Rec");
    parts.push(`${stats.totalRequests}R`);
    if (stats.failedRequests > 0) parts.push(`${stats.failedRequests}F`);
    
    return parts.join(" • ");
  };

  return (
    <CyberpunkSectionButton
      id="network"
      title="NETWORK"
      subtitle={getNetworkSubtitle()}
      icon={Globe}
      iconColor="#E040FB"
      iconBackgroundColor="rgba(224, 64, 251, 0.1)"
      onPress={onPress}
      index={4}
    />
  );
}