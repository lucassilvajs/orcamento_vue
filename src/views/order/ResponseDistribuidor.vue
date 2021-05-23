<template>
<div class="mt-5">
  <b-row>
    <b-colxx xxs="12">
      <h1 v-if="order">Pedido {{`#${orderId}`}}</h1>
      <h1 v-else>Nenhum pedido</h1>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12" class="mb-3">
        <h3>Informações do pedido</h3>
    </b-colxx>
  </b-row>
  <b-row v-if="order" class="mb-4">
    <b-colxx>
      <table class="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Preço </th>
            <th>Preço praticado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(it, index) in order" :key="index">
            <td>
              <div class="w-100px bg-white">
                <single-lightbox :thumb="baseURL+it.img" :large="baseURL+it.img" class-name="w-100" />
              </div>
            </td>
             <td>{{it.name + ' ' + it.attributes.map(r => r.value).join(' ') }}</td>
            <td>

              <div class="control text-center">
                <b>{{it.qty}}</b>
              </div>

            </td>
            <td> {{it.qty * it.price | numeroPreco}} </td>
            <td> {{it.price | numeroPreco}} </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="text-right" colspan="5">
              <p>Valor total: <b>{{ getTotalCart() | numeroPreco }} </b> </p>
            </td>
          </tr>
        </tfoot>
      </table>
    </b-colxx>
  </b-row>


  </div>
</template>
<script>
import {api, baseURL} from '@/constants/config';
import SingleLightbox from "@/components/Pages/SingleLightbox";
export default {
    components: {
      "single-lightbox": SingleLightbox,
    },
    data(){
      return {
        baseURL,
        order: null,
        orderId: null
      }
    },
    methods: {
      async getOrderDistribuidor(){

        const data = await api.get(`distribuidor/${this.$route.params.hash}/${this.$route.params.response}`);
        this.order = JSON.parse(data.data.data.items);
        this.orderId = JSON.parse(data.data.data.orderId);

        this.$notify(data.data.status, data.data.status != 'success' ? 'Opsss...' : 'Sucesso', data.data.message, {
            duration: 10000,
            permanent: false
        });

      },
      getTotalCart(){
        let total = 0;
        this.order.forEach(element => {
          total += element.qty * element.price
        });
        return total;
      },
    },
    created(){
      this.getOrderDistribuidor();
    }
}
</script>

<style scoped>
.svg-box {
    display:inline-block;
    position: relative;
    width:150px;
}

.green-stroke {
    stroke:#7CB342;
}

.red-stroke {
    stroke: #FF6245;
}

.yellow-stroke {
    stroke: #FFC107;
}


.w-100px {
  display: flex;
  align-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border: 1px solid #aaa;
  border-radius: 7px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.w-100px:hover, .w-100px.active, .circle-item:hover, .circle-item.active {
  border: solid rgb(0, 172, 149);
  cursor: pointer;
}

.circular circle.path {
    stroke-dasharray: 330;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    opacity: 0.4;
    animation: 0.7s draw-circle ease-out;
}

/*------- Checkmark ---------*/
.checkmark{
	stroke-width: 6.25;
    stroke-linecap: round;
	position:absolute;
    top: 56px;
    left: 49px;
    width: 52px;
    height: 40px;
}

.checkmark path {
    animation: 1s draw-check ease-out;
}

.item-cart {
  border-radius: 5px;
  border: 1px solid rgba(100,100,100,.3);
}

.item-cart h4 {
  font-size: 1rem;
  font-weight: bold;
}

.item-cart h5 {
  font-size: .9rem;
}

.list-head {
  font-weight: bold;
}

.list-body {
  padding: 5px 0;
  font-size: .75rem;
}

.list-body:nth-child(odd){
  background: #f5f5f5;
}
.list-body{
  background: #dfdfdf;
}

</style>
