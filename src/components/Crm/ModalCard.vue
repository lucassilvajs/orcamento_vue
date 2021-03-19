<template>
  <div v-if="info">
    <div class="my-modal-card" :class="{ativo}">
      <div class="my-modal-content">
        <div class="my-modal-header d-flex justify-content-between align-items-center pb-4">
          <div class="card-info text-secondary">ID - #{{card}}</div>
            <div class="card-settings d-flex align-items-center flex-end">
                <div v-if="[4,5,6,7,8].indexOf(parseInt(info.card.idStage)) >= 0">
                  <router-link v-if="info.card.idCompany" :to="`/app/company/edit/${info.card.idCompany}`" class="btn btn-success btn-xs mr-3" @click="getInfo">Cadastrar empresa <i class="glyph-icon simple-icon-plus"/> </router-link>
                  <router-link v-else :to="`/app/company/card/${card}`" class="btn btn-success btn-xs mr-3" @click="getInfo">Cadastrar empresa <i class="glyph-icon simple-icon-plus"/> </router-link>
                </div>
                <div class="d-block d-md-inline-block pt-1">
                  <b-dropdown id="ddown1" text='Configurações' variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                      <b-dropdown-item >Excluir</b-dropdown-item>
                  </b-dropdown>
                </div>
              <button class="close" @click="ativo = !ativo">X</button>
            </div>
        </div>
        <div class="modal-card-body d-flex justify-content-between">
          <div class="form-area w-50 px-2">
            <h1 class="card-title mb-0 pb-0">{{info.card.title}}</h1>
            <h5 class="form-creator mb-3">Criado por {{info.card.consult}} - há {{info.card.date | timeSince}}</h5>
            <div class="control my-3">
              <button @click="areaActive = 1" :class="{'active' : (areaActive == 1)}"> <i class="glyph-icon iconsminds-filter-2"></i> Oportunidade </button>
              <button v-if="false" @click="areaActive = 2" :class="{'active' : (areaActive == 2)}"> <i class="simple-icon-paper-clip"></i> Anexos </button>
              <button @click="areaActive = 3" :class="{'active' : (areaActive == 3)}"> <i class="glyph-icon simple-icon-calendar"></i> Retorno <span>5</span> </button>
              <button @click="areaActive = 4" :class="{'active' : (areaActive == 4)}"> <i class="glyph-icon iconsminds-speach-bubble-6"></i> Comentários <span>5</span> </button>
              <button @click="areaActive = 5" :class="{'active' : (areaActive == 5)}"> <i class="glyph-icon simple-icon-clock"></i> Histórico <span>5</span> </button>
            </div>

            <Oportunidade v-if="areaActive == 1 && info" :fields="filterFields(0)" :id="card"/>

            <Anexos v-if="areaActive == 2" />

            <Retorno v-if="areaActive == 3" />

            <Comentarios v-if="areaActive == 4" :comments="comments"/>

            <Historico v-if="areaActive == 5" :history="comments"/>

          </div>
          <div class="atual text-left w-50 px-2">
            <h3 class="fase-atual">Fase atual</h3>
            <div class="d-flex justify-content-between">
              <h2 class="fase-name">{{info.card.stage}}</h2>
                <div class="d-block d-md-inline-block pt-1">
                  <b-dropdown id="ddown1" text='Alterar fase' variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                    <b-dropdown-item v-for="(s, i) in info.fields.map(r => r.stage)" :key="i" @click="changeStatus(s.id)" :disabled="s.id == info.card.idStage">{{s.name}}</b-dropdown-item>
                  </b-dropdown>
                </div>
            </div>
            {{filterFields(info.card.idStage)}}
            <FormDinamic :fields="filterFields(info.card.idStage)" :id="card" />
          </div>
        </div>
        <div class="modal-card-footer d-flex justify-content-end">
          <h6 v-if="isSave">Salvando...</h6>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import {api, baseURL} from '@/constants/config';
import VueDropzone from 'vue2-dropzone';

import Oportunidade from '@/components/Crm/card/Oportunidade';
import FormDinamic from '@/components/Crm/card/FormDinamic';
import Anexos from '@/components/Crm/card/Anexos';
import Retorno from '@/components/Crm/card/Retorno';
import Comentarios from '@/components/Crm/card/Comentarios';
import Historico from '@/components/Crm/card/Historico';

export default {
  components: {
    TheMask,
    Money,
    'vue-dropzone': VueDropzone,
    Oportunidade,
    Anexos,
    Retorno,
    Comentarios,
    Historico,
    FormDinamic
  },
  props:['card'],
  data () {
    return {
      ativo: 1,
      info: null, // Salva informações
      selectedValueSingle: '',
      step: [
        {id: 1, name: 'Prospecção / Contato Inicial'},
        {id: 2, name: 'Follow-Up'},
        {id: 3, name: 'Agendamento (Visita, videoconferencia)'},
      ],
      areaActive: 1,
      comments: [{added: "2021-03-09 11:21:48",content: "Edimaura tecnica de segurança relatou que compra de uma ótica local a qual fornece em até 7 dias mandei apresentação e retornarei o contato 11/ 03!", stage: "Follow-up",user: null}],
      fields: null,
      isSave: false
    }
  },
  computed: {
    dropzoneOptions: function() {
      const token = window.localStorage.getItem('token');
      return {
        url: `${baseURL}saveFile/crm`,
        thumbnailWidth: 150,
        headers: { "X-Auth-Token": token },
        dictDefaultMessage: "Arraste ou clique para adicionar",
        previewTemplate: this.dropzoneTemplate(),
      }
    }
  },
  methods: {
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview mb-3">
          <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
              <div class="dz-error-mark"><span><i></i>  </span></div>
              <div class="dz-success-mark"><span><i></i></span></div>
              <div class="preview-container">
                <img data-dz-thumbnail class="img-thumbnail border-0" />
                <i class="simple-icon-doc preview-icon"></i>
              </div>
          </div>
          <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
            <div> <span data-dz-name /> </div>
            <div class="text-primary text-extra-small" data-dz-size /> </div>
            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
            <div class="dz-error-message"><span data-dz-errormessage></span></div>
          </div>
          <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
        </div>`
    },
    completeUpload(file) {
      this.file = file;
      this.saveProduct.image = JSON.parse(file.xhr.response).data;
    },
    filterFields(index){
      return this.info.fields[index].fields
    },
    isJson(c){
      return true;
    },
    async getInfo(){
      const data = await api.get(`crm/info/${this.card}`);
      if(data.data.status == 'success') {
        this.info = data.data.data
      }
    },
    async changeStatus(id){
      const data = await api.put('crm', {
        stage: id,
        card: this.card
      });

      this.getInfo();
    }
  },
  created(){
    this.getInfo();
  },
  watch: {
    ativo(){
      this.$emit('modal', this.ativo)
    }
  }
}
</script>


<style>
  .my-modal-card:before {
    content: "";
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
    z-index: 10;
  }

  .my-modal-card {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0px;
    left: 0px;
    width: 100%;
    padding: 20px;
    display: none;
  }

  .my-modal-card.ativo {
    display: block;
  }

  .my-modal-content {
    border-radius: 4px;
    position: relative;
    margin: 80px auto;
    background: #ffffff;
    padding: 30px;
    max-width: 80vw;
    animation: fadeInDown .3s forwards;
    z-index: 10;
    height: 75vh;
  }

  .modal-card-body{
    height: 90%;
  }

  /* Card */
  .card-title {
    font-weight: bold;
    font-size: 1.2rem;
  }

  .control button {
    background: #fff;
    border: 1px solid #aaa;
    margin-right: 5px;
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 2px 8px;
  }

  .control button.active {
    background: rgba(1, 153, 170, .2);
    color: rgba(1, 153, 170, 1);
    border: 1px solid currentColor;
  }

  .control button span{
    background: rgba(1, 153, 170, .2);
    color: rgba(1, 153, 170, 1);
    padding: 0 2px;
  }

  .oportunidade {
    height: 90%;
  }

  .form-basic {
    height: 80%;
    overflow: auto;
  }

  .form-label{
    font-weight: bold;
    font-size: 1rem;
  }

  .form-creator {
    color: #777;
    font-weight: bold;
    font-size: .72rem;
  }

  .my-modal-card .label {
    margin-bottom: 15px
  }

  .my-modal-card .label h4{
    font-weight: bold;
    color: #444;
    font-size: .9rem;
    margin-bottom: 0;
  }

  .my-modal-card .label h6 {
    position: relative;
    color: #aaa;
    font-size: .8rem;
    font-weight: bold;
    margin-top: 5px;
    cursor: pointer;
  }

  .my-modal-card .label h6.empty {
    color: #ccc;
    border-bottom: 1px dashed #aac;
  }

  .my-modal-card .label div.empty {
    display: block;
    height: 80px;
    background: #f5f4f4;
    line-height: 145px;
    color: #cdcdcd;
    cursor: pointer;
    font-weight: bold;
    border-bottom: 1px dashed #aac;
  }

  .my-modal-card .label h6:not(.empty):hover:after{
    content: 'Editar';
    position: absolute;
    right: 0;
    font-size:.6rem;
    color: #aac;
  }


  /* Retorno */
  .retorno, .comment, .historic {
    overflow: auto;
    height: calc(100% - 100px);
  }


/* ATUAL */

  .fase-atual {
    font-weight: bold;
    font-size: 1rem;
  }

  .fase-name{
    font-size: 1.2rem;
    font-weight: bold;
    color: rgb(1, 153, 170);
    background: rgba(1, 153, 170, .1);
    display: inline;
  }



  @keyframes fadeInDown {
    from {
      transform: translate3d(0, -30px, 0);
      opacity: 0;
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0px, 0);
    }
  }
</style>
