<template>
<div>
  <b-row class="app-row">
    <b-colxx xxs="12" class="chat-app">
      <h5>SAC #{{sacCurrent.id}}</h5>
      <p>{{sacCurrent.about}}</p>
      <hr>
      <div v-if="true" class="message-area">
        <div v-if="file && file.send != true" class="file-show-area">
          <div class="file-show-area-header">
            <span>Pré-visualização</span>
            <span @click="() => {file = false}"><i class="iconsminds-close" /></span>
          </div>
          <img v-if="file.value && file.type.split('/')[0] == 'image'" :src="file.value" alt="">
          <div v-else-if="file.type.split('/')[0] != 'image'" class="message-file justify-content-start">
            <i class="iconsminds-file" />
            <span class="mr-3">
              {{file.name}}
            </span>
          </div>
          <span class="text-white font-weight-bold" v-else>Carregando pré-visualização</span>
        </div>
        <div class="d-flex flex-row chat-heading">
          <div class="d-flex">
          </div>
          <div class="d-flex min-width-zero">
            <div
              class="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero" >
              <div class="min-width-zero">
                <div>
                  <p class="list-item-heading mb-1 truncate">
                  </p>
                </div>
              </div>
            </div>
          </div>

          <vue-perfect-scrollbar
            class="scroll w-100"
            :settings="{ suppressScrollX: true, wheelPropagation: false }"
            ref="chatArea"
          >
            <div v-for="(message, index) in messages" :key="`message${index}`">

              <b-card style="max-width:500px;"
                no-body
                :class="{
                  'd-inline-block mb-3 card-message': true,
                  'float-left': message.sender == 'app',
                  'float-right bg-green': message.sender == 'admin'
                }"
              >
              <b-card-body>
                <a target="_blank" v-if="message.file && message.file.value.length < 100" :href="baseURL + message.file.value">
                  <img :src="baseURL + message.file.value" alt="">
                </a>

                <img v-else-if="message.file && message.file.value.length > 100" :src="message.file.value" alt="">

                <div v-if="message.file && ((message.file.type && message.file.type.indexOf('image') < 0) || !message.file.type)" class="message-file justify-content-between">
                  <i class="iconsminds-file" />
                  <span class="mr-3">
                    {{message.file.name ? message.file.name : message.file.value}}
                  </span>
                  <a v-if="message.file.value" target="_blank" :href="baseURL + message.file.value">
                    <i class="simple-icon-cloud-download" />
                  </a>
                  <i v-else class="simple-icon-cloud-download" />
                </div>
                <p>{{message.message}}</p>
                <div class="position-absolute time-bottom">
                  <span class="text-muted" style="font-size:.75rem;">{{new Date(message.time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', hour12: false})}}</span>
                </div>
              </b-card-body>
              </b-card>

            </div>
          </vue-perfect-scrollbar>

        </div>
      </div>
      <div v-else class="loading" key="conversationLoading"></div>
    </b-colxx>
  </b-row>
  <div class="chat-input-container d-flex justify-content-between align-items-center">
    <b-input class="flex-grow-1" type="text" placeholder="Escreva sua mensagem" v-model="message" @keyup.native.enter="sendMessage" />
    <div class="d-flex">
      <label for="file" class="btn icon-button large ml-1 btn-outline-primary d-flex align-items-center justify-content-center">
        <input type="file" id="file" @change="saveFile" class="d-none">
        <i class="simple-icon-paper-clip"></i>
      </label>
      <b-button variant="primary" class="icon-button large ml-1" @click="sendMessage">
        <i class="simple-icon-arrow-right" />
      </b-button>
    </div>
  </div>
  <application-menu>
    <b-tabs no-fade class="pl-0 pr-0 h-100" content-class="chat-app-tab-content" nav-class="card-header-tabs ml-0 mr-0" v-model="tabIndex">
      <b-tab title="Sobre" active title-item-class="w-100 text-center" no-body class="chat-app-tab-pane">
        <div class="pt-4 spaced-content pb-0 mt-2 container-info">
          <h3 class="text-center">SAC #{{sacCurrent.id}}</h3>
          <p>
            <b>Empresa:</b> {{sacCurrent.name}}<br />
            <b>Colaborador:</b> {{sacCurrent.colaborador}}<br />
            <b>Descrição:</b> {{sacCurrent.about}}<br />
          </p>
          <div class="images">
            <img v-for="(image, imageIndex) in JSON.parse(sacCurrent.image)" :key="imageIndex" class="w-100 mb-2" :src="baseURL + image" alt="Imagens">
          </div>

        </div>
      </b-tab>
    </b-tabs>
  </application-menu>
</div>
</template>

<script>
import { api, baseURL } from '@/constants/config'
import {
  mapGetters,
  mapActions
} from 'vuex'
import ApplicationMenu from '@/components/Common/ApplicationMenu'
import ContactList from '@/components/ChatApp/ContactList'
import ConversationList from '@/components/ChatApp/ConversationList'
import ConversationDetail from '@/components/ChatApp/ConversationSac'

export default {
  components: {
    'application-menu': ApplicationMenu,
    'contact-list': ContactList,
    'conversation-list': ConversationList,
    'conversation-detail': ConversationDetail
  },
  data() {
    return {
      baseURL,
      tabIndex: 0,
      clear: 0,
      sacCurrent: [],
      message: '',
      messages: [],
      contacts: [],
      file: null,
      searchKey: '',
      isLoadCurrentConversation: false,
      otherUser: null,
      conversationMessages: null,
      fd: new FormData()
    }
  },
  methods: {
    async getSac(sac){
      sac = sac ? sac : this.$route.params.id;
      const response = await api.get(`admin/sac/${sac}`);
      this.sacCurrent = response.data.data.sac.filter(r => r.id == sac)[0];
      setTimeout(() => {
        document.querySelector('.ps-container.scroll.w-100').scrollTo({ left: 0, top: document.querySelector('.ps-container.scroll.w-100').scrollHeight, behavior: "smooth" });
      }, 200);
    },
    async getSacChat(sac){
      sac = sac ? sac : this.$route.params.id;
      const response = await api.get(`admin/sac/chat/${sac}`);

      this.messages = response.data.data.messages.map(r => {
        r.file = JSON.parse(r.type);
        return r;
      });

    },
    async sendMessage(){
      if(this.message.trim().length > 0 || this.file) {
        this.messages.push({
          sender: 'admin', message: this.message, file: this.file, time: new Date()
        });

        let filed = false;

        if(this.file) {
          const file = await api.post('saveFile/attachment', this.fd);
          let fileName = file.data.data;

          filed = {
            name: this.file.name,
            type: this.file.type,
            value: fileName
          }
        }

        const response = api.post(`admin/sac/chat`, {
          sacId: this.$route.params.id,
          sacText: this.message,
          sacFile: filed
        });
      }

      setTimeout(() => {
        document.querySelector('.ps-container.scroll.w-100').scrollTo({ left: 0, top: document.querySelector('.ps-container.scroll.w-100').scrollHeight, behavior: "smooth" });
      }, 200);

      this.message = '';
      this.file = false;
    },
    saveFile(e){
      this.file = false;
			var file = new FileReader();
      file.onload = (el) => {
        this.file.value = el.target.result
      };
      file.readAsDataURL(e.target.files[0]);

      this.file = {
        name: e.target.files[0].name,
        type: e.target.files[0].type,
      }

      this.fd.append('file', e.target.files[0]);
    },
  },
  mounted() {
    document.body.classList.add("no-footer");
  },
  beforeDestroy() {
    document.body.classList.remove("no-footer");
    clearInterval(this.clear)
  },
  created(){
    this.getSac();
    this.getSacChat();
    this.clear = setInterval(() => {
      this.getSacChat();
    }, 1000 * 10);
  },
  watch: {
    $route(){
      this.messages = [];
      setTimeout(() => {
        this.getSac()
        this.getSacChat();
      }, 200);
    }
  }
}
</script>
<style>
.container-info {
  overflow-y: auto;
  max-height: calc(100vh - 125px);
}

.bg-green {
  background: #bfb;
}

.time-bottom {
  right: 1.75rem;
}

section.ps-container {
  display: flex;
  flex-direction: column;
}

.my-badge-danger {
  color: #fff;
  background: #a00;
  font-size: .7rem;
  border-radius: 50%;
  height: 17px;
  width: 17px;
  display: inline-block;
  text-align: center;
  margin-left: 10px;
}

.router-link-exact-active{
  color: #00b3b7;
}

.message-file {
    width: 300px;
    background: #00b3b7;
    padding: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    color: #fff;
}
.message-file i{
  font-size: 2rem;
}

.file-show-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #aaa;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.file-show-area img {
  max-width: 80%;
  max-height: 80%;
}

.chat-file {
  position: absolute;
  bottom: 0;
  padding: 10px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.file-show-area-header{
  width: 100%;
  background: #fff;
  padding: 10px;
  font-size: 1.5rem;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
}

.file-show-area-header i {
  cursor: pointer;
  color: #a00;
}

.card-message img {
  max-width: 100%;
}

@media screen and (max-width: 765px){
  .card-message {
    width: 80%;
    padding: 15px;
  }
}
</style>
