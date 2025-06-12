<template>
  <el-date-picker
    v-model="dateIntervals" style="width: 360px" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
    type="daterange" :picker-options="datePickerOptions"
    :default-value="Date.now() - 30 * 24 * 3600 * 1000"
    range-separator="至"
    @change="changeTime()"
    start-placeholder="开始日期"
    end-placeholder="结束日期">
  </el-date-picker>
</template>

<script>
  import {formatTimeYmd, getPreMonth} from '@/utils/index'

  export default {
    name: 'DateIntervals',
    props: {
      type: {
        type: String
      },
      beginTime: {
        type: String
      },
      endTime: {
        type: String
      }
    },
    data() {
      let this_ = this
      return {
        dateIntervals: [],
        datePickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          onPick(p) {
            let pickerMinDate = ''
            let pickerMaxDate = ''
            if (p.minDate != null) {
              pickerMinDate = new Date(p.minDate).getTime()
              pickerMinDate = formatTimeYmd(pickerMinDate)
            }
            if (p.maxDate != null) {
              pickerMaxDate = new Date(p.maxDate).getTime()
              pickerMaxDate = formatTimeYmd(pickerMaxDate)
            }
            this_.setIntervals(pickerMinDate, pickerMaxDate)
          }
        },
        disabledDate: time => {
          // 是否限制的判断条件
          if (!this.isNull(this.selectData)) {
            var date = new Date(this.selectData)
            // 这里就是限制的关键，大于或者小于本月的日期被禁用
            return (
              date.getMonth() > new Date(time).getMonth() ||
              date.getMonth() < new Date(time).getMonth()
            )
          } else {
            return false
          }
        }
      }
    },
    watch: {},
    created() {
      if (!this.type) {
        this.initDateData()
      }
    },
    methods: {
      initDateData() {
        let nowTimes = formatTimeYmd(Date.now())
        let preTimes = getPreMonth(nowTimes)
        this.dateIntervals = [preTimes, nowTimes]
        this.setIntervals(preTimes, nowTimes)
        this.$emit("getData")
      },
      setDefaultData(beginTime, endTime) {
        this.dateIntervals = [beginTime, endTime]
      },
      resetData() {
        this.dateIntervals = []
        this.setIntervals('', '')
      },
      changeTime() {
        if (!this.dateIntervals) {
          this.setIntervals('', '')
        }
      },
      setIntervals(s, e) {
        this.$emit('update:beginTime', s)
        this.$emit('update:endTime', e)
      }
    }
  }
</script>

