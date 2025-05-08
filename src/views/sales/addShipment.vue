<template>
  <div>
    <!-- v-if="!($route.query.type=='detail' &&( $route.query.isDisabled_flag=='false' || $route.query.isDisabled_flag=='true' && $route.query.backPage=='orderPage' ))" -->
    <el-card class="flex topInfo">
      <el-form :inline="true" ref="paramForm" :model="paramForm" label-width="80px" label-position="left">
        <el-form-item label="司机" :rules="[{ required: true, message: '请填写司机', trigger: 'blur' }]">
          <el-input v-model="paramForm.driver"/>
        </el-form-item>
        <el-form-item label="发货时间" :rules="[{ required: true, message: '请选择发货时间', trigger: 'blur' }]">
          <el-date-picker v-model="paramForm.deliveryDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date"
                          placeholder="选择日期"
                          style="width: 187px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="paramForm.customer"/>
        </el-form-item>
        <el-form-item label="目的地">
          <el-input v-model="paramForm.destination"/>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="app-container" style="padding-left:0px;padding-right: 0px;margin:5px;width:800px;">
      <div>

        <div class="waybill" v-for="(item,k) in data" :key="k">
          <div class="flex" style="justify-content: space-between;margin-bottom:10px;">
            <span>{{k+1}}</span>
            <div>
              <i class="el-icon-delete-solid" style="font-size: 18px;cursor: pointer;margin-right:10px;"
                 v-if="$route.query.type!='detail'" @click="deleteDetail(k)"></i>
              <el-checkbox v-model="item.checked"></el-checkbox>
            </div>
          </div>
          <el-row style="border-top:1px solid #000;">
            <el-col :span="24">
              <div class="grid-content bg-purple-dark" style="font-weight: 700;font-size: 15px;text-align: center;">
                中钰机械制造有限公司发运单
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              目的地
            </el-col>
            <el-col :span="5">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''"
                            v-model="item.destination"></div-editable>
            </el-col>
            <el-col :span="3">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''" v-model="item.customer"></div-editable>
            </el-col>
            <!-- <el-col :span="3">

              </el-col>-->
            <el-col :span="2" style="position:relative;">
              发货日期
            </el-col>
            <el-col :span="11">
              <el-date-picker style="width: 100%;" v-model="item.deliveryDate" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" placeholder
                              type="date" :clearable="false"></el-date-picker>
              <!-- <div :contenteditable="true">
                </div>-->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">产品名称</el-col>
            <el-col :span="5">
              <span class="red mr-10">*</span>规格型号
            </el-col>
            <el-col :span="2">
              <span class="red mr-10">*</span>发货计划
            </el-col>
            <el-col :span="1">单位</el-col>
            <el-col :span="2">发货数量</el-col>
            <el-col :span="3">装车人签名</el-col>
            <el-col :span="2">司机</el-col>
            <el-col :span="6">备注</el-col>
          </el-row>
          <el-row v-for="(item2,k2) in item.dtls" :key="k2">
            <el-col :span="3" @click.native="currentEdit(k,k2,'itemName')">
              <div-editable @listChange="listChange" :pageName="$route.query.type=='detail'?'detail':''"
                            v-model="item2.itemName"></div-editable>
            </el-col>
            <el-col :span="5" @click.native="currentEdit(k,k2,'bomNo')">


              <MyRemoteSelect v-model="item2.itemNo" @listChange="listChange"
                              :pageName="$route.query.type=='detail'?'detail':''"
                              :disabled="!!($route.query.id)&&($route.query.isDisabled_flag==='true')"></MyRemoteSelect>
            </el-col>
            <el-col :span="2" @click.native="currentEdit(k,k2,'planCount')">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''"
                            v-model="item2.planCount"></div-editable>
            </el-col>
            <el-col :span="1" @click.native="currentEdit(k,k2,'itemMeasure')">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''"
                            v-model="item2.itemMeasure"></div-editable>
            </el-col>
            <el-col :span="2" @click.native="currentEdit(k,k2,'realCount')">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''"
                            :pageName2="$route.query.type2=='num'?'detail2':''"
                            v-model="item2.realCount"></div-editable>
            </el-col>
            <el-col :span="3" @click.native="currentEdit(k,k2,'loader')">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''" v-model="item2.loader"></div-editable>
            </el-col>
            <el-col :span="2" @click.native="currentEdit(k,k2,'truck')">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''" v-model="item2.truck"></div-editable>
            </el-col>
            <!-- <el-col :span="3">
                <div-editable
                  :pageName="$route.query.type=='detail'?'detail':''"
                  v-model="item2.truckNo"
                ></div-editable>
              </el-col>-->
            <el-col :span="6" @click.native="currentEdit(k,k2,'remark')">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''" v-model="item2.remark"></div-editable>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">制单</el-col>
            <el-col :span="5">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''"
                            v-model="item.preparedBy"></div-editable>
            </el-col>
            <el-col :span="3">发货人</el-col>
            <el-col :span="2">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''" v-model="item.deliverer"></div-editable>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="2"></el-col>
            <el-col :span="3">质检员</el-col>
            <el-col :span="3">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''" v-model="item.qualityBy"></div-editable>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">门卫</el-col>
            <el-col :span="5">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''" v-model="item.doorman"></div-editable>
            </el-col>
            <el-col :span="3">接收人</el-col>
            <el-col :span="2">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''"
                            v-model="item.acceptedBy"></div-editable>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="2">用筐量</el-col>
            <el-col :span="3">
              <div-editable :pageName="$route.query.type=='detail'?'detail':''" v-model="item.boxNum"></div-editable>
            </el-col>
            <el-col :span="3"></el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark" style="font-weight: 500;font-size: 13px;text-align: center;">
                注：黄色单据留司机；蓝色单据留司机；红色单据留财务；白色单据留仓库和销售主管。绿色单据留门卫
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-button type="primary" class @click="add()" v-if="!$route.query.id || $route.name=='editShipment'">新增
      </el-button>
      <!-- <el-button type="primary" icon="el-icon-plus" class="mb_20" >新增一行</el-button> -->
      <div class="w_100 flex_row flex_x_center" style="margin-top: 40px;">
        <el-button type plain class @click="operHandle(1)">返回</el-button>
        <el-button type="primary" class="ml_20" @click="operHandle(2)"
                   v-if="$route.query.type!='detail' || ($route.query.type=='detail' && $route.query.type2=='num')">保存
        </el-button>
        <el-button type="primary" class="ml_20" @click="operHandle(3)"
                   v-if="$route.query.type2 == 'num' ||$route.query.backPage == 'orderPage'">提交
        </el-button>
        <el-button v-if="$route.query.id" type="primary" @click="batchPrint()">批量打印</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    add_new_delivery_page_list,
    edit_new_delivery_page_list,
    detail_new_delivery_page_list,
    update_count,
    submit_new_delivery_page_list
  } from '@/api/order'
  import DivEditable from './divEdit.vue'
  import MyRemoteSelect from './MyRemoteSelect.vue'

  export default {
    components: {
      MyRemoteSelect,
      DivEditable
    },
    data() {
      return {
        editIdx: null,
        value: null,
        paramForm: {},
        data: [{dtls: []}],
        tableList: [
          {
            label: '接收客户',
            value: 'custName'
          },
          {
            label: '图纸号',
            value: 'bomNo'
          },

          {
            label: '需求数量',
            value: 'applyCount'
          },
          {
            label: '车辆',
            value: 'truck'
          },
          {
            label: '操作',
            value: 'procedureCode'
          }
        ],
        list: [{}],
        currentInfo: {},
        listLoading: false
      }
    },
    created() {
      if (this.$route.query.id) {
        this.getDetail(this.$route.query.id)
      } else {
        this.pushDtl()
      }
    },
    methods: {
      currentEdit(idx, idx2, name) {
        this.currentInfo = {
          idx: idx,
          idx2: idx2,
          name: name
        }
      },
      listChange(list) {
        var obj = this.currentInfo
        this.$nextTick(() => {
          this.data[obj.idx].dtls.forEach((item, k) => {
            if (k >= obj.idx2) {
              this.$set(item, obj.name, list[k - obj.idx2])
            }
          })
          setTimeout(() => {
            this.$set(this.data[obj.idx].dtls[obj.idx2], obj.name, list[0])
            var tempArr = JSON.parse(JSON.stringify(this.data))
            this.data = []
            tempArr.forEach(item => {
              this.data.push(item)
            })
            this.$forceUpdate()
          }, 10)
        })
      },
      deleteDetail(k) {
        this.data.splice(k, 1)
      },
      async getDetail(id) {
        var res = await detail_new_delivery_page_list({
          params: {
            id: id
          }
        })
        this.paramForm = res.data
        this.data = res.data.list
        this.data.forEach(item => {
          this.$set(item, 'checked', true)
          if (item.dtls.length != 8) {
            for (var i = item.dtls.length; i < 8; i++) {
              item.dtls.push({})
            }
          }
        })
      },
      pushDtl() {
        for (var k = 0; k < 8; k++) {
          this.data[this.data.length - 1].dtls.push({})
        }
      },
      add() {
        this.data.push({dtls: []})
        this.pushDtl()
      },
      back() {
        if (
          this.$route.query.type2 == 'num' ||
          this.$route.query.backPage == 'orderPage'
        ) {
          this.$router.push({
            name: 'orderShipmentRequest'
          })
        } else {
          this.$router.push({
            name: 'shipmentRequest'
          })
        }
      },

      async operHandle(type, item, index) {
        switch (type) {
          case 1: // 返回
            this.back()

            break
          case 2: // 确认新增
            var dataArr = JSON.parse(JSON.stringify(this.data))
            dataArr.forEach(item => {
              // if (!item.destination) {
              //   this.$message.error('请填写目的地')
              //   throw new Error()
              // }

              // if (!item.deliveryDate) {
              //   this.$message.error('请选择发货日期')
              //   throw new Error()
              // }
              // if(!item.dtls || item.dtls.length == 0){
              //   this.$message.error('请填写规格型号和发货计划')
              //   throw new Error()
              // }
              var newArr = []
              if (item.dtls && item.dtls.length > 0) {
                newArr = item.dtls.filter(itemJSON => {
                  for (var k in itemJSON) {
                    if (k != 'deliveryId' && k != 'id') {
                      return itemJSON[k]
                    }
                  }
                })
                if (newArr.length == 0) {
                  this.$message.error('请填写规格型号和发货计划')
                  throw new Error()
                }
                newArr.forEach(itemDlts => {
                  if (!itemDlts.itemNo) {
                    this.$message.error('请填写规格型号')
                    throw new Error()
                  }
                  if (!itemDlts.planCount) {
                    this.$message.error('请填写发货计划')
                    throw new Error()
                  }
                })
              }
              item.dtls = JSON.parse(JSON.stringify(newArr))
            })
            var res = null
            if (!this.paramForm.driver) {
              this.$message.error('请填写司机')
              return
            }
            if (!this.paramForm.deliveryDate) {
              this.$message.error('请选择发货时间')
              return
            }
            if (this.$route.query.id) {
              if (
                this.$route.query.type == 'detail' &&
                this.$route.query.type2 == 'num'
              ) {
                var res2 = await this.$confirm('修改实际发货数量？', '确认', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                })
                if (res2 == 'confirm') {
                  var res = await update_count({
                    params: {
                      list: dataArr,
                      destination: this.paramForm.destination,
                      customer: this.paramForm.customer,
                      deliveryDate: this.paramForm.deliveryDate,
                      driver: this.paramForm.driver,
                      id: this.paramForm.id
                    }
                  })
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                }
              } else {
                res = await edit_new_delivery_page_list({
                  params: {
                    list: dataArr,
                    destination: this.paramForm.destination,
                    customer: this.paramForm.customer,
                    deliveryDate: this.paramForm.deliveryDate,
                    driver: this.paramForm.driver,
                    id: this.paramForm.id
                  }
                })
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
              }
            } else {
              res = await add_new_delivery_page_list({
                params: {
                  list: dataArr,
                  destination: this.paramForm.destination,
                  customer: this.paramForm.customer,
                  deliveryDate: this.paramForm.deliveryDate,
                  driver: this.paramForm.driver
                }
              })
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            }
            if (
              !(
                this.$route.query.type2 == 'num' ||
                this.$route.query.backPage == 'orderPage'
              )
            ) {
              this.back()
            }
            //
            break
          case 3: // 新增一条
            var res3 = await this.$confirm('更新并提示仓库确认？', '确认', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })
            if (res3 == 'confirm') {
              res = await submit_new_delivery_page_list({
                params: {
                  id: this.$route.query.id
                }
              })
              this.$message({
                message: '提交成功',
                type: 'success'
              })
            }

            break

          default:
        }
      },
      batchPrint() {
        var ids = []
        this.data.forEach(item => {
          if (item.checked) {
            ids.push(item.id)
          }
        })
        if (ids.length == 0) {
          this.$message.error('请勾选要打印的发运单')
          return
        }
        const idStr = ids.join(',')
        const printUrl = `${
          process.env.VUE_APP_BASE_API
        }/api/export/delivery/export?id=${idStr}`
        window.open(printUrl, '_blank')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .waybill {
    margin-bottom: 30px;

    .el-input__prefix {
      display: none;
    }
  }

  ::v-deep .waybill .el-col {
    border: 1px solid #000;
    color: #000;
    /* font-weight: 700; */
    border-top: none;
    border-left: none;
    height: 22px;
    line-height: 22px;
    letter-spacing: -0.1em;
    box-sizing: border-box;
    text-align: center;
    font-family: '宋体';
    font-size: 15px;

    .el-input__prefix {
      display: none;
    }

    .el-date-editor {
      height: 16px;
      background-color: #fff !important;

      input {
        border: none;
        height: 16px;
      }
    }
  }

  ::v-deep .waybill .el-row:first-child .el-col {
    border-top: 1px solid #000;
  }

  ::v-deep .waybill .el-row .el-col:first-child {
    border-left: 1px solid #000;
  }

  ::v-deep .topInfo {
    width: 100%;
    /* align-content: space-between; */
    align-items: center;
    border: none;
  }

  ::v-deep .topInfo .el-form-item {
    margin-right: 20px !important;
  }
</style>
