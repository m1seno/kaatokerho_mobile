import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { layout } from "../styles/layout";
import { appColors } from "../styles";
import { Season, getCurrentSeason } from "../services/seasonService";
import {
  Calendar,
  getCalendarForCurrentSeason,
} from "../services/calendarService";
import { CalendarStackParamList } from "../navigation/CalendarNavigator";
import GpListItem from "../components/schedule/GpListItem";

const CalendarScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CalendarStackParamList>>();
  const [calendar, setCalendar] = useState<Calendar[]>([]);
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [calendarData, seasonData] = await Promise.all([
        getCalendarForCurrentSeason(),
        getCurrentSeason(),
      ]);
      setCalendar(calendarData);
      setSeason(seasonData);
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

  const averageWinnerScore = useMemo(() => {
    const scores = calendar
      .filter((event) => event.voittotulos !== null)
      .map((event) => event.voittotulos as number);
    if (scores.length === 0) return null;
    const total = scores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / scores.length);
  }, [calendar]);

  const renderItem = useCallback(
    ({ item }: { item: Calendar }) => (
      <GpListItem
        gp={item}
        onPress={() =>
          navigation.navigate("GpResults", {
            gpId: item.gpId,
            title: `GP #${item.jarjestysnumero}`,
          })
        }
      />
    ),
    [navigation]
  );

  return (
    <FlatList
      data={calendar}
      keyExtractor={(item) => item.gpId.toString()}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      style={layout.container}
      ListHeaderComponent={
        <View style={{ marginBottom: 12 }}>
          <Text variant="headlineMedium" style={{ marginBottom: 8 }}>
            GP-kalenteri {season ? ` ${season.nimi}` : ""}
          </Text>
          {averageWinnerScore !== null && (
            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
              Voittotulosten keskiarvo: {averageWinnerScore}
            </Text>
          )}
          {loading && (
            <View style={[layout.center, { marginVertical: 24 }]}>
              <ActivityIndicator
                animating
                size="large"
                color={appColors.primary}
              />
            </View>
          )}
          {!loading && error && (
            <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
          )}
          {!loading && !error && calendar.length === 0 && (
            <Text style={{ marginBottom: 12 }}>
              Kalenteritietoja ei ole saatavilla.
            </Text>
          )}
        </View>
      }
      renderItem={renderItem}
      ListEmptyComponent={null}
    />
  );
};

export default CalendarScreen;
