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
      <div class="btn-range" @click="setShowRange">
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
      <div class="select-range" v-show="showRange" @click="setShowRange()">
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
      <div class="btn-direction" @click="setShowDirection">
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
export default {
  name: "AdvancedSelect",
  data() {
    return {
      showRange: false,
      showDirection: false,
      showAdvanced: true,
      currDistance: this.$store.state.currDistance,
      distance: {
        1: "近",
        2: "中",
        3: "遠",
      },
      currDirection: this.$store.state.currDirection,
      direction: { 1: "雙向", 2: "單向" },
      searchResult: this.$store.state.searchResult,
      add: false,
    };
  },
  methods: {
    setShowRange: function () {
      if (!this.$store.state.reqCity) {
        alert("請先選擇縣市");
        return false;
      }
      if (!this.$store.state.searchFirst) {
        alert("請先搜尋");
        return false;
      } else {
        this.showRange = !this.showRange;
      }
    },
    setShowDirection: function () {
      if (!this.$store.state.reqCity) {
        alert("請先選擇縣市");
        return false;
      }
      if (!this.$store.state.searchFirst) {
        alert("請先搜尋");
        return false;
      } else {
        this.showDirection = !this.showDirection;
      }
    },
    setShowAdvanced: function () {
      this.showAdvanced = !this.showAdvanced;
    },
    changeCurrDistance: function (value) {
      this.$store.commit("setCurrDistance", value);
      // console.log(this.$store.state.currDistance);
    },
    changeCurrDirection: function (value) {
      this.$store.commit("setCurrDirection", value);
      // console.log(this.$store.state.currDirection);
    },
    changeBtnMobile: function () {
      this.add = true;
    },
    changeSearchResultDistance: function (value) {
      let head = document.querySelector(".scroll");
      head.scrollTop = 0;
      this.$store.commit("setCurrDirection", "方向");
      this.$store.commit("setSearchPage", false);
      this.$store.commit("setAdvancedPage", true);
      this.$store.commit("setAdvancedNumber", 0);
      this.$store.commit("setNowAdvancedPage", 1);
      this.$store.commit("setLeft", true);
      this.$store.commit("setRight", true);
      // console.log(this.$store.state.right);
      this.$store.commit("setPress", false);
      let url = "";
      let totalUrl = "";
      // console.log(typeof value);
      switch (value) {
        case "1":
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20le%203000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          // console.log(url);
          totalUrl = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20le%203000`;
          this.$store.commit("setAdvUrl", 1);
          break;
        case "2":
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20gt%203000%20and%20CyclingLength%20le%2010000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          totalUrl = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20gt%203000%20and%20CyclingLength%20le%2010000`;
          this.$store.commit("setAdvUrl", 2);
          break;
        case "3":
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20gt%2010000&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          totalUrl = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=CyclingLength%20gt%2010000`;
          this.$store.commit("setAdvUrl", 3);
          break;
      }
      // console.log(url);
      if (!this.$store.state.keyword) {
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
            if (data.length == 0) {
              this.$store.commit("setSearchResult", data);
              this.$store.commit("setTotalAdvancedPage", 1);
              this.$store.commit("setLeft", true);
              this.$store.commit("setRight", true);
              alert("查無資料");
              return false;
            }
            this.$store.commit("setSearchResult", data);
            // console.log(this.$store.state.searchResult);
            //計算totalAdvancedPage
            fetch(totalUrl, {
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
                this.$store.commit(
                  "setTotalAdvancedPage",
                  Math.ceil(data.length / 6)
                );
                if (this.$store.state.totalAdvancedPage != 1) {
                  this.$store.commit("setRight", false);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        fetch(totalUrl, {
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
            let a = data.filter((d) =>
              d.RouteName.includes(this.$store.state.keyword)
            );
            if (a.length == 0) {
              this.$store.commit("setSearchResult", a);
              this.$store.commit("setTotalAdvancedPage", 1);
              this.$store.commit("setLeft", true);
              this.$store.commit("setRight", true);
              alert("查無資料");
              return false;
            }
            this.$store.commit("setSearchResult", a);
            console.log(this.$store.state.searchResult);
            // this.$store.commit("setTotalAdvancedPage", Math.ceil(a.length / 6));
            // if (this.$store.state.totalAdvancedPage != 1) {
            //   this.$store.commit("setRight", false);
            // }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    changeSearchResultDirection: function (value) {
      let head = document.querySelector(".scroll");
      head.scrollTop = 0;
      this.$store.commit("setCurrDistance", "距離");
      this.$store.commit("setSearchPage", false);
      this.$store.commit("setAdvancedPage", true);
      this.$store.commit("setAdvancedNumber", 0);
      this.$store.commit("setNowAdvancedPage", 1);
      this.$store.commit("setLeft", true);
      this.$store.commit("setRight", true);
      this.$store.commit("setPress", false);
      this.add = false;
      // let encode = encodeURI(value);
      // console.log(encode);
      //雙向 %E9%9B%99%E5%90%91
      //單向 %E5%96%AE%E5%90%91
      let url = "";
      let totalUrl = "";
      // console.log(value);
      // console.log(typeof value);
      switch (value) {
        case "1":
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=Direction%20eq%20%27%E9%9B%99%E5%90%91%27&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          totalUrl = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=Direction%20eq%20%27%E9%9B%99%E5%90%91%27`;
          this.$store.commit("setAdvUrl", 4);
          break;
        case "2":
          url = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=Direction%20eq%20%27%E5%96%AE%E5%90%91%27&%24top=6&%24skip=${this.$store.state.advancedNumber}`;
          totalUrl = `https://tdx.transportdata.tw/api/basic/v2/Cycling/Shape/City/${this.$store.state.reqCity}?%24filter=Direction%20eq%20%27%E5%96%AE%E5%90%91%27`;
          this.$store.commit("setAdvUrl", 5);
          break;
      }
      if (!this.$store.state.keyword) {
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
            // console.log(data);
            if (data.length == 0) {
              this.$store.commit("setSearchResult", data);
              this.$store.commit("setTotalAdvancedPage", 1);
              this.$store.commit("setLeft", true);
              this.$store.commit("setRight", true);
              alert("查無資料");
              return false;
            }
            this.$store.commit("setSearchResult", data);
            // console.log(this.$store.state.searchResult);
            //計算totalAdvancedPage
            fetch(totalUrl, {
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
                this.$store.commit(
                  "setTotalAdvancedPage",
                  Math.ceil(data.length / 6)
                );
                if (this.$store.state.totalAdvancedPage != 1) {
                  this.$store.commit("setRight", false);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        fetch(totalUrl, {
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
            let a = data.filter((d) =>
              d.RouteName.includes(this.$store.state.keyword)
            );
            if (a.length == 0) {
              this.$store.commit("setSearchResult", a);
              this.$store.commit("setTotalAdvancedPage", 1);
              this.$store.commit("setLeft", true);
              this.$store.commit("setRight", true);
              alert("查無資料");
              return false;
            }
            this.$store.commit("setSearchResult", a);
            console.log(this.$store.state.searchResult);
            // this.$store.commit("setTotalAdvancedPage", Math.ceil(a.length / 6));
            // if (this.$store.state.totalAdvancedPage != 1) {
            //   this.$store.commit("setRight", false);
            // }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
  watch: {
    "$store.state.searchResult": function () {
      this.currDistance = "距離";
      this.currDirection = "方向";
      this.add = false;
    },
    "$store.state.currDistance": function () {
      this.currDistance = this.$store.state.currDistance;
    },
    "$store.state.currDirection": function () {
      this.currDirection = this.$store.state.currDirection;
    },
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
  beforeUpdate: function () {
    this.currDistance = this.$store.state.currDistance;
    this.currDirection = this.$store.state.currDirection;
    this.searchResult = this.$store.state.searchResult;
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
