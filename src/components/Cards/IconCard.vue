<template>
  <div class="icon-row-item">
    <b-card class="mb-4 text-center">
      <i :class="icon"/>
      <div v-if="total">
      <p class="card-text font-weight-semibold mb-0" :style="'height:25px'">{{ title }}</p>
      <p class="lead text-center">{{ value }}</p>
      <p class="total" v-if="money"> {{ total | numeroPreco }} </p>
      <p class="total" v-else> {{ total }} </p>

      </div>
      <div v-else>
        <p class="card-text font-weight-semibold mb-0">{{ title }}</p>
        <p class="lead text-center">{{ value }}</p>

      </div>
    </b-card>
  </div>
</template>
<script>
export default {
  props: {
    title: { type: String, default: 'icon-card-title' },
    icon: { type: String, default: 'iconsminds-clock' },
    value: { type: Number|String, default: '0' },
    total: { type: Number|String, default: null},
    money: { type: Boolean, default: false},
  }
}
</script>
<style>
.total {
  color: #8f8f8f;

}
</style>
