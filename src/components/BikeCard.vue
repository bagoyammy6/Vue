<template>
  <div class="divid first-line"></div>
  <div class="scroll">
    <div
      class="bike-card"
      :key="idx"
      v-for="(d, idx) in searchResult"
      @click="getCoord(d, idx)"
    >
      <!-- <div class="spot-name">{{ d.StationName.Zh_tw }}</div> -->
      <div
        class="spot-name"
        v-html="keywordHighlight(d.StationName.Zh_tw)"
      ></div>
      <div class="address">
        <div class="address-img">
          <i class="fa-solid fa-location-dot"></i>
        </div>
        <div class="address-word">{{ d.StationAddress.Zh_tw }}</div>
      </div>
      <div class="state-btn">
        <div class="run-state" v-if="available[idx]?.ServiceStatus == 1">
          正常營運
        </div>
        <div class="pause-state" v-if="available[idx]?.ServiceStatus == 2">
          暫停營運
        </div>
        <div class="stop-state" v-if="available[idx]?.ServiceStatus == 0">
          停止營運
        </div>
        <div class="bike-state" v-if="available[idx]?.AvailableRentBikes > 0">
          尚有單車
        </div>
        <div class="empty-state" v-if="available[idx]?.AvailableRentBikes == 0">
          已無單車
        </div>
        <div
          class="full-state"
          v-if="available[idx]?.AvailableReturnBikes == 0"
        >
          車位已滿
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BikeCard",
  data() {
    return {
      searchResult: this.$store.state.searchResult,
      available: this.$store.state.available,
    };
  },
  methods: {
    getCoord: function (d, idx) {
      // console.log(value);
      this.$store.commit("setStationCoord", d);
      // console.log(this.$store.state.stationCoord);
      this.$store.commit("setStationAva", this.available[idx]);
      // console.log(this.$store.state.stationAva);
    },
    keywordHighlight: function (val) {
      // console.log(this.$store.state.keyword);
      let q = val.replace(
        new RegExp(this.$store.state.keyword, "g"),
        `<span class="highlight">${this.$store.state.keyword}</span>`
      );
      // console.log(q);
      return q;
    },
  },
  watch: {
    "$store.state.searchResult": function () {
      this.searchResult = this.$store.state.searchResult;
    },
    "$store.state.available": function () {
      this.available = this.$store.state.available;
      // console.log(this.available);
    },
  },
};
</script>

<style scoped>
.divid {
  width: 360px;
  border-top: 2px solid #e5e5e5;
  margin-top: 18px;
  margin-bottom: 18px;
}
.scroll {
  overflow-y: scroll;
}
.bike-card {
  width: 348px;
  height: auto;
  background: #f6f6f6;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
}
.bike-card:hover {
  background: #f1f1f1;
}
.spot-name {
  font-weight: 700;
  font-size: 20px;
  padding: 8px 16px 8px 16px;
}
.address {
  display: flex;
  align-items: center;
  padding: 0px 16px 8px 16px;
}
.address-img {
  color: #0e5978;
  font-size: 20px;
}
.address-word {
  font-weight: 400;
  font-size: 14px;
  color: #484848;
  padding-left: 8px;
}
.state-btn {
  display: flex;
  padding: 0px 16px 8px 16px;
}
.run-state {
  border: 1px solid #0a4259;
  border-radius: 4px;
  background: #f0f9fc;
  color: #0a4259;
  padding: 4px 8px;
}
.pause-state {
  border: 1px solid #cc1010;
  border-radius: 4px;
  background: #f4dcdc;
  color: #cc1010;
  padding: 4px 8px;
}
.stop-state {
  border: 1px solid #7b7b7b;
  border-radius: 4px;
  background: #e5e5e5;
  color: #7b7b7b;
  padding: 4px 8px;
}
.bike-state {
  border: 1px solid #0a4259;
  border-radius: 4px;
  background: #f0f9fc;
  color: #0a4259;
  padding: 4px 8px;
  margin-left: 8px;
}
.empty-state {
  border: 1px solid #cc1010;
  border-radius: 4px;
  background: #f4dcdc;
  color: #cc1010;
  padding: 4px 8px;
  margin-left: 8px;
}
.full-state {
  border: 1px solid #eb8f05;
  border-radius: 4px;
  background: #f5e6d0;
  color: #eb8f05;
  padding: 4px 8px;
  margin-left: 8px;
}
/* iPhone XR */
@media (max-width: 576px) {
  .first-line {
    display: none;
  }
  .scroll {
    overflow-y: unset;
  }
}
</style>
