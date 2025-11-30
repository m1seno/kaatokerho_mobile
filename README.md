# kaatokerho_mobile

## Käytetyt teknologiat

### react
	Perus React-kirjasto komponenttien, hookien (useState, useEffect, useCallback, useMemo) ja JSX:n käyttöön.

### @react-navigation/native-stack
	Native stack -navigointi (ruudut pinoon, esim. Login → Home → Details).

### @react-navigation/bottom-tabs
	Alavalikko/tab bar -navigointi (Home / Sarjataulukko / Kalenteri / Admin -välilehdet).

### @expo/vector-icons (MaterialCommunityIcons)
	Ikonit tab-bariin, nappeihin ja muualle UI:hin.

### react-native-paper
	Material Design -komponentit (Button, TextInput, Card, Dialog, Chip, Menu, jne.) ja teemat (MD3LightTheme / MD3DarkTheme).

### react-native
	Ydinkomponentit mobiilikäyttöön (View, Text, FlatList, StyleSheet, Touchable*, LayoutAnimation, Platform, UIManager, Share).

### react-native-safe-area-context
	SafeAreaView, joka huolehtii ettei sisältö mene loven / status barin alle iOS/Android-laitteissa.

### expo-secure-store
	Turvallinen tallennus (esim. JWT-token ja käyttäjän id) laitteen suojattuun storageen.

### axios
	HTTP-kirjasto API-kutsuihin (GET/POST/PUT/DELETE backendin REST-rajapintaan).
### zustand

	Kevyt tilanhallintakirjasto (AuthStore, RefreshStore: esim. standings/calendar/home refresh -flägien hallinta).