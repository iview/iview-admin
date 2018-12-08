<template>
  <div>
           <Row :gutter="32">
                <Col span="6">
                    <Card>
                        <p slot="title">
                            <Icon type="logo-snapchat" />
                            基本信息
                        </p>
                        <div>
                            <p>ID：{{user.id}}</p>
                            <p>姓名：{{user.nickname}}</p>
                            <p>帐号：{{user.username}}</p>
                            <p>性别：{{user.sex}}</p>
                            <p>年龄：{{user.age}}</p>
                            <p>手机：{{user.phonenumber}}</p>
                            <p>Email：{{user.email}}</p>
                            <p>地址：{{user.address}}</p>
                            <p>创建时间：{{user.create_time}}</p>
                        </div>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-chatbubbles" />
                            微信
                        </p>
                        <div>
                            姓名：赵晓腾
                        </div>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-chatbubbles-outline" />
                            微博
                        </p>
                        <div>
                            姓名：赵晓腾
                        </div>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">
                            <Icon type="logo-github" />
                            Github
                        </p>
                        <div>
                            姓名：赵晓腾
                        </div>
                    </Card>
                </Col>
                
            </Row>
           <Row :gutter="32">
                <Col span="6">
                    <Card>
                        <p slot="title">
                            <Icon type="logo-snapchat" />
                            所有角色
                        </p>
                        <div>
                            <p>ID：{{user.id}}</p>
                            <p>姓名：{{user.nickname}}</p>
                            <p>帐号：{{user.username}}</p>
                            <p>性别：{{user.sex}}</p>
                            <p>年龄：{{user.age}}</p>
                            <p>手机：{{user.phonenumber}}</p>
                            <p>Email：{{user.email}}</p>
                            <p>地址：{{user.address}}</p>
                            <p>创建时间：{{user.create_time}}</p>
                        </div>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-chatbubbles" />
                            组织信息
                        </p>
                        <div>
                            姓名：赵晓腾
                        </div>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">
                            <Icon type="ios-chatbubbles-outline" />
                            微博
                        </p>
                        <div>
                            姓名：赵晓腾
                        </div>
                    </Card>
                </Col>
                <Col span="6">
                    <Card>
                        <p slot="title">
                            <Icon type="logo-github" />
                            Github
                        </p>
                        <div>
                            姓名：赵晓腾
                        </div>
                    </Card>
                </Col>
                
            </Row>
  </div>
</template>

<script>
import './index.less'
import { getCurrentUser } from '@/api/user'
export default {
  data () {
    return {
        user:{
            id:'',
            username:'',
            nickname:'',
            age:'',
            email:'',
            phonenumber:'',
            create_time:'',
            address:'',
        }
    }
  },
  methods: {
      handleGetUser(){
          getCurrentUser().then(res =>{
              if(res.data.status == 1){
                this.user = res.data.data
              }
          });
      }
  },
  mounted () {
    this.handleGetUser();
  }
}
</script>
