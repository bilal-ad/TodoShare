import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getListBySlug,createTodo } from "../../../services/api";

export default function CreateTodoScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  const [titelInput, setTitelInput] = useState("");
  const [beschreibungInput, setBeschreibungInput] = useState("");
  const [kategorie, setKategorie] = useState("Sonstiges");

  const norm = (s) => (s || "").toString().toLowerCase().trim();

  async function addTodo() {
    if (!titelInput.trim()) return;

    try {

    const list = await getListBySlug(slug);
    const todos = list?.todos ?? [];

    const exists = todos.some((t) => norm(t.titel) === norm(titelInput));
    if (exists) {
      Alert.alert("Fehler", "Dieses ToDo existiert bereits in der Liste!");
      return;
    }


      await createTodo(slug, titelInput, beschreibungInput, kategorie);

      setTitelInput("");
      setBeschreibungInput("");
      setKategorie("Sonstiges");

      router.push(`/todo/${slug}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Es ist ein Fehler beim Erstellen der ToDos aufgetreten.";
      Alert.alert("Fehler", msg);
      console.log(err.response?.data || err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push(`/todo/${slug}`)} style={styles.backbutton}>
        <Text style={styles.backbuttonText}>← Zurück zur Liste</Text>
      </Pressable>

      <Text style={styles.title}>Neues ToDo:</Text>

      <Text style={styles.subHeading}>Titel</Text>
      <TextInput
        value={titelInput}
        onChangeText={setTitelInput}
        style={styles.inputTodo}
      />

      <Text style={styles.subHeading}>Beschreibung</Text>
      <TextInput
        value={beschreibungInput}
        onChangeText={setBeschreibungInput}
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

      <Pressable onPress={addTodo} style={styles.buttonerstellen}>
        <Text style={styles.buttonText}>Erstellen</Text>
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
    textAlign: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 45,
    fontWeight: "500",
    marginBottom: 10,
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

  backbutton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backbuttonText: {
    color: "#007bff",
    fontSize: 16,
    textAlign: "left",
  },

  buttonerstellen: {
    marginTop: "auto",
    marginBottom: 35,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgb(59,130,246)",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },

  kategorieRow: {
    flexDirection: "column",
    gap: 6,
    fontSize: 16,
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
});
