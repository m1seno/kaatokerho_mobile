import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, DataTable, Text } from "react-native-paper";
import { layout } from "../styles/layout";
import { appColors } from "../styles";
import { api } from "../services/api";
import { formatDayMonthFi } from "../utils/date";

type Calendar = {
  gpId: number;
  jarjestysnumero: number;
  pvm: string; // ISO date string
  keilahalli: string;
  voittaja: string | null;
  voittotulos: number | null;
};

type Season = {
  kausiId: number;
  nimi: String;
  gpMaara: number;
  suunniteltuGpMaara: number;
  osallistujamaara: number;
};

const CalendarScreen: React.FC = () => {
  const [calendar, setCalendar] = useState<Calendar[]>([]);
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Calendar[]>("/api/kalenteri/current");
      setCalendar(res.data);

      const seasonRes = await api.get<Season>("/api/kausi/current");
      setSeason(seasonRes.data);
    } catch (err) {
      console.log("CalendarScreen fetch error:", err);
      setError("Kalenterin hakeminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  // Lasketaan voittotulosten keskiarvo vain niistä GP:istä, joille on määritelty voittotulos
  const averageWinnerScore = useMemo(() => {
    const scores = calendar
      .filter((event) => event.voittotulos !== null)
      .map((event) => event.voittotulos as number);
    if (scores.length === 0) return null;
    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / scores.length);
  }, [calendar]);

  const hasData = calendar.length > 0;

  return (
    <ScrollView
      style={layout.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 8 }}>
        GP-kalenteri {season ? ` ${season.nimi}` : ""}
      </Text>

      {/* Yhteenveto voittotuloksista */}
      {averageWinnerScore !== null && (
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          Voittotulosten keskiarvo: {averageWinnerScore}
        </Text>
      )}

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
          Kalenteritietoja ei ole saatavilla.
        </Text>
      )}

      {!loading && !error && hasData && (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>GP #</DataTable.Title>
            <DataTable.Title>Pvm</DataTable.Title>
            <DataTable.Title>Keilahalli</DataTable.Title>
            <DataTable.Title>Voittaja</DataTable.Title>
            <DataTable.Title numeric>Voittotulos</DataTable.Title>
          </DataTable.Header>

          {calendar.map((gp) => {
            const formattedDate = formatDayMonthFi(gp.pvm);
            const hasWinner = gp.voittotulos != null && gp.voittaja != null;
            return (
              <DataTable.Row key={gp.gpId}>
                <DataTable.Cell>{gp.jarjestysnumero}</DataTable.Cell>
                <DataTable.Cell>{formattedDate}</DataTable.Cell>
                <DataTable.Cell>{gp.keilahalli}</DataTable.Cell>
                <DataTable.Cell>
                  {hasWinner ? gp.voittaja : "-"}
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {hasWinner ? gp.voittotulos : "-"}
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      )}
    </ScrollView>
  );
};

export default CalendarScreen;
