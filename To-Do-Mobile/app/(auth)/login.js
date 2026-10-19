import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../services/api";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  async function handleLogin() {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Fehler", "Bitte füllen Sie alle Felder aus!");
      return;
    }

    try {
      const data = await login(email, password);

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      Alert.alert("Erfolg", "Sie wurden erfolgreich angemeldet!");

      router.push("/(app)/lists");
    } catch (err) {
      const message = err.response?.data?.message || "Login fehlgeschlagen.";
      Alert.alert("Fehler", message);
      console.log(err.response?.data || err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Anmelden</Text>

      <TextInput
        placeholder="E-Mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.checkboxRow}>
        <Switch value={stayLoggedIn} onValueChange={setStayLoggedIn} />
        <Text style={styles.checkboxText}>Eingeloggt bleiben</Text>
      </View>

      <Pressable onPress={handleLogin} style={styles.buttonPrimary}>
        <Text style={styles.buttonPrimaryText}>Anmelden</Text>
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

  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
  },

  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  checkboxText: {
    fontSize: 15,
  },

  buttonPrimary: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "rgb(59,130,246)",
    alignItems: "center",
  },
  buttonPrimaryText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },
});

