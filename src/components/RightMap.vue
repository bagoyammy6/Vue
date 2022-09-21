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

export default {
  name: "RightMap",
  data() {
    return {
      showMap: this.$store.state.showMap,
      myMap: {},
      markers: {},
      myLayer: {},
      anotherLayer: {},
      center: {},
      long: 0,
      home: {},
      homePoints: {},
    };
  },
  watch: {
    "$store.state.showMap": function () {
      this.showMap = this.$store.state.showMap;
      // console.log("變了");
    },
    "$store.state.stationCoord": function () {
      this.$store.commit("setShowMap", true);
      //手機版的popup會有偏移猜測可能是地圖的問題，先透過螢幕尺寸設定偏移量解決
      let abc = {};
      if (screen.width <= 414) {
        abc = { offset: new L.Point(-183, 10) };
      } else {
        abc = { offset: new L.Point(0, 10) };
      }
      this.myMap.flyTo(
        [
          this.$store.state.stationCoord.StationPosition.PositionLat,
          this.$store.state.stationCoord.StationPosition.PositionLon,
        ],
        19
      );
      let dateTime = new Date(
        this.$store.state.stationCoord.UpdateTime
      ).toLocaleString();
      L.popup({
        className: "pop",
        closeButton: false,
        offset: abc.offset,
      })
        .setLatLng([
          this.$store.state.stationCoord.StationPosition.PositionLat,
          this.$store.state.stationCoord.StationPosition.PositionLon,
        ])
        .setContent(
          `<div class="show-up">
            <div class="show-name">${this.$store.state.stationCoord.StationName.Zh_tw}</div>
            <div class="show-address">
              <div class="show-address-img">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div class="show-address-word">${this.$store.state.stationCoord.StationAddress.Zh_tw}</div>
            </div>
            <div class="show-time">
              <div class="show-time-img">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </div>
              <div class="show-time-word">${dateTime}</div>
            </div>
            <div class="show-state">
              <div class="show-state-run">營運狀態</div>
              <div class="show-state-bike">單車狀態</div>
            </div>
            <div class="show-number">
              <div class="available-bike">
                <div class="available-bike-word">可借單車</div>
                <div class="available-bike-number">${this.$store.state.stationAva.AvailableRentBikes}</div>
              </div>
              <div class="available-empty">
                <div class="available-empty-word">可停空位</div>
                <div class="available-empty-number">${this.$store.state.stationAva.AvailableReturnBikes}</div>
              </div>
            </div>
          </div>`
        )
        .openOn(this.myMap);
    },
    "$store.state.mapData": function () {
      if (this.$route.name == "findbike") {
        if (this.myLayer) {
          this.markers.clearLayers();
        } else {
          console.log("沒有圖層");
        }
        // console.log(this.$store.state.mapData);
        let a = Object.values(this.$store.state.mapData);
        let b = Object.values(this.$store.state.mapAva);
        // console.log(a);
        a.forEach((d) => {
          b.forEach((e) => {
            if (d.StationUID == e.StationUID) {
              const customIcon = L.icon({
                iconUrl: "./L.svg",
                iconSize: [45, 55],
              });
              let dateTime = new Date(d.UpdateTime).toLocaleString();
              this.myLayer = L.marker(
                [d.StationPosition.PositionLat, d.StationPosition.PositionLon],
                { icon: customIcon }
              ).bindPopup(
                `<div class="show-up">
                  <div class="show-name">${d.StationName.Zh_tw}</div>
                  <div class="show-address">
                    <div class="show-address-img">
                      <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div class="show-address-word">${d.StationAddress.Zh_tw}</div>
                  </div>
                  <div class="show-time">
                    <div class="show-time-img">
                      <i class="fa-solid fa-clock-rotate-left"></i>
                    </div>
                    <div class="show-time-word">${dateTime}</div>
                  </div>
                  <div class="show-state">
                    <div class="show-state-run">營運狀態</div>
                    <div class="show-state-bike">單車狀態</div>
                  </div>
                  <div class="show-number">
                    <div class="available-bike">
                      <div class="available-bike-word">可借單車</div>
                      <div class="available-bike-number">${e.AvailableRentBikes}</div>
                    </div>
                    <div class="available-empty">
                      <div class="available-empty-word">可停空位</div>
                      <div class="available-empty-number">${e.AvailableReturnBikes}</div>
                    </div>
                  </div>
                </div>`,
                { className: "pop", closeButton: false }
              );
              this.markers.addLayer(this.myLayer).addTo(this.myMap);
            }
          });
        });
        this.myMap.flyTo(
          [a[0].StationPosition.PositionLat, a[0].StationPosition.PositionLon],
          10
        );
      } else {
        // console.log(this.$store.state.mapData);
        if (this.myLayer) {
          this.markers.clearLayers();
        } else {
          console.log("沒有圖層");
        }
        let a = Object.values(this.$store.state.mapData);
        // console.log(a);
        try {
          a.forEach((a) => {
            // console.log(a.Geometry);
            // let geo = a.Geometry;
            this.polyLine(a);
          });
        } catch (err) {
          console.log(err);
        }
        this.getViewPoint();
        this.getFoodPoint();
        // zoom the map to the layer
        this.myMap.fitBounds(this.markers.getBounds());
      }
    },
    "$store.state.roadCoord": function () {
      // console.log(this.$store.state.roadCoord);
      if (this.anotherLayer) {
        this.markers.clearLayers();
      } else {
        console.log("沒有圖層");
      }

      let a = this.$store.state.roadCoord;
      this.anotherLine(a);
      this.myMap.fitBounds(this.markers.getBounds());
    },
    "$store.state.goView": function () {
      // console.log(this.$store.state.goView);
      this.myMap.setView(
        [
          this.$store.state.goView.Position.PositionLat,
          this.$store.state.goView.Position.PositionLon,
        ],
        19
      );
      L.popup({ className: "pop", closeButton: false })
        .setLatLng([
          this.$store.state.goView.Position.PositionLat,
          this.$store.state.goView.Position.PositionLon,
        ])
        .setContent(
          `<div class="show-up">
            <div class="show-name">${this.$store.state.goView.ScenicSpotName}</div>
            <div class="show-address">
              <div class="show-address-img">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div class="show-address-word">${this.$store.state.goView.Address}</div>
            </div>
            <div class="show-time">
              <div class="start-word">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div class="show-time-word">${this.$store.state.goView.Phone}</div>
            </div>
            <div class="show-time">
              <div class="start-word">
                <i class="fa-regular fa-calendar"></i>
              </div>
              <div class="show-time-word">${this.$store.state.goView.OpenTime}</div>
            </div>
          </div>`,
          { className: "pop" }
        )
        .openOn(this.myMap);
    },
    "$store.state.goFood": function () {
      this.myMap.setView(
        [
          this.$store.state.goFood.Position.PositionLat,
          this.$store.state.goFood.Position.PositionLon,
        ],
        19
      );
      L.popup({ className: "pop", closeButton: false })
        .setLatLng([
          this.$store.state.goFood.Position.PositionLat,
          this.$store.state.goFood.Position.PositionLon,
        ])
        .setContent(
          `<div class="show-up">
            <div class="show-name">${this.$store.state.goFood.RestaurantName}</div>
            <div class="show-address">
              <div class="show-address-img">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div class="show-address-word">${this.$store.state.goFood.Address}</div>
            </div>
            <div class="show-time">
              <div class="start-word">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div class="show-time-word">${this.$store.state.goFood.Phone}</div>
            </div>
            <div class="show-time">
              <div class="start-word">
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
              <div class="show-time-word">${this.$store.state.goFood.Description}</div>
            </div>
          </div>`,
          { className: "pop", closeButton: false }
        )
        .openOn(this.myMap);
    },
  },
  methods: {
    polyLine: function (a) {
      let geo = a.Geometry;
      // 建立一個 wkt 的實體
      const wicket = new Wkt.Wkt();
      const geojsonFeature = wicket.read(geo).toJson();
      // console.log(geojsonFeature);
      // let a = geojsonFeature.coordinates;
      // console.log(a[0][0][0]);

      const myStyle = {
        color: "#C50047",
        weight: 5,
        opacity: 0.7,
      };
      this.myLayer = L.geoJSON("", {
        style: myStyle,
      }).addData(geojsonFeature);
      this.markers.addLayer(this.myLayer).addTo(this.myMap);

      const customIcon = L.icon({
        iconUrl: "./start.svg",
        iconSize: [45, 55],
      });
      this.myLayer = L.marker(
        [
          geojsonFeature.coordinates[0][0][1],
          geojsonFeature.coordinates[0][0][0],
        ],
        {
          icon: customIcon,
        }
      ).bindPopup(
        `<div class="show-up">
            <div class="show-name">${a.RouteName}</div>
            <div class="show-address">
              <div class="show-address-img">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div class="show-address-word">${a.City} ${a.Town}</div>
            </div>
            <div class="show-time">
              <div class="show-time-img">
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
              </div>
              <div class="show-time-word">${a.Direction}</div>
              <div class="length">
                <div class="show-time-img">
                  <i class="fa-solid fa-route"></i>
                </div>
                <div class="show-time-word">${a.CyclingLength}</div>
              </div>
            </div>
            <div class="show-time">
              <div class="start-word">
                開始
              </div>
              <div class="show-time-word">${a.RoadSectionStart}</div>
            </div>
            <div class="show-time">
              <div class="start-word">
                結束
              </div>
              <div class="show-time-word">${a.RoadSectionEnd}</div>
            </div>
          </div>`,
        { className: "pop", closeButton: false }
      );
      this.markers.addLayer(this.myLayer).addTo(this.myMap);
    },
    anotherLine: function (a) {
      let geo = a.Geometry;
      // 建立一個 wkt 的實體
      const wicket = new Wkt.Wkt();
      const geojsonFeature = wicket.read(geo).toJson();
      // console.log(geojsonFeature);
      // let a = geojsonFeature.coordinates;
      // console.log(a[0][0][0]);

      const myStyle = {
        color: "#C50047",
        weight: 5,
        opacity: 0.7,
      };
      this.anotherLayer = L.geoJSON("", {
        style: myStyle,
      }).addData(geojsonFeature);
      this.markers.addLayer(this.anotherLayer).addTo(this.myMap);

      const customIcon = L.icon({
        iconUrl: "./start.svg",
        iconSize: [45, 55],
      });
      this.anotherLayer = L.marker(
        [
          geojsonFeature.coordinates[0][0][1],
          geojsonFeature.coordinates[0][0][0],
        ],
        {
          icon: customIcon,
        }
      ).bindPopup(
        `<div class="show-up">
            <div class="show-name">${a.RouteName}</div>
            <div class="show-address">
              <div class="show-address-img">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div class="show-address-word">${a.City} ${a.Town}</div>
            </div>
            <div class="show-time">
              <div class="show-time-img">
                <i class="fa-solid fa-arrow-right-arrow-left"></i>
              </div>
              <div class="show-time-word">${a.Direction}</div>
              <div class="length">
                <div class="show-time-img">
                  <i class="fa-solid fa-route"></i>
                </div>
                <div class="show-time-word">${a.CyclingLength}</div>
              </div>
            </div>
            <div class="show-time">
              <div class="start-word">
                開始
              </div>
              <div class="show-time-word">${a.RoadSectionStart}</div>
            </div>
            <div class="show-time">
              <div class="start-word">
                結束
              </div>
              <div class="show-time-word">${a.RoadSectionEnd}</div>
            </div>
          </div>`,
        { className: "pop", closeButton: false }
      );
      this.markers.addLayer(this.anotherLayer).addTo(this.myMap);
      this.center = this.myMap.getCenter();
      // console.log(this.center);
      this.long = a.CyclingLength;
      // console.log(this.long);
      this.getRangeView();
      this.getRangeFood();
    },
    getViewPoint: function () {
      let url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${this.$store.state.reqCity}`;
      fetch(url, {
        method: "GET",
        headers: new Headers({
          authorization: "Bearer " + this.token.access_token,
        }),
      })
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((data) => {
          // console.log(data);
          data.forEach((d) => {
            const customIcon = L.icon({
              iconUrl: "./view.svg",
              iconSize: [45, 55],
            });
            this.myLayer = L.marker(
              [d.Position.PositionLat, d.Position.PositionLon],
              {
                icon: customIcon,
              }
            ).bindPopup(
              `<div class="show-up">
                <div class="show-name">${d.ScenicSpotName}</div>
                <div class="show-address">
                  <div class="show-address-img">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div class="show-address-word">${d.Address}</div>
                </div>
                <div class="show-time">
                  <div class="start-word">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div class="show-time-word">${d.Phone}</div>
                </div>
                <div class="show-time">
                  <div class="start-word">
                    <i class="fa-regular fa-calendar"></i>
                  </div>
                  <div class="show-time-word">${d.OpenTime}</div>
                </div>
              </div>`,
              { className: "pop", closeButton: false }
            );
            this.markers.addLayer(this.myLayer).addTo(this.myMap);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getFoodPoint: function () {
      let url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/${this.$store.state.reqCity}`;
      fetch(url, {
        method: "GET",
        headers: new Headers({
          authorization: "Bearer " + this.token.access_token,
        }),
      })
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((data) => {
          // console.log(data);
          data.forEach((d) => {
            const customIcon = L.icon({
              iconUrl: "./eat.svg",
              iconSize: [45, 55],
            });
            this.myLayer = L.marker(
              [d.Position.PositionLat, d.Position.PositionLon],
              {
                icon: customIcon,
              }
            ).bindPopup(
              `<div class="show-up">
                <div class="show-name">${d.RestaurantName}</div>
                <div class="show-address">
                  <div class="show-address-img">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div class="show-address-word">${d.Address}</div>
                </div>
                <div class="show-time">
                  <div class="start-word">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div class="show-time-word">${d.Phone}</div>
                </div>
                <div class="show-time">
                  <div class="start-word">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </div>
                  <div class="show-time-word">${d.Description}</div>
                </div>
              </div>`,
              { className: "pop", closeButton: false }
            );
            this.markers.addLayer(this.myLayer).addTo(this.myMap);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRangeView: function () {
      let a = parseInt(this.long / 3);
      let url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${this.$store.state.reqCity}?%24spatialFilter=nearby(${this.center.lat},${this.center.lng},${a})`;
      fetch(url, {
        method: "GET",
        headers: new Headers({
          authorization: "Bearer " + this.token.access_token,
        }),
      })
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((data) => {
          // console.log(data);
          this.$store.commit("setRangeView", data);
          data.forEach((d) => {
            const customIcon = L.icon({
              iconUrl: "./view.svg",
              iconSize: [45, 55],
            });
            this.myLayer = L.marker(
              [d.Position.PositionLat, d.Position.PositionLon],
              {
                icon: customIcon,
              }
            ).bindPopup(
              `<div class="show-up">
                <div class="show-name">${d.ScenicSpotName}</div>
                <div class="show-address">
                  <div class="show-address-img">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div class="show-address-word">${d.Address}</div>
                </div>
                <div class="show-time">
                  <div class="start-word">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div class="show-time-word">${d.Phone}</div>
                </div>
                <div class="show-time">
                  <div class="start-word">
                    <i class="fa-regular fa-calendar"></i>
                  </div>
                  <div class="show-time-word">${d.OpenTime}</div>
                </div>
              </div>`,
              { className: "pop", closeButton: false }
            );
            this.markers.addLayer(this.myLayer).addTo(this.myMap);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRangeFood: function () {
      let a = parseInt(this.long / 3);
      let url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/${this.$store.state.reqCity}?%24spatialFilter=nearby(${this.center.lat},${this.center.lng},${a})`;
      fetch(url, {
        method: "GET",
        headers: new Headers({
          authorization: "Bearer " + this.token.access_token,
        }),
      })
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((data) => {
          // console.log(data);
          this.$store.commit("setRangeFood", data);
          data.forEach((d) => {
            const customIcon = L.icon({
              iconUrl: "./eat.svg",
              iconSize: [45, 55],
            });
            this.myLayer = L.marker(
              [d.Position.PositionLat, d.Position.PositionLon],
              {
                icon: customIcon,
              }
            ).bindPopup(
              `<div class="show-up">
                <div class="show-name">${d.RestaurantName}</div>
                <div class="show-address">
                  <div class="show-address-img">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div class="show-address-word">${d.Address}</div>
                </div>
                <div class="show-time">
                  <div class="start-word">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div class="show-time-word">${d.Phone}</div>
                </div>
                <div class="show-time">
                  <div class="start-word">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </div>
                  <div class="show-time-word">${d.Description}</div>
                </div>
              </div>`,
              { className: "pop", closeButton: false }
            );
            this.markers.addLayer(this.myLayer).addTo(this.myMap);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    locate: function () {
      if (this.home) {
        this.homePoints.clearLayers();
      }
      if (navigator.geolocation) {
        let longitude = 120;
        let latitude = 22;
        let myMap = this.myMap;
        let home = this.home;
        let homePoints = this.homePoints;
        navigator.geolocation.getCurrentPosition(
          function (position) {
            longitude = position.coords.longitude; //經度
            latitude = position.coords.latitude; //緯度
            // console.log(longitude);
            // console.log(latitude);
            myMap.flyTo([latitude, longitude], 17);
            const customIcon = L.icon({
              iconUrl: "./location.svg",
              iconSize: [45, 55],
            });
            home = L.marker([latitude, longitude], {
              icon: customIcon,
            }).bindPopup(`<div>目前位置</div>`, {
              className: "locate",
              closeButton: false,
            });
            homePoints.addLayer(home).addTo(myMap);
          },
          //錯誤訊息
          function (e) {
            const msg = e.code;
            const dd = e.message;
            console.error(msg);
            console.error(dd);
          }
        );
      } else {
        alert("尚未開啟定位");
      }
    },
  },
  beforeMount: function GetAuthorizationHeader() {
    const parameter = {
      grant_type: "client_credentials",
      client_id: "bagoyammy6-6d8a0d3f-0f27-4a43",
      client_secret: "2bb8b519-b371-4bae-b214-d57dccc6cfdc",
    };

    let auth_url =
      "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

    fetch(auth_url, {
      method: "POST",
      mode: "cors",
      body: new URLSearchParams(parameter),
      headers: new Headers({
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      }),
    })
      .then((data) => {
        // console.log(data);
        return data.json();
      })
      .then((accesstoken) => {
        // console.log(accesstoken);
        this.$store.commit("setToken", accesstoken);
        this.token = accesstoken;
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("我被執行了");
  },
  mounted() {
    const myMap = L.map("mapid", {
      zoomControl: true,
      zoom: 1,
      zoomAnimation: false,
      fadeAnimation: true,
      markerZoomAnimation: true,
    }).setView([23.611, 120.768], 8);
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        minZoom: 7,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiYmFnb3lhbW15NiIsImEiOiJjbDY5MjNyYXIwaXV6M2RxaDY0dXMweXdzIn0.NvZekiSATJeDcwdlq4WENg",
      }
    ).addTo(myMap);
    //下面要在myMap有設定maxZoom屬性後才可加入，否則會報錯
    let markers = L.markerClusterGroup({
      showCoverageOnHover: false,
      removeOutsideVisibleBounds: true,
      spiderLegPolylineOptions: { weight: 1.5, color: "#222", opacity: 0.5 },
    }).addTo(myMap);
    this.markers = markers;
    this.myMap = myMap;
    let homePoints = L.layerGroup().addTo(myMap);
    this.homePoints = homePoints;
    // console.log(this.$store.state.mapData);
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
