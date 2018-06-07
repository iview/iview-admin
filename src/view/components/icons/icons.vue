<template>
  <Row>
    <i-col span="16">
      <Row v-for="i in (customIconList.length / 3)" :key="`custom-icon-row-${i}`">
        <i-col span="8" v-for="item in customIconList.slice((i - 1) * 3, i * 3)" :key="`custom-icon-${item}`">
          <Card style="margin: 0 5px 5px; text-align: center;">
            <icons :size="30" :type="item"/>
            <p class="icon-code">&lt;Icons :size="30" type="{{ item }}"&gt;</p>
            <p>&lt;CommonIcon :size="30" type="_{{ item }}"&gt;</p>
          </Card>
        </i-col>
      </Row>
      <Row>
        <i-col>
          <Card style="margin: 0 5px 5px; text-align: center;">
            <common-icon :size="30" type="ionic"/>
            <p class="icon-code">iView内置图标</p>
            <p>&lt;CommonIcon :size="30" type="ionic"&gt;</p>
          </Card>
        </i-col>
      </Row>
    </i-col>
    <i-col span="8">
      <Card>
        <p class="intro-p"><Icon style="margin-right: 10px;" :size="10" type="heart"/>Icons组件支持自定义图标的显示，具体自定义图标字体文件的制作请参考文档。</p>
        <p class="intro-p"><Icon style="margin-right: 10px;" :size="10" type="heart"/>CommonIcon组件同时支持iView内置图标类型和自定义图标类型，为了区别这两种类型，需要在自定义图标名称前加下划线"_"</p>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import Icons from '_c/icons'
import CommonIcon from '_c/common-icon'
export default {
  name: 'icons_pages',
  components: {
    Icons,
    CommonIcon
  },
  data () {
    return {
      customIconList: [
        'woman',
        'man',
        'smile',
        'meh',
        'frown',
        'bear'
      ]
    }
  }
}
</script>

<style lang="less">
.icon-code{
  margin: 20px 0 10px;
}
.intro-p{
  margin-bottom: 10px;
}
</style>
