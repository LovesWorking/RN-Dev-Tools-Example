import { Globe } from 'lucide-react-native';
import { CyberpunkConsoleSection } from '../../../_components/floating-bubble/console/CyberpunkConsoleSection';
import { useNetworkEvents } from '../hooks/useNetworkEvents';

interface NetworkSectionProps {
  onPress: () => void;
}

export function NetworkSection({ onPress }: NetworkSectionProps) {
  const { stats, isEnabled } = useNetworkEvents();

  const getNetworkSubtitle = () => {
    if (stats.totalRequests === 0) {
      return isEnabled ? "Recording • No requests yet" : "Not recording";
    }
    
    const parts = [];
    
    if (isEnabled) {
      parts.push("Recording");
    }
    
    parts.push(`${stats.totalRequests} requests`);
    
    if (stats.failedRequests > 0) {
      parts.push(`${stats.failedRequests} failed`);
    }
    
    if (stats.pendingRequests > 0) {
      parts.push(`${stats.pendingRequests} pending`);
    }
    
    return parts.join(" • ");
  };

  return (
    <CyberpunkConsoleSection
      id="network"
      title="Network Monitor"
      subtitle={getNetworkSubtitle()}
      icon={Globe}
      iconColor="#E040FB"
      iconBackgroundColor="rgba(224, 64, 251, 0.1)"
      onPress={onPress}
      index={4}
    />
  );
}