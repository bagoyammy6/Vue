<template>
  <body class="home-background">
    <MyBar />
    <LeftSide />
    <RightMap />
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
    this.$store.commit("setAdd", false);
  },
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  border: 0;
}
</style>
