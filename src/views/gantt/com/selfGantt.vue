<template>
  <div class="self-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      :border="false"
      :cell-class-name="'no-padding'"
    >
      <el-table-column prop="date" fixed label="工单信息" width="400">
        <template slot-scope="scope">
          <div class="top">
            <el-link type="primary">B-220818-002</el-link>
            <!-- <div class="order-no">B-220818-002</div> -->
            <div class="order-no">
              订单号：
              <el-link type="primary">LOOYET-SALE-202208180001</el-link>
            </div>
          </div>
          <div class="other-item">
            <div>工序名称：{{ scope.row.name }}</div>
            <div>车间名称：{{ scope.row.name }}</div>
            <div>完成度：50/100</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="配送信息">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="name" label="姓名" class="">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top-start"
              popper-class="popper-class"
            >
              <p>姓名: {{ scope.row.name }}</p>
              <p>住址: {{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag
                  size="medium"
                  style="width: 250%; margin-left: 50%"
                  class="tag start"
                ></el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名">
          <template slot-scope="scope"> {{}}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名">
          <template slot-scope="scope"> {{}}</template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [
          {
            date: '2016-05-03',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
          },
          {
            date: '2016-05-02',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
          },
          {
            date: '2016-05-04',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
          },
          {
            date: '2016-05-01',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
          },
          {
            date: '2016-05-08',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
          },
          {
            date: '2016-05-06',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
          },
          {
            date: '2016-05-07',
            name: '王小虎',
            province: '上海',
            city: '普陀区',
            address: '上海市普陀区金沙江路 1518 弄',
            zip: 200333,
          },
        ],
      }
    },
  }
</script>

<style lang="scss">
  .self-table {
    .el-table .no-padding .cell {
      overflow: unset !important;
      padding-left: 0;
      padding-right: 0;
    }

    .name-wrapper {
      position: relative;
      height: 35px;
      width: 100%;

      .tag {
        position: absolute;
        left: 0;
        top: 4px;
        background: rgb(153, 220, 121);
        border: 1px solid rgb(43, 163, 13);
        z-index: 2000;
      }
    }

    .top {
      display: flex;
      padding: 5px 10px;

      .order-no {
        margin-left: 10px;
      }
    }

    .other-item {
      display: flex;
      padding: 0 10px 5px;

      div {
        flex: 1;
      }
    }
  }
</style>
