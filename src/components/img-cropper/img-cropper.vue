<template>
  <div class="cropper-wrapper">
    <img id="aaa" ref="cropperImg" alt="">
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
  watch: {
    src (src) {
      console.log(src)
      console.log(this.cropper)
      this.cropper.replace(src)
    }
  },
  mounted () {
    console.log(this.$refs.cropperImg)
    const aaa = document.getElementById('aaa')
    this.cropper = new Cropper(aaa, {
      dragMode: 'move',
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
