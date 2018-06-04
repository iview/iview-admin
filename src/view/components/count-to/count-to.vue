<template>
  <div>
    <count-to :end="end"></count-to>
  </div>
</template>

<script>
import countTo from '_c/count-to'
export default {
  name: 'count_to',
  components: {
    countTo
  },
  data () {
    return {
      end: 1000
    }
  }
}
</script>

<style>

</style>
