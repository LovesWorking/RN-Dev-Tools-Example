import React from "react";
import { Mutation } from "@tanstack/react-query";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { displayValue } from "./displayValue";
import MutationDetailsChips from "./MutationDetailsChips";

interface Props {
  selectedMutation: Mutation<unknown, Error, unknown, unknown> | undefined;
}

export default function MutationDetails({ selectedMutation }: Props) {
  if (selectedMutation === undefined) {
    return null;
  }

  const submittedAt = new Date(
    selectedMutation.state.submittedAt
  ).toLocaleTimeString();

  return (
    <View style={styles.container}>
      <Text style={[styles.mutationDetailsText, styles.bgEAECF0, styles.p1]}>
        Mutation Details
      </Text>
      <View style={[styles.flexRow, styles.justifyBetween, styles.p1]}>
        <ScrollView horizontal style={styles.flex1}>
          <Text style={styles.flexWrap}>{`${
            selectedMutation.options.mutationKey
              ? displayValue(selectedMutation.options.mutationKey, true)
              : "No mutationKey found"
          }`}</Text>
        </ScrollView>
        <MutationDetailsChips status={selectedMutation.state.status} />
      </View>
      <View style={[styles.flexRow, styles.justifyBetween, styles.p1]}>
        <Text>Submitted At:</Text>
        <Text>{submittedAt}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
    fontSize: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  mutationDetailsText: {
    textAlign: "left",
    backgroundColor: "#EAECF0",
    padding: 8,
    fontWeight: "500",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  p1: {
    padding: 8,
  },
  flex1: {
    flex: 1,
  },
  flexWrap: {
    flexWrap: "wrap",
    alignItems: "center",
    marginRight: 8,
  },
  bgEAECF0: {
    backgroundColor: "#EAECF0",
  },
});
