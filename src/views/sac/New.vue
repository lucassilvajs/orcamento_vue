<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="SAC">
          <form @submit="addSac">
            <b-row>
              <b-colxx md="6" class="mb-3">
                <b-row>
                  <b-colxx md="12">
                    <label for="">Nome do colaborador</label>
                    <input v-model="form.colaborador" type="text" class="form-control mb-3" placeholder="Nome do colaborador">
                  </b-colxx>
                  <b-colxx md="12">
                    <label for="">Número da nota fiscal</label>
                    <input v-model="form.nota" type="text" class="form-control mb-3" placeholder="Número da nota fiscal">
                  </b-colxx>
                  <b-colxx md="12">
                    <label for="">Conte-nos o que aconteceu</label>
                    <textarea v-model="form.sobre" placeholder="Conte-nos o que aconteceu" rows="4" class="form-control mb-3"></textarea>
                  </b-colxx>
                </b-row>
              </b-colxx>
              <b-colxx md="6">
                <label for="">Envie uma foto</label>
                <take-photo style="max-width:500px;" sac="1" target="sac"/>
              </b-colxx>
            </b-row>
            <b-row>
              <b-colxx>
                <button class="btn btn-success float-right mt-3">Solicitar atendimento</button>
              </b-colxx>
            </b-row>
          </form>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import {api} from '@/constants/config';
import takePhoto from '@/components/takePhoto';
export default {
  components: {
        'take-photo': takePhoto,
	},
  data () {
    return {
      form: {
        colaborador: '',
        nota: '',
        sobre: ''
      }
    }
  },
  methods: {
    async addSac(e) {
      e.preventDefault();

      let image = window.localStorage.getItem('sac');
      const file = await api.post('sac', {...this.form, image});
      this.$notify("success", "Sucesso", "Sua solicitação foi enviada com sucesso", {
        duration: 3000,
        permanent: false
      });
      this.$router.push('/sac/view');
    }
  },
  created(){
  }
}
</script>
