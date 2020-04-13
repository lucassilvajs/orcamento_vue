<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="SAC">
          <form @submit="addSac">
            <b-row>
              <b-colxx md="6" class="mb-3">
                <b-row v-if="companiesValue">
                    <b-colxx>
                        <b-form-group label="Selecione a empresa">
                            <v-select v-model="setCompany"
                                :options="companiesValue" dir="ltr"></v-select>
                        </b-form-group>
                    </b-colxx>
                </b-row>
                <b-row>
                  <b-colxx xxs="12" md="6">
                  </b-colxx>
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
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import {
    VueAutosuggest
} from 'vue-autosuggest'
import {api} from '@/constants/config';
import takePhoto from '@/components/takePhoto';
export default {
  components: {
    'take-photo': takePhoto,
    'vue-autosuggest': VueAutosuggest,
    'v-select': vSelect,
	},
  data () {
    return {
      companiesValue: null,
      setCompany: null,
      companies: null,
      form: {
        colaborador: '',
        nota: '',
        sobre: ''
      },
      vueAutosuggestForm: {
        selected: {}
      },
    }
  },
  methods: {
    async addSac(e) {
      e.preventDefault();

      let image = window.localStorage.getItem('sac');
      let company = '';
      if(this.setCompany) {
        company = this.setCompany.code
      }
      const file = await api.post('sac', {...this.form, image, company});
      this.$notify("success", "Sucesso", "Sua solicitação foi enviada com sucesso", {
        duration: 3000,
        permanent: false
      });
      this.$router.push('/sac');
    },

    async getEmpresa() {
      const itemsFields = await api.get('company/fields');
      this.fields = itemsFields.data.data
      if(this.fields.colaborador){
        this.companies = this.fields.companies
        this.companiesValue = [];
        this.fields.companies.forEach((el, index) => {
          this.companiesValue.push({code: el.idCompany, label: el.company});
        });
      }
      const user = JSON.parse(window.localStorage.getItem('user'));
      if(user.user.colaborador) {
        const response = await api.get(`sac/companies`);
        this.companies = response.data.data;
      }
    },
    onAutoSuggestInputChange(text, oldText) {
      if (text === null) {
          /* Maybe the text is null but you wanna do
            *  something else, but don't filter by null.
            */
        return
      }

      const filteredData = this.suggestions[0].data.filter(option => {
        return option.name.toLowerCase().indexOf(text.toLowerCase()) > -1
      })

      // Store data in one property, and filtered in another
      this.filteredOptions = [{
        data: filteredData
      }]
    },
    onAutosuggestSelected(item) {
      this.vueAutosuggestForm.selected = item
    },
    renderSuggestion(suggestion) {
      const character = suggestion.item
      return character.name /* renderSuggestion will override the default suggestion template slot. */
    },
    getSuggestionValue(suggestion) {
      return suggestion.item.name
    },
  },
  created(){
    this.getEmpresa();
  }
}
</script>
