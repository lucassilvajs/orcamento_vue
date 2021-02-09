<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Editar produto</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-alert variant="info" show  dismissible>Você pode parametrizar o preço e as variações disponíveis na tela de cadastro/edição da empresa que você quiser!</b-alert>
    <b-row v-if="productInfo.type">
        <b-colxx xxs="12">
          <b-card class="mb-4" title="Informações">
            <div class="border position-relative mb-4">
              <span class="position-absolute label">Dados gerais</span>
                <div class="pt-4 px-3">
                  <b-row>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="Nome do Produto" class="has-float-label">
                        <b-form-input v-model="product.name" type="text" placeholder="Nome do Produto" />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Preço" class="has-float-label">
                            <fieldset class="form-group has-float-label">
                                <legend tabindex="-1" class="bv-no-focus-ring col-form-label pt-0">Preço</legend>
                                <div tabindex="-1" role="group" class="bv-no-focus-ring">
                                    <Money class="form-control"  v-model="product.price" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: false,}"/>
                                </div>
                            </fieldset>
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="Status" class="has-float-label">
                        <b-form-select v-model="product.status" :options="[{value: 'Active', text: 'Ativo'}, {value: 'Inactive', text: 'Inativo'}]" />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="Tipo do produto" class="has-float-label">
                        <b-form-select v-model="product.type" :options="productInfo.type.map(r => {
                          return {value: r.id,
                          text: r.name}
                          })" />
                      </b-form-group>
                      <b-form-group v-if="productInfo.type.filter(r => {if(r.id == product.type) return r;})[0].parent" label="Sub categoria" class="has-float-label">
                        <b-form-select v-model="product.subtype" :options="productInfo.type.filter(r => {if(r.id == product.type) return r;})[0].parent.map(r => {
                          return {value: r.id,
                          text: r.name}
                          })" />
                      </b-form-group>
                    </b-colxx>
                  </b-row>
                  <b-row>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="Origem" class="has-float-label">
                            <b-form-select v-model="product.origem" :options='[
                              {text:"0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8",value:"0"},
                              {text:"1 - Estrangeira - Importação direta, exceto a indicada no código 6",value:"1"},
                              {text:"2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7",value:"2"},
                              {text:"3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%",value:"3"},
                              {text:"4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes",value:"4"},
                              {text:"5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%",value:"5"},
                              {text:"6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX",value:"6"},
                              {text:"7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista da CAMEX",value:"7"},
                              {text:"8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%",value:"8"}]'></b-form-select>
                          </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="NCM" class="has-float-label">
                        <b-form-input v-model="product.ncm" type="text" placeholder="NCM" />
                      </b-form-group>
                    </b-colxx>
                  </b-row>
                </div>
            </div>
          </b-card>
        </b-colxx>

        <b-colxx xxs="12" v-if="product.type == 1">
          <b-card class="mb-4" title="Preço dinâmico (Distribuidor)">
            <table class="table">
              <thead>
                <th v-for="(qtd, indexQtd) in productDistribuidor.price" :key="indexQtd">{{qtd.qty}} Itens  <a class="p-1 text-danger" @click="() => {
                    if(productDistribuidor.price.length == 1) {
                      $notify('error', 'Opsss...!', 'Você tem que deixar pelo menos um preço ativo', {
                        duration: 3000,
                        permanent: false
                      });
                    }else{
                      productDistribuidor.price.splice(indexQtd, 1);
                    }
                  }"><i class="glyph-icon simple-icon-minus" /></a>
                </th>
                <th class="d-flex">
                  <the-mask class="form-control form-my" v-model="addPrices" :mask="['######']" />
                  <button class="btn btn-xs btn-outline-success" @click="addItemProduct">
                    <i class="glyph-icon simple-icon-plus" />
                  </button>
                </th>
              </thead>
              <tbody>
                <tr>
                  <td v-for="(value, indexValue) in productDistribuidor.price" :key="indexValue">
                    <Money :masked="false" class="form-my" v-model="productDistribuidor.price[indexValue].value" v-bind="{ decimal: ',',thousands: '.',suffix: '%',precision: 2,masked: true,}"/>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td :colspan="productDistribuidor.price.length">
                    <button class="btn btn-outline-success" @click="savePrecos">
                      Salvar descontos
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-card>
        </b-colxx>

        <b-colxx xxs="12" v-if="product.type == 1">
          <b-card class="mb-4" title="Imagens">
            <b-alert dismissible show variant="info">Adicione aqui <strong>Todas</strong> as imagens referentes a esse produto</b-alert>
            <vue-dropzone @vdropzone-complete="completeUpload" ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" />
            <draggable v-if="listImages.length > 0" class="row min-height" :list="listImages" :group="{name: 'people', pull: 'clone'}" >
              <b-colxx md="4" lg="3" v-for="(element, index) in listImages" :key="index">
                <img :src="baseURL + element.value" class="w-100" alt="">
              </b-colxx>
            </draggable>
          </b-card>
        </b-colxx>

        <b-colxx lg="8" xxs="12" v-if="product.type == 1">
          <b-card class="mb-4" title="Criar seu produto">
            <div class="area-drop">
              <draggable class="row min-height" :list="createdProduct" :group="{ name: 'people'}" @change="refreshElements">
                <b-colxx class="my-2" md="4" v-for="(element, index) in createdProduct" :key="index">
                  <b-form-group v-if="element.type == 'text'" :label="element.label" class="has-float-label mb-4">
                    <b-form-input v-model="element.value" type="text" :placeholder="element.label" />
                  </b-form-group>
                  <div v-if="element.type == 'img'" class="image-hover position-relative">
                    <img class="w-100" :src="baseURL +  element.value" alt="">
                    <div class="image-drag w-100 h-100 position-absolute align-items-center justify-content-center">
                      <button style="opacity:1;" class="btn btn-danger" @click="() => {
                          createdProduct = createdProduct.filter((r, i) => i != index)
                        }">
                        <div class="glyph-icon simple-icon-trash"></div>
                      </button>
                    </div>
                  </div>
                  <b-form-group v-if="element.type == 'money'" :label="element.label" class="has-float-label mb-4">
                    <Money class="form-control" v-model="element.value" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: false,}"/>
                  </b-form-group>
                  <b-form-group v-if="element.type == 'select'" :label="element.label" class="has-float-label mb-4">
                    <input-tag v-model="element.value"></input-tag>
                  </b-form-group>
                </b-colxx>
              </draggable>
            </div>
            <b-row class="justify-content-end align-items-center">
              <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                <div class="itemCheck mb-0 custom-control custom-checkbox">
                  <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="keepForm" id="keepForm">
                  <label class="custom-control-label" for="keepForm">Manter preenchido</label>
                </div>
              </div>
              <button class="btn btn-outline-success" @click="addVariation">{{isEdition === false ? 'Adicionar' : 'Editar'}} variação</button>
              <button class="btn btn-outline-info mx-3" @click="() => {isEdition = false; createdProduct = []}">Limpar</button>
            </b-row>
          </b-card>
        </b-colxx>

        <b-colxx lg="4" xxs="12" v-if="productInfo.attributes && product.type == 1">
          <b-card class="mb-4" title="Atributos">
            <draggable class="list-group min-height" :list="productInfo.attributes" :group="{ name: 'people', pull: 'clone'}" @change="refreshElements">
              <div class="list-group-item" v-for="(element, index) in productInfo.attributes" :key="index">
                {{element.label}}
              </div>
            </draggable>
          </b-card>
        </b-colxx>

        <b-colxx xxs="12" v-if="product.attributes.length > 0 && product.type == 1">
          <b-card title="Variações criadas">
            <b-row>
              <b-colxx md="3" v-for="(attr, attrIndex) in product.attributes" :key="attrIndex">
                <div v-for="(item, itemIndex) in attr" :key="itemIndex">
                  <b>{{item.label}}</b>:
                  <img v-if="item.type == 'img'" :src="baseURL + item.value" alt="Imagem do produto" class="d-block w-100"> <span v-else>{{item.value}}</span>
                </div>
                <button style="opacity:1;" class="btn btn-outline-danger mt-3" @click="() => {
                      product.attributes.splice(attrIndex, 1);
                  }">
                  <div class="glyph-icon simple-icon-trash"></div>
                </button>
                <button style="opacity:1;" class="btn btn-outline-info mt-3" @click="editVariation(attrIndex)">
                  <div class="glyph-icon simple-icon-pencil"></div>
                </button>
              </b-colxx>
            </b-row>
          </b-card>
        </b-colxx>


        <b-colxx>
          <button class="btn btn-success float-right mt-3" @click="editProduct">Salvar Produto</button>
        </b-colxx>
    </b-row>
</div>
</template>

<script>

import {
    mapGetters,
    mapActions
} from "vuex";
import draggable from "vuedraggable";
import {Money} from '@/vmoney.js';
import {api, baseURL} from '@/constants/config';
import VueDropzone from 'vue2-dropzone';
import {TheMask} from 'vue-the-mask';
import InputTag from '@/components/Form/InputTag'
export default {
    components:{
        'vue-dropzone': VueDropzone,
        'input-tag': InputTag,
        Money,
        draggable,
        TheMask
    },
    data() {
        return {
            isEdition: false,
            keepForm: true,
            listAttributes: [],
            listImages: [],
            createdProduct: [],
            productInfo: {},
            auxAttr: {},
            saveProduct: {
              internal: [],
              commercial: [],
              attributes: [],
              name: '',
              sku: '',
              image: ''
            }, //Armazena informações auxiliares antes de adicionar ao objeto do produto
            product:{
                type: '1',
                status: 'Active',
                name: '',
                price: '',
                attributes: []
            },
            baseURL,
            color: {
                name: '',
                image: '',
                sku: ''
            },
            file: null,
            addPrices: null,
            productDistribuidor : {price: [
                { "qty": 1, "value": "0" }
              ]
            }
        }
    },
    computed: {
        dropzoneOptions: function() {
            const token = window.localStorage.getItem('token');
            return {
                url: `${baseURL}saveFile/product`,
                thumbnailWidth: 150,
                headers: { "X-Auth-Token": token },
                dictDefaultMessage: "Adicionar imagens do produto",
                previewTemplate: this.dropzoneTemplate(),
            }
        }
    },
    methods: {
      ...mapActions(["loading"]),
      dropzoneTemplate() {
          return `<div class="dz-preview dz-file-preview mb-3">
                <div class="d-flex flex-row "> <div class="p-0 w-30 position-relative">
                    <div class="dz-error-mark"><span><i></i>  </span></div>
                    <div class="dz-success-mark"><span><i></i></span></div>
                    <div class="preview-container">
                      <img data-dz-thumbnail class="img-thumbnail border-0" />
                      <i class="simple-icon-doc preview-icon"></i>
                    </div>
                </div>
                <div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                  <div> <span data-dz-name /> </div>
                  <div class="text-primary text-extra-small" data-dz-size /> </div>
                  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                  <div class="dz-error-message"><span data-dz-errormessage></span></div>
                </div>
                <a href="#" class="remove" data-dz-remove> <i class="glyph-icon simple-icon-trash"></i> </a>
              </div>
      `
      },
      addInformation() {
          if(this.saveProduct.name && this.saveProduct.image && this.saveProduct.sku){
            let product = this.saveProduct;
            this.product.info.push(product);
            this.saveProduct = {
              internal: product.internal,
              commercial: product.commercial,
              name: '',
              sku: '',
              image: ''
            }
              this.$refs.myVueDropzone.removeFile(this.file);
          }else{
              this.$notify("error", "Opsss...!", "Você precisa inserir uma imagem e o nome da cor", {
                  duration: 3000,
                  permanent: false
              });
          }
      },
      completeUpload(file) {
          this.file = file;
          this.saveProduct.image = JSON.parse(file.xhr.response).data;
          this.listImages.push(
            {
              id: 6,
              label: 'Imagem',
              value: this.saveProduct.image,
              type: 'img'
            }
          )
      },
      async getInfoProduct(){
        const response = await api.get('admin/product/info');
        if(response.data.status == 'success') {
          if(response.data.data.type) {
            this.productInfo = response.data.data
          }
        }
      },
      refreshElements(){
          let createdProduct = [];
          for(let i in this.createdProduct){
            console.log(createdProduct)
            if(createdProduct.filter(r => r.label == this.createdProduct[i].label).length == 0) {
              createdProduct.push(this.createdProduct[i]);
            }
          }
          this.createdProduct = createdProduct;

          let listAttributes = [];
          for(let i in this.productInfo.attributes){
            console.log(listAttributes)
            if(listAttributes.filter(r => r.label == this.productInfo.attributes[i].label).length == 0) {
              listAttributes.push(this.productInfo.attributes[i]);
            }
          }

          this.productInfo.attributes = listAttributes;
      },
      addVariation(){
        let created = JSON.stringify(this.createdProduct);

        if(!this.keepForm) {
          for(let i in this.productInfo.attributes) {
            this.productInfo.attributes[i].value = ''
          }
          this.createdProduct = []
        }

        let productCurrent = JSON.parse(created);
        if(this.isEdition === false) {
          this.product.attributes.push(productCurrent);
        }else{
          productCurrent.edition = true;
          this.product.attributes[this.isEdition] = productCurrent;

          for(let i in this.createdProduct) {
            this.createdProduct[i] = ''
          }
        }
        this.isEdition = false;
      },
      editVariation(variation){
        let info = JSON.stringify(this.product.attributes[variation]);
        this.createdProduct = JSON.parse(info)
        this.isEdition = variation;

      },

      async getProductInfo(){
        const response = await api.get(`admin/product/${this.$route.params.id}`);
        this.product = response.data.data
      },
      async editProduct() {
          const response = await api.put(`admin/product/${this.$route.params.id}`, this.product);
          if(response.data.status == 'success') {
              this.$notify("success", "Sucesso", response.data.message, {
                  duration: 3000,
                  permanent: false
              });
              this.$router.push('/admin/product/view');
          }else{
              this.$notify("error", "Opsss...!", response.data.message, {
                  duration: 3000,
                  permanent: false
              });
          }
      },
      addItemProduct(){
        if(this.productDistribuidor.price.filter(r => r.qty == this.addPrices).length > 0){
          this.$notify("error", "Opsss...!", "Você já tem essa quantia parametrizada", {
            duration: 3000,
            permanent: false
          });
        }else{
          this.productDistribuidor.price.push({qty: this.addPrices, value: 0});
          this.productDistribuidor.price = this.productDistribuidor.price.sort((a, b)=> a.qty - b.qty)
        }
      },

      async savePrecos(){
          let company = this.$route.params.id;

          const data = await api.post(`admin/distribution/price/0`,{
            product: this.$route.params.id,
            price: this.productDistribuidor.price,
          });

          this.$notify("success", "Sucesso", "Preços alterados com sucesso", {
            duration: 3000,
            permanent: false
          });
        },

    },
    created(){
      this.getInfoProduct();
      this.getProductInfo();
    }
}
</script>

<style>
.product_title{
  position: absolute;
  bottom: 0;
  background: #fff;
  width: 100%;
  text-shadow: 1px 1px 2px rgba(0,0,0,.2);
}

.area-drop{
  width: 100%;
  min-height: 300px;
}

.list-group{
  height: 100%;
  width: 100%;
}

.min-height {
  min-height: 200px;
}

.image-drag{display: none; transition:.5s;}
.image-hover:hover .image-drag {
  cursor: pointer;
  display: flex;
  top:0;
  left:0;
  background: rgba(100,100,100,.5);
}

.border {
  min-height: 40px;
}
.border.position-relative .label{
    top: -15px;
    left: 10px;
    padding: 5px;
    background: #fff;
}
</style>
