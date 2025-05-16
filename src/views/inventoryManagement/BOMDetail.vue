<!--bom工序详情  -->
<template>
  <div class="app-container">
    <el-form :model="titleForm" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="图纸号" class="condition">
        <el-input v-model="titleForm.bomNo" clearable :disabled="true"/>
      </el-form-item>
      <el-form-item label="累计定额工时" class="condition">
        <el-input
          v-model="titleForm.totalHoursFixed"
          style="width:80px"
          clearable
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="累计加工工时" class="condition">
        <el-input style="width:80px" v-model="titleForm.totalHoursWork" clearable :disabled="true"/>
      </el-form-item>
    </el-form>

    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container commen-form">
          <el-input
            v-model="filterItemName"
            placeholder="请输入产品名称"
            clearable
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px;"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="itemTreeData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-row class="mb8">
          <el-button type="primary" class="commen-button" @click="handleAdd">新增</el-button>
        </el-row>
        <el-table :data="pageList" class="commen-table mt_20">
          <el-table-column label="序号" align="center" prop="seqNo"/>
          <el-table-column label="工序名称" align="center" prop="procedureName"/>
          <el-table-column label="工序编码" align="center" prop="procedureCode"/>
          <el-table-column label="定额工时" align="center" prop="hoursFixed"/>
          <el-table-column label="加工工时" align="center" prop="hoursWork"/>
          <el-table-column label="设备编号" align="center" prop="deviceNo"/>
          <el-table-column label="设备名称" align="center" prop="deviceName"/>
          <el-table-column label="车间" align="center" prop="deptIdDesc"/>
          <el-table-column label="创建时间" align="center" prop="createdTime"/>
          <el-table-column
            label="操作"
            align="center"
            width="310"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <!-- 确认后不能编辑和删除 -->
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          style="text-align: right"
          v-show="pageTotal>0"
          :total="pageTotal"
          :page.sync="queryParams.page.page_num"
          :limit.sync="queryParams.page.page_size"
          @pagination="getData"
        />
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="dialogShow" width="960px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="itemNo" label="产品编码">
              <el-input v-model="form.itemNo" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemName" label="产品名称">
              <el-input v-model="form.itemName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="procedureName" label="工序名称">
              <el-input v-model="form.procedureName"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item prop="procedureCode" label="工序编码">
              <el-input v-model="form.procedureCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="seqNo" label="序号">
              <el-input-number v-model="form.seqNo" :precision="0" :controls="false" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="hoursFixed" label="定额工时">
              <el-input-number v-model="form.hoursFixed" :precision="3" :controls="false" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="hoursWork" label="加工工时">
              <el-input-number v-model="form.hoursWork" :precision="3" :controls="false" :min="0"/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <workShop :bindId.sync="form.deptId" :required-dept="true"/>
          </el-col>

          <el-col :span="8">
            <el-form-item prop="deviceId" label="设备">
              <deviceSelected :bind-id.sync="form.deviceId"/>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { itemUsedTree } from '@/api/item/mesItemUsed'
import {
  addProcedure,
  deleteProcedure,
  detailProcedure,
  procedureHeader,
  procedurePageList,
  updateProcedure
} from '@/api/item/mesProcedure'

export default {
  components: {
    DateIntervals: () => import('@/components/DateIntervals'),
    Pagination: () => import('@/components/Pagination'),
    WorkShop: () => import('@/components/Dept/workShop'),
    deviceSelected: () => import('@/components/Device/deviceSelected')
  },
  watch: {
    // 根据设备分类名称筛选分类树
    filterItemName(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      titleForm: {},
      filterItemName: '',
      queryParams: {
        params: {},
        page: {
          page_num: 1,
          page_size: 10
        }
      },
      itemTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'itemName',
        value: 'itemNo'
      },
      form: {},
      pageTotal: 0,
      pageList: {},
      title: '',
      dialogShow: false,
      rules: {
        procedureName: [
          { required: true, message: '请输入工序名称', trigger: 'blur' }
        ],
        procedureCode: [
          { required: true, message: '请输入工序编码', trigger: 'blur' }
        ],
        seqNo: [{ required: true, message: '请输入工序序号', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择车间', trigger: 'blur' }],
        deviceId: [{ required: true, message: '请选择设备', trigger: 'blur' }],
        itemNo: [{ required: true, message: '请选择产品', trigger: 'blur' }],
        hoursFixed: [
          { required: true, message: '请输入定额工时', trigger: 'blur' }
        ],
        hoursWork: [
          { required: true, message: '请输入加工工时', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$set(this.queryParams.params, 'itemNo', this.$route.query.itemNo)
    this.$set(this.form, 'itemNo', this.$route.query.itemNo)
    this.$set(this.form, 'itemName', this.$route.query.itemName)

    this.getItemTree()
    this.getData()
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.page_num = 1
      this.getData()
    },
    beforeClose() {
      this.form = {
        itemNo: this.$route.query.itemNo,
        itemName: this.$route.query.itemName
      }
      this.$refs['form'].clearValidate()
    },
    /** 重置操作表单 */
    handleReset() {
      this.queryParams = {
        page: {
          page_num: 1,
          page_size: 10
        },
        params: {
          itemNo: this.$route.query.itemNo
        }
      }
      this.getData()
    },
    getData() {
      procedurePageList(this.queryParams).then(res => {
        this.pageList = res.data
        this.pageTotal = Number(res.page.total_num)
      })
      procedureHeader(this.queryParams).then(res => {
        this.titleForm = res.data || {}
      })
    },
    handleAdd() {
      this.title = '新增'
      this.dialogShow = true
    },
    handleUpdate(row) {
      detailProcedure({
        params: {
          id: row.id
        }
      }).then(res => {
        this.form = res.data
        this.dialogShow = true
      })

      this.title = '编辑'
    },
    handleDelete(row) {
      this.$confirm('确认要删除数据吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteProcedure({
            params: {
              id: row.id
            }
          }).then(res => {
            this.getData()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        })
        .then(() => {})
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            updateProcedure({
              params: this.form
            }).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.getData()
            })
          } else {
            addProcedure({ params: this.form }).then(res => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.getData()
            })
          }
          this.dialogShow = false
        }
      })
    },
    cancel() {
      this.dialogShow = false
      this.form = {
        itemNo: this.$route.query.itemNo,
        itemName: this.$route.query.itemName
      }
      this.$refs['form'].clearValidate()
    },
    getItemTree() {
      itemUsedTree(this.queryParams).then(res => {
        this.itemTreeData = [res.data]
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.itemName.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.$set(this.queryParams.params, 'itemNo', data.itemNo)
      this.$set(this.form, 'itemNo', data.itemNo)
      this.$set(this.form, 'itemName', data.itemName)
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 380px;
}

::v-deep .el-form--inline .el-form-item {
  margin-right: 20px;
}

::v-deep .my_label {
  width: 120px;
}

.add_img {
  width: 148px;
  height: 148px;

  img {
    width: 100%;
    height: 100%;
  }

  .delete_img {
    width: 20px;
    height: 20px;
    right: -10px;
    top: -15px;
  }
}

.btn {
  width: 200px;
}
</style>
