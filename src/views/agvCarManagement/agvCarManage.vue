<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" class="query-form commen-search" :inline="true">
      <el-form-item label="叉车名称" class="condition">
        <el-select v-model="queryParams.dialog.agvName" placeholder="请选择" style="width: 187px;"  @visible-change="loadData($event)">
          <el-option
            v-for="item in queryParams.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="isDisabled(item.value)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起始点工位" class="condition">
        <el-select v-model="queryParams.dialog.begin" placeholder="请选择" style="width: 187px;">
          <el-option
            v-for="dict in stationList"
            :key="dict.station"
            :label="dict.station"
            :value="dict.station"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="起始点库位" class="condition">
        <el-select v-model="queryParams.dialog.kuwei" placeholder="请选择" style="width: 187px;" @visible-change="getStation">
          <el-option
            v-for="item in locationList"
            :key="item.location"
            :label="item.location"
            :value="item.location"
          />
        </el-select>
      </el-form-item>

      <el-form-item class="commen-button">
        <el-button type="primary" @click="sendto">运送</el-button>
      </el-form-item>
      <el-form-item></el-form-item>
    </el-form>
    <el-dialog title="送达信息填报" :visible.sync="queryParams.dialogShow" width="480px">
      <el-form
        :model="queryParams.form"
        class="commen-form"
        :rules="queryParams.rules"
        ref="form"
        label-width="80px"
      >
        <el-form-item prop="procedureName" label="agv叉车名称" class="condition" label-width="100px">
          <el-input v-model="queryParams.dialog.agvName + '号AGV叉车'" :disabled="true"/>
        </el-form-item>
        <el-form-item label="起始命令字" class="condition" prop="groupId"  label-width="100px">
          <el-input v-model="queryParams.dialog.beginCmd" :disabled="true"/>
        </el-form-item>
        <el-form-item label="起始点" class="condition" prop="groupId"  label-width="100px">
          <el-input v-model="queryParams.dialog.begin + '号工位' + queryParams.dialog.kuwei + '号库位'" :disabled="true"/>
        </el-form-item>
        <el-form-item prop="realCount" label="结束命令字"  label-width="100px">
          <el-input v-model="queryParams.dialog.endCmd" :disabled="true"/>
        </el-form-item>
        <el-form-item label="结束点工位" class="condition"  label-width="100px">
          <el-select v-model="queryParams.dialog.end" placeholder="请选择"  @change="getStation">
            <el-option
              v-for="dict in stationendList"
              :key="dict.station"
              :label="dict.station"
              :value="dict.station"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结束点库位" class="condition" label-width="100px">
          <el-select v-model="queryParams.dialog.location" placeholder="请选择">
            <el-option
              v-for="item in locationendList"
              :key="item.location"
              :label="item.location"
              :value="item.location"
              :disabled="item.status =='1' ? false : true"
            />
          </el-select>
        </el-form-item>
        <div class="dialog-footer" style="text-align: center;width:100%;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

import {addSendInfo} from "@/api/agvCarManagement/agvCarManage";
import {selectUsingCar} from "@/api/agvCarManagement/agvCarManage";
import {getStation} from "@/api/agvCarManagement/agvCarManage";

export default {
  components: {
    BomNoSelect: () => import('@/components/Item/BomNo')
  },
  data() {
    return {
      queryParams: {
        form: {},
        check:'',
        data:[],
        title: '',
        dialogShow: false,
        test: '',
        rules: '',
        reportForm: {},
        options: [
          { label: 'AGV叉车139', value: 'Fork_139' },
          { label: 'AGV叉车140', value: 'Fork_140' },
        ],
        dialog:{
          beginCmd:'取货',
          endCmd:'放货',
          end:'',
          location:'',
          begin: '',
          kuwei: '',
          agvName:''
        }
      },
      disabledValues: [],
      stationList: [],
      locationList: [],
      stationendList: [],
      locationendList: []
    }
  },
  created() {
    // this.initializePage();
    this.getStation();
  },
  methods: {
    /** 页面初始化 */
    initializePage(){
      selectUsingCar({ params: this.queryParams.dialog}).then(res => {
        this.queryParams.data = res.data;
        for(let i=0; i<this.queryParams.data.length; i++){
          this.disabledValues.push(res.data[i].agvName);
        }
      })
    },
    getStation(){
      getStation({ params: this.queryParams.dialog}).then(res => {
        if(this.queryParams.dialog.begin != ''){
          this.locationList = res.data;
          this.locationendList = res.data;
        }else{
          this.stationList = this.uniqueName(res.data);
          this.stationendList = this.uniqueName(res.data);
          this.queryParams.dialog.begin = localStorage.getItem('begin') || '';
        }
      })
    },
    /** 去除重复名称数据 */
    uniqueName(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.station) && res.set(arr.station, 1));
    },
    /** 设置正在使用中的叉车不可选 */
    isDisabled(value) {
      return this.disabledValues.includes(value);
    },
    /** 送达按钮操作 */
    sendto() {
      this.queryParams.dialogShow = true;
    },
    cancel() {
      this.queryParams.dialogShow = false
      this.queryParams.reportForm = {}
      this.$refs['reportForm'].clearValidate()
    },
    submitForm() {
      addSendInfo({ params: this.queryParams.dialog}).then(res => {
        this.$message({
          message: '运送成功',
          type: 'success'
        })
        this.queryParams.dialogShow = false;
        window.location.reload();
      })
    },
    loadData(visible) {
      this.disabledValues = [];
      this.queryParams.options = []; // 清空选项
      if (visible) {
        this.queryParams.options = [
          { label: 'AGV叉车139', value: 'Fork_139' },
          { label: 'AGV叉车140', value: 'Fork_140' },
        ];
        this.initializePage();
      }
    }
  },
  mounted() {
    // 在页面加载时尝试恢复上次的选择
    // this.queryParams.dialog.begin = localStorage.getItem('begin') || '';
  },
  watch: {
    'queryParams.dialog.begin':{
      handler(newValue){
        localStorage.setItem('begin', newValue);
      },
      deep:true
    }
  }
}
</script>
