import { useRef } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const { height } = Dimensions.get("window");

export default function TransportScreen() {
  // Пример вариантов поездки
  const webViewRef = useRef<WebView>(null);

  const moveCar = () => {
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: "MOVE_CAR",
        coords: [55.758, 37.635],
        // key: "54bdbc92-2486-4a36-a3b7-5419c41d4e44",
      }),
    );
  };

  const drawRoute = () => {
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: "DRAW_ROUTE",
        points: [
          [55.751244, 37.618423],
          [55.768, 37.655],
        ],
        // key: "54bdbc92-2486-4a36-a3b7-5419c41d4e44",
      }),
    );
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: MAP_HTML }}
        javaScriptEnabled
        style={styles.map}
      />

      <View style={styles.controls}>
        <Button title="Сдвинуть машину" onPress={moveCar} />
        <Button title="Построить маршрут" onPress={drawRoute} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    gap: 10,
  },
});

const MAP_HTML = `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>2GIS Transport</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
      html, body, #map {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
    </style>

    <script src="https://maps.api.2gis.ru/2.0/loader.js?pkg=full&key=54bdbc92-2486-4a36-a3b7-5419c41d4e44"></script>
  </head>

  <body>
    <div id="map"></div>

    <script>
      let map;
      let carMarker;
      let route;
      let dgReady = false;

      DG.then(function () {
        map = DG.map("map", {
          center: [55.751244, 37.618423],
          zoom: 13,
        });

        carMarker = DG.marker([55.751244, 37.618423])
          .addTo(map)
          .bindPopup("🚚 Транспорт");

        dgReady = true;
      });

      function handleMessage(event) {
        if (!dgReady) return;

        const data = JSON.parse(event.data);

        if (data.type === "MOVE_CAR") {
          carMarker.setLatLng(data.coords);
          map.setView(data.coords);
        }

        if (data.type === "DRAW_ROUTE") {
          if (route) {
            map.removeLayer(route);
          }

          // ⚠️ routing ТОЛЬКО после DG.then
          route = DG.routing({
            points: data.points,
            type: "car",
          }).addTo(map);
        }
      }

      document.addEventListener("message", handleMessage);
      window.addEventListener("message", handleMessage);
    </script>
  </body>
</html>
`;
