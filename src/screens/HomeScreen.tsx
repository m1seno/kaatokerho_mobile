import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import { layout } from "../styles/layout";
import { appColors } from "../styles";
import { useAuthStore } from "../store/AuthStore";
import { api } from "../services/api";

type StandingsRow = {
  sija: number;
  keilaajaId: number;
  nimi: string;
  gpMaara: number;
  pisteet: number;
  pisteetPerGp: number;
  gpVoitot: number;
  gpTulokset: (number | null)[];
  yhteensa: number;
  kaGp: number;
  kaSarja: number;
};

type SeasonSummary = {
  sija: number;
  pisteet: number;
  kaSarja: number;
};

type NextGp = {
  jarjestysnumero: number;
  pvm: string;
  onKultainenGp: boolean;
  keilahalliNimi: string;
};

const HomeScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const [seasonSummary, setSeasonSummary] = useState<SeasonSummary | null>(
    null
  );
  const [nextGp, setNextGp] = useState<NextGp | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // Haetaan sarjataulukko
        const seasonRes = await api.get<StandingsRow[]>(
          `/api/sarjataulukko/current`
        );
        // Poimitaan omat tiedot
        const oma = seasonRes.data.find(
          (row) => row.keilaajaId === user.keilaajaId
        );
        if (!oma) {
          throw new Error("Käyttäjää ei löydy sarjataulukosta");
        }
        // Muodosta SeasonSummary
        const seasonSummary: SeasonSummary = {
          sija: oma.sija,
          pisteet: oma.pisteet,
          kaSarja: oma.kaSarja,
        };
        setSeasonSummary(seasonSummary);

        // Haetaan seuraava GP
        const gpRes = await api.get<NextGp>("/api/gp/next");
        const next = gpRes.data;
        if (!next) {
          throw new Error("Seuraavaa GP:tä ei löydy");
        }
        // Muodosta NextGp
        const nextGp: NextGp = {
          jarjestysnumero: next.jarjestysnumero,
          pvm: next.pvm,
          onKultainenGp: next.onKultainenGp,
          keilahalliNimi: next.keilahalliNimi,
        };
        setNextGp(nextGp);
      } catch (e) {
        console.log("HomeScreen fetchData error:", e);
        setError("Tietojen hakeminen epäonnistui.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Kausikortti-komponentti renderöidään
  const renderSeasonCard = () => {
    if (!seasonSummary) {
      return (
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Kausitilanteesi" />
          <Card.Content>
            <Text>
              Kausitilannettasi ei voitu hakea. Tarkista yhteys tai yritä
              myöhemmin uudelleen.
            </Text>
          </Card.Content>
        </Card>
      );
    } else {
      return (
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Kausitilanteesi" />
          <Card.Content>
            <Text> Sijoitus: {seasonSummary.sija}</Text>
            <Text> Pisteet: {seasonSummary.pisteet}</Text>
            <Text> Sarjakeskiarvo: {seasonSummary.kaSarja.toFixed(2)}</Text>
          </Card.Content>
        </Card>
      );
    }
  };

  const renderNextGpCard = () => {
    if (!nextGp) {
      return (
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Seuraava GP" />
          <Card.Content>
            <Text>Ei tulevia GP-kilpailuja kalenterissa.</Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Seuraava GP" />
        <Card.Content>
          <Text>GP: {nextGp.jarjestysnumero}</Text>
          <Text>Päivämäärä: {nextGp.pvm}</Text>
          <Text>Paikka: {nextGp.keilahalliNimi}</Text>
          <Text>Kultainen GP: {nextGp.onKultainenGp ? "Kyllä" : "Ei"}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView
      style={layout.container}
      contentContainerStyle={{ padding: 24 }}
    >
      {/* Tervehdys */}
      <View style={{ marginBottom: 16 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
          Tervetuloa, {user?.etunimi} {user?.sukunimi}
        </Text>
      </View>

      {/* Lataus / virhe */}
      {loading && (
        <View style={[layout.center, { marginVertical: 32 }]}>
          <ActivityIndicator animating size="large" />
        </View>
      )}

      {!loading && error && (
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Virhe" />
          <Card.Content>
            <Text style={{ color: "red" }}>{error}</Text>
          </Card.Content>
        </Card>
      )}

      {!loading && !error && (
        <>
          {renderSeasonCard()}
          {renderNextGpCard()}
        </>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
