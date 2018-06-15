<template>
  <div class="cropper-wrapper">
    <img ref="cropperImg" :src="src" alt="">
  </div>
</template>

<script>
import Cropper from 'cropperjs/dist/cropper.esm.js'
import 'cropperjs/dist/cropper.min.css'
export default {
  name: 'ImgCropper',
  props: {
    src: {
      type: String,
      default: ''
    },
    dragMode: {
      type: String,
      default: 'move'
    },
    previewId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  mounted () {
    this.cropper = new Cropper(this.$refs.cropperImg, {
      aspectRatio: 16 / 9,
      dragMode: this.dragMode,
      preview: this.previewId,
      restore: false,
      center: false,
      highlight: false,
      cropBoxMovable: false,
      toggleDragModeOnDblclick: false
    })
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
