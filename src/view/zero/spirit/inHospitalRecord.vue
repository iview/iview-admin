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
      offset: 0.5,
      offsetVertical: '250px',
      /* eslint-disable */
      content: `"<h2 style=\"text-align:center;\">入院记录</h2><p style=\"border-bottom:2px solid #666;\"><b>&nbsp;&nbsp;&nbsp;科室：精神科&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;姓名:张三&nbsp; &nbsp; &nbsp;&nbsp;年龄:58岁&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; 住院号:001</b></p><p data-we-empty-p=\"\" style=\"\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名<b>:&nbsp;</b>张三&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文化程度<b>:&nbsp;</b>其他</p><p data-we-empty-p=\"\" style=\"\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;性别<b>:&nbsp;</b>女&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;宗教信仰<b>:&nbsp;</b>无</p><p data-we-empty-p=\"\" style=\"\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年龄<b>: </b>18岁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工作单位<b>:&nbsp;</b>北京市丰台区大桥路28</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;婚姻<b>:&nbsp;</b>已婚&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现居住址<b>:&nbsp;</b>北京市丰台区</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;职业<b>:&nbsp;</b>公务员&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;记录时间<b>:&nbsp;</b>2021-01-01</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;籍贯<b style=\"font-size: 12px;\">:&nbsp;</b>北京市朝阳区&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;入院时间：2021-01-01</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;职业<b>:&nbsp;</b>&nbsp;公务员&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size=\"3\">记录时间<b style=\"\">:&nbsp;</b>2021-01-01</font></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;民族<b>:&nbsp;</b>&nbsp;汉&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size=\"3\">病史来源<b style=\"\">:&nbsp;</b>&nbsp;其他</font></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;身份证<b>:&nbsp;</b>001&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电话<b>:&nbsp;</b>13500000000<br/></p><p><br/></p><p style=\"line-height:2;\"><font size=\"3\">\n      &nbsp; &nbsp; &nbsp;<b>主诉</b>：失眠，自言自语、疑心，乱撕东西，大喊大叫15年，加重一年。\n      <br/></font></p><p style=\"line-height:2;\"><font size=\"3\">&nbsp; &nbsp;&nbsp;&nbsp;<b>现病史</b>：患者于15年前，无明显诱因，逐渐出现重复做一件事情，重复已说过的话。无故自笑，女儿常看到其自言自语，说母亲能听到有墨人生人和自己说话。大小便不能自理，穿衣经常不知道正反，在家里经常无缘无故，大喊大叫，家人劝说不听。在家里喜欢撕东西。<br/></font></p><font size=\"3\"><br/></font>`
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
