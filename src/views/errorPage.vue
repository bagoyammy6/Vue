<template>
  <body class="home-background">
    <div class="big-logo"></div>
    <div class="error-word">請確認網址或點擊下列連結</div>
    <div class="error-btn">
      <router-link to="/">
        <div class="link-page">首頁</div>
      </router-link>
      <router-link to="/findbike">
        <div class="link-page space">單車頁</div>
      </router-link>
      <router-link to="/findroad">
        <div class="link-page space">車道頁</div>
      </router-link>
    </div>
    <div class="wrap">
      <div class="pic-1"></div>
      <div class="pic-2"></div>
      <div class="pic-3"></div>
    </div>
  </body>
</template>

<script>
export default {
  name: "errorPage",
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
  top: 0%;
  bottom: 18.08%;
}
.error-word {
  position: absolute;
  left: 42%;
  top: 34%;
  font-size: 20px;
  color: #0e5978;
  font-weight: 450;
}
.error-btn {
  display: flex;
  position: absolute;
  left: 33%;
  top: 42%;
}
.link-page {
  border: 1px solid #0e5978;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 50px;
  color: #0e5978;
  background-color: #ffffff;
  cursor: pointer;
}
.link-page:hover {
  color: #ffffff;
  background-color: #0e5978;
}
.space {
  margin-left: 10px;
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
  .big-logo {
    left: 9%;
  }
  .error-word {
    left: 37%;
    top: 37%;
  }
  .error-btn {
    left: 17%;
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
  .big-logo {
    left: 16%;
    top: 6%;
  }
  .error-word {
    left: 23%;
    top: 43%;
  }
  .error-btn {
    left: 7%;
    top: 48%;
  }
  .link-page {
    font-size: 30px;
  }
  .wrap {
    top: 80%;
    height: 13%;
  }
}
</style>
