<template>
  <router-view />
</template>

<script>
// import { mapActions } from "vuex";

export default {
  name: "App",
  methods: {
    // ...mapActions(["getTittle"]),
  },
  mounted() {
    // this.getTittle();
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
  width: 366px;
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
</style>
