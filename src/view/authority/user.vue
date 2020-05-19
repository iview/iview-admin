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
                  prop="name">
          <Input type="text"
                 v-model.trim="modalData.name"></Input>
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
                  prop="access">
          <Select v-model="modalData.access"
                  multiple
                  :max-tag-count="3">
            <Option v-for="(role,i) in roleList"
                    :value="role.name"
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
// mockData
import { userList } from "@/mock/role"; // 用户列表 - 原始数据
// function
import { validateTel } from "@/libs/validate"; // 手机号验证
import {
  getValueByKey, // 根据对象数组某个key的value，查询另一个key的value
  resultCallback // 根据请求的status执行回调函数
} from "@/libs/dataHanding";
// api
import {
  getUserList, // 获取用户列表
  getRoleList // 获取角色列表
} from "@/api/data";

export default {
  data() {
    return {
      /* 全局 */
      roleList: [], // 角色列表 - select用
      /* table */
      tableDataOrg: [], // 原始数据
      tableData: [], // 处理后的当页数据
      tableColumns: [
        {
          title: "账号",
          key: "name",
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
          key: "access",
          align: "center",
          render: (h, params) => {
            return h("div", [
              params.row.access.map(item => {
                return h(
                  "Tag",
                  {
                    props: {
                      color: "blue"
                    }
                  },
                  getValueByKey(this.roleList, "name", item, "title")
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
        name: "",
        displayName: "",
        phone: "",
        access: []
      }, // 数据
      modalDataOrg: {}, // 数据 - 行内原始
      formModalRule: {
        name: [
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
              if (!validateTel(value)) {
                callback(new Error("手机号格式不正确"));
              } else {
                callback();
              }
            }
          }
        ],
        access: [
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
  async created() {
    this.getData();
    this.roleList = (await getRoleList()).data.data || []; // 角色列表下拉select框
  },
  methods: {
    // 获取首页数据
    async getData() {
      this.tableLoading = true;
      this.tableDataOrg = (await getUserList()).data.data || [];
      this.refreshData();
      this.buttonLoading = false;
      this.tableLoading = false;
    },
    // 根据条件刷新数据
    refreshData() {
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
      this.getData();
    },
    // 每页条数变化
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    },
    // 点击按钮 - 新增
    insert() {
      this.modalDataType = "insert";
      this.$refs.formModalData.resetFields();
      this.modalShow = true;
    },
    // 点击按钮 - 编辑
    edit(row) {
      this.modalDataType = "edit";
      this.modalDataOrg = row;
      this.modalData = JSON.parse(JSON.stringify(row));
      this.modalShow = true;
    },
    // 点击表单按钮 - 确定
    handleSubmit() {
      // console.log(this.modalData);
      this.$refs.formModalData.validate(async valid => {
        if (valid) {
          this.buttonLoading = true;
          switch (this.modalDataType) {
            case "insert":
              if (
                this.tableDataOrg.some(
                  item => item.name === this.modalData.name
                )
              ) {
                // 判断重复
                this.$Message.error("该账号已存在！");
                this.buttonLoading = false;
              } else {
                // 生成user_id，不能与现有的user_id重复
                var user_id = "1";
                this.tableDataOrg.forEach(item => {
                  if (user_id === item.user_id) {
                    user_id = (parseInt(user_id) + 1).toString();
                  }
                });
                this.modalData.user_id = user_id;
                userList.push(JSON.parse(JSON.stringify(this.modalData)));
                resultCallback(200, "添加成功！", () => {
                  this.getData();
                  this.buttonLoading = false;
                  this.modalShow = false;
                });
              }
              break;
            case "edit":
              if (
                this.tableDataOrg.some(
                  item => item.name === this.modalData.name
                ) &&
                this.modalData.name !== this.modalDataOrg.name
              ) {
                // 判断重复
                this.$Message.error("该账号已存在！");
                this.buttonLoading = false;
              } else {
                this.$set(
                  userList,
                  (this.pageNum - 1) * this.pageSize + this.modalData._index,
                  JSON.parse(JSON.stringify(this.modalData))
                );
                resultCallback(200, "修改成功！", () => {
                  this.getData();
                  this.buttonLoading = false;
                  this.modalShow = false;
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
        title: "确定删除该用户？",
        onOk: async () => {
          this.tableDataOrg
            .slice(
              (this.pageNum - 1) * this.pageSize,
              this.pageNum * this.pageSize
            )
            .forEach((item, i) => {
              if (row.user_id === item.user_id) {
                userList.splice((this.pageNum - 1) * this.pageSize + i, 1);
              }
            });
          resultCallback(200, "删除成功！", () => {
            this.getData();
          });
        },
        closable: true
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
