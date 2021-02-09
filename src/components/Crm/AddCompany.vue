<template>
  <div class="p-4">
    <b-row>
      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Razão Social" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('nome')" v-model="company.nome" ref="nome" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Fantasia" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('fantasia')" v-model="company.fantasia" ref="fantasia" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Tipo da empresa" class="has-float-label mb-4">
          <b-form-select :state="validForm('tipoPessoa')" v-model="company.tipoPessoa" ref="tipoPessoa" :options="[
            { value: 'F', text: 'Pessoa Fisíca' },
            { value: 'J', text: 'Pessoa Juridica' },
          ]"  />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Contribuição" class="has-float-label mb-4">
          <b-form-select :state="validForm('contribuinte')" v-model="company.contribuinte" ref="contribuinte" :options="[
            { value: '1', text: 'Contribuinte do ICMS' },
            { value: '2', text: 'Contribuinte isento' },
            { value: '9', text: 'Não contribuinte' },
          ]"  />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="CPF ou CNPJ" class="has-float-label mb-4">
          <the-mask class="form-control" @blur.native="checkCnpj" :state="validForm('cpf_cnpj')" v-model="company.cpf_cnpj" ref="cpf_cnpj" :mask="['##.###.###/####-##', '###.###.###-##']" />
        </b-form-group>
          <b-alert class="mt-3" v-if="validation.pertence" show variant="danger">
            <div>Essa empresa já está vinculada a outro consultor ({{validation.pertence.consultor}})</div>
          </b-alert>
          <b-alert class="mt-3" v-if="validation.filial" show variant="warning">
              Uma outra empresa do mesmo grupo já pertence a outro consultor.
              <div v-for="(c, i) in validation.filial" :key="i" >
                {{c.name}} - {{c.consultor}}
              </div>
          </b-alert>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="RG ou IE" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('ie_rg')" v-model="company.ie_rg" ref="ie_rg" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="CEP" class="has-float-label mb-4">
          <the-mask @keyup.native="buscaCep" class="form-control" :mask="['#####-###']" type="text" :state="validForm('cep')" v-model="company.cep" ref="cep" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Endereço" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('endereco')" v-model="company.endereco" ref="endereco" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Número" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('numero')" v-model="company.numero" ref="numero" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Complemento" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('complemento')" v-model="company.complemento" ref="complemento" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Bairro" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('bairro')" v-model="company.bairro" ref="bairro" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Cidade" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('cidade')" v-model="company.cidade" ref="cidade" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="UF" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('uf')" v-model="company.uf" ref="uf" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Telefone" class="has-float-label mb-4">
          <the-mask class="form-control" :mask="['(##) # ####-####', '(##) ####-####']" type="text" :state="validForm('fone')" v-model="company.fone" ref="fone" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Celular" class="has-float-label mb-4">
          <the-mask class="form-control" :mask="['(##) # ####-####', '(##) ####-####']" type="text" :state="validForm('celular')" v-model="company.celular" ref="celular" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="E-mail" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('email')" v-model="company.email" ref="email" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="E-mail (envio da NF-e)" class="has-float-label mb-4">
          <b-form-input type="text" :state="validForm('emailNfe')" v-model="company.emailNfe" ref="emailNfe" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="12" sm="12" lg="12">
        <b-form-group label="Observações" class="has-float-label mb-4">
          <b-textarea :state="validForm('informacaoContato')" v-model="company.informacaoContato" ref="informacaoContato"></b-textarea>
        </b-form-group>
      </b-colxx>

      <b-colxx md="12" sm="12" lg="12">
        <b-form-group label="Descrição" class="has-float-label mb-4">
          <b-textarea :state="validForm('descricao')" v-model="company.descricao" ref="descricao"></b-textarea>
        </b-form-group>
      </b-colxx>


      <b-colxx md="12" sm="12" lg="12">
        <h3>Produtos</h3>
      </b-colxx>

      <!-- <b-colxx md="4" lg="4" sm="12" >
        <b-form-group label="ID 101 A" class="has-float-label mb-4">
          <b-input-group prepend="R$ 83,00" class="mb-3" size="sm">
            <Money class="form-control" v-bind="{ decimal: ',',thousands: '.',prefix: 'R$ ',suffix: '',precision: 2,masked: true,}"/>
          </b-input-group>
        </b-form-group>
      </b-colxx> -->

      <b-colxx md="12" sm="12" class="d-flex justify-content-end">
        <button @click="addCompany" class="btn btn-outline-success">Cadastrar</button>
      </b-colxx>

    </b-row>
  </div>
</template>
<script>

import {TheMask} from 'vue-the-mask';
import {Money} from '@/vmoney.js';
import {api, baseURL, firebaseConfig} from '@/constants/config';
export default {
  components: {
    TheMask,
    Money
  },
  data () {
    return {
      company: {
        nome: '',
        fantasia: '',
        contribuinte: '',
        cpf_cnpj: '',
        ie_rg: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        fone: '',
        celular: '',
        email: '',
        emailNfe: '',
        informacaoContato: '',
        descricao: ''
      },
      validation: {},
    }
  },
  props: ['stage', 'card'],
  methods: {
    async checkCnpj(){
      if(this.company.cpf_cnpj && this.company.cpf_cnpj.length > 12) {
        const data = await api.get('crm/validation/cnpj', {
          params: {
            value: this.company.cpf_cnpj
          }
        });
        this.validation = data.data.data
      }
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
            console.log(result)
            this.company.endereco = result.logradouro;
            this.company.bairro = result.bairro;
            this.company.cidade = result.localidade;
            this.company.uf = result.uf;
            this.$refs.numero.focus();
          })
          .catch(error => console.log('error', error));
      }
    },
    validForm(input){

    },
    async addCompany(){
      let invalid = [];
      ['nome', 'fantasia', 'contribuinte', 'cpf_cnpj', 'ie_rg', 'cep', 'endereco','numero','bairro','cidade','uf','fone','celular','email','emailNfe','informacaoContato','descricao'].forEach(r => {
        if(this.company[r] == ''){
          invalid.push(r)
        }
      });
    console.log(invalid);
      if(invalid.length > 0) {
        this.$notify("error", 'Opsss...!!!', "Por favor preencha corretamente todos os campos", {
          duration: 3000,
          permanent: false
        });
      }else{
        const data = await api.post('crm/company', {...this.company, card: this.card});
        this.$notify("success", 'Sucesso', "Empresa cadastrada com sucesso", {
          duration: 3000,
          permanent: false
        });
      }
    }
  }
}
</script>


<style>
  .danger {
    border: '1px solid #a00'
  }
</style>
