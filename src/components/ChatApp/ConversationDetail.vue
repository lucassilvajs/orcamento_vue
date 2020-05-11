<template>
  <div>
    <div class="d-flex flex-row chat-heading">
      <div class="d-flex">
      </div>
      <div class="d-flex min-width-zero">
        <div
          class="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
        >
          <div class="min-width-zero">
            <div>
              <p class="list-item-heading mb-1 truncate">
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="separator mb-5" />
    <vue-perfect-scrollbar
      class="scroll"
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
      ref="chatArea"
    >
      <div v-for="(message, index) in messages" :key="`message${index}`">
        <b-card style="max-width:500px;"
          no-body
          :class="{
            'd-inline-block mb-3': true,
            'float-left': (logged == 'admin' && message.sender == 'app' || logged == 'app' && message.sender == 'admin'),
            'float-right': (logged == 'admin' && message.sender == 'admin' || logged == 'app' && message.sender == 'app')
          }"
        >
          <div class="position-absolute pt-1 pr-2 r-0">
            <span class="text-extra-small text-muted">{{ message.time | datetime }}</span>
          </div>
          <b-card-body>
            <div
              class="d-flex flex-row pb-1"
              v-if="message.sender === currentUser.id"
            >
              <img
                :alt="currentUser.title"
                :src="currentUser.img"
                class="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
              />
              <div class="d-flex flex-grow-1 min-width-zero">
                <div
                  class="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
                >
                  <div class="min-width-zero">
                    <p class="mb-0 truncate list-item-heading">
                      {{ currentUser.title }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex flex-row pb-1" v-else>
              <div class="d-flex flex-grow-1 min-width-zero">
                <div
                  class="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
                >
                  <div class="min-width-zero">
                  </div>
                </div>
              </div>
            </div>
            <div class="chat-text-left">
              <div v-if="message.attachment">
                <img v-if="message.attachment && message.type == 'image'" :src="baseURL+message.attachment" alt="Anexo" class="w-100">
                <iframe v-else-if="message.attachment && message.type == 'file' && (message.attachment.split('.')[message.attachment.split('.').length-1] == 'pdf' || message.ext == 'pdf')" :src="baseURL+message.attachment" frameborder="0" class="w-100" style="min-width:350px;"></iframe>
                <a download :href="baseURL+message.attachment" class="file" v-else>
                  <i class="simple-icon-doc"></i>
                  Visualização indisponível
                </a>
              </div>
              <p class="mb-0 text-semi-muted">{{ message.text }}</p>
            </div>
          </b-card-body>
        </b-card>
        <div class="clearfix" />
      </div>
    </vue-perfect-scrollbar>
  </div>
</template>
<script>
import {baseURL} from '@/constants/config';
export default {
  props: ["currentUser", "otherUser", "messages", "logged"],
  data(){
    return {
      baseURL
    }
  },
  computed: {
    userLogado(){

      return 1+1;
    }
  },
  methods: {
    scrollToEnd() {
      setTimeout(() => {
        const container = this.$refs.chatArea.$el;
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  },
  mounted() {
    this.scrollToEnd();
  },
  updated() {
    this.scrollToEnd();
  }
};
</script>

<style scoped>
.file {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 9px;
  background: #dedede;
  padding: 7px 10px;
}


.card.d-inline-block.mb-3.float-right::after {
  content: '';
  position: absolute;
  bottom: 4px;
  width: 15px;
  height: 15px;
  background: #FFF;
  right: -7px;
  transform: rotate(45deg);
  z-index: 0;
}

.card.d-inline-block.mb-3.float-left::after {
  content: '';
  position: absolute;
  bottom: 4px;
  width: 15px;
  height: 15px;
  background: #FFF;
  left: -7px;
  transform: rotate(45deg);
  z-index: 0;
}
</style>
