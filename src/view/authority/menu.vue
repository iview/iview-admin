<template>
  <div class="dooya-container">
    <Card>
      <Row :gutter="20">

        <!-- left -->
        <Col :xs="8"
             :sm="6"
             :xl="6"
             :xxl="6">

        <!-- 操作 -->
        <Alert show-icon>当前选择：
          <span style="color:#2d8cf0;font-weight:bold;margin-right:10px">{{modalData.title}}</span>
          <span class="cancel"
                v-if="modalData.title!==''"
                style="color:#2d8cf0;cursor: pointer"
                @click="()=>{insert();
                             if(menuType==='module'){
                               modalData.parentId='root';
                             }
                            }">取消选择</span>
        </Alert>

        <!-- tree -->
        <div v-for="(menu,i) in menuList"
             :key="i">
          <Tree :ref="'menu'+i"
                :data="[menu]"
                :render="renderContent"></Tree>
          <!-- show-checkbox -->
          <Spin size="large"
                fix
                v-if="treeLoading"></Spin>
        </div>

        </Col>

        <!-- right -->
        <Col :xs="16"
             :sm="14"
             :xl="12"
             :xxl="10">

        <!-- form -->
        <Form ref="formModalData"
              :model="modalData"
              :rules="formModalRule"
              :label-width="100"
              @submit.native.prevent>
          <FormItem label="类型："
                    class="menu-type">
            <Icon :type="modalData.isOutSide?'ios-link':
                         menuType==='module'?'ios-list-box-outline':'ios-document-outline'" />
            {{modalData.isOutSide?"外链菜单":menuType==='module'?'模块菜单':'页面菜单'}}
            <Button type="success"
                    icon="md-add"
                    size="small"
                    style="margin-left:10px"
                    :disabled="menuType==='module'||(modalData.isOutSide&&modalDataType==='insert')"
                    @click="menuType='module';insert()">新增模块</Button>
            <Button type="success"
                    icon="md-add"
                    size="small"
                    style="margin-left:10px"
                    :disabled="menuType==='page'||(modalData.isOutSide&&modalDataType==='insert')"
                    @click="menuType='page';insert()">新增页面</Button>
            <Checkbox v-model="modalData.isOutSide"
                      style="margin-left:10px"
                      :disabled="modalDataType!=='insert'">外链</Checkbox>
          </FormItem>
          <FormItem label="上级："
                    prop="parentId">
            <Select v-model="modalData.parentId"
                    @on-change="parentOnChange">
              <Option v-for="menu in rootSelectList"
                      :value="menu.id"
                      :key="menu.id">{{ menu.title }}</Option>
            </Select>
          </FormItem>
          <FormItem label="层级："
                    v-show="modalData.isOutSide!==true&&menuType!=='module'"
                    prop="showLevel">
            <Select v-model="modalData.showLevel"
                    @on-change="levelOnChange">
              <Option v-for="level in menuLevel"
                      :value="level.value"
                      :key="level.value">{{ level.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="系统名："
                    prop="name">
            <Input type="text"
                   v-model.trim="modalData.name"
                   placeholder="英文系统名，20个字符以内"></Input>
          </FormItem>
          <FormItem label="展现名："
                    prop="title">
            <Input type="text"
                   v-model.trim="modalData.title"
                   placeholder="中文展现名，8个字符以内"></Input>
          </FormItem>
          <FormItem label="路径："
                    prop="url">
            <Input type="text"
                   v-model.trim="modalData.url"
                   placeholder="地址栏路径">
            </Input>
          </FormItem>
          <FormItem label="组件："
                    v-show="modalData.isOutSide!==true"
                    prop="path">
            <Input type="text"
                   v-model.trim="modalData.path"
                   placeholder="前端组件路径"
                   :disabled="menuType==='module' || menuType==='page'">
            <!-- ↑↑↑演示版本不允许修改页面path，实际开发时注掉 -->
            </Input>
          </FormItem>
          <FormItem label="图标："
                    prop="ico">
            <icon-choose v-model="modalData.ico"
                         placeholder="选择图标，子菜单非必选"></icon-choose>
          </FormItem>
          <FormItem label="排序："
                    prop="sort">
            <Input type="number"
                   v-model.trim="modalData.sort"
                   @on-keypress="taskCountOnPress"
                   @on-keyup="taskCountOnUp"></Input>
          </FormItem>
          <FormItem label="描述："
                    prop="description">
            <Input type="text"
                   v-model.trim="modalData.description"></Input>
          </FormItem>

          <FormItem>
            <Button type="primary"
                    @click="handleSubmit('formModalData')"
                    :loading="buttonLoading">{{modalDataType==='insert'?'新增':'保存修改'}}</Button>
            <Button @click="()=>{insert();
                                 if(menuType==='module'){
                                   modalData.parentId='root';
                                 }
                                }"
                    style="margin-left: 8px">{{modalDataType==='insert'?'清空':'新增'}}
            </Button>
            <Button v-if="modalDataType!=='insert'"
                    type="error"
                    :disabled="modalData.name==='menuManage'"
                    @click="deleteMenu(modalData)"
                    style="margin-left: 8px">删除
            </Button>
          </FormItem>
        </Form>

        </Col>

      </Row>
    </Card>

  </div>
</template>

<script>
// vuex
import store from "@/store";
// component
import IconChoose from "@/components/icons/icon-choose";
// mockData
import {
  menuList, // 菜单列表
  menuLevel, // 菜单层级
  roleList // 角色列表
} from "@/mock/role";
// function
import {
  computedMenuData, // 菜单数据转换成iview树形数据结构(2层)
  arraySort, // 对象数组根据key排序
  resultCallback, // 根据请求的status执行回调函数
  getValueByKey // 根据对象数组某个key的value，查询另一个key的value
} from "@/libs/dataHanding";
import { refreshRoute } from "@/router"; // 路由初始化，清空动态路由
// api
import { getAllMenus } from "@/api/data";

export default {
  components: {
    IconChoose
  },
  data() {
    return {
      /* 全局 */
      menuListNotComputed: [], // 全部菜单列表 - 原始数据未处理
      menuList: [], // 全部菜单列表 - 渲染后的tree
      menuLevel: menuLevel, // 菜单层级
      rootSelectList: [], // 上级目录列表 - select用
      /* 页面 */
      tableDataOrg: [], // 原始数据
      /* loading */
      treeLoading: false, // tree
      buttonLoading: false, // button
      /* modal弹框 */
      modalData: {
        id: "",
        name: "",
        title: "",
        url: "",
        path: "template", // 为演示固定为template，实际开发设置为""
        sort: 0,
        parentId: "",
        ico: "",
        isOutSide: false,
        showLevel: "",
        description: "",
        children: []
      }, // 数据 - 获取或提交
      modalDataOrg: {}, // 数据 - 行内原始
      formModalRule: {
        name: [
          { required: true, message: "请输入系统名", trigger: "change" },
          { type: "string", max: 40, message: "系统名过长", trigger: "change" }
        ],
        title: [
          { required: true, message: "请输入展现名", trigger: "change" },
          { type: "string", max: 8, message: "展现名过长", trigger: "change" }
        ],
        url: [
          { required: true, message: "请输入地址栏路径", trigger: "change" }
        ],
        path: [
          {
            required: true,
            validator: (rule, value, callback) => {
              // console.log(this.menuType);
              // console.log(this.modalData.path);
              if (
                this.menuType === "module" ||
                this.modalData.isOutSide === true
              ) {
                callback();
              } else if (
                this.menuType !== "module" &&
                this.modalData.path === ""
              ) {
                callback(new Error("请输入前端组件路径"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        parentId: [
          { required: true, message: "请选择上级菜单", trigger: "change" }
        ],
        showLevel: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (
                this.modalData.isOutSide === true ||
                this.menuType === "module"
              ) {
                callback();
              } else if (this.modalData.showLevel === "") {
                callback(new Error("请选择菜单层级"));
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ],
        ico: [
          {
            required: true,
            validator: (rule, value, callback) => {
              // console.log(this.menuType);
              if (
                this.menuType === "module" ||
                this.modalData.parentId === "root"
              ) {
                if (this.modalData.ico === "") {
                  callback(new Error("请选择图标"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change"
          }
        ]
      }, // form规则
      modalDataType: "insert", // form类型：insert/edit
      menuType: "page" // 菜单类型：module/page
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取首页数据
    async getData() {
      this.treeLoading = true;
      this.menuListNotComputed = (await getAllMenus()).data.data || [];
      this.menuList = computedMenuData(this.menuListNotComputed);
      this.refreshData();
      this.buttonLoading = false;
      this.treeLoading = false;
    },
    // 自定义菜单树的节点内容
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%",
            cursor: "pointer"
          },
          on: {
            click: () => {
              this.menuOnSelect(data);
            }
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: data.ico
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ])
        ]
      );
    },
    // 根据条件刷新数据
    refreshData() {
      /* 按"sort"递归降序，后端已排序可忽略 */
      const sortMenuList = sortList => {
        sortList.sort(arraySort("sort", "desc"));
        sortList.forEach(list => {
          list.children.sort(arraySort("sort", "desc"));
          sortMenuList(list.children);
        });
      };
      sortMenuList(this.menuList);
      /* 上级目录列表 - 只含模块不含页面 */
      this.rootSelectList = [{ id: "root", title: "根目录" }].concat(
        this.menuListNotComputed.filter(list => {
          return list.path === "Main" || list.path === "parentView";
        })
      );
    },
    // 点击按钮 - 新增
    insert() {
      this.modalDataType = "insert";
      this.$refs.formModalData.resetFields();
      this.modalData.isOutSide = false;
      this.modalData.children = [];
    },
    // 选中菜单
    menuOnSelect(value) {
      this.modalDataType = "edit";
      this.menuType =
        value.path === "Main" || value.path === "parentView"
          ? "module"
          : "page";
      this.modalDataOrg = value;
      this.modalData = JSON.parse(JSON.stringify(value));
    },
    // 数量校验 - 禁止输入e和E和-和.
    taskCountOnPress(event) {
      if (
        event.key === "e" ||
        event.key === "E" ||
        event.key === "-" ||
        event.key === "."
      ) {
        event.preventDefault();
      }
    },
    // 数量校验 - 去掉0开头
    taskCountOnUp(event) {
      if (event.srcElement.value.slice(0, 1) === "0" && event.key === "0") {
        event.srcElement.value = parseInt(event.srcElement.value);
      }
    },
    // 上级select框选择发生改变
    parentOnChange(value) {
      // console.log(value);
      if (value && this.menuType === "module") {
        const parentPath = getValueByKey(
          this.menuListNotComputed,
          "id",
          value,
          "path"
        );
        this.modalData.path = parentPath === "" ? "Main" : "parentView";
      }
    },
    // 层级select框选择发生改变 - 为方便演示，新增页面时path固定为template或screen，实际开发注掉
    levelOnChange(value) {
      // console.log(value);
      if (
        value &&
        this.menuType === "page" &&
        this.modalDataType === "insert"
      ) {
        this.modalData.path = value === "2" ? "template" : "screen";
      }
    },
    // 点击表单按钮 - 确定
    handleSubmit() {
      // console.log(this.modalData);
      this.$refs.formModalData.validate(async valid => {
        if (valid) {
          this.buttonLoading = true;
          this.modalData.sort = parseInt(this.modalData.sort);
          switch (this.modalDataType) {
            case "insert":
              if (
                menuList.some(item => item.url === this.modalData.url) ||
                menuList.some(item => item.name === this.modalData.name)
              ) {
                this.$Message.error("系统名或路径已存在！");
                this.buttonLoading = false;
              } else {
                // 随机生成id
                this.modalData.id = Math.random()
                  .toString(36)
                  .substr(-10);
                // 如果是外链 -> path值不能为空否则影响父级路由的重定向 ->设置为任意常量
                this.modalData.isOutSide === true &&
                  (this.modalData.path = "outSidePath");
                // 菜单列表追加
                menuList.push(JSON.parse(JSON.stringify(this.modalData)));
                // 自动为super_admin赋予权限
                roleList.forEach(role => {
                  role.name === "super_admin" &&
                    role.menus.push(this.modalData.id);
                });
                resultCallback(200, "添加成功！", () => {
                  this.refreshRouteData();
                  this.insert();
                  this.buttonLoading = false;
                });
              }
              break;
            case "edit":
              if (
                (menuList.some(item => item.url === this.modalData.url) &&
                  this.modalData.url !== this.modalDataOrg.url) ||
                (menuList.some(item => item.name === this.modalData.name) &&
                  this.modalData.name !== this.modalDataOrg.name)
              ) {
                // 判断重复
                this.$Message.error("系统名或路径已存在！");
                this.buttonLoading = false;
              } else {
                menuList.forEach((list, i) => {
                  list.id === this.modalData.id &&
                    this.$set(
                      menuList,
                      i,
                      JSON.parse(JSON.stringify(this.modalData))
                    );
                });
                resultCallback(200, "修改成功！", () => {
                  this.modalDataOrg = JSON.parse(
                    JSON.stringify(this.modalData)
                  );
                  this.refreshRouteData();
                  this.buttonLoading = false;
                });
              }
              break;
          }
        }
      });
    },
    // 点击按钮 - 删除
    deleteMenu(data) {
      if (data.children.length !== 0) {
        this.$Message.error("请先删除或解绑该菜单下的子菜单");
      } else {
        this.$Modal.confirm({
          title: "确定删除？",
          onOk: async () => {
            // 在菜单列表删除
            menuList.forEach((list, i) => {
              data.id === list.id && menuList.splice(i, 1);
            });
            // 自动为super_admin删除权限
            roleList.forEach(role => {
              role.name === "super_admin" &&
                role.menus.forEach((menu, i) => {
                  menu === data.id && role.menus.splice(i, 1);
                });
            });
            resultCallback(200, "删除成功！", () => {
              this.refreshRouteData();
              this.insert();
              this.menuType = "page";
            });
          },
          closable: true
        });
      }
    },
    // 刷新左侧菜单数据
    refreshRouteData() {
      localStorage.setItem("dynamicRouter-template", []);
      refreshRoute();
      store.dispatch("getRouters").then(res => {
        this.getData();
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dooya-container /deep/ {
  .ivu-tree {
    &-children {
      li {
        margin: 10px 0;
      }
    }
  }
  .ivu-form {
    .menu-type i {
      font-size: 16px;
      vertical-align: sub;
    }
  }
}
</style>
