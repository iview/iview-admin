<template>
  <div class="zoom-wrapper">
    <button class="zoom-button" @click="scale('down')">
      <Icon type="md-remove" :size="14" color="#fff"/>
    </button>
    <span class="zoom-number">{{ value }}%</span>
    <button class="zoom-button" @click="scale('up')">
      <Icon type="md-add" :size="14" color="#fff"/>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ZoomController',
  props: {
    value: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 20
    },
    min: {
      type: Number,
      default: 10
    },
    max: {
      type: Number,
      default: 200
    }
  },
  methods: {
    scale (type) {
      const zoom = this.value + (type === 'down' ? -this.step : this.step)
      if (
        (zoom < this.min && type === 'down') ||
        (zoom > this.max && type === 'up')
      ) {
        return
      }
      this.$emit('input', zoom)
    }
  }
}
</script>

<style lang="less">
.trans(@duration) {
  transition: ~"all @{duration} ease-in";
}
.zoom-wrapper {
  .zoom-button {
    width: 20px;
    height: 20px;
    line-height: 10px;
    border-radius: 50%;
    background: rgba(157, 162, 172, 1);
    box-shadow: 0px 2px 8px 0px rgba(218, 220, 223, 0.7);
    border: none;
    cursor: pointer;
    outline: none;
    &:active {
      box-shadow: 0px 0px 2px 2px rgba(218, 220, 223, 0.2) inset;
    }
    .trans(0.1s);
    &:hover {
      background: #1890ff;
      .trans(0.1s);
    }
  }
  .zoom-number {
    color: #657180;
    padding: 0 8px;
    display: inline-block;
    width: 46px;
    text-align: center;
  }
}
</style>
