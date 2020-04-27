<template>
  <div>
    <my-breadcrumb />
        <b-card class="mb-4">
            <b-row>
                <b-colxx v-if="tratament" xxs="12">
                    <div class="row flex-wrap">
                        <div class="col-sm-12 col-md-4">
                            <h4>Lentes</h4>
                            <table class="table w-100 table-hover">
                                <tr v-for="(lens, index) in tratament.lens" :key="index">
                                    <td  @click="() => {
                                        tratament.lens.map((re) => {
                                            re.checked = false;
                                            return re
                                        })
                                        lens.checked = !lens.checked
                                        }">{{lens.name}}</td>
                                    <td class="float-right">
                                        <label :for="`lens_${index}`" class="pointer">
                                            <img v-if="!lens.checked" :src="check" alt="" class="img-input">
                                            <img v-else :src="checked" alt="" class="img-input">
                                        </label>
                                        <input type="checkbox" @change="() => {
                                            tratament.lens.map((re) => {
                                                re.checked = false;
                                                return re
                                            })
                                            lens.checked = !lens.checked
                                            }" name="" :id="`lens_${index}`" class="d-none">
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <h4>Dioptria</h4>
                            <table class="table w-100 table-hover">
                                <tr v-for="(dioptria, index) in tratament.diopter" :key="index">
                                    <td  @click="() => {
                                        tratament.diopter = tratament.diopter.map( (re) => {
                                            re.checked = false;
                                            return re
                                        })
                                        dioptria.checked = !dioptria.checked
                                    }">{{dioptria.name}}</td>
                                    <td class="float-right">
                                        <label :for="`dioptria_${index}`" class="pointer">
                                            <img v-if="!dioptria.checked" :src="check" alt="" class="img-input">
                                            <img v-else :src="checked" alt="" class="img-input">
                                        </label>
                                        <input type="checkbox" @change="() => {
                                            tratament.diopter = tratament.diopter.map( (re) => {
                                                re.checked = false;
                                                return re
                                            })
                                            dioptria.checked = !dioptria.checked
                                        }" name="" :id="`dioptria_${index}`" class="d-none">
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-sm-12 col-md-4">
                            <h4>Tratamento</h4>
                            <table class="table w-100 table-hover">
                                <tr v-for="(tratament, index) in tratament.tratament" :key="index">
                                    <td  @click="tratament.checked = !tratament.checked">{{tratament.name}}</td>
                                    <td class="float-right">
                                        <label :for="`tratament_${index}`" class="pointer">
                                            <img v-if="!tratament.checked" :src="check" alt="" class="img-input">
                                            <img v-else :src="checked" alt="" class="img-input">
                                        </label>
                                        <input type="checkbox" @change="tratament.checked = !tratament.checked" name="" :id="`tratament_${index}`" class="d-none">
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <button class="btn btn-success float-right" @click="addTratament">Continuar</button>
                </b-colxx>
                <b-colxx class="d-flex align-items-center justify-content-center text-center" v-else>
                    <h2>Buscando tratamentos...</h2>
                </b-colxx>
            </b-row>
        </b-card>
  </div>
</template>

<script>
import myBreadCrumb from '@/components/adminBreadcrumb';
import check from '@/assets/img/check.svg'
import checked from '@/assets/img/checked.svg'
import {api} from '@/constants/config';
export default {
	data() {
		return {
            tratament: null,
            check,
            checked,

		}
	},
    components: {
        'my-breadcrumb': myBreadCrumb,
	},
	methods: {
    addTratament: function(){
        let cons = this.tratament;
        let save = [];
        ["lens", "diopter", "tratament"].forEach( (el) => {
            save.push(this.tratament[el].map( (r) => {
                if(r.checked) return r
            }).filter(r => r))
        });

        let order = window.localStorage.getItem('order');
        if(order){
            order = JSON.parse(order);
        }else{
            order = {}
        }

        order.lens = save;
        window.localStorage.setItem('order', JSON.stringify(order));
        this.$router.push("/admin/make/face");
    },
    getLens: async function()
		{
      let order = JSON.parse(window.localStorage.getItem('order'));
			const lens = await api.get("/lens", {
        params: {
          company: order.company
        }
      });
			this.tratament = lens.data.data
		}
	},
	created() {
        this.getLens();
	}
}
</script>

<style>
.img-input {
    width: 20px
}
.pointer {
    cursor: pointer
}
</style>
