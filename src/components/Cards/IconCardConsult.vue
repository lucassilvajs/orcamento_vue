<template>
  <div class="icon-row-item">
    <b-card class="mb-4 text-center w-100">
      <div>
        <p class="card-text font-weight-semibold mb-0" :style="'height:55px'">{{ title }}</p>
        <slot></slot>
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
