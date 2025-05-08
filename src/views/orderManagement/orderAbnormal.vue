<template>
  <div class="w_100 pt_30 plr_30 ptb_30">
    <el-row>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          订单名称
        </div>
        <div class="ml_10">
          {{ orderInfo.bomNo }}
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          订单类型
        </div>
        <div class="ml_10">
          {{ orderInfo.orderTypeName }}
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          接收人
        </div>
        <div class="ml_10">
          {{ orderInfo.applyUser }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          订单号
        </div>
        <div class="ml_10">
          {{ orderInfo.orderNo }}
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          制单人
        </div>
        <div class="ml_10">
          {{ orderInfo.createUser }}
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="8" class="flex_row flex_shink ptb_10 plr_10">
        <div class="label fw_bold fs_24">
          订单状态
        </div>
        <div class="ml_10">
          {{ orderInfo.orderDtlStatusName }}
        </div>
      </el-col>
    </el-row>

    <el-row class="c_b fw_bold fs_24 ptb_20">
      物料不足待调整
    </el-row>

    <el-table :data="itemList" element-loading-text="Loading" fit border highlight-current-row class="table mb_30">
      <el-table-column v-for="item in dataList" :key="item.value" align="center" :label="item.label"
                       :width="item.label == &quot;替换物料&quot;? 300 : &quot;&quot;">
        <template slot-scope="scope">
          <div v-if="item.label == &quot;替换物料&quot;" class="flex_row flex_x_center">
            <el-select v-model="scope.row.label" placeholder="请选择" class="input1">
              <div class="search-input">
                <el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="dropDownItem"
                          @input="dropDownSearchItem" clearable></el-input>
              </div>
              <div slot="empty" class="search-input">
                <el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="dropDownItem"
                          @input="dropDownSearchItem" clearable></el-input>
                <p>无搜索内容</p>
              </div>
              <el-option v-for="(item,key) in itemCopyOptions" :key="key" :label="item.itemInfo"
                         :value="item.itemNo"/>
            </el-select>
          </div>

          <template v-else>
            {{ scope.row[item.value] }}
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-row class="c_b fw_bold fs_24 ptb_20">
      设备繁忙待调整
    </el-row>

    <el-table :data="deviceList" element-loading-text="Loading" fit border highlight-current-row class="table mb_30">
      <el-table-column v-for="item in dataList1" :key="item.value" align="center" :label="item.label"
                       :width="item.label == &quot;替换设备&quot;? 300 : &quot;&quot;">
        <template slot-scope="scope">
          <div v-if="item.label == &quot;替换设备&quot;" class="flex_row flex_x_center">
            <el-select v-model="scope.row.label" placeholder="请选择" class="input1">
              <div class="search-input">
                <el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="dropDownValue"
                          @input="dropDownSearch" clearable></el-input>
              </div>
              <div slot="empty" class="search-input">
                <el-input placeholder="请输入内容" size="mini" prefix-icon="el-icon-search" v-model="dropDownValue"
                          @input="dropDownSearch" clearable></el-input>
                <p>无搜索内容</p>
              </div>
              <el-option v-for="(item,key) in deviceCopyOptions" :key="key" :label="item.deviceName"
                         :value="item.deviceNo"/>
            </el-select>
          </div>
          <template v-else>
            {{ scope.row[item.value] }}
          </template>
        </template>
      </el-table-column>
    </el-table>

    <div class="w_100 flex_row flex_x_center">
      <el-button @click="operHandle">取消</el-button>
      <el-button type="primary" plain class="ml_20" @click="confirm">确定</el-button>
    </div>
  </div>
</template>
<script>
  // import MultipleImage from "@/components/Upload/MultipleImage.vue"
  import {
    get_all_workers
  } from '@/api/common'
  import {
    work_detail,
    update_order_work,
    defect_resources,
    get_item_list,
    get_device_list,
    update_resources
  } from '@/api/order'

  export default {
    components: {
      // MultipleImage
    },
    data() {
      return {
        dataList: [{
          label: '物料编码',
          value: 'itemNo'
        },
          {
            label: '物料名称',
            value: 'itemName'
          },
          {
            label: '规格',
            value: 'workShopName'
          },
          {
            label: '计量单位',
            value: 'itemMeasure'
          },
          {
            label: '所需数量',
            value: 'needCount'
          },
          {
            label: '实际库存',
            value: 'itemCount'
          },
          {
            label: '替换物料',
            value: 'workers'
          }
        ],
        list: [],
        listLoading: false,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 10
        },
        // 查询参数
        paramForm: {
          name: '',
          code: '',
          status: ''
        },
        wlOptions: [],
        sbOptions: [],
        dataList1: [{
          label: '设备编号',
          value: 'deviceNo'
        },
          {
            label: '设备名称',
            value: 'deviceName'
          },
          {
            label: '替换设备',
            value: ''
          }
        ],
        list1: [],
        workOptions: [],
        detail: {},
        id: '',
        bomNo: '',
        scheduledId: '',
        flag: true,
        itemList: [],
        deviceList: [],
        deviceOptions: [],
        deviceCopyOptions: [],
        itemOptions: [],
        itemCopyOptions: [],
        orderInfo: {},
        dropDownValue: '',
        dropDownItem: '',
      }
    },
    async created() {
      if (this.$route.query.id) this.id = this.$route.query.id
      if (this.$route.query.scheduledId) this.scheduledId = this.$route.query.scheduledId
      if (this.$route.query.bomNo) this.bomNo = this.$route.query.bomNo
      if (this.$route.query.orderInfo) this.orderInfo = JSON.parse(this.$route.query.orderInfo)
      console.log(this.orderInfo)
      this.getDetail()
    },
    methods: {
      dropDownSearch() {
        var _this = this;
        // _this.valueMeta = [];
        _this.deviceCopyOptions = _this.deviceOptions.filter(_this.filterSearch);
      },
      filterSearch(item) {

        return item.deviceName.includes(this.dropDownValue);
      },
      clearDrop($event) { //此处的clearDrop用于解决搜索内容不存在时，所有内容无法显示的bug
        if ($event) {
          this.dropDownValue = ''
          this.deviceCopyOptions = this.deviceOptions
        }
      },

      dropDownSearchItem() {
        var _this = this;
        // _this.valueMeta = [];
        _this.itemCopyOptions = _this.itemOptions.filter(_this.filterSearchItem);
      },
      filterSearchItem(item) {
        return item.itemInfo.includes(this.dropDownItem);
      },
      clearDrop($event) { //此处的clearDrop用于解决搜索内容不存在时，所有内容无法显示的bug
        if ($event) {
          this.dropDownItem = ''
          this.itemCopyOptions = this.itemOptions
        }
      },
      async get_all_workers() { // 获取员工信息
        const res = await get_all_workers()
        if (res.data) {
          this.workOptions = res.data
        }
      },
      async get_device_list() {
        const res = await get_device_list()
        if (res.data) {
          this.deviceOptions = res.data
          this.deviceCopyOptions = this.deviceOptions
        }
      },
      async get_item_list() {
        const res = await get_item_list()
        if (res.data) {
          this.itemOptions = res.data
          this.itemCopyOptions = res.data
        }
      },
      async getDetail() { // 获取详情
        if (this.id) {
          const res = await defect_resources({
            params: {
              id: this.id,
              scheduledId: this.scheduledId,
            }
          })
          if (res.data) {
            this.itemList = res.data.itemList
            this.deviceList = res.data.deviceList
            this.detail = res.data
            this.get_device_list()
            this.get_item_list()
          }
        }
      },
      async getList(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {
              name: '',
              code: '',
              status: ''
            }
            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 10
            }
          }
          // this.tabs携带
          // console.log(this.paramForm,'this.paramForm')
          // let res = await actManage(this.paramForm)
          // if(res){
          //     this.list = res.data;
          //     this.total = res.page.total_num;
          //     this.page_size = res.data.per_page ? parseInt(res.data.per_page) : 20;
          // }
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
        this.getList()
      },
      handleClassifyListChange(v) {
        console.log(v, 'v')
      },
      async operHandle() {
        this.$router.push({
          path: '/orderManagement'
        })
      },
      closeDia() {
        this.info = []
      },
      async confirm() {
        try {
          if (this.flag) {
            this.flag = false

            console.log(this.deviceList)
            console.log(this.itemList)

            let devices = []
            let device = {}
            if (this.deviceList.length > 0) {
              this.deviceList.map(r => {
                device = {
                  "sourceDeviceNo": r.deviceNo,
                  "targetDeviceNo": r.label
                }
                devices.push(device)
              })
            }

            let items = []
            let item = {}
            if (this.itemList.length > 0) {
              this.itemList.map(r => {
                item = {
                  "sourceItemNo": r.itemNo,
                  "targetItemNo": r.label
                }
                items.push(item)
              })
            }

            let param = {
              "id": this.id,
              "itemDataList": items,
              "deviceDataList": devices
            }

            await this.$confirm('是否按照此修改后的名单作为新的默认名单？', '分配确认', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })

            let res = await update_resources({
              params: param
            })
            this.$message({
              message: res.message,
              type: 'success'
            });

            setTimeout(() => {
              this.$router.push({
                path: '/orderManagement'
              })
            }, 1)
          }
        } finally {
          setTimeout(() => this.flag = true, 1000)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input1 {
    width: 200px;
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

  table {
    min-height: 500px;
  }
</style>
