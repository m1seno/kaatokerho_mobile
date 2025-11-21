import React, { useState } from "react";
import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuthStore } from "../store/AuthStore";
import { layout } from "../styles/layout";

const LoginScreen: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const [kayttajanimi, setKayttajanimi] = useState("");
  const [salasana, setSalasana] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await login(kayttajanimi, salasana);
    } catch (e) {
      setError("Kirjautuminen epäonnistui. Tarkista käyttäjänimi ja salasana.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <View style={{
        alignItems: "center", justifyContent: "center"
       }}>
        <Image
          source={require("../../assets/KK-logo.png")}
          style={{ width: 150, height: 150, marginBottom: 20 }}
          resizeMode="contain"
        />
      </View>

      <Text
        variant="headlineMedium"
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        Kaatokerho
      </Text>

        <TextInput
            label="Käyttäjänimi"
            value={kayttajanimi}
            onChangeText={setKayttajanimi}
            style={{ marginBottom: 16 }}
            autoCapitalize="none"
        />
        <TextInput
            label="Salasana"
            value={salasana}
            onChangeText={setSalasana}
            secureTextEntry
            style={{ marginBottom: 16 }}
        />

        {error && (
          <Text style={{ color: "red", marginBottom: 16 }}>{error}</Text>)}

        <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
        >
            Kirjaudu
        </Button>
    </SafeAreaView>
  );
};

export default LoginScreen;
