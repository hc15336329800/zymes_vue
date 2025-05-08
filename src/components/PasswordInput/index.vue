<template>
  <div style="">
    <el-form label-position="right" :model="pwdInputForm" ref="pwdInputFormRef" :rules="pwdInputRule"
             label-width="80px">
      <el-form-item :label="lableTitle" prop="pwdInput">
        <el-input v-model.trim="pwdInputForm.pwdInput" :placeholder="pwdPlaceholder" @change="sendPwd"
                  style="width: 360px" show-password>
        </el-input>
      </el-form-item>
      <el-form-item v-if="strengthMatch && pwdInputForm.pwdInput !== '' && pwdInputForm.pwdInput !== undefined"
                    align="center" label-width="0">
        <!-- 密码强度显示条 -->
        <table border="0" align="center" style="width: 360px;margin-left: 80px">
          <tr>
            <td width="19%" v-for="(pc, i) in progressColor" :key="i">
              <el-progress :percentage="100" :color="pc" :format="format"></el-progress>
            </td>
            <td width="5%">
              <div class="strength" :style="{color: strengthInfo.color}">{{ strengthInfo.strength }}</div>
            </td>
          </tr>
        </table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import bus from "@/utils/bus"
  import {pwdStrength} from "@/api/structure/pwd";

  export default {
    props: {
      value: {
        type: String,
        required: true,
      },
      // 是否开启密码强度校验 true表示开启密码检测 false表示关闭
      strengthMatch: {
        type: Boolean,
        default: false,
      },
      // 标题
      lableTitle: {
        type: String,
        required: true,
      },
      pwdPlaceholder: {
        type: String,
        required: true,
      },
      // 密码确认的是用来验证两个输入框相等 一个发送一个接收成对出现
      equalSend: {
        type: String,
        default: '',
      },
      // 密码确认的是用来验证两个输入框相等 一个发送一个接收成对出现
      equalReceive: {
        type: String,
        default: '',
      }
    },
    data() {
      // 强度校验
      let defaultColor = '#cccccc'
      const checkPwdStrength = (rule, value, callback) => {
        if (this.strengthMatch && value !== '' && value !== undefined) {
          pwdStrength(value).then(res => {
            let dbStrengthInfo = this.indicator[res.data]
            this.strengthInfo = dbStrengthInfo
            let index = 0
            let level = dbStrengthInfo.level
            for (var key in this.indicator) {
              const si = this.indicator[key]
              this.progressColor[index] = level >= si.level ? si.color : defaultColor
              index++
            }
            // 中级以上
            if (level >= 3) {
              callback();
            } else {
              callback(new Error("密码强度太低"));
            }
          })
        }
      };

      let checkpass = (rule, value, callback) => {
        if (this.equalPassword && this.equalPasswordValue !== '' && value !== this.equalPasswordValue) {
          callback(new Error("密码不一致！"));
        } else {
          callback();
        }
      };
      return {
        progressColor: [defaultColor, defaultColor, defaultColor, defaultColor, defaultColor],
        equalPasswordValue: '',
        equalPassword: this.equalSend !== '' && this.equalReceive !== '' && this.equalSend !== this.equalReceive,
        pwdInputForm: {
          pwdInput: ''
        },
        strengthInfo: {
          pwdPass: false
        },
        indicator: {
          "EASY": {
            color: "red",
            strength: "弱",
            level: 1
          },
          "MEDIUM": {
            color: "orange",
            strength: "低",
            level: 2
          },
          "STRONG": {
            color: "yellow",
            strength: "中",
            level: 3
          },
          "VERY_STRONG": {
            color: "blue",
            strength: "高",
            level: 4
          },
          "EXTREMELY_STRONG": {
            color: "green",
            strength: "强",
            level: 5
          }
        },
        pwdInputRule: {
          pwdInput: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {validator: checkpass, trigger: "blur"},
            {validator: checkPwdStrength, trigger: ['blur', 'change']}
          ]
        }
      };
    },
    computed: {},
    methods: {
      format(percentage) {
        return percentage === 100 ? '' : `${percentage}%`;
      },
      sendPwd() {
        this.$emit('update:value', this.pwdInputForm.pwdInput)
        if (this.equalPassword) {
          bus.$emit(this.equalSend, this.pwdInputForm.pwdInput);
        }
      },
      // 验证当前表单
      validateForm() {
        return new Promise((resolve, reject) => {
          this.$refs['pwdInputFormRef'].validate(valid => {
            // 不通过
            if (!valid) {
              reject()
            }
          })
          resolve()
        })
      }
    },
    watch: {
      // 检测密码强度
      value: function (newVal) {
      },
    },
    mounted() {
      if (this.equalPassword) {
        bus.$on(this.equalReceive, data => {
          this.equalPasswordValue = data
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-progress {
    width: 120%;
  }

  .strength {
    font-size: 13px;
    color: #271E25;
    position: relative;
    top: 5px;
    left: 0;
    transition: 0.5s all ease;
  }

  .show_pwd {
    cursor: pointer;
    user-select: none;
    padding-right: 5px;
  }
</style>
