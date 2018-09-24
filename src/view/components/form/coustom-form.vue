<template>
  <div>
    <Modal v-model="visible" :title="title" @on-ok="onOk" @on-cancel="onCancel" :loading="loading">
      <Form :label-width="60">
        <FormItem v-for="(item, index) in formColumn" :label="item.label">
          <Input v-if="item.type == 'input'" v-model="formData[item.key]" :type="item.ext.type" :clearable="item.ext.clearable" :placeholder="item.placeholder" :value="item.data"></Input>
          <Select v-if="item.type == 'select'" v-model="formData[item.key]">
            <Option v-for="temp in item.data" :value="temp.value">{{temp.name}}</Option>
          </Select>
          <RadioGroup v-if="item.type == 'radio'" v-model="formData[item.key]">
            <Radio v-for="temp in item.data" :label="temp.value">{{temp.name}}</Radio>
          </RadioGroup>
          <CheckboxGroup v-if="item.type == 'checkbox'" v-model="formData[item.key]">
            <Checkbox v-for="temp in item.data" :label="temp.value">{{temp.name}}</Checkbox>
          </CheckboxGroup>
          <i-switch v-if="item.type == 'switch'" size="large" v-model="formData[item.key]" :true-value="item.ext.trueValue" :false-value="item.ext.falseValue">
            <span  v-for="temp in item.data" :slot="temp.value">{{temp.name}}</span>
          </i-switch>
          <Input v-if="item.type == 'textarea'" v-model="formData[item.key]" type="textarea" :autosize="{minRows: item.minRows, maxRows: item.maxRows}" :placeholder="item.placeholder"></Input>
          <InputNumber v-if="item.type == 'input-number'" v-model="formData[item.key]"></InputNumber>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'CoustomForm',
  props: {
    title: {
      type: String
    },
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    formColumn: Array
  },
  data () {
    let formData = {}
    if (this.formColumn) {
      this.formColumn.forEach(item => {
        item.ext = item.ext || {}
        if (item.type === 'input') {
          item.placeholder = item.placeholder || `请输入${item.label}`
          item.ext = {
            type: item.ext.type || 'text',
            clearable: item.ext.clearable || false,
            disabled: item.ext.disabled || false,
            readonly: item.ext.readonly || false
          }
          formData[item.key] = null
        } else if (item.type === 'checkbox') {
          formData[item.key] = []
        } else if (item.type === 'switch') {
          item.ext = {
            size: item.ext.size || 'default',
            disabled: item.ext.disabled || 'default',
            trueValue: item.ext.trueValue || true,
            falseValue: item.ext.falseValue || false
          }
        } else if (item.type === 'input-number') {
          formData[item.key] = 0
        } else {
          formData[item.key] = null
        }
      })
    }
    return {
      visible: this.value,
      buttonLoading: false,
      formData
    }
  },
  methods: {
    onOk () {
      this.$emit('form-data', this.formData)
      this.$emit('on-ok')
    },
    onCancel () {
      this.$emit('on-cancel')
    }
  },
  watch: {
    value (val) {
      this.visible = val
      console.log(val, 'value')
    },
    visible (val) {
      this.$emit('on-visible-change', val)
      console.log(val, 'visible')
    }
  }
}
</script>

<style scoped>

</style>
