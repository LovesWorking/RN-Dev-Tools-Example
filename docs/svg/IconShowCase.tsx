import { ScrollView, View, Text, StyleSheet } from "react-native";
import * as Icons from "../../rn-better-dev-tools/icons/lucide-icons";
export const IconShowcase = () => {
  const iconList = Object.keys(Icons).sort();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pure React Native Icons</Text>
      <View style={styles.grid}>
        {iconList.map((iconName) => {
          const IconComponent = (
            Icons as Record<string, React.ComponentType<any>>
          )[iconName];
          return (
            <View key={iconName} style={styles.iconContainer}>
              <IconComponent size={40} color="#000" strokeWidth={0.5} />
              <Text style={styles.iconLabel}>
                {iconName.replace("Icon", "")}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  iconLabel: {
    fontSize: 10,
    marginTop: 8,
    textAlign: "center",
    color: "#666",
  },
});

