<template>
  <div class="divid first-line"></div>
  <div class="back">
    <div class="back-img" @click="back">
      <i class="fa-solid fa-angle-left"></i>
    </div>
    <div class="back-word" @click="back">返回</div>
  </div>
  <div class="divid"></div>
  <div class="scroll">
    <div class="view-point">
      <div class="view-point-img" v-if="!goView.Picture.PictureUrl1">
        <img
          src="../assets/no_picture_big.png"
          width="332"
          height="237"
          alt="沒有圖片"
        />
      </div>
      <div class="view-point-img" v-if="!!goView.Picture.PictureUrl1">
        <img
          :src="goView.Picture.PictureUrl1"
          width="332"
          height="237"
          :alt="goView.Picture.PictureDescription1"
        />
      </div>
      <div class="view-point-title">{{ goView.ScenicSpotName }}</div>
      <div class="view-point-btn">景點</div>
      <div class="view-point-address">
        <div class="view-point-address-img">
          <i class="fa-solid fa-location-dot"></i>
        </div>
        <div class="view-point-address-word">
          {{ goView.Address }}
        </div>
      </div>
      <div class="view-point-phone">
        <div class="view-point-phone-img">
          <i class="fa-solid fa-phone"></i>
        </div>
        <div class="view-point-phone-number">{{ goView.Phone }}</div>
      </div>
      <div class="view-point-runtime">
        <div class="view-point-runtime-img">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="view-point-runtime-word">
          {{ goView.OpenTime }}
        </div>
      </div>
      <div class="view-point-notice">
        <div class="view-point-notice-img">
          <i class="fa-solid fa-bell"></i>
        </div>
        <div class="view-point-notice-word">
          {{ goView.DescriptionDetail }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewDetail",
  data() {
    return {
      goView: this.$store.state.goView,
    };
  },
  methods: {
    back() {
      this.$store.commit("setCurrentComponent", "ViewCard");
      this.$store.commit("setShowAdvanced", false);
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
.view-point {
  width: 348px;
  height: auto;
  background: #f6f6f6;
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
}
.view-point-title {
  font-weight: 700;
  font-size: 20px;
  margin: 8px 0px 16px 0px;
}
.view-point-btn {
  width: 72px;
  height: 29px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #12749d;
  border-radius: 4px;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  color: #12749d;
  line-height: 29px;
}
.view-point-address {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.view-point-address-img {
  color: #0e5978;
}
.view-point-address-word {
  font-weight: 400;
  font-size: 14px;
  color: #484848;
  padding-left: 8px;
}
.view-point-phone {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.view-point-phone-img {
  color: #0e5978;
}
.view-point-phone-number {
  font-weight: 400;
  font-size: 14px;
  color: #484848;
  padding-left: 8px;
}
.view-point-runtime {
  display: flex;
  margin-bottom: 8px;
}
.view-point-runtime-img {
  color: #0e5978;
}
.view-point-runtime-word {
  font-weight: 400;
  font-size: 14px;
  color: #484848;
  padding-left: 8px;
}
.view-point-notice {
  display: flex;
  margin-bottom: 8px;
}
.view-point-notice-img {
  color: #0e5978;
}
.view-point-notice-word {
  font-weight: 400;
  font-size: 14px;
  color: #484848;
  padding-left: 8px;
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
