<template>
  <Row :gutter="20">
    <i-col span="12">
      <div class="img-cropper-page">
        <img-cropper :src="imgSrc" preview-id="preview_con"/>
      </div>
    </i-col>
    <i-col span="12">
      <div class="preview-con" id="preview_con"></div>
    </i-col>
  </Row>
</template>

<script>
import ImgCropper from '_c/img-cropper'
import img from '@/assets/images/talkingdata.png'
export default {
  name: 'img_cropper_page',
  components: {
    ImgCropper
  },
  data () {
    return {
      imgSrc: ''
    }
  },
  mounted () {
    this.imgSrc = img
  }
}
</script>

<style lang="less">
.img-cropper-page{
  height: 400px;
}
.preview-con{
  height: 400px;
  border: 1px solid #c3c3c3;
}
</style>
