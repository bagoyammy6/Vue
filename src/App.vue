<template>
  <div>
    <loading v-model:active="isLoading">
      <div class="loadingio-spinner-spin-vg2tdnqrr9m">
        <div class="ldio-ojy1c5xoqjm">
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
          <div><div></div></div>
        </div>
      </div>
    </loading>
  </div>
  <router-view />
</template>

<script>
import Loading from "vue-loading-overlay";

export default {
  name: "App",
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: this.$store.state.isLoading,
    };
  },
  watch: {
    "$store.state.isLoading": function () {
      this.isLoading = this.$store.state.isLoading;
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  border: 0;
}
.pop {
  width: 364px;
  box-shadow: 0 3px 14px rgb(0 0 0 / 40%);
  border: 1px solid #0e5978;
  border-radius: 12px;
}
.show-up {
  height: fit-content;
  width: 324px;
  background: #ffffff;
  font-size: 16px;
  line-height: 1.4;
}
.show-name {
  font-weight: 700;
  font-size: 20px;
  padding: 0px 16px 3px 16px;
}
.show-address {
  display: flex;
  align-items: center;
  padding: 0px 16px 8px 16px;
}
.show-address-img {
  color: #0e5978;
  font-size: 20px;
}
.show-address-word {
  color: #484848;
  font-size: 14px;
  padding-left: 8px;
}
.show-time {
  display: flex;
  align-items: center;
  padding: 0px 16px 8px 16px;
}
.show-time-img {
  color: #0e5978;
  font-size: 20px;
}
.show-time-word {
  color: #484848;
  font-size: 14px;
  padding-left: 6px;
}
.show-state {
  display: flex;
  padding: 0px 16px 8px 16px;
}
.show-state-run {
  background: #f0f9fc;
  border: 1px solid #0a4259;
  border-radius: 4px;
  padding: 4px 8px;
  color: #0e5978;
}
.show-state-bike {
  background: #f0f9fc;
  border: 1px solid #0a4259;
  border-radius: 4px;
  padding: 4px 8px;
  color: #0e5978;
  margin-left: 8px;
}
.show-number {
  display: flex;
  justify-content: space-between;
  padding: 0px 16px 3px 16px;
}
.available-bike {
  background: #ffffff;
  border: 1px solid #0e5978;
  border-radius: 4px;
  padding: 4px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 105px;
  height: 60px;
}
.available-empty {
  background: #ffffff;
  border: 1px solid #0e5978;
  border-radius: 4px;
  padding: 4px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 105px;
  height: 60px;
}
.available-bike-word {
  color: #0e5978;
  font-weight: 700;
  font-size: 16px;
}
.available-bike-number {
  color: #262626;
  font-weight: 700;
  font-size: 28px;
}
.available-empty-word {
  color: #0e5978;
  font-weight: 700;
  font-size: 16px;
}
.available-empty-number {
  color: #262626;
  font-weight: 700;
  font-size: 28px;
}
.start-word {
  color: #0e5978;
  font-weight: 700;
  font-size: 15px;
}
.length {
  display: flex;
  align-items: center;
  margin-left: 30px;
}
.locate {
  font-weight: 700;
  font-size: 20px;
  box-shadow: 0 3px 14px rgb(0 0 0 / 40%);
  border: 1px solid #0e5978;
  border-radius: 12px;
}
.highlight {
  color: #ff6900;
}
</style>

<style type="text/css">
/* loading樣式 */
@keyframes ldio-ojy1c5xoqjm {
  0% {
    opacity: 1;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1.5, 1.5);
  }
  100% {
    opacity: 0;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1, 1);
  }
}
.ldio-ojy1c5xoqjm div > div {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0e5978;
  animation: ldio-ojy1c5xoqjm 1s linear infinite;
}
.ldio-ojy1c5xoqjm div:nth-child(1) > div {
  left: 150px;
  top: 90px;
  animation-delay: -0.875s;
}
.ldio-ojy1c5xoqjm > div:nth-child(1) {
  transform: rotate(0deg);
  transform-origin: 160px 100px;
}
.ldio-ojy1c5xoqjm div:nth-child(2) > div {
  left: 132px;
  top: 132px;
  animation-delay: -0.75s;
}
.ldio-ojy1c5xoqjm > div:nth-child(2) {
  transform: rotate(45deg);
  transform-origin: 142px 142px;
}
.ldio-ojy1c5xoqjm div:nth-child(3) > div {
  left: 90px;
  top: 150px;
  animation-delay: -0.625s;
}
.ldio-ojy1c5xoqjm > div:nth-child(3) {
  transform: rotate(90deg);
  transform-origin: 100px 160px;
}
.ldio-ojy1c5xoqjm div:nth-child(4) > div {
  left: 48px;
  top: 132px;
  animation-delay: -0.5s;
}
.ldio-ojy1c5xoqjm > div:nth-child(4) {
  transform: rotate(135deg);
  transform-origin: 58px 142px;
}
.ldio-ojy1c5xoqjm div:nth-child(5) > div {
  left: 30px;
  top: 90px;
  animation-delay: -0.375s;
}
.ldio-ojy1c5xoqjm > div:nth-child(5) {
  transform: rotate(180deg);
  transform-origin: 40px 100px;
}
.ldio-ojy1c5xoqjm div:nth-child(6) > div {
  left: 48px;
  top: 48px;
  animation-delay: -0.25s;
}
.ldio-ojy1c5xoqjm > div:nth-child(6) {
  transform: rotate(225deg);
  transform-origin: 58px 58px;
}
.ldio-ojy1c5xoqjm div:nth-child(7) > div {
  left: 90px;
  top: 30px;
  animation-delay: -0.125s;
}
.ldio-ojy1c5xoqjm > div:nth-child(7) {
  transform: rotate(270deg);
  transform-origin: 100px 40px;
}
.ldio-ojy1c5xoqjm div:nth-child(8) > div {
  left: 132px;
  top: 48px;
  animation-delay: 0s;
}
.ldio-ojy1c5xoqjm > div:nth-child(8) {
  transform: rotate(315deg);
  transform-origin: 142px 58px;
}
.loadingio-spinner-spin-vg2tdnqrr9m {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: none;
}
.ldio-ojy1c5xoqjm {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-ojy1c5xoqjm div {
  box-sizing: content-box;
}
/* generated by https://loading.io/ */
</style>
