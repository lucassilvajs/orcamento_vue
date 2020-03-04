<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4">
          <router-link to="/sac/new" class="btn btn-success float-right">Abrir solicitação</router-link>
          <h4 class="card-title">Solicitações</h4>
          <table class="table">
              <thead>
                  <tr>
                      <th>#</th>
                      <th>Colaborador</th>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Ações</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                      <td>{{index + 1}}</td>
                      <td>{{item.colaborador}}</td>
                      <td>{{item.date | date}}</td>
                      <td><span class="badge py-2 px-3" :style="{'background': item.color, 'color': '#fff'}">{{item.status}}</span></td>
                      <td>
                        <router-link :to="`/sac/view/${item.id}`" class="btn btn-outline-success btn-sm">
                          <div class="glyph-icon simple-icon-eye"/>
                        </router-link>
                      </td>
                  </tr>
              </tbody>
          </table>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import {api} from '@/constants/config';
export default {
  data () {
    return {
      items: null,
    }
  },
  methods: {
    async getOrder() {
      const items = await api.get('/sac');
      this.items = items.data.data 
    }
  },
  created(){
    this.getOrder();
  }
}
</script>
