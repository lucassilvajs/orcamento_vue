<template>
<div class="d-flex flex-row mb-3 pb-3 border-bottom" @click="getConsultor()">
    <img v-if="false" :src="data.image ? baseURL + data.image : '/assets/img/profile-pic-l.jpg' " :alt="data.name" style="width:45px!important; height:45px!important;" class="img-thumbnail border-0 rounded-circle list-thumbnail align-self-center xsmall" />
    <div class="pl-3 pr-2">
        <div>
            <p class="font-weight-medium mb-0 ">{{ data.name }}</p>
            <p class="text-muted mb-0 text-small">Vendas esse mês: {{data.vendido | numeroPreco}}</p>
        </div>
    </div>
</div>
</template>

<script>
import {api, baseURL} from '@/constants/config';
export default {
    props: ['data', 'detailPath'],
    methods: {
      getConsultor() {
        this.$emit('consult', this.data);
      }
    },
    watch: {}
}
</script>
