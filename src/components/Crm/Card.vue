<template>
  <div class="content position-relative">
    <div v-for="(c, ci) in pipe.items.filter(r => ['11'].indexOf(r.id) > -1 )" :key="ci" :style="{background: JSON.parse(c.value).color}" class="color" :id="'pop-'+ci" >
      <b-tooltip :target="'pop-'+ci"
        placement="top"
        :title="JSON.parse(c.value).value">
      </b-tooltip>
    </div>
    <span class="py-0 px-2 position-absolute label right" :class="{label: true, 'color-white': true, 'bg-warning': differenceDays(pipe.added) < 90 && differenceDays(pipe.added) > 70, 'bg-success': differenceDays(pipe.added) <= 70, 'bg-danger': differenceDays(pipe.added) >= 90}"> {{ differenceDays(pipe.added) < 70 ? 'No prazo' : (differenceDays(pipe.added) < 90 && differenceDays(pipe.added) > 70) ? 'Atrasado' : 'Expirado'  }} </span>
    <span class="d-block"><b>{{pipe.title}}</b></span>
    <hr class="my-1">
    <span class="d-block" v-for="(info, infoIndex) in pipe.items.filter(r => ['11'].indexOf(r.id) == -1 )" :key="infoIndex"><b>{{info.label}}:</b> {{info.value}}</span>
    <div class="controller d-flex justify-content-between mt-4">
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
  background: #ededed;
  border-radius: 3px;
}

span.label {
    top: -10px;
    color: #fff;
}

span.label.right {
  right: 10px;
}

span.label.left {
  left: 10px;
}

.color{
  width:15px;
  height: 15px;
  display: block;
  position: absolute;
  border-radius: 2px;
  top: -5px;
  cursor: pointer;
}
</style>
