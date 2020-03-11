<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Novo produto</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Empresa">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Nome da empresa" class="has-float-label mb-4">
                            <b-form-input v-model="company.name" type="text" placeholder="Nome da empresa" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="CNPJ" class="has-float-label mb-4">
                            <fieldset class="form-group has-float-label mb-4">
                                <div tabindex="-1" role="group" class="bv-no-focus-ring">
                                    <!-- <Money class="form-control" v-model="product.price" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/> -->
                                    <the-mask class="form-control" :mask="['###.###.###-##', '##.###.###/####-##']" />
                                </div>
                            </fieldset>
                            <!-- <b-form-input v-model="company.cnpj" type="text" placeholder="CNPJ" /> -->
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="E-mail Primario" class="has-float-label mb-4">
                            <b-form-input v-model="company.email" type="text" placeholder="CNPJ" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Campos para criação de pedido" class="has-float-label mb-4">
                            <input-tag v-model="company.fields"></input-tag>
                        </b-form-group>
                        <div class="alert alert-info">Após inserir um campo tecle enter para adicionar outro</div>
                    </b-colxx>
                </b-row>
            </b-card>
            <b-card class="mb-4" title="Tabela de preços dinamica" v-if="product">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-input-group class="mb-3">
                            <b-form-input/>
                            <b-input-group-append>
                                <b-dropdown text="R$" variant="outline-secondary">
                                    <b-dropdown-item>R$</b-dropdown-item>
                                    <b-dropdown-item>%</b-dropdown-item>
                                </b-dropdown>
                            </b-input-group-append>
                        </b-input-group>
                    </b-colxx>
                </b-row>
            </b-card>
            <b-card class="mb-4" title="Restrições" v-if="product">
                <b-colxx md="12" lg="12">
                    <div class="alert alert-info">Selecione os produtos <b>permitidos</b> para essa empresa!</div>
                    <b-row>
                        <b-colxx md="4" lg="3">
                            <b-form-group label="Tamanhos Permitidos" class="has-float-label mb-4">
                                <input-tag v-model="product.sizes"></input-tag>
                            </b-form-group>
                            <div class="alert alert-info">Após inserir um campo tecle enter para adicionar outro</div>
                        </b-colxx>
                        <b-colxx md="4" lg="3">
                            <b-form-group label="Cores Permitidas" class="has-float-label mb-4">
                                <input-tag v-model="product.colors"></input-tag>
                            </b-form-group>
                            <div class="alert alert-info">Após inserir um campo tecle enter para adicionar outro</div>
                        </b-colxx>
                    </b-row>

                </b-colxx>
            </b-card>
        </b-colxx>
        <b-colxx>
            <button class="btn btn-success float-right" @click="() => {}">Adicionar Empresa</button>
        </b-colxx>
    </b-row>
</div>
</template>

<script>
import check from '@/assets/img/check.svg'
import checked from '@/assets/img/checked.svg'
import {
    mapGetters,
    mapActions
} from "vuex";
import {Money} from '../../../../dist/assets/js/vmoney.js';
import {TheMask} from 'vue-the-mask';
import {api, baseURL} from '@/constants/config';
import VueDropzone from 'vue2-dropzone';
import InputTag from '@/components/Form/InputTag'
export default {
    components:{
        'vue-dropzone': VueDropzone,
        'input-tag': InputTag,
        Money,
        TheMask
    },
    data() {
        return {
            company: {
                name: '',
                cnpj: '',
                email: '',
                image: '',
                fields: [],
                users: [],
                restrictions: [],
            },
            product:null,
            baseURL,
            color: {
                name: '',
                image: ''
            },
            file: null,
            check,
            checked,
            allProduct: null
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
        async getProducts() {
            const response = await api.get(`admin/product/filter?type=1`);
            this.product = response.data.data.products.map(r => {r.checked = true; return r});
            
            const colors = this.product.map(r => r.variation.colors.map(c => c.name))
            let cor = []
            colors.forEach(element => {
                element.forEach(el => {
                    cor.push(el);
                })
            });

            this.product.colors = cor.filter((value, index, self) => { 
                return self.indexOf(value) === index;
            });

            let size = [];
            this.product.forEach(el => {
                el.variation.sizes.commercial.forEach((e) => {size.push(e)})
            });

            this.product.sizes = size.filter((value, index, self) => { 
                return self.indexOf(value) === index;
            });
        },
        async getAllProducts() {
            const response = await api.get('admin/product');
            this.allProduct = response.data.data.map(p => {p.inDelete = false; return p});
        }
    },
    created(){
        this.getProducts();
        this.getAllProducts();
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
    font-size: 1.1rem;
    padding: 5px 0;
}

.check-area{
    height: 20px;
    float: right;
    margin-right: 10px;
}
</style>