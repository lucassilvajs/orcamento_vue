<template>
<div>
    <my-breadcrumb />
    <b-row>
        <b-colxx xxs="12">
            <b-card class="mb-4" title="Dados do colaborador">
                <form @submit.prevent="formStepOne" class="form">
                    <b-row>
                        <b-colxx lg="2">
                            <b-form-group label="Nome do colaborador" class="has-float-label mb-4">
                                <b-form-input type="text" v-model="form.name" />
                                <b-form-invalid-feedback v-if="false">Please enter your email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Please enter a valid email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Your email must be minimum 4 characters</b-form-invalid-feedback>
                            </b-form-group>
                        </b-colxx>
                        <b-colxx lg="2">
                            <b-form-group label="Solicitante" class="has-float-label mb-4">
                                <b-form-input type="text" v-model="form.requester" />
                                <b-form-invalid-feedback v-if="false">Please enter your email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Please enter a valid email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Your email must be minimum 4 characters</b-form-invalid-feedback>
                            </b-form-group>
                        </b-colxx>
                        <b-colxx lg="2">
                            <b-form-group label="Empresa" class="has-float-label mb-4">
                                <b-form-input type="text" v-model="form.company" />
                                <b-form-invalid-feedback v-if="false">Please enter your email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Please enter a valid email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Your email must be minimum 4 characters</b-form-invalid-feedback>
                            </b-form-group>
                        </b-colxx>
                        <b-colxx lg="2">
                            <b-form-group label="Tipo da lente" class="has-float-label mb-4">
                                <b-form-input type="text" v-model="form.optical" />
                                <b-form-invalid-feedback v-if="false">Please enter your email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Please enter a valid email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Your email must be minimum 4 characters</b-form-invalid-feedback>
                            </b-form-group>
                        </b-colxx>
                    <!-- </b-row>
                    <b-row> -->
                        <b-colxx lg="2">
                            <b-form-group label="Observação" class="has-float-label mb-4">
                                <b-form-input type="text" v-model="form.observation" />
                                <b-form-invalid-feedback v-if="false">Please enter your email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Please enter a valid email address</b-form-invalid-feedback>
                                <b-form-invalid-feedback v-else-if="false">Your email must be minimum 4 characters</b-form-invalid-feedback>
                            </b-form-group>
                        </b-colxx>
                        <b-colxx lg="2">
                            <button type="submit" class="btn btn-outline-success float-right">Próximo</button>
                        </b-colxx>
                    </b-row>
                </form>
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

import myBreadCrumb from '@/components/breadcrumb';
export default {
    components: {
        'my-breadcrumb': myBreadCrumb
    },
    data() {
        return {
            form: {
                name: '',
                requester: '',
                company: '',
                optical: '',
                observation: ''
            }
        }
    },

    computed: {
        ...mapGetters(["currentOrder", "processing", "loginError"])
    },
    methods: {
        ...mapActions(["setInfoOrder"]),
        formStepOne: function(){
            this.setInfoOrder(this.form);
        }
    },

    watch: {
        currentOrder: function(val){
            console.log(val)
            if(val) {
                this.$router.push("/order/products");
            }
        }
    }
}
</script>
