<template>
  <div>
    {{title}}
    <Button size="large"
            type="text"
            @click="backPrev">返回上一页</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: ""
    };
  },
  created() {
    this.title = this.$route.meta.title;
  },
  methods: {
    backPrev() {
      this.$router.go(-1);
    }
  },
  watch: {
    $route(to, from) {
      this.title = to.meta.title;
    }
  }
};
</script>

<style>
</style>
