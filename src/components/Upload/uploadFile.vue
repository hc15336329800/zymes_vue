<template>
  <div>
    <el-upload
      class="upload-demo"
      :class="btnType=='pic'?'avatar-uploader flex flex_y_end':''"
      ref="upload"
      action="https://upload.qiniup.com"
      :on-change="fileChange"
      :data="extParm"
      :on-progress="fileProgress"
      :http-request="uploadFileInfo"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :auto-upload="btnType=='pic'?true:false"
      :accept="accept"
      :multiple="multiple"
      :show-file-list="false"
      :file-list="uploadFileList"
    >
      <template #trigger v-if="btnType=='pic'">
        <div class="avatar">
          <img v-if="attachment.length>0" v-for="(item,k) in attachment" :key="k" :src="item.pic">
        </div>

        <span class="editBtn">上传图片</span>
        <i v-if="attachment.length==0" class="el-icon-plus avatar-uploader-icon"></i>
      </template>
      <template #trigger v-else>
        <el-button size="small">选取文件</el-button>
      </template>
      <el-button
        class="right ml_20"
        v-if="btnType!='pic'"
        :disabled="!uploadFileList.length"
        size="small"
        type="primary"
        @click="submitUpload"
      >上传</el-button>
    </el-upload>
    <!-- 文件列表信息 -->
    <div v-if="btnType!='pic'">
      <div v-if="uploadFileList.length" class="progress-box mb_30">
        <div class="list-item">
          <div class="item-name">名称</div>
          <div class="item-size">大小</div>
          <div class="item-progress">文件进度</div>
          <div class="item-status">状态</div>
          <div class="item-operate">操作</div>
        </div>
        <div v-for="(item, index) in uploadFileList" :key="item.uid">
          <div class="list-item">
            <div class="item-name">
              <span>{{ index + 1 }}.{{ item.name }}</span>
            </div>
            <div class="item-size">{{ getFileSizeFun(item.size) }}</div>
            <div class="item-progress">
              <el-progress :percentage="Number(item.percentage.toFixed(0))"/>
            </div>
            <div class="item-status">
              <i :class="fileStatuIcon(item.status)"></i>
              {{ item.status | fileStatus }}
            </div>
            <div class="item-operate">
              <el-popconfirm hideIcon title="确定删除当前文件吗？" @confirm="delFile(item.name, index)">
                <template #reference>
                  <span class="coldel pointer">删除</span>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="progress-box">请上传文件</div>
    </div>
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import { getFileSize } from '@/utils/index'
import {
  fileUploadServer,
  uploadBefore,
  uploadSave,
  fileUploadDel
} from '@/api/file'

// 单个文件的状态 对应描述
const fileStatus = {
  ready: {
    code: 'ready',
    name: '待上传'
  },
  wait: {
    code: 'wait',
    name: '待上传'
  },
  uploading: {
    code: 'uploading',
    name: '上传中'
  },
  success: {
    code: 'success',
    name: '成功'
  },

  fail: {
    code: 'fail',
    name: '失败'
  },
  error: {
    code: 'error',
    name: '失败'
  },
  secondPass: {
    code: 'secondPass',
    name: '已秒传'
  },
  pause: {
    code: 'pause',
    name: '暂停'
  },
  resume: {
    code: 'resume',
    name: '恢复'
  }
}
export default {
  props: {
    models: {
      //新建流程传入的对象
      type: Object
    },
    //做数据回显时传入的文件列表数据
    //每一项格式{fileExt: "", fileName: "",pic: "",fileSize:"",id:"" } 我这里是这样的
    curFileList: {
      type: Array,
      default() {
        return []
      }
    },
    //上传文件的文件类型
    accept: {
      type: String,
      default() {
        return ''
      }
    },
    //按钮类型  pic  btn
    btnType: {
      type: String,
      default() {
        return ''
      }
    },
    //是否多选，默认多选
    multiple: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 传过来的参数
    paramData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      show: true,
      getFileSizeFun: getFileSize,
      uploadFileList: [], //上传文件列表  {name,size,percentage,status,uid}  uid唯一标识
      attachment: [] //已上传文件列表 与父组件的数据对应
    }
  },

  filters: {
    fileStatus(status) {
      return fileStatus[status].name
    }
  },
  computed: {
    //文件上传状态的图标
    fileStatuIcon() {
      return function(status) {
        let className = ''
        switch (status) {
          case 'uploading':
            className = 'el-icon-loading'
            break
          case 'success':
          case 'secondPass':
            className = 'el-icon-circle-check'
            break
          case 'error':
            className = 'el-icon-circle-close'
            break
        }
        return className
      }
    },
    extParm() {
      const p = {
        bizId: (this.paramData && this.paramData.bizId) || null
      }
      return p
    }
  },
  mounted() {
    if (this.btnType == 'pic') {
      this.show = false
    }
  },
  watch: {
    curFileList() {
      // 数据回显时 将父组件传来的文件列表同步显示到页面
      this.uploadFileList = this.curFileList.map(item => {
        return {
          fileUrl: item.pic,
          name: item.fileName, //文件名称(必须)
          size: item.fileSize, //文件大小(必须)
          percentage: 100, //设置上传进度为100
          status: 'success' //设置上传状态为成功
        }
      })
      this.attachment = this.curFileList
    }
  },
  methods: {
    //手动上传文件
    submitUpload() {
      this.$refs.upload.submit()
    },

    //附件改变（增加删除时）
    fileChange(file, fileList) {
      const index = this.uploadFileList.findIndex(
        item => item.name == file.name
      )
      if (index == -1) {
        this.uploadFileList = fileList
      }
      if (!this.multiple) {
        this.uploadFileList = [file]
      }
    },

    /**
     * @description: 上传中的处理 让文件列表数据于显示的文件列表数据相同
     * @param {*} event
     * @param {*} file
     * @param {文件列表} fileList
     * @return {*}
     */
    fileProgress(event, file, fileList) {
      this.uploadFileList = fileList
    },

    /**
     * @description: 上传之前的文件处理
     * @param {待上传文件信息} file
     * @return {*}
     */
    beforeUpload(file) {},

    /**
     * @description: 上传成功后的向父组件同步文件数据
     * @param {上传成功后接口返回的数据} res
     * @param {当前上传的文件信息} file
     * @return {*}
     */
    handleSuccess(res, file) {
      const fileName = file.name
      const fileExt = fileName.substring(
        fileName.lastIndexOf('.') + 1,
        fileName.length
      )
      const fileSize = file.raw.size
      const id = res.data.id
      const pic = res.data.pic //七牛云上绑定的域名 拼接了这个key 就是你上传文件的地址了
      //上传成功后重组数据向父组件传对应格式的数据 与props里的curFileList数据格式对应
      const data = {
        fileExt,
        fileName,
        pic,
        fileSize,
        id
      }
      if (this.multiple) {
        this.attachment.push(data)
      } else {
        this.attachment = [data]
      }
      if (this.btnType == 'pic') {
        this.show = false
      }
      this.$emit('syncFile', this.attachment)
    },

    //上传错误处理
    handleError(err) {
      this.$message.error(err)
    },

    /**
     * @description: 删除文件  先判断此文件是否已经上传成功
     * @param {*文件名称} name
     * @param {*数据在uploadFileList的当前下标} index
     * @return {*}
     */
    delFile(name, index) {
      const attachmentIndex = this.attachment.findIndex(item => {
        return item.fileName == name
      })
      //如果已经上传了并且是添加的时候 就调用接口删除  否则直接删除数组数据
      if (attachmentIndex !== -1) {
        const uploadFileInfo = this.attachment[attachmentIndex]
        let pid = uploadFileInfo.id
        if (pid) {
          // bizId做批量删除使用
          const data = { params: { bizId: '', ids: [pid] } }
          fileUploadDel(data).then(res => {
            this.uploadFileList.splice(index, 1)
            this.attachment.splice(attachmentIndex, 1)
            this.$emit('syncFile', this.attachment)
          })
          //更新的时候删除文件  直接删除文件
        } else {
          this.uploadFileList.splice(index, 1)
          this.attachment.splice(attachmentIndex, 1)
          this.$emit('syncFile', this.attachment)
        }
      } else {
        //如果还未上传成功
        //如果在上传中 调用el-upload的abort停止上传
        if (this.uploadFileList[index].status == 'uploading') {
          this.$refs.upload.abort(this.uploadFileList[index])
          this.uploadFileList.splice(index, 1)
        } else {
          this.uploadFileList.splice(index, 1)
        }
      }
    },

    upload(token, key, file, next, error, complete) {
      // 因人而异，自行解决
      const putExtra = {
          // fname: file.name, // fname: string，文件原文件名
          params: {}, // params: object，用来放置自定义变量
          mimeType: null // mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
        },
        config = {
          useCdnDomain: true,
          region: qiniu.region.z0 //z0华东区域 z1华北区域  z2代表华南区域  na0北美区域   as0新加坡区域
        }

      let observable = qiniu.upload(file, key, token, putExtra, config)
      let subscription = observable.subscribe(next, error, complete)
      return subscription
    },

    uploadFileInfo(request) {
      const { file } = request
      // 文件名称
      const fileName = file.name
      // 文件大小
      const fileSize = file.size / 1024 / 1024
      const uid = file.uid
      const index = this.uploadFileList.findIndex(item => item.uid == uid)
      // 如果4M 直接上传到七牛
      if (fileSize > 5) {
        this.uploadFileQiniu(request, fileName, index, this.extParm.bizId || '')
      } else {
        this.uploadFileWeb(request, file, index)
      }
    },

    // 上传七牛云
    uploadFileQiniu(request, fileName, index, bizId) {
      const { file } = request
      let id = ''
      let that = this
      const data = { params: { fileName: fileName, bizId: bizId || '' } }
      uploadBefore(data).then(res => {
        id = res.data.id
        let token = res.data.token
        that.upload(
          token,
          id,
          file,
          next => {
            let total = next.total
            that.$set(that.uploadFileList[index], 'percentage', total.percent)
            that.$set(that.uploadFileList[index], 'status', 'uploading')
          },
          err => request.onError(err),
          comp => {
            uploadSave({ params: { id: id } }).then(res => {
              request.onSuccess(res)
            })
          }
        )
      })
    },

    // 直接上传到后端服务
    uploadFileWeb(request, file, index) {
      const form = new FormData()
      form.append('uploadFiles', file)
      form.append('bizId', this.extParm.bizId || '')
      let that = this
      fileUploadServer(form).then(res => {
        that.$set(that.uploadFileList[index], 'percentage', 100)
        that.$set(that.uploadFileList[index], 'status', 'uploading')
        request.onSuccess(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.font13 {
  font-size: 13px;
}

.col2c {
  color: #2c6ee5;
}

.coldel {
  color: #e91c47;
}

.pointer {
  cursor: pointer;
}

.in_block {
  display: inline-block;
}

.vertical {
  display: flex;
  align-items: center;
  justify-content: center;
}

.verticall {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.ml_10 {
  margin-left: 10px;
}

.mr_10 {
  margin-right: 10px;
}

.progress-box {
  width: 100%;
  color: #666;
  font-size: 12px;
  .list-item {
    padding: 8px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 25px;
    position: relative;

    .item-name {
      flex: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 6px;
    }
    .item-size {
      flex: 1;
    }
    .item-progress {
      flex: 2;
      padding-right: 30px;
    }
    .item-status {
      flex: 1;
      .el-icon-circle-check {
        color: #67c23a;
      }
      .el-icon-circle-close {
        color: #f00;
      }
    }
    .item-operate {
      flex: 1;
    }
  }
}
</style>
