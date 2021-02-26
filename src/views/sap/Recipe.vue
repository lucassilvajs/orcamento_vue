<template>
  <div>
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Imagem da face">
			<b-alert variant="info" class="text-center mx-auto" fade show dismissible>Estamos tentando acessar a sua <b>câmera</b> de seu navegador.<br />Caso apareça algum alerta, permita que tenhamos acesso à sua câmera.</b-alert>
			<b-row>
				<take-photo target="recipe" @photoInfo="photoInfo" />
			</b-row>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import takePhoto from '@/components/TakePhotoDefault';
export default {
    components: {
        'take-photo': takePhoto,
	},
	methods: {
    photoInfo(info){
      console.log(info.data)
      let order = window.localStorage.getItem('order');
      if(order){
        order = JSON.parse(order);
        order.recipe = info.data
        window.localStorage.setItem('order',JSON.stringify(order));
        this.$router.push(`/sap/confirmation`);
      }
    }
	}
}
</script>
