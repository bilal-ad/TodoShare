import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createList, getLists } from "../../../services/api";

export default function CreateListScreen() {
  const router = useRouter();
  const [listenName, setListenName] = useState("");

  const slugify = (text) => text.toString().toLowerCase().trim();

  async function handleCreateList() {
    if (!listenName.trim()) return;

    const slug = slugify(listenName);

    try {
      const existingLists = await getLists();
      if (existingLists.some((l) => l.slug === slug)) {
        Alert.alert("Fehler", "Diese Liste existiert bereits!");
        return;
      }

      await createList(listenName.trim(), slug);

      router.push("/(app)/lists");
    } catch (err) {
      console.log(err);
      Alert.alert("Fehler", "Es ist ein Fehler beim Erstellen der Liste aufgetreten.");
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/(app)/lists")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Zurück zur Listenansicht</Text>
      </Pressable>

      <Text style={styles.title}>Erstellung Liste</Text>

      <TextInput
        placeholder="Listenname"
        value={listenName}
        onChangeText={setListenName}
        style={styles.input}
      />

      <Pressable onPress={handleCreateList} style={styles.button}>
        <Text style={styles.buttonText}>Liste erstellen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 45,
    fontWeight: "500",
    marginBottom: 20,
  },

  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
  },

  button: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: "rgb(59,130,246)",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },

  backButton: {
    marginBottom: 10,
  },

  backButtonText: {
    color: "#007bff",
    fontSize: 16,
  },

  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

