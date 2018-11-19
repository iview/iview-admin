<template>
  <div>
    <Row>
      <i-col>
        <Card>
          <Row>
            <i-col span="8">
              <Button type="primary" @click="showModal">显示可拖动弹窗</Button>
              <br/>
              <Button v-draggable="buttonOptions" class="draggable-btn">这个按钮也是可以拖动的</Button>
            </i-col>
            <i-col span="16">
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
    <Row style="margin-top: 10px;">
      <i-col>
        <Card>
          <Row>
            <i-col span="8">
              <Input style="width: 60%" v-model="inputValue">
                <Button slot="append" v-clipboard="clipOptions">copy</Button>
              </Input>
            </i-col>
            <i-col span="16">
              <div class="intro-con">
                &lt;Input style="width: 60%" v-model="inputValue"&gt;
                  <br/>
                  &nbsp;&nbsp;&nbsp;&lt;Button slot="append" v-clipboard="clipOptions"&gt;copy&lt;/Button&gt;
                  <br/>
                &lt;/Input&gt;
                <pre class="code-con">
    inputValue = {
      value: this.inputValue,
      success: (e) => {
        this.$Message.success('复制成功')
      },
      error: () => {
        this.$Message.error('复制失败')
      }
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
      statu: 1,
      inputValue: '这是输入的内容'
    }
  },
  computed: {
    clipOptions () {
      return {
        value: this.inputValue,
        success: (e) => {
          this.$Message.success('复制成功')
        },
        error: () => {
          this.$Message.error('复制失败')
        }
      }
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
