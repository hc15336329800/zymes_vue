<!--分组详情-->
<template>
  <div class="app-container">

    <!--    横条提醒-->
    <el-alert
      v-if="totalPercentage.toFixed(3) !== '1.000'"
      title="当前合工总数不为 1.000，请及时修正以防工资计算出错！"
      type="error"
      show-icon
      closable={false}
      style="margin-bottom: 30px; margin-top: 30px"
    />

    <!-- 工具栏 -->
    <el-row class="mb8" :gutter="10">
      <el-col :span="4">
        <el-button type="primary" class="commen-button" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="18" class="statistic-col"  style="padding-top: 15px;">
        <div class="statistic-info">
<!--          <span class="statistic-label">信息统计：</span>-->
<!--          <span class="statistic-value">合工总数 ： {{ totalPercentage.toFixed(1) }}</span>-->
          <span class="statistic-value">合工总数 ： {{ formatTotalPercentage(totalPercentage) }}</span>

        </div>
      </el-col>

    </el-row>




    <!-- 列表 -->
    <el-table :data="pageList" class="commen-table mt_20">
      <el-table-column type="index" width="55" label="序号"></el-table-column>
      <el-table-column label="工人" align="center" prop="userName" />
      <el-table-column label="合工/占比" align="center" prop="percentage" />
      <el-table-column label="类型" align="center" prop="leaderTypeDesc" />
      <el-table-column label="创建时间" align="center" prop="createdTime" />
      <el-table-column label="操作" align="center" width="310" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button link type="primary" icon="Delete" v-if="scope.row.leaderType=='00'"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      style="text-align: right"
      v-show="pageTotal>0"
      :total="pageTotal"
      :page.sync="queryParams.page.page_num"
      :limit.sync="queryParams.page.page_size"
      @pagination="getData"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="dialogShow" width="470px" @close="beforeClose"   >
      <el-form :model="form" class="commen-form" :rules="rules" ref="form" label-width="60px">
<!--        <userSelect :title="userTitle" :user-id.sync="form.userId" :required-user="true" />-->

        <!-- 修改userSelect组件，增加required属性和验证 -->
        <el-form-item prop="userId" label="工人" required>
          <userSelect
            :user-id.sync="form.userId"
            :required="true"
            @change="handleUserChange"
            style="width: 100%"
          />
        </el-form-item>

        <!--      工资占比-->
        <el-form-item prop="percentage" label="占比" status-icon  style="margin-top: 25px ;margin-bottom: 25px">
          <el-input
            v-model="form.percentage"
            placeholder="请输入0.1-1.0之间的数值"
            @input="onPercentageInput"
          />
        </el-form-item>
        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel"  style="margin-right: 35px">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addGroupDtl, deleteGroupDtl, detailGroupDtl, groupDtlPageList, updateGroupDtl } from '@/api/group/groupDetail'

export default {
  components: {
    DateIntervals: () => import('@/components/DateIntervals'),
    Pagination: () => import('@/components/Pagination'),
    UserSelect: () => import('@/components/user/userSelect')
  },
  data() {
    return {

      totalPercentage: 0,   // 新增统计总数
      userTitle: '工人',
      queryParams: {
        params: {},
        page: {
          page_num: 1,
          page_size: 50
        }
      },
      form: {
         userId: '',            // 默认空
        percentage: '0.1'      // 默认字符串 0.1
      },
      pageTotal: 0,
      pageList: [],
      title: '',
      dialogShow: false,
      rules: {
        userId: [
          { required: true, message: '请选择工人', trigger: 'change' }
        ],
        percentage: [
          { required: true, message: '请输入占比值', trigger: ['blur', 'change'] }, // ✅ 修改 trigger
          { validator: validatePercentage, trigger: ['blur', 'change'] }            // ✅ 修改 trigger
        ]
      }

    }

    //检验输入
    const validatePercentage = (rule, value, callback) => {
      const num = Number(value)
      const pattern = /^([0]{0,1}[.][1-9]|0\.[1-9][0-9]?|1(\.0?)?)$/

      if (!value) {
        callback(new Error('请输入占比值'))
      } else if (!pattern.test(value)) {
        callback(new Error('请输入0.1到1.0之间的数值'))
      } else {
        callback()
      }
    }


  },
  created() {
    this.getData()
  },

  // 处理离开网页弹窗  注册监听：
  mounted() {
    this.getData(); // 确保初始调用
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  // 处理离开网页弹窗  卸载监听：
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },

  // 【	拦截路由切换】 ：组件级导航守卫：在用户离开当前组件页面时触发（无论是跳转到其他页面，还是浏览器后退）
  beforeRouteLeave(to, from, next) {
    const total = parseFloat(this.totalPercentage.toFixed(3));
    if (total !== 1.000) {
      this.$message.warning('当前合工总数不为 1.000，请及时修正以防工资计算出错！');
      next(false); // 直接阻止跳转
    } else {
      next(); // 放行
    }
  },



  methods: {

    // 浏览器关闭、刷新（用 beforeunload，但必须返回字符串！）
    handleBeforeUnload(e) {
      const total = parseFloat(this.totalPercentage.toFixed(3));
      if (total !== 1.000) {
        const msg = '合工总数不为 1.000，确认要离开吗？';
        e.preventDefault();
        e.returnValue = msg;
        return msg;
      }
},


    // 综合统计  确保 只截断，不四舍五入，保留至少三位小数：
    formatTotalPercentage(val) {
      if (typeof val !== 'number') return '0.000';
      const str = val.toString();
      const index = str.indexOf('.');
      if (index === -1) return str + '.000';
      const decimal = str.substring(index + 1);
      if (decimal.length >= 3) {
        return str.substring(0, index + 4); // 截断三位小数
      } else {
        return str + '0'.repeat(3 - decimal.length); // 不足补0
      }
    },


    // 禁止中文输入（额外提示，而不直接屏蔽）
    onPercentageInput(val) {
      if (/[\u4e00-\u9fa5]/.test(val)) {
        // this.$message.warning('请输入数字，不能包含汉字');
      }
    },

    // 新增工人选择变化处理
    handleUserChange(val) {
      this.form.userId = val;
      this.$refs.form.validateField('userId');
    },

    handleQuery() {
      this.queryParams.page.page_num = 1
      this.getData()
    },
    beforeClose() {
      this.$refs['form'].resetFields();  // ✅ 推荐用 resetFields 一次性处理
      this.form = {
        userId: '',
        percentage: '0.1'                // ✅ 注意是字符串
      }
    },
    handleReset() {
      this.queryParams = {
        page: {
          page_num: 1,
          page_size: 50
        },
        params: {}
      }
      this.$refs.userInfoDateIntervals?.initDateData()
      this.getData()
    },
    getData() {
      this.queryParams.params.groupId = this.$route.query.id
      groupDtlPageList(this.queryParams).then(res => {
        this.pageList = res.data
        this.pageTotal = Number(res.page.total_num)
        // 计算合工总数
        this.calculateTotalPercentage()
      })

    },


    // 新增计算总数方法
    calculateTotalPercentage() {
      this.totalPercentage = this.pageList.reduce((sum, item) => {
        return sum + (parseFloat(item.percentage) || 0)
      }, 0)
    },

    handleAdd() {
      this.title = '新增'
      this.dialogShow = true
    },
    handleUpdate(row) {
      detailGroupDtl({
        params: {
          id: row.id
        }
      }).then(res => {
        this.form = res.data
        // 确保编辑时的值也在0.1-1.0范围内
        if (this.form.percentage < 0.1) {
          this.form.percentage = 0.1
        } else if (this.form.percentage > 1.0) {
          this.form.percentage = 1.0
        }
        this.dialogShow = true
      })
      this.title = '编辑'
    },
    handleDelete(row) {
      this.$confirm('确认要删除数据吗?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroupDtl({
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
    },
    //提交
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false;
        }

        // 验证占比值
        const percentage = parseFloat(this.form.percentage);
        if (isNaN(percentage)) {
          this.$message.error('请输入有效的数字');
          return false;
        }

        // 验证小数位数
        // const decimalPart = this.form.percentage.toString().split('.')[1];
        // if (decimalPart && decimalPart.length > 1) {
        //   this.$message.error('只能输入一位小数');
        //   return false;
        // }

        // 验证范围
        if (percentage < 0.001 || percentage > 1.0) {
          this.$message.error('占比值必须在0.1到1.0之间');
          return false;
        }

        this.form.groupId = this.$route.query.id;
        const operation = this.form.id ?
          updateGroupDtl({ params: this.form }) :
          addGroupDtl({ params: this.form });

        operation.then(res => {
          this.$message({
            message: this.form.id ? '修改成功' : '新增成功',
            type: 'success'
          });
          this.dialogShow = false;
          this.getData(); // 这会自动触发calculateTotalPercentage
        }).catch(error => {
          this.$message.error('操作失败，请重试');
        });
      });
    },
    cancel() {
      this.dialogShow = false
      this.form = {
        percentage: 0.1
      }
      this.$refs['form'].clearValidate()
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

/* ✅ 用 scoped 时需要深度穿透 */
::v-deep .el-select.el-select--medium {
  width: 100% !important;
}


/* 报工信息统计 */
.statistic-col {
  display: flex;
  justify-content: flex-end; /* ✅ 靠右 */
  align-items: center;       /* ✅ 上下居中 */
  height: 100%;              /* 可根据 el-row 实际高度微调 */
}
/* 报工信息统计 */
.statistic-info {
  font-size: 16px;
  //color: #333;
  font-weight: bold;           /* ✅ 加粗 */
  color: #FFA500;              /* ✅ 橘黄色 */
}


</style>
