<template>
  <Layout>
    <Content style="admin-panel">
      <Row :gutter="16">
        <Col span="9">
        <Card>
          <p slot="title"
             style="card-header">服务器状态</p>
          <p>
            <span>运行状态:</span>
            <Tag type="dot"
                 color="success">{{constants}}</Tag>
          </p>
          <p>
            <span>服务器发行状态:</span>
            <Tag color="blue">{{release}}</Tag>
          </p>
          <p>
            <span>Node.js编译运行系统平台:</span>
            <Tag color="#515a6e">{{platform}}</Tag>
          </p>
        </Card>
        </Col>
        <Col span="15">
        <Card>
          <p slot="title"
             style="card-header">服务器信息</p>
          <p>
            <span>服务器主机名:</span>
            <Tag color="#515a6e">{{hostname}}</Tag>
          </p>
          <p>
            <span>操作系统:</span>
            <Tag color="primary">{{system}}</Tag>
          </p>
          <p>
            <span>服务器总内存数:</span>
            <Tag color="blue">{{totalmemory}}</Tag>
          </p>
          <p>
            <span>服务器可用内存数:</span>
            <Tag color="blue">{{Freememory}}</Tag>
          </p>
        </Card>
        <Card>
          <div style="text-align:center">
            <img :src="imgUrl" />
          </div>
        </Card>
        </Col>
      </Row>
    </Content>
  </Layout>
</template>

<script>
import './index.less'

export default {
  name: 'admin',
  data () {
    return {
      // 服务器状态
      constants: null,
      release: null,
      platform: null,
      // 服务器信息
      hostname: null,
      system: null,
      totalmemory: null,
      Freememory: null,
      imgUrl: './assets/images/iview.png'
    }
  },
  created () {
    console.log(process.env.NODE_ENV + '表示正在开发')
  }
}
</script>
