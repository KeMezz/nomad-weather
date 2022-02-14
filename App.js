import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const API_KEY = "ae1744e07c381f0dac0de7fb4e5a98fd";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Snow: "snow",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [dailyForecast, setDailyForecast] = useState([]);
  const [userAgreed, setUserAgreed] = useState(false);

  const getWeather = async () => {
    // check user granted or not
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) setUserAgreed(false);

    // get user's location
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);

    // get user's daily forecast
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDailyForecast(json.daily);
    console.log(dailyForecast);
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
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {dailyForecast.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="black" size="large" />
          </View>
        ) : (
          dailyForecast.map((daily, index) => (
            <View key={index} style={styles.day}>
              <Fontisto
                name={icons[daily.weather[0].main]}
                size={50}
                color="black"
              />
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.temp}>
                  {parseFloat(daily.temp.day).toFixed(0)}
                </Text>
                <Text style={styles.celcius}>℃</Text>
              </View>
              <Text style={styles.desc}>{daily.weather[0].main}</Text>
              <Text style={styles.detailDesc}>
                {daily.weather[0].description}
              </Text>
              <Text style={styles.date}>
                {new Date(daily.dt * 1000).toString().substring(0, 10)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gold",
  },
  city: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 40,
    fontWeight: "500",
  },
  celcius: {
    alignSelf: "flex-end",
    fontSize: 50,
    marginBottom: 28,
    marginLeft: 10,
  },
  day: {
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  date: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: "600",
  },
  temp: {
    fontSize: 160,
  },
  desc: {
    marginTop: -10,
    fontSize: 40,
  },
  detailDesc: {
    fontSize: 20,
  },
});
