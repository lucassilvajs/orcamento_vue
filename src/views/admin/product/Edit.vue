<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Novo produto</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-alert variant="info" show  dismissible>Você pode parametrizar o preço e as variações disponíveis na tela de cadastro/edição da empresa que você quiser!</b-alert>
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
                        <b-form-group label="SKU" class="has-float-label mb-4">
                            <b-form-input v-model="product.sku" type="text" placeholder="SKU" />
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
                        <b-form-group>
                            <select class="form-control" v-model="product.type">
                                <option value="1" selected="selected">Tipo do produto</option>
                                <option value="1">Óculos</option>
                                <option value="2">Lente</option>
                                <option value="4">Tratamento</option>
                            </select>
                        </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>
            
            <b-card class="mb-4" title="Cor">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Cor" class="has-float-label mb-4">
                            <b-form-input v-model="color.name" type="text" placeholder="Cor" />
                        </b-form-group>
                        <vue-dropzone 
                            @vdropzone-complete="completeUpload"
                            ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
                        <button class="btn btn-success w-100 mt-3" @click="addImage">Adicionar Cor</button>
                    </b-colxx>
                     <b-colxx md="8" lg="9">
                        <b-row>
                            <b-colxx v-for="(product,productIndex) in product.colors" xxs="6" lg="3" xl="3" class="mb-4" :key="`product_${productIndex}`">
                                <b-card no-body>
                                    <div class="position-relative">
                                        <b-card-img top :alt="product.title" :src="baseURL+product.image" />
                                        <h4 class="product_title">{{product.title}}</h4>
                                    </div>
                                </b-card>
                            </b-colxx>
                        </b-row>
                    </b-colxx>
                </b-row>
            </b-card>

            <b-card class="mb-4" title="Tamanho">
                <b-row>
                    <b-colxx lg="3">
                        <div class="alert alert-info"><i class="glyph-icon simple-icon-info"></i> Insira uma medida e tecle Enter</div>
                        <b-form-group label="Comercial" class="has-float-label mb-4">
                            <input-tag v-model="product.sizes.commercial"></input-tag>
                        </b-form-group>
                        <b-form-group label="Interno" class="has-float-label mb-4">
                            <input-tag v-model="product.sizes.internal"></input-tag>
                        </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>
        </b-colxx>
        <b-colxx>
            <button class="btn btn-success float-right" @click="editProduct">Adicionar Produto</button>
        </b-colxx>
    </b-row>
</div>
</template>

<script>

import {
    mapGetters,
    mapActions
} from "vuex";
import {Money} from '../../../../dist/assets/js/vmoney.js'
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
            product:{
                type: '1',
                name: '',
                sku: '',
                price: '',
                colors: [],
                sizes: {
                    commercial: [48, 50],
                    internal: [48, 50]
                }
            },
            baseURL,
            color: {
                name: '',
                image: ''
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
                headers: { "x-auth-token": token },
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
            if(this.color.name && this.color.image){
                this.product.colors.push({
                    name: this.color.name,
                    image: this.color.image,
                });

                this.color.name = '';
                this.color.image = '';
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
        async getProduct(){
            const id = this.$route.params.id;
            const response = await api.get(`admin/product/${id}`);
            this.product = response.data.data;
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
</style>