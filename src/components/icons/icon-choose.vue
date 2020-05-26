<template>
  <div>

    <!-- input & button -->
    <div style="display:flex">
      <Input v-model="currentValue"
             @on-change="handleChange"
             :placeholder="placeholder"
             :size="size"
             :disabled="disabled"
             :readonly="readonly"
             :maxlength="maxlength"
             :icon="currentValue" />
      <Button @click="iconModalVisible=true"
              :size="size"
              :disabled="disabled"
              :icon="icon"
              style="margin-left:10px">选择图标</Button>
    </div>

    <!-- modal -->
    <Modal title="选择图标"
           v-model="iconModalVisible"
           :width="950"
           :styles="{top: '10%'}"
           footer-hide
           :z-index="1060">
      <!-- :styles="{top: '30px'}" -->

      <!-- 搜索框 -->
      <div class="icon-search">
        <input type="text"
               v-model="key"
               :placeholder="tip"
               @input="handleInput"
               @focus="handleFocus"
               @blur="handleBlur">
      </div>

      <!-- icon列表 -->
      <div class="icon-block icon-bar">
        <div class="icon-wrap"
             v-for="(icon, i) in iconData"
             :key="i"
             @click="hanleChoose(icon)">
          <div class="icons-item">
            <Icon :type="icon"
                  style="font-size: 32px;" />
            <p>{{icon}}</p>
          </div>
        </div>
      </div>

    </Modal>
  </div>
</template>

<script>
// mockData
import { iconList } from "./icon"; // icon列表

export default {
  name: "iconChoose",
  props: {
    // 绑定值输入框绑定值 & 尾部图标
    value: {
      type: String,
      default: ""
    },
    size: String, // 尺寸：input & button
    placeholder: {
      type: String,
      default: "输入图标名或选择图标"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxlength: Number,
    // 按钮 "选择图标" 里面的icon
    icon: {
      type: String,
      default: "md-ionic"
    }
  },
  data() {
    return {
      /* input和button */
      currentValue: this.value, // 输入框绑定值 & 尾部图标
      /* modal弹框 */
      iconModalVisible: false, // 是否可见
      iconData: [], // icon列表
      key: "", // 搜索框关键词
      tip: "输入英文关键词搜索，比如 success" // 搜索框placeholder
    };
  },
  created() {
    this.getData(this.key);
  },
  methods: {
    // 根据关键词获取icon列表数据
    getData(key) {
      let iconData = [];
      iconList.forEach(icon => {
        icon.tags.forEach(tag => {
          if (tag.indexOf(this.key) >= 0) {
            icon.icons.forEach(item => {
              iconData.push(item);
            });
          }
        });
      });
      this.iconData = iconData;
      // console.log(this.iconData);
    },
    // 搜索框输入关键词
    handleInput() {
      this.getData(this.key);
    },
    // 搜索框获得焦点
    handleFocus() {
      if (!this.key) {
        this.tip = "";
      }
    },
    // 搜索框失去焦点
    handleBlur() {
      if (!this.key) {
        this.tip = "输入英文关键词搜索，比如 success";
      }
    },
    // modal输入框数据发生改变
    handleChange(value) {
      // 向父组件传递事件
      this.$emit("input", this.currentValue);
      this.$emit("on-change", this.currentValue);
    },
    // modal选择icon并点击
    hanleChoose(value) {
      this.currentValue = value;
      this.iconModalVisible = false;
      // 向父组件传递事件
      this.$emit("input", this.currentValue);
      this.$emit("on-change", this.currentValue);
    },
    // value绑定值更新 -> input框 和 button 的 currentValue值 也更新
    setCurrentValue(value) {
      this.currentValue = value;
    }
  },
  watch: {
    // 检测value绑定值更新
    value(val) {
      this.setCurrentValue(val);
    }
  }
};
</script>

<style lang="less">
.icon-search {
  position: relative;
  margin: 20px auto 30px;
  text-align: center;
  input {
    width: 500px;
    box-sizing: border-box;
    border: 0;
    border-radius: 4px;
    background: #f5f5f5;
    text-align: center;
    font-size: 14px;
    outline: none;
    margin: 0 auto;
    padding: 8px 0;
  }
}
.icon-block {
  display: flex;
  flex-wrap: wrap;
  // max-height: 500px;
  max-height: calc(60vh);
  overflow: auto;
}
.icon-bar {
  overflow: auto;
  overflow-x: hidden;
}
.icon-bar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.icon-bar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #c3c3c3;
}

.icon-bar::-webkit-scrollbar-track {
  background: #fff;
}
.icon-wrap {
  :hover {
    color: #1890ff;
    transition: color 0.3s;
  }
}
.icons-item {
  margin: 6px 6px 6px 0;
  width: 145px;
  text-align: center;
  list-style: none;
  cursor: pointer;
  height: 100px;
  color: #5c6b77;
  transition: all 0.2s ease;
  position: relative;
  padding-top: 10px;
  p {
    padding-top: 15px;
    margin: 5px;
    font-size: 14px;
  }
}
</style>
