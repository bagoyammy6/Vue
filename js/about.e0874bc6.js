"use strict";(self["webpackChunkyoubike"]=self["webpackChunkyoubike"]||[]).push([[443],{5744:function(t,e,s){s.r(e),s.d(e,{default:function(){return d}});var o=s(3396);const i={class:"home-background"};function r(t,e,s,r,h,m){const a=(0,o.up)("MyBar"),n=(0,o.up)("LeftSide"),c=(0,o.up)("RightMap");return(0,o.wg)(),(0,o.iD)("body",i,[(0,o.Wm)(a),(0,o.Wm)(n),(0,o.Wm)(c)])}var h=s(3964),m=s(172),a=s(8647),n=s(65),c={name:"FindBike",components:{MyBar:h.Z,RightMap:m.Z,LeftSide:a.Z},data(){return{showRightDown:this.$store.state.showMap}},methods:{...(0,n.nv)(["getTittle","getCounty","getCurrentComponent","getShowAdvanced"])},watch:{"$store.state.showMap":function(){this.showRightDown=this.$store.state.showMap}},beforeMount(){this.getTittle(this.$route.name),this.getCounty(this.$route.name),this.getCurrentComponent(this.$route.name),this.getShowAdvanced(this.$route.name)},beforeUnmount(){this.$store.commit("setCurrCity","縣市"),this.$store.commit("setReqCity",""),this.$store.dispatch("getSearchUrl",""),this.$store.commit("setCurrDistance","距離"),this.$store.commit("setCurrDirection","方向"),this.$store.commit("setSearchResult",[]),this.$store.commit("setNowPage",1),this.$store.commit("setSkipNumber",0),this.$store.commit("setMapData",[]),this.$store.commit("setTotalPage",1),this.$store.commit("setIsActive",!0),this.$store.commit("setWork",!0),this.$store.commit("setLeft",!0),this.$store.commit("setRight",!0),this.$store.commit("setNowAdvancedPage",1),this.$store.commit("setTotalAdvancedPage",1),this.$store.commit("setSearch",!1)}},u=s(89);const $=(0,u.Z)(c,[["render",r],["__scopeId","data-v-1edb4b99"]]);var d=$}}]);
//# sourceMappingURL=about.e0874bc6.js.map