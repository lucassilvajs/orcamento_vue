<template>
<div>
    <b-row>
        <b-colxx xxs="12">
             <b-card class="mb-4">
               <h6 class="text-center text-muted mb-4">Clique no tipo de solicitação que você deseja fazer</h6>
                <b-row class="align-items-center justify-content-center">
                  <div class="d-flex align-items-center justify-content-center flex-column link mb-3 mx-3" @click="link('/app/order/information')">
                    <i class="simple-icon-eyeglass" />
                    <h1>Óculos completo</h1>
                    <h6>Aqui você pode comprar um óculos completo (armação e lente)</h6>
                  </div>
                  <div class="d-flex align-items-center justify-content-center flex-column link mb-3 mx-3" @click="link('/app/order/distribuidor')">
                    <i class="simple-icon-basket-loaded" />
                    <h1>Distribuição</h1>
                    <h6>Aqui você pode comprar itens para melhorar a qualidade da sua visão</h6>
                  </div>
                </b-row>
            </b-card>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
        }
    },
    computed: {

    },
    methods: {
      link(rota){
        this.$router.push(rota);
      }
    },
    watch: {
    },

    created() {
    }
}
</script>
<style scoped>
@media screen and (min-width: 688px) {
  .link:nth-child(1):after{
    content: '';
    position: absolute;
    bottom: 0;
    right: -16px;
    display: block;
    width: 1px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,.3) 0%, rgba(121,127,128,1) 50%, rgba(255,255,255,.3) 100%);
  }
}

@media screen and (max-width: 688px) {
  .link:nth-child(1):after{
    content: '';
    position: absolute;
    bottom: -16px;
    right: 0;
    display: block;
    width: 100%;
    height: 1px;
    background: linear-gradient(1deg, rgba(255,255,255,.3) 0%, rgba(121,127,128,1) 50%, rgba(255,255,255,.3) 100%);
  }
}

.link{
  padding: 16px;
  position: relative;
  color: #555;
  text-align: center;
  max-width: 300px;
}

.link:hover{
  background: #efefef;
  cursor: pointer;
}
i {
    font-size: 3rem;
}
</style>
