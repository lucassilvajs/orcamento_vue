<template>
  <b-button variant="success" :disabled="processing" :class="{'mb-3 btn-multiple-state btn-shadow ml-3': true,
      'show-spinner': processing,
      'show-success': !processing && error===false,
      'show-fail': !processing && error }">
      <span class="spinner d-inline-block">
          <span class="bounce1"></span>
          <span class="bounce2"></span>
          <span class="bounce3"></span>
      </span>
      <span class="icon success">
          {{message}}
      </span>
      <span class="icon fail">
          <i class="simple-icon-exclamation"></i>
      </span>
      <span class="label">{{message}}</span>
  </b-button>
</template>

<script>

export default {
    data() {
      return {

      }
    },
    props: ['error', 'processing', 'message'],
    computed:{
    },
    components: {
    },
    computed: {
    },
    methods: {
    },
    watch: {
    }
}
</script>
<style>

</style>
