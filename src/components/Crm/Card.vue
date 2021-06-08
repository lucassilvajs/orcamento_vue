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

    <span v-if="differenceDays(pipe.added) < 90 && differenceDays(pipe.added) > 70" class="py-0 px-2 label right color-white bg-warning">Atrasado</span>
    <span v-else-if="differenceDays(pipe.added) <= 70" class="py-0 px-2 label right color-white bg-success">No prazo</span>
    <span v-else class="py-0 px-2 label right color-white bg-danger">Atrasado</span>


    <!-- <span class="py-0 px-2 label right" :class="{label: true, 'color-white': true, 'bg-warning': , 'bg-success': , 'bg-danger': differenceDays(pipe.added) >= 90}"> {{ differenceDays(pipe.added) < 70 ? 'No prazo' : (differenceDays(pipe.added) < 90 && differenceDays(pipe.added) > 70) ? 'Atrasado' : 'Expirado'  }} </span> -->

    <span class="d-block"><b>{{pipe.title}}</b></span>
    <hr class="my-1">
    <span class="d-block" v-for="(info, infoIndex) in pipe.items.filter(r => r.id  == 3)" :key="infoIndex"><b>{{info.label}}:</b> <div v-if="info.type == 'checkbox'"> <span class="d-block" v-for="(v,i) in JSON.parse(info.value)" :key="i">- {{v}} </span> </div> <span v-else>{{info.value}}</span> </span>
    <span class="d-block" v-if="pipe.creator"><b>Responsável: </b>{{pipe.creator.name}}</span>
    <hr>
    <span class="d-block mt-2" v-if="pipe.return"><b>Retorno: </b> {{pipe.return | datetime}}</span>
    <div class="controller d-flex justify-content-between mt-4">
      <span v-if="pipe.sdr" class="badge badge-dark">SDR</span>
      <span class="comments d-flex align-items-center">
        <div class="glyph-icon iconsminds-speach-bubble"/>
        <span class="value mx-2"> {{pipe.comment}} </span>
      </span>
      <span class="comments d-flex align-items-center">
        <div class="glyph-icon simple-icon-clock"/>
        <span class="value mx-2"> {{pipe.historic}} </span>
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
        return new Date().getTime(end) /1000/60/60/24 - new Date(start).getTime() /1000/60/60/24
      },
      async deleteCard(cardId){
        console.log(this.pipe)
      }
    },
    watch: {
    }
}
</script>
<style scoped>
.content {
  background: #ededed;
  border-radius: 3px;
  cursor: move;
  box-shadow: 2px 2px 4px rgba(100,100,100,.3);
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
