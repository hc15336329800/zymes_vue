<!--bom用料详情-->
<template>
  <div>
    <!--    <el-form :model="queryParams" class="commen-search" ref="queryRef" :inline="true" label-width="70px">-->
    <!--      <el-form-item label="部门名称" class="condition">-->
    <!--        <el-input v-model="queryParams.params.deptName" placeholder="请输入部门名称" clearable style="width: 240px" @keyup.enter="handleQuery"/>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item class="commen-button">-->
    <!--        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item class="commen-button reset">-->
    <!--        <el-button icon="Refresh" @click="handleReset">重置</el-button>-->
    <!--      </el-form-item>-->
    <!--    </el-form>-->

    <el-table
      :data="itemUsedList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="itemNo"
      border
      lazy
      :load="reflushTree"
      class="commen-table"
      default-expand-all
      ref="deptTreeRef"
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="itemName" label="产品名称" width="300px"></el-table-column>
      <el-table-column prop="itemNo" label="产品编码"></el-table-column>
      <el-table-column prop="bomNo" label="图纸号"></el-table-column>
      <el-table-column prop="fixedUsed" label="用量"></el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            link
            type="primary"
            v-if="scope.row.itemType=='01'"
            @click="handleAdd(scope.row)"
            icon="Delete"
          >新增
          </el-button>
          <el-button link type="primary" v-if="scope.row.usedId" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" v-if="scope.row.usedId" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="dialogShow" width="960px" @close="beforeClose">
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="bomNo" label="图纸号">
              <el-input v-model="form.bomNo" :disabled="true"/>
            </el-form-item>
          </el-col>
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
        </el-row>

        <el-row>
          <el-col :span="8">
            <itemSelected
              :title="useTitle"
              :item-no.sync="form.useItemNo"
              :item-name.sync="form.useItemName"
              :bom-no.sync="form.useBomNo"
              :required-item="true"
              :disabled.sync="form.id"
            />
          </el-col>
          <el-col :span="8">
            <el-form-item prop="useBomNo" label="用料图纸号">
              <el-input v-model="form.useBomNo" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="useBomNo" label="用料名称">
              <el-input v-model="form.useItemName" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="fixedUse" label="固定用量">
              <el-input-number v-model="form.fixedUse" :precision="3" :controls="false" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="fixedUseAssist" label="辅助用量">
              <el-input-number
                v-model="form.fixedUseAssist"
                :precision="3"
                :controls="false"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="itemMeasureAssist" label="辅助用量单位">
              <el-input v-model="form.itemMeasureAssist"/>
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
  import UserSelect from '@/components/user/userSelect.vue'
  import {
    addUsed,
    deleteUsed,
    detailUsed,
    itemUsedTree,
    updateUsed
  } from '@/api/item/mesItemUsed'

  export default {
    components: {
      UserSelect,
      Pagination: () => import('@/components/Pagination'),
      itemSelected: () => import('@/components/Item/ItemNo')
    },
    data() {
      return {
        useTitle: '用料编码',
        form: {},
        title: '',
        dialogShow: false,
        queryParams: {
          params: {},
          page: {
            page_num: 1,
            page_size: 10
          }
        },
        itemUsedList: [],
        maps: new Map(),
        userList: [],
        pageTotal: 0,
        deptDialog: false,
        loading: false,
        deptForm: {},
        rules: {
          useItemNo: [
            {required: true, message: '用料编码不能为空', trigger: 'blur'}
          ],
          fixedUse: [{required: true, message: '请输入序号', trigger: 'blur'}],
          fixedUseAssist: [
            {required: true, message: '请选择是否为车间', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(function () {
        this.getPgaeInfo()
      })
    },
    methods: {
      /** 查询一级部门 */
      getPgaeInfo() {
        this.itemUsedList = []
        this.queryParams.params.itemNo = this.$route.query.itemNo
        this.$refs.deptTreeRef.store &&
        (this.$refs.deptTreeRef.store.states.lazyTreeNodeMap = {})
        itemUsedTree(this.queryParams).then(res => {
          this.itemUsedList = [res.data]
        })
      },

      reflushTree(pid) {
        // 子节点刷新父节点数据
        this.getPgaeInfo()
      },

      handleQuery() {
        this.queryParams.page.page_num = 1
        this.getPgaeInfo()
      },
      handleReset() {
        this.queryParams = {
          page: {
            page_num: 1,
            page_size: 10
          }
        }
        this.getPgaeInfo()
      },
      handleAdd(row) {
        this.title = '新增'
        this.$set(this.form, 'itemNo', row.itemNo)
        this.$set(this.form, 'itemName', row.itemName)
        this.dialogShow = true
      },
      beforeClose() {
        this.form = {}
        this.$refs['form'].clearValidate()
      },

      handleUpdate(row) {
        detailUsed({
          params: {
            id: row.usedId
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
            deleteUsed({
              params: {
                id: row.usedId
              }
            }).then(res => {
              this.getPgaeInfo()
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            })
          })
          .then(() => {
            this.getPgaeInfo()
          })
      },
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id) {
              updateUsed({
                params: this.form
              }).then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.getPgaeInfo()
              })
            } else {
              addUsed({params: this.form}).then(res => {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.getPgaeInfo()
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
      }
    }
  }
</script>
