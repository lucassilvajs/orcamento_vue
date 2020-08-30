<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Novo produto</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-alert variant="info" show dismissible >Você pode parametrizar o preço e as variações disponíveis na tela de cadastro/edição da empresa que você quiser!</b-alert>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Novo produto">
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
                            <select class="form-control" v-model="product.status" id="status">
                              <option value="Active">Ativo</option>
                              <option value="Inactive">Inativo</option>
                            </select>
                        </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>

            <b-card class="mb-4" title="Cor" v-if="product.type == 1">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="SKU" class="has-float-label mb-1">
                            <b-form-input v-model="color.sku" type="text" placeholder="SKU" />
                        </b-form-group>
                        <b-alert variant="info" show  dismissible>O mesmo do bling!</b-alert>

                        <b-form-group label="Cor" class="has-float-label my-4">
                            <b-form-input v-model="color.name" type="text" placeholder="Cor" />
                        </b-form-group>
                        <vue-dropzone
                            @vdropzone-complete="completeUpload"
                            ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
                          <button class="btn btn-success w-100 mt-3" @click="addImage">{{color.index === false ? 'Adicionar' : 'Editat'}} cor</button>

                    </b-colxx>
                     <b-colxx md="8" lg="9">
                        <b-row>
                            <b-colxx v-for="(product,productIndex) in product.colors" xxs="6" lg="3" xl="3" class="mb-4" :key="`product_${productIndex}`">
                                <b-card style="cursor:pointer;" no-body @click="editColor(productIndex)">
                                    <div class="position-relative">
                                        <b-card-img top :alt="product.name" :src="product.image ? baseURL+product.image :  placeholder" />
                                        <h4 class="product_title">{{product.name}}</h4>
                                    </div>
                                </b-card>
                            </b-colxx>
                        </b-row>
                    </b-colxx>
                </b-row>
            </b-card>

            <b-card class="mb-4" title="Tamanho" v-if="product.type == 1">
                <b-row>
                    <b-colxx lg="12">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Imagem</th>
                            <th>Cor</th>
                            <th>Comercial</th>
                            <th>Interno</th>
                            <th>SKU</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(size, indexSize) in product.sizes.commercial" :key="indexSize">
                            <td>
                              <img src="https://idsafety.com.br/uploads/post/imagem/EP3D_ckHx_GjQq0.jpg" style="width:100px;" alt="">
                            </td>
                            <td>Cor</td>
                            <td>
                              <input type="text" v-model="product.sizes.commercial[indexSize]" class="form-control">
                            <td>
                              <input type="text" v-model="product.sizes.internal[indexSize]" class="form-control">
                            </td>
                            <td>
                              <input type="text" v-model="product.sizes.internal[indexSize]" class="form-control">
                            </td>
                            <td>
                              <button class="btn btn-xs btn-outline-danger" @click="() => {
                                  product.sizes.commercial.splice(indexSize,1)
                                  product.sizes.internal.splice(indexSize,1)
                                }">
                                <div class="glyph-icon simple-icon-trash"></div>
                              </button>
                            </td>
                          </tr>
                          <tr v-if="product.sizes.commercial.length == 0">
                            <td colspan="3">Nenhum tamanho foi encontrado</td>
                          </tr>
                          <tr>
                            <td colspan="3">
                              <button class="btn btn-outline-success float-right" @click="() => {
                                  product.sizes.commercial.push('');
                                  product.sizes.internal.push('');
                              }">Adicionar tamanho</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </b-colxx>
                </b-row>
            </b-card>

            <b-card class="mb-4" title="Atributos">
                <b-row v-for="(attr, index) in product.attributes" :key="index">
                    <b-colxx>
                        <b-form-group label="Nome do Atributo" class="has-float-label mb-4">
                            <b-form-input v-model="product.attr[index].name" type="text" placeholder="Nome do Produto" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx>
                        <b-form-group label="Descrição" class="has-float-label mb-4">
                            <b-form-input v-model="product.attr[index].label" type="text" placeholder="Nome do Produto" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx>
                        <b-form-group label="Valores" class="has-float-label mb-4">
                        </b-form-group>
                    </b-colxx>
                    <div width="80">
                        <button class="btn btn-danger float-right">-</button>
                    </div>
                </b-row>
                <b-row>
                    <b-colxx>
                        <b-form-group label="Nome do Atributo" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Nome do Produto" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx>
                        <b-form-group label="Descrição" class="has-float-label mb-4">
                            <b-form-input type="text" placeholder="Nome do Produto" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx>
                        <b-form-group label="Valores" class="has-float-label mb-4">
                            <input-tag></input-tag>
                        </b-form-group>
                    </b-colxx>
                    <div width="80">
                        <button class="btn btn-success float-right">+</button>
                    </div>
                </b-row>
            </b-card>
        </b-colxx>
        <b-colxx>
            <button class="btn btn-success float-right" @click="editProduct">Editar Produto</button>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import placeholder from '@/assets/img/placeholder-image.png'
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
            placeholder,
            product:{
                type: '1',
                name: 's',
                sku: '',
                price: '',
                colors: [],
                sizes: {
                    commercial: [],
                    internal: []
                }
            },
            baseURL,
            color: {
                name: '',
                image: '',
                sku: '',
                index: false
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
        addImage() {
            if(this.color.name && this.color.image && this.color.sku ){
              console.log(this.color.index)
              if(this.color.index !== false) {
                this.product.colors[this.color.index] = {
                  name: this.color.name,
                  image: this.color.image,
                  sku: this.color.sku,
                }

                this.color.index = false
              }else{
                this.product.colors.push({
                    name: this.color.name,
                    image: this.color.image,
                    sku: this.color.sku,
                });
              }

                this.color.name = '';
                this.color.image = '';
                this.color.sku = '';
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
            this.color.image = JSON.parse(file.xhr.response).data;
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
        async getProduct(){
            const id = this.$route.params.id;
            const response = await api.get(`admin/product/${id}`);
            this.product = response.data.data;
        },
        editColor(index){
          let i = this.product.colors[index];
          this.color = i
          this.color.index = index;
        }
    },
    created(){
        this.getProduct();
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

.delete-color {
    width: 40px;
    height: 40px;
    background: #ddd;
    border: none;
    border-radius: 15px;
    font-size: 1.8rem;
    position: absolute;
    top: -15px;
    right: -15px;
    font-weight: bold;
    padding: 0;
}
</style>
