<template>
  <div class="p-4">
    <b-row>
      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Razão Social" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.name" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Fantasia" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.fantasia" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Tipo da empresa" class="has-float-label mb-4">
          <b-form-select v-model="company.tipoPessoa" :options="[
            { value: 'F', text: 'Pessoa Fisíca' },
            { value: 'J', text: 'Pessoa Juridica' },
          ]"  />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Contribuição" class="has-float-label mb-4">
          <b-form-select v-model="company.contribuinte" :options="[
            { value: '1', text: 'Contribuinte do ICMS' },
            { value: '2', text: 'Contribuinte isento' },
            { value: '9', text: 'Não contribuinte' },
          ]"  />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="CPF ou CNPJ" class="has-float-label mb-4">
          <the-mask class="form-control" v-model="company.cpf_cnpj" :mask="['##.###.###/####-##', '###.###.###-##']" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="RG ou IR" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.ie_rg" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="CEP" class="has-float-label mb-4">
          <the-mask class="form-control" :mask="['#####-###']" type="text" v-model="company.cep" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Endereço" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.endereco" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Número" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.numero" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Complemento" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.complemento" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Bairro" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.bairro" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Cidade" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.cidade" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="UF" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.uf" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Telefone" class="has-float-label mb-4">
          <the-mask class="form-control" :mask="['(##) # ####-####', '(##) ####-####']" type="text" v-model="company.phone" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="Celular" class="has-float-label mb-4">
          <the-mask class="form-control" :mask="['(##) # ####-####', '(##) ####-####']" type="text" v-model="company.celular" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="E-mail" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.email" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="4" sm="12" lg="4">
        <b-form-group label="E-mail (envio da NF-e)" class="has-float-label mb-4">
          <b-form-input type="text" v-model="company.emailNfe" />
        </b-form-group>
      </b-colxx>

      <b-colxx md="12" sm="12" lg="12">
        <b-form-group label="Observações" class="has-float-label mb-4">
          <b-textarea v-model="company.informacaoContato"></b-textarea>
        </b-form-group>
      </b-colxx>

      <b-colxx md="12" sm="12" lg="12">
        <b-form-group label="Descrição" class="has-float-label mb-4">
          <b-textarea v-model="company.descricao"></b-textarea>
        </b-form-group>
      </b-colxx>

      <b-colxx md="12" sm="12" class="d-flex justify-content-end">
        <button class="btn btn-outline-success mr-3">Salvar</button>
        <button class="btn btn-success">Cadastrar</button>
      </b-colxx>

    </b-row>
  </div>
</template>
<script>

import {TheMask} from 'vue-the-mask';

export default {
  components: {
    TheMask
  },
  data () {
    return {
      company: {}
    }
  }
}
</script>
