<template>
<div id="app-container" :class="getMenuType">
    <top-nav />
    <sidebar />
    <main>
        <div class="container-fluid">
            <transition mode="out-in">
                <router-view />
            </transition>
        </div>
    </main>
    <footer-component/>
</div>
</template>

<script>
import Sidebar from '@/containers/admin/Sidebar'
import TopNav from '@/containers/admin/TopNav'
import Footer from '@/containers/Footer'
import {
    mapGetters
} from 'vuex'

export default {
    components: {
        'top-nav': TopNav,
        'sidebar': Sidebar,
        'footer-component': Footer
    },
    data() {
        return {
            show: false
        }
    },
    computed: {
        ...mapGetters(['getMenuType'])
    }
}
</script>

<style scoped>
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-enter {
  transform: translate3d(0, -20px, 0);
}

.v-leave-to {
  transform: translate3d(0, 20px, 0);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}
</style>