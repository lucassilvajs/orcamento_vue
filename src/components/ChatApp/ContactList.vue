<template>
    <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }"  >
        <div class="pt-0 spaced-content pb-0">
            <div class="d-flex flex-row mb-3 border-bottom pb-3" v-for="(contact,index) in data" :key="`contact${index}`">
                <router-link :to="`/app/sac/view/${contact.id}`" class="d-flex">
                  <img :alt="contact.title" :src="contact.img" class="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall" />
                  <div class="d-flex flex-grow-1 min-width-zero">
                      <div class="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                          <div class="min-width-zero">
                              <p class=" mb-0 truncate">{{contact.title}} <span class="badge badge-danger">1</span></p>
                          </div>
                      </div>
                  </div>
                </router-link>
            </div>
          </div>
    </vue-perfect-scrollbar>
</template>

<script>
export default {
  props: ['data'],
  methods: {
    selectContact (userId) {
      this.$emit('select-contact', userId)
    }
  }
}
</script>
