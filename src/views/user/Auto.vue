<template>
<b-row class="h-100">
    <b-colxx xxs="12" lg="6" md="12" class="mx-auto my-auto">
        <b-card class="auth-card" no-body>
            <div class="form-side w-100">
                <router-link tag="a" to="/">
                    <span class="logo-single" />
                </router-link>
                <h5>Autenticação em andamento...</h5>
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
    mixins: [validationMixin],
    computed: {
        ...mapGetters(["currentUser", "processing", "loginError"])
    },
    methods: {
        ...mapActions(["autoLogin"]),
        auto() {
            const hash = this.$route.params.hash
            this.autoLogin({hash});
        }
    },
    watch: {
        currentUser(val) {
          console.log('VAL: ',  val);
            if (val && val.token && val.token.length > 0) {
                // setTimeout(() => {
                //     }, 200);
                if(!val.user.level) {
                  this.$router.push(`/app`);
                }else{
                  this.$router.push(`/${val.user.level}`);
                }
            }
        },
        loginError(val) {
            if (val != null) {
                this.$notify("error", "Login Error", val, {
                    duration: 3000,
                    permanent: false
                });

            }
        }
    },
    created(){
        this.auto();
    }
};
</script>
