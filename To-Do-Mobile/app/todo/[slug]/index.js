import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getListBySlug, deleteListBySlug } from "../../../services/api";

export default function TodoScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  const [query, setQuery] = useState("");
  const [list, setList] = useState(null);

  async function loadList() {
    try {
      const data = await getListBySlug(slug);
      setList(data);
    } catch (err) {
      console.log("Fehler beim Laden der Liste", err.response?.data || err.message);
  }
  }

  useEffect(() => {
    loadList();
  }, [slug]);

  const norm = (s) => (s || "").toString().toLowerCase().trim();
  const todos = list?.todos ?? [];

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return todos;
    return todos.filter((t) => norm(t.titel).includes(q));
  }, [todos, query]);

  function goToErstellungToDo() {
    router.push(`/todo/${slug}/create`);
  }

  function goToBearbeiten(todoId) {
    router.push(`/todo/${slug}/bearbeiten/${todoId}`);
  }

  async function handleLoeschenListe() {
    try {
      await deleteListBySlug(slug);
      Alert.alert("Erfolg", "Liste wurde gelöscht!");
      router.push("/(app)/lists");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Es ist ein Fehler beim Löschen der Liste aufgetreten.";
      Alert.alert("Fehler", msg);
    }
  }

  if (list === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Lädt...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Bar nur mit Zurück */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push("/(app)/lists")} style={styles.backButton}>
          <Text style={styles.linkText}>← Zurück zur Listenansicht</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{list.name}</Text>

      <TextInput
        placeholder="Suchen"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => goToBearbeiten(item._id)} style={styles.todoItem}>
            <View style={styles.checkboxFake} />
            <Text style={styles.todoText}>{item.titel}</Text>
          </Pressable>
        )}
      />

      <View style={styles.bottomArea}>
        <Pressable onPress={goToErstellungToDo} style={styles.newTodoButton}>
          <Text style={styles.newTodoButtonText}>+ Neues ToDo</Text>
        </Pressable>

        <Pressable onPress={handleLoeschenListe} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Liste löschen</Text>
        </Pressable>
      </View>
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

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },

  backButton: { alignSelf: "flex-start" },
  linkText: { color: "#007bff", fontSize: 16 },

  title: {
    textAlign: "center",
    fontSize: 45,
    fontWeight: "500",
    marginBottom: 10,
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

  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  todoText: {
    fontSize: 25,
  },
  checkboxFake: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#777",
    borderRadius: 4,
  },

  bottomArea: {
    marginTop: "auto",
    marginBottom: 20,
  },

  newTodoButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "rgb(59,130,246)",
    alignItems: "center",
  },
  newTodoButtonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },

  deleteButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },

  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },

  loadingText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 18,
  },
});


