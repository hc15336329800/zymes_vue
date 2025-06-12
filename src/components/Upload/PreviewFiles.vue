<template>
  <div class="preview-file">

    <span v-for="(item,k) in attachment1" :key="k" class="flex flex_y_center">
      {{item.fileName}}
      <i class="el-icon-view ml_20" @click="previewFile(item)"></i>
      <i class="el-icon-download ml_10" @click="downLoadFile(item.pic)"></i>
    </span>
    <el-dialog :visible.sync="fileListDialog" width="90%" class="personnelDialog" center title="文件预览" @close="close">
      <div class="flex flex_y_center flex_x_center">
        <!-- 图片 -->
        <img :src="url" alt v-if="fileType=='image'">
        <!-- pdf,text -->
        <iframe v-if="fileType=='pdf'|| fileType=='txt'" :src="file.url" frameborder="0" :height="height"
                style="width:100%;margin-top:0px;"></iframe>
        <!-- office -->
        <iframe v-if="fileType=='office'" :src="
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        url
      " frameborder="0" :height="height" style="width:100%;margin-top:0px;"></iframe>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getDownloadUrl} from '@/api/file'

  export default {
    name: 'previewFile',
    data() {
      return {
        fileType: null,
        url: '',
        attachment1: [],
        fileListDialog: false,
        height: document.documentElement.clientHeight - 160
      }
    },
    props: {
      models: {
        type: Object,
        default() {
          return null
        }
      },
      attachment: {
        type: Array,
        default() {
          return []
        }
      }
    },
    watch: {
      "attachment"(newVal, oldVal) {

      }
    },
    mounted() {
      if (this.models) {
        this.attachment1 = this.models.attachment
      } else {
        this.attachment1 = this.attachment
      }
    },
    methods: {
      close() {
        this.url = ''
        this.fileType = ''
      },
      previewFile(item) {
        this.fileListDialog = true
        this.fileType = item.fileName && this.matchType(item.fileName)
        this.url = item.pic
      },

      matchType(fileName) {
        // 后缀获取
        var suffix = fileName.substring(
          fileName.lastIndexOf('.') + 1,
          fileName.length
        )
        // 获取类型结果
        var result = ''

        // fileName无后缀返回 false
        if (!suffix) {
          result = false
          return result
        } else {
          suffix = suffix.toLowerCase()
        }
        // 图片格式
        var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
        // 进行图片匹配
        result = imglist.some(function (item) {
          return item == suffix
        })
        if (result) {
          result = 'image'
          return result
        }
        // 匹配txt
        var txtlist = ['txt']
        result = txtlist.some(function (item) {
          return item == suffix
        })
        if (result) {
          result = 'txt'
          return result
        }
        // 匹配 excel
        var officelist = ['xls', 'xlsx', 'doc', 'docx', 'ppt']
        result = officelist.some(function (item) {
          return item == suffix
        })
        if (result) {
          result = 'office'
          return result
        }

        // 匹配 pdf
        var pdflist = ['pdf']
        result = pdflist.some(function (item) {
          return item == suffix
        })
        if (result) {
          result = 'pdf'
          return result
        }

        // 其他 文件类型
        result = 'other'
        return result
      },
      downLoadFile(id) {
        getDownloadUrl({
          params: id
        }).then(res => {
          window.open(res.data)
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .preview-file {
    i {
      font-size: 16px;
      cursor: pointer;
    }
  }
</style>
