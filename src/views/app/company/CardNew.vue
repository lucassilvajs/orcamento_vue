<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Nova empresa</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Informações da empresa">
                <b-row>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="CNPJ" class="has-float-label mb-4">
                          <the-mask class="form-control " v-model="company.cnpj" :mask="['###.###.###-##', '##.###.###/####-##']" />
                      </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Razão Social" class="has-float-label mb-4">
                            <b-form-input v-model="company.name" type="text" placeholder="Razão Social" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Nome fantasia" class="has-float-label mb-4">
                            <b-form-input v-model="company.fantasia" type="text" placeholder="Nome fantasia" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Inscrição Estadual / RG" class="has-float-label mb-4">
                            <b-form-input v-model="company.ie_rg" type="text" placeholder="IE / RG" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="E-mail(s) para aprovar/reprovar" class="has-float-label mb-4">
                            <b-form-input v-model="company.email" type="text" placeholder="E-mail" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Vendedor" class="has-float-label mb-4">
                          <select class="form-control" v-model="company.vendedor">
                            <option v-for="(consult, consultIndex) in consultores" :key="consultIndex" :value="consult.vendedor">{{consult.vendedor}}</option>
                          </select>
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="E-mail NF" class="has-float-label mb-4">
                            <b-form-input v-model="company.email_nf" type="text" placeholder="E-mail NF" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Telefone" class="has-float-label mb-4">
                            <the-mask class="form-control" v-model="company.fone" :mask="['(##) ####-####']" placeholder="Telefone" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Celular" class="has-float-label mb-4">
                            <the-mask class="form-control" v-model="company.celular" :mask="['(##) # ####-####']" placeholder="Telefone" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Informação do contato" class="has-float-label mb-4">
                            <b-form-input v-model="company.informacaoContato" type="text" placeholder="Informação do contato" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                      <b-form-group label="Contribuinte" class="has-float-label mb-4">
                        <select class="form-control" v-model="company.contribuinte">
                          <option value="1">Contribuinte do ICMS</option>
                          <option value="2">Contribuinte isento do ICMS</option>
                          <option value="9">Não contribuinte</option>
                        </select>
                      </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Campos para criação de pedido" class="has-float-label mb-2">
                            <input-tag v-model="company.fields"></input-tag>
                        </b-form-group>
                    </b-colxx>
                </b-row>
            </b-card>
            <b-card class="mb-4" title="Informações de endereço">
                <b-row>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="CEP" class="has-float-label mb-4">
                      <the-mask class="form-control" v-model="company.cep" @keyup.native="buscaCep" :mask="['#####-###']" placeholder="CEP" />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Endereço" class="has-float-label mb-4">
                      <b-form-input v-model="company.endereco" type="text" placeholder="Endereço" />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Número" class="has-float-label mb-4">
                      <b-form-input v-model="company.numero" type="text" placeholder="Número" ref="numero"/>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Complemento" class="has-float-label mb-4">
                      <b-form-input v-model="company.complemento" type="text" placeholder="Complemento" />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Bairro" class="has-float-label mb-4">
                      <b-form-input v-model="company.bairro" type="text" placeholder="Bairro" />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Cidade" class="has-float-label mb-4">
                      <b-form-input v-model="company.cidade" type="text" placeholder="Cidade" />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="UF" class="has-float-label mb-4">
                      <b-form-input v-model="company.uf" type="text" placeholder="UF" />
                    </b-form-group>
                  </b-colxx>
                </b-row>
            </b-card>
            <b-card class="mb-4" title="Informações de pagamento">
              <b-row>
                <b-colxx md="4" lg="3">
                  <b-form-group label="Forma de pagamento" class="has-float-label mb-4">
                    <select class="form-control" v-model="company.pagamento">
                      <option v-for="(pay, indexPay) in option.pagamento" :key="indexPay" :value="indexPay">{{pay}}</option>
                    </select>
                  </b-form-group>
                </b-colxx>
                <b-colxx md="4" lg="3">
                  <b-form-group label="Condição de pagamento" class="has-float-label mb-2">
                    <b-form-input v-model="company.paymentCondition" type="text" placeholder="Condição de pagamento" />
                  </b-form-group>
                  <b-alert variant="info" show  dismissible>Parcelas e prazo. Ex: 30, 60, 90 dias</b-alert>
                </b-colxx>
              </b-row>
            </b-card>
            <b-card class="mb-4" title="Informações adicionais e flags">
                <b-row>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Empresa com contrato" class="has-float-label mb-4">
                      <select class="form-control" v-model="company.has_contract">
                        <option value="0">Sem contrato</option>
                        <option value="1">Com contrato</option>
                      </select>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Pedido de compra" class="has-float-label mb-4">
                      <select class="form-control" v-model="company.pedido_compra">
                        <option value="0">Não obrigatório</option>
                        <option value="1">Obrigatório</option>
                      </select>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Multiplos pedidos" class="has-float-label mb-4">
                      <select class="form-control" v-model="company.multiple_order">
                        <option value="0">Compra direta</option>
                        <option value="1">Multiplos pedidos</option>
                      </select>
                    </b-form-group>
                    <b-form-group v-if="company.multiple_order == 1" label="Período de envio" class="has-float-label mb-4">
                      <b-form-input v-model="company.days_sent" type="text" placeholder="Nome da empresa" />
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="PDF Anexo" class="has-float-label mb-4">
                      <select class="form-control" v-model="company.attachment">
                        <option value="0">Não enviar</option>
                        <option value="1">Enviar</option>
                      </select>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Tipo de comprador" class="has-float-label mb-4">
                      <select class="form-control" v-model="company.type_user">
                        <option value="0">Convencional</option>
                        <option  v-if="false" value="1">Distribuidor</option>
                      </select>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                    <b-form-group label="Método de envio" class="has-float-label mb-4">
                      <select class="form-control" v-model="company.envio">
                        <option v-for="(pay, indexPay) in option.transporte" :key="pay" :value="indexPay">{{pay}}</option>
                      </select>
                    </b-form-group>
                  </b-colxx>
                  <b-colxx md="4" lg="3">
                        <vue-dropzone
                            @vdropzone-complete="completeUpload"
                            ref="myVueDropzone" id="dropzone" class="mb-4" :options="dropzoneOptions">
                        </vue-dropzone>
                    </b-colxx>
                </b-row>
            </b-card>
            <b-card class="mb-4" title="Observações">
              <b-row>
                <b-colxx>
                  <b-form-group label="Observações" class="has-float-label mb-2">
                    <b-form-textarea v-model="company.observacao" type="text" placeholder="Observações" />
                  </b-form-group>
                  <b-alert variant="info" show  dismissible>Informações de <b>pagamento e forma de entrega</b> são concatenados automaticamente, ou seja, não é necessário preencher no campo de observações</b-alert>
                </b-colxx>
              </b-row>
            </b-card>

            <!-- Cliente convencionais -->
            <b-card class="mb-4" title="Tabela de preços dinamica" v-if="company.type_user == 0">
                <div class="alert alert-info">Para manter o preço original você pode deixar o campo do valor zerado</div>
                <b-row>
                    <b-colxx md="3" lg="3" v-for="(pro, index) in allProduct.filter(r => !r.parent)" :key="index">
                        <div>
                          {{pro.name}}
                          <b-input-group class="mb-3">
                              <Money class="form-control" v-model="pro.value" :disabled="true" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
                              <Money class="form-control" v-model="pro.valueD" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
                          </b-input-group>
                        </div>
                    </b-colxx>
                </b-row>
            </b-card>
            <!-- Tabela de preços para clientes distribuidores -->
            <b-card class="mb-4" title="Tabela de preços dinamica" v-if="company.type_user == 1">
              <b-row>
                  <b-colxx md="12" lg="12">
                    <table class="w-100 table-striped">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>ID</th>
                          <th>Nome</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(pro, proIndex) in allProduct" :key="proIndex">
                          <td>
                            <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                              <div class="itemCheck mb-0 custom-control custom-checkbox">
                                <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="pro.checked" :id="`check_${pro.id}`">
                                <label class="custom-control-label" :for="`check_${pro.id}`">
                                </label>
                              </div>
                            </div>
                          </td>
                          <td>
                            {{pro.id}}
                          </td>
                          <td>
                            {{pro.name}} {{pro.subname}}
                          </td>
                          <!-- <td>
                            <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
                              <div class="itemCheck mb-0 custom-control custom-checkbox">
                                <input type="checkbox" autocomplete="off" class="custom-control-input" v-model="pro.checked" :id="`check_${pro.id}`">
                                <label class="custom-control-label" :for="`check_${pro.id}`">
                                </label>
                              </div>
                            </div>
                          </td>
                          <td>{{pro.id}}</td>
                          <td>{{pro.name}}</td>
                          <td>{{pro.sku ? pro.sku : '-'}}</td>
                          <td>
                            <button @click="getPrecificavel(pro.id)" class="btn btn-sm btn-outline-info">Precificar</button>
                          </td> -->
                        </tr>
                        <tr>
                          <td colspan="5" v-if="allProduct.filter(r => r.checked).length > 0">
                            <button class="btn btn-outline-info" @click="addSelected">Precificar selecionados</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </b-colxx>


                  <b-colxx v-if="productDistribuidor" class="mt-5">
                    <h5 class="title">{{productDistribuidor.name}}</h5>
                    <table class="table w-100">
                      <thead>
                        <tr>
                          <th v-for="(qtd, indexQtd) in productDistribuidor.price" :key="indexQtd">{{qtd.qty}} itens <a class="p-1 text-danger" @click="() => {
                            if(productDistribuidor.price.length == 1) {
                              $notify('error', 'Opsss...!', 'Você tem que deixar pelo menos um preço ativo', {
                                duration: 3000,
                                permanent: false
                              });
                            }else{
                              productDistribuidor.price.splice(indexQtd, 1);
                            }
                          }"><i class="glyph-icon simple-icon-minus" /></a></th>
                          <th class="d-flex">
                            <the-mask class="form-control form-my" v-model="addPrices" :mask="['######']" />
                            <button class="btn btn-xs btn-outline-success" @click="addItemProduct">
                              <i class="glyph-icon simple-icon-plus" />
                            </button>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td v-for="(value, indexValue) in productDistribuidor.price" :key="indexValue">
                            <Money class="form-my" v-model="productDistribuidor.price[indexValue].value" v-bind="{ decimal: ',',thousands: '.',suffix: '%',precision: 2,masked: true,}"/>
                          </td>
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
                  </b-colxx>
              </b-row>
            </b-card>

            <b-card class="mb-4" title="Restrições" v-if="allProduct">
                <b-row>
                  <b-colxx class="mb-4" md="4" lg="4" v-for="(pro, index) in allProduct.filter(r => !r.parent)" :key="index" >
                    <b-card no-body class="p-3">
                      <h6 class="text-muted">{{pro.name}}</h6>
                        <div v-for="(a, ia) in pro.attrs" :key="ia">
                          <b>{{a.label}}: </b>
                          <div class="d-flex justify-content-between align-items-center px-2 mb-2" v-for="(val, indexVal) in a.values" :key="indexVal">
                            <span>{{val}}</span>
                            <div v-if="restricoes.filter(r => r == `${pro.id}_${a.label}_${val}`).length == 0" @click="addRestrition(`${pro.id}_${a.label}_${val}`)" class="badge badge-success">
                              <i class="glyph-icon simple-icon-plus text-white"/> Permitindo
                            </div>
                            <div v-else @click="restricoes.splice(restricoes.indexOf(`${pro.id}_${a.label}_${val}`), 1);" class="badge badge-danger">
                              <i class="glyph-icon simple-icon-trash text-white"/> Restringindo
                            </div>
                          </div>

                        </div>

                        <button v-if="restricoes.filter(r => r == `${pro.id}`).length == 0" @click="addRestrition(`${pro.id}`)" class="btn btn-success btn-sm btn-block mt-2">Produto permitido</button>
                        <button v-else @click="restricoes.splice(restricoes.indexOf(`${pro.id}`), 1);" class="btn btn-danger btn-sm btn-block mt-2">Produto restingido</button>
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
                                <option value="">Tipo do produto</option>
                                <option value="2">Lente</option>
                                <option value="3">Diopmetria</option>
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
                    <b-alert variant="info" show  dismissible>Se o campo senha for preenchido, significa que você está cadastrando um usuário de acesso ao sistema, se não for preenchida corresponde a informação de um contato</b-alert>
                    <div v-for="(user, index) in company.users" :key="index">
                        <b-row v-if="!user.deleted">
                            <b-colxx md="3" lg="3">
                                <b-form-group label="Nome" class="has-float-label mb-4">
                                    <b-form-input v-model="user.name" type="text" placeholder="Nome" />
                                </b-form-group>
                            </b-colxx>
                            <b-colxx md="4" lg="4">
                                <b-form-group label="E-mail" class="has-float-label mb-4">
                                    <b-form-input v-model="user.email" type="text" placeholder="E-mail" />
                                </b-form-group>
                            </b-colxx>
                            <b-colxx md="4" lg="4">
                                <b-form-group label="Senha" class="has-float-label mb-4" v-if="user.user_isContact != '1'">
                                    <b-form-input v-model="user.password" type="text" placeholder="Senha" />
                                </b-form-group>
                                <b-alert variant="info" show  dismissible v-else>Usuário para contato</b-alert>
                            </b-colxx>

                            <b-colxx md="1" lg="1">
                                <button v-if="company.users.filter(r => !r.deleted).length > 1" @click="company.users = company.users.map((r,i) => {if(i == index){ r.deleted = true} return r});" class="btn btn-outline-danger"><i class="glyph-icon simple-icon-trash"></i></button>
                                <!-- <button @click="removeUser(index)" class="btn btn-outline-danger"><i class="glyph-icon simple-icon-trash"></i></button> -->
                            </b-colxx>
                        </b-row>
                    </div>
                    <b-row class="mb-4">
                        <b-colxx>
                            <button @click="() => { company.users.push({email: '', password: '', name: '', deleted: false, id: 0}) }" class="btn btn-outline-success float-right"><i class="glyph-icon simple-icon-plus p-0"></i></button>
                        </b-colxx>
                    </b-row>

                </b-colxx>
            </b-card>
        </b-colxx>
        <b-colxx>
            <b-button variant="success" :disabled="processing" :class="{'mb-3 btn-multiple-state btn-shadow ml-3': true,
                'show-spinner': processing,
                'show-success': !processing }" @click="addCompany">
                <span class="spinner d-inline-block">
                    <span class="bounce1"></span>
                    <span class="bounce2"></span>
                    <span class="bounce3"></span>
                </span>
                <span class="icon success">
                    Cadastrar empresa
                </span>
                <span class="icon fail">
                    <i class="simple-icon-exclamation"></i>
                </span>
                <span class="label">Cadastrar empresa</span>
            </b-button>
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
import InputTag from '@/components/Form/InputTag';
import vSelect from 'vue-select';
export default {
    components:{
        'vue-dropzone': VueDropzone,
        'input-tag': InputTag,
        'v-select': vSelect,
        Money,
        TheMask
    },
    data() {
        return {
          processing: false,
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
              endereco: '',
              bairro: '',
              cidade: '',
              uf: '',
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
          products: [],
          baseURL,
          color: {
              name: '',
              image: ''
          },
          file: null,
          check,
          checked,
          allProduct: null,
          processing: false,
          requestError: false,
          productsProcessing:false,
          filter: [],
          productDistribuidor: null,
          addPrices: 0,
          precificaveis: [],
          restricoes: [],
          option: {
            pagamento: [],
            transporte: [],
            pdfanexo: []
          },
          consultores: []
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
        async getAllProducts() {
          const response = await api.get('admin/product');
          let vv = this.company
          this.allProduct = response.data.data.map(function(r) {
            r.valueD = 0;
            return r;
          });
        },
        removeUser(index) {
            if(this.company.users.filter(r => {if(!r.deleted) {return r}}).length == 1) {
                this.$notify("error", "Opsss...!", "Você precisa ter pelo menos um usuário para acessar", {
                    duration: 3000,
                    permanent: false
                });
            }else{
                this.company.users[index].deleted = true;
            }
        },
        removeItem(){
        },
        async editCompany() {
          this.company.restrictions = this.restrictions;
          const response = await api.put(`admin/company/${this.$route.params.id}`, {company: this.company, dynamic: this.allProduct, newProduct: this.newProduct, restricoes: this.restricoes});
          this.$notify('success', "Sucesso", "Empresa editada com sucesso", {
            duration: 3000,
            permanent: false
          });
          this.$router.push("/app/company/view");
        },
        addVariationRestrict(product, value, type) {
          this.restrictions[type].push(`${product}_${value}`);
        },
        removeVariationRestrict(product, value, type) {
          this.restrictions[type] = this.restrictions[type].filter(r => r != `${product}_${value}`);
        },
        async buscaBling() {
          this.processing = true;
          const response = await api.get(`admin/bling/company/${this.company.cnpj.replace(/[^\w\s]/gi, '')}`);
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
        },
        getProducts: async function()
        {
          console.log(this.filter);
          this.productsProcessing = true;
          this.products.products = [];
          let company = this.$route.params.id;
          const products = await api.get(`admin/distribution/${company}`, {params: {
            id:   this.filter.id,
            name: this.filter.name,
            sku:  this.filter.sku,
          } });
          this.products = products.data.data;
          this.productsProcessing = false;
        },
        async getPrecificavel(idProduct){
          this.precificaveis = [idProduct]
          let company = this.$route.params.id;
          const products = await api.get(`admin/distribution/item/${company}/${idProduct}`, {params: this.filter});
          this.productDistribuidor = products.data.data.products[0];
        },
        addSelected(){
          this.precificaveis = this.products.products.filter(r => r.checked).map(r => r.id);
          this.productDistribuidor = {price: [
            { "qty": 1, "value": "0" }
          ]}
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

          const data = await api.post(`admin/distribution/price/${company}`,{
                products: this.allProduct.filter(r => r.checked).map(j => {return j.id}),
                price: this.productDistribuidor.price,
                precificaveis: this.precificaveis
              });

          this.$notify("success", "Sucesso", "Preços alterados com sucesso", {
            duration: 3000,
            permanent: false
          });
        },
        addRestrition(value){
          this.restricoes.push(value)
        },
        async buscaCep(){
          if(this.company.cep.length == 8) {
            var requestOptions = {
              method: 'GET',
              redirect: 'follow'
            };
            fetch(`https://viacep.com.br/ws/${this.company.cep}/json`, requestOptions)
              .then(response => response.json())
              .then(result => {
                this.company.endereco = result.logradouro;
                this.company.bairro = result.bairro;
                this.company.cidade = result.localidade;
                this.company.uf = result.uf;

                if(result.logradouro == '') {
                  this.$notify("error", "Opsss...!!", "Não foi possível localizar seu endereço. Por favor insira manualmente", {
                    duration: 5000,
                    permanent: false
                  });
                }

                this.$refs.numero.focus();
              })
              .catch(error => {
                console.log('error', error);
                this.$notify("error", "Opsss...!!", "Não foi possível localizar seu endereço. Por favor insira manualmente", {
                  duration: 5000,
                  permanent: false
                });
              });
          }
        },
        async getOption(){
          [{id: 1, type: 'pagamento'}, {id: 2, type: 'transporte'}].forEach(async e => {
            const data = await api.get(`/option/${e.id}`)
            this.option[e.type] = data.data.data;
          })
        },
        async getConsultores(){
          const consultores = await api.get('admin/consult');
          this.consultores = consultores.data.data.consult;
        },
        async addCompany(){
          this.processing = true;
          const data = await api.post('admin/company', {company: this.company, dynamic: this.allProduct, newProduct: this.newProduct, restricoes: this.restricoes, card: this.$route.params.id});
          this.processing = false;
          let response = data.data;
          this.$notify(response.status, response.status == 'success' ? 'Sucesso' : 'Opsss!!!', response.message, {
            duration: 5000,
            permanent: false
          });

          if(response.status == 'success') {
            this.$router.push("/app/company/view");
          }
        },
        async getCard() {
            let id = this.$route.params.id
            const data = await api.get(`crm/card/${id}`);
            let resp = data.data.data;
            this.company.celular = resp.celular;
            this.company.email = resp.email;
            this.company.fone = resp.fone;
            this.company.name = resp.name;
            this.company.cnpj = resp.cnpj;
        }
      },
      async created(){
          await this.getCard();
          await this.getAllProducts();
          await this.getProducts();
          await this.getOption();
          await this.getConsultores();
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

.form-my {
  border:2px solid #ccc; height:26px; width:100px; border-radius: 3px;
}
</style>
