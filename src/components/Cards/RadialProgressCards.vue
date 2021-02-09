<template>
  <radial-progress-bar :diameter="54" :strokeWidth="2" :completed-steps="percent" :total-steps=100>{{percent}}%</radial-progress-bar>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress'
export default {
    props: ['title', 'percent', 'noSuffle'],
    components: {
        'radial-progress-bar' : RadialProgressBar
    }
}
</script>
