<template>
  <div>
    <div
      v-for="(item,k) in dataList"
      :key="k"
      class="flex flex_y_start"
      :class="!item.name && k!=dataList.length-1?'last-list':''"
      style="margin-top:20px;"
    >
      <div
        style="width:100px;font-weight:700;font-size:16px;padding-left:30px;padding-top:10px;"
      >{{item.name}}
      </div>
      <div>
        <span style="margin:0 20px;color: #6C7079;">{{item.shiftType=='01'?'白班':'夜班'}}</span>
        <el-time-picker
          placeholder="开始时间"
          value-format="HH:mm:ss"
          v-model="item.startTime"
          format="HH:mm:ss"
          style="margin-right:20px;"
        ></el-time-picker>
        <el-time-picker
          placeholder="结束时间"
          value-format="HH:mm:ss"
          format="HH:mm:ss"
          v-model="item.endTime"
        ></el-time-picker>
      </div>
    </div>
    <div style="text-align:center;margin-top:20px;">
      <el-button type="primary" class @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>

  import {get_shift_setting, save_shift_setting} from '@/api/shift/shiftSetting'

  export default {
    name: 'shiftSetting',
    data() {
      return {
        list: [],
        dayList: [
          {
            name: '周一',
            value: 1
          },
          {
            name: '周二',
            value: 2
          },
          {
            name: '周三',
            value: 3
          },
          {
            name: '周四',
            value: 4
          },
          {
            name: '周五',
            value: 5
          },
          {
            name: '周六',
            value: 6
          },
          {
            name: '周日',
            value: 7
          }
        ],
        dataList: []
      }
    },
    created() {
      this.getList()
      // this.dealDate()
    },
    methods: {
      dealDate() {
        this.dayList.forEach(item => {
          if (item.value != 7) {
            this.dataList.push({
              name: item.name,
              weekDay: item.value,
              shiftType: '01',
              startTime: '07:30:00',
              endTime: '18:59:00'
            })
            this.dataList.push({
              weekDay: item.value,
              shiftType: '02',
              startTime: '19:00:00',
              endTime: '07:29:00'
            })
          } else {
            this.dataList.push({
              name: item.name,
              weekDay: item.value,
              shiftType: '02',
              startTime: '19:00:00',
              endTime: '07:29:00'
            })
          }
        })
      },
      async save() {
        var params = []
        const res = await save_shift_setting({
          params: {
            list: this.dataList
          }
        })
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      },
      async getList() {
        const res = await get_shift_setting()
        this.list = [{shiftType: '01'}, {shiftType: '02'}]
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            this.dayList.forEach(item2 => {
              if (item2.value == item.weekDay && item.shiftType == '01') {
                this.$set(item, 'name', item2.name)
              }
              if (item.weekDay == 7 && item.shiftType == '02') {
                this.$set(item, 'name', item2.name)
              }
            })
          })
          this.dataList = res.data
        } else {
          this.dealDate()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .app-main {
    .last-list {
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;

      &:last-of-type {
        border-bottom: none;
      }
    }
  }
</style>


