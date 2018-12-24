
<template>
  <div>
    <div class="demo-upload-list" v-for="item in fileList">
        <template>
            <img :src="item.path">
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
        </template>
    </div>
    <Upload 
        :action="url.upload" 
        :headers="headers" 
        :with-credentials="withCredentials" 
        name = "file"
        :show-upload-list="showList"
        :on-success="handleOkUpload"
        >
        <Button icon="ios-cloud-upload-outline">选择上传文件</Button>
    </Upload>
  </div>
</template>

<script>
import config from '@/config'
import { getUpload} from '@/api/base/upload'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export default {
    props:{
        upid:Number
    },
  data () {
    return {
        showList:false,
        url:{
            upload:baseUrl+"/upload/file"
        },
        headers: {
            'Access-Control-Allow-Origin' : '*'
        },
        withCredentials:true,
        fileList:[],
    }
  },
  methods: {
    handleOkUpload(res,file,fileList){
        let id=res.data.id
        this.$emit('update:upid',id)
        let url_path = baseUrl+"/upload/file/"+id
        this.fileList = [{path:url_path}]

    },
    handleGetFile(upid){
        if(upid){
            getUpload(upid).then(res => {
                if(res.data.status == 1){
                    let url_path = baseUrl+"/upload/file/"+res.data.data.id
                    this.fileList = [{path:url_path}]
                }
            })
        }else{
            this.fileList = []
        }
    }
  },
  watch:{
      upid(newValue,oldValue){
          this.handleGetFile(newValue)
      }
  },
  mounted () {
      this.handleGetFile(this.upid)
  }
}
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>