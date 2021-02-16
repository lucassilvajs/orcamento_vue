<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <h1>Usuários do sistema</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row v-if="false">
    <b-colxx md="4" lg="3">
        <b-form-group label="Status" class="has-float-label mb-4">
            <select v-model="filter.status" id="status" class="form-control">
              <option value="">Todos</option>
              <option v-for="(status, index) in data.status" :key="status" :value="index">{{status}}</option>
            </select>
        </b-form-group>
    </b-colxx>
    <b-colxx md="8" lg="9">
        <button class="btn btn-outline-success float-right" @click="getUserAdmin()">Buscar</button>
    </b-colxx>
  </b-row>
  <b-row class="mb-5">
    <b-colxx xxs="12">
      <b-card class="mb-4" title="Usuários do sistema">
        <div class="table-responsive" v-if="data.user.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody v-if="data.user">
              <tr v-for="(user, index) in data.user" :key="index">
                <td>{{index + 1}}</td>
                <td>{{user.vendedor ? user.vendedor : 'Não atribuido'}}</td>
                <td>{{user.email}}</td>
                <td>
                  <router-link :to="`/admin/user/edit/${user.id}`" class="btn btn-outline-info">
                    <div class="glyph-icon simple-icon-pencil"></div>
                  </router-link>
                  <b-button variant="outline-danger" @click="deleteUser(user.id)">
                    <div class="glyph-icon simple-icon-trash"></div>
                  </b-button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="comp in 10" :key="comp">
                <td colspan="5" class="demo"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <div class="alert alert-info">Nenhum usuário foi encontrado!</div>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
import { api, baseURL } from '@/constants/config'

export default {
  components: {
  },
  data () {
    return {
      current: null,
      index: null,
      filter: {
        status: ''
      },
      baseURL,
      data: null,
      modal: {
        title: '',
        nota: '',
        colaborador: '',
        name: '',
        date:''
      }
    }
  },
  methods: {
    async getUserAdmin(){
      const filter = (this.filter.status ? this.filter.status : '');
      const response = await api.get(`admin/user/${filter}`);
      this.data = response.data.data;
      this.current = response.data.data.current;
    },
    async deleteUser(id) {
      const response = await api.put(`admin/user/delete/${id}`);
      if(response.data.status == 'success') {
        this.$notify("success", "Sucesso", "Usuário excluído com sucesso", {
            duration: 3000,
            permanent: false
        });
        this.getUserAdmin();
      }else{
        this.$notify("error", "Ops!!!", response.data.message, {
            duration: 3000,
            permanent: false
        });
      }
    }
  },
  created () {
      this.getUserAdmin();
  }
}
</script>
<style>
.demo {
  margin: auto;
  width: 100%;
  height: 30px;
  background-image: linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% );
  background-repeat: repeat-y;
  background-size:50px 200px;
  background-position: 0 0;
}

.demo:nth-child(odd) {
  animation: shine 1s infinite;
}

.demo:nth-child(even) {
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
  background-position:100% 0;
  }
}
</style>
