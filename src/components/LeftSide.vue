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
          @click="search(), getMapAva(), getMapData()"
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
import BikeCard from "../components/BikeCard.vue";
import ViewDetail from "../components/ViewDetail.vue";
import ViewCard from "../components/ViewCard.vue";
import AdvancedSelect from "../components/AdvancedSelect.vue";
import RoadCard from "../components/RoadCard.vue";
import FoodDetail from "../components/FoodDetail.vue";

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
      findWord: this.$store.state.tittle,
      county: this.$store.state.county,
      showCounty: false,
      showFind: true,
      currCity: this.$store.state.currCity,
      token: this.$store.state.token,
      showMap: this.$store.state.showMap,
      currentComponent: this.$store.state.currentComponent,
      nowPage: this.$store.state.nowPage,
      isActive: this.$store.state.isActive,
      work: this.$store.state.work,
      totalPage: this.$store.state.totalPage,
      searchPage: this.$store.state.searchPage,
      advancedPage: this.$store.state.advancedPage,
      nowAdvancedPage: this.$store.state.nowAdvancedPage,
      totalAdvancedPage: this.$store.state.totalAdvancedPage,
      left: this.$store.state.left,
      right: this.$store.state.right,
      advUrl: this.$store.state.advUrl,
      press: this.$store.state.press,
      mapOrWord: "顯示列表",
    };
  },
  computed: {
    keyword: {
      get() {
        // console.log("get");
        return this.$store.state.keyword;
      },
      set(value) {
        this.$store.commit("setKeyword", value);
        // console.log("set");
        this.$store.commit("setPress", false);
      },
    },
    placeholder: {
      get() {
        if (this.$route.name == "findbike" || this.$route.name == "home") {
          return "請輸入車站名稱";
        } else {
          return "請輸入車道名稱";
        }
      },
    },
    showAdvanced: {
      get() {
        // console.log("get");
        return this.$store.state.showAdvanced;
      },
      set(value) {
        this.$store.commit("setShowAdvanced", value);
        // console.log("set");
      },
    },
  },
  methods: {
    setShowCounty: function () {
      this.showCounty = !this.showCounty;
    },
    setShowFind: function () {
      this.showFind = !this.showFind;
    },
    changeCurrCity: function (value) {
      this.$store.commit("setCurrCity", value);
      // console.log(this.$store.state.currCity);
    },
    setReqCity: function (value) {
      this.$store.commit("setReqCity", value);
      // console.log(this.$store.state.reqCity);
      // console.log(this.$route.name);
      this.nowPage = 1;
      this.$store.commit("setWork", true);
      this.$store.commit("setSkipNumber", 0);
      this.$store.commit("setSearchFirst", false);
      this.$store.commit("setCurrDistance", "距離");
      this.$store.commit("setCurrDirection", "方向");
      this.$store.commit("setAdd", false);
      this.$store.commit("setPress", false);
    },
    search: function () {
      if (!this.$store.state.reqCity) {
        alert("請選擇縣市");
        return false;
      }
      this.$store.commit("setCurrDistance", "距離");
      this.$store.commit("setCurrDirection", "方向");
      this.$store.commit("setAdd", false);
      this.$store.commit("setSearchPage", true);
      this.$store.commit("setAdvancedPage", false);
      this.$store.dispatch("getSearchUrl", this.$route.name);
      this.$store.commit("setSearchFirst", true);
      if (this.$route.name == "findbike") {
        this.$store.commit("setCurrentComponent", "BikeCard");
      } else {
        this.$store.commit("setCurrentComponent", "RoadCard");
        this.$store.commit("setShowAdvanced", true);
      }
      let head = document.querySelector(".scroll");
      head.scrollTop = 0;
      this.nowPage = this.$store.state.skipNumber / 6 + 1;
      if (this.$store.state.keyword == "") {
        this.$store.commit("setWork", false);
        fetch(this.$store.state.searchUrl, {
          method: "GET",
          headers: new Headers({
            authorization: "Bearer " + this.token.access_token,
          }),
        })
          .then((data) => {
            // console.log(data);
            return data.json();
          })
          .then((data) => {
            // console.log(data);
            this.$store.commit("setSearchResult", data);
            // console.log(this.$store.state.searchResult);
            this.getAvailable();
            this.getTotalPage();
          })
          .catch((err) => {
            console.log(err);
          });
        this.$store.commit("setPress", true);
      } else {
        this.$store.commit("setWork", true);
        this.nowPage = 1;
        this.getTotalPage();
        this.$store.commit("setPress", true);
      }
    },
    getAvailable: function () {
      if (this.$route.name == "findbike") {
        fetch(this.$store.state.availableUrl, {
          method: "GET",
          headers: new Headers({
            authorization: "Bearer " + this.token.access_token,
          }),
        })
          .then((data) => {
            // console.log(data);
            return data.json();
          })
          .then((data) => {
            this.$store.commit("setAvailable", data);
            // console.log(this.$store.state.available);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return false;
      }
    },
    allAvailable: function () {
      if (this.$route.name == "findbike") {
        fetch(this.$store.state.allUrl, {
          method: "GET",
          headers: new Headers({
            authorization: "Bearer " + this.token.access_token,
          }),
        })
          .then((data) => {
            // console.log(data);
            return data.json();
          })
          .then((data) => {
            // console.log(data);
            // console.log(Object.values(this.$store.state.searchResult));
            let a = Object.values(this.$store.state.searchResult);
            let total = [];
            a.forEach((a) => {
              let b = data.filter((d) => d?.StationUID == a?.StationUID);
              total.push(b[0]);
            });
            this.$store.commit("setAvailable", total);
            // console.log(this.$store.state.available);
            // console.log(b);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return false;
      }
    },
    getMapData: function () {
      if (!this.$store.state.reqCity) {
        return false;
      }
      this.$store.commit("setIsLoading", true);
      fetch(this.$store.state.totalPageUrl, {
        method: "GET",
        headers: new Headers({
          authorization: "Bearer " + this.token.access_token,
        }),
      })
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((data) => {
          if (this.keyword) {
            if (this.$route.name == "findbike") {
              let a = data.filter((d) =>
                d.StationName.Zh_tw.includes(this.keyword)
              );
              // console.log(a);
              if (a.length == 0) {
                return false;
              }
              this.$store.commit("setMapData", a);
            } else {
              let a = data.filter((d) => d.RouteName.includes(this.keyword));
              if (a.length == 0) {
                return false;
              }
              this.$store.commit("setMapData", a);
            }
          } else {
            // console.log(data);
            this.$store.commit("setMapData", data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMapAva: function () {
      if (!this.$store.state.reqCity) {
        return false;
      }
      if (this.$route.name == "findbike") {
        fetch(this.$store.state.allUrl, {
          method: "GET",
          headers: new Headers({
            authorization: "Bearer " + this.token.access_token,
          }),
        })
          .then((data) => {
            // console.log(data);
            return data.json();
          })
          .then((data) => {
            this.$store.commit("setMapAva", data);
            // console.log(this.$store.state.mapAva);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return false;
      }
    },
    getTotalPage: function () {
      fetch(this.$store.state.totalPageUrl, {
        method: "GET",
        headers: new Headers({
          authorization: "Bearer " + this.token.access_token,
        }),
      })
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((data) => {
          if (this.keyword) {
            this.$store.commit("setTotalPage", 1);
            if (this.$route.name == "findbike") {
              let a = data.filter((d) =>
                d.StationName.Zh_tw.includes(this.keyword)
              );
              // console.log(a);
              if (a.length == 0) {
                this.$store.commit("setIsLoading", false);
                alert("查無資料");
                this.$store.commit("setSearchResult", "");
                return false;
              }
              this.$store.commit("setSearchResult", a);
              // console.log(this.$store.state.searchResult);
              this.allAvailable();
            } else {
              let a = data.filter((d) => d.RouteName.includes(this.keyword));
              if (a.length == 0) {
                this.$store.commit("setIsLoading", false);
                alert("查無資料");
                this.$store.commit("setSearchResult", "");
                return false;
              }
              this.$store.commit("setSearchResult", a);
              // console.log(this.$store.state.searchResult);
            }
          } else {
            // console.log(data);
            let p = Math.ceil(data.length / 6);
            this.$store.commit("setTotalPage", p);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeShowMap: function () {
      this.$store.commit("setShowMap", !this.showMap);
    },
    minusPage: function () {
      this.$store.commit("setWork", false);
      this.$store.commit("setNowPage", (this.nowPage -= 1));
      // this.$store.commit("setTopNumber", this.$store.state.topNumber - 5);
      this.$store.commit("setSkipNumber", this.$store.state.skipNumber - 6);
      this.$store.dispatch("getSearchUrl", this.$route.name);
      this.search();
    },
    addPage: function () {
      this.$store.commit("setIsActive", false);
      this.$store.commit("setNowPage", (this.nowPage += 1));
      // console.log(this.$store.state.nowPage);
      // this.$store.commit("setTopNumber", this.$store.state.topNumber + 5);
      this.$store.commit("setSkipNumber", this.$store.state.skipNumber + 6);
      this.$store.dispatch("getSearchUrl", this.$route.name);
      this.search();
    },
    minusAdvanced: function () {
      let head = document.querySelector(".scroll");
      head.scrollTop = 0;
      this.$store.commit("setRight", false);
      this.$store.commit("setNowAdvancedPage", this.nowAdvancedPage - 1);
      this.$store.commit(
        "setAdvancedNumber",
        this.$store.state.advancedNumber - 6
      );
      let url = "";
      switch (this.advUrl) {
        case 1:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20le%203000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          break;
        case 2:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20gt%203000%20and%20CyclingLength%20le%2010000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          break;
        case 3:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20gt%2010000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          break;
        case 4:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=Direction%20eq%20%27%E9%9B%99%E5%90%91%27&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          break;
        case 5:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=Direction%20eq%20%27%E5%96%AE%E5%90%91%27&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
      }
      // console.log(url);
      fetch(url, {
        method: "GET",
        headers: new Headers({
          authorization: "Bearer " + this.token.access_token,
        }),
      })
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((data) => {
          this.$store.commit("setSearchResult", data);
          // console.log(this.$store.state.searchResult);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addAdvanced: function () {
      let head = document.querySelector(".scroll");
      head.scrollTop = 0;
      this.$store.commit("setLeft", false);
      this.$store.commit("setNowAdvancedPage", this.nowAdvancedPage + 1);
      this.$store.commit(
        "setAdvancedNumber",
        this.$store.state.advancedNumber + 6
      );
      let url = "";
      switch (this.advUrl) {
        case 1:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20le%203000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          break;
        case 2:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20gt%203000%20and%20CyclingLength%20le%2010000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          break;
        case 3:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20gt%2010000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          break;
        case 4:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=Direction%20eq%20%27%E9%9B%99%E5%90%91%27&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          break;
        case 5:
          // console.log(this.advUrl);
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=Direction%20eq%20%27%E5%96%AE%E5%90%91%27&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
      }
      // console.log(url);
      fetch(url, {
        method: "GET",
        headers: new Headers({
          authorization: "Bearer " + this.token.access_token,
        }),
      })
        .then((data) => {
          // console.log(data);
          return data.json();
        })
        .then((data) => {
          this.$store.commit("setSearchResult", data);
          // console.log(this.$store.state.searchResult);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  watch: {
    "$store.state.currentComponent": function () {
      this.currentComponent = this.$store.state.currentComponent;
    },
    "$store.state.showAdvanced": function () {
      this.showAdvanced = this.$store.state.showAdvanced;
    },
    nowPage: function () {
      if (this.nowPage == 1) {
        this.$store.commit("setIsActive", true);
      } else {
        this.$store.commit("setIsActive", false);
      }
      if (this.nowPage == this.totalPage) {
        // console.log(this.nowPage);
        // console.log(this.totalPage);
        this.$store.commit("setWork", true);
        this.$store.commit("setPress", true);
      }
    },
    totalPage: function () {
      if (this.nowPage == this.totalPage) {
        // console.log(this.nowPage);
        // console.log(this.totalPage);
        this.$store.commit("setWork", true);
        this.$store.commit("setPress", true);
      }
    },
    "$store.state.searchPage": function () {
      this.searchPage = this.$store.state.searchPage;
    },
    "$store.state.advancedPage": function () {
      this.advancedPage = this.$store.state.advancedPage;
    },
    "$store.state.left": function () {
      this.left = this.$store.state.left;
    },
    "$store.state.right": function () {
      this.right = this.$store.state.right;
    },
    "$store.state.totalAdvancedPage": function () {
      this.totalAdvancedPage = this.$store.state.totalAdvancedPage;
    },
    "$store.state.advUrl": function () {
      this.advUrl = this.$store.state.advUrl;
    },
    "$store.state.nowAdvancedPage": function () {
      this.nowAdvancedPage = this.$store.state.nowAdvancedPage;
      if (this.nowAdvancedPage == 1) {
        this.$store.commit("setLeft", true);
      }
      if (this.totalAdvancedPage == this.nowAdvancedPage) {
        this.$store.commit("setRight", true);
      }
      // console.log(this.nowAdvancedPage);
      // console.log(this.totalAdvancedPage);
    },
    "$store.state.isActive": function () {
      this.isActive = this.$store.state.isActive;
    },
    "$store.state.work": function () {
      this.work = this.$store.state.work;
    },
    "$store.state.totalPage": function () {
      this.totalPage = this.$store.state.totalPage;
    },
    "$store.state.press": function () {
      this.press = this.$store.state.press;
    },
    "$store.state.search": function () {
      if (this.$store.state.search) {
        this.search();
        this.getMapData();
        this.getMapAva();
        // console.log("in");
      }
      // console.log("out");
      this.$store.commit("setSearch", false);
    },
    "$store.state.showMap": function () {
      this.showMap = this.$store.state.showMap;
      if (this.showMap) {
        this.mapOrWord = "顯示列表";
      } else {
        this.mapOrWord = "顯示地圖";
      }
    },
  },
  created() {
    document.addEventListener("click", (e) => {
      // console.log("q");
      if (this.$refs.selectCounty) {
        let isSelf = this.$refs.selectCounty.contains(e.target);
        if (!isSelf) {
          this.showCounty = false;
        }
      }
    });
  },
  beforeMount: function GetAuthorizationHeader() {
    const parameter = {
      grant_type: "client_credentials",
      client_id: "bagoyammy6-6d8a0d3f-0f27-4a43",
      client_secret: "2bb8b519-b371-4bae-b214-d57dccc6cfdc",
    };

    let auth_url =
      "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

    fetch(auth_url, {
      method: "POST",
      mode: "cors",
      body: new URLSearchParams(parameter),
      headers: new Headers({
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      }),
    })
      .then((data) => {
        // console.log(data);
        return data.json();
      })
      .then((accesstoken) => {
        // console.log(accesstoken);
        this.$store.commit("setToken", accesstoken);
        this.token = accesstoken;
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("我被執行了");
  },
  mounted: function () {
    if (this.$store.state.search) {
      this.search();
      this.getMapData();
      this.getMapAva();
    }
    this.$store.commit("setSearch", false);
  },
  beforeUpdate: function () {
    this.currCity = this.$store.state.currCity;
    // this.reqCity = this.$store.state.reqCity;
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
