<template>
  <div>
    <Row>
      <i-col>
        <Card>
          <Row>
            <i-col span="5">
              <Button type="primary" @click="showModal">显示可拖动弹窗</Button>
              <br/>
              <Button v-draggable="buttonOptions" class="draggable-btn">这个按钮也是可以拖动的</Button>
            </i-col>
            <i-col span="19">
              <div class="intro-con">
                &lt;Modal v-draggable="options" v-model="visible"&gt;标题&lt;/Modal&gt;
                <pre class="code-con">
    options = {
      trigger: '.ivu-modal-body',
      body: '.ivu-modal'
    }
                </pre>
              </div>
            </i-col>
          </Row>
        </Card>
      </i-col>
      <Modal v-draggable="options" v-model="modalVisible">
        拖动这里即可拖动整个弹窗
      </Modal>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'directive_page',
  data () {
    return {
      modalVisible: false,
      options: {
        trigger: '.ivu-modal-body',
        body: '.ivu-modal',
        recover: true
      },
      buttonOptions: {
        trigger: '.draggable-btn',
        body: '.draggable-btn'
      },
      statu: 1
    }
  },
  methods: {
    showModal () {
      this.modalVisible = true
    }
  }
}
</script>

<style>
.intro-con{
  min-height: 140px;
}
.draggable-btn{
  margin-top: 20px;
}
.code-con{
  width: 400px;
  background: #F9F9F9;
  padding-top: 10px;
}
</style>
