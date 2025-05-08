<template>
  <div id="app">
      <textarea
        rows="3"
        cols="60"
        id="txtContent"
        @keydown="onkeydown"
        @mousedown="mousedown"
      ></textarea>
    <table id="table" border="1"></table>
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        keyCodeCtrl: 0,
        keyCodeV: 0,
      };
    },
    mounted() {
    },
    components: {},
    methods: {
      //监听鼠标右键粘贴事件
      mousedown(e) {
        if (e.button == 2) {
          this.clippedRange();
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
          this.clippedRange();
        }
      },
      //获取粘贴值
      clippedRange() {
        let seft = this;
        document.addEventListener("paste", (event) => {
          let clipdata = event.clipboardData || window.clipboardData;
          const html = event.clipboardData.getData("text/html");
          const $doc = new DOMParser().parseFromString(html, "text/html");
          // 加载所有的行
          const $trs = Array.from($doc.querySelectorAll("table tr"));
          console.log($trs)
          let table = document.getElementById("table");
          $trs.forEach((item) => {
            table.append(item);
          });
          $trs.forEach((item, index) => {
            let item2 = item.getElementsByTagName("td");
            let list = [];
            for (let i = 0; i <= item2.length - 1; i++) {
              list.push(item2[i].innerHTML);
            }
            console.log("数据", list);
          });
        });
      },
    },
  };
</script>

<style scoped>
</style>
