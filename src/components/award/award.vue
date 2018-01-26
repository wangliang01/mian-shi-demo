<template>
  <div class="award">
    <div class="turnplate-wrap">
      <canvas class="item" id="wheelcanvas" width="422px" height="422px"></canvas>
      <img class="pointer" src="../../assets/image/turnplate-pointer.png" @click="whileClick"/>
    </div>
  </div>
</template>
<script>
  import jQuery from './jquery-1.10.2'
  import awardRotate from './awardRotate'
  export default {
    data () {
      return {
        turnplate: {
          restaraunts: [], // 大转盘奖品名称颜色
          fontColor: '#E5302F', // 奖品字体
          borderColor: '#FFBE04', // 各区域分割边框颜色
          colors: [], // 大转盘奖品区块对应背景颜色
          outsideRadius: 192, // 大转盘外圆的半径
          textRadius: 155, // 大转盘奖品位置距离圆心的距离
          insideRadius: 68, // 大转盘内圆的半径
          startAngle: 0, // 开始角度
          duration: 5000, // 旋转持续时间 ms
          bRotate: false, // false:停止;ture:旋转
        }
      }
    },
    created () {
      this.turnplate.restaraunts = ["10元", "500元", "200元", "100元", "50元", "20元"];
      this.turnplate.colors = ["#FA566F", "#FFFFFF", "#FA566F", "#FFFFFF", "#FA566F", "#FFFFFF"];
    },
    mounted () {
      this.$nextTick(() => {
      //页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
        this.drawRouletteWheel();
        setTimeout(() => {
          this.whileClick()
        }, 2000)
      })
    },
    methods: {
      whileClick () {
        // 动态添加大转盘的奖品与奖品区域背景颜色
          if (this.turnplate.bRotate) return; // 正在旋转，直接返回
          this.turnplate.bRotate = !this.turnplate.bRotate;
          // 获取随机数(奖品个数范围内),实际情况可能要发送ajax请求，根据后端给出的数据进行旋转
          var item = this.rnd(1, this.turnplate.restaraunts.length);
          // 奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
          var text = this.turnplate.restaraunts[item - 1];
          this.rotateFn(item, function () {
            // 抽奖结果
            alert('中奖结果:' + text);
          });
          console.log(item);
      },
      rotateFn(item, stopCallBack) {
        let that = this
        var angles = item * (360 / this.turnplate.restaraunts.length) - (360 / (this.turnplate.restaraunts.length * 2));
        if (angles < 270) {
          angles = 270 - angles;
        } else {
          angles = 360 - angles + 270;
        }
        var $wheelcanvas = $('#wheelcanvas');
        $wheelcanvas.stopRotate();
        $wheelcanvas.rotate({
          angle: 0,
          animateTo: angles + 1800,
          duration: this.turnplate.duration,
          callback: function () {
            if (stopCallBack) {
              stopCallBack();
            }
            that.turnplate.bRotate = !that.turnplate.bRotate;
          }
        });
      },
      rnd(n, m) {
        var random = Math.floor(Math.random() * (m - n + 1) + n);
        return random;
      },
      drawRouletteWheel() {
        var canvas = document.getElementById("wheelcanvas");
        if (canvas.getContext) {
          // 根据奖品个数计算圆周角度
          var arc = Math.PI / (this.turnplate.restaraunts.length / 2);
          var ctx = canvas.getContext("2d");
          // 在给定矩形内清空一个矩形
          ctx.clearRect(0, 0, 422, 422);
          // strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
          ctx.strokeStyle = this.turnplate.borderColor; // 边框颜色
          // font 属性设置或返回画布上文本内容的当前字体属性
          ctx.font = '20px Microsoft YaHei';
          for (var i = 0; i < this.turnplate.restaraunts.length; i++) {
            var angle = this.turnplate.startAngle + i * arc;
            ctx.fillStyle = this.turnplate.colors[i];
            ctx.beginPath();
            //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
            ctx.arc(211, 211, this.turnplate.outsideRadius, angle, angle + arc, false);
            ctx.arc(211, 211, this.turnplate.insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            //锁画布(为了保存之前的画布状态)
            ctx.save();
            //----绘制奖品开始----
            ctx.fillStyle = this.turnplate.fontColor; // 字体颜色
            var text = this.turnplate.restaraunts[i];
            var line_height = 17;
            //translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(211 + Math.cos(angle + arc / 2) * this.turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * this.turnplate.textRadius);
            //rotate方法旋转当前的绘图
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
            if (text.indexOf("M") > 0) {//流量包
              var texts = text.split("M");
              for (var j = 0; j < texts.length; j++) {
                ctx.font = j == 0 ? 'bold 20px Microsoft YaHei' : '16px Microsoft YaHei';
                if (j == 0) {
                  ctx.fillText(texts[j] + "M", -ctx.measureText(texts[j] + "M").width / 2, j * line_height);
                } else {
                  ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                }
              }
            } else if (text.indexOf("M") == -1 && text.length > 6) {//奖品名称长度超过一定范围
              text = text.substring(0, 6) + "||" + text.substring(6);
              var texts = text.split("||");
              for (var j = 0; j < texts.length; j++) {
                ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
              }
            } else {
              //在画布上绘制填色的文本。文本的默认颜色是黑色
              //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
              ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            }
//            //添加对应图标
//            if (text.indexOf("闪币") > 0) {
//              var img = document.getElementById("shan-img");
//              // 防止图片未加载
////              img.onload = function () {
////                ctx.drawImage(img, -15, 10);
////              };
//              ctx.drawImage(img, -15, 10);
//            } else if (text.indexOf("谢谢参与") >= 0) {
//              var img = document.getElementById("sorry-img");
//              img.onload = function () {
//                ctx.drawImage(img, -15, 10);
//              };
//              ctx.drawImage(img, -15, 10);
//            }
            //把当前画布返回（调整）到上一个save()状态之前
            ctx.restore();
            //----绘制奖品结束----
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .award{
    .turnplate-wrap {
      display: block;
      position: relative;
      width: 80%;
      margin-left: 7.5%;
      box-sizing: border-box;
      background-image: url(../../assets/image/turnplate-bg.png);
      background-size: 100% 100%;
    }
    .turnplate-wrap canvas.item {
      width: 100%;
    }
    .turnplate-wrap img.pointer {
      position: absolute;
      width: 31.5%;
      height: 42.5%;
      left: 34.6%;
      top: 23%;
    }
  }
</style>
