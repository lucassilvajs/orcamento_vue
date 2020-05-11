<template>
<div>
    <b-row class="app-row">
        <b-colxx xxs="12" class="chat-app">

            <div v-if="message.attachment" class="file-area d-flex justify-content-center align-items-center flex-column">
              <div class="pre-view">
                <span class="pre-close mr-4" @click="message.attachment = ''">X</span>
                Pre visualização
              </div>
              <div class="file">
                <i class="simple-icon-doc"></i>
              </div>
              <p class="text-white pt-2">{{message.attachment.name}}</p>
            </div>
            <conversation-detail :logged="this.$route.path.split('/')[1]" v-if="isLoadContacts && isLoadConversations && otherUser!=null" key="conversation" :current-user='currentUser' :other-user='otherUser' :messages='conversationMessages' />
            <div v-else class="loading" key="conversationLoading"></div>
        </b-colxx>
    </b-row>
    <div class="chat-input-container d-flex justify-content-between align-items-center">
        <b-input class="flex-grow-1" type="text" placeholder="Envie sua mensagem" v-model="message.text" @keyup.native.enter="sendMessage" />
        <div>
            <input type="file" name="" @change="setFileMessage" id="send-attachment" class="d-none">
            <label for="send-attachment" type="button" class="btn icon-button large ml-1 btn-outline-primary">
              <i class="simple-icon-paper-clip"></i>
            </label>
            <b-button variant="primary" class="icon-button large ml-1" @click="sendMessage">
                <i class="simple-icon-arrow-right" />
            </b-button>

            <b-button variant="primary" :disabled="processing || message.text.trim().lenght == 0" :class="{'icon-button large ml-1': true,
                'show-spinner': processing,
                'show-success': !processing}" @click="sendMessage">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    <i class="simple-icon-arrow-right" />
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label"><i class="simple-icon-arrow-right" /></span>
            </b-button>


        </div>
    </div>
    <application-menu>
        <b-tabs no-fade class="pl-0 pr-0 h-100" content-class="chat-app-tab-content" nav-class="card-header-tabs ml-0 mr-0" v-model="tabIndex">
            <b-tab title="Sobre" active title-item-class="w-50 text-center" no-body class="chat-app-tab-pane">
                <div class="pt-4 spaced-content pb-0 mt-2">

                </div>
                <div class="px-2" v-if="sac">
                  <span style="padding:4px 6px; color:#fff; font-weight:bold; margin:9px 0;" :style="{background: sac.color}">{{sac.status}}</span><br /><br>
                  <div v-if="sac.colaborador"><b>Colaborador: </b>{{sac.colaborador}} <br /></div>
                  <div v-if="sac.number"><b>Nota: </b>{{sac.number}} <br /></div>
                  <img class="w-100" :src="baseURL+sac.image" :alt="sac.colaborador">
                </div>
                <div v-else class="loading" key="conversationListLoading"></div>
            </b-tab>
            <!-- <b-tab title="Solicitações" title-item-class="w-50 text-center" no-body class="chat-app-tab-pane">
                <div class="pt-4 spaced-content pb-0 mt-2">

                </div>
                <contact-list v-if="isLoadContacts" key="contactList" :data="contactsSearchResult" />
                <div v-else class="loading" key="contactListLoading"></div>
            </b-tab> -->
        </b-tabs>
    </application-menu>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex';
import Firebase from 'firebase';
import {api, baseURL, firebaseConfig} from '@/constants/config';
import ApplicationMenu from '@/components/Common/ApplicationMenu';
import ContactList from '@/components/ChatApp/ContactList';
import ConversationList from '@/components/ChatApp/ConversationList';
import ConversationDetail from '@/components/ChatApp/ConversationDetail';
import Compressor from 'compressorjs';
const fireApp = Firebase.initializeApp(firebaseConfig);
export default {
    components: {
        'application-menu': ApplicationMenu,
        'contact-list': ContactList,
        'conversation-list': ConversationList,
        'conversation-detail': ConversationDetail
    },
    data() {
        return {
            tabIndex: 0,
            processing: false,
            sac: null,
            message: {
              text: '',
              attachment: ''
            },
            conversationMessages: [],
            file: '',
            searchKey: '',
            isLoadCurrentConversation: false,
            otherUser: {
              "title": "Admin",
              "img": "/assets/img/profile-pic-l-4.jpg",
              "date": "Today",
              "id": "2"
            },
            currentUser: {
              "title": "Cliente",
              "img": "/assets/img/profile-pic-l-5.jpg",
              "date": "Today",
              "id": "1"
            },
            isLoadContacts: true,
            isLoadConversations: true,
            contactsSearchResult: [ { "id": 2, "title": "Linn Ronning", "img": "/assets/img/profile-pic-l-4.jpg", "date": "Last seen today 15:24" }, { "id": 3, "title": "Goldie Mossman", "img": "/assets/img/profile-pic-l-3.jpg", "date": "Last seen today 13:24" }, { "id": 4, "title": "Laree Munsch", "img": "/assets/img/profile-pic-l-2.jpg", "date": "Last seen today 17:42" }, { "id": 5, "title": "Brynn Bragg", "img": "/assets/img/profile-pic-l-5.jpg", "date": "Last seen today 18:00" }, { "id": 6, "title": "Merle Friberg", "img": "/assets/img/profile-pic-l-4.jpg", "date": "Last seen today 22:24" }, { "id": 7, "title": "Velva Valdovinos", "img": "/assets/img/profile-pic-l-4.jpg", "date": "Last seen today 00:24" }, { "id": 8, "title": "Dusti Gioia", "img": "/assets/img/profile-pic-l-5.jpg", "date": "Last seen yesterday 10:50" }, { "id": 9, "title": "Philip Nelms", "img": "/assets/img/profile-pic-l-7.jpg", "date": "Last seen yesterday 06:47" }, { "id": 10, "title": "Marty Otte", "img": "/assets/img/profile-pic-l-8.jpg", "date": "Last seen yesterday 20:07" }, { "id": 11, "title": "Janene Thies", "img": "/assets/img/profile-pic-l-9.jpg", "date": "Last seen yesterday 14:14" }, { "id": 12, "title": "Bao Hathaway", "img": "/assets/img/profile-pic-l-10.jpg", "date": "Last seen yesterday 15:20" }, { "id": 13, "title": "Ramiro Roark", "img": "/assets/img/profile-pic-l-11.jpg", "date": "0" } ],
        }
    },
    computed: {
        ...mapGetters(['error', 'contacts', 'conversations']),
    },
    methods: {
        ...mapActions(['getContacts', 'searchContacts', 'getConversations']),
        generateSerial(len) {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 10;
            var randomstring = '';

            for (var x=0;x<string_length;x++) {

                var letterOrNumber = Math.floor(Math.random() * 2);
                if (letterOrNumber == 0) {
                    var newNum = Math.floor(Math.random() * 9);
                    randomstring += newNum;
                } else {
                    var rnum = Math.floor(Math.random() * chars.length);
                    randomstring += chars.substring(rnum,rnum+1);
                }

            }
            return randomstring;
        },
        async sendMessage() {
          this.processing = true;
          const date = new Date()
          let type = '';
          let ext = '';
          if(this.message.attachment) {
            let fileType = this.message.attachment.type.split('/');
            type = fileType[0] == 'image' ? 'image' : 'file'
            ext = fileType[fileType.length - 1]
          }
          let message = {
            sender: this.$route.path.split('/')[1],
            time: date.getTime(),
            text: this.message.text,
            attachment: this.file,
            type,
            ext
          }

          message.attachment = '';
          let idSend = JSON.parse(window.localStorage.getItem('user')).id;
          console.log(type);
          const sac = this.$route.params.id;
          let fd = new FormData();
          if(this.message.attachment && type == 'image') {
            new Compressor(this.message.attachment, {
              maxWidth: 1024,
              maxHeight:1024,
              quality: 0.7,
              success: async (result) => {
                fd.append('file', result, 'file.'+ext);
                const response = await api.post(`saveFile/attachment`, fd)
                message.attachment = response.data.data
                message.type = 'image';
                fireApp.database().ref(`/sac/${sac}/`).push({...message, idSend});
              }
            })
          }else if(this.message.attachment && type != 'image'){
            fd.append('file', this.message.attachment);
            const response = await api.post(`saveFile/attachment`, fd)
            message.attachment = response.data.data
            message.type = 'file';
            fireApp.database().ref(`/sac/${sac}/`).push({...message, idSend});
          }else{
            message = {
              time: message.time,
              sender: message.sender,
              text: message.text,
              idUserSend: idSend
            }
            fireApp.database().ref(`/sac/${sac}/`).push({...message, idSend});
          }

          console.log(message);


          this.message.attachment = '';
          this.message.text = '';
          this.file = '';
          this.processing = false;

        },
        setFileMessage(e){
          this.message.attachment = '';
			    var file = new FileReader();
          file.onload = (el) => {
            this.file = el.target.result
          };
          this.message.attachment = e.target.files[0];
          file.readAsDataURL(e.target.files[0]);
        },
        getconversationMessages(){
          const sac = this.$route.params.id;
          fireApp.database().ref(`/sac/${sac}/`).on('value', (snapshot) => {
            console.log(snapshot.val());
            this.conversationMessages = snapshot.val();
          });
        },
        async getSac(){
          const sac = this.$route.params.id;
          const response = await api.get(`sac`);
          if(response.data.status != 'success') {
            this.$notify(response.data.status, "Opsss...", response.data.message, {
              duration: 3000,
              permanent: false
            });

            this.$route.push('/app/sac');
          }else{
            this.sac = response.data.data.filter(r => r.id == sac)[0];
          }
        }
    },
    mounted() {
        this.getContacts({
            userId: this.currentUser.id,
            searchKey: ''
        })
        this.getConversations(this.currentUser.id)
        document.body.classList.add("no-footer");
        this.getconversationMessages();
        this.getSac();
    },
    beforeDestroy() {
        document.body.classList.remove("no-footer");
    },
    watch: {
        searchKey(val, oldVal) {
            this.searchContacts({
                userId: this.currentUser.id,
                searchKey: val
            })
        },
        $route(){
          alert('Olá');
        }
    }
}
</script>

<style scoped>
.file-area{
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 5;
  background: #afafaf;
}

.file-area .file {
      background: #00b3b7;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    color: #eee;
}

.pre-view{
  position: absolute;
  top: 0;
  left: 0;
  padding: 15px;
  background: #00b3b7;
  width: 45%;
  color: #fff;
  font-size: 1.25rem;
}

.pre-close {
  color: #eee;
  cursor:pointer;
}

.pre-close:hover{
  color: #fff;
}
</style>
