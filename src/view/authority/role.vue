<template>
  <div class="dooya-container">
    <Card>
      <!-- 操作 -->
      <div style="margin: 10px 0">
        <Button type="success"
                icon="md-add"
                @click="insert">新增角色</Button>
      </div>

      <!-- 表格 -->
      <Table :data="tableData"
             :loading="tableLoading"
             :columns="tableColumns"
             stripe></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page show-sizer
                transfer
                placement="top"
                :total="tableDataOrg.length"
                :current.sync="pageNum"
                :page-size-opts="[10, 50, 100, 200]"
                :page-size="pageSize"
                @on-change="changePage"
                @on-page-size-change="changePageSize"></Page>
        </div>
      </div>
    </Card>

    <!-- Modal - 角色 -->
    <Modal v-model="modalShowRole"
           :mask-closable="false"
           :closable="false"
           footer-hide
           :title="modalDataRoleType==='edit'?'编辑角色':'新增角色'"
           @on-ok="handleSubmitRole">
      <Form ref="formModalDataRole"
            :model="modalDataRole"
            :rules="formModalRule"
            :label-width="100"
            @submit.native.prevent>
        <FormItem label="标识："
                  prop="name">
          <Input type="text"
                 v-model.trim="modalDataRole.name"
                 :disabled="modalDataRoleOrg.name==='super_admin'"></Input>
        </FormItem>
        <FormItem label="名称："
                  prop="title">
          <Input type="text"
                 v-model.trim="modalDataRole.title"></Input>
        </FormItem>
        <FormItem label="描述："
                  prop="description">
          <Input type="text"
                 v-model.trim="modalDataRole.description"></Input>
        </FormItem>

        <FormItem>
          <Button type="primary"
                  @click="handleSubmitRole('formModalDataRole')"
                  :loading="buttonLoading">确定</Button>
          <Button @click="modalShowRole=false"
                  style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>

    <!-- Modal - 菜单 -->
    <Modal v-model="modalShowMenu"
           :mask-closable="false"
           :closable="false"
           footer-hide
           title="关联菜单"
           @on-ok="handleSubmitMenu">
      <Form ref="formModalDataMenu"
            :model="modalDataMenu"
            :label-width="60"
            @submit.native.prevent>
        <FormItem label="菜单："
                  prop="menus"
                  class="menu-function">

          <div v-for="(menu,i) in menuList"
               :key="i">
            <Tree :ref="'menu'+i"
                  :data="[menu]"
                  show-checkbox></Tree>
          </div>
        </FormItem>

        <FormItem>
          <Button type="primary"
                  @click="handleSubmitMenu('formModalDataMenu')"
                  :loading="buttonLoading">确定</Button>
          <Button @click="modalShowMenu=false;menuSelectedId=[];
                          menuList=JSON.parse(JSON.stringify(menuListOrg))"
                  style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
// vuex
import store from "@/store";
// mockData
import {
  userList, // 用户列表
  roleList // 角色列表
  // menuList // 菜单列表
} from "@/mock/role";
// function
import {
  computedMenuData, // 菜单数据转换成iview树形数据结构(多层)
  resultCallback, // 根据请求的status执行回调函数
  getValueByKey // 根据对象数组某个key的value，查询另一个key的value
} from "@/libs/dataHanding";
// api
import {
  getRoleList, // 获取角色列表
  getAllMenus // 获取全部菜单
} from "@/api/data";
import { refreshRoute } from "@/router"; // 路由初始化，清空动态路由

export default {
  data() {
    return {
      /* 全局 */
      menuListNotComputed: [], // 全部菜单列表 - 原始数据未处理
      menuListOrg: [], // 全部菜单列表 - 原始数据处理后
      menuList: [], // 全部菜单列表 - 渲染后的tree
      roleSubList: [], // 当前角色的下级角色列表
      roleId: "", // 角色id - 维护关系用
      /* 每页 */
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      tableColumns: [
        {
          title: "标识",
          key: "name",
          align: "center",
          minWidth: 120
        },
        {
          title: "名称",
          key: "title",
          align: "center",
          minWidth: 120
        },
        {
          title: "功能",
          key: "menus",
          render: (h, params) => {
            return h("div", [
              params.row.menus.map(item => {
                return h(
                  "Tag",
                  {
                    props: {
                      color: "blue"
                    },
                    style: {
                      display:
                        getValueByKey(
                          this.menuListNotComputed,
                          "id",
                          item,
                          "path"
                        ) !== ""
                          ? "inline-block"
                          : "none"
                    }
                  },
                  getValueByKey(this.menuListNotComputed, "id", item, "title")
                );
              })
            ]);
          },
          minWidth: 500
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    trigger: "hover",
                    content: "修改",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      type: "primary",
                      size: "small",
                      icon: "ios-create-outline"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
                  })
                ]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    trigger: "hover",
                    content: "关联菜单",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      type: "info",
                      size: "small",
                      icon: "ios-menu-outline"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.relateMenus(params.row);
                      }
                    }
                  })
                ]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    trigger: "hover",
                    content: "删除",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      type: "error",
                      size: "small",
                      icon: "md-close",
                      disabled: params.row.name === "super_admin"
                    },
                    on: {
                      click: () => {
                        this.delete(params.row);
                      }
                    }
                  })
                ]
              )
            ]);
          }
        }
      ], // 表头列项
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示数量
      /* loading */
      tableLoading: false, // table
      buttonLoading: false, // button
      /* modal弹框 */
      modalShowRole: false, // 是否显示 - role
      modalShowMenu: false, // 是否显示 - menu
      modalDataRole: {
        name: "",
        title: "",
        description: ""
      }, // 数据 - role
      modalDataMenu: {
        menus: []
      }, // 数据 - menu
      modalDataRoleOrg: {}, // 数据 - role行内原始
      menuSelectList: [], // 已选择的menu - 接口数据
      menuSelectedId: [], // tree提交的menu - id
      formModalRule: {
        name: [
          {
            required: true,
            message: "请输入角色标识",
            trigger: "change"
          },
          {
            type: "string",
            max: 30,
            message: "角色标识过长",
            trigger: "change"
          }
        ],
        title: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "change"
          },
          {
            type: "string",
            max: 10,
            message: "角色名称过长",
            trigger: "change"
          }
        ],
        description: [
          {
            type: "string",
            max: 100,
            message: "描述过长",
            trigger: "change"
          }
        ]
      }, // form规则
      modalDataRoleType: "" // 类型：insert/edit
    };
  },
  async created() {
    this.getMenuData();
    this.getData();
  },
  methods: {
    // 获取菜单数据
    async getMenuData() {
      // 未处理的menu数据 -> 功能列表筛选用
      this.menuListNotComputed = (await getAllMenus()).data.data || [];
      // 设置menuList的副本，每次关联时以副本为基准清空已选项
      this.menuListOrg = computedMenuData(this.menuListNotComputed);
      this.menuList = JSON.parse(JSON.stringify(this.menuListOrg));
    },
    // 获取首页数据
    async getData() {
      this.tableLoading = true;
      this.tableDataOrg = (await getRoleList()).data.data;
      this.refreshData();
      this.buttonLoading = false;
      this.tableLoading = false;
    },
    // 根据条件刷新数据
    refreshData() {
      this.tableDataOrg.forEach(role => {
        // 给每个role的menus设置title
        // role.menus.forEach(menu => {
        //   this.$set(
        //     menu,
        //     "title",
        //     getValueByKey(this.menuListNotComputed, "id", menu.id, "title")
        //   );
        // });
      });
      // 分页 & 每页条数
      this.tableData = this.tableDataOrg.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
      // 如果是在删除之后获取的数据 -> 若删掉的是某一页的最后项且页码不是1，则自动获取前一页的数据
      if (this.tableData.length === 0 && this.tableDataOrg.length !== 0) {
        this.pageNum--;
        this.getData();
      }
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.refreshData();
    },
    // 每页条数变化
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.refreshData();
    },
    /* 角色表单操作 */
    // 点击按钮 - 新增
    insert() {
      this.modalDataRoleType = "insert";
      this.$refs.formModalDataRole.resetFields();
      this.modalDataRoleOrg = JSON.parse(JSON.stringify(this.modalDataRole));
      this.modalShowRole = true;
    },
    // 点击按钮 - 编辑
    async edit(row) {
      this.modalDataRoleType = "edit";
      this.roleId = row.id;
      this.modalDataRoleOrg = row;
      this.modalDataRole = JSON.parse(JSON.stringify(row));
      this.modalShowRole = true;
    },
    // 提交表单 - 角色
    handleSubmitRole() {
      // console.log(this.modalDataRole);
      this.$refs.formModalDataRole.validate(async valid => {
        if (valid) {
          this.buttonLoading = true;
          switch (this.modalDataRoleType) {
            case "insert":
              if (
                this.tableDataOrg.some(
                  item => item.name === this.modalDataRole.name
                ) ||
                this.tableDataOrg.some(
                  item => item.title === this.modalDataRole.title
                )
              ) {
                this.$Message.error("角色标识或名称已存在！");
                this.buttonLoading = false;
              } else {
                // 生成角色id，不能与现有的id重复
                var id = "1";
                this.tableDataOrg.forEach(item => {
                  id === item.id && (id = (parseInt(id) + 1).toString());
                });
                this.modalDataRole.id = id;
                this.modalDataRole.menus = [];
                this.modalDataRole.users = [];
                roleList.push(JSON.parse(JSON.stringify(this.modalDataRole)));
                resultCallback(200, "添加成功！", () => {
                  this.getData();
                  this.buttonLoading = false;
                  this.modalShowRole = false;
                });
              }
              break;
            case "edit":
              if (
                (this.tableDataOrg.some(
                  item => item.name === this.modalDataRole.name
                ) &&
                  this.modalDataRole.name !== this.modalDataRoleOrg.name) ||
                (this.tableDataOrg.some(
                  item => item.title === this.modalDataRole.title
                ) &&
                  this.modalDataRole.title !== this.modalDataRoleOrg.title)
              ) {
                this.$Message.error("角色标识或名称已存在！");
                this.buttonLoading = false;
              } else {
                // 1.在角色列表更新
                this.$set(
                  roleList,
                  (this.pageNum - 1) * this.pageSize +
                    this.modalDataRole._index,
                  JSON.parse(JSON.stringify(this.modalDataRole))
                );
                // 2.若修改了角色标识，则还需在用户列表更新
                this.modalDataRole.name !== this.modalDataRoleOrg.name &&
                  userList.forEach(user => {
                    // 判断删除绑定用户：外循环用户列表，内循环用户的角色
                    user.access.forEach((_access, i) => {
                      // 筛选用户_access与modalDataRoleOrg.name相同的用户 ->修改这个用户的相关角色
                      _access === this.modalDataRoleOrg.name &&
                        this.$set(user.access, i, this.modalDataRole.name);
                    });
                  });
                resultCallback(200, "修改成功！", () => {
                  this.getData();
                  this.buttonLoading = false;
                  this.modalShowRole = false;
                });
              }
              break;
          }
        }
      });
    },
    // 点击按钮 - 删除
    delete(row) {
      this.$Modal.confirm({
        title: "已绑定该角色的用户将失去关联，确定删除？",
        onOk: async () => {
          // 1.在角色列表删除
          this.tableDataOrg
            .slice(
              (this.pageNum - 1) * this.pageSize,
              this.pageNum * this.pageSize
            )
            .forEach((list, i) => {
              row.id === list.id && roleList.splice(i, 1);
            });
          // 2.在用户列表更新
          userList.forEach(user => {
            // 判断删除绑定用户：外循环用户列表，内循环用户的角色
            user.access.forEach((_access, i) => {
              // 筛选用户_access与row.name相同的用户 -> 找出包含这个角色的用户并删除用户绑定的该角色
              _access === row.name && user.access.splice(i, 1);
            });
          });
          resultCallback(200, "删除成功！", () => {
            this.getData();
          });
        },
        closable: true
      });
    },
    /* 菜单表单操作 */
    // 点击按钮 - 关联菜单
    async relateMenus(row) {
      this.roleId = row.id;
      this.menuSelectList = JSON.parse(JSON.stringify(row.menus));
      // console.log(this.menuSelectList);
      /* 递归方法：如果有子节点 -> 选中包含id的子节点 */
      const childrenHanding = children => {
        children.forEach(_menu => {
          _menu.children.length === 0 &&
            this.menuSelectList.some(__menu => _menu.id === __menu) &&
            this.$set(_menu, "checked", true);
          // row.name === "super_admin" &&
          //   this.$set(_menu, "disableCheckbox", true); // super_admin所有子节点禁止选择
          childrenHanding(_menu.children);
        });
      };
      // 根据menuSelectList，动态渲染menuList已选中的选项
      this.menuList.length > 0 &&
        this.menuList.forEach(menu => {
          // row.name === "super_admin" &&
          //   this.$set(menu, "disableCheckbox", true); // super_admin所有父节点禁止选择
          if (menu.children.length === 0) {
            // 如果没有子节点 -> 选中包含id的父节点
            this.menuSelectList.some(_menu => menu.id === _menu) &&
              this.$set(menu, "checked", true);
          } else {
            // 如果有子节点 -> *递归方法：选中包含id的子节点*
            childrenHanding(menu.children);
          }
        });
      this.modalShowMenu = true;
    },
    // 提交表单 - 菜单
    async handleSubmitMenu() {
      this.buttonLoading = true;
      /* 1获取所有的tree中被勾选的节点，concat成一个数组（数组对象） */
      let menuSelected = [];
      this.menuList.forEach((menu, i) => {
        let menuRef = "menu" + i;
        menuSelected = menuSelected.concat(
          // 获取选中及半选节点
          this.$refs[menuRef][0].getCheckedAndIndeterminateNodes()
        );
      });
      // console.log(menuSelected);
      /* 2.处理被勾选的节点数组 -> 非mock时保留id / mock时保留id和title */
      this.menuSelected = [];
      menuSelected.forEach(menu => {
        this.menuSelected.push(menu.id);
      });
      // console.log(this.menuSelected);
      /* 3.调用接口 */
      roleList.forEach((row, i) => {
        row.id === this.roleId && this.$set(row, "menus", this.menuSelected);
      });
      resultCallback(200, "修改成功！", () => {
        this.buttonLoading = false;
        this.modalShowMenu = false;
        this.refreshRouteData();
        this.getData();
        // 清空选项
        this.menuList = JSON.parse(JSON.stringify(this.menuListOrg));
      });
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
  .ivu-table-body {
    overflow: hidden;
  }
  .ivu-table {
    th {
      text-align: center;
    }
    td {
      padding: 10px 0;
    }
  }
}
.v-transfer-dom /deep/ {
  .ivu-modal {
    .ivu-form {
      .menu-function,
      .users {
        margin-bottom: 14px;
      }
      .ivu-tree {
        &-children {
          li {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
