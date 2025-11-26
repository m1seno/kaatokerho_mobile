import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, DataTable, Text } from "react-native-paper";
import { layout } from "../styles/layout";
import { appColors } from "../styles";
import { Season, getCurrentSeason } from "../services/seasonService";
import {
  StandingsRow,
  getCurrentStandings,
} from "../services/standingsService";

const StandingsScreen: React.FC = () => {
  const [standings, setStandings] = useState<StandingsRow[]>([]);
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [standingsData, seasonData] = await Promise.all([
        getCurrentStandings(),
        getCurrentSeason(),
      ]);
      setStandings(standingsData);
      setSeason(seasonData);
    } catch (err) {
      console.log("StandingsScreen fetch error:", err);
      setError("Tietojen hakeminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const hasData = useMemo(() => standings.length > 0, [standings]);

  return (
    <ScrollView
      style={layout.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Sarjataulukko {season ? ` ${season.nimi}` : ""}
      </Text>

      {loading && (
        <View style={[layout.center, { marginVertical: 32 }]}>
          <ActivityIndicator animating size="large" color={appColors.primary} />
        </View>
      )}

      {!loading && error && (
        <Text style={{ color: "red", marginBottom: 16 }}>{error}</Text>
      )}

      {!loading && !error && !hasData && (
        <Text style={{ marginBottom: 16 }}>
          Sarjataulukko on tyhjä. Yritä myöhemmin uudelleen.
        </Text>
      )}

      {!loading && !error && hasData && (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Sija</DataTable.Title>
            <DataTable.Title>Nimi</DataTable.Title>
            <DataTable.Title numeric>GP:t</DataTable.Title>
            <DataTable.Title numeric>Pisteet</DataTable.Title>
            <DataTable.Title numeric>KA</DataTable.Title>
          </DataTable.Header>

          {standings.map((row) => (
            <DataTable.Row key={row.keilaajaId}>
              <DataTable.Cell>{row.sija}</DataTable.Cell>
              <DataTable.Cell>{row.nimi}</DataTable.Cell>
              <DataTable.Cell numeric>{row.gpMaara}</DataTable.Cell>
              <DataTable.Cell numeric>{row.pisteet}</DataTable.Cell>
              <DataTable.Cell numeric>{row.kaGp.toFixed(2)}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      )}
    </ScrollView>
  );
};

export default StandingsScreen;
