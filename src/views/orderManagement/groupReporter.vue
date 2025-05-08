<template>
  <div>
    <div class="workStatics addGroup">
      <div style="width: 100%;display:flex;" class="orgTree">
        <!-- -->
        <div class="el-trees">
          <div class="searchDepartMent">
            <!-- 组织架构 -->
            <el-button
              type="primary"
              style="width:100%;"
              @click="addGroup(null)"
              icon="el-icon-plus"
              v-if="hasPerm('B006008000001')"
              slot="reference"
            >添加分组</el-button>
          </div>
          <el-tree
            :data="companies"
            :props="defaultProps"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            style="background-color:#fff;"
            :style="'height:'+height+'px;overflow-y:scroll;'"
            :render-content="renderContent"
          ></el-tree>
        </div>

        <div class="el-tables" v-show="!isAddPersonPage">
          <el-form
            :inline="true"
            :model="paramForm"
            label-width="80px"
            ref="paramForm"
            class="commen-form"
            label-position="left"
          >
            <el-form-item
              label="分组"
              prop="groupId"
              :rules="[{ required: true, message: '请选择分组', trigger: 'blur' }]"
            >
              <!-- <el-select
                v-model="paramForm.groupId"
                filterable
                :filter-method="pinyingMatch"
                @change="getList"
                placeholder="请选择分组"
              >
                <el-option
                  :key="item.id"
                  v-for="(item,k) in allRroups"
                  :label="item.groupName"
                  :value="item.id"
                ></el-option>
              </el-select>-->
              <pinyin-select
                :selectList="allRroups"
                labelName="groupName"
                lableId="id"
                :value="paramForm.groupId"
                :selectChange.sync="paramForm.groupId"
              ></pinyin-select>
            </el-form-item>
            <el-form-item class="commen-no-bg">
              <el-button
                type="primary"
                icon="el-icon-search"
                class="ml_20"
                @click="getList(null)"
              >查询</el-button>
              <el-button class="ml_20" icon="el-icon-refresh" @click="getList('clear')">重置</el-button>
            </el-form-item>
            <el-form-item style="float:right;">
              <el-button
                type="primary"
                class="ml_20"
                &#x60;
                icon="el-icon-plus"
                v-if="hasPerm('B006008000002')"
                @click="addPerson('')"
              >添加工人</el-button>
            </el-form-item>
          </el-form>
          <div style="margin-bottom:10px;font-weight:700;">
            <span
              class="procedure-enterprise public02"
              v-if="acctName && paramForm.groupId"
            >组报人：{{acctName}}</span>
          </div>
          <el-table
            :data="list"
            class="commen-form"
            style="margin-bottom:20px;"
            v-loading="loading"
          >
            <el-table-column prop="acctName" label="姓名" align="center">
              <template slot-scope="scope">
                <!--  -->
                <!-- <el-select v-if="!scope.row.id" v-model="scope.row.acctNo" placeholder="请选择" filterable class="input1"
                  @change="getAcctName(scope.$index,scope.row.acctNo)" clearable>
                  <el-option v-for="(item,id) in workOptions" :key="id" :label="item.employeeName"
                    :value="item.employeeNo" />
                </el-select>-->
                <pinyin-select
                  v-if="!scope.row.id"
                  type="getName"
                  :selectList="workOptions"
                  labelName="employeeName"
                  lableId="employeeNo"
                  :value="scope.row.acctNo"
                  @valChange="getAcctName"
                  :selectChange.sync="scope.row.acctNo"
                  :index="scope.$index"
                ></pinyin-select>
                <span v-else>{{scope.row.acctName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="acctNo" label="工号" align="center"></el-table-column>
            <el-table-column prop="allocCount" label="合工/占比" align="center">
              <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.acctName" class="input1" /> -->
                <el-input v-if="!scope.row.id" v-model="scope.row.percentage" placeholder="请输入"/>
                <span v-else>{{scope.row.percentage}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="300px" align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  v-if="scope.row.id"
                  @click="deleteStaff(scope.row.id)"
                >
                  <i class="el-icon-delete"></i>删除
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="scope.row.id"
                  @click="changeCount(scope.row)"
                >
                  <i class="el-icon-edit"></i>修改占比
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="!scope.row.id"
                  @click="addStaff(scope.row)"
                >
                  <i class="el-icon-success"></i>保存
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="!scope.row.id"
                  @click="deleteStaff2(scope.$index)"
                >
                  <i class="el-icon-success"></i>取消
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--分页开始-->
          <el-pagination
            background
            layout="prev, pager,next,  sizes, slot"
            :total="total"
            :current-page="pages.page_num"
            :page-size="pages.page_size"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
            <span class="product-total">共{{ total }}条</span>
          </el-pagination>
          <!--分页结束-->
        </div>
      </div>
      <el-dialog
        :title="groupForm.id?'编辑分组':'添加分组'
        "
        :visible.sync="editDialogVisible"
        width="500px"
        @closed="closeladdGroup()"
      >
        <el-form
          :model="groupForm"
          :rules="groupRules"
          ref="groupForm"
          label-width="120px"
          class="demo-ruleForm commenForm"
          style="text-align:left;margin:0 auto;"
        >
          <el-form-item label="工作车间名称：" prop="workShopName">
            <el-select v-model="groupForm.workShopName" :disabled="groupForm.id" placeholder="请选择">
              <el-option v-for="item in workShopSelect" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分组名称：" prop="groupName">
            <el-input v-model="groupForm.groupName"/>
          </el-form-item>
          <el-form-item label="组报人：">
            <!-- <el-input v-model="o.groupRepName" class="input" /> -->
            <el-select
              v-model="groupForm.groupRepNo"
              placeholder="请选择"
              filterable
              clearable
              class="input1"
              @change="getAcctName2()"
            >
              <el-option
                v-for="item in workOptions"
                :key="item.id"
                :label="item.employeeName"
                :value="item.employeeNo"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="submitgroupForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  // import personnel from "@/components/commen/personnel.vue";
  // import addStaffPage from "./children/addStaff.vue";
  import {
    proc_group_list,
    update_group,
    group_list,
    delete_group,
    group_page_list,
    group_delete,
    group_add,
    add_group,
    work_shop_list,
    group_dtl_update
  } from '@/api/groupReporter'
  import { get_all_workers } from '@/api/common'
  import pinyinSelect from '@/components/pinyinSelect.vue'
  export default {
    name: 'adminSystemList',
    components: { pinyinSelect },
    data() {
      return {
        workOptions: [],
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        acctName: null,
        paramForm: {},
        total: 0,
        avatarShow: false,
        url: '',
        isAddOrEditStaff: true, //添加或者编辑成员
        isAddPersonPage: false, //是否添加人员页面
        showStaff: false,
        params: {},
        searchFilter: {},
        titleInfo: {},
        editDialogVisible: false, //添加修改分组名称弹框
        groupForm: {
          //添加修改分组名称
        },
        allRroups: [],
        editDialogCompany: false, //添加公司弹框
        companyForm: {}, //添加公司对象
        includedLeaved: false,
        loading: false,
        serach: '',
        modelDep: '',
        modelType: '',
        releaseTime: '',
        workShopSelect: null,
        zPagerShow: true,
        adminForm: {
          file: '',
          department: '',
          system: ''
        },
        list: [],
        defaultProps: {
          children: 'groupList',
          label: 'groupName'
        },
        companies: [],
        groupRules: {
          groupName: [
            { required: true, message: '请输入分组名称', trigger: 'blur' }
          ]
        },
        companyRules: {
          name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
          order: [
            {
              required: true,
              message: '请输入公司序号',
              trigger: ['change', 'blur']
            }
          ]
        },
        positionRules: {
          name: [{ required: true, message: '请输入职务名称', trigger: 'blur' }],
          level: [
            {
              required: true,
              message: '请输入职务级别',
              trigger: ['change', 'blur']
            }
          ]
        },
        height: document.documentElement.clientHeight - 160
      }
    },
    methods: {
      changeCount(item) {
        //修改占比
        this.$prompt('请输入合工/占比', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(async ({ value }) => {
            if (!value) {
              this.$message.error('请填写占比')
              return
            }
            var res = await group_dtl_update({
              params: {
                id: item.id,
                percentage: value - 0
              }
            })
            this.getList()
          })
          .catch(() => {})
      },
      deleteStaff2(index) {
        this.list.splice(index, 1)
      },
      async addStaff(item) {
        var reg = /^(\+)?\d+(\.\d+)?$/
        if (!reg.test(item.percentage)) {
          this.$message.error('合工比例为正数')
          return
        }
        var result = await group_add({
          params: {
            groupId: this.paramForm.groupId,
            acctNo: item.acctNo,
            acctName: item.acctName,
            percentage: item.percentage
          }
        })
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getList()
      },
      getAcctName2(index) {
        if (!this.groupForm.groupRepNo) {
          return
        }
        this.groupForm.groupRepName = this.workOptions.filter(item => {
          return item.employeeNo == this.groupForm.groupRepNo
        })[0].employeeName
      },
      getAcctName(json) {
        var index = json.index

        this.list[index].acctNo = json.val
        if (!this.list[index].acctNo) {
          return
        }
        this.list[index].acctName = this.workOptions.filter(item => {
          return item.employeeNo == this.list[index].acctNo
        })[0].employeeName
        this.$forceUpdate()
      },
      async get_all_workers() {
        // 获取员工信息
        const res = await get_all_workers()
        if (res.data) {
          this.workOptions = res.data
        }
      },
      async addPerson() {
        let valid = await this.$refs['paramForm'].validate()
        if (!valid) {
          return
        }
        this.list.unshift({
          isEdit: true
        })
      },
      handleCurrentChange(val) {
        // 点击页码切换数据
        this.pages.page_num = val
        this.getList()
      },
      handleSizeChange(val) {
        // 点击页码切换数据
        this.pages.page_size = val
        this.getList()
      },
      renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
          <span>{node.label}</span>
          </span>
          <span style="float:right;margin-right:20px;">
          <el-popover
        placement="right"
        width="200"
        popper-class="el-popover22"
        trigger="hover"
        style={
            node.data.groupList && node.data.groupList.length > 0
            ? 'display:none'
            : ''
          }
          >
          <p
      class="showDetailDepartment"
        on-click={() => this.handleEditGroup(node.data, data)}
      >
        修改分组名称
        </p>

        <p
      class="showDetailDepartment"
        on-click={() => this.handleDeleteGroup(node.data.id, data)}
      >
        删除
        </p>
        <i class="el-icon-more" slot="reference" />
          </el-popover>
          </span>
          </span>
      )
      },
      async deleteStaff(id) {
        const delType = await this.$confirm(
          '确定删除该条信息?是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)
        if (delType == 'confirm') {
          var result = await group_delete({ params: id })
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getList()
        }
      },
      async handleDeleteGroup(id) {
        //删除部门
        var confirm = await this.$confirm('确认删除此分组？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
        if (confirm == 'confirm') {
          var result = await delete_group({ params: id })
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDepart()
        }
      },
      async submitgroupForm() {
        //提交添加或者编辑分组
        let valid = await this.$refs['groupForm'].validate()
        if (valid) {
          var result = null
          if (this.groupForm.id) {
            result = await update_group({
              params: {
                groupName: this.groupForm.groupName,
                groupId: this.groupForm.id,
                groupRepName: this.groupForm.groupRepName,
                groupRepNo: this.groupForm.groupRepNo
              }
            })
          } else {
            result = await add_group({
              params: {
                groupName: this.groupForm.groupName,
                workShopName: this.groupForm.workShopName,
                groupRepName: this.groupForm.groupRepName,
                groupRepNo: this.groupForm.groupRepNo
              }
            })
          }
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getDepart()
          this.getDepartSelect()
          this.editDialogVisible = false
        } else {
          console.log('error submit!!')
        }
      },
      async getDepartSelect() {
        //获取添加分组的时候的下拉框
        let result1 = await work_shop_list()
        this.workShopSelect = result1.data
        //获取分组的时候的下拉框
        let result2 = await proc_group_list()

        this.allRroups = result2.data
      },
      async getDepart() {
        let result = await group_list()
        this.companies = result.data
        this.companies.forEach(item => {
          item.groupName = item.workShopName
        })
      },
      addGroup(isParentId, obj, isAddSon) {
        //isParentId是父级部门

        this.editDialogVisible = true
        this.$nextTick(() => {
          this.$forceUpdate()
        })
      },
      closeladdGroup() {
        this.groupForm = {}
        this.$refs['groupForm'] && this.$refs['groupForm'].resetFields()
      },
      handleNodeClick(data) {
        this.zPagerShow = false
        this.titleInfo = JSON.parse(JSON.stringify(data))
        this.pages.page_num = 1
        if (data.id) {
          // this.paramForm.groupId = data.id
          this.$set(this.paramForm, 'groupId', data.id)
          this.getList()
        }
      },
      async getList(str) {
        let valid = await this.$refs['paramForm'].validate()
        if (!valid) {
          return
        }
        this.loading = true
        try {
          if (str == 'clear') {
            this.$refs['paramForm'].clearValidate()
            this.$set(this.paramForm, 'groupId', null)
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
            return
          }
          var jsons = this.allRroups.filter(item2 => {
            return item2.id == this.paramForm.groupId
          })[0]
          this.acctName = jsons.groupRepName //填充组报人
          const res = await group_page_list({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size
            },
            params: this.paramForm
          })
          this.total = res.page.total_num - 0
          this.list = res.data
          this.loading = false
        } finally {
          this.loading = false
        }
      },

      handleEditGroup(item) {
        this.editDialogVisible = true
        this.groupForm = JSON.parse(JSON.stringify(item))
      }
    },
    mounted() {},
    created() {
      this.get_all_workers() //获取所有员工
      this.getDepart() //获取公司及部门
      this.getDepartSelect()
      window.onresize = () => {
        return (() => {
          this.height = document.documentElement.clientHeight - 200
        })()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .oprateaddGroup {
    // background-color: #eef2ff;
    padding: 10px;
  }

  .addGroup {
    .editpart {
      float: right;
      font-size: 13px;
      color: #556490;
    }
  }
</style>

<style lang="scss">
  .el-autocomplete-suggestion.el-popper.is-loading {
    display: none;
  }

  .el-popover22 {
    padding: 1px 0 !important;
  }

  .showDetailDepartment {
    margin: 0;
    padding: 5px 15px;
    cursor: pointer;

    &:hover {
      background-color: #ecf5ff;
    }
  }

  .searchDepartMent {
    margin-bottom: 20px;
    margin-left: 6px;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    // align-items: center;
    // text-align:left;
    justify-content: space-between;

    .el-input {
      width: calc(100% - 3rem) !important;
    }

    #searchIpt {
      width: 100% !important;
    }

    i.el-icon-plus {
      font-size: 16px;
      cursor: pointer;
    }
  }

  .searchIpt {
    margin-bottom: 20px;
  }

  .orgTree {
    background-color: #f6f8fa;

    > div {
      border-radius: 10px;
    }

    .el-trees {
      width: 220px;
      font-size: 13px;
      background-color: #fff;
      padding: 20px 10px;
    }

    .el-tables {
      width: calc(100% - 250px);
      margin-left: 30px;
      padding: 20px;
      background-color: #fff;

      > div:first-child {
        padding: 10px;
        font-size: 16px;
      }
    }
  }

  .workStatics {
    //   padding: 20px;
    background-color: #f2f2f2;

    .el-tree-node > .el-tree-node__content {
      font-size: 16px;
      font-weight: 700;
      color: #000;
    }

    .el-tree-node
    > .el-tree-node__children
    .el-tree-node
    > .el-tree-node__content {
      font-size: 14px;
      font-weight: 400;
      color: #666;
    }

    .el-tree-node__content {
      position: relative;

      .el-icon-more {
        position: absolute;
        right: 5px;
        top: 5px;
        display: none;
        transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        /* IE 9 */
        -moz-transform: rotate(90deg);
        /* Firefox */
        -webkit-transform: rotate(90deg);
        /* Safari 和 Chrome */
        -o-transform: rotate(90deg);
        /* Opera */
      }
    }

    // .el-tree-node__content:hover {
    //   background-color: #fff6f7;
    // }
    .el-tree-node__content:hover .el-icon-more {
      display: inline-block;
    }
  }

  .workStatics .el-date-editor .el-range__icon,
  .workStatics .el-date-editor .el-range-separator {
    line-height: 26px;
  }

  .workStatics .el-input--suffix .el-input__inner {
    // width: 208px !important;
  }

  .workStatics .el-col {
    text-align: center;
  }

  .workStatics .el-card__body {
    padding: 20px 60px;
    overflow: hidden;
  }

  .workStatics .el-col:last-child {
    text-align: right;
  }

  .workStatics .chart {
    height: 450px;
    padding: 20px 0;
  }

  .workStatics .el-icon-upload:before {
    content: '' !important;
    /* background: url(../../assets/customer/customer-08.png) no-repeat 0px 0px; */
    display: inline-block;
    width: 14px;
    height: 14px;
  }

  .workStatics .el-input--suffix .el-input__inner {
    height: 34px;
  }

  .workStatics .el-table {
    font-size: 14px;
    color: #333;
    /* margin-top: 20px; */
  }

  .workStatics .el-table .is-leaf {
    color: #333;
    background: #e8eaef;
    font-size: 14px;
    font-weight: bold;
    height: 40px;
    line-height: 40px;
    padding: 0;
  }

  .workStatics .column-color {
    color: #556490;
  }

  .workStatics .type-color {
    font-size: 26px;
    color: #d3d2d2;
    font-weight: bold;
  }

  .workStatics .el-dialog__footer {
    text-align: center;
  }

  .workStatics .el-upload-list {
    float: left;
  }

  @media screen and (min-width: 1366px) and (max-width: 1920px) {
    .workStatics .el-card__body {
      padding: 20px;
    }

    .workStatics .admin-serach {
      width: 210px;
    }

    .admin-option {
      margin: 0 12px !important;
    }

    .admin-serach {
      margin-left: 15px;
    }
  }
</style>
