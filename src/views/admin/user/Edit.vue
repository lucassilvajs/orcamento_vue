<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <h1>Editar usuário</h1>
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Editar usuário">
                <b-row>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Nome" class="has-float-label mb-4">
                            <b-form-input v-model="user.user.name" type="text" placeholder="Nome" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="E-mail" class="has-float-label mb-4">
                            <b-form-input v-model="user.user.email" type="text" placeholder="E-mail" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <b-form-group label="Senha" class="has-float-label mb-4">
                            <b-form-input v-model="user.user.password" type="text" placeholder="Senha" />
                        </b-form-group>
                    </b-colxx>
                    <b-colxx md="4" lg="3">
                        <vue-dropzone
                            @vdropzone-complete="completeUpload"
                            ref="myVueDropzone" id="dropzone" class="mb-4" :options="dropzoneOptions">
                        </vue-dropzone>
                    </b-colxx>
                </b-row>
                <b-row>
                  <b-colxx>
                    <button class="btn btn-success float-right" @click="editUserAdmin">Editar usuário admin</button>
                  </b-colxx>
                </b-row>
            </b-card>
            <b-card title="Privilégios" v-if="false">
                <b-row>
                    <b-colxx>
                        <table class="table">
                            <thead>
                                <tr>
                                    <td>Módulo</td>
                                    <td>Permissão</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Bi</td>
                                    <td>
                                        <select name="" id=""></select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-colxx>
                </b-row>
            </b-card>
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
            user: {},
            baseURL,
            file: null,
            image: null,
        }
    },
    computed: {
        dropzoneOptions: function() {
            const token = window.localStorage.getItem('token');
            return {
                url: `${baseURL}saveFile/user`,
                thumbnailWidth: 150,
                maxFilesize: 1,
                headers: { "X-Auth-Token": token },
                dictDefaultMessage: "Adicionar Imagem do consultor",
                previewTemplate: this.dropzoneTemplate(),
                maxFiles: 1,
            }
        }
    },
    methods: {
        ...mapActions(["loading"]),
        async pageCompany(page){
          this.consult.companies = [];
          const id = this.$route.params.id;
          const params = {
            page
          }
          const response = await api.get(`/admin/user/${id}`, {
            params
          });
          this.consult.companies = response.data.data.companies;
        },
        async getUserAdmin(){
          const id = this.$route.params.id;
          const response = await api.get(`/admin/user/${id}`);
          this.user = response.data.data;
        },
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
                this.product.colors.push({
                    name: this.color.name,
                    image: this.color.image,
                    sku: this.color.sku,
                });

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
            this.image = JSON.parse(file.xhr.response).data;
        },
        async editUserAdmin() {
          let id = this.$route.params.id;
          const response = await api.put('admin/user', {...this.user.user, image: this.image, id});
          if(response.data.status == 'success') {
            this.$notify("success", "Sucesso", response.data.message, {
                duration: 3000,
                permanent: false
            });
            this.$router.push('/admin/user/view');
          }else{
            this.$notify("error", "Opsss...!", response.data.message, {
                duration: 3000,
                permanent: false
            });
          }
        }
    },
    created(){
      this.getUserAdmin();
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

.demo {
  margin: auto;
  width: 100%;
  height: 30px;
  background-image: linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% );
  background-repeat: repeat-y;
  background-size:50px 200px;
  background-position: 0 0;
}

.demo:nth-child(odd) {
  animation: shine 1s infinite;
}

.demo:nth-child(even) {
  animation: shine 2s infinite;
}

@keyframes shine {
  to {
  background-position:100% 0;
  }
}
</style>
