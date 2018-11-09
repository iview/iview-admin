<template>
  <div class="tables-edit-outer">
    <div v-if="!isEditting" class="tables-edit-con">
      <span class="value-con">{{ editType=="select"?selectText:value }}</span>
      <Button v-if="editable" @click="startEdit" class="tables-edit-btn" style="padding: 2px 4px;" type="text"><Icon type="md-create"></Icon></Button>
    </div>
    <div v-else class="tables-editting-con">
      <Input v-if="editType == 'text'" :value="value" @input="handleInput" class="tables-edit-input"/>

      <Select v-if="editType == 'select'" :value="value" label-in-value filterable @on-change="selectChange"  class="tables-edit-input">
         <Option v-for="item in selectItem" :value="item.value" :key="item.value">{{ item.label }}</Option>
       </Select>
        <DatePicker v-if="editType == 'date'" type="date" :value="value" @on-change="handleInput" class="tables-edit-input"></DatePicker>
      <Button @click="saveEdit" style="padding: 6px 4px;" type="text"><Icon type="md-checkmark"></Icon></Button>
      <Button @click="canceltEdit" style="padding: 6px 4px;" type="text"><Icon type="md-close"></Icon></Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablesEdit',
  props: {
    value: [String, Number],
    edittingCellId: String,
    params: Object,
    editable: Boolean,
    editType: {
      type: String,
      default: 'text'
    },
    selectItem: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      selectText: ''
    }
  },
  computed: {
    isEditting () {
      return this.edittingCellId === `editting-${this.params.index}-${this.params.column.key}`
    }
  },
  methods: {
    handleInput (val) {
      this.$emit('input', val)
    },
    startEdit () {
      // 在text模式下，开始编辑后如果不点击输入框而直接点击确定按钮，则不会触发 handleInput 事件从而导致值丢失
      this.handleInput(this.value)
      this.$emit('on-start-edit', this.params)
    },
    saveEdit () {
      this.$emit('on-save-edit', this.params)
    },
    canceltEdit () {
      this.$emit('on-cancel-edit', this.params)
    },
    selectChange (option) {
      this.handleInput(option.value)
      this.selectText = option.label
    }
  },
  mounted () {
    let _this = this
    if (_this.editType === 'select') {
      _this.selectItem.forEach(item => {
        if (item.value === _this.value) {
          _this.selectText = item.label
        }
      })
    }
  }
}
</script>

<style lang="less">
.tables-edit-outer{
  height: 100%;
  .tables-edit-con{
    position: relative;
    height: 100%;
    .value-con{
      vertical-align: middle;
    }
    .tables-edit-btn{
      position: absolute;
      right: 10px;
      top: 0;
      display: none;
    }
    &:hover{
      .tables-edit-btn{
        display: inline-block;
      }
    }
  }
  .tables-editting-con{
    .tables-edit-input{
      width: ~"calc(100% - 60px)";
    }
  }
  .tables-select{
    width: 50%
  }
}
</style>
