<template>
  <Collapse v-model="value1" accordion>
    <Panel name="1">
      基本信息
      <Form slot="content" :model="formItem" :label-width="69" style="padding:15px !important;">
        <Row>
          <Col span="8">
            <FormItem label="姓名" >
              <Input v-model="formItem.nick" placeholder="请输入姓名"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="年龄" >
              <Input v-model="formItem.age" placeholder="请输入年龄"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="民族">
              <Select v-model="formItem.minzu">
                <Option value="01">汉族</Option>
                <Option value="02">壮族</Option>
                <Option value="03">满族</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="籍贯" >
              <Cascader :data="formItem.cityJson" trigger="hover"></Cascader>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="职业">
              <Select v-model="formItem.zhiye">
                <Option value="01">医生</Option>
                <Option value="02">公务员</Option>
                <Option value="03">工程师</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="宗教信仰">
              <Select v-model="formItem.zongjiaoxinyang">
                <Option value="a">无</Option>
                <Option value="b">基督教</Option>
                <Option value="c">伊斯兰教</Option>
                <Option value="d">佛教</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="性别">
              <RadioGroup v-model="formItem.sale">
                <Radio label="male">男</Radio>
                <Radio label="female">女</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="婚姻">
              <RadioGroup v-model="formItem.hunyin">
                <Radio label="n">未婚</Radio>
                <Radio label="y">已婚</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="文化程序">
              <Select v-model="formItem.wenhua">
                <Option value="a">无</Option>
                <Option value="b">小学</Option>
                <Option value="c">初中</Option>
                <Option value="d">高中</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="身份证号">
              <Input v-model="formItem.gongzuodanwei" placeholder="请输入身份证号"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="工作单位">
              <Input v-model="formItem.gongzuodanwei" placeholder="请输入工作单位"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="现住地址">
              <Input v-model="formItem.xianjuzhuzhi" placeholder="请输入现住地址"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="入院时间">
              <DatePicker
                type="date"
                placeholder="Select date"
                v-model="formItem.ruyuanshijian"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="记录时间">
              <DatePicker
                type="date"
                placeholder="Select date"
                v-model="formItem.jilushijian"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="住院号">
              <Input v-model="formItem.age" placeholder="请输入年龄"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="选择表格">
              <CheckboxGroup v-model="formItem.switchTable">
                <Checkbox label="精神分裂症心理治疗记录单"></Checkbox>
                <Checkbox label="躁狂症状量表（BRMS"></Checkbox>
                <Checkbox label="汉密尔顿焦虑量表（HAMA）"></Checkbox>
                <Checkbox label="汉密尔顿抑郁量表（HAMD）"></Checkbox>
                <Checkbox label="药物不良反应表（TESS）"></Checkbox>
                <Checkbox label="临床总体印象量表（CGI）"></Checkbox>
                <Checkbox label="简明精神病评定量表（BPRS）"></Checkbox>
                <Checkbox label="阴性症状量表（SANS）"></Checkbox>
                <Checkbox label="阳性症状量表（SAPS）"></Checkbox>
                <Checkbox label="精神护理观察量表（NOSIE）"></Checkbox>
                <Checkbox label="行为观察和治疗记录单"></Checkbox>
                <Checkbox label="双向情感障碍心理治疗记录单"></Checkbox>
                <Checkbox label="抑郁症心理治疗记录单"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Button type="primary">确认</Button>
          <Button style="margin-left: 8px">重置</Button>
          <Button type="success" style="margin-left: 8px">语音导入</Button>
        </FormItem>
      </Form>
    </Panel>
    <Panel name="2">
      主诉
      <p slot="content">主诉</p>
    </Panel>
  </Collapse>
</template>
<script>
export default {
  data () {
    return {
      value1: '1',
      formItem: {
        nick: '',
        age: '',
        minzu: '01',
        jiguan: '',
        zhiye: '01',
        zongjiaoxinyang: 'a',
        sale: 'male',
        hunyin: 'y',
        wenhua: 'a',
        gongzuodanwei: '',
        xianjuzhuzhi: '',
        ruyuanshijian: '',
        jilushijian: '',
        zhuyuanhao: '',
        bingshilaiyuan: '',
        phoneNum: '',
        switchTable: [],
        cityJson: [
          {
            value: 'beijing',
            label: '北京',
            children: [
              {
                value: 'gugong',
                label: '故宫'
              },
              {
                value: 'tiantan',
                label: '天坛'
              },
              {
                value: 'wangfujing',
                label: '王府井'
              }
            ]
          }, {
            value: 'jiangsu',
            label: '江苏',
            children: [
              {
                value: 'nanjing',
                label: '南京',
                children: [
                  {
                    value: 'fuzimiao',
                    label: '夫子庙'
                  }
                ]
              },
              {
                value: 'suzhou',
                label: '苏州',
                children: [
                  {
                    value: 'zhuozhengyuan',
                    label: '拙政园'
                  },
                  {
                    value: 'shizilin',
                    label: '狮子林'
                  }
                ]
              }
            ]
          }
        ],
        input: '',
        select: '',
        radio: 'male',
        checkbox: [],
        switch: true,
        date: '',
        time: '',
        slider: [20, 50],
        textarea: ''
      }
    }
  }
}
</script>
