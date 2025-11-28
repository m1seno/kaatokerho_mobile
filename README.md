# kaatokerho_mobile

## Sovelluksen rakenne

```
src/
  navigation/
    ✅ RootNavigator.tsx        # Pää: näyttää joko AuthStackin tai MainTabit 
    ✅ AuthNavigator.tsx        # Login-flow
    ✅ MainTabNavigator.tsx     # Alapalkin tabit: Home, Sarjataulukko, Kalenteri, Tilastot, Admin

  screens/
    auth/
      ✅ LoginScreen.tsx        # Login + optio biometriseen
    home/
      ✅ HomeScreen.tsx         # Etusivu: tilanne + seuraava GP
    standings/
      ✅ StandingsScreen.tsx    # Sarjataulukko
    schedule/
      ✅ ScheduleScreen.tsx     # Kilpailukalenteri (GP-lista)
      GpDetailScreen.tsx     # Yksittäisen GP:n tiedot + tulokset
    stats/
      StatsScreen.tsx        # Tilastot + graafit
    admin/
      AdminDashboardScreen.tsx   # Adminin etusivu
      AdminGpListScreen.tsx      # Lista GP:istä adminille
      AdminGpFormScreen.tsx      # Lisää/muokkaa GP
      AdminResultsScreen.tsx     # Syötä/muokkaa tuloksia
      AdminRsvpScreen.tsx        # RSVP/Osallistujalista (kun ehdit)

  components/
    layout/
      ScreenContainer.tsx    # Yhtenäinen tausta, padding jne.
      LoadingSpinner.tsx
      ErrorState.tsx
    home/
      SeasonSummaryCard.tsx  # Käyttäjän kausitilannekortti
      NextGpCard.tsx         # Seuraava GP -kortti
    standings/
      StandingsTable.tsx     # Sarjataulukon taulukko
      StandingsRow.tsx       # Yksi rivi taulukossa
    schedule/
      GpListItem.tsx         # Yksi GP listassa
    stats/
      StatCard.tsx           # Yksi tilastokortti (esim. keskiarvo)
      LineChart.tsx          # Wrapper victory-native / chart-kit linjagraafille
      BarChart.tsx           # Wrapper pylväsdiagrammille
      FilterBar.tsx          # Kausi / keilaaja / aikaväli -filtterit
    admin/
      GpForm.tsx             # Lomake GP:n tiedoille
      ResultRowEditor.tsx    # Yhden pelaajan tulosrivin muokkaus
      RsvpStatusList.tsx     # Kyllä / Ei / Ei vastannut -lista
    common/
      PrimaryButton.tsx      # Yhtenäinen nappi (paper Button -wrap)
      TextInputField.tsx     # Yhtenäinen tekstikenttä
      SelectField.tsx        # Yhtenäinen dropdown
      InfoChip.tsx           # Pieni “badge”-tyyppinen label

  services/
    ✅ api.ts                   # axios-instanssi (baseURL + JWT-header)
    authService.ts           # login, /me
    seasonService.ts         # käyttäjän kausiyhteenveto, sarjataulukko
    gpService.ts             # GP-listaus, gp-by-id, admin-CRUD
    statsService.ts          # tilastot endpointteja varten
    notificationsService.ts  # expo-notifications-integraatio (kun siihen asti päästään)

  store/
    ✅ AuthStore.ts             # käyttäjä, token, rooli, login/logout

  hooks/
    useAuth.ts               # helppo hook AuthStoreen
    useCurrentSeason.ts      # (valinnainen) kuluvan kauden haku
    useStandings.ts          # (valinnainen) custom hook sarjataulukkoon
    useSchedule.ts           # (valinnainen) hook GP-kalenterille
    useStats.ts              # (valinnainen) hook tilastoille

  theme/
    paperTheme.ts            # React Native Paper -teema
    colors.ts
    spacing.ts               # peruspaddaukset ym.

  types/
    api.ts                   # DTO-tyypit: Gp, Keilaaja, Standing, Stat jne.
    enums.ts                 # esim. roolit, RSVP-status

  utils/
    date.ts                  # päivämäärien formatointi
    format.ts                # yleiset formatointifunktiot (pisteet, keskiarvot)
    validation.ts            # mahdolliset schema/validointiapurit
```