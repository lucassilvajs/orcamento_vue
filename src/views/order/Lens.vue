<template>
  <div>
    <my-breadcrumb />
        <b-card class="mb-4">
            <b-row>
                <b-colxx v-if="tratament" xxs="12">
                    <div class="row flex-wrap">
                      <div class="col-sm-12 col-md-3" v-for="(cat, catIndex) in tratament" :key="catIndex">
                        <h4>{{cat.type}}</h4>
                        <table class="table w-100 table-hover" v-for="(item, itemIndex) in cat[0]" :key="itemIndex">
                          <tr class="w-100 d-flex justify-content-between" @click="() => {
                            tratament[catIndex][0] = tratament[catIndex][0].map(r => {
                              r.checked = false;
                              return r;
                            });
                            tratament[catIndex][0][itemIndex].checked = !tratament[catIndex][0][itemIndex].checked;
                            }">
                            <td>{{item.name}}</td>
                            <td class="">
                              <label :for="`lens_${itemIndex}`" class="pointer">
                                  <img v-if="!item.checked" :src="check" alt="" class="img-input">
                                  <img v-else :src="checked" alt="" class="img-input">
                              </label>
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
import myBreadCrumb from '@/components/breadcrumb';
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
            let save = [];
            for(let i in this.tratament) {
              save.push(this.tratament[i][0].map(r => {
                if(r.checked) {
                  return r
                }
              }).filter(r => r));
            }

              let order = window.localStorage.getItem('order');
              if(order){
                  order = JSON.parse(order);
              }else{
                  order = {}
              }

              order.lens = save;
              window.localStorage.setItem('order', JSON.stringify(order));
              this.$router.push("/app/order/face");
            // }
        },
        getLens: async function()
        {
          let {company} = JSON.parse(window.localStorage.getItem('order'));
          const lens = await api.get("/lens", {
            params: {
              company
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
