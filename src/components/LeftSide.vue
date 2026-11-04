<template>
  <div class="left">
    <div class="find-bike">
      <div class="color-block"></div>
      <div class="find-bike-word" @click="setShowFind">
        <div class="find-word">{{ findWord }}</div>
        <div class="find-symbol" v-show="showFind">
          <i class="fa-solid fa-angle-up"></i>
        </div>
        <div class="find-symbol" v-show="!showFind">
          <i class="fa-solid fa-angle-down"></i>
        </div>
      </div>
      <div class="find-bike-search" v-show="showFind">
        <div class="magnifier-findBike">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div class="search-word-findBike">
          <input
            name="keyword"
            type="text"
            :placeholder="placeholder"
            v-model="keyword"
          />
        </div>
      </div>
      <div class="find-bike-btn" v-show="showFind">
        <div class="county-findBike" @click.stop="setShowCounty">
          <div class="county-word-findBike">{{ currCity }}</div>
          <div class="angle-down-findBike" v-show="!showCounty">
            <i class="fa-solid fa-angle-down"></i>
          </div>
          <div class="angle-down-findBike" v-show="showCounty">
            <i class="fa-solid fa-angle-up"></i>
          </div>
        </div>
        <div class="select-county" v-show="showCounty" ref="selectCounty">
          <div
            class="each-county"
            v-for="(c, key) in county"
            :key="key"
            @click="changeCurrCity(c), setShowCounty(), setReqCity(key)"
          >
            {{ c }}
          </div>
        </div>
        <div
          class="search-btn-findBike"
          :class="{ changeSearch: press }"
          @click="search()"
        >
          <div class="search-btn-word-findBike">搜尋</div>
        </div>
      </div>
    </div>
    <AdvancedSelect v-if="showAdvanced" />
    <component :is="currentComponent"></component>
    <!-- <BikeCard /> -->
    <!-- <RoadCard /> -->
    <!-- <ViewCard /> -->
    <!-- <ViewDetail /> -->
  </div>
  <div class="page" v-show="searchPage">
    <div class="prev" :class="{ changePrev: isActive }" @click="minusPage">
      <i class="fa-solid fa-angle-left"></i>
    </div>
    <div class="page-number">
      <div class="now-page">{{ nowPage }}&nbsp;</div>
      <div class="total-page">/&nbsp;{{ totalPage }}</div>
    </div>
    <div class="foward" :class="{ changeFoward: work }" @click="addPage">
      <i class="fa-solid fa-angle-right"></i>
    </div>
  </div>
  <!-- AdvancedSelect搭配的page -->
  <div class="page" v-show="advancedPage">
    <div class="prev" :class="{ changePrev: left }" @click="minusAdvanced">
      <i class="fa-solid fa-angle-left"></i>
    </div>
    <div class="page-number">
      <div class="now-page">{{ nowAdvancedPage }}&nbsp;</div>
      <div class="total-page">/&nbsp;{{ totalAdvancedPage }}</div>
    </div>
    <div class="foward" :class="{ changeFoward: right }" @click="addAdvanced">
      <i class="fa-solid fa-angle-right"></i>
    </div>
  </div>
  <div class="phone-show" @click="changeShowMap">{{ mapOrWord }}</div>
</template>

<script>
import { mapState } from "vuex";
import BikeCard from "../components/BikeCard.vue";
import ViewDetail from "../components/ViewDetail.vue";
import ViewCard from "../components/ViewCard.vue";
import AdvancedSelect from "../components/AdvancedSelect.vue";
import RoadCard from "../components/RoadCard.vue";
import FoodDetail from "../components/FoodDetail.vue";
import { showApiError } from "../api/tdx";
import {
  getStations,
  getAvailability,
  getCyclingShapes,
  indexAvailability,
  paginate,
  totalPages,
} from "../api/queries";

export default {
  name: "LeftSide",
  components: {
    BikeCard,
    ViewDetail,
    ViewCard,
    AdvancedSelect,
    RoadCard,
    FoodDetail,
  },
  data() {
    return {
      showCounty: false,
      showFind: true,
      // 站點 UID -> 即時車輛資料 (不需要響應式，所以不放進 store)
      avaMap: new Map(),
    };
  },
  computed: {
    // 直接讀 store，不再複製一份到 data 再用 watch 同步
    ...mapState({
      findWord: "tittle",
      county: "county",
      currCity: "currCity",
      showMap: "showMap",
      currentComponent: "currentComponent",
      nowPage: "nowPage",
      isActive: "isActive",
      work: "work",
      totalPage: "totalPage",
      searchPage: "searchPage",
      advancedPage: "advancedPage",
      nowAdvancedPage: "nowAdvancedPage",
      totalAdvancedPage: "totalAdvancedPage",
      left: "left",
      right: "right",
      press: "press",
      showAdvanced: "showAdvanced",
    }),
    keyword: {
      get() {
        return this.$store.state.keyword;
      },
      set(value) {
        this.$store.commit("setKeyword", value);
        this.$store.commit("setPress", false);
      },
    },
    placeholder() {
      return this.isBikePage ? "請輸入車站名稱" : "請輸入車道名稱";
    },
    isBikePage() {
      return this.$route.name === "findbike" || this.$route.name === "home";
    },
    mapOrWord() {
      return this.showMap ? "顯示列表" : "顯示地圖";
    },
  },
  methods: {
    setShowCounty() {
      this.showCounty = !this.showCounty;
    },
    setShowFind() {
      this.showFind = !this.showFind;
    },
    changeCurrCity(value) {
      this.$store.commit("setCurrCity", value);
    },
    setReqCity(value) {
      this.$store.commit("setReqCity", value);
      this.$store.commit("setNowPage", 1);
      this.$store.commit("setWork", true);
      this.$store.commit("setSearchFirst", false);
      this.$store.commit("setCurrDistance", "距離");
      this.$store.commit("setCurrDirection", "方向");
      this.$store.commit("setAdd", false);
      this.$store.commit("setPress", false);
    },
    scrollToTop() {
      const head = document.querySelector(".scroll");
      if (head) head.scrollTop = 0;
    },
    /**
     * 搜尋：每個縣市只抓一次完整清單 (有快取)，關鍵字與分頁都在前端處理。
     */
    async search() {
      const city = this.$store.state.reqCity;
      if (!city) {
        alert("請選擇縣市");
        return;
      }
      const store = this.$store;
      store.commit("setCurrDistance", "距離");
      store.commit("setCurrDirection", "方向");
      store.commit("setAdd", false);
      store.commit("setSearchPage", true);
      store.commit("setAdvancedPage", false);
      store.commit("setSearchFirst", true);
      store.commit(
        "setCurrentComponent",
        this.isBikePage ? "BikeCard" : "RoadCard"
      );
      if (!this.isBikePage) store.commit("setShowAdvanced", true);
      store.commit("setPress", true);
      store.commit("setIsLoading", true);
      this.scrollToTop();

      const keyword = store.state.keyword.trim();
      try {
        let list;
        if (this.isBikePage) {
          const [stations, ava] = await Promise.all([
            getStations(city),
            getAvailability(city),
          ]);
          this.avaMap = indexAvailability(ava);
          list = keyword
            ? stations.filter((d) => d.StationName?.Zh_tw?.includes(keyword))
            : stations;
          // 地圖需要先拿到即時資料再拿站點資料 (RightMap 監聽 mapData)
          store.commit("setMapAva", ava);
        } else {
          const roads = await getCyclingShapes(city);
          list = keyword
            ? roads.filter((d) => d.RouteName?.includes(keyword))
            : roads;
        }

        store.commit("setFullList", list);
        if (list.length === 0) {
          store.commit("setSearchResult", []);
          store.commit("setAvailable", []);
          store.commit("setTotalPage", 1);
          this.showPage(1);
          store.commit("setIsLoading", false);
          alert("查無資料");
          return;
        }
        store.commit("setMapData", list);
        this.showPage(1);
      } catch (err) {
        store.commit("setIsLoading", false);
        store.commit("setPress", false);
        showApiError(err);
      }
    },
    showPage(page) {
      const store = this.$store;
      const list = store.state.fullList;
      const total = totalPages(list);
      const items = paginate(list, page);
      store.commit("setNowPage", page);
      store.commit("setTotalPage", total);
      store.commit("setSearchResult", items);
      if (this.isBikePage) {
        store.commit(
          "setAvailable",
          items.map((s) => this.avaMap.get(s.StationUID))
        );
      }
      // isActive = 上一頁停用、work = 下一頁停用
      store.commit("setIsActive", page <= 1);
      store.commit("setWork", page >= total);
      this.scrollToTop();
    },
    changeShowMap() {
      this.$store.commit("setShowMap", !this.showMap);
    },
    minusPage() {
      if (this.nowPage > 1) this.showPage(this.nowPage - 1);
    },
    addPage() {
      if (this.nowPage < this.totalPage) this.showPage(this.nowPage + 1);
    },
    showAdvancedPage(page) {
      const store = this.$store;
      const list = store.state.advancedList;
      const total = totalPages(list);
      store.commit("setNowAdvancedPage", page);
      store.commit("setTotalAdvancedPage", total);
      store.commit("setSearchResult", paginate(list, page));
      store.commit("setLeft", page <= 1);
      store.commit("setRight", page >= total);
      this.scrollToTop();
    },
    minusAdvanced() {
      if (this.nowAdvancedPage > 1)
        this.showAdvancedPage(this.nowAdvancedPage - 1);
    },
    addAdvanced() {
      if (this.nowAdvancedPage < this.totalAdvancedPage)
        this.showAdvancedPage(this.nowAdvancedPage + 1);
    },
    onDocumentClick(e) {
      if (
        this.$refs.selectCounty &&
        !this.$refs.selectCounty.contains(e.target)
      ) {
        this.showCounty = false;
      }
    },
  },
  watch: {
    // 首頁 / 導覽列按下搜尋時會把 store.search 設成 true
    "$store.state.search"(val) {
      if (val) {
        this.$store.commit("setSearch", false);
        this.search();
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.onDocumentClick);
    if (this.$store.state.search) {
      this.$store.commit("setSearch", false);
      this.search();
    }
  },
  // 元件卸載時要移除監聽，否則每次進出頁面都會多一個 listener (記憶體洩漏)
  beforeUnmount() {
    document.removeEventListener("click", this.onDocumentClick);
  },
};
</script>

<style scoped>
.left {
  position: fixed;
  top: 80px;
  height: calc(100vh - 142px);
  width: 384px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 18px;
}
.find-bike {
  width: 348px;
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(38, 38, 38, 0.25);
  border-radius: 8px;
}
.color-block {
  width: 100%;
  height: 24px;
  background-color: #0e5978;
  border-radius: 8px 8px 0 0;
}
.find-bike-word {
  display: flex;
  align-items: center;
}
.find-word {
  font-weight: 700;
  font-size: 32px;
  color: #0a4259;
  padding: 5px 20px;
}
.find-symbol {
  color: #0a4259;
  cursor: pointer;
}
.find-bike-search {
  width: 300px;
  height: 20px;
  display: flex;
  align-items: center;
  background: #f6f6f6;
  border: 1px solid #0e5978;
  border-radius: 4px;
  padding: 8px 4px 8px 8px;
  margin-left: 20px;
  margin-top: 5px;
}
.magnifier-findBike {
  color: #0e5978;
}
.search-word-findBike {
  padding-left: 5px;
  color: #a5a5a5;
  border-left: 1px solid #a5a5a5;
  margin-left: 5px;
}
.search-word-findBike > input {
  border: none;
  background-color: #f6f6f6;
  width: 250px;
  height: 30px;
  color: #0e5978;
  font-size: 15px;
}
.search-word-findBike > input:focus {
  outline: none;
}
.find-bike-btn {
  width: auto;
  height: auto;
  display: flex;
  margin-bottom: 20px;
}
.county-findBike {
  border: 1px solid #0e5978;
  background-color: white;
  border-radius: 4px;
  width: 135px;
  height: 20px;
  padding: 8px 8px 8px 8px;
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-top: 10px;
  cursor: pointer;
  position: relative;
}
.county-findBike:hover {
  background-color: #f0f9fc;
}
.county-word-findBike {
  padding: 0 30px 0 36px;
  color: #0e5978;
}
.angle-down-findBike {
  color: #0e5978;
}
.select-county {
  position: absolute;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #0e5978;
  width: 151px;
  height: 106px;
  margin-top: 50px;
  margin-left: 20px;
  cursor: pointer;
  overflow-y: scroll;
}
.each-county {
  height: 20px;
  text-align: center;
  line-height: 20px;
  color: #0a4259;
  font-weight: 400;
  font-size: 16px;
  padding: 8px;
}
.each-county:hover {
  background-color: #f0f9fc;
}
.search-btn-findBike {
  border: 1px solid #0e5978;
  background-color: #0e5978;
  border-radius: 4px;
  width: 135px;
  height: 20px;
  padding: 8px 8px 8px 8px;
  margin-left: 8px;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  cursor: pointer;
}
.search-btn-findBike:hover {
  background-color: #12749d;
}
.search-btn-word-findBike {
  color: white;
}
.page {
  position: fixed;
  top: calc(100vh - 51px);
  height: 51px;
  width: 384px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-number {
  width: 54px;
  height: 30px;
  background: #f6f6f6;
  border: 1px solid #a5a5a5;
  border-radius: 4px;
  margin: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 8px;
}
.total-page {
  color: #a5a5a5;
}
.prev {
  color: #7b7b7b;
  cursor: pointer;
}
.foward {
  color: #7b7b7b;
  cursor: pointer;
}
.phone-show {
  display: none;
}
.changePrev {
  color: #e5e5e5;
  pointer-events: none;
  cursor: default;
}
.changeFoward {
  color: #e5e5e5;
  pointer-events: none;
  cursor: default;
}
.changeSearch {
  pointer-events: none;
}
/* iPhone XR */
@media (max-width: 576px) {
  .left {
    top: 56px;
    height: calc(100vh - 115px);
    width: 100vw;
    overflow-y: scroll;
    margin-top: 8px;
    padding-top: 0px;
  }
  .left::-webkit-scrollbar {
    width: 0px;
  }
  .find-bike {
    width: 100vw;
    border-radius: 0;
    top: 0px;
    box-shadow: 0px 4px 4px rgb(38 38 38 / 25%);
    position: sticky;
    display: none;
  }
  .find-bike-search {
    margin-left: auto;
    margin-right: auto;
  }
  .find-bike-btn {
    justify-content: center;
  }
  .county-findBike {
    margin-left: 0px;
  }
  .county-word-findBike {
    padding: 0 32px 0 43px;
  }
  .select-county {
    margin-left: -161px;
  }
  .color-block {
    display: none;
  }
  .find-bike-word {
    display: none;
  }
  .page {
    width: 100vw;
  }
  .phone-show {
    display: block;
    position: fixed;
    top: calc(100vh - 43px);
    right: 5%;
    width: 88px;
    height: 32px;
    background: #f0f9fc;
    border: 1px solid #0a4259;
    border-radius: 4px;
    font-weight: 700;
    font-size: 16px;
    color: #0a4259;
    text-align: center;
    line-height: 32px;
  }
}
</style>
