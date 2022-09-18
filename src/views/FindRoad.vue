<template>
  <body class="home-background">
    <MyBar />
    <LeftSide />
    <RightMap />
    <div class="right-down" v-show="showRightDown">
      <div class="position-wrap">
        <div class="position">
          <i class="fa-solid fa-location-crosshairs"></i>
        </div>
      </div>
      <div class="plus-wrap">
        <div class="plus"><i class="fa-solid fa-plus"></i></div>
      </div>
      <div class="minus-wrap">
        <div class="minus"><i class="fa-solid fa-minus"></i></div>
      </div>
    </div>
  </body>
</template>

<script>
import MyBar from "../components/MyBar.vue";
import RightMap from "../components/RightMap.vue";
import LeftSide from "../components/LeftSide.vue";
import { mapActions } from "vuex";

export default {
  name: "FindBike",
  components: {
    MyBar,
    RightMap,
    LeftSide,
  },
  data() {
    return {
      showRightDown: this.$store.state.showMap,
    };
  },
  methods: {
    ...mapActions([
      "getTittle",
      "getCounty",
      "getCurrentComponent",
      "getShowAdvanced",
    ]),
  },
  watch: {
    "$store.state.showMap": function () {
      this.showRightDown = this.$store.state.showMap;
      // console.log("變了");
    },
  },
  beforeMount() {
    this.getTittle(this.$route.name);
    // console.log(this.$route.name);
    this.getCounty(this.$route.name);
    this.getCurrentComponent(this.$route.name);
    this.getShowAdvanced(this.$route.name);
  },
  //跳下一個頁面好像不會立刻unmounted元件，所以採用beforeUnmount
  beforeUnmount() {
    this.$store.commit("setCurrCity", "縣市");
    this.$store.commit("setReqCity", "");
    this.$store.dispatch("getSearchUrl", "");
    // console.log(this.$store.state.searchUrl);
    this.$store.commit("setCurrDistance", "距離");
    this.$store.commit("setCurrDirection", "方向");
    this.$store.commit("setSearchResult", []);
    this.$store.commit("setNowPage", 1);
    this.$store.commit("setSkipNumber", 0);
    this.$store.commit("setMapData", []);
    this.$store.commit("setTotalPage", 1);
    this.$store.commit("setIsActive", true);
    this.$store.commit("setWork", true);
    this.$store.commit("setLeft", true);
    this.$store.commit("setRight", true);
    this.$store.commit("setNowAdvancedPage", 1);
    this.$store.commit("setTotalAdvancedPage", 1);
    this.$store.commit("setSearch", false);
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  border: 0;
}
.right-down {
  position: fixed;
  top: calc(100vh - 30vh);
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
.plus-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}
.plus {
  color: #0e5978;
  background-color: white;
  border-radius: 50%;
  padding: 8px;
  font-size: large;
  cursor: pointer;
}
.minus-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}
.minus {
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
    top: calc(100vh - 20vh);
    left: calc(100vw - 8vw);
  }
}
/* iPhone XR */
@media (max-width: 576px) {
  .right-down {
    top: calc(100vh - 25vh);
    left: calc(100vw - 12vw);
  }
  .show-up {
    left: 36px;
    display: none;
  }
}
</style>
