import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { getLists } from "../../../services/api";

export default function ListsScreen() {
  const router = useRouter();

  const [lists, setLists] = useState([]);
  const [query, setQuery] = useState("");

  async function loadLists() {
    try {
      const data = await getLists();
      setLists(data);
    } catch  {
      Alert.alert("Fehler beim Laden");
    }
  }

  useEffect(() => {
    loadLists();
  }, []);

  const norm = (s) => (s || "").toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return lists;
    return lists.filter((list) => norm(list.name).includes(q));
  }, [lists, query]);

  function handleNeueListe() {
    router.push("/(app)/lists/create");
  }

  function goToList(slug) {
    router.push(`/todo/${slug}`);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/login")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Zurück zur Anmeldung</Text>
      </Pressable>

      <Text style={styles.title}>Meine Liste</Text>

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
          <Pressable
            onPress={() => goToList(item.slug)}
            style={styles.listButton}
          >
            <Text style={styles.listButtonText}>{item.name}</Text>
          </Pressable>
        )}
      />

      {/* Button unten */}
      <View style={styles.bottomButtonContainer}>
        <Pressable onPress={handleNeueListe} style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Neue Liste</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    margin: 0,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "stretch",
  },

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

  listButton: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#777",
    marginTop: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  listButtonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
  },
  bottomButtonContainer: {
    marginTop: "auto",
    marginBottom: 35,
  },

  bottomButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "rgb(59,130,246)",
    alignItems: "center",
  },
  bottomButtonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },

  backButton: {
    alignSelf: "flex-start",
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
