<template>
  <div class="scroll">
    <div
      class="view-card"
      @click="getCoord(d)"
      @dblclick="changeCurrentComponent(), hidePage()"
      :key="idx"
      v-for="(d, idx) in searchResult"
    >
      <!-- <div class="view-card-title">{{ d.RouteName }}</div> -->
      <div class="view-card-title" v-html="keywordHighlight(d.RouteName)"></div>
      <div class="view-card-location">
        <div class="view-card-location-img">
          <i class="fa-solid fa-location-dot"></i>
        </div>
        <div class="view-card-location-word">{{ d.City }} {{ d.Town }}</div>
      </div>
      <div class="view-card-direction-distance">
        <div class="view-card-direction">
          <div class="view-card-direction-img">
            <i class="fa-solid fa-arrow-right-arrow-left"></i>
          </div>
          <div class="view-card-direction-word">{{ d.Direction }}</div>
        </div>
        <div class="view-card-distance">
          <div class="view-card-distance-img">
            <i class="fa-solid fa-route"></i>
          </div>
          <div class="view-card-distance-number">{{ d.CyclingLength }}公尺</div>
        </div>
        <div class="right-arrow">
          <i class="fa-solid fa-angle-right"></i>
        </div>
      </div>
      <div class="view-card-start">
        <div class="view-card-start-word">開始</div>
        <div class="view-card-start-place">{{ d.RoadSectionStart }}</div>
      </div>
      <div class="view-card-end">
        <div class="view-card-end-word">結束</div>
        <div class="view-card-end-place">{{ d.RoadSectionEnd }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoadCard",
  data() {
    return {
      searchResult: this.$store.state.searchResult,
    };
  },
  methods: {
    getCoord: function (d) {
      this.$store.commit("setRoadCoord", d);
    },
    changeCurrentComponent() {
      this.$store.commit("setCurrentComponent", "ViewCard");
      this.$store.commit("setShowAdvanced", false);
    },
    hidePage() {
      this.$store.commit("setIsActive", true);
      this.$store.commit("setWork", true);
      this.$store.commit("setLeft", true);
      this.$store.commit("setRight", true);
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
  },
};
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
.view-card {
  width: 348px;
  height: 186px;
  background: #f6f6f6;
  border-radius: 8px;
  padding: 16px 8px;
  box-sizing: border-box;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 16px;
  cursor: pointer;
}
.view-card:hover {
  background: #f1f1f1;
}
.view-card-title {
  font-weight: 700;
  font-size: 20px;
}
.view-card-location {
  display: flex;
  align-items: center;
  padding: 8px 0px;
}
.view-card-location-img {
  color: #0e5978;
  padding-left: 2px;
}
.view-card-location-word {
  color: #484848;
  font-weight: 400;
  font-size: 14px;
  padding-left: 10px;
}
.view-card-direction-distance {
  display: flex;
  padding-bottom: 8px;
  justify-content: space-between;
}
.view-card-direction {
  display: flex;
}
.view-card-direction-img {
  color: #0e5978;
}
.view-card-direction-word {
  color: #484848;
  font-weight: 400;
  font-size: 14px;
  padding-left: 8px;
}
.view-card-distance {
  display: flex;
}
.view-card-distance-img {
  color: #0e5978;
}
.view-card-distance-number {
  color: #484848;
  font-weight: 400;
  font-size: 14px;
  padding-left: 8px;
}
.right-arrow {
  color: #0a4259;
}
.view-card-start {
  display: flex;
  padding-bottom: 8px;
  align-items: center;
}
.view-card-start-word {
  color: #0e5978;
  font-weight: 700;
  font-size: 15px;
}
.view-card-start-place {
  color: #484848;
  font-weight: 400;
  font-size: 14px;
  padding-left: 8px;
}
.view-card-end {
  display: flex;
  padding-bottom: 8px;
  align-items: center;
}
.view-card-end-word {
  color: #0e5978;
  font-weight: 700;
  font-size: 15px;
}
.view-card-end-place {
  color: #484848;
  font-weight: 400;
  font-size: 14px;
  padding-left: 8px;
}
/* iPhone XR */
@media (max-width: 576px) {
  .scroll {
    overflow-y: unset;
  }
}
</style>
