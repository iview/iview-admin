<template>
  <div class="dooya-container">
    <Card>
      <!-- 操作 -->
      <div style="margin: 10px 0">
        <Button type="success"
                icon="md-add"
                @click="insert">新增用户</Button>
      </div>

      <!-- 表格 -->
      <Table :data="tableData"
             :loading="tableLoading"
             :columns="tableColumns"
             stripe>
      </Table>

      <!-- 分页 -->
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

    <!-- Modal -->
    <Modal v-model="modalShow"
           :mask-closable="false"
           :closable="false"
           footer-hide
           title="账号详情"
           @on-ok="handleSubmit">
      <Form ref="formModalData"
            :model="modalData"
            :rules="formModalRule"
            :label-width="100"
            @submit.native.prevent>
        <FormItem label="账号："
                  prop="userName">
          <Input type="text"
                 v-model.trim="modalData.userName"></Input>
          <!-- :disabled="roles[0]==='workshop_manager' && modalData.roles==='workshop_manager'" -->
        </FormItem>
        <FormItem label="姓名："
                  prop="displayName">
          <Input type="text"
                 v-model.trim="modalData.displayName"></Input>
        </FormItem>
        <FormItem label="手机号："
                  prop="phone"
                  class="phone">
          <Input type="text"
                 v-model.trim="modalData.phone"></Input>
        </FormItem>
        <FormItem label="角色："
                  prop="roles">
          <Select v-model="modalData.roles"
                  multiple
                  :max-tag-count="3">
            <Option v-for="(role,i) in roleList"
                    :value="role.id"
                    :key="i">
              {{ role.title }}
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="handleSubmit('formModalData')"
                  :loading="buttonLoading">确定</Button>
          <Button @click="modalShow=false"
                  style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
// vuex
import { mapGetters } from "vuex";
import {
  userList, // 用户列表
  roleList // 角色列表
} from "@/mock/role";
// } from "./mockData/role";
// function
import { validateTel } from "@/libs/validate"; // 手机号验证
import {
  arraySort, // 对象数组根据key排序
  getValueByKey, // 根据对象数组某个key的value，查询另一个key的value
  resultCallback // 根据请求的status执行回调函数
} from "@/libs/dataHanding";
// api
// import {
//   getUserList,
//   insertUser,
//   updateUser,
//   deleteUser,
//   lockUser
// } from "@/api/user/index"; // 用户增删改查
// import { getRoles } from "@/api/role/index"; // 查询角色的下级角色

export default {
  data() {
    return {
      /* 全局 */
      roleList: [], // 全部角色列表 - select用
      /* table */
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      tableColumns: [
        {
          title: "账号",
          key: "userName",
          align: "center",
          minWidth: 120
        },
        {
          title: "姓名",
          key: "displayName",
          align: "center",
          minWidth: 120
        },
        {
          title: "电话",
          key: "phone",
          align: "center",
          minWidth: 120
        },
        {
          title: "角色",
          key: "roles",
          align: "center",
          render: (h, params) => {
            return h("div", [
              params.row.roles.map(item => {
                return h(
                  "Tag",
                  {
                    props: {
                      color: "blue"
                    }
                  },
                  !this.isMock
                    ? item.title
                    : getValueByKey(this.roleList, "id", item.id, "title")
                );
              })
            ]);
          },
          minWidth: 120
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          minWidth: 180,
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
                    content: params.row.lockFlag === 0 ? "锁定" : "解锁",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      type: "warning",
                      size: "small",
                      icon:
                        params.row.lockFlag === 0
                          ? "ios-key-outline"
                          : "ios-key"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.lock(params.row);
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
                      icon: "md-close"
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
      total: 0, // 总数
      pageNum: 1, // 页码
      pageSize: 10, // 每页显示数量
      /* loading */
      tableLoading: false, // table
      buttonLoading: false, // button
      /* modal */
      modalShow: false, // 是否显示
      modalDataType: "", // 类型 - insert or edit
      modalData: {
        userName: "",
        displayName: "",
        phone: "",
        roles: [],
        lockFlag: 0
      }, // 数据
      modalDataOrg: {}, // 数据 - 行内原始
      formModalRule: {
        userName: [
          {
            required: true,
            message: "请输入账户名",
            trigger: "change"
          },
          { type: "string", max: 20, message: "账户名过长", trigger: "change" }
        ],
        displayName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "change"
          },
          { type: "string", max: 10, message: "姓名过长", trigger: "change" }
        ],
        phone: [
          {
            required: true,
            trigger: "change",
            validator: function(rule, value, callback) {
              if (!validateTel(value) && value !== undefined && value !== "") {
                callback(new Error("手机号格式不正确"));
              } else {
                callback();
              }
            }
          }
        ],
        roles: [
          {
            required: true,
            validator: function(rule, value, callback) {
              if (value.length === 0) {
                callback(new Error("请选择用户角色"));
              } else {
                callback();
              }
            },
            message: "请选择用户角色",
            trigger: "change"
          }
        ]
      } // form规则
    };
  },
  computed: {
    ...mapGetters(["userAccess", "userName"])
  },
  async created() {
    this.getData();
    // this.getSubList();
  },
  methods: {
    // 获取首页数据
    async getData() {
      // if (!this.isMock) {
      // 接口数据
      // this.tableLoading = true;
      // this.tableDataOrg = (await getUserList()).data.data || [];
      // this.refreshData();
      // this.buttonLoading = false;
      // this.tableLoading = false;
      // } else {
      // mock数据
      this.tableDataOrg = userList;
      this.refreshData();
      this.buttonLoading = false;
      // }
    },
    // 当前角色的可选角色列表
    async getSubList() {
      // 接口 or mock 数据
      const roleSubList = !this.isMock
        ? (await getRoles()).data.data || []
        : roleList;
      // 当前用户的角色(按name值和接口数据比对去重) + 接口数据
      this.roleList = this.userAccess
        .filter(role => {
          return roleSubList.every(_role => _role.name !== role.name);
        })
        .concat(roleSubList);
    },
    // 根据条件刷新数据
    refreshData() {
      // 按"userName"升序
      this.isMock && this.tableDataOrg.sort(arraySort("userName", "asc"));
      // 分页 & 每页条数
      this.tableData = this.tableDataOrg.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
      // 如果是在删除之后获取的数据 -> 若删掉的是某一页的最后项且页码不是1，则自动获取前一页的数据
      if (this.tableData.length === 0 && this.tableDataOrg.length !== 0) {
        this.pageNum--;
        this.refreshData();
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
    // 点击按钮 - 新增
    insert() {
      this.modalDataType = "insert";
      this.$refs.formModalData.resetFields();
      this.modalShow = true;
    },
    // 点击按钮 - 编辑
    async edit(row) {
      this.modalDataType = "edit";
      this.modalDataOrg = row;
      this.modalData = JSON.parse(JSON.stringify(row));
      const roles = [];
      this.modalDataOrg.roles.forEach(role => {
        roles.push(role.id);
      });
      this.modalData.roles = roles;
      this.modalShow = true;
    },
    // 点击表单按钮 - 确定
    handleSubmit() {
      // console.log(this.modalData);
      this.$refs.formModalData.validate(async valid => {
        if (valid) {
          this.buttonLoading = true;
          // 处理roles的格式，赋给新对象
          const modalData = JSON.parse(JSON.stringify(this.modalData));
          const roles = [];
          this.modalData.roles.forEach(role => {
            roles.push({ id: role });
          });
          modalData.roles = roles;
          // console.log(modalData);
          switch (this.modalDataType) {
            case "insert":
              if (!this.isMock) {
                /* 接口数据 */
                this.modalData.phone === undefined &&
                  (this.modalData.phone = "");
                const result = (await insertUser(modalData)).data.status;
                resultCallback(
                  result,
                  "添加成功！",
                  () => {
                    this.modalShow = false;
                    this.getData();
                  },
                  () => {
                    this.buttonLoading = false;
                  }
                );
              } else {
                /* mock数据 */
                if (
                  this.tableDataOrg.some(
                    item => item.userName === this.modalData.userName
                  )
                ) {
                  // 判断重复
                  this.$Message.error("该账号已存在！");
                  this.buttonLoading = false;
                } else {
                  // 随机生成sop的id
                  modalData.id = Math.random()
                    .toString(36)
                    .substr(-10);
                  this.tableDataOrg.push(JSON.parse(JSON.stringify(modalData)));
                  resultCallback(200, "添加成功！", () => {
                    this.refreshData();
                    this.buttonLoading = false;
                    this.modalShow = false;
                  });
                }
              }
              break;
            case "edit":
              if (!this.isMock) {
                /* 接口数据 */
                const result = (await updateUser(modalData)).data.status;
                resultCallback(
                  result,
                  "修改成功！",
                  () => {
                    this.modalShow = false;
                    this.getData();
                  },
                  () => {
                    this.buttonLoading = false;
                  }
                );
              } else {
                /* mock数据 */
                if (
                  this.tableDataOrg.some(
                    item => item.userName === this.modalData.userName
                  ) &&
                  this.modalData.userName !== this.modalDataOrg.userName
                ) {
                  // 判断重复
                  this.$Message.error("该账号已存在！");
                  this.buttonLoading = false;
                } else {
                  // 1.在用户列表更新
                  this.$set(
                    this.tableDataOrg,
                    (this.pageNum - 1) * this.pageSize + this.modalData._index,
                    JSON.parse(JSON.stringify(modalData))
                  );
                  // console.log(this.roleList);
                  // console.log(modalData.roles, modalData.id);
                  // 2.在角色列表更新
                  this.roleList.forEach(role => {
                    // 判断新增绑定角色：外循环角色列表，内循环要更新的角色列表
                    modalData.roles.forEach(_role => {
                      // 筛选二者id相同的角色
                      if (role.id === _role.id) {
                        // console.log(role);
                        // 若这些角色的用户不含modalData.id，则给该角色的用户里添加该用户
                        !role.users.some(user => user.id === modalData.id) &&
                          role.users.push({
                            id: modalData.id,
                            displayName: getValueByKey(
                              this.tableDataOrg,
                              "id",
                              modalData.id,
                              "displayName"
                            )
                          });
                      }
                    });
                    // 判断删除绑定角色：外循环角色列表，内循环角色的用户
                    role.users.forEach((user, i) => {
                      // 筛选用户id与modalData.id相同的用户 -> 找出包含这个用户的角色
                      if (user.id === modalData.id) {
                        // console.log(role);
                        // 若要执行的更新列表里不含上述角色的id，则删除该id对应角色的该用户
                        !modalData.roles.some(_role => role.id === _role.id) &&
                          role.users.splice(i, 1);
                      }
                    });
                  });
                  // 3.回调函数
                  resultCallback(200, "修改成功！", () => {
                    this.refreshData();
                    this.getSubList();
                    this.buttonLoading = false;
                    this.modalShow = false;
                  });
                }
              }
              break;
          }
        }
      });
    },
    // 点击按钮 - 锁定/解锁
    async lock(row) {
      row.lockFlag = row.lockFlag === 0 ? 1 : 0;
      if (!this.isMock) {
        /* 接口数据 */
        const result = (await lockUser(row)).data.status;
        resultCallback(
          result,
          row.lockFlag === 1 ? "锁定成功！" : "解锁成功！",
          () => {
            this.getData();
          }
        );
      } else {
        /* mock数据 */
        this.$set(
          this.tableDataOrg,
          (this.pageNum - 1) * this.pageSize + row._index,
          JSON.parse(JSON.stringify(row))
        );
        this.$Message.success(row.lockFlag === 1 ? "锁定成功！" : "解锁成功！");
      }
    },
    // 点击按钮 - 删除
    delete(row) {
      this.$Modal.confirm({
        title: "确定删除该用户？",
        onOk: async () => {
          if (!this.isMock) {
            // 非mock时
            const result = (await deleteUser(row.id)).data.status;
            resultCallback(result, "删除成功！", () => {
              this.getData();
            });
          } else {
            // mock时
            this.tableDataOrg
              .slice(
                (this.pageNum - 1) * this.pageSize,
                this.pageNum * this.pageSize
              )
              .forEach((item, i) => {
                row.id === item.id &&
                  this.tableDataOrg.splice(
                    (this.pageNum - 1) * this.pageSize + i,
                    1
                  );
              });
            resultCallback(200, "删除成功！", () => {
              this.refreshData();
            });
          }
        },
        closable: true
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.v-transfer-dom /deep/ {
  .ivu-modal {
    .ivu-form {
      .phone {
        label::before {
          content: "";
        }
      }
    }
  }
}
</style>
