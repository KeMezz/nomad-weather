import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "ae1744e07c381f0dac0de7fb4e5a98fd";

export default function App() {
  const [city, setCity] = useState("로딩 중...");
  const [days, setDays] = useState(null);
  // const [location, setLocation] = useState(null);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        indicatorStyle="white"
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.celiusText}>27</Text>
          <Text style={styles.weatherText}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.celiusText}>27</Text>
          <Text style={styles.weatherText}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.celiusText}>27</Text>
          <Text style={styles.weatherText}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.celiusText}>27</Text>
          <Text style={styles.weatherText}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.celiusText}>27</Text>
          <Text style={styles.weatherText}>Sunny</Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gold",
  },
  city: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cityName: {
    color: "black",
    fontSize: 36,
    fontWeight: "900",
  },
  weather: {},
  day: {
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  celiusText: {
    marginTop: 20,
    fontSize: 150,
    fontWeight: "900",
  },
  weatherText: {
    marginTop: -10,
    fontSize: 40,
    fontWeight: "700",
  },
});
