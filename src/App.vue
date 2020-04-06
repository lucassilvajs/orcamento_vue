<template>
  <div class="h-100">
  <router-view />
  <!-- <color-switcher /> -->
  <div class="dialog" v-if="loading" >

  </div>
  </div>
</template>

<script>
import ColorSwitcher from "./components/Common/ColorSwitcher";
import { getDirection } from "./utils";
import {
  mapGetters,
  mapActions
} from "vuex";
export default {
  components: {
  "color-switcher": ColorSwitcher
  },
  beforeMount() {
  const direction = getDirection();
  if (direction.isRtl) {
    document.body.classList.add("rtl");
    document.dir = "rtl";
    document.body.classList.remove("ltr");
  } else {
    document.body.classList.add("ltr");
    document.dir = "ltr";
      document.body.classList.remove("rtl");
  }
  },
  computed: {
  ...mapGetters(["loading"])
  }
};
</script>
<style>
  .dialog{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, .7);
  z-index: 1100
  }
</style>
