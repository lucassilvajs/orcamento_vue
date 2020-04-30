<template>
<div>
    <b-row class="app-row">
        <b-colxx xxs="12" class="chat-app">
            <conversation-detail v-if="isLoadContacts && isLoadConversations && otherUser!=null" key="conversation" :current-user='currentUser' :other-user='otherUser' :messages='conversationMessages' />
            <div v-else class="loading" key="conversationLoading"></div>
        </b-colxx>
    </b-row>
    <div class="chat-input-container d-flex justify-content-between align-items-center">
        <b-input class="flex-grow-1" type="text" placeholder="Envie sua mensagem" v-model="message" @keyup.native.enter="sendMessage" />
        <div>
            <b-button variant="outline-primary" class="icon-button large ml-1">
                <i class="simple-icon-paper-clip" />
            </b-button>
            <b-button variant="primary" class="icon-button large ml-1" @click="sendMessage">
                <i class="simple-icon-arrow-right" />
            </b-button>
        </div>
    </div>
    <application-menu>
        <b-tabs no-fade class="pl-0 pr-0 h-100" content-class="chat-app-tab-content" nav-class="card-header-tabs ml-0 mr-0" v-model="tabIndex">
            <b-tab title="Sobre" active title-item-class="w-50 text-center" no-body class="chat-app-tab-pane">
                <div class="pt-4 spaced-content pb-0 mt-2">

                </div>
                <div class="px-2" v-if="true">
                  <b>Título: </b>Meu óculos quebrado <br />
                  <b>Nota: </b>123456
                </div>
                <div v-else class="loading" key="conversationListLoading"></div>
            </b-tab>
            <b-tab title="Solicitações" title-item-class="w-50 text-center" no-body class="chat-app-tab-pane">
                <div class="pt-4 spaced-content pb-0 mt-2">

                </div>
                <contact-list v-if="isLoadContacts" key="contactList" :data="contactsSearchResult" />
                <div v-else class="loading" key="contactListLoading"></div>
            </b-tab>
        </b-tabs>
    </application-menu>
</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from 'vuex'
import ApplicationMenu from '@/components/Common/ApplicationMenu'
import ContactList from '@/components/ChatApp/ContactList'
import ConversationList from '@/components/ChatApp/ConversationList'
import ConversationDetail from '@/components/ChatApp/ConversationDetail'

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
            message: '',
            searchKey: '',
            isLoadCurrentConversation: false,
            otherUser: {
              "title": "Admin",
              "img": "/assets/img/profile-pic-l-4.jpg",
              "date": "Today",
              "id": "2"
            },
            conversationMessages: [
              {
                  "sender": "1",
                  "time": "23:59",
                  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at sem ac tellus pellentesque porttitor condimentum quis lacus."
              },
              {
                  "sender": "1",
                  "time": "23:59",
                  "attachment": "https://api.idsafety.com.br/public/upload/face/35117b7f4423adbde977b6a2ac5c0cf2.jpgjpeg",
                  "type": "image"
              },
              {
                "sender": "2",
                  "time": "23:59",
                  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at sem ac tellus pellentesque porttitor condimentum quis lacus.",
                  "attachment": "https://api.idsafety.com.br/public/upload/recipe/d6cbc756dcff868fb357caee49a813da.pdf",
                  "type": "file"
              },
              {
                  "sender": "2",
                  "time": "23:59",
                  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at sem ac tellus pellentesque porttitor condimentum quis lacus."
              },
              {
                  "sender": "1",
                  "time": "23:59",
                  "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at sem ac tellus pellentesque porttitor condimentum quis lacus."
              }
            ],
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
        ...mapGetters(['error', 'contacts', 'conversations'])
    },
    methods: {
        ...mapActions(['getContacts', 'searchContacts', 'getConversations']),
        selectConversation(otherUser, messages) {
            this.otherUser = otherUser
            this.conversationMessages = messages
        },
        sendMessage() {
          const date = new Date()
          let message = {
            sender: "1",
            time: date.getHours() + ':' + date.getMinutes(),
            text: this.message
          }
          this.conversationMessages.push(message)
          this.message = ''
        }
    },
    mounted() {
        this.getContacts({
            userId: this.currentUser.id,
            searchKey: ''
        })
        this.getConversations(this.currentUser.id)
        document.body.classList.add("no-footer");
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
