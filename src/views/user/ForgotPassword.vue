<template>
<b-row class="h-100">
  <b-colxx xxs="12" md="6" class="mx-auto my-auto">
    <b-card class="auth-card" no-body>
      <div class="form-side w-100">
        <router-link tag="a" to="/">
          <span class="logo-single" />
        </router-link>
        <h6 class="mb-4">Recuperar senha</h6>
        <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
          <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
            <b-form-input type="text" v-model="$v.form.email.$model" :state="!$v.form.email.$error" />
          </b-form-group>
          <div class="d-flex justify-content-end align-items-center">
            <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
          'show-spinner': processing,
          'show-success': !processing && loginError===false,
          'show-fail': !processing && loginError }">
              <span class="spinner d-inline-block">
                <span class="bounce1"></span>
                <span class="bounce2"></span>
                <span class="bounce3"></span>
              </span>
              <span class="icon success">
                <i class="simple-icon-check"></i>
              </span>
              <span class="icon fail">
                <i class="simple-icon-exclamation"></i>
              </span>
              <span class="label">RECUPERAR</span>
            </b-button>
          </div>
        </b-form>
      </div>
    </b-card>
  </b-colxx>
</b-row>
</template>

<script>
import {
  mapGetters,
  mapActions
} from "vuex";
import {
  validationMixin
} from "vuelidate";
const {
  required,
  maxLength,
  minLength,
  email
} = require("vuelidate/lib/validators");

export default {
  data() {
    return {
      form: {
        email: ""
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      email: {
        required,
        email,
        minLength: minLength(4)
      }
    }
  },
  computed: {
    ...mapGetters(["processing", "loginError", "forgotMailSuccess"])
  },
  methods: {
    ...mapActions(["forgotPassword"]),
    formSubmit() {
      this.$v.form.$touch();
      if (!this.$v.form.$anyError) {
        this.forgotPassword({
          email: this.form.email
        });
      }
    }
  },
  watch: {
    loginError(val) {
      if (val != null) {
        this.$notify("error", "Erro ao recuperar senha", val, {
          duration: 3000,
          permanent: false
        });
      }
    },
    forgotMailSuccess(val) {
      if (val) {
        this.$notify(
          "success",
          "Redefinição solicitada com sucesso",
          "Por favor verifique seu e-mail.", {
            duration: 3000,
            permanent: false
          }
        );

        this.$router.push(`/reset-password`);
      }
    }
  }
};
</script>
