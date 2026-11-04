<template>
  <div class="divid first-line"></div>
  <div class="advanced-select">
    <div class="advanced-select-word" @click="setShowAdvanced">
      <div class="select-title">進階篩選</div>
      <div class="select-symbol" v-show="showAdvanced">
        <i class="fa-solid fa-angle-up"></i>
      </div>
      <div class="select-symbol" v-show="!showAdvanced">
        <i class="fa-solid fa-angle-down"></i>
      </div>
    </div>
    <div class="advanced-select-btn" v-show="showAdvanced">
      <div class="btn-range" @click.stop="setShowRange">
        <div class="btn-range-word" :class="{ btnMobile: add }">
          {{ currDistance }}
        </div>
        <div class="btn-range-symbol" v-show="!showRange">
          <i class="fa-solid fa-angle-down"></i>
        </div>
        <div class="btn-range-symbol" v-show="showRange">
          <i class="fa-solid fa-angle-up"></i>
        </div>
      </div>
      <div
        class="select-range"
        v-show="showRange"
        @click="setShowRange()"
        ref="selectRange"
      >
        <div
          class="range-option"
          v-for="(d, key) in distance"
          :key="key"
          @click="
            changeCurrDistance(d),
              changeSearchResultDistance(key),
              changeBtnMobile()
          "
        >
          {{ d }}
        </div>
      </div>
      <div class="btn-direction" @click.stop="setShowDirection">
        <div class="btn-direction-word">{{ currDirection }}</div>
        <div class="btn-direction-symbol" v-show="!showDirection">
          <i class="fa-solid fa-angle-down"></i>
        </div>
        <div class="btn-direction-symbol" v-show="showDirection">
          <i class="fa-solid fa-angle-up"></i>
        </div>
      </div>
      <div
        class="select-direction"
        v-show="showDirection"
        @click="setShowDirection"
        ref="selectDirection"
      >
        <div
          class="direction-option"
          v-for="(d, key) in direction"
          :key="key"
          @click="changeCurrDirection(d), changeSearchResultDirection(key)"
        >
          {{ d }}
        </div>
      </div>
    </div>
  </div>
  <div class="divid"></div>
</template>

<script>
import { mapState } from "vuex";
import { ROAD_FILTERS, paginate, totalPages } from "../api/queries";

export default {
  name: "AdvancedSelect",
  data() {
    return {
      showRange: false,
      showDirection: false,
      showAdvanced: true,
      distance: { 1: "近", 2: "中", 3: "遠" },
      direction: { 1: "雙向", 2: "單向" },
    };
  },
  computed: {
    ...mapState(["currDistance", "currDirection", "add"]),
  },
  methods: {
    canFilter() {
      if (!this.$store.state.reqCity) {
        alert("請先選擇縣市");
        return false;
      }
      if (!this.$store.state.searchFirst) {
        alert("請先搜尋");
        return false;
      }
      return true;
    },
    setShowRange() {
      if (this.canFilter()) this.showRange = !this.showRange;
    },
    setShowDirection() {
      if (this.canFilter()) this.showDirection = !this.showDirection;
    },
    setShowAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },
    changeCurrDistance(value) {
      this.$store.commit("setCurrDistance", value);
    },
    changeCurrDirection(value) {
      this.$store.commit("setCurrDirection", value);
    },
    changeBtnMobile() {
      this.$store.commit("setAdd", true);
    },
    /**
     * 套用篩選：直接篩選已下載的完整清單，不需要再打 API。
     * code: 1 近 / 2 中 / 3 遠 / 4 雙向 / 5 單向
     */
    applyFilter(code) {
      const store = this.$store;
      const head = document.querySelector(".scroll");
      if (head) head.scrollTop = 0;

      const list = store.state.fullList.filter(ROAD_FILTERS[code]);
      store.commit("setAdvUrl", code);
      store.commit("setAdvancedList", list);
      store.commit("setSearchPage", false);
      store.commit("setAdvancedPage", true);
      store.commit("setPress", false);

      const total = totalPages(list);
      store.commit("setNowAdvancedPage", 1);
      store.commit("setTotalAdvancedPage", total);
      store.commit("setSearchResult", paginate(list, 1));
      store.commit("setLeft", true);
      store.commit("setRight", total <= 1);
      if (list.length === 0) alert("查無資料");
    },
    changeSearchResultDistance(key) {
      this.$store.commit("setCurrDirection", "方向");
      this.applyFilter(Number(key));
    },
    changeSearchResultDirection(key) {
      this.$store.commit("setCurrDistance", "距離");
      this.$store.commit("setAdd", false);
      this.applyFilter(Number(key) + 3);
    },
    onDocumentClick(e) {
      if (
        this.$refs.selectRange &&
        !this.$refs.selectRange.contains(e.target)
      ) {
        this.showRange = false;
      }
      if (
        this.$refs.selectDirection &&
        !this.$refs.selectDirection.contains(e.target)
      ) {
        this.showDirection = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.onDocumentClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onDocumentClick);
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
.advanced-select {
  width: 348px;
  height: auto;
  padding: 0px 24px;
  box-sizing: border-box;
}
.advanced-select-word {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.select-title {
  font-weight: 700;
  font-size: 20px;
  color: #0a4259;
}
.select-symbol {
  color: #0a4259;
  margin-left: 10px;
  cursor: pointer;
}
.advanced-select-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.btn-range {
  border: 1px solid #0e5978;
  border-radius: 4px;
  width: 144px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  color: #0e5978;
  cursor: pointer;
  box-sizing: border-box;
}
.btn-range:hover {
  background-color: #f0f9fc;
}
.btn-range-word {
  padding-left: 55px;
}
.btn-range-symbol {
  padding-right: 10px;
}
.select-range {
  position: absolute;
  margin-top: 120px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #0e5978;
  width: 144px;
  height: 77px;
  cursor: pointer;
  box-sizing: border-box;
  color: #0e5978;
}
.range-option {
  text-align: center;
  height: 25px;
}
.range-option:hover {
  background-color: #f0f9fc;
}
.btn-direction {
  border: 1px solid #0e5978;
  border-radius: 4px;
  width: 144px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  color: #0e5978;
  cursor: pointer;
  box-sizing: border-box;
}
.btn-direction:hover {
  background-color: #f0f9fc;
}
.btn-direction-word {
  padding-left: 55px;
}
.btn-direction-symbol {
  padding-right: 10px;
}
.select-direction {
  position: absolute;
  margin-top: 95px;
  margin-left: 156px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #0e5978;
  width: 144px;
  height: 52px;
  cursor: pointer;
  box-sizing: border-box;
  color: #0e5978;
}
.direction-option {
  text-align: center;
  height: 25px;
}
.direction-option:hover {
  background-color: #f0f9fc;
}
.btnMobile {
  padding-left: 63px;
}
/* iPhone XR */
@media (max-width: 576px) {
  .advanced-select {
    margin-top: 18px;
  }
  .btn-range-word {
    padding-left: 55px;
  }
  .btn-direction-word {
    padding-left: 54px;
  }
}
</style>
