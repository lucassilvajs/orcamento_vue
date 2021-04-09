<template>
  <div class="no-header">
    <b-modal id="modallg" size="lg" title="Large Modal" hide-footer>
        <div class="row" v-if="product">
          <b-colxx md="6" sm="12" class="d-flex align-items-center">
            <img class="w-100" :src="product.image" alt="">
          </b-colxx>
          <b-colxx md="6" sm="12">
            <h5>{{product.name}}</h5>
            <p>{{product.description}}</p>
            <h5 class="price text-success">{{product.price | numeroPreco}}</h5>

            <div class="attrs" v-for="(p, i) in product.attributes" :key="i">

              <div class="type-img mb-4" v-if="p.type == 'img'">
                <p class="mb-1"><b>{{p.name}}: </b> {{p.selected.value}}</p>
                <div class="d-flex align-items-start flex-direct-row">
                  <div class="w-100px" :class="{active: p.selected.value == item.value}" v-for="item in p.items" :key="item.value" @click="p.selected = item">
                    <img class="w-100" :src="item.img" alt="">
                  </div>
                </div>
              </div>

              <div class="type-circle mb-4" v-if="p.type == 'circle'">
                <p class="mb-1"><b>{{p.name}}: </b> {{p.selected.value}}</p>
                <div class="d-flex align-items-start flex-direct-row">
                  <div class="circle-item" :class="{active: item.value == p.selected.value}" v-for="item in p.items" :key="item" @click="p.selected = item">
                    {{item.value}}
                  </div>
                </div>
              </div>

            </div>
            <div class="type-qty d-flex justify-content-between align-items-center">
              <div class="control">
                <button class="qty" :disabled="product.qty <= 1" @click="product.qty -= 1">-</button>
                <input readonly type="text" name="" id="" v-model="product.qty">
                <button class="qty" @click="product.qty += 1">+</button>
              </div>
              <button @click="addToCard" class="btn btn-success">Adicionar ao carrinho <span class="ml-3">{{product.qty * (product.price + getSelected()) | numeroPreco}}</span></button>
            </div>
          </b-colxx>
        </div>
    </b-modal>
  </div>
</template>

<script>
export default {
    methods: {
    },
    watch: {
    }
}
</script>
<style scoped>

</style>
