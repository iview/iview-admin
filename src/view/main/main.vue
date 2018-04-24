<template>
  <div>{{ menuList }}</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Main',
  computed: {
    ...mapGetters('routers', [
      'menuList'
    ])
  }
}
</script>
