<template>
  <!-- <div class="div-editable"
    :contenteditable="pageName=='detail' && pageName2=='detail2'?true:pageName=='detail'?false:true" v-html="innerText"
    @input="changeText" @focus="isChange = false" @keydown="onkeydown" @mousedown="mousedown" @blur="blurFunc"></div> -->
  <input class="focusIpt" @change="changeText(innerText)"
         :disabled="!(pageName=='detail' && pageName2=='detail2'?true:pageName=='detail'?false:true)"
         v-model="innerText" @focus="isChange = false" @keydown="onkeydown" @mousedown="mousedown" @blur="blurFunc">
</template>

<script>
  export default {
    name: 'DivEditable',
    props: {
      pageName: {
        type: String,
        default: ''
      },
      idx: {
        type: Number,
        default: 0
      },
      idx2: {
        type: Number,
        default: 0
      },
      name: {
        type: String,
        default: ''
      },
      pageName2: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      }
    },
    created() {

    },
    mounted() {
    },
    data() {
      return {
        tempIndex: 0,
        tempIndex2: 0,
        tempName: "",
        keyCodeCtrl: 0,
        keyCodeV: 0,
        ifClick: false,
        innerText: this.value,
        isChange: true
      }
    },
    watch: {
      value() {
        if (this.isChange) {
          this.innerText = this.value
        }
      }
    },
    methods: {
      //监听鼠标右键粘贴事件
      mousedown(e) {
        if (e.button == 2) {
          this.clippedRange(this.tempIndex2, this.tempIndex2, this.tempIndex2);
        }
      },
      //监听键盘事件ctrl+V
      onkeydown(e) {
        let seft = this;
        if (e.which == "17") {
          seft.keyCodeCtrl = 1;
        }
        if (e.which == "86") {
          seft.keyCodeV = 1;
        }
        if (seft.keyCodeCtrl == 1 && seft.keyCodeV == 1) {
          this.clippedRange(this.tempIndex2, this.tempIndex2, this.tempIndex2);
        }
      },
      //获取粘贴值
      clippedRange(idx, idx2, name) {
        let seft = this;
        document.addEventListener("paste", (event) => {
          let clipdata = event.clipboardData || window.clipboardData;
          const html = event.clipboardData.getData("text/html");
          const $doc = new DOMParser().parseFromString(html, "text/html");
          // 加载所有的行
          console.log($doc)
          const $trs = Array.from($doc.querySelectorAll("table tr"));
          console.log($trs)
          var list = []
          $doc.querySelectorAll("table tr").forEach((item, k) => {
            var itemInnerText = item.innerText.replace(/\r|\n/ig, "").trim()
            console.log(itemInnerText)
            list.push(itemInnerText)
          })
          console.log(list)
          if (list.length > 0) {
            seft.$emit('listChange', list)
          }
          this.isChange = true
        });
      },
      changeText(val) {
        // console.log(val)
        this.$emit('input', val)
        // this.$emit('input', this.$el.innerHTML)
      },
      blurFunc() {
        this.isChange = true
        this.$emit('blurFunc')
      }
    }
  }
</script>

<style lang="scss">
  .div-editable, .focusIpt {
    width: 100%;
    height: 100%;
    border: none;
    /* overflow-y: auto; */
    word-break: break-all;
    outline: none;
    user-select: text;

    // white-space: pre-wrap;
    /* text-align: left; */
    &[contenteditable=true] {

      /* user-modify: read-write-plaintext-only; */
      &:empty:before {
        content: attr(placeholder);
        display: block;
        color: #ccc;
      }
    }
  }
</style>
