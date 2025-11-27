import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, Card, ActivityIndicator } from "react-native-paper";
import { layout } from "../styles/layout";
import { useAuthStore } from "../store/AuthStore";
import { getCurrentSeason, Season } from "../services/seasonService";
import {
  getCurrentStandings,
  StandingsRow,
} from "../services/standingsService";
import { getNextGp, NextGp } from "../services/gpService";
import {
  getCurrentChampion,
  getCurrentChallengerList,
  Challenger,
  ChallengerList,
  CurrentChampion,
} from "../services/kuppiksenKunkkuService";
import { formatDateFi } from "../utils/date";

type SeasonSummary = {
  sija: number;
  pisteet: number;
  kaSarja: number;
};

const HomeScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const [seasonSummary, setSeasonSummary] = useState<SeasonSummary | null>(
    null
  );
  const [nextGp, setNextGp] = useState<NextGp | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [challengerList, setChallengerList] = useState<ChallengerList | null>(
    null
  );
  const [currentChampion, setCurrentChampion] =
    useState<CurrentChampion | null>(null);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const season = await getCurrentSeason();
        // Haetaan samanaikaisesti sarjataulukko ja seuraava GP
        const [standings, nextGp, currentChampion, ChallengerList] =
          await Promise.all([
            getCurrentStandings(),
            getNextGp(),
            getCurrentChampion(String(season.nimi)),
            getCurrentChallengerList(),
          ]);

        // Etsi käyttäjän sijoitus sarjataulukosta
        const userStanding = standings.find(
          (row: StandingsRow) => row.keilaajaId === user.keilaajaId
        );

        // Päivitä käyttäjän kausiyhteenveto
        if (userStanding) {
          setSeasonSummary({
            sija: userStanding.sija,
            pisteet: userStanding.pisteet,
            kaSarja: userStanding.kaSarja,
          });
        } else {
          setSeasonSummary(null);
        }
        setNextGp(nextGp);
        setChallengerList(ChallengerList);
        setCurrentChampion(currentChampion);
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
          <Card.Title title="Kausitilanteesi" titleVariant="titleLarge" />
          <Card.Content>
            <Text style={{ fontWeight: "bold" }}>
              {" "}
              Sijoitus: {seasonSummary.sija}
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              {" "}
              Pisteet: {seasonSummary.pisteet}
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              {" "}
              Sarjakeskiarvo: {seasonSummary.kaSarja.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>
      );
    }
  };

  // Seuraava GP -kortti renderöidään
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
        <Card.Title title="Seuraava GP" titleVariant="titleLarge" />
        <Card.Content>
          <Text style={{ fontWeight: "bold" }}>
            GP: {nextGp.jarjestysnumero}
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            Päivämäärä: {formatDateFi(nextGp.pvm)}
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            Paikka: {nextGp.keilahalliNimi}
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            Kultainen GP: {nextGp.onKultainenGp ? "✅" : "❌"}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderKuppiksenKunkkuCard = () => {
    if (!challengerList || !currentChampion) {
      return (
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Kuppiksen Kunkku" />
          <Card.Content>
            <Text>Kuppiksen kunkku -tietoja ei saatavilla.</Text>
          </Card.Content>
        </Card>
      );
    }

      return (
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Kuppiksen Kunkku" titleVariant="titleLarge" />
          <Card.Content>
            <Text style={{ fontWeight: "bold" }}>
              Hallitseva: {currentChampion.puolustajaNimi}
            </Text>
            <Text style={{ fontWeight: "bold", marginTop: 8 }}>
              Haastajat:
            </Text>

            {challengerList.haastajat.length === 0 && (
              <Text>Ensimmäinen Gp ei sisällä haastajia.</Text>
            )}

            {challengerList.haastajat.map((haastaja: Challenger, index) => (
              <View key={haastaja.keilaajaId} style={{flexDirection: "row", justifyContent: "space-between",alignItems: "center", marginVertical: 2}}>

                <Text style={{ flex: 1 }}>
                  {index + 1}. {haastaja.nimi}
                </Text>

                <Text style={{ textAlign: "right" }}>
                  {haastaja.sarja1}
                  <Text> ({haastaja.sarja2})</Text>
                </Text>
              </View>
            ))}

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
          {renderKuppiksenKunkkuCard()}
        </>
      )}
    </ScrollView>
  );
};

export default HomeScreen;
