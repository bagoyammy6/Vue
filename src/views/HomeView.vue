<template>
  <body class="home-background">
    <MyBar />
    <div class="big-logo"></div>
    <div class="slogan">尋找單車,</div>
    <div class="slogan-1">來場悠閒的放鬆之旅！</div>
    <div class="search-content">
      <div class="magnifier"><i class="fa-solid fa-magnifying-glass"></i></div>
      <div class="search-word">
        <input
          name="keyword"
          type="text"
          :placeholder="placeholder"
          v-model="keyword"
        />
      </div>
    </div>
    <div class="btn">
      <div class="county" @click.stop="showList">
        <div class="county-word">{{ currCity }}</div>
        <div class="angle-down" v-show="show">
          <i class="fa-solid fa-angle-up"></i>
        </div>
        <div class="angle-down" v-show="!show">
          <i class="fa-solid fa-angle-down"></i>
        </div>
      </div>
      <router-link
        :to="this.$store.state.reqCity ? { path: '/findbike' } : { path: '/' }"
      >
        <div class="search-btn" @click="getSearch">
          <div class="search-btn-word">搜尋</div>
        </div>
      </router-link>
    </div>
    <div class="county-list" v-show="show" ref="countyList">
      <div
        class="list-option"
        v-for="(c, key) in county"
        :key="key"
        @click="changeCurrCity(c), showList(), setReqCity(key)"
      >
        {{ c }}
      </div>
    </div>
    <div class="wrap">
      <div class="pic-1"></div>
      <div class="pic-2"></div>
      <div class="pic-3"></div>
    </div>
  </body>
</template>

<script>
import MyBar from "../components/MyBar.vue";
import { mapActions } from "vuex";

export default {
  name: "HomeView",
  components: {
    MyBar,
  },
  data() {
    return {
      show: false,
      county: this.$store.state.county,
      currCity: this.$store.state.currCity,
      token: this.$store.state.token,
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
  },
  methods: {
    showList: function () {
      this.show = !this.show;
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
    getSearch: function () {
      if (!this.$store.state.reqCity) {
        alert("請選擇縣市");
        return false;
      }
      this.$store.commit("setSearch", true);
      // console.log(this.$store.state.search);
    },
    ...mapActions(["getCounty"]),
  },
  created() {
    document.addEventListener("click", (e) => {
      // console.log("q");
      if (this.$refs.countyList) {
        let isSelf = this.$refs.countyList.contains(e.target);
        if (!isSelf) {
          this.show = false;
        }
      }
    });
  },
  beforeMount() {
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

    this.getCounty(this.$route.name);
    // console.log(this.$store.state.county);
    this.$store.commit("setCurrCity", "縣市");
    // console.log(this.$store.state.currCity);
    this.$store.commit("setReqCity", "");
    // console.log(this.$store.state.reqCity);
    //不加下面這行county選單就是空白的，因為雖然Vuex裡的狀態改變了但是本頁的狀態不會自己改變
    //直接在mounted前將值塞進去強制更新
    this.county = this.$store.state.county;
  },
  //這個元件之所以有beforeUpdate的階段是因為元件自己的狀態show有被改變
  //更新currCity的值也可以寫在changeCurrCity()裡面
  beforeUpdate: function () {
    this.currCity = this.$store.state.currCity;
    // this.reqCity = this.$store.state.reqCity;
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.big-logo {
  background-image: url(../assets/logo.png);
  background-size: auto;
  background-repeat: no-repeat;
  position: absolute;
  left: 15%;
  right: 6.3%;
  top: 11%;
  bottom: 18.08%;
}
.slogan {
  position: absolute;
  left: 16%;
  top: 35%;
  width: 472px;
  height: 100px;
  font-weight: 700;
  font-size: 40px;
  line-height: 125%;
  color: #0a4259;
}
.slogan-1 {
  position: absolute;
  left: 16%;
  top: 42%;
  width: 472px;
  height: 50px;
  font-weight: 700;
  font-size: 40px;
  line-height: 125%;
  color: #0a4259;
}
.search-content {
  position: absolute;
  left: 16%;
  top: 53%;
  width: 424px;
  height: 20px;
  display: flex;
  align-items: center;
  background: #f6f6f6;
  border: 1px solid #0e5978;
  border-radius: 4px;
  padding: 8px 4px 8px 8px;
}
.magnifier {
  color: #0e5978;
}
.search-word {
  padding-left: 5px;
  color: #a5a5a5;
  border-left: 1px solid #a5a5a5;
  margin-left: 5px;
}
.search-word > input {
  border: none;
  background-color: #f6f6f6;
  width: 300px;
  height: 30px;
  font-size: 17px;
  color: #0e5978;
}
.search-word > input:focus {
  outline: none;
}
.btn {
  position: absolute;
  left: 16%;
  top: 60%;
  width: 438px;
  height: 20px;
  display: flex;
}
.county {
  border: 1px solid #0e5978;
  background-color: white;
  border-radius: 4px;
  width: 214px;
  height: 38px;
  padding: 8px 8px 8px 8px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
}
.county:hover {
  background-color: #f0f9fc;
}
.county-word {
  padding: 0 60px 0 66px;
  color: #0e5978;
}
.angle-down {
  color: #0e5978;
}
.search-btn {
  border: 1px solid #0e5978;
  background-color: #0e5978;
  border-radius: 4px;
  width: 214px;
  height: 38px;
  padding: 8px 8px 8px 8px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;
}
.search-btn:hover {
  background-color: #12749d;
}
.search-btn-word {
  color: white;
}
.county-list {
  position: absolute;
  width: 212px;
  height: 120px;
  background-color: white;
  left: 16%;
  top: 66%;
  border: 1px solid #0e5978;
  border-radius: 4px;
  overflow-y: scroll;
}
.list-option {
  text-align: center;
  color: #0e5978;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
}
.list-option:hover {
  background-color: #f0f9fc;
}
.wrap {
  position: absolute;
  top: 70%;
  left: 50%;
  width: 40%;
  height: 30%;
  display: flex;
  justify-content: center;
}
.pic-1 {
  background-image: url(../assets/rideBike2.svg);
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
}
.pic-2 {
  background-image: url(../assets/rideBike1.svg);
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
}
.pic-3 {
  background-image: url(../assets/rideBike3.svg);
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
}
/* MacBook Air */
@media (max-width: 1500px) {
  .home-background {
    background-image: url(../assets/bg_home.svg);
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    height: 100vh;
  }
}
/* iPad Mini */
@media (max-width: 768px) {
  .home-background {
    background-image: url(../assets/bg_table.svg);
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
    height: 100vh;
  }
  .slogan-1 {
    top: 40%;
  }
  .btn {
    top: 58%;
  }
  .county-word {
    padding: 0 60px 0 73px;
  }
  .county-list {
    top: 62%;
  }
  .wrap {
    left: 13%;
    width: 80%;
    height: 20%;
  }
}
/* iPhone XR */
@media (max-width: 576px) {
  .home-background {
    background-image: url(../assets/bg_mobile.png);
    background-size: auto;
    background-repeat: no-repeat;
    overflow: hidden;
  }
  .wrap {
    top: 80%;
    height: 13%;
  }
  .nav {
    height: 56px;
  }
  .logo {
    margin-left: 10px;
  }
  .option-item {
    margin-right: 15px;
  }
  .phone-add {
    display: block;
    color: #0e5978;
    cursor: pointer;
    padding: 8px 16px;
    margin-right: 5px;
  }
  .big-logo {
    left: 1%;
  }
  .slogan {
    left: 7%;
    width: 376px;
    font-size: 33px;
  }
  .slogan-1 {
    left: 7%;
    width: 376px;
    font-size: 33px;
    top: 40%;
  }
  .search-content {
    left: 7%;
    width: 350px;
  }
  .btn {
    left: 7%;
    width: 366px;
    top: 58%;
  }
  .county {
    width: 178px;
    height: 38px;
    box-sizing: border-box;
  }
  .county-list {
    width: 178px;
    left: 7%;
    box-sizing: border-box;
    top: 62.5%;
  }
  .county-word {
    padding: 0 43px 0 56px;
  }
  .search-btn {
    width: 178px;
    height: 38px;
    box-sizing: border-box;
  }
}
</style>
