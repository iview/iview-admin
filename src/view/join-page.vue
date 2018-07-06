<template>
  <div>
    <Row :gutter="20">
      <i-col span="12">
        <Card title="iview-admin开发者QQ群" shadow>
          <img class="qq-group-img" :src="qqDev" alt="">
          <p class="qq-group-intro">本群为愿意参与到iview-admin项目开发的开发者提供交流平台，进群需要为iview-admin提供优质有效的Pull requests。如果所提PR未达到要求或有缺陷，我们可以共同交流，争取做到最好。</p>
        </Card>
      </i-col>
      <i-col span="12">
        <Card title="iview-admin交流QQ群" shadow>
          <img class="qq-group-img" :src="qqFans" alt="">
          <p class="qq-group-intro">本群为使用iview-admin或者对iview-admin感兴趣的开发者提供交流平台，在这里，解决你开发中的疑惑，共同进步。</p>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import qqFans from '@/assets/images/qq-fance.jpg'
import qqDev from '@/assets/images/qq-dev.jpg'
export default {
  name: 'join_page',
  data () {
    return {
      qqFans,
      qqDev
    }
  }
}
</script>

<style>
.qq-group-img{
  display: block;
  margin: 0 auto;
  width: 240px;
}
.qq-group-intro{
  padding: 20px;
  font-size: 16px;
}
</style>
