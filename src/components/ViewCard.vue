<template>
  <div class="divid first-line"></div>
  <div class="back">
    <div class="back-img" @click="back">
      <i class="fa-solid fa-angle-left"></i>
    </div>
    <div class="back-word" @click="back(), reversePage()">返回</div>
  </div>
  <div class="divid"></div>
  <div class="scroll">
    <div
      class="view-card-results"
      :key="idx"
      v-for="(d, idx) in rangeView"
      @click="goView(d)"
      @dblclick="viewChangeCurrentComponent"
    >
      <div class="view-card-results-img-wrap">
        <div class="view-card-results-img" v-if="!d.Picture.PictureUrl1">
          <img
            src="../assets/no_picture.png"
            width="96"
            height="96"
            alt="沒有圖片"
          />
        </div>
        <div class="view-card-results-img" v-if="!!d.Picture.PictureUrl1">
          <img
            :src="d.Picture.PictureUrl1"
            width="96"
            height="96"
            :alt="d.Picture.PictureDescription1"
          />
        </div>
      </div>
      <div class="view-card-results-word">
        <div class="view-card-results-word-title">{{ d.ScenicSpotName }}</div>
        <div class="view-card-results-word-location">
          <div class="view-card-results-word-location-img">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div class="view-card-results-word-location-word">{{ d.City }}</div>
        </div>
        <div class="view-card-results-word-btn">
          <div class="view-card-results-word-btn-word">景點</div>
          <div class="view-card-results-word-btn-arrow">
            <i class="fa-solid fa-angle-right"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 餐飲 -->
    <div
      class="view-card-results"
      :key="idx"
      v-for="(d, idx) in rangeFood"
      @click="goFood(d)"
      @dblclick="foodChangeCurrentComponent"
    >
      <div class="view-card-results-img-wrap">
        <div class="view-card-results-img" v-if="!d.Picture.PictureUrl1">
          <img
            src="../assets/no_picture.png"
            width="96"
            height="96"
            alt="沒有圖片"
          />
        </div>
        <div class="view-card-results-img" v-if="!!d.Picture.PictureUrl1">
          <img
            :src="d.Picture.PictureUrl1"
            width="96"
            height="96"
            :alt="d.Picture.PictureDescription1"
          />
        </div>
      </div>
      <div class="view-card-results-word">
        <div class="view-card-results-word-title">{{ d.RestaurantName }}</div>
        <div class="view-card-results-word-location">
          <div class="view-card-results-word-location-img">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div class="view-card-results-word-location-word">{{ d.City }}</div>
        </div>
        <div class="view-card-results-word-btn">
          <div class="view-card-results-word-btn-word">餐廳</div>
          <div class="view-card-results-word-btn-arrow">
            <i class="fa-solid fa-angle-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewCard",
  data() {
    return {
      rangeView: this.$store.state.rangeView,
      rangeFood: this.$store.state.rangeFood,
    };
  },
  methods: {
    back() {
      this.$store.commit("setCurrentComponent", "RoadCard");
      this.$store.commit("setShowAdvanced", true);
    },
    viewChangeCurrentComponent() {
      this.$store.commit("setCurrentComponent", "ViewDetail");
      // this.$store.commit("setShowAdvanced", false);
    },
    foodChangeCurrentComponent() {
      this.$store.commit("setCurrentComponent", "FoodDetail");
      // this.$store.commit("setShowAdvanced", false);
    },
    reversePage() {
      if (this.$store.state.nowPage != 1) {
        this.$store.commit("setIsActive", false);
      }
      if (this.$store.state.nowAdvancedPage != 1) {
        this.$store.commit("setLeft", false);
      }
      if (this.$store.state.totalPage != this.$store.state.nowPage) {
        // console.log(this.$store.state.totalPage);
        // console.log(this.$store.state.nowPage);
        this.$store.commit("setWork", false);
      }
      if (
        this.$store.state.totalAdvancedPage != this.$store.state.nowAdvancedPage
      ) {
        this.$store.commit("setRight", false);
      }
    },
    goView(d) {
      // console.log(d);
      this.$store.commit("setGoView", d);
    },
    goFood(d) {
      // console.log(d);
      this.$store.commit("setGoFood", d);
    },
  },
  watch: {
    "$store.state.rangeView": function () {
      this.rangeView = this.$store.state.rangeView;
      // console.log(this.rangeView);
    },
    "$store.state.rangeFood": function () {
      this.rangeFood = this.$store.state.rangeFood;
      // console.log(this.rangeFood);
    },
  },
  mounted: function () {
    this.$store.commit("setIsLoading", false);
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
.back {
  width: 348px;
  box-sizing: border-box;
  padding: 0px 8px;
  display: flex;
}
.back-img {
  color: #0e5978;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
}
.back-word {
  color: #0e5978;
  font-weight: 700;
  font-size: 16px;
  padding-left: 10px;
  cursor: pointer;
}
.scroll {
  overflow-y: scroll;
}
.view-card-results {
  width: 348px;
  height: auto;
  background: #f6f6f6;
  border-radius: 8px;
  display: flex;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 16px;
  cursor: pointer;
}
.view-card-results:hover {
  background: #f1f1f1;
}
.view-card-results-img-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
.view-card-results-word {
  padding: 14px 0px 0px 8px;
}
.view-card-results-word-title {
  font-weight: 700;
  font-size: 20px;
  padding-bottom: 8px;
}
.view-card-results-word-location {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
}
.view-card-results-word-location-img {
  color: #0e5978;
}
.view-card-results-word-location-word {
  font-weight: 400;
  font-size: 14px;
  color: #484848;
  padding-left: 8px;
}
.view-card-results-word-btn {
  width: 215px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.view-card-results-word-btn-word {
  background: #ffffff;
  width: 72px;
  height: 29px;
  padding: 4px 8px;
  border: 1px solid #12749d;
  border-radius: 4px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 14px;
  color: #12749d;
  text-align: center;
}
.view-card-results-word-btn-arrow {
  color: #0e5978;
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
