<template>
  <div class="content position-relative">
    <span class="p-1 position-absolute label" :class="{label: true, 'color-white': true, 'bg-warning': differenceDays(pipe.added) < 90 && differenceDays(pipe.added) > 70, 'bg-success': differenceDays(pipe.added) <= 70, 'bg-danger': differenceDays(pipe.added) >= 90}"> {{ differenceDays(pipe.added) < 70 ? 'No prazo' : (differenceDays(pipe.added) < 90 && differenceDays(pipe.added) > 70) ? 'Atrasado' : 'Expirado'  }} </span>
    <span class="d-block" v-for="(i, indexItem) in pipe.items" :key="indexItem"><b>{{i.label}}: </b> {{i.value}}</span>
    <div class="controller d-flex justify-content-between mt-3">
      <span class="comments d-flex align-items-center">
        <div class="glyph-icon iconsminds-speach-bubble-2"/>
        <span class="value mx-2"> {{pipe.comment.length}} </span>
      </span>
      <span class="comments d-flex align-items-center">
        <div class="glyph-icon simple-icon-clock"/>
        <span class="value mx-2"> {{pipe.historic.length}} </span>
      </span>
    </div>
  </div>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress'
export default {
    props: ['pipe'],
    components: {
        'radial-progress-bar' : RadialProgressBar
    },
    methods: {
      differenceDays(start, end = new Date()){
        return new Date().getTime(end) / 1000 /60 /60 /24 - new Date(start).getTime() / 1000 /60 /60 /24
      }
    }
}
</script>
<style scoped>
.content {
  background: #dddddd;
  border-radius: 5px;
}

span.label {
    top: -10px;
    color: #fff;
    right: 10px;
}
</style>
