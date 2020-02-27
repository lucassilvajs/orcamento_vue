<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="SAC">
          <form>
            <b-row>
              <b-colxx md="6" class="mb-3">
                <b-row>
                  <b-colxx md="12">
                    <label for="">Nome do colaborador</label>
                    <input type="text" class="form-control" placeholder="Nome do colaborador">
                  </b-colxx>
                  <b-colxx md="12">
                    <label for="">Número da nota fiscal</label>
                    <input type="text" class="form-control" placeholder="Número da nota fiscal">
                  </b-colxx>
                  <b-colxx md="12" class="mt-3">
                    <label for="">Conte-nos o que aconteceu</label>
                    <textarea rows="4" class="form-control"></textarea>
                  </b-colxx>
                </b-row>
              </b-colxx>
              <b-colxx md="6">
                <label for="">Envie uma foto</label>
                <take-photo style="max-width:500px;" sac="1" target="sac"/>
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
    }
  },
  methods: {
  },
  created(){
  }
}
</script>
