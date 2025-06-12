<template>
  <div class="w_100 pt_30 plr_30 ptb_30 process-allocation" v-loading="listLoading"
       element-loading-spinner="el-icon-loading">

    <div class="procedure" v-for="(item,k) in list" :class="k==list.length-1?'last-child':''" :key="k">
      <div class="procedure-info">
        <ul class="clearfix">
          <li style="margin-right:0px;">
            <span class="procedure-number">{{ k+1 }}</span>
          </li>
          <li class="procedure-name" style="display:flex;align-items:center;">
            {{item.procedureName}}({{item.procedureCode }})
          </li>
          <li class="procedure-opt" style="margin-left:0px;">
            <span class="procedure-enterprise public02">产品名称：</span>
            <span class="canEdit">{{item.itemName }}</span>
          </li>
          <li class="procedure-opt" style="margin-left:0px;">
            <span class="procedure-enterprise public02">图纸号：</span>
            <span class="canEdit">{{ item.bomNo }}</span>
          </li>
          <li class="procedure-opt" style="margin-left:0px;">
            <span class="procedure-enterprise public02">外协总数：</span>
            <!-- @click="handleEdit" -->
            <span class="canEdit">{{ item.allocCount }}</span>
          </li>

          <li class="procedure-opt">
            <span class="procedure-duty public02">已外协数量：</span>
            <span class="canEdit">{{ item.pubCount }}</span>
          </li>
          <li class="procedure-opt">
            <span class="procedure-status public02">已生产数量：</span>
            <span class="canEdit">{{ item.prodCount }}</span>
          </li>
          <li class="procedure-opt">
            <span class="procedure-status public02">待分配数量：</span>
            <span class="canEdit">{{ item.waitCount }}</span>
          </li>
        </ul>
        <i class="el-icon-caret-bottom icons" v-if="item.shows" @click="item.shows=!item.shows"></i>
        <i class="el-icon-caret-right icons" v-else @click="item.shows=!item.shows"></i>
      </div>
      <div class="procedure-content" v-if="item.shows">

        <div class="add-box">
          <outWorkerTable ref="submits" v-if="item.dtlList" :workOptionsVal="workOptions"
                          :submitList="item.dtlList"></outWorkerTable>
        </div>

      </div>
    </div>
    <div style="width:100%;text-align:center;">
      <el-button type="primary" plain class @click="back()">返回</el-button>
      <el-button type="primary" class @click="save()">保存</el-button>
    </div>
  </div>
</template>
<script>
  import {
    get_all_outer,
    outer_list,
  } from '@/api/order'
  import {pub_batch_outer} from '@/api/outsourcingManagement'

  export default {
    name: 'outerAllocDetail',
    data() {
      return {
        listLoading: false,
        paramForm: {},
        allRroups: null,
        list: [],
        workOptions: [],
        modelTypes: [],
        modelTypeName: null,
        // 分页
        pages: {
          total: 0,
          page_num: 1,
          page_size: 100
        }
      }
    },
    components: {
      outWorkerTable: () => import('./outWorkerTable.vue')
    },
    methods: {
      async get_all_outer() { // 获取员工信息
        const res = await get_all_outer()
        if (res.data) {
          this.workOptions = res.data
        }
      },
      back() {
        this.$router.push({
          name: "outsourcingManagementOrderOuter"
        })
      },
      async save() {
        var arr = []
        this.list.forEach(item => {
          arr.push({
            id: item.id,
            dtlList: item.dtlList || []
          })
        })
        var result = await pub_batch_outer({
          params: {
            pubDtls: arr
          }
        })
        this.$message({
          type: 'success',
          message: '提交成功'
        })
        await this.get_out_list()
      },
      async get_out_list(str) {
        this.listLoading = true
        try {
          if (str == 'clear') {
            this.paramForm = {}

            this.pages = {
              total: 0,
              page_num: 1,
              page_size: 100
            }
          }
          var paramsId = JSON.parse(this.$route.query.id)
          const res = await outer_list({
            params: {
              ids: paramsId
            }
          })
          this.listLoading = false
          if (res.data) {
            this.list = res.data
            this.list.forEach(item => {
              this.$set(item, 'count', item.toAllocCount - 0)
              this.$set(item, 'shows', true)
              item.dtls.forEach(item1 => {
                // item1.allocCount=item1.outerCount
                this.$set(item1, 'allocCount', item1.outerCount)
              })
              this.$set(item, 'dtlList', item.dtls || [])
            })
          }
        } finally {

        }
      }
    },
    async created() {
      await this.get_all_outer()
      await this.get_out_list()


    },
    async activated() {
      await this.get_all_outer()
      await this.get_out_list('clear')
    }
  }
</script>
<style lang="scss" scoped>
  .process-allocation {
    .procedure {
      background: #fff;
      margin-top: 20px;
      font-size: 16px;
      border-bottom: 15px solid #f6f8fa;
      padding: 20px 28px;

      &.last-child {
        border-bottom: none;
      }

      .add-box {
        // width: 50%;
        display: flex;
        align-items: flex-start;

        div {
          &:first-child {
            width: 160px;
          }

          &:last-child {
            width: calc(100% - 160px);
            // border: 2px solid #eee;
          }
        }
      }

      .procedure-content {
        border: 1px #eee solid;
        border-top: none;
        padding: 10px;
      }

      .procedure-info {
        position: relative;
        background: #e9f4ff;
        padding-right: 20px;
        border: 1px #fafafa solid;

        .icons {
          position: absolute;
          right: 10px;
          top: 20px;
          font-size: 22px;
          color: #999999;
          cursor: pointer;
        }

        ul {
          padding-left: 10px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .canEdit {
          color: #556490;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
        }

        li {
          float: left;
          list-style: none;
          margin-right: 20px;

          a {
            text-decoration: none;
            color: #333;
            line-height: 18px;
            font-weight: 400;
          }
        }

        .procedure-number {
          font-size: 26px;
          color: #d3d2d2;
          font-weight: bold;
          position: absolute;
          left: -34px;
        }

        .procedure-name {
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: bold;
          color: #333;
          cursor: pointer;
        }

        .procedure-opt {
          margin: 0 20px 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .procedure-data {
          margin-left: 20px;
          margin-right: 33px;
        }

        .public01 {
          font-size: 16px;
          font-weight: bold;
          color: red;
          height: 40px;

          display: inline-block;
          margin-right: 20px;

          i {
            display: inline-block;
            //   background: url(../../../../assets/customer/customer-03.png) no-repeat 0px
            //     0px;
            width: 18px;
            height: 18px;
            margin-top: 10px;
            margin-right: 4px;
            float: left;
          }
        }

        .public02 {
          font-size: 16px;
          color: #333;
          font-weight: 400;
        }

        li {
          &:last-child {
            margin-right: 0px;
          }
        }
      }

      .procedure-list {
        .list-01 {
          border: 2px #eee solid;
          border-bottom: none;

          .list-department {
            border-right: none;
          }
        }

        .public03 {
          .list-add {
            margin-top: 16px;
            border: 1px #eee solid;
            border-top: none;
            height: 195px;
            overflow: hidden;

            .list-work {
              height: 137px;
              overflow-y: scroll !important;

              p {
                color: #666;
                font-size: 16px !important;
                font-weight: 400;
                margin: 5px 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;

                a {
                  color: #666;
                }
              }

              .work-result {
                margin: 5px 20px;
                font-size: 16px !important;
                color: #666;

                span.resultContent > span {
                  color: red;
                  font-weight: bold;
                  font-size: 16px !important;
                }
              }
            }
          }
        }

        .public03 {
          .list-public {
            display: block;
            cursor: pointer;
            text-decoration: none;
            font-size: 16px !important;
            position: relative;
            font-weight: bold;
            color: #333;
            height: 44px;
            line-height: 44px;
            background: #fafafa;
            border: 1px #eee solid;
            padding-left: 20px;

            .contactsModal {
              display: inline-block;
              width: 100%;
            }

            i {
              display: inline-block;
              width: 16px !important;
              height: 16px !important;
              float: right;
              margin-top: 16px;
              margin-right: 16px !important;
            }
          }
        }
      }

      .procedure-list {
        overflow: hidden;
      }
    }
  }
</style>
