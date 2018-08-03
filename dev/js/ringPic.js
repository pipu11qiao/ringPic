;(function(factory){
  if(typeof define==="function" && define.amd){
    define(factory);
  }else if(typeof module!=="undefined" && module.exports){
    module.exports=factory;
  }else{
    factory();
  }
}(function($){

  // var renderParamVal = {
  //   "number": "CAUPH-SOFWOO-C35",
  //   "options": {
  //     "1": {
  //       "order": {
  //         "11": "12",
  //         "15": "16",
  //         "31": "32",
  //         "33": "79",
  //         "34": "35",
  //         "35": "194",
  //         "38": "361",
  //         "39": "476",
  //         "55": "665",
  //         "56": "57",
  //         "57": "816",
  //         "60": "992",
  //         "61": "62",
  //         "62": "1141",
  //         "65": "1316",
  //         "66": "67",
  //         "67": "1467",
  //         "7": "8",
  //         "78": "1605"
  //       },
  //       "orderid": "58dedacec98ceab8688b49d4",
  //       "position": {
  //         "x": "0",
  //         "y": "0",
  //         "z": "0"
  //       },
  //       "rotation": {
  //         "x": "0",
  //         "y": "0",
  //         "z": "0"
  //       },
  //       "type": "1"
  //     },
  //     "2": {
  //       "position": {
  //         "x": "-1.191",
  //         "y": "-1.017",
  //         "z": "6.151"
  //       },
  //       "rotation": {
  //         "x": "0",
  //         "y": "0",
  //         "z": "0"
  //       },
  //       "type": "2"
  //     },
  //     "3": {
  //       "angle": "330",
  //       "background": "notransparent",
  //       "height": "0.575",
  //       "position": {
  //         "x": "0",
  //         "y": "0",
  //         "z": "0"
  //       },
  //       "radius": "3.05",
  //       "render": "normal",
  //       "resolution": "706,397",
  //       "rotation": {
  //         "x": "0",
  //         "y": "0",
  //         "z": "0"
  //       },
  //       "type": "-1"
  //     }
  //   }
  // };
  //
  // var ShowingView = function (parent, order) {
  //   this.myCanvas = null;    // 存储 document.getElementById("myCanvas");
  //   this.cxt = null;         // 存储 this.myCanvas.getContext("2d");
  //   this.imageCount = 36;
  //   this.angle = 0;
  //   this.fakeNameDict = {};  // 角度:假名
  //   this.trueNameDict = {};  // 假名:真名
  //   this.imageDict = {};
  //   this.imageHost = 'http://mrmsapi.markormake.com/modules/lemon/uploads/files/';
  //   this.parent = parent;
  //   this.initWithOrder(order);
  // };
  //
  // ShowingView.prototype = {
  //   constructor: ShowingView,  // 改变构造函数指向
  //
  //   // 传入order初始化展示器
  //   initWithOrder: function (order) {
  //     this.showLoading();
  //     this.init();
  //     this.requestRenderImage(order);
  //     // this.linshi_requestRenderImage();
  //   },
  //   linshi_requestRenderImage: function () {
  //     var url = 'http://101.201.236.87/xushaoxiang/src/api.php';
  //     var param = new Param();
  //     param.cmd = '';
  //     param.subcmd = '';
  //     param.cmd = '';
  //     param.cmd = '';
  //   },
  //
  //   // 初始化
  //   init: function () {
  //     // 初始化成员变量
  //     this.myCanvas = document.getElementById("myCanvas");
  //     this.cxt = this.myCanvas.getContext("2d");
  //
  //     // 添加拖拽事件
  //     this.addDragEvent();
  //   },
  //
  //   // 添加拖拽事件
  //   addDragEvent: function () {
  //     var _this = this;
  //
  //     $('.showingView').on('mousedown', function (e) {   // 鼠标按下
  //       // console.log('鼠标按下');
  //       $(this).data('valid', true);
  //
  //       $(this).data('firstX', e.clientX);  // 按下鼠标的初始x值
  //       $(this).data('changed', 0); // 已改变
  //
  //     }).on('mouseup', function () {     // 鼠标抬起
  //       $(this).data('valid', false);
  //       // console.log('鼠标抬起');
  //
  //     }).on('mouseout', function () {     // 鼠标滑出
  //       $(this).data('valid', false);
  //       // console.log('鼠标滑出');
  //
  //     }).on('mousemove', function (e) {  // 鼠标移动
  //       if (!$(this).data('valid')) return;
  //       // console.log('鼠标移动');
  //
  //       var firstX = $(this).data('firstX');    // 按下鼠标的初始x值
  //       var changed = $(this).data('changed');  // 已改变
  //
  //       var willChange = parseInt((e.clientX - firstX) / 30);   // 要改变
  //
  //       if (willChange < changed) {  // 如果 要改变的 < 已改变的, 则向左转
  //         // console.log('向左转');
  //         $(this).data('changed', willChange); // 已改变
  //         _this.turnLeft();
  //
  //       } else if (willChange > changed) {   // 如果 要改变的 > 已改变的, 则向右转
  //         // console.log('向右转');
  //         $(this).data('changed', willChange); // 已改变
  //         _this.turnRight();
  //       }
  //     });
  //   },
  //
  //   // 向左转(角度++)
  //   turnLeft: function () {
  //     this.angle += 10;
  //     if (this.angle >= 360) {
  //       this.angle = 0;
  //     }
  //     this.showWithAngle(this.angle);
  //   },
  //   // 向右转(角度--)
  //   turnRight: function () {
  //     this.angle -= 10;
  //     if (this.angle < 0) {
  //       this.angle = 350;
  //     }
  //     this.showWithAngle(this.angle);
  //   },
  //   // 显示某个角度的渲染图
  //   showWithAngle: function (angle) {
  //     this.angle = angle;
  //
  //     // 如果有这张图
  //     if (this.fakeNameDict[angle]) {
  //       var img = this.imageDict[angle];
  //       if (img) {
  //         this.showImage(img);
  //
  //       } else {
  //         this.showLoading();
  //         this.preloadImage(angle);
  //       }
  //
  //     } else {
  //       this.showLoading();
  //     }
  //   },
  //   showImage: function (img) {
  //     this.hideLoading();
  //     this.cxt.drawImage(img, 0, 0, 706, 397);
  //   },
  //   // 请求渲染图
  //   requestRenderImage: function (order) {
  //     // 请求url
  //     var url = 'http://rcmsapi.markormake.com/api.php';
  //     // 请求参数
  //     var param = new Param();
  //     param.cmd = 'mrender';
  //     param.subcmd = 'render';
  //     param.val = renderParamVal;
  //     // 发送请求
  //     httpTool.send_async(url, param, callback);
  //     // 回调函数
  //     var _this = this;
  //
  //     function callback(success, data) {
  //       // console.log(success, data);
  //       if (success) {
  //         if (data.err == 200) {   // 请求成功
  //           _this.pollingRequestRenderImage(order); // 继续轮询
  //
  //         } else if (data.err == 1) {   // 任务已经存在
  //           // 如果已出渲染图
  //           if (data.val.cache) {
  //             var haveNewName = false; // 是否有新的图片文件
  //             var imageCount = 0;     // 记录图片张数
  //             for (var k in data.val.cache) {
  //               imageCount++;
  //               if (!_this.fakeNameDict[k]) {
  //                 haveNewName = true;
  //                 // break;   // 为了累计imageCount, 取消这个break
  //               }
  //             }
  //             _this.fakeNameDict = data.val.cache;    // 存储 角度:假名
  //
  //             // 如果有新的图片名,就要假名换真名
  //             if (haveNewName) {
  //               var fakeNames = new Array();
  //               for (var k in _this.fakeNameDict) {
  //                 fakeNames.push(_this.fakeNameDict[k]);
  //               }
  //               _this.requestTrueNameByFakeName(fakeNames); // 假名换真名
  //             }
  //             // 如果图片数目不足,就要继续轮询
  //             if (imageCount < _this.imageCount) {
  //               _this.pollingRequestRenderImage(order); // 继续轮询
  //             }
  //
  //           } else {    // 如果未出渲染图
  //             _this.pollingRequestRenderImage(order); // 继续轮询
  //           }
  //         }
  //       }
  //     };
  //   },
  //   // 轮询渲染接口
  //   pollingRequestRenderImage: function (order) {
  //     // 1秒后再次请求
  //     var _this = this;
  //     setTimeout(function () {
  //       _this.requestRenderImage(order);
  //     }, 1000);
  //   },
  //   // 假名换真名
  //   requestTrueNameByFakeName: function (fakeNames) {
  //     // 请求url
  //     var url = 'http://mrmsapi.markormake.com/api.php';
  //     // 请求参数
  //     var param = new Param();
  //     param.cmd = 'sserverRelay';
  //     param.subcmd = 'nameToSrcname';
  //     param.val = {
  //       'type': "image",
  //       'name': fakeNames
  //     };
  //     // 发送请求
  //     httpTool.send_async(url, param, callback);
  //     // 回调函数
  //     var _this = this;
  //
  //     function callback(success, data) {
  //       // console.log(success, data);
  //
  //       if (success) {
  //         if (data.err == 200) {   // 请求成功
  //           _this.trueNameDict = data.val.srcname;    // 存储 假名:真名
  //           _this.preloadImages();  // 预加载图片
  //         }
  //       }
  //     };
  //   },
  //   // 预下载图片
  //   preloadImages: function () {
  //     for (var angle in this.fakeNameDict) {
  //       // 如果已经下载了该图片
  //       if (this.imageDict[angle])   continue;
  //
  //       // 没有, 则预下载
  //       this.preloadImage(angle);
  //     }
  //   },
  //   // 预下载单张图片
  //   preloadImage: function (angle) {
  //     var fakeName = this.fakeNameDict[angle];
  //     var trueName = this.trueNameDict[fakeName];
  //
  //     var img = new Image();
  //     img.src = this.imageHost + trueName;
  //     console.log(img.src);
  //
  //     var _this = this;
  //     img.onload = function () {
  //       _this.imageDict[angle] = this;
  //       if (angle == _this.angle) {
  //         _this.showWithAngle(_this.angle);
  //       }
  //     };
  //     img.onerror = function () {
  //       alert('图片加载失败');
  //     };
  //   },
  //   // 显示loading
  //   showLoading: function () {
  //     !$.PROCUTION && console.log(111111111111);
  //     $('.animation-loading').css('display', 'block');
  //   },
  //   // 移除loading
  //   hideLoading: function () {
  //     $('.animation-loading').css('display', 'none');
  //   }
  // };
  // return ShowingView;
}));
