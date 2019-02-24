
<template>
  <div>
        <Select
            v-model="defaultValue"
            filterable
            remote
            @on-change="handleChangeSelect"
            :loading="loading">
            <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
        </Select>
  </div>
</template>

<script>
import { getOptions} from '@/api/base/select'
export default {
    props:{
        code:String,
        value:String
    },
  data () {
    return {
        loading : true,
        defaultValue:"",
        options:[],
    }
  },
  methods: {
    handleChangeSelect(value){
        this.$emit('update:value',value)
    },
    // handleGetSelect(){
    //     console.log("handleGetSelect");
    //     this.handlegetSelect('');
    // },
    handlegetSelect(query){
        this.loading = true
        getOptions({code:this.code}).then(res => {
            if(res.data.status == 1){
                this.loading=false
                const list = res.data.data.map(item => {
                    return {
                        value:item.value,
                        label:item.name
                    };
                });
                if(query){
                    this.options = list.filter(
                        item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
                    );
                }else{
                    this.options = list
                }
            }
        })
    }
  },
  watch:{
      value(newValue,oldValue){
        //   this.handlegetSelect(newValue)
        console.log("watch");
        this.defaultValue=newValue+""
      }
  },
  mounted () {
      console.log("mounted");
      this.handlegetSelect()
  }
}
</script>
<style>
</style>