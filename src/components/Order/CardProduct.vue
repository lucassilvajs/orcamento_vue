<template>
  <div>
    <b-card class="mb-4" style="border:1px solid rgba(100,100,100,.5); border-radius:6px" no-body>
      <div class="position-relative">
        <img :src="product.image" alt="" class="card-img-top">
      </div>
      <b-card-body>
        <form @submit.prevent="setProduct(pro)">
          <div class="d-flex justify-content-end">
            <h5 class="price text-success">{{product.price | numeroPreco}}</h5>
          </div>
          <h4 class="name-product">{{product.name}}</h4>
          <p v-if="product.description" class="text-muted">{{product.description}}</p>
        </form>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
    props: ["product"],
    components: {

    },
    computed:{
    },
    data(){
      return{

      }
    },
    methods: {
    },
    watch: {
    }
}
</script>
<style scoped>

</style>
