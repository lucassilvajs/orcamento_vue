<template>
<div>
    <b-row class="mb-3">
      <b-colxx>
        <b-card>
          <b-row class="align-items-center justify-content-between">
            <b-colxx xl="3" xs="12">
              <div class="d-block d-md-inline-block pt-1 w-100">
                  <div class="search-sm d-inline-block float-md-left mr-1 align-top w-100">
                      <b-input placeholder="Buscar" v-model="search" />
                  </div>
              </div>
            </b-colxx>
            <b-colxx xl="3" xs="12">
              <b-button v-b-modal.modalPipe class="float-right" variant="outline-success"> <div class="glyph-icon simple-icon-plus"/> </b-button>
            </b-colxx>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row class="flex-nowrap h-100" v-if="pipe.length">

      <b-colxx md="3" v-for="(p, indexPipe) in pipe" :key="indexPipe">
        <b-card class="full-height p-3" no-body>
          <b-card-header class="d-flex justify-content-between align-items-start">
            <h6 class="title">{{p.name}}</h6>

            <div class="text-right">
              <span class="badge badge-info">{{p.cards.length}}</span>
            </div>

          </b-card-header>
          <b-card-body class="p-1 card-area">
            <draggable :list="p.cards" :group="{ name: 'people'}" style="height:100%;">
                  <div v-for="(c, cIndex) in p.cards" :key="cIndex" @click="setInfoModal(indexPipe, cIndex)">
                    <card v-b-modal.modalCard class="mt-2 mb-3 p-3" :pipe="c" />
                  </div>
            </draggable>
          </b-card-body>
        </b-card>
      </b-colxx>
    </b-row>

      <b-modal id="modalPipe" ref="modalPipe" title="Adicionar card" modal-class="modal-right">
          <b-row>
            <b-colxx md="12" lg="12" v-for="(card, cardIndex) in cardsInput" :key="cardIndex">
              <b-form-group v-if="card.type == 'text'" :label="card.name" class="has-float-label mb-4">
                <b-form-input type="text" v-model="cardValue[card.id]" />
              </b-form-group>
              <b-form-group v-if="card.type == 'mask' && card.name == 'CNPJ'" :label="card.name" class="has-float-label mb-4">
                <the-mask class="form-control" v-model="cardValue[card.id]" :mask="['##.###.###/####-##', '###.###.###-##']" />
                <b-alert variant="warning">{{ $t('alert.dark-text') }}</b-alert>
              </b-form-group>
              <b-form-group v-if="card.type == 'mask' && card.name == 'Telefone'" :label="card.name" class="has-float-label mb-4">
                <the-mask class="form-control" v-model="cardValue[card.id]" :mask="['(##) ####-####']" />
              </b-form-group>
              <b-form-group v-if="card.type == 'mask' && card.name == 'Celular'" :label="card.name" class="has-float-label mb-4">
                <the-mask class="form-control" v-model="cardValue[card.id]" :mask="['(##) # ####-####']" />
              </b-form-group>
              <b-form-group v-if="card.type == 'checkbox'" :label="card.name">
                <b-form-checkbox-group>
                  <b-form-checkbox v-for="(c, i) in card.attr" :key="i" :value="c">{{c}}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </b-colxx>
            <b-colxx md="12" lg="12">
            <span class="title col-form-label">Consultor responsável</span>
              <b-input-group class="mb-3">
                <b-form-select v-model="aux.consult" :options="consultores"></b-form-select>
                <b-input-group-append>
                    <b-button @click="addConsultMultiple" variant="outline-success"> + </b-button>
                </b-input-group-append>
            </b-input-group>

            <span v-for="(c, i) in aux.arrConsult" :key="c" href="#" class="tag-label">{{c}} <button @click="aux.arrConsult.splice(i,1)" >X</button> </span>
              <!-- <b-form-group label="Consultor responsável" class="has-float-label mb-4">
                <b-form-select v-model="cardValue[10]" :options="consultores"></b-form-select>
              </b-form-group> -->
            </b-colxx>
          </b-row>
          <template slot="modal-footer">
            <b-button variant="success" @click="somethingModal('modalright')" class="mr-1">Cadastrar</b-button>
            <b-button variant="secondary" @click="hideModal('modalright')">Cancelar</b-button>
          </template>
      </b-modal>

      <b-modal v-if="modal" id="modalCard" size="lg" ref="modalCard" :title="modal.title">
        <ul class="nav nav-tabs justify-content-center text-center">
          <li class="nav-item step-done">
            <a v-b-toggle.collapseInfo href="#" class="nav-link">
              <span class="d-block">Informações</span>
            </a>
          </li>
          <li class="nav-item step-done">
            <a v-b-toggle.collapseHistoric href="#" class="nav-link">
              <span class="d-block">Histórico</span>
            </a>
          </li>
          <li class="nav-item step-done">
            <a v-b-toggle.collapseComments href="#" class="nav-link">
              <span class="d-block">Comentário</span>
            </a>
          </li>
          <li class="nav-item step-done" v-if="[4,5,6,7,8].indexOf(parseInt(modal.stage)) >= 0 && modal.isCreator">
            <a v-b-toggle.collapseAdd href="#" class="nav-link">
              <span class="d-block">Cadastrar</span>
            </a>
          </li>
        </ul>
        <b-collapse visible id="collapseInfo" accordion="my-accordion">
          <div class="p-4">
            <b-row>
              <b-colxx md="4" sm="12" lg="4" v-for="(card, cardIndex) in modal.items.filter(r => ['11'].indexOf(r.id) == -1 )" :key="cardIndex">
                <b-form-group :label="card.label" class="has-float-label mb-4">
                  <b-form-input type="text" v-model="card.value" />
                </b-form-group>
              </b-colxx>
            </b-row>
          </div>
        </b-collapse>

        <b-collapse id="collapseHistoric" accordion="my-accordion">
          <div class="p-4">
            <div class="actives mb-3 d-flex flex-column" v-for="(historic, historicIndex) in modal.historic" :key="historicIndex">
              <div class="d-flex align-items-start">
                <div :class="'mr-3 status-item ' + historic.color">
                  <div :class="'glyph-icon ' + historic.icon"/>
                </div>
                <div>
                  <h3 class="title-active mb-0">{{historic.title}}</h3>
                  <span class="time">{{historic.added | datestring}}</span>
                </div>
              </div>
              <div v-if="historic.description" class="description">
                {{historic.description}}
              </div>
            </div>
          </div>
        </b-collapse>

        <b-collapse id="collapseComments" accordion="my-accordion">
          <div class="p-4">
              <div class="comments-area">
                <div class="comments d-flex align-items-start mb-5" v-for="(comment, commentIndex) in modal.comment" :key="commentIndex">
                  <img class="profile mr-3" src="http://via.placeholder.com/30" alt="Avatar">
                  <div>
                    <h3>{{comment.user.name}}</h3>
                    <div class="description ml-0">
                      {{comment.content}}
                      <div class="description-info">
                        {{comment.added | datestring}} {{comment.stage}}
                      </div>
                    </div>
                  </div>
                </div>
                <b-alert v-if="!modal.comment.length" show variant="info">Nenhum comentário foi adicionado</b-alert>
              </div>
              <div class="comment-area" v-if="modal.isCreator">
                <div class="text-area">
                  <input type="text" v-model=modal.txtComment>
                  <button @click="addComment(modal.id)" class="btn btn-info">
                    <div v-if="processing" class="lds-ripple"><div></div><div></div></div>
                    <div v-else :class="'glyph-icon simple-icon-paper-plane'"/>
                  </button>
                </div>
              </div>
          </div>
        </b-collapse>

        <b-collapse visible id="collapseAdd" accordion="my-accordion">
          <addcompany />
        </b-collapse>

        <template slot="modal-footer">
            <b-button variant="outline-secondary" @click="hideModal('modalCard')">Fechar</b-button>
        </template>
      </b-modal>
</div>
</template>

<script>

import {api, baseURL, firebaseConfig} from '@/constants/config';
import { generateChart } from 'vue-chartjs';
import Firebase from 'firebase';
import {TheMask} from 'vue-the-mask';
import Card from '@/components/Crm/Card'
import AddCompany from '@/components/Crm/AddCompany'
import Draggable from 'vuedraggable'

export default {
    components: {
      'draggable': Draggable,
      'card': Card,
      TheMask,
      'addcompany': AddCompany
    },
    data() {
      return {
        company: {},
        aux: {
          consult: '',
          arrConsult: []
        },
        cardValue: {},
        consultores: [
          "Lucas de Jesus",
          "Felipe Migliorini",
          "Carlos Nunes"
        ],
        cardsInput: [
          {
            id: 1,
            name: 'Nome da empresa',
            type: 'text',
            attr: ''
          },
          {
            id: 2,
            name: 'Região',
            type: 'text',
            attr: ''
          },
          {
            id: 3,
            name: 'CNPJ',
            type: 'mask',
            attr: ['##.###.###/####-##', '###.###.###-##']
          },
          {
            id: 4,
            name: 'Nome do contato',
            type: 'text',
            attr: ''
          },
          {
            id: 5,
            name: 'Cargo do Contato',
            type: 'text',
            attr: ''
          },
          {
            id: 6,
            name: 'E-mail',
            type: 'email',
            attr: ''
          },
          {
            id: 7,
            name: 'Celular',
            type: 'mask',
            attr: ['(##) # ####-####']
          },
          {
            id: 8,
            name: 'Telefone',
            type: 'mask',
            attr: ['(##) ####-####']
          },
          {
            id: 9,
            name: 'Produto ou serviço',
            type: 'checkbox',
            attr: ['Óculos de Segurança Graduado', 'In Company', 'Licitação']
          },
        ],
        pipe: {},
        search: '',
        modal: false,
        processing: false
      }
    },
    methods:{
      addPipe() {
        let obj = {
          "creator": 5,
          "title": "Marchesan",
          "assign": [1],
          "items": [
              {
                  "label": "Nome da empresa",
                  "value": "Marchesan"
              },
              {
                  "label": "Região",
                  "value": "São Paulo"
              },
              {
                  "label": "CNPJ",
                  "value": "441.754.508/0001-24"
              }
          ],
          "added": new Date(),
          "comment": [],
          "historic": [
              {
                  "title": "Card criado",
                  "color": "success",
                  "icon": "simple-icon-plus",
                  "description": "O card foi criado.",
                  "user": 5,
                  "userName": "Lucas de Jesus",
                  "added": new Date()
              },
          ]}
        this.pipe[0].cards.push(obj);
      },
      addConsultMultiple(){
        this.aux.arrConsult.push(this.aux.consult)
        this.aux.arrConsult = this.aux.arrConsult.filter( (value, index, self) => {return self.indexOf(value) === index} );
      },
      setInfoModal(pipe, index){
        this.modal = [];
        console.log(index)
        console.log(this.pipe[pipe].cards[index])
        this.modal = this.pipe[pipe].cards[index];
        this.modal.stage = this.pipe[pipe].id
      },
      hideModal (refname) {
        this.$refs[refname].hide()
        console.log('hide modal:: ' + refname)

        if (refname === 'modalnestedinline') {
          this.$refs['modalnested'].show()
        }
      },
      somethingModal (refname) {
        this.$refs[refname].hide()
        console.log('something modal:: ' + refname)

        if (refname === 'modalnestedinline') {
          this.$refs['modalnested'].show()
        }
      },
      async getPipe(){
        const data = await api.get('crm');
        this.pipe = data.data.data
      },
      async addComment(card){
        this.processing = true

        const data = await api.post('crm/comment/', {
          value: this.modal.txtComment,
          id: this.modal.id
        });

        this.modal.comment = data.data.data.comment;

        this.modal.txtComment = '';
        this.processing = false

      },
      async MoveCard(){

      }
    },
    created(){
      this.getPipe()
    }
}
</script>

<style scoped>

.painel {
  flex-wrap: nowrap;
}

.full-height {
  height: calc(100vh - 130px);
}

::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #aaa;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.card-area {
  overflow: auto;
}

.tag-label {
  padding: 3px 8px;
  border:1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  display: block;

}

.tag-label button {
  padding: 3px;
  background: transparent;
  border: 0;
  float: right;
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

a:not(.collapsed) {
  color: #00b3b7!important;
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

.comments-area {
  max-height: 40vh;
  overflow: scroll;
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


</style>
