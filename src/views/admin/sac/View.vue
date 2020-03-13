<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>SAC</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="SAC">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nota</th>
                <th>Colaborador</th>
                <th>Empresa</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sac, index) in data.sac" :key="index">
                <td>{{index+1}}</td>
                <td>{{sac.nota}}</td>
                <td>{{sac.colaborador}}</td>
                <td>{{sac.name}}</td>
                <td>{{sac.date | date}}</td>
                <td> <span :style="{background:sac.color}" style="color:#fff; padding:5px 7px; border-radius:3px;">{{sac.status}}</span> </td>
                <td>
                    <router-link :to="`/admin/sac/${sac.id}`" class="btn btn-outline-success">
                        <div class="glyph-icon simple-icon-eye"/>
                    </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
import { api } from '@/constants/config'

export default {
  components: {
  },
  data () {
    return {
        data: null
    }
  },
  methods: {
    async getSac(){
        const response = await api.get('admin/sac');
        this.data = response.data.data;
    }
  },
  created () {
      this.getSac();
  }
}
</script>
