<template>
  <div class="text-center">
    <h1>Obrigado!</h1>
    <h3>O seu pedido foi criado com sucesso!</h3>

    <router-link class="btn btn-success text-white" :to="($route.path.indexOf('admin') >= 0 ? '/admin/make/' : '/app/order/') + 'information'"> Nova solicitação </router-link>
    <router-link class="btn btn-outline-info" :to="($route.path.indexOf('admin') >= 0 ? '/admin/proposal/' : '/app/order/')"> Ver solicitações </router-link>
  </div>
</template>

<script>
export default {

}
</script>
