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
                      <b-input-group class="mb-4 cnpj">
                        <the-mask class="form-control " v-model="company.cnpj" :mask="['###.###.###-##', '##.###.###/####-##']" />
                        <b-input-group-append>
                        </b-input-group-append>
                      </b-input-group>
                        <vue-dropzone
                            @vdropzone-complete="completeUpload"
                            ref="myVueDropzone" id="dropzone" class="mb-4" :options="dropzoneOptions">
                        </vue-dropzone>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Nome da empresa" class="has-float-label mb-4">
                            <b-form-input v-model="company.name" type="text" placeholder="Nome da empresa" />
                        </b-form-group>
                        <b-form-group label="Vendedor" class="has-float-label mb-4">
                          <b-form-input v-model="company.vendedor" type="text" placeholder="E-mail" />
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
            <b-card class="mb-4" title="Restrições" v-if="product">
                <b-row>
                  <b-colxx class="mb-4" md="3" lg="3" v-for="(pro, index) in allProduct" :key="index" >
                    <b-card no-body>
                      <b-card-body>
                          <div class="d-flex justify-content-between align-items-center">
                              <div class="d-inline-block">
                                  <h5 class="d-inline">{{ pro.name }}</h5>
                              </div>
                              <div :id="`res_pro_${pro.id}`" v-if="restrictions.product.indexOf(pro.id) == -1" class="text-danger cursor-pointer" @click="restrictions.product.push(pro.id)"><i class="glyph-icon simple-icon-trash p-0"></i></div>

                              <div :id="`res_pro_${pro.id}`" v-else class="cursor-pointer text-success" @click="restrictions.product = restrictions.product.filter(r => r != pro.id)"><i class="glyph-icon simple-icon-check p-0"></i></div>

                              <b-tooltip :target="`res_pro_${pro.id}`" :placement="`res_pro_${pro.id}`"
                                  :title="(restrictions.product.indexOf(pro.id) >= 0 ? 'Permitir' : 'Restringir') + ` produto`" ></b-tooltip>
                          </div>
                          <div v-if="pro.variation && restrictions.product.indexOf(pro.id) == -1">
                            <hr>
                            <h4>Variações: </h4>
                            <div class="sizes" v-if="pro.variation.sizes">
                              <p class="mb-0">Tamanhos</p>
                              <div class="d-flex justify-content-between align-items-center my-2 area py-1" v-for="(sizes, i) in pro.variation.sizes.commercial" :key="i">
                                <span> {{sizes}}</span>
                                <div v-if="restrictions.sizes.indexOf(`${pro.id}_${sizes}`) >= 0" class="text-success cursor-pointer" @click="removeVariationRestrict(pro.id, sizes, 'sizes')" :id="`res_size_${pro.id}_${sizes}`">
                                  <i class="glyph-icon simple-icon-check p-0"></i>
                                </div>

                                <div v-else class="text-danger cursor-pointer" @click="addVariationRestrict(pro.id, sizes, 'sizes')" :id="`res_size_${pro.id}_${sizes}`">
                                  <i class="glyph-icon simple-icon-trash p-0"></i>
                                </div>
                                  <b-tooltip :target="`res_size_${pro.id}_${sizes}`" :placement="`res_size_${pro.id}_${sizes}`"
                                  :title="(restrictions.sizes.indexOf(`${pro.id}_${sizes}`) >= 0 ? 'Permitir' : 'Restringir')+` variação`" ></b-tooltip>

                              </div>
                            </div>
                            <hr>
                            <div class="sizes" v-if="pro.variation.colors">
                              <p class="mb-0">Cores</p>
                              <div class="d-flex justify-content-between align-items-center my-2 area py-1" v-for="(colors, index) in pro.variation.colors" :key="index">
                                <span> {{colors.name}}</span>
                                 <div v-if="restrictions.colors.indexOf(`${pro.id}_${colors.name}`) >= 0" class="text-success cursor-pointer" @click="removeVariationRestrict(pro.id, colors.name, 'colors')" :id="`res_size_${pro.id}_${colors.name}`">
                                  <i class="glyph-icon simple-icon-check p-0"></i>
                                </div>

                                <div v-else class="text-danger cursor-pointer" @click="addVariationRestrict(pro.id, colors.name, 'colors')" :id="`res_size_${pro.id}_${colors.name}`">
                                  <i class="glyph-icon simple-icon-trash p-0"></i>
                                </div>
                                  <b-tooltip :target="`res_size_${pro.id}_${colors.name}`" :placement="`res_size_${pro.id}_${colors.name}`"
                                  :title="(restrictions.colors.indexOf(`${pro.id}_${colors.name}`) >= 0 ? 'Permitir' : 'Restringir')+` variação`" ></b-tooltip>
                              </div>
                            </div>
                          </div>

                      </b-card-body>
                    </b-card>
                  </b-colxx>
                </b-row>
            </b-card>
            <b-card class="mb-4" title="Produtos especifícos">
                <b-alert variant="info" fade show dismissible>Os produtos cadastrados aqui vão aparecer apenas para essa empresa!</b-alert>
                <b-row v-for="(product, index) in newProduct" :key="index">
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
                        <b-form-group>
                            <select class="form-control" v-model="product.type">
                                <option value="2">Tipo do produto</option>
                                <option value="2">Lente</option>
                                <option value="2">Diopmetria</option>
                                <option value="4">Tratamento</option>
                            </select>
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                      <button v-if="index+1 != newProduct.length" class="btn btn-outline-danger float-right" @click="newProduct.splice(index, 1)"><i class="glyph-icon simple-icon-trash p-0"></i></button>
                      <button v-else class="btn btn-outline-success float-right" @click="newProduct.push({name: '', type: '', price: ''})"><i class="glyph-icon simple-icon-plus p-0"></i></button>
                    </b-colxx>
                </b-row>
            </b-card>
            <b-card class="mb-4" title="Usuários de acesso">
                <b-colxx md="12" lg="12">
                    <b-row v-for="(user, index) in company.users" :key="index">
                        <b-colxx md="3" lg="3">
                            <b-form-group label="E-mail" class="has-float-label mb-4">
                                <b-form-input v-model="user.email" type="text" placeholder="Nome da empresa" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx md="3" lg="3">
                            <b-form-group label="Senha" class="has-float-label mb-4">
                                <b-form-input v-model="user.password" type="text" placeholder="Nome da empresa" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx md="3" lg="3">
                            <b-form-group label="Nome" class="has-float-label mb-4">
                                <b-form-input v-model="user.name" type="text" placeholder="Nome da empresa" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx md="3" lg="3">
                            <button @click="removeUser(index)" class="btn btn-outline-danger float-right"><i class="glyph-icon simple-icon-trash"></i></button>
                        </b-colxx>
                    </b-row>
                    <b-row class="mb-4">
                        <b-colxx>
                            <button @click="() => { company.users.push({email: '', password: '', name: ''}) }" class="btn btn-outline-success float-right">Adicionar mais um usuário</button>
                        </b-colxx>
                    </b-row>
                </b-colxx>
            </b-card>
        </b-colxx>
        <b-colxx>
            <button class="btn btn-success float-right" @click="addCompany">Adicionar Empresa</button>
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
          processing:null,
          requestError: null,
          newProduct:[
            {
              name: '',
              type: '',
              price: ''
            }
          ],
          restrictions: {
            product:[],
            sizes: [],
            colors: []
          },
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
                  colors: [

                  ],
                  sizes: [

                  ]
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
                headers: { "X-Auth-Token": token },
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
        async getProducts() {
            const response = await api.get(`admin/product/filter?type=1`);
            this.product = response.data.data.products.map(r => {r.checked = true; return r});
        },
        async getAllProducts() {
            const response = await api.get('admin/product');
            this.allProduct = response.data.data.map(p => {p.valueD = 0; p.restrict = false; return p});
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
          this.company.restrictions = this.restrictions;
            await api.post('admin/company', {company: this.company, dynamic: this.allProduct, newProduct: this.newProduct});
        },
        addVariationRestrict(product, value, type) {
          this.restrictions[type].push(`${product}_${value}`);
        },
        removeVariationRestrict(product, value, type) {
          this.restrictions[type] = this.restrictions[type].filter(r => r != `${product}_${value}`);
        },
        async buscaBling() {
          this.processing = true;
          const response = await api.get(`admin/bling/company/${this.company.cnpj}`);
          const data = response.data;
          this.$notify(data.status, data.status == 'success' ? "Sucesso" : "Opsss...!", data.message, {
            duration: 3000,
            permanent: false
          });

          if(data.status == 'success') {
            const {nome, cnpj, nomeVendedor, email } = data.data.company;
            this.company.name = nome;
            this.company.cnpj = cnpj;
            this.company.email = email;
            this.company.vendedor = nomeVendedor;
          }

          this.processing = false;
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
.sizes {
  display: block;
}

.but {
  display: block;
  width: 25px;
  height: 25px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  cursor: pointer;
}

.area:hover {
  background: #dedede;
}

.cursor-pointer {
  cursor: pointer;
}

.cnpj{
  position: relative;
}

.cnpj::before {
  content: 'CNPJ';
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  cursor: text;
  font-size: 90%;
  opacity: 1;
  top: -0.4em;
  left: 0.75rem;
  z-index: 3;
  line-height: 1;
  padding: 0 2px;
  color: #8c8381;
  background: #fff;
}
</style>
