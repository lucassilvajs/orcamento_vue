<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Nova empresa</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
  <input type="hidden" v-model="currentCompany.card">
            <InformacaoEmpresa />

            <InformacaoEndereco />

            <InformacaoPagamento :pagamento="option.pagamento" />

            <InformacaoAdicional :transporte="option.transporte" />

            <InformacaoObservacao />

            <PrecosDinamicos />

            <ProdutosRestritos />

            <ProdutosEspecificos />

            <AddUsuario />

        </b-colxx>
        <b-colxx>
            <b-button variant="success" :disabled="processing" :class="{'mb-3 btn-multiple-state btn-shadow ml-3': true,
                'show-spinner': processing,
                'show-success': !processing }" @click="addCompany">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Cadastrar empresa
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Cadastrar empresa</span>
            </b-button>
        </b-colxx>
    </b-row>

</div>
</template>

<script>
import AddUsuario from '@/components/Company/AddUsuario'
import ProdutosEspecificos from '@/components/Company/ProdutosEspecificos'
import InformacaoEmpresa from '@/components/Company/InformacaoEmpresa'
import InformacaoEndereco from '@/components/Company/InformacaoEndereco'
import InformacaoPagamento from '@/components/Company/InformacaoPagamento'
import InformacaoAdicional from '@/components/Company/InformacaoAdicional'
import InformacaoObservacao from '@/components/Company/InformacaoObservacao'
import PrecosDinamicos from '@/components/Company/PrecosDinamicos'
import ProdutosRestritos from '@/components/Company/ProdutosRestritos'

import {
    mapGetters,
    mapActions
} from "vuex";
import {Money} from '@/vmoney.js';
import {TheMask} from 'vue-the-mask';
import {api, baseURL} from '@/constants/config';
import InputTag from '@/components/Form/InputTag'
export default {
    components:{
        'input-tag': InputTag,
        Money,
        TheMask,
        AddUsuario,
        ProdutosEspecificos,
        InformacaoEmpresa,
        InformacaoEndereco,
        InformacaoPagamento,
        InformacaoAdicional,
        InformacaoObservacao,
        PrecosDinamicos,
        ProdutosRestritos,
    },
    data() {
        return {
          baseURL,
          color: {
              name: '',
              image: ''
          },
          file: null,
          option: {
            pagamento: [],
            transporte: [],
            pdfanexo: []
          },
          consultores: [],
          settings: null
        }
    },
    computed: {
      ...mapGetters(["currentCompany", "processing"]),
    },
    methods: {
        ...mapActions(["loading", "getCompany", "buscaCep", "addCompany"]),

        addRestrition(value){
          this.restricoes.push(value)
        },
        async getOption(){
          [{id: 1, type: 'pagamento'}, {id: 2, type: 'transporte'}].forEach(async e => {
            const data = await api.get(`/option/${e.id}`)
            this.option[e.type] = data.data.data;
          })
        },

        async MygetCompany() {
          this.getCompany({id: 0});
          await this.getCard();
        },
        async getCard() {
          let id = this.$route.params.id
          const data = await api.get(`crm/card/${id}`);
          let resp = data.data.data;
          setTimeout(() => {

              this.currentCompany.celular = resp.celular;
              this.currentCompany.email = resp.email;
              this.currentCompany.fone = resp.fone;
              this.currentCompany.name = resp.name;
              this.currentCompany.cnpj = resp.cnpj;
              this.currentCompany.card = id;
            }, 1000);
        }
      },
      async created(){
          await this.getOption();
          await this.MygetCompany();
      }
}
</script>

<style>
.product_title{
    position: absolute;
    bottom: 0;
    background: #fff;
    width: 100%;
    text-shadow: 1px 1px 2px rgba(0,0,0,.2);
    font-size: 1.1rem;
    padding: 5px 0;
}

div#dropzone{
    position: relative;
}
div#dropzone::after {
    content: 'Logo';
    position: absolute;
    top: -10px;
    left: 10px;
    color: #888;
    font-size: 90%;
    padding: 0 3px;
    background: #fff;
}

.product_title{
  position: absolute;
  bottom: 0;
  background: #fff;
  width: 100%;
  text-shadow: 1px 1px 2px rgba(0,0,0,.2);
}

.area-drop{
  width: 100%;
  min-height: 300px;
}

.list-group{
  height: 100%;
  width: 100%;
}

.min-height {
  min-height: 200px;
}

.image-drag{display: none; transition:.5s;}
.image-hover:hover .image-drag {
  cursor: pointer;
  display: flex;
  top:0;
  left:0;
  background: rgba(100,100,100,.5);
}

.form-my {
  border:2px solid #ccc; height:26px; width:100px; border-radius: 3px;
}
</style>
