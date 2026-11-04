import { markRaw } from "vue";
import { createStore } from "vuex";

export default createStore({
  state: {
    tittle: "",
    county: {},
    currCity: "縣市",
    reqCity: "",
    currDistance: "距離",
    currDirection: "方向",
    searchResult: [],
    available: [],
    showMap: true,
    keyword: "",
    currentComponent: "",
    showAdvanced: true,
    nowPage: 1,
    searchPage: true,
    advancedPage: false,
    nowAdvancedPage: 1,
    totalAdvancedPage: 1,
    left: true,
    right: true,
    advUrl: "",
    stationCoord: {},
    stationAva: {},
    searchCoord: [],
    mapData: [],
    mapAva: [],
    searchFirst: false,
    roadCoord: {},
    rangeView: [],
    rangeFood: [],
    isActive: true,
    work: true,
    totalPage: 1,
    press: false,
    goView: {},
    goFood: {},
    search: false,
    add: false,
    isLoading: false,
    // 目前搜尋結果的完整清單 (已套用關鍵字)，分頁在前端處理
    fullList: [],
    // 進階篩選後的完整清單
    advancedList: [],
  },
  mutations: {
    setTittle(state, payload) {
      state.tittle = payload;
    },
    setCounty(state, payload) {
      state.county = payload;
    },
    setCurrCity(state, payload) {
      state.currCity = payload;
    },
    setReqCity(state, payload) {
      state.reqCity = payload;
    },
    setCurrDistance(state, payload) {
      state.currDistance = payload;
    },
    setCurrDirection(state, payload) {
      state.currDirection = payload;
    },
    setSearchResult(state, payload) {
      state.searchResult = payload;
    },
    setAvailable(state, payload) {
      state.available = payload;
    },
    setShowMap(state, payload) {
      state.showMap = payload;
    },
    setKeyword(state, payload) {
      state.keyword = payload;
    },
    setCurrentComponent(state, payload) {
      state.currentComponent = payload;
    },
    setShowAdvanced(state, payload) {
      state.showAdvanced = payload;
    },
    setNowPage(state, payload) {
      state.nowPage = payload;
    },
    setSearchPage(state, payload) {
      state.searchPage = payload;
    },
    setAdvancedPage(state, payload) {
      state.advancedPage = payload;
    },
    setNowAdvancedPage(state, payload) {
      state.nowAdvancedPage = payload;
    },
    setTotalAdvancedPage(state, payload) {
      state.totalAdvancedPage = payload;
    },
    setLeft(state, payload) {
      state.left = payload;
    },
    setRight(state, payload) {
      state.right = payload;
    },
    setAdvUrl(state, payload) {
      state.advUrl = payload;
    },
    setStationCoord(state, payload) {
      state.stationCoord = payload;
    },
    setStationAva(state, payload) {
      state.stationAva = payload;
    },
    setSearchCoord(state, payload) {
      state.searchCoord = payload;
    },
    setMapData(state, payload) {
      state.mapData = payload;
    },
    setMapAva(state, payload) {
      state.mapAva = payload;
    },
    setSearchFirst(state, payload) {
      state.searchFirst = payload;
    },
    setRoadCoord(state, payload) {
      state.roadCoord = payload;
    },
    setRangeView(state, payload) {
      state.rangeView = payload;
    },
    setRangeFood(state, payload) {
      state.rangeFood = payload;
    },
    setIsActive(state, payload) {
      state.isActive = payload;
    },
    setWork(state, payload) {
      state.work = payload;
    },
    setTotalPage(state, payload) {
      state.totalPage = payload;
    },
    setPress(state, payload) {
      state.press = payload;
    },
    setGoView(state, payload) {
      state.goView = payload;
    },
    setGoFood(state, payload) {
      state.goFood = payload;
    },
    setSearch(state, payload) {
      state.search = payload;
    },
    setAdd(state, payload) {
      state.add = payload;
    },
    setIsLoading(state, payload) {
      state.isLoading = payload;
    },
    // 大型清單用 markRaw 避免 Vue 對上千筆資料做深層響應式追蹤
    setFullList(state, payload) {
      state.fullList = markRaw(payload || []);
    },
    setAdvancedList(state, payload) {
      state.advancedList = markRaw(payload || []);
    },
  },
  actions: {
    getTittle(context, payload) {
      let a = payload;
      if (a == "findbike") {
        context.commit("setTittle", "尋找單車");
      }
      if (a == "findroad") {
        context.commit("setTittle", "尋找車道");
      }
    },
    getCounty(context, payload) {
      let a = payload;
      if (a == "findbike" || a == "home") {
        context.commit("setCounty", {
          Taipei: "臺北市",
          Taoyuan: "桃園市",
          NewTaipei: "新北市",
          Hsinchu: "新竹市",
          MiaoliCounty: "苗栗縣",
          Taichung: "臺中市",
          Chiayi: "嘉義市",
          Tainan: "臺南市",
          Kaohsiung: "高雄市",
          PingtungCounty: "屏東縣",
          KinmenCounty: "金門縣",
        });
      }
      if (a == "findroad") {
        context.commit("setCounty", {
          Keelung: "基隆市",
          Taipei: "臺北市",
          NewTaipei: "新北市",
          Taoyuan: "桃園市",
          HsinchuCounty: "新竹縣",
          MiaoliCounty: "苗栗縣",
          Taichung: "臺中市",
          NantouCounty: "南投縣",
          ChanghuaCounty: "彰化縣",
          YunlinCounty: "雲林縣",
          ChiayiCounty: "嘉義縣",
          Chiayi: "嘉義市",
          Tainan: "臺南市",
          Kaohsiung: "高雄市",
          YilanCounty: "宜蘭縣",
          HualienCounty: "花蓮縣",
          TaitungCounty: "臺東縣",
          PingtungCounty: "屏東縣",
          KinmenCounty: "金門縣",
          PenghuCounty: "澎湖縣",
        });
      }
    },
    getCurrentComponent(context, payload) {
      let a = payload;
      if (a == "findbike") {
        context.commit("setCurrentComponent", "BikeCard");
      }
      if (a == "findroad") {
        context.commit("setCurrentComponent", "RoadCard");
      }
    },
    getShowAdvanced(context, payload) {
      let a = payload;
      if (a == "findbike") {
        context.commit("setShowAdvanced", false);
      }
      if (a == "findroad") {
        context.commit("setShowAdvanced", true);
      }
    },
  },
  modules: {},
});
