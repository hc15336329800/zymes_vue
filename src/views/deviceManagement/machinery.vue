<!--设备台账页面-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container commen-ipt">
          <el-input
            v-model="deviceTypeName"
            placeholder="请输入分类名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deviceTypeData"
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
        <el-form
          :model="queryParams"
          ref="queryRef"
          class="query-form commen-search"
          :inline="true"
        >
          <el-form-item label="设备名称" class="condition">
            <el-input v-model="queryParams.params.deviceName" placeholder="请输入名称" clearable/>
          </el-form-item>

          <el-form-item class="commen-button">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          </el-form-item>
          <el-form-item class="commen-button reset">
            <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
          </el-form-item>
          <el-form-item></el-form-item>
        </el-form>
        <el-row class="mb8">
          <el-button
            type="primary"
            class="commen-button"
            icon="el-icon-plus"
            v-if="hasPerm('B003002000001')"
            @click="handleAdd"
          >新增
          </el-button>
        </el-row>
        <el-table :data="pageList" class="commen-table mt_20">
          <el-table-column type="index" width="55" label="序号"></el-table-column>
          <el-table-column label="设备名称" align="center" prop="deviceName"/>
          <el-table-column label="设备类型" align="center" prop="typeName"/>
          <el-table-column label="设备编号" align="center" prop="deviceNo"/>
          <el-table-column label="品牌" align="center" prop="brand"/>
          <el-table-column label="设备厂家" align="center" prop="manufacturer"/>
          <el-table-column label="所属车间" align="center" prop="deptIdDesc"/>
          <el-table-column label="设备状态" align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.dataStatus=='00'?'正常':'停用' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createdTime"/>
          <el-table-column
            label="操作"
            align="center"
            width="310"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <!-- 确认后不能编辑和删除 -->
              <el-button
                link
                type="primary"
                icon="Edit"
                @click="handleUpdate(scope.row)"
                v-if="hasPerm('B003002000002')"
              >编辑
              </el-button>
<!--              <el-button-->
<!--                link-->
<!--                type="primary"-->
<!--                icon="Delete"-->
<!--                @click="handleDelete(scope.row)"-->
<!--                v-if="hasPerm('B003002000003')"-->
<!--              >删除-->
<!--              </el-button>-->
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogShow" width="480px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="80px">
        <el-form-item prop="deviceName" label="设备名称">
          <el-input v-model="form.deviceName" maxlength="100"/>
        </el-form-item>
        <el-form-item prop="deviceNo" label="设备编号">
          <el-input v-model="form.deviceNo" maxlength="100"/>
        </el-form-item>
        <el-form-item prop="brand" label="品牌">
          <el-input v-model="form.brand" maxlength="100"/>
        </el-form-item>
        <el-form-item prop="manufacturer" label="设备厂家">
          <el-input v-model="form.manufacturer" maxlength="100"/>
        </el-form-item>
        <workShop :bindId.sync="form.deptId" :required-dept="true"/>
        <el-form-item prop="typeId" label="设备类型">
          <el-select v-model="form.typeId" placeholder="请选择设备类型" clearable>
            <el-option
              v-for="dict in deviceTypeOptions"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="dataStatus" label="是否停用">
          <el-radio
            v-model="form.dataStatus"
            :label="item.code"
            v-for="item in dataStatusList"
            :key="item.code"
          >{{item.name}}
          </el-radio>
        </el-form-item>
        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {getAllTypeList} from '@/api/device/deviceType'
  import {
    addDeviceInfo,
    deleteDeviceInfo,
    detailDeviceInfo,
    devicePageList,
    updateDeviceInfo
  } from '@/api/device/deviceInfo'

  export default {
    components: {
      WorkShop: () => import('@/components/Dept/workShop'),
      DateIntervals: () => import('@/components/DateIntervals'),
      Pagination: () => import('@/components/Pagination')
    },
    data() {
      return {
        deviceTypeOptions: [],
        dataStatusList: [
          {code: '00', name: '正常'},
          {code: '01', name: '停用'}
        ],
        deviceTypeName: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        form: {
          typeId: '',
          dataStatus: '00'
        },
        pageTotal: 0,
        pageList: [],
        title: '',
        dialogShow: false,
        deviceTypeData: [
          {
            name: '设备类型',
            code: '',
            children: []
          }
        ],
        rules: {
          deviceName: [
            {required: true, message: '请输入设备名称', trigger: 'blur'}
          ],
          deviceNo: [
            {required: true, message: '请输入设备编号', trigger: 'blur'}
          ],
          typeId: [
            {required: true, message: '请选择设备类型', trigger: 'blur'}
          ],
          dataStatus: [{required: true, message: '请选择', trigger: 'blur'}]
        }
      }
    },
    watch: {
      // 根据设备分类名称筛选分类树
      deviceTypeName(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.getDeviceType()
      this.getData()
    },
    methods: {
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getData()
      },
      beforeClose() {
        this.form = {}
        this.$refs['form'].clearValidate()
      },
      /** 重置操作表单 */
      handleReset() {
        this.queryParams = {
          page: {
            page_num: 1,
            page_size: 10
          },
          params: {}
        }
        this.$refs.userInfoDateIntervals.initDateData()
        this.getData()
      },
      getData() {
        devicePageList(this.queryParams).then(res => {
          this.pageList = res.data
          this.pageTotal = Number(res.page.total_num)
        })
      },
      handleAdd() {
        this.title = '新增'
        this.dialogShow = true
      },
      handleUpdate(row) {
        detailDeviceInfo({
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
            deleteDeviceInfo({
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
          .then(() => {
          })
      },
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id) {
              updateDeviceInfo({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getData()
              })
            } else {
              addDeviceInfo({params: this.form}).then(res => {
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
        this.form = {}
        this.$refs['form'].clearValidate()
      },
      handleNodeClick(data) {
        this.$set(this.queryParams.params, 'typeId', data.code)
        this.$set(this.form, 'typeId', data.code)
        this.handleReset()
        this.getData()
      },
      getDeviceType() {
        getAllTypeList({}).then(res => {
          this.deviceTypeOptions = res.data
          this.$set(this.deviceTypeData[0], 'children', res.data)
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
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
