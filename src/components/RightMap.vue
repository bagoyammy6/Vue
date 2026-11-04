<template>
  <div id="mapid" class="right" v-show="showMap"></div>
  <div class="right-down" @click="locate" v-show="showMap">
    <div class="position-wrap">
      <div class="position">
        <i class="fa-solid fa-location-crosshairs"></i>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import Wkt from "wicket";
import { showApiError } from "../api/tdx";
import {
  getScenicSpots,
  getRestaurants,
  getNearbyScenicSpots,
  getNearbyRestaurants,
  indexAvailability,
} from "../api/queries";
import { escapeHtml as e } from "../utils/html";

// Mapbox token 從環境變數讀取 (請放在不會被 commit 的 .env.local / .env.production.local)。
// 沒有設定時改用 OpenStreetMap 官方圖磚 (免金鑰)。
const MAPBOX_TOKEN = process.env.VUE_APP_MAPBOX_TOKEN;

const ICON_SIZE = [45, 55];
const icons = {};
// 同一種圖示只建立一次 (舊版每個 marker 都 new 一個)
function icon(url) {
  if (!icons[url]) icons[url] = L.icon({ iconUrl: url, iconSize: ICON_SIZE });
  return icons[url];
}
const POPUP = { className: "pop", closeButton: false };
const LINE_STYLE = { color: "#C50047", weight: 5, opacity: 0.7 };

// ---- popup 內容 (所有動態資料都經過 escapeHtml，避免 XSS) ----
function stationPopup(station, ava) {
  const time = station.UpdateTime
    ? new Date(station.UpdateTime).toLocaleString()
    : "";
  return `<div class="show-up">
    <div class="show-name">${e(station.StationName?.Zh_tw)}</div>
    <div class="show-address">
      <div class="show-address-img"><i class="fa-solid fa-location-dot"></i></div>
      <div class="show-address-word">${e(station.StationAddress?.Zh_tw)}</div>
    </div>
    <div class="show-time">
      <div class="show-time-img"><i class="fa-solid fa-clock-rotate-left"></i></div>
      <div class="show-time-word">${e(time)}</div>
    </div>
    <div class="show-state">
      <div class="show-state-run">營運狀態</div>
      <div class="show-state-bike">單車狀態</div>
    </div>
    <div class="show-number">
      <div class="available-bike">
        <div class="available-bike-word">可借單車</div>
        <div class="available-bike-number">${e(
          ava?.AvailableRentBikes ?? "-"
        )}</div>
      </div>
      <div class="available-empty">
        <div class="available-empty-word">可停空位</div>
        <div class="available-empty-number">${e(
          ava?.AvailableReturnBikes ?? "-"
        )}</div>
      </div>
    </div>
  </div>`;
}

function roadPopup(a) {
  return `<div class="show-up">
    <div class="show-name">${e(a.RouteName)}</div>
    <div class="show-address">
      <div class="show-address-img"><i class="fa-solid fa-location-dot"></i></div>
      <div class="show-address-word">${e(a.City)} ${e(a.Town)}</div>
    </div>
    <div class="show-time">
      <div class="show-time-img"><i class="fa-solid fa-arrow-right-arrow-left"></i></div>
      <div class="show-time-word">${e(a.Direction)}</div>
      <div class="length">
        <div class="show-time-img"><i class="fa-solid fa-route"></i></div>
        <div class="show-time-word">${e(a.CyclingLength)}</div>
      </div>
    </div>
    <div class="show-time">
      <div class="start-word">開始</div>
      <div class="show-time-word">${e(a.RoadSectionStart)}</div>
    </div>
    <div class="show-time">
      <div class="start-word">結束</div>
      <div class="show-time-word">${e(a.RoadSectionEnd)}</div>
    </div>
  </div>`;
}

function viewPopup(d) {
  return `<div class="show-up">
    <div class="show-name">${e(d.ScenicSpotName)}</div>
    <div class="show-address">
      <div class="show-address-img"><i class="fa-solid fa-location-dot"></i></div>
      <div class="show-address-word">${e(d.Address)}</div>
    </div>
    <div class="show-time">
      <div class="start-word"><i class="fa-solid fa-phone"></i></div>
      <div class="show-time-word">${e(d.Phone)}</div>
    </div>
    <div class="show-time">
      <div class="start-word"><i class="fa-regular fa-calendar"></i></div>
      <div class="show-time-word">${e(d.OpenTime)}</div>
    </div>
  </div>`;
}

function foodPopup(d) {
  return `<div class="show-up">
    <div class="show-name">${e(d.RestaurantName)}</div>
    <div class="show-address">
      <div class="show-address-img"><i class="fa-solid fa-location-dot"></i></div>
      <div class="show-address-word">${e(d.Address)}</div>
    </div>
    <div class="show-time">
      <div class="start-word"><i class="fa-solid fa-phone"></i></div>
      <div class="show-time-word">${e(d.Phone)}</div>
    </div>
    <div class="show-time">
      <div class="start-word"><i class="fa-solid fa-pen-to-square"></i></div>
      <div class="show-time-word">${e(d.Description)}</div>
    </div>
  </div>`;
}

/** WKT (TDX 車道 Geometry) 轉 GeoJSON，並取得起點 [lat, lng] */
function parseGeometry(wkt) {
  const geo = new Wkt.Wkt().read(wkt).toJson();
  // LineString: [[lng,lat],...]；MultiLineString: [[[lng,lat],...],...]
  const first =
    geo.type === "MultiLineString" ? geo.coordinates[0][0] : geo.coordinates[0];
  return { geo, start: [first[1], first[0]] };
}

export default {
  name: "RightMap",
  computed: {
    showMap() {
      return this.$store.state.showMap;
    },
  },
  watch: {
    "$store.state.stationCoord"(station) {
      if (!station?.StationPosition) return;
      this.$store.commit("setShowMap", true);
      // 手機版 popup 偏移的修正
      const offset =
        screen.width <= 414 ? new L.Point(-183, 10) : new L.Point(0, 10);
      const latLng = [
        station.StationPosition.PositionLat,
        station.StationPosition.PositionLon,
      ];
      this.myMap.flyTo(latLng, 19);
      L.popup({ ...POPUP, offset })
        .setLatLng(latLng)
        .setContent(stationPopup(station, this.$store.state.stationAva))
        .openOn(this.myMap);
    },
    "$store.state.mapData"(list) {
      this.markers.clearLayers();
      const data = Object.values(list || {});
      if (data.length === 0) {
        this.$store.commit("setIsLoading", false);
        return;
      }
      if (this.$route.name === "findbike") {
        this.drawStations(data);
      } else {
        this.drawRoads(data);
      }
      this.$store.commit("setIsLoading", false);
    },
    "$store.state.roadCoord"(road) {
      if (!road?.Geometry) return;
      this.markers.clearLayers();
      if (!this.drawRoad(road)) return;
      this.fitToMarkers();
      // 以車道範圍的中心點搜尋附近景點/餐廳
      this.loadNearby(this.markers.getBounds().getCenter(), road.CyclingLength);
    },
    "$store.state.goView"(d) {
      if (!d?.Position) return;
      const latLng = [d.Position.PositionLat, d.Position.PositionLon];
      this.myMap.setView(latLng, 19);
      L.popup(POPUP)
        .setLatLng(latLng)
        .setContent(viewPopup(d))
        .openOn(this.myMap);
    },
    "$store.state.goFood"(d) {
      if (!d?.Position) return;
      const latLng = [d.Position.PositionLat, d.Position.PositionLon];
      this.myMap.setView(latLng, 19);
      L.popup(POPUP)
        .setLatLng(latLng)
        .setContent(foodPopup(d))
        .openOn(this.myMap);
    },
  },
  methods: {
    fitToMarkers() {
      const bounds = this.markers.getBounds();
      if (bounds.isValid()) this.myMap.fitBounds(bounds);
    },
    drawStations(stations) {
      // 舊版用雙層迴圈比對 (站點數 × 站點數，上千筆時非常慢)，改用 Map 查表
      const avaMap = indexAvailability(this.$store.state.mapAva);
      const layers = [];
      stations.forEach((d) => {
        const ava = avaMap.get(d.StationUID);
        if (!ava || !d.StationPosition) return;
        layers.push(
          L.marker(
            [d.StationPosition.PositionLat, d.StationPosition.PositionLon],
            { icon: icon("./L.svg") }
          ).bindPopup(stationPopup(d, ava), POPUP)
        );
      });
      // 一次加入 (markercluster 批次加入比逐筆快很多)
      this.markers.addLayers(layers);
      const first = stations[0].StationPosition;
      if (first) this.myMap.flyTo([first.PositionLat, first.PositionLon], 10);
    },
    drawRoad(road) {
      try {
        const { geo, start } = parseGeometry(road.Geometry);
        this.markers.addLayer(L.geoJSON(geo, { style: LINE_STYLE }));
        this.markers.addLayer(
          L.marker(start, { icon: icon("./start.svg") }).bindPopup(
            roadPopup(road),
            POPUP
          )
        );
        return start;
      } catch (err) {
        // 個別車道資料格式有誤時略過，不要讓整張地圖壞掉
        console.warn("無法解析車道", road.RouteName, err);
        return null;
      }
    },
    drawRoads(roads) {
      roads.forEach((r) => this.drawRoad(r));
      this.fitToMarkers();
      this.loadCityPoints();
    },
    addPoints(list, iconUrl, popup) {
      const layers = (list || [])
        .filter((d) => d.Position?.PositionLat)
        .map((d) =>
          L.marker([d.Position.PositionLat, d.Position.PositionLon], {
            icon: icon(iconUrl),
          }).bindPopup(popup(d), POPUP)
        );
      this.markers.addLayers(layers);
    },
    async loadCityPoints() {
      const city = this.$store.state.reqCity;
      try {
        const [views, foods] = await Promise.all([
          getScenicSpots(city),
          getRestaurants(city),
        ]);
        this.addPoints(views, "./view.svg", viewPopup);
        this.addPoints(foods, "./eat.svg", foodPopup);
      } catch (err) {
        showApiError(err);
      }
    },
    async loadNearby(center, length) {
      const city = this.$store.state.reqCity;
      // 搜尋半徑：車道長度的 1/3，至少 500 公尺
      const radius = Math.max(500, Math.round((length || 0) / 3));
      try {
        const [views, foods] = await Promise.all([
          getNearbyScenicSpots(city, center.lat, center.lng, radius),
          getNearbyRestaurants(city, center.lat, center.lng, radius),
        ]);
        this.$store.commit("setRangeView", views);
        this.$store.commit("setRangeFood", foods);
        this.addPoints(views, "./view.svg", viewPopup);
        this.addPoints(foods, "./eat.svg", foodPopup);
      } catch (err) {
        showApiError(err);
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
    locate() {
      if (!navigator.geolocation) {
        alert("此瀏覽器不支援定位");
        return;
      }
      this.$store.commit("setIsLoading", true);
      this.homePoints.clearLayers();
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.$store.commit("setIsLoading", false);
          this.myMap.flyTo([latitude, longitude], 17);
          L.marker([latitude, longitude], { icon: icon("./location.svg") })
            .bindPopup("<div>目前位置</div>", {
              className: "locate",
              closeButton: false,
            })
            .addTo(this.homePoints);
        },
        (err) => {
          // 舊版失敗時 loading 會一直轉不停
          this.$store.commit("setIsLoading", false);
          alert(err.code === 1 ? "請允許瀏覽器存取位置" : "無法取得目前位置");
        },
        { timeout: 10000 }
      );
    },
  },
  mounted() {
    // 地圖物件不需要響應式，直接掛在 this 上 (不放進 data)
    this.myMap = L.map("mapid", {
      zoomControl: true,
      zoomAnimation: false,
      fadeAnimation: true,
      markerZoomAnimation: true,
    }).setView([23.611, 120.768], 8);
    const tiles = MAPBOX_TOKEN
      ? L.tileLayer(
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 20,
            minZoom: 7,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: MAPBOX_TOKEN,
          }
        )
      : L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 7,
        });
    tiles.addTo(this.myMap);
    // 要在 map 設定 maxZoom 之後才能加入 markerClusterGroup
    this.markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      chunkedLoading: true,
      spiderLegPolylineOptions: { weight: 1.5, color: "#222", opacity: 0.5 },
    }).addTo(this.myMap);
    this.homePoints = L.layerGroup().addTo(this.myMap);
  },
  beforeUnmount() {
    if (this.myMap) this.myMap.remove();
  },
};
</script>

<style scoped>
.right {
  position: fixed;
  top: 80px;
  left: 384px;
  height: calc(100vh - 80px);
  width: calc(100vw - 384px);
  /* background-image: url(../assets/fake1.png); */
  background-size: cover;
  background-repeat: no-repeat;
}
.right-down {
  position: fixed;
  top: calc(100vh - 12vh);
  left: calc(100vw - 5vw);
  height: 136px;
  width: 40px;
}
.position-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}
.position {
  color: #0e5978;
  background-color: white;
  border-radius: 50%;
  padding: 8px;
  font-size: large;
  cursor: pointer;
}
/* iPad Mini */
@media (max-width: 768px) {
  .right-down {
    top: calc(100vh - 9vh);
    left: calc(100vw - 7vw);
  }
}
/* iPhone XR */
@media (max-width: 576px) {
  .right {
    top: 56px;
    left: 0;
    height: calc(100vh - 107px);
    width: 100vw;
  }
  .right-down {
    top: calc(100vh - 14vh);
    left: calc(100vw - 13vw);
  }
}
</style>
