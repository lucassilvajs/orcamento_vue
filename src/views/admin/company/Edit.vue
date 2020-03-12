<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Novo produto</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row v-if="company.name.length > 1">
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Empresa">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Nome da empresa" class="has-float-label mb-4">
                            <b-form-input v-model="company.name" type="text" placeholder="Nome da empresa" />
                        </b-form-group>
                        <vue-dropzone 
                            @vdropzone-complete="completeUpload"
                            ref="myVueDropzone" id="dropzone" class="mb-4" :options="dropzoneOptions">
                        </vue-dropzone>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="CNPJ" class="has-float-label mb-4">
                            <fieldset class="form-group has-float-label mb-4">
                                <div tabindex="-1" role="group" class="bv-no-focus-ring">
                                    <the-mask class="form-control" v-model="company.cnpj" :mask="['###.###.###-##', '##.###.###/####-##']" />
                                </div>
                            </fieldset>
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="E-mail Primario" class="has-float-label mb-4">
                            <b-form-input v-model="company.email" type="text" placeholder="E-mail" />
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
                <div class="alert alert-info">Para manter o preço original você pode deixar o campo do valor zerado</div>
                <b-row>
                    <b-colxx md="3" lg="3" v-for="(pro, index) in allProduct" :key="index">
                        <p class="mb-1">{{pro.name}}</p>
                        <b-input-group class="mb-3">
                            <Money class="form-control" v-model="pro.value" :disabled="true" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
                            <Money class="form-control" v-model="pro.valueD" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
                        </b-input-group>
                    </b-colxx>
                </b-row>
            </b-card>
            <!-- <b-card class="mb-4" title="Restrições" v-if="product">
                <b-colxx md="12" lg="12">
                    <div class="alert alert-info">Selecione os parametros <b>não</b> permitidos para essa empresa!</div>
                    <b-row>
                        <b-colxx md="6" lg="6">
                            <b-form-group label="Tamanhos não permitidos" class="has-float-label mb-4">
                                <input-tag v-model="company.restrictions.sizes"></input-tag>
                            </b-form-group>
                        </b-colxx>
                        <b-colxx md="6" lg="6">
                            <b-form-group label="Cores não permitidas" class="has-float-label mb-4">
                                <input-tag v-model="company.restrictions.colors"></input-tag>
                            </b-form-group>
                        </b-colxx>
                    </b-row>
                    <b-row>
                        <b-colxx md="3" class="mt-3" v-for="(pro, i) in allProduct" :key="pro.id">
                            <b-card no-body style="cursor:pointer;" class="d-flex justify-content-center" @click="pro.restrict = !pro.restrict">
                                    <h4 class="">{{pro.name}} <img :src="pro.restrict ? checked : check" style="width:20px; float:right;" /> </h4>
                            </b-card>
                        </b-colxx>
                    </b-row>
                </b-colxx>
            </b-card>
            <b-card class="mb-4" title="Usuários de acesso">
                <b-colxx md="12" lg="12">
                    <b-row v-for="(user, index) in company.users" :key="index">
                        <b-colxx md="4" lg="4">
                            <b-form-group label="E-mail" class="has-float-label mb-4">
                                <b-form-input v-model="user.email" type="text" placeholder="E-mail" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx md="4" lg="4">
                            <b-form-group label="Senha" class="has-float-label mb-4">
                                <b-form-input v-model="user.password" type="text" placeholder="Senha" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx md="3" lg="3">
                            <b-form-group label="Nome" class="has-float-label mb-4">
                                <b-form-input v-model="user.name" type="text" placeholder="Nome" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx md="1" lg="1">
                            <button @click="removeUser(index)" class="btn btn-outline-danger"><i class="glyph-icon simple-icon-trash"></i></button>
                        </b-colxx>
                    </b-row>
                    <b-row class="mb-4">
                        <b-colxx>
                            <button @click="() => { company.users.push({email: '', password: '', name: ''}) }" class="btn btn-outline-success float-right">Adicionar mais um usuário</button>
                        </b-colxx>
                    </b-row>

                </b-colxx>
            </b-card> -->
        </b-colxx>
        <b-colxx>
            <button class="btn btn-success float-right" @click="addCompany">Editar Empresa</button>
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
import {Money} from '@/vmoney.js';
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
                users: [
                    {
                        email: '',
                        password: '',
                        name: ''
                    }
                ],
                restrictions: {
                    sizes: [],
                    colors: []
                },
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
                url: `${baseURL}saveFile/company`,
                thumbnailWidth: 150,
                maxFilesize: 1,
                headers: { "x-auth-token": token },
                dictDefaultMessage: "Clique ou arraste para adicionar uma imagem",
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
            this.company.image = JSON.parse(file.xhr.response).data;
        },
        async getCompany() {
            const response = await api.get(`admin/company/${this.$route.params.id}`);
            this.company = response.data.data;
        },
        async getProducts() {
            const response = await api.get(`admin/product/filter?type=1`);
            this.product = response.data.data.products.map(r => {r.checked = true; return r});
            
            // const colors = this.product.map(r => r.variation.colors.map(c => c.name))
            // let cor = []
            // colors.forEach(element => {
            //     element.forEach(el => {
            //         cor.push(el);
            //     })
            // });

            // this.company.restrictions.colors = cor.filter((value, index, self) => { 
            //     return self.indexOf(value) === index;
            // });

            // let size = [];
            // this.product.forEach(el => {
            //     el.variation.sizes.commercial.forEach((e) => {size.push(e)})
            // });

            // this.company.restrictions.sizes = size.filter((value, index, self) => { 
            //     return self.indexOf(value) === index;
            // });
        },
        async getAllProducts() {
            const response = await api.get('admin/product');
            this.allProduct = response.data.data.map(p => {
                p.valueD = 0;
                p.restrict = false;
                return p
            });
        },
        removeUser(index) {
            if(this.company.users.length == 1) {
                this.$notify("error", "Opsss...!", "Você precisa ter pelo menos um usuário para acessar", {
                    duration: 3000,
                    permanent: false
                });
            }else{
                this.company.users = this.company.users.filter((r,i) => {return i != index})
            }
        },
        async addCompany(){
            await api.post('admin/company', {company: this.company, dynamic: this.allProduct});
        },
        removeItem() {            
        }
    },
    async created(){
        await this.getCompany();
        await this.getAllProducts();
        await this.getProducts();
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
div#dropzone{
    position: relative;
}
div#dropzone::after {
    content: 'Logo';
    position: absolute;
    top: -10px;
    left: 10px;
    color: #888;
    font-size: 90%;
    padding: 0 3px;
    background: #fff;
}
</style>