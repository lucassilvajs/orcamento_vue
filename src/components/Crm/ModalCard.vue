<template>
  <b-modal id="cardCrm" ref="cardCrm" :title="`Card #${card}`" size="xl" hide-footer>
    <div class="my-modal-content" v-if="card">
      <div class="my-modal-header d-flex justify-content-between align-items-center pb-4">
        <div class="card-settings d-flex align-items-center flex-end" v-if="info">
            <div v-if="[4,5,6,7,8].indexOf(parseInt(info.card.idStage)) >= 0">
              <router-link v-if="info.card.idCompany" :to="`/app/company/edit/${info.card.idCompany}`" class="btn btn-success btn-xs mr-3 text-white">Cadastrar empresa <i class="glyph-icon simple-icon-plus"/> </router-link>
              <router-link v-else :to="`/app/company/card/${card}`" class="btn btn-success btn-xs mr-3 text-white">Cadastrar empresa <i class="glyph-icon simple-icon-plus"/> </router-link>
            </div>
            <div class="d-block d-md-inline-block pt-1">
            </div>
        </div>
      </div>
      <div class="modal-card-body d-flex justify-content-between" v-if="info">
        <div class="form-area w-50 px-2">
          <h1 class="card-title mb-0 pb-0">{{info.card.title}}</h1>
          <h5 class="form-creator mb-3">Atríbuido a
            
            <b-dropdown id="ddown2" :text="consultAtrib ? consultAtrib : info.card.consult" variant="link" class="btn-group " size="xs">
              <b-dropdown-item v-for="consultor in consultores" :key="consultor.user_id" @click="setConsult(consultor.user_id)">{{consultor.user_name}}</b-dropdown-item>
            </b-dropdown>  - Criado há {{info.card.date | timeSince}}</h5>
          
          
          <b-dropdown id="ddown1" text='Configurações' variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
            <b-dropdown-item @click="deleteCard">Excluir </b-dropdown-item>
            <b-dropdown-item v-if="info.card.idSrd" @click="removeSDR">Remover SDR</b-dropdown-item>
            <b-dropdown-item v-else @click="atribuiSDR">Atríbuir ao SDR</b-dropdown-item>
          </b-dropdown>
          
          
          <div class="d-block control my-3">
            <button @click="areaActive = 1" :class="{'active' : (areaActive == 1)}"> <i class="glyph-icon iconsminds-filter-2"></i> Oportunidade </button>
            <button v-if="false" @click="areaActive = 2" :class="{'active' : (areaActive == 2)}"> <i class="simple-icon-paper-clip"></i> Anexos </button>
            <button @click="areaActive = 3" :class="{'active' : (areaActive == 3)}"> <i class="glyph-icon simple-icon-calendar"></i> Retorno </button>
            <button @click="areaActive = 4" :class="{'active' : (areaActive == 4)}"> <i class="glyph-icon iconsminds-speach-bubble-6"></i> Comentários </button>
            <button @click="areaActive = 5" :class="{'active' : (areaActive == 5)}"> <i class="glyph-icon simple-icon-clock"></i> Histórico </button>
          </div>

          <Oportunidade v-if="areaActive == 1 && info" :fields="filterFields(0)" :id="card"/>

          <Anexos v-if="areaActive == 2" />

          <Retorno v-if="areaActive == 3" :id="card"/>

          <Comentarios v-if="areaActive == 4" :id="card"/>

          <Historico v-if="areaActive == 5" :id="card"/>

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
          <FormDinamic :fields="filterFields(info.card.idStage)" :id="card" />
        </div>
      </div>
      <div v-else class="d-flex align-items-center justify-content-center h-100">
        <h3>Buscando informações...</h3>
      </div>
      <div class="modal-card-footer d-flex justify-content-end">
        <h6 v-if="isSave">Salvando...</h6>
      </div>
    </div>
  </b-modal>
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
      consultAtrib: false,
      ativo: false,
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
      this.areaActive = 1;
      this.consultAtrib = false;
      this.ativo = true;
      this.info = null
      if(this.card) {
        const data = await api.get(`crm/info/${this.card}`);
        if(data.data.status == 'success') {
          this.info = data.data.data.card
          this.consultores = data.data.data.consultores
        }
      }
    },
    async changeStatus(id){
      const data = await api.put('crm', {
        stage: id,
        card: this.card
      });

      this.getInfo();
    },
    async deleteCard(){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: 'Você deseja realmente excluir esse card',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#3d3',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          const response = await api.delete(`/crm/${this.card}`);
          this.$notify(response.data.status, response.data.status == 'error' ? 'Opsss' : 'Sucesso', response.data.message, {
            duration: 3000,
            permanent: false
          });

          if(response.data.status == 'success') {
            this.ativo = false;
          }

          return response.data.status;
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {

      })
    },    
    async atribuiSDR(){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: 'Você deseja atribuir ao SDR esse card',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#3d3',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          const response = await api.put(`/crm/sdr/${this.card}/add`);
          this.$notify(response.data.status, response.data.status == 'error' ? 'Opsss' : 'Sucesso', response.data.message, {
            duration: 3000,
            permanent: false
          });

          if(response.data.status == 'success') {
            this.ativo = false;
          }

          return response.data.status;
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {

      })
    },
    async removeSDR(){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: 'Você deseja remover o SDR esse card',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#3d3',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          const response = await api.put(`/crm/sdr/${this.card}/remove`);
          this.$notify(response.data.status, response.data.status == 'error' ? 'Opsss' : 'Sucesso', response.data.message, {
            duration: 3000,
            permanent: false
          });

          if(response.data.status == 'success') {
            this.ativo = false;
          }

          return response.data.status;
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {

      });
    },
    async setConsult(idConsult){
      this.$swal.fire({
        title: "Você está certo disso?",
        text: 'Você deseja alterar o responsável do card?',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#3d3',
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          const response = await api.put(`/crm/sdr/${this.card}/update`, {idConsult});
          this.$notify(response.data.status, response.data.status == 'error' ? 'Opsss' : 'Sucesso', response.data.message, {
            duration: 3000,
            permanent: false
          });

          if(response.data.status == 'success') {
            this.ativo = false;
          }

          return response.data.status;
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        this.consultAtrib = this.consultores.filter(r => r.user_id == idConsult)[0].user_name;
      });
    }
  },
  watch: {
    card(){
      this.getInfo();
    },
    ativo(){
      this.$emit('modal', this.ativo)
    }
  }
}
</script>


<style>
  .modal-card-body{
    height: 90%;
  }

  /* Card */
  .my-modal-card .card-title {
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

.status-item {
    padding: 8px;
    background: #eee;
}

.title-active{
  font-size: 1rem;
}

span.time {
    font-size: .75rem;
    color: #aaa;
}

.description {
    margin-left: calc(1rem + 28px);
    border: 1px solid #aaa;
    padding: 10px;
    font-weight: bold;
    color: #aaa;
}

.status-item.success {
  background: #afa;
  color: #363;
}

.status-item.info {
  background: #4ad;
  color: #059;
}

.status-item.warning {
  background: #ff5;
  color: #990;
}

.status-item.danger {
  background: #faa;
  color: #633;
}

.comments .profile {
  border-radius: 50%;

}

.comments h3 {
  font-size: 1rem;
}

.comments .description {
  background: #efefef;
  color: #466;
}

.description-info {
  font-size: .7rem;
  margin-top: 15px;
  color: #899;
}

.text-area {
  width: 100%;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  background: #efefef;
  justify-content: space-between;
}

.text-area input {
  height: 50px;
  border: 0;
  width: 85%;
  padding: 5px 10px;
}

.text-area button {
  border-radius: 50%;
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

/* Load */
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 39px;
    left: 3px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 14px;
    left: -22px;
    width: 50px;
    height: 50px;
    opacity: 0;
  }
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
