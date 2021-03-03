<template>
  <div class="content position-relative">

    <div v-if="pipe.items.filter(r => ['11'].indexOf(r.id) > -1 ).length > 0">
      <div v-for="(c, ci) in pipe.items.filter(r => ['11'].indexOf(r.id) > -1 )" :key="ci">
        <div v-if="c.value"
          :style="{background: JSON.parse(pipe.items.filter(r => ['11'].indexOf(r.id) > -1 )[0].aux).filter(r => r.value == c.value)[0].color}" class="color" :id="'pop-'+ci" >
          <b-tooltip :target="'pop-'+ci"
            placement="top"
            :title="c.value">
          </b-tooltip>
        </div>
      </div>
    </div>


    <span class="py-0 px-2 position-absolute label right" :class="{label: true, 'color-white': true, 'bg-warning': differenceDays(pipe.added) < 90 && differenceDays(pipe.added) > 70, 'bg-success': differenceDays(pipe.added) <= 70, 'bg-danger': differenceDays(pipe.added) >= 90}"> {{ differenceDays(pipe.added) < 70 ? 'No prazo' : (differenceDays(pipe.added) < 90 && differenceDays(pipe.added) > 70) ? 'Atrasado' : 'Expirado'  }} </span>

    <span class="d-block"><b>{{pipe.title}}</b></span>
    <hr class="my-1">
    <span class="d-block" v-for="(info, infoIndex) in pipe.items.filter(r => r.id  == 3)" :key="infoIndex"><b>{{info.label}}:</b> <div v-if="info.type == 'checkbox'"> <span class="d-block" v-for="(v,i) in JSON.parse(info.value)" :key="i">- {{v}} </span> </div> <span v-else>{{info.value}}</span> </span>
    <span class="d-block"><b>Responsável: </b>{{pipe.assign[0].name}}</span>
    <div class="controller d-flex justify-content-between mt-4">
      <span class="comments d-flex align-items-center">
        <div class="glyph-icon iconsminds-speach-bubble-2"/>
        <span class="value mx-2"> {{pipe.comment.length}} </span>
      </span>
      <span class="comments d-flex align-items-center">
        <div class="glyph-icon simple-icon-clock"/>
        <span class="value mx-2"> {{pipe.historic.length}} </span>
      </span>
      <span class="profile">
        <div v-for="(photo, photoIndex) in pipe.assign" :key="photoIndex">

        </div>
        <button @click="deleteCard" class="btn btn-xs btn-outline-danger">
          <div class="glyph-icon simple-icon-trash"/>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress'
export default {
    props: ['pipe', 'stage'],
    components: {
        'radial-progress-bar' : RadialProgressBar
    },
    methods: {
      differenceDays(start, end = new Date()){
        return new Date().getTime(end) / 1000 /60 /60 /24 - new Date(start).getTime() / 1000 /60 /60 /24
      },
      isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
      },
      async deleteCard(cardId){
        console.log(this.pipe)
      }
    },
    watch: {
      stage: function(newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    }
}
</script>
<style scoped>
.content {
  background: #ededed;
  border-radius: 3px;
  cursor: move;
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
