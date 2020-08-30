<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Novo produto</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-alert variant="info" show  dismissible>Você pode parametrizar o preço e as variações disponíveis na tela de cadastro/edição da empresa que você quiser!</b-alert>
    <b-row v-if="productInfo.type">
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Informações gerais">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Nome do Produto" class="has-float-label mb-4">
                            <b-form-input v-model="product.name" type="text" placeholder="Nome do Produto" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Preço" class="has-float-label mb-4">
                            <fieldset class="form-group has-float-label mb-4">
                                <legend tabindex="-1" class="bv-no-focus-ring col-form-label pt-0">Preço</legend>
                                <div tabindex="-1" role="group" class="bv-no-focus-ring">
                                    <Money class="form-control" v-model="product.price" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
                                </div>
                            </fieldset>
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="Status" class="has-float-label mb-4">
                        <b-form-select v-model="product.status" :options="[{value: 'Active', text: 'Ativo'}, {value: 'Inactive', text: 'Inativo'}]" />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="Tipo do produto" class="has-float-label mb-4">
                        <b-form-select v-model="product.type" :options="productInfo.type.map(r => {
                          return {value: r.id,
                          text: r.name}
                          })" />
                      </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>

            <b-card class="mb-4" title="Informações gerais" v-if="['1', '6'].indexOf(product.type) >= 0">
                <b-row>
                  <b-colxx md="6" lg="6">
                    <b-row class="mb-3">
                      <b-form-group label="SKU (mesmo do bling)" class="col-lg-6 has-float-label mb-1">
                          <b-form-input v-model="saveProduct.sku" type="text" placeholder="SKU" />
                      </b-form-group>

                      <b-form-group label="Cor" class="col-lg-6 has-float-label mb-1">
                          <b-form-input v-model="saveProduct.name" type="text" placeholder="Cor" />
                      </b-form-group>
                    </b-row>
                    <table class="table">
                      <thead>
                        <tr>
                          <th>Interno</th>
                          <th>Comercial</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(size, indexSize) in saveProduct.commercial" :key="indexSize">
                          <td>
                            <b-input v-model="saveProduct.internal[indexSize]" />
                          </td>
                          <td>
                            <b-input v-model="saveProduct.commercial[indexSize]" />
                          </td>
                          <td>
                            <button @click="() => {
                                saveProduct.commercial.splice(indexSize,1)
                                saveProduct.internal.splice(indexSize,1)
                              }" class="btn btn-xs btn-outline-danger">
                              <div class="glyph-icon simple-icon-trash"></div>
                            </button>
                          </td>
                        </tr>
                        <tr v-if="saveProduct.commercial.length == 0">
                          <td colspan="3">Nenhum tamanho foi encontrado</td>
                        </tr>
                        <tr>
                          <td colspan="3">
                            <button @click="() => {
                                saveProduct.internal.push('');
                                saveProduct.commercial.push('');
                            }" class="btn btn-outline-success btn-block">Adicionar <div class="d-inline glyph-icon simple-icon-plus"></div></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <vue-dropzone
                        @vdropzone-complete="completeUpload"
                        ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
                    <button class="btn btn-success w-100 mt-3" @click="addInformation">Adicionar informação</button>
                  </b-colxx>
                    <b-colxx md="6" lg="6">
                      <b-row>
                          <b-colxx v-for="(prod, productIndex) in product.info" xxs="6" lg="6" xl="6" class="mb-4" :key="`product_${productIndex}`">
                              <b-card no-body>
                                  <div class="position-relative">
                                      <button style="position:absolute; right:5px; top:5px;" @click="() => {
                                          product.info.splice(productIndex,1)
                                        }" class="btn btn-xs btn-outline-danger">
                                        <div class="glyph-icon simple-icon-trash"></div>
                                      </button>
                                      <b-card-img v-if="prod.image" top :alt="prod.name" :src="baseURL+prod.image" />
                                      <h4 class="product_title">{{product.name}}</h4>
                                  </div>
                              </b-card>
                          </b-colxx>
                      </b-row>
                  </b-colxx>
                </b-row>
            </b-card>

            <b-card class="mb-4" title="Atributos">
              <b-row v-for="(attr, attrIndex) in product.attributes" :key="attrIndex">
                <b-colxx md="6" lg="6">
                  <b-row class="mb-3">
                    <b-colxx>
                      <b-form-group label="Nome" class="has-float-label mb-1">
                        <b-form-input v-model="attr.name" type="text" placeholder="Nome do atributo" />
                      </b-form-group>
                    </b-colxx>
                  </b-row>

                  <table class="table">
                    <thead>
                      <tr>
                        <th>Valor</th>
                        <th>SKU</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(at, atIndex) in attrInfo" :key="atIndex">
                        <td>
                          <b-input v-model="at.value" />
                        </td>
                        <td>
                          <b-input v-model="at.sku" />
                        </td>
                        <td>
                          <button @click="() => {
                              at.sku.splice(atIndex,1)
                              at.sku.splice(atIndex,1)
                            }" class="btn btn-xs btn-outline-danger">
                            <div class="glyph-icon simple-icon-trash"></div>
                          </button>
                        </td>
                      </tr>
                      <tr v-if="saveProduct.commercial.length == 0">
                        <td colspan="3">Nenhum tamanho foi encontrado</td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <button @click="() => {
                              saveProduct.internal.push('');
                              saveProduct.commercial.push('');
                          }" class="btn btn-outline-success btn-block">Adicionar <div class="d-inline glyph-icon simple-icon-plus"></div></button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <vue-dropzone
                    @vdropzone-complete="completeUpload"
                    ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
                  <button class="btn btn-success w-100 mt-3" @click="addInformation">Adicionar informação</button>
                </b-colxx>
              </b-row>
            </b-card>
          </b-colxx>
          <b-colxx>
            <button class="btn btn-success float-right" @click="addProduct">Adicionar Produto</button>
          </b-colxx>
    </b-row>
</div>
</template>

<script>

import {
    mapGetters,
    mapActions
} from "vuex";
import {Money} from '@/vmoney.js'
import {api, baseURL} from '@/constants/config';
import VueDropzone from 'vue2-dropzone';
import InputTag from '@/components/Form/InputTag'
export default {
    components:{
        'vue-dropzone': VueDropzone,
        'input-tag': InputTag,
        Money
    },
    data() {
        return {
            productInfo: {},
            saveProduct: {
              internal: [],
              commercial: [],
              name: '',
              sku: '',
              image: ''
            }, //Armazena informações auxiliares antes de adicionar ao objeto do produto
            product:{
                type: '1',
                status: 'Active',
                name: '',
                sku: '',
                price: '',
                image: '',
                info: [],
                attributes: [{
                  name: '',
                  info: [
                    {
                      value: 'Com máscara',
                      sku: ''
                    }
                  ]
                }]
            },
            baseURL,
            color: {
                name: '',
                image: '',
                sku: ''
            },
            file: null
        }
    },
    computed: {
        dropzoneOptions: function() {
            const token = window.localStorage.getItem('token');
            return {
                url: `${baseURL}saveFile/product`,
                thumbnailWidth: 150,
                maxFilesize: 1,
                headers: { "X-Auth-Token": token },
                dictDefaultMessage: "Adicionar Imagem do produto",
                previewTemplate: this.dropzoneTemplate(),
                maxFiles: 1
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
                // this.product.colors.push({
                //     name: this.color.name,
                //     image: this.color.image,
                //     sku: this.color.sku,
                // });

                // this.color.name = '';
                // this.color.image = '';
                // this.color.sku = '';
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
        },
        async addProduct() {
            const response = await api.post('admin/product', this.product);
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
        async getInfoProduct(){
          const response = await api.get('admin/product/info');
          if(response.data.status == 'success') {
            if(response.data.data.type) {
              console.log(response.data.data.type);
              this.productInfo = response.data.data

              console.log(this.productInfo.type)
            }
          }
        }
    },
    created(){
      this.getInfoProduct();
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
</style>
