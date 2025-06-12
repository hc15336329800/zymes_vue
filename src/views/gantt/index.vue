<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <!-- 筛选条件 -->
    <el-row class="flex_row ptb_20 c_b fw_bold fs_24"> 筛选条件</el-row>
    <el-form
      :inline="true"
      :model="paramForm"
      label-width="120px"
      label-position="left"
    >
      <el-form-item label="BOM编码">
        <el-input v-model="paramForm.bomNo" class="input"/>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="paramForm.orderNo" class="input"/>
      </el-form-item>
      <el-form-item label="车间">
        <el-input v-model="paramForm.workShopName" class="input"/>
      </el-form-item>
      <el-form-item label="工单时间">
        <el-date-picker
          v-model="paramForm.createdTime"
          class="input"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择工单时间"
        />
      </el-form-item>
      <el-form-item label="开始结束时间">
        <el-date-picker
          v-model="searchRangeTime"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="input"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="" @click="operHandle(1)"
        >查询
        </el-button
        >
        <el-button class="ml_20" @click="research">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="self-table">
      <el-table
        :data="tableList"
        style="width: 100%"
        :border="false"
        :cell-class-name="'no-padding'"
        :ref="'file_table'"
      >
        <el-table-column prop="date" fixed label="工单信息" width="400">
          <template slot-scope="scope">
            <div class="info">
              <div class="top">
                <el-link type="primary">{{ scope.row.workOrderNo }}</el-link>
                <div class="order-no">
                  订单号：
                  <el-link type="primary">{{
                    scope.row.orderNo
                    }}
                  </el-link>
                </div>
              </div>
              <div class="other-item">
                <div class="i-cont">
                  工序名称：{{ scope.row.procedureName }}
                </div>
                <div class="i-cont">
                  车间名称：{{ scope.row.workShopName || '--' }}
                </div>
              </div>
              <div class="other-item">
                <div class="i-cont">完成度：{{ scope.row.completion }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="item.yearMonth"
          v-for="item in Object.values(dateListObj)"
          :key="item.yearMonth + Math.random()"
        >
          <el-table-column
            prop="name"
            :label="cItem.day"
            v-for="cItem in item.days"
            :key="cItem.date + Math.random()"
          >
            <template slot-scope="scope">
              <el-popover
                trigger="hover"
                placement="top-start"
                popper-class="popper-class"
                v-if="showTag(scope.row, cItem.date)"
              >
                <p>{{ scope.row.workOrderNo }}</p>
                <p>
                  {{ scope.row.planStartTime }} ~ {{ scope.row.planEndTime }}
                </p>
                <div slot="reference" class="name-wrapper">
                  <div
                    size="medium"
                    :style="getWidth(scope.row)"
                    class="tag start"
                  ></div>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-slider
        v-model="sliderValue"
        :max="maxStep"
        range
        :step="1"
        :format-tooltip="formatTtooltip"
        @input="changeSlider"
        class="self-slider"
        v-if="tableList.length > 0"
      >
      </el-slider>
    </div>
    <el-pagination
      background
      layout="prev, pager,next,  sizes, slot"
      :total="pages.total"
      :current-page="pages.page_num"
      :page-size="pages.page_size"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <span class="product-total">共{{ pages.total }}页</span>
    </el-pagination>
  </div>
</template>
<script>
  import {ganttChart} from '@/api/gantt'

  import SelfGantt from './com/selfGantt.vue'

  export default {
    components: {SelfGantt},
    data() {
      return {
        tableList: [],
        listLoading: false,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10,
        },
        // 查询参数
        paramForm: {
          bomNo: '',
          orderNo: '',
          workShopName: '',
          planStartTime: '',
          planEndTime: '',
          createdTime: '',
        },
        searchRangeTime: [],
        sliderValue: [],
        maxStep: 100,
        startDate: '',
        endDate: '',
        dateListObj: {},
        tableStartDate: '',
        tableEndDate: '',
      }
    },
    async created() {
      this.search()
    },
    methods: {
      showTag(item, tableDate) {
        let itemStartDate = item.planStartTime.substring(0, 10)
        let itemEndDate = item.planEndTime.substring(0, 10)
        let show = itemStartDate == tableDate
        if (!show) {
          // 如果不是这天，则计算改天是否为在区间里面的最近的一天
          const greaterStart = this.getCompareDay(tableDate, itemStartDate)
          const lessEnd = this.getCompareDay(itemEndDate, tableDate)
          if (lessEnd && greaterStart && tableDate == this.tableStartDate) {
            show = true
          }
        }
        return show
      },
      getWidth(item) {
        let width = 0
        let margin = 0
        let diff = 0
        const greaterStart = this.getCompareDay(
          item.planStartTime.substring(0, 10),
          this.tableStartDate
        )
        const lessEnd = this.getCompareDay(
          this.tableEndDate,
          item.planEndTime.substring(0, 10)
        )
        // 如果时间在展示区间内，则直接算宽度和margin
        if (greaterStart && lessEnd) {
          diff = this.getDeiffHour(item.planStartTime, item.planEndTime)
          diff = parseFloat(diff) / 24
          margin = (Number(item.planStartTime.substring(11, 13)) / 24) * 100
        } else if (!greaterStart) {
          // 如果开始时间不在展示区间里
          margin = 0
          // 计算需要减去多少宽度
          if (lessEnd) {
            // 如果结束时间在区间里
            diff = this.getDeiffHour(
              this.tableStartDate + ' 00:00:00',
              item.planEndTime
            )
            console.log(diff, 'item.planStartTime.substring(14, 16))')
            diff = parseFloat(diff) / 24
          } else {
            diff = this.getDeiffHour(
              this.tableStartDate + ' 00:00:00',
              this.tableEndDate + ' 23:59:59'
            )
            diff = parseFloat(diff) / 24
          }
        } else {
          diff = this.getDeiffHour(
            item.planStartTime,
            this.tableEndDate + ' 23:59:59'
          )
          diff = parseFloat(diff) / 24
          margin =
            ((Number(item.planStartTime.substring(11, 13)) +
              parseFloat(item.planStartTime.substring(14, 16)) / 60) /
              24) *
            100
        }
        width = diff * 100
        return `width: ${width.toFixed(2)}%; margin-left: ${margin.toFixed(2)}%`
      },
      changeSlider(value) {
        console.log(value, this.sliderValue)
        this.getDateList(value[0] || 0, value[1] || this.maxStep)
      },
      // 得到两个日期大小
      getCompareDay(date_1, date_2) {
        // 将两个日期都转换为毫秒格式，然后做差
        let myDate_1 = Date.parse(date_1)
        let myDate_2 = Date.parse(date_2)
        if (myDate_1 >= myDate_2) return true
        return false
      },

      // 得到开始时间之后几天的日期
      formatTtooltip(value, startDate = this.startDate) {
        var dd = new Date(startDate)
        dd.setDate(dd.getDate() + value) //获取AddDayCount天后的日期
        var y = dd.getFullYear()
        var m = dd.getMonth() + 1 //获取当前月份的日期
        var d = dd.getDate()
        m = m < 10 ? '0' + m : m
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d
      },
      // 得到日期表头
      getDateList(first = 0, end = this.maxStep) {
        console.log(first, end)
        let listObj = {}
        if (this.maxStep > 0) {
          for (let index = first; index <= end; index++) {
            const element = this.formatTtooltip(index)
            if (index == first) {
              this.tableStartDate = element
            }
            if (index == end) {
              this.tableEndDate = element
            }
            let yearMonth = element.substring(0, 7)
            let day = element.substring(8, 10)
            if (!listObj[yearMonth]) {
              listObj[yearMonth] = {yearMonth: yearMonth, days: []}
            }
            listObj[yearMonth].days.push({
              day: day,
              date: element,
            })
          }
        }
        this.dateListObj = listObj
        this.$nextTick(() => {
          this.$refs.file_table.doLayout()
        })
      },
      getDeiffHour(date1, date2) {
        date1 = new Date(date1)
        date2 = new Date(date2)
        let s1 = date1.getTime(),
          s2 = date2.getTime()
        let total = (s2 - s1) / 1000
        let hous = (total / (60 * 60)).toFixed(2)
        return hous
      },
      // 计算两个日期之间的差值
      getDiffDay(date_1, date_2, getdays = true) {
        let totalDays, diffDate
        let myDate_1 = Date.parse(date_1)
        let myDate_2 = Date.parse(date_2)
        // 将两个日期都转换为毫秒格式，然后做差
        diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
        // 相差的天数
        if (getdays) {
          // 得到天数
          totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
        } else {
          totalDays = Math.floor(diffDate / (1000 * 3600)) // 向下取整
        }
        // totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
        return totalDays
      },
      async getList(str) {
        this.listLoading = true
        try {
          this.paramForm.planStartTime = this.searchRangeTime[0] || ''
          this.paramForm.planEndTime = this.searchRangeTime[1] || ''

          let createdTime = this.paramForm.createdTime ? this.paramForm.createdTime + ' 00:00:00' : ''
          let planStartTime = this.paramForm.planStartTime ? this.paramForm.planStartTime + ' 00:00:00' : ''
          let planEndTime = this.paramForm.planEndTime ? this.paramForm.planEndTime + ' 00:00:00' : ''
          const res = await ganttChart({
            page: {
              page_num: this.pages.page_num,
              page_size: this.pages.page_size,
            },
            params: {
              "bomNo": this.paramForm.bomNo,
              "orderNo": this.paramForm.orderNo,
              "workShopName": this.paramForm.workShopName,
              "planStartTime": planStartTime,
              "planEndTime": planEndTime,
              "createdTime": createdTime
            },
          })
          if (res.data) {
            let starts = []
            let ends = []
            this.tableList = res.data.map((item) => {
              starts.push(new Date(item.planStartTime))
              ends.push(new Date(item.planEndTime))
              return item
            })
            // this.tableList = this.tableList.concat([
            //   {
            //     planStartTime: '2022-08-19 12:30:00',
            //     planEndTime: '2022-08-27 13:23:15',
            //   },
            //   {
            //     planStartTime: '2022-08-23 12:30:00',
            //     planEndTime: '2022-08-27 13:23:15',
            //   },
            //   {
            //     planStartTime: '2022-08-27 12:30:00',
            //     planEndTime: '2022-09-31 13:23:15',
            //   },
            // ])
            if (starts.length > 0) {
              this.startDate = this.formatTtooltip(
                -3,
                new Date(Math.min.apply(null, starts))
              )
              this.endDate = this.formatTtooltip(
                3,
                new Date(Math.max.apply(null, ends))
              )
            }
            this.pages.total = Number(res.page.total_num)
          }
        } finally {
          this.listLoading = false
        }
      },
      handleCurrentChange(val) {
        // 点击页码切换数据
        this.pages.page_num = val
        this.getList()
      },
      handleSizeChange(val) {
        // 点击页码切换数据
        this.pages.page_size = val
        this.search()
      },
      async search() {
        await this.getList()
        let totalDays = this.getDiffDay(this.startDate, this.endDate)
        this.maxStep = totalDays
        this.sliderValue = [0, totalDays]
        this.getDateList(0, this.maxStep)
      },
      research() {
        this.paramForm = {
          bomNo: '',
          orderNo: '',
          workShopName: '',
          planStartTime: '',
          planEndTime: '',
          createdTime: '',
        }
        this.searchRangeTime = []
        this.pages = {
          total: 0,
          page_num: 1,
          page_size: 10,
        }
        this.search()
      },
      async operHandle(type, item) {
        switch (type) {
          case 1: // 查询
            this.pages.page_num = 1
            this.pages.total = 0
            this.search()
            break
          case 2: // 确认
            this.$router.push({
              name: 'workWasteConfirm',
              query: {id: item.wasteId},
            })
            break
          default:
        }
      },
    },
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

<style lang="scss">
  .self-table {
    padding-bottom: 100px;
    position: relative;
    // display: flex;
    .first {
      width: 400px;

      .el-table tr {
        height: 88px !important;
      }
    }

    .second {
    }

    // .el-table tr {
    //   height: 40px !important;
    // }
    .el-table thead.is-group th.el-table__cell {
      height: 40px !important;
    }

    .el-table--enable-row-transition .el-table__body td.el-table__cell {
      // width: 400px;
      padding: 10px 0;
    }

    .self-slider {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%, 0);
      width: 100%;
    }

    .el-table .no-padding .cell {
      overflow: unset !important;
      padding-left: 0;
      padding-right: 0;
      // height: 80px;
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
        z-index: 1990;
        height: 35px;
        border-radius: 2px;
      }
    }

    .el-table__fixed,
    .el-table__fixed-right {
      z-index: 2000;
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
      flex-wrap: wrap;

      .i-cont {
        width: 50%;
      }
    }
  }
</style>
