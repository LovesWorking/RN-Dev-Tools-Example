import { Mutation } from "@tanstack/react-query";
import { Text, View, StyleSheet } from "react-native";
import { CheckCircle, LoadingCircle, PauseCircle, XCircle } from "./svgs";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { ListItem, StatusBadge } from "@/rn-better-dev-tools/src/shared/ui/components";

const getMutationText = (mutation: Mutation) => {
  if (!mutation.options.mutationKey) return "Anonymous Mutation";
  const keys = Array.isArray(mutation.options.mutationKey)
    ? mutation.options.mutationKey
    : [mutation.options.mutationKey];
  return (
    keys
      .filter((k) => k != null)
      .map((k) => String(k))
      .join(" › ") || "Anonymous Mutation"
  );
};

interface Props {
  mutation: Mutation;
  setSelectedMutation: React.Dispatch<
    React.SetStateAction<Mutation | undefined>
  >;
  selected: Mutation | undefined;
}
export default function MutationButton({
  mutation,
  setSelectedMutation,
  selected,
}: Props) {
  const submittedAt = new Date(mutation.state.submittedAt).toLocaleTimeString();

  const getStatusInfo = () => {
    if (mutation.state.isPaused) {
      return {
        status: "Paused",
        color: gameUIColors.storage,
        icon: <PauseCircle />,
      };
    }
    switch (mutation.state.status) {
      case "success":
        return {
          status: "Success",
          color: gameUIColors.success,
          icon: <CheckCircle />,
        };
      case "error":
        return {
          status: "Error",
          color: gameUIColors.error,
          icon: <XCircle />,
        };
      case "pending":
        return {
          status: "Loading",
          color: gameUIColors.info,
          icon: <LoadingCircle />,
        };
      default:
        return { status: "Idle", color: gameUIColors.muted, icon: null };
    }
  };

  const statusInfo = getStatusInfo();

  const isSelected = selected?.mutationId === mutation.mutationId;

  return (
    <ListItem 
      onPress={() =>
        setSelectedMutation(mutation === selected ? undefined : mutation)
      }
      style={[
        isSelected && styles.selected,
      ]}
    >
      <ListItem.Header>
        <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
        <StatusBadge status={statusInfo.status} />
      </ListItem.Header>

      <ListItem.Content>
        <ListItem.Title>{getMutationText(mutation)}</ListItem.Title>
        <ListItem.Metadata>{submittedAt}</ListItem.Metadata>
      </ListItem.Content>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  selected: {
    backgroundColor: gameUIColors.info + "15",
    borderColor: gameUIColors.info + "50",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
