<template>
  <div>
     <b-row>
      <b-colxx xxs="12">
        <b-card class="mb-4" title="Imagem da face">
			<b-alert variant="info" class="text-center mx-auto" fade show dismissible>Estamos tentando acessar a sua <b>câmera</b> de seu navegador.<br />Caso apareça algum alerta, permita que tenhamos acesso à sua câmera.</b-alert>
			<b-row>
				<take-photo target="face" @photoInfo="photoInfo" />
			</b-row>
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import takePhoto from '@/components/TakePhotoDefault';
import myBreadCrumb from '@/components/breadcrumb';
import listSap from '@/components/ListSap';
export default {
    components: {
        'my-breadcrumb': myBreadCrumb,
        'take-photo': takePhoto,
        'list-sap': listSap,
	},
	methods: {
    photoInfo(info){
      console.log(info.data)
      let order = window.localStorage.getItem('order');
      if(order){
        order = JSON.parse(order);
        order.face = info.data
        window.localStorage.setItem('order',JSON.stringify(order));
        this.$router.push(`/sap/recipe`);
      }
    }
	}
}
</script>
