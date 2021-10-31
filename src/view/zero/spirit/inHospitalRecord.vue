<template>
<!-- 住院记录 -->
  <div class="split-pane-page-wrapper">
    <split-pane v-model="offset" @on-moving="handleMoving">
      <div slot="left" class="pane left-pane">
        <normal-info></normal-info>
      </div>
      <div slot="right" class="pane right-pane">
        <editor ref="editor" :value="content" @on-change="handleChange"/>
        <!-- <split-pane v-model="offsetVertical" mode="vertical" @on-moving="handleMoving">
          <div slot="top" class="pane top-pane">
            123456
          </div>
          <div slot="bottom" class="pane bottom-pane">
            456789
          </div>
          <div slot="trigger" class="custom-trigger">
            <icons class="trigger-icon" :size="22" type="resize-vertical" color="#fff"/>
          </div>
        </split-pane> -->
      </div>
    </split-pane>
  </div>
</template>

<script>
import SplitPane from '_c/split-pane'
import Icons from '_c/icons'
import Editor from '_c/editor'
import NormalInfo from '@/view/zero/components/normalInfo.vue'
export default {
  name: 'in_hospital_record',
  components: {
    SplitPane,
    Icons,
    NormalInfo,
    Editor
  },
  data () {
    return {
      offset: 0.6,
      offsetVertical: '250px',
      /* eslint-disable */
      // content: '<p>2021-04-19, 14:38</p><p>&nbsp; &nbsp; 患者&nbsp; &nbsp; &nbsp; &nbsp; 女， 58岁，因“失眠，自言自语、疑心，乱撕东西，大喊大叫15年，加重一年。”由门诊收住院。<br/></p><p>&nbsp; &nbsp; 1. 病例特点: 患者于15年前， 无明显诱因逐渐重复做一件事，重复已说过的话。无故自笑，女儿常看到其<br/></p> 2021-04-19, 14:38&nbsp; &nbsp; 患者&nbsp; &nbsp; &nbsp; &nbsp; 女， 58岁，因“失眠，自言自语、疑心，乱撕东西，大喊大叫15年，加重一年。”由门诊收住院。&nbsp; &nbsp; 1. 病例特点: 患者于15年前， 无明显诱因逐渐重复做一件事，重复已说过的话。无故自笑，女儿常看到其'
      // content: '<p>2021-04-19, 14:38</p><p>&nbsp; &nbsp; 患者&nbsp; &nbsp; &nbsp; &nbsp; 女， 58岁，因“失眠，自言自语、疑心，乱撕东西，大喊大叫15年，加重一年。”由门诊收住院。<br/></p><p>&nbsp; &nbsp; 1. 病例特点: 患者于15年前， 无明显诱因逐渐重复做一件事，重复已说过的话。无故自笑，女儿常看到其<br/></p><br/>'
      content: '<h3 style=\"text-align:center;\">首次病程记录</h3><p>2021-04-19, 14:38</p><p>&nbsp; &nbsp; 患者&nbsp; &nbsp; &nbsp; &nbsp; 女， 58岁，因“失眠，自言自语、疑心，乱撕东西，大喊大叫15年，加重一年。”由门诊收住院。<br/></p><p>&nbsp; &nbsp; 1. 病例特点: 患者于15年前， 无明显诱因逐渐重复做一件事，重复已说过的话。无故自笑，女儿常看到其<br/></p><br/>'
    }
  },
  methods: {
    handleMoving (e) {
      console.log(e.atMin, e.atMax)
    },
    handleChange (html, text) {
      console.log(html, text)
    },
    changeContent () {
      this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
    }
  }
}
</script>

<style lang="less">
.center-middle{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.split-pane-page-wrapper{
  height: 600px;
  .pane{
    width: 100%;
    height: 100%;
    &.right-pane{
      background: #999;
    }
    &.left-pane{
      background: #eeeeee;
    }
    &.top-pane{
      padding-left: 5px;
      background: sandybrown;
    }
    &.bottom-pane{
      padding-left: 5px;
      background: #565656;
    }
  }
  .custom-trigger{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000000;
    position: absolute;
    .center-middle;
    box-shadow: 0 0 6px 0 rgba(28, 36, 56, 0.4);
    i.trigger-icon{
      .center-middle;
    }
  }
}
</style>
