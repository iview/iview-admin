<template>
  <div>
    {{title}}
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
  methods: {},
  watch: {
    $route(to, from) {
      this.title = to.meta.title;
    }
  }
};
</script>

<style>
</style>
