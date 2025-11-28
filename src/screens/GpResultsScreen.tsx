// src/screens/GpResultsScreen.tsx

import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, DataTable, Text } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

import { layout } from "../styles/layout";
import { appColors } from "../styles";
import { getResultsByGpId, Results } from "../services/resultsService";
import { computeGpResults, GpResultsRow } from "../utils/gpResults";

type RootStackParamList = {
  GpResults: { gpId: number; title: string };
};

type GpResultsRouteProp = RouteProp<RootStackParamList, "GpResults">;

const GpResultsScreen: React.FC = () => {
  const route = useRoute<GpResultsRouteProp>();
  const { gpId, title } = route.params;

  const [rows, setRows] = useState<GpResultsRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const rawResults: Results[] = await getResultsByGpId(gpId);
      const computed = computeGpResults(rawResults);
      setRows(computed);
    } catch (e) {
      console.log("GpResultsScreen fetch error:", e);
      setError("Tulosluettelon hakeminen epäonnistui.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [gpId]);

  return (
    <ScrollView
      style={layout.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 8 }}>
        {title ?? `GP #${gpId} tulokset`}
      </Text>

      {loading && (
        <View style={[layout.center, { marginTop: 32 }]}>
          <ActivityIndicator animating size="large" color={appColors.primary} />
        </View>
      )}

      {!loading && error && (
        <Text style={{ color: "red", marginTop: 16 }}>{error}</Text>
      )}

      {!loading && !error && rows.length === 0 && (
        <Text style={{ marginTop: 16 }}>Tuloksia ei löytynyt.</Text>
      )}

      {!loading && !error && rows.length > 0 && (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Sija</DataTable.Title>
            <DataTable.Title>Nimi</DataTable.Title>
            <DataTable.Title numeric>Sarja 1</DataTable.Title>
            <DataTable.Title numeric>Sarja 2</DataTable.Title>
            <DataTable.Title numeric>Yhteensä.</DataTable.Title>
            <DataTable.Title numeric>Ero voittajaan</DataTable.Title>
          </DataTable.Header>

          {rows.map((row) => (
            <DataTable.Row key={row.tulosId}>
              <DataTable.Cell>{row.sija}</DataTable.Cell>
              <DataTable.Cell>{row.nimi}</DataTable.Cell>
              <DataTable.Cell numeric>{row.sarja1}</DataTable.Cell>
              <DataTable.Cell numeric>{row.sarja2}</DataTable.Cell>
              <DataTable.Cell numeric>{row.yhteensa}</DataTable.Cell>
              <DataTable.Cell numeric>
                {row.eroVoittajaan === 0 ? "-" : row.eroVoittajaan}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      )}
    </ScrollView>
  );
};

export default GpResultsScreen;