<template>
  <span>{{totalCount | numeroPreco}}</span>
</template>

<script>
export default {
    props: ['total', 'speed'],
    data(){
      return {
        totalCount: 0
      }
    },
    methods: {
      count(){
        this.totalCount = 0;

        let saltos = 30;
        let totalCount = this.speed / saltos;
        let totalStart = this.total / saltos;
        let interval = setInterval(() => {
          this.totalCount = this.totalCount + totalStart;
        }, totalCount);

        setTimeout(() => {
          clearInterval(interval);
          this.totalCount = this.total;
        }, this.speed);
      }
    },
    created(){
      this.count();
    },

    watch: {
      total(){
        this.count()
      }
    }
}
</script>
<style scoped>
</style>
