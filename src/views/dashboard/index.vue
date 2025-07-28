<template>
  <div class style="width:100%;height:100%;">
    <!-- <component :is="currentRole" /> -->
    .
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import adminDashboard from './admin'
  import editorDashboard from './editor'
  import { Notification } from 'element-ui';
  import {getWarnning} from "@/api/order/order";

  export default {
    name: 'Dashboard',
    components: {adminDashboard, editorDashboard},
    data() {
      return {
        currentRole: 'adminDashboard',
        content: null
      }
    },
    computed: {
      ...mapGetters(['roles'])
    },
    mounted() {
      this.showTodoNotification();
    },
    created() {
      if (!this.roles.includes('admin')) {
        this.currentRole = 'editorDashboard'
      }
    },
    methods: {
      showTodoNotification() {
        getWarnning().then(res => {
          this.todos = res.data
          this.todos.forEach(item => {
            if(this.content != null){
              this.content = this.content + ';' +item.data;
            }else{
              this.content = item.data;
            }
          })
          if(this.content != null){
            setTimeout(() => {
              Notification({
                title: '重要提醒',
                message: this.content,
                type: 'info',
                duration: 35000 // 持续时间，单位为毫秒
              });
            }, 1000); // 延迟1秒后显示通知
          }
        })
      }
    }
  }
</script>
