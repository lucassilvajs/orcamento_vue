<template>
<div>
    <b-row class="mb-3">
      <b-colxx>
        <b-card>
          <b-row v-if="pipe">
            <b-colxx xs="12" lg="3">
              <b-form-group label="Nome" class="has-float-label mb-2">
                <b-form-input type="text" v-model="filter.name" />
              </b-form-group>
            </b-colxx>
            <b-colxx xs="12" lg="3">
                <b-form-group label="Consultor" class="has-float-label mb-4">
                    <b-form-select v-model="filter.consultor" :options="['TODOS',...consultores]" plain />
                </b-form-group>
            </b-colxx>
            <b-colxx xl="3" xs="12"></b-colxx>
            <b-colxx xl="3" xs="12">
              <b-button @click="getPipe()" class="float-right" variant="success">Buscar</b-button>
            </b-colxx>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-card class="mb-4 py-0">
      <b-button v-b-modal.modalPipe class="float-right" variant="outline-success">Criar contato <i class="glyph-icon simple-icon-plus"/> </b-button>
    </b-card>
    <b-row class="flex-nowrap h-100" v-if="pipe.length">
      <b-colxx md="3" v-for="(p, indexPipe) in pipe" :key="indexPipe">
        <b-card class="full-height p-3" no-body>
          <b-card-header class="d-flex justify-content-between align-items-start">
            <h6 class="title">{{p.name}}</h6>

            <div class="text-right">
              <span class="badge badge-info">{{p.total}}</span>
            </div>

          </b-card-header>
          <b-card-body class="p-1 card-area position-relative">
            <draggable :animation="100" :list="p.cards" :group="{ name: 'cards'}" style="height:100%;" @change="MoveCard">
              <div v-for="(c, cIndex) in p.cards" :key="cIndex" @click="setInfoModal(indexPipe, cIndex)">
                <card v-b-modal.modalCard class="mt-2 mb-3 p-3" :pipe="c" :stage="p.id" />
              </div>

              <div v-if="p.cards.length < p.total && p.cards.length > 0" class="text-center">
                <b-button variant="info" :disabled="processing" :class="{'text-white mb-3 btn-multiple-state btn-shadow ml-3': true,
                  'show-spinner': processing}" @click="buscarMais(p.id, p.cards.length, indexPipe)">
                  <span class="spinner d-inline-block">
                      <span class="bounce1"></span>
                      <span class="bounce2"></span>
                      <span class="bounce3"></span>
                  </span>
                  <span class="icon success">
                      Enviar Solicitação
                  </span>
                  <span class="icon fail">
                      <i class="simple-icon-exclamation"></i>
                  </span>
                  <span class="label">Enviar Solicitação</span>
                </b-button>
                <span>Mostrando {{p.cards.length}} de {{p.total}}</span>
              </div>
            </draggable>
            <div v-if="p.cards.length == 0" class="w-100 d-flex align-items-start justify-content-center position-absolute" style="top:30px;">
              <h4>Nenhum card encontrado!</h4>
            </div>
          </b-card-body>
        </b-card>
      </b-colxx>
    </b-row>

      <b-modal id="modalPipe" ref="modalPipe" title="Adicionar card" v-if="cardsInput" modal-class="modal-right">
          <b-row>
            <b-colxx md="12" lg="12" v-for="(card, cardIndex) in cardsInput.filter(r => [1,2,3,4,5,6,7,8,9].indexOf(parseInt(r.id)) >= 0)" :key="cardIndex">
              <b-form-group v-if="card.type == 'text'" :label="card.label" class="has-float-label mb-4">
                <b-form-input type="text" v-model="cardValue[card.id]" />
              </b-form-group>
              <b-form-group v-if="card.type == 'mask' && card.label == 'CNPJ'" :label="card.label" class="has-float-label mb-4">
                <the-mask @blur.native="checkCnpj" class="form-control" v-model="cardValue[card.id]" :mask="['##.###.###/####-##', '###.###.###-##']" />

                  <b-alert class="mt-3" v-if="validation.pertence" show variant="danger">
                    <div>Essa empresa já está vinculada a outro consultor ({{validation.pertence.consultor}})</div>
                  </b-alert>

                  <b-alert class="mt-3" v-if="validation.filial && !validation.pertence" show variant="warning">
                    <div>
                      Uma outra empresa do mesmo grupo já pertence a outro consultor.
                      <div v-for="(c, i) in validation.filial" :key="i" >
                        {{c.name}} - {{c.consultor}}
                      </div>
                    </div>
                  </b-alert>
              </b-form-group>
              <b-form-group v-if="card.type == 'mask' && card.label == 'Telefone'" :label="card.label" class="has-float-label mb-4">
                <the-mask class="form-control" v-model="cardValue[card.id]" :mask="['(##) ####-####']" />
              </b-form-group>
              <b-form-group v-if="card.type == 'mask' && card.label == 'Celular'" :label="card.label" class="has-float-label mb-4">
                <the-mask class="form-control" v-model="cardValue[card.id]" :mask="['(##) # ####-####']" />
              </b-form-group>
              <b-form-group v-if="card.type == 'checkbox'" :label="card.label">
                <b-form-checkbox-group>
                  <b-form-checkbox v-model="cardValue[card.id]" v-for="(c, i) in JSON.parse(card.aux)" :key="i" :value="c">{{c}}</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </b-colxx>
            <b-colxx md="12" lg="12">
            <span class="title col-form-label">Consultor responsável</span>
              <b-input-group class="mb-3">
                <b-form-select v-if="consultores" v-model="aux.consult" :options="consultores"></b-form-select>
                <b-input-group-append>
                    <b-button @click="addConsultMultiple" variant="outline-success"> + </b-button>
                </b-input-group-append>
            </b-input-group>

            <span v-for="(c, i) in aux.arrConsult" :key="c" href="#" class="tag-label">{{consultores.filter(r => r.value == c)[0].text}} <button @click="aux.arrConsult.splice(i,1)" >X</button> </span>
            </b-colxx>
          </b-row>
          <template slot="modal-footer">
            <b-button variant="success" @click="addCard" :disabled="validation.pertence" class="mr-1">Adicionar</b-button>
            <b-button variant="secondary" @click="hideModal('modalright')">Cancelar</b-button>
          </template>
      </b-modal>

      <b-modal v-if="modal" id="modalCard" size="lg" ref="modalCard" :title="'Card #' + modal.id">
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
              <span class="d-block">Comentários</span>
            </a>
          </li>
          <li class="nav-item step-done" v-if="[4,5,6,7,8].indexOf(parseInt(modal.stage)) >= 0">
            <router-link v-if="modal.idCompany" :to="`/app/company/edit/${modal.idCompany}`" class="nav-link">
              <span class="d-block">Cadastrar</span>
            </router-link>
            <router-link v-else :to="`/app/company/card/${modal.id}`" class="nav-link">
              <span class="d-block">Cadastrar</span>
            </router-link>
          </li>
        </ul>
        <b-collapse visible id="collapseInfo" accordion="my-accordion">
          <div class="p-4">
            <b-row>
              <b-colxx md="6" lg="6" sm="12">
                <b-row>
                  <b-colxx md="12" sm="12" lg="12" v-for="(card, cardIndex) in modal.items" :key="cardIndex" class="mb-3">
                    <b-form-group v-if="card.edit && ['text', 'mask', 'number'].indexOf(card.type) >= 0" :label="card.label" class="has-float-label mb-4">
                      <b-form-input v-if="card.type == 'text'" type="text" v-model="card.value" @blur="editItem(card, modal.id)" />

                      <the-mask @blur.native="() => {checkCnpj(); editItem(card, modal.id)}" class="form-control" v-model="card.value" :mask="['##.###.###/####-##', '###.###.###-##']" v-if="card.type == 'mask' && card.label == 'CNPJ'" />
                      <div class="alert-cnpj" v-if="card.type == 'mask' && card.label == 'CNPJ'">
                        <b-alert class="mt-3" v-if="validation.pertence" show variant="danger">
                          <div>Essa empresa já está vinculada a outro consultor ({{validation.pertence.consultor}})</div>
                        </b-alert>
                        <b-alert class="mt-3" v-if="validation.filial" show variant="warning">
                            Uma outra empresa do mesmo grupo já pertence a outro consultor.
                            <div v-for="(c, i) in validation.filial" :key="i" >
                              {{c.name}} - {{c.consultor}}
                            </div>
                        </b-alert>

                      </div>

                      <the-mask @blur.native="editItem(card, modal.id)" v-if="card.type == 'mask' && card.label == 'Telefone'" class="form-control" v-model="card.value" :mask="['(##) ####-####']" />
                      <the-mask @blur.native="editItem(card, modal.id)" v-if="card.type == 'mask' && card.label == 'Celular'" class="form-control" v-model="card.value" :mask="['(##) # ####-####']" />
                    </b-form-group>
                    <div v-if="!card.edit && ['text', 'mask'].indexOf(card.type) >= 0">
                      <span class="label w-100">{{card.label}} <div class="edit glyph-icon simple-icon-pencil" ></div>
                        <a href="#" @click="card.edit = true" class="btn-edit">Editar</a>
                      </span>
                      <span v-if="card.value" class="value">{{card.value}}</span>
                      <span @click="card.edit = true" v-if="!card.value" class="value link">Clique aqui para adicionar</span>
                    </div>

                    <b-form-group v-if="card.type == 'checkbox'" :label="card.label">
                      <b-form-checkbox-group v-model="card.value" @change="editItem(card, modal.id)">
                        <b-form-checkbox v-for="(c, i) in JSON.parse(card.aux)" :key="i" :value="c">{{c}}</b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>

                    <b-form-group v-if="card.type == 'select'" :label="card.label">
                      <b-form-select v-model="card.value" @change="editItem(card, modal.id)" :options="JSON.parse(card.aux)" size="sm"></b-form-select>
                    </b-form-group>

                    <div v-if="card.type == 'color'" class=" d-flex flex-column">
                      <div v-for="(c, ci) in JSON.parse(card.aux)" :key="ci" class="cursor-pointer color-area d-flex align-items-center justify-content-between mb-2 w-50">
                        <div @click="() => {card.value = c.value; editItem(card, modal.id)}">
                          <div class="color-label mr-3" :style="{background: c.color}"></div>
                          <span class="color-value mr-3">{{c.value}}</span>
                        </div>
                        <div v-if="c.value == card.value" :class="'d-inline-block mr-3 glyph-icon simple-icon-check'"/>
                      </div>
                    </div>

                  </b-colxx>
                </b-row>
              </b-colxx>
              <b-colxx md="6" lg="6" sm="12">
                <b-row>
                  <b-colxx md="12" sm="12" lg="12">

                  </b-colxx>
                </b-row>
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
              <div v-if="historic.description" class="description" v-html="historic.description">
              </div>
            </div>
            <b-alert v-if="!modal.historic.length" show variant="info">Nenhuma atividade foi encontrada</b-alert>
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
              <div class="comment-area">
                <div class="text-area">
                  <input type="text" v-model="modal.txtComment">
                  <button @click="addComment(modal.id)" class="btn btn-info">
                    <div v-if="processing" class="lds-ripple"><div></div><div></div></div>
                    <div v-else :class="'glyph-icon simple-icon-paper-plane'"/>
                  </button>
                </div>
              </div>
          </div>
        </b-collapse>
        <b-collapse visible id="collapseAdd" accordion="my-accordion">
          <b-alert show variant="success">Após preencher esse formulário a empresas está cadastrada em sua base de clientes!</b-alert>
          <addcompany :card="modal.id" :stage="modal.stage" />
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
        validation: {},
        company: {},
        aux: {
          consult: '',
          arrConsult: []
        },
        cardValue: {},
        consultores: false,
        cardsInput: false,
        pipe: {},
        pipeBkp: {},
        search: '',
        modal: false,
        processing: false,
        filter: {
          name: '',
          consultor: 0
        }
      }
    },
    methods:{
      addConsultMultiple(){
        this.aux.arrConsult.push(this.aux.consult)
        this.aux.arrConsult = this.aux.arrConsult.filter( (value, index, self) => {return self.indexOf(value) === index} );
      },
      setInfoModal(pipe, index){
        this.modal = [];
        this.modal = this.pipe[pipe].cards[index];
        this.modal.stage = this.pipe[pipe].id

        // Mesclar input permitidos com os inputs não permitidos
        let inputMesclado = [];
        this.cardsInput.forEach(r => {

          let preenchido = this.modal.items.filter( j => {
            if(j.id == r.id) {
              if(['checkbox'].indexOf(j.type) >= 0 && j.value.length > 0) {
                j.value = JSON.parse(j.value);
              }
              return j
            }
          });

          if(preenchido.length > 0) {
            inputMesclado.push(preenchido[0]);
          }else{
            inputMesclado.push(r)
          }
        });

        console.log('inputMesclado', inputMesclado)
        this.modal.items = inputMesclado;
      },
      hideModal (refname) {
        this.$refs[refname].hide()

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
        const data = await api.get('crm', {params: this.filter});
        this.pipeBkp = this.pipe = data.data.data.pipe;
        this.consultores = data.data.data.consultores;
        this.cardsInput = data.data.data.field;
      },
      async addComment(card){

        if(!this.modal.txtComment || this.modal.txtComment.length == 0) {

          this.$notify("error", 'Opsss...!', "Digite corretamente seu comentário", {
            duration: 3000,
            permanent: false
          });

          return false
        }
        this.processing = true

        const data = await api.post('crm/comment/', {
          value: this.modal.txtComment,
          id: this.modal.id
        });

        this.modal.comment = data.data.data.comment;
        this.modal.historic = data.data.data.historic;

        this.modal.txtComment = '';
        this.processing = false

      },
      async addCard(){
        if(!this.aux.arrConsult || this.aux.arrConsult.length == 0) {
          this.$notify("error", 'Opsss...!', "Por favor adicione um responsável para o card", {
            duration: 3000,
            permanent: false
          });

          return false;
        }
        this.cardValue.consultor = this.aux.arrConsult;
        const data = await api.post('crm', this.cardValue);
        // this.pipe[0].cards.unshift(data.data.data);
        this.getPipe()
        this.$notify("success", 'Sucesso', "Card criado com sucesso", {
          duration: 3000,
          permanent: false
        });

        this.hideModal('modalPipe');

      },
      async checkCnpj(){
        if(this.cardValue[3] && this.cardValue[3].length > 12) {
          const data = await api.get('crm/validation/cnpj', {
            params: {
              value: this.cardValue[3]
            }
          });
          this.validation = data.data.data
        }
      },
      async MoveCard(evt){

        if(evt.added) {
          document.querySelector('.load-generic h1').innerHTML = 'Salvando alterações...';
          document.querySelector('.load-generic').classList.toggle('d-flex');
          let pipeId = '';
          let cardId = '';

          cardId = evt.added.element.id;
          this.pipe.forEach(r => {
            r.cards.forEach(p => {
              if(p.id == cardId) {
                pipeId = r.id
              }
            });
          });

          const data = await api.put('crm', {
            stage: pipeId,
            card: cardId,
            filter: this.filter
          });

          this.pipe.forEach((r, i) => {
            r.total = data.data.data.pipe[i].total
            r.cards.forEach(p => {
              if(p.id == cardId) {
                p.comment = data.data.data.card.comment;
                p.historic = data.data.data.card.historic;
              }
            });

            r = r;
          });

          document.querySelector('.load-generic').classList.toggle('d-flex');
          document.querySelector('.load-generic h1').innerHTML = 'Buscando';
        }



      },
      async editForm(card){
        card.edit = true
      },
      async editItem(card, cardId){

        setTimeout(async () => {
          const data = await api.put('crm/card', {
            value: card.value,
            attr: card.id,
            cardId
          });

          this.modal.comment = data.data.data.comment;
          this.modal.historic = data.data.data.historic;
        }, 500);
        card.edit = false
      },
      filterPipe(){
        let pipe = []
      },
      log(evt){
      },
      addValue(card, value){
        console.log(card)
        this.card.value = value
      },
      async buscarMais(id, total, index){
        this.processing = true;
        const data = await api.get(`crm/pipe/${id}`, {
          params: {
            total,
            filter: this.filter
          }
        });

        this.pipe[index].cards = this.pipe[index].cards.concat(data.data.data);
        this.processing = false;
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


span.label {
  font-size: 1rem;
  display: block;
  color: #555;
}

span.value{
  color: #999;
  font-size: 1rem;
}

div.edit {
  display: none;
}

.btn-edit {
  display: none;
}

span.label:hover div.edit, span.label:hover .btn-edit{
  display: inline-block;
}

.link.value {
  color: #00b3b7;
  text-decoration: underline;
  cursor: pointer;
}

.color-label {
    width: 20px;
    height: 20px;
    display: inline-block;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
