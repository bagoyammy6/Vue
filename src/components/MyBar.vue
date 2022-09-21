<template>
  <nav class="nav">
    <div class="logo">
      <router-link to="/">
        <div class="logo-img"></div>
      </router-link>
    </div>
    <div class="option">
      <router-link to="/findbike">
        <div class="option-item">尋找單車</div>
      </router-link>
      <router-link to="/findroad">
        <div class="option-item">尋找車道</div>
      </router-link>
      <div class="phone-add" @click.stop="showFind">
        <i class="fa-solid fa-magnifying-glass"></i>
      </div>
    </div>
  </nav>
  <div
    class="find-bike"
    v-if="this.$route.name == 'home'"
    v-show="isActive"
    ref="findBike"
  >
    <div class="find-bike-search">
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
    <div class="find-bike-btn">
      <div class="county-findBike" @click.stop="setShowCounty">
        <div class="county-word-findBike">{{ currCity }}</div>
        <div class="angle-down-findBike" v-show="!showCounty">
          <i class="fa-solid fa-angle-down"></i>
        </div>
        <div
          class="angle-down-findBike"
          v-show="showCounty"
          ref="selectBarCounty"
        >
          <i class="fa-solid fa-angle-up"></i>
        </div>
      </div>
      <div class="select-county" v-show="showCounty">
        <div
          class="each-county"
          v-for="(c, key) in county"
          :key="key"
          @click="changeCurrCity(c), setShowCounty(), setReqCity(key)"
        >
          {{ c }}
        </div>
      </div>
      <router-link
        :to="this.$store.state.reqCity ? { path: '/findbike' } : { path: '/' }"
      >
        <div class="search-btn-findBike" @click="getSearch">
          <div class="search-btn-word-findBike">搜尋</div>
        </div>
      </router-link>
    </div>
  </div>
  <div
    class="find-bike"
    v-if="this.$route.name == 'findbike' || this.$route.name == 'findroad'"
    v-show="isActive"
    ref="findBike"
  >
    <div class="find-bike-search">
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
    <div class="find-bike-btn">
      <div class="county-findBike" @click.stop="setShowCounty">
        <div class="county-word-findBike">{{ currCity }}</div>
        <div class="angle-down-findBike" v-show="!showCounty">
          <i class="fa-solid fa-angle-down"></i>
        </div>
        <div
          class="angle-down-findBike"
          v-show="showCounty"
          ref="selectBarCounty"
        >
          <i class="fa-solid fa-angle-up"></i>
        </div>
      </div>
      <div class="select-county" v-show="showCounty">
        <div
          class="each-county"
          v-for="(c, key) in county"
          :key="key"
          @click="changeCurrCity(c), setShowCounty(), setReqCity(key)"
        >
          {{ c }}
        </div>
      </div>
      <div class="search-btn-findBike" @click="getSearch">
        <div class="search-btn-word-findBike">搜尋</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyBar",
  data() {
    return {
      isActive: false,
      currCity: this.$store.state.currCity,
      county: this.$store.state.county,
      showCounty: false,
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
    showFind: function () {
      this.isActive = !this.isActive;
    },
    setShowCounty: function () {
      this.showCounty = !this.showCounty;
    },
    changeCurrCity: function (value) {
      this.$store.commit("setCurrCity", value);
      // console.log(this.$store.state.currCity);
      this.currCity = this.$store.state.currCity;
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
  },
  created() {
    document.addEventListener("click", (e) => {
      // console.log("q");
      if (this.$refs.selectBarCounty) {
        let isSelf = this.$refs.selectBarCounty.contains(e.target);
        if (!isSelf) {
          this.showCounty = false;
        }
      }
      if (this.$refs.findBike) {
        let isSelf = this.$refs.findBike.contains(e.target);
        if (!isSelf) {
          this.isActive = false;
        }
      }
    });
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.nav {
  position: absolute;
  height: 80px;
  left: 0;
  right: 0;
  top: 0;
  background-color: white;
  box-shadow: 0px 4px 10px rgba(38, 38, 38, 0.25);
  display: flex;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
  margin-left: 50px;
}
.logo-img {
  width: 80px;
  height: 48px;
  background-image: url(../assets/logo.png);
  background-size: cover;
  cursor: pointer;
}
.option {
  display: flex;
  align-items: center;
}
.option-item {
  margin-right: 50px;
  font-weight: 700;
  color: #0e5978;
  cursor: pointer;
  padding: 8px 16px;
}
.option-item:hover {
  background-color: #f0f9fc;
  color: #12749d;
}
a {
  text-decoration: none;
}
.phone-add {
  display: none;
}
.find-bike {
  width: 348px;
  background: #ffffff;
  box-shadow: 0px 0px 10px rgba(38, 38, 38, 0.25);
  border-radius: 8px;
  display: none;
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
  padding: 0 39px 0 36px;
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
.divid {
  width: 360px;
  border-top: 2px solid #e5e5e5;
  margin-top: 18px;
  margin-bottom: 18px;
}
@media (max-width: 576px) {
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
  .find-bike {
    width: 100vw;
    height: 106px;
    border-radius: 0;
    top: 56px;
    box-shadow: 0px 4px 4px rgb(38 38 38 / 25%);
    position: absolute;
    z-index: 100;
    display: block;
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
}
</style>
