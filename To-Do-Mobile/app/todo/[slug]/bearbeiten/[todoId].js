import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getTodo, updateTodo, deleteTodo } from "../../../../services/api";

export default function BearbeitenTodoScreen() {
  const router = useRouter();
  const {slug,todoId} = useLocalSearchParams();

  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [kategorie, setKategorie] = useState("Sonstiges");

  async function loadTodo() {
    try {
      const data = await getTodo(slug, todoId);

      setTitel(data.titel || "");
      setBeschreibung(data.beschreibung || "");
      setKategorie(data.kategorie || "Sonstiges");
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert("Fehler", "ToDo konnte nicht geladen werden.");
    } 
  }

  useEffect(() => {
    if (!slug || !todoId) return;
    loadTodo();
  }, [slug, todoId]);

  async function handleSpeichern() {
    if (!titel.trim()) return;
    
    try {
      await updateTodo(slug, todoId, titel, beschreibung, kategorie);
      router.push(`/todo/${slug}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Es ist ein Fehler beim Speichern der ToDos aufgetreten.";
      Alert.alert("Fehler", msg);
      console.log(err.response?.data || err.message);
    }
  }

  async function handleLoeschen() {
    try {
      await deleteTodo(slug, todoId);
      router.push(`/todo/${slug}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Es ist ein Fehler beim Löschen der ToDos aufgetreten.";
      Alert.alert("Fehler", msg);
      console.log(err.response?.data || err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push(`/todo/${slug}`)} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Zurück zur Liste</Text>
      </Pressable>

      <Text style={styles.title}>Bearbeiten</Text>

      <Text style={styles.subHeading}>Titel</Text>
      <TextInput value={titel} onChangeText={setTitel} style={styles.inputTodo} />

      <Text style={styles.subHeading}>Beschreibung</Text>
      <TextInput
        value={beschreibung}
        onChangeText={setBeschreibung}
        style={styles.inputTodo}
      />

      <View style={styles.kategorieRow}>
        <Text style={styles.subHeading}>Kategorie</Text>

        <View style={styles.kategorieWrap}>
          {[
            "Lebensmittel",
            "Hausaufgaben",
            "Haushalt",
            "Sport",
            "Arbeit",
            "Einkaufen",
            "Gesundheit",
            "Finanzen",
            "Termine",
            "Freizeit",
            "Reisen",
            "Sonstiges",
          ].map((opt) => (
            <Pressable
              key={opt}
              onPress={() => setKategorie(opt)}
              style={[
                styles.kategorieOption,
                kategorie === opt && styles.kategorieOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.kategorieOptionText,
                  kategorie === opt && styles.kategorieOptionTextActive,
                ]}
              >
                {opt}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable onPress={handleSpeichern} style={styles.buttonSpeichern}>
        <Text style={styles.buttonText}>Speichern</Text>
      </Pressable>

      <Pressable onPress={handleLoeschen} style={styles.buttonLoeschen}>
        <Text style={styles.buttonText}>Löschen</Text>
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
    borderRadius: 8,
  },

  title: {
    textAlign: "center",
    fontSize: 45,
    fontWeight: "500",
    marginBottom: 10,
  },

  loadingText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 18,
  },

  subHeading: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 10,
  },

  inputTodo: {
    paddingVertical: 25,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
    marginTop: 10,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backButtonText: {
    color: "#007bff",
    fontSize: 16,
    textAlign: "left",
  },

  kategorieRow: {
    flexDirection: "column",
    gap: 6,
    marginTop: 10,
  },
  kategorieWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  kategorieOption: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  kategorieOptionActive: {
    borderColor: "rgb(59,130,246)",
  },
  kategorieOptionText: {
    fontSize: 14,
    color: "black",
  },
  kategorieOptionTextActive: {
    color: "rgb(59,130,246)",
    fontWeight: "600",
  },

  buttonSpeichern: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: "rgb(59,130,246)",
    alignItems: "center",
  },

  buttonLoeschen: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "#ff4d4d",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },
});

