import { Query, QueryKey, useQueryClient } from "@tanstack/react-query";
import React from "react";
import ActionButton from "./ActionButton";
import { getQueryStatusLabel } from "../_util/getQueryStatusLabel";
import triggerLoading from "../_util/actions/triggerLoading";
import refetch from "../_util/actions/refetch";
import reset from "../_util/actions/reset";
import remove from "../_util/actions/remove";
import invalidate from "../_util/actions/invalidate";
import triggerError from "../_util/actions/triggerError";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  setSelectedQuery: React.Dispatch<
    React.SetStateAction<Query<unknown, Error, unknown, QueryKey> | undefined>
  >;
  query: Query<unknown, Error, unknown, QueryKey> | undefined;
}
export default function QueryActions({ query, setSelectedQuery }: Props) {
  const queryClient = useQueryClient();
  if (query === undefined) {
    return null;
  }
  const queryStatus = query.state.status;
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Actions</Text>
      <ActionButton
        disabled={getQueryStatusLabel(query) === "fetching"}
        onClick={() => {
          refetch({
            query,
          });
        }}
        bgColorClass="btnRefetch"
        text="Refetch"
        textColorClass="btnRefetch"
      />
      <ActionButton
        disabled={queryStatus === "pending"}
        onClick={() => {
          invalidate({ query });
        }}
        bgColorClass="btnInvalidate"
        text="Invalidate"
        textColorClass="btnInvalidate"
      />
      <ActionButton
        disabled={queryStatus === "pending"}
        onClick={() => {
          reset({ queryClient, query });
        }}
        bgColorClass="btnReset"
        text="Reset"
        textColorClass="btnReset"
      />
      <ActionButton
        disabled={getQueryStatusLabel(query) === "fetching"}
        onClick={() => {
          remove({ queryClient, query });
          setSelectedQuery(undefined);
        }}
        bgColorClass="btnRemove"
        text="Remove"
        textColorClass="btnRemove"
      />
      <ActionButton
        disabled={false}
        onClick={() => {
          triggerLoading({ query });
        }}
        bgColorClass="btnTriggerLoading"
        text={
          query.state.data === undefined ? "Restore Loading" : "Trigger Loading"
        }
        textColorClass="btnTriggerLoading"
      />
      <ActionButton
        disabled={queryStatus === "pending"}
        onClick={() => {
          triggerError({ query, queryClient });
        }}
        bgColorClass="btnTriggerLoadiError"
        text={queryStatus === "error" ? "Restore" : "Trigger Error"}
        textColorClass="btnTriggerLoadiError"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    minWidth: 50,
    fontSize: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  headerText: {
    textAlign: "left",
    backgroundColor: "#EAECF0",
    padding: 4,
    width: "100%",
  },
});
