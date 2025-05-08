<template>
  <div>
    <label for="reportCount" class="el-form-item__label  flex_center mt_30 mb_30" style="width: 120px;">

      <span style="color: #ff4949;" class="mr_5">*</span>
      <span>
                发货明细
            </span></label>
    <el-table id="isTable" v-loading="listLoading" :data="list" element-loading-text="Loading" fit border
              highlight-current-row class="table mb_30 ml_20 mr_20">
      <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
      <el-table-column v-for="item in tableList" :key="item.label" align="center" :label="item.label" width="">
        <template slot-scope="scope">
          <template v-if="item.label == '图纸号'">
            <el-input v-model="scope.row.type" disabled placeholder="请输入内容"></el-input>
          </template>
          <template v-else-if="item.label == '确认发货数量'">
            <el-input-number v-model="scope.row.type"></el-input-number>
          </template>
          <template v-else>
            {{ scope.row[item.value] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="w_100 flex_row flex_x_center">
      <el-button type="" plain class="ml_20" @click="operHandle(1)">取消</el-button>
      <el-button type="primary" class="ml_20" @click="operHandle(2)">确定</el-button>
    </div>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        tableList: [

          {
            label: '图纸号',
            value: 'bomNo'
          },
          {
            label: '申请发货数量',
            value: 'orderNo'
          },
          {
            label: '确认发货数量',
            value: 'workOrderNo'
          },
          {
            label: '接收客户',
            value: 'procedureCode'
          },
          {
            label: '申请人',
            value: 'procedureName'
          },
          {
            label: '申请日期',
            value: 'type'
          }
        ],
        list: [{}],
        listLoading: false,
      }
    },
    methods: {
      async operHandle(type, item) {
        switch (type) {
          case 1: // 返回
            this.$router.push({
              name: "orderShipmentRequest"
            })
            break
          case 2: // 确认
            this.dialogVisible = true
            break

          default:
        }
      }

    }
  }
</script>
