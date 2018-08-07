;(function(factory){
  if(typeof define==="function" && define.amd){
    define(factory);
  }else if(typeof module!=="undefined" && module.exports){
    module.exports=factory;
  }else{
    this.RingPic = factory();
  }
}(function(){
  var ImgLoad = function () {
    this.name = 'imgLoad';
    this.loadedImgArr = [];
    this.imgNum = 0;
    this.loadedImgNum = 0;
    this.cb = null;
  };
  ImgLoad.prototype = {
    load: function (imgArr, cb) {
      this.cb = cb;
      if (!Array.isArray(imgArr) || imgArr.length === 0) {
        throw new Error('Array !')
      }
      this.w = null;
      this.h = null;
      this.cb('load.start');
      this.imgNum = imgArr.length;
      this.loadedImgNum = 0;
      for (var i = 0; i < imgArr.length; i++) {
        this._load(imgArr[i], i)
      }
    },
    _load: function (src, i) {
      var me = this;
      var img = new Image();
      img.onload = function () {
        if (!me.w) {
          me.w = img.width;
          me.h = img.height;
        }
        me.loadOneImg(i, this);
        this.onload = null;
        this.onerror = null;
      };
      img.onerror = function () {
        console.error('图片加载失败' + this.src);
        this.onload = null;
        this.onerror = null;
      };
      img.src = src;
    },
    loadOneImg: function (i, imgObj) {
      this.loadedImgNum++;
      this.loadedImg[i] = imgObj
      this.cb('load.progress', parseInt(this.loadedImgNum / this.imgNum * 100));
      if (this.loadedImgNum === this.imgNum) {
        this.trigger('load.end', this.loadedImgArr);
      }
    },
    getSize: function () {
      return {w: this.w, h: this.h}
    }
  };
  var defaultOptions = {
    count: 24,
    picArr: [],
    el:null
  };

  var RingPic= function (options) {
    this.myCanvas = null;    // 存储 document.getElementById("myCanvas");
    this.cxt = null;         // 存储 this.myCanvas.getContext("2d");
    this.imageCount = 36;
    this.setOptions(options);
    this.imgLoadObj = new ImgLoad();
    this.init();
  };

  ShowingView.prototype = {
    constructor: RingPic,  // 改变构造函数指向
    setOptions: function (options) {
      this.options = {};
      for(var key in defaultOptions){
        this.options[key] = defaultOptions[key];
      }
      for(var key in options) {
        this.options[key] = options[key];
      }
    },
    getOptions: function () {
      return this.options;
    },
    init: function () {
      var opts = this.getOptions();
      this.imgLoadObj.load(opts.picArr,function (type,data) {
        console.log(type,data)
      });
    },
    // 传入order初始化展示器
    initWithOrder: function (order) {
      this.showLoading();
      this.init();
      this.requestRenderImage(order);
      // this.linshi_requestRenderImage();
    },
    linshi_requestRenderImage: function () {
      var url = 'http://101.201.236.87/xushaoxiang/src/api.php';
      var param = new Param();
      param.cmd = '';
      param.subcmd = '';
      param.cmd = '';
      param.cmd = '';
    },

    // 初始化
    init: function () {
      // 初始化成员变量
      this.myCanvas = document.getElementById("myCanvas");
      this.cxt = this.myCanvas.getContext("2d");

      // 添加拖拽事件
      this.addDragEvent();
    },

    // 添加拖拽事件
    addDragEvent: function () {
      var _this = this;

      $('.showingView').on('mousedown', function (e) {   // 鼠标按下
        // console.log('鼠标按下');
        $(this).data('valid', true);

        $(this).data('firstX', e.clientX);  // 按下鼠标的初始x值
        $(this).data('changed', 0); // 已改变

      }).on('mouseup', function () {     // 鼠标抬起
        $(this).data('valid', false);
        // console.log('鼠标抬起');

      }).on('mouseout', function () {     // 鼠标滑出
        $(this).data('valid', false);
        // console.log('鼠标滑出');

      }).on('mousemove', function (e) {  // 鼠标移动
        if (!$(this).data('valid')) return;
        // console.log('鼠标移动');

        var firstX = $(this).data('firstX');    // 按下鼠标的初始x值
        var changed = $(this).data('changed');  // 已改变

        var willChange = parseInt((e.clientX - firstX) / 30);   // 要改变

        if (willChange < changed) {  // 如果 要改变的 < 已改变的, 则向左转
          // console.log('向左转');
          $(this).data('changed', willChange); // 已改变
          _this.turnLeft();

        } else if (willChange > changed) {   // 如果 要改变的 > 已改变的, 则向右转
          // console.log('向右转');
          $(this).data('changed', willChange); // 已改变
          _this.turnRight();
        }
      });
    },

    // 向左转(角度++)
    turnLeft: function () {
      this.angle += 10;
      if (this.angle >= 360) {
        this.angle = 0;
      }
      this.showWithAngle(this.angle);
    },
    // 向右转(角度--)
    turnRight: function () {
      this.angle -= 10;
      if (this.angle < 0) {
        this.angle = 350;
      }
      this.showWithAngle(this.angle);
    },
    // 显示某个角度的渲染图
    showWithAngle: function (angle) {
      this.angle = angle;

      // 如果有这张图
      if (this.fakeNameDict[angle]) {
        var img = this.imageDict[angle];
        if (img) {
          this.showImage(img);

        } else {
          this.showLoading();
          this.preloadImage(angle);
        }

      } else {
        this.showLoading();
      }
    },
    showImage: function (img) {
      this.hideLoading();
      this.cxt.drawImage(img, 0, 0, 706, 397);
    },
    // 请求渲染图
    requestRenderImage: function (order) {
      // 请求url
      var url = 'http://rcmsapi.markormake.com/api.php';
      // 请求参数
      var param = new Param();
      param.cmd = 'mrender';
      param.subcmd = 'render';
      param.val = renderParamVal;
      // 发送请求
      httpTool.send_async(url, param, callback);
      // 回调函数
      var _this = this;

      function callback(success, data) {
        // console.log(success, data);
        if (success) {
          if (data.err == 200) {   // 请求成功
            _this.pollingRequestRenderImage(order); // 继续轮询

          } else if (data.err == 1) {   // 任务已经存在
            // 如果已出渲染图
            if (data.val.cache) {
              var haveNewName = false; // 是否有新的图片文件
              var imageCount = 0;     // 记录图片张数
              for (var k in data.val.cache) {
                imageCount++;
                if (!_this.fakeNameDict[k]) {
                  haveNewName = true;
                  // break;   // 为了累计imageCount, 取消这个break
                }
              }
              _this.fakeNameDict = data.val.cache;    // 存储 角度:假名

              // 如果有新的图片名,就要假名换真名
              if (haveNewName) {
                var fakeNames = new Array();
                for (var k in _this.fakeNameDict) {
                  fakeNames.push(_this.fakeNameDict[k]);
                }
                _this.requestTrueNameByFakeName(fakeNames); // 假名换真名
              }
              // 如果图片数目不足,就要继续轮询
              if (imageCount < _this.imageCount) {
                _this.pollingRequestRenderImage(order); // 继续轮询
              }

            } else {    // 如果未出渲染图
              _this.pollingRequestRenderImage(order); // 继续轮询
            }
          }
        }
      };
    },
    // 轮询渲染接口
    pollingRequestRenderImage: function (order) {
      // 1秒后再次请求
      var _this = this;
      setTimeout(function () {
        _this.requestRenderImage(order);
      }, 1000);
    },
    // 假名换真名
    requestTrueNameByFakeName: function (fakeNames) {
      // 请求url
      var url = 'http://mrmsapi.markormake.com/api.php';
      // 请求参数
      var param = new Param();
      param.cmd = 'sserverRelay';
      param.subcmd = 'nameToSrcname';
      param.val = {
        'type': "image",
        'name': fakeNames
      };
      // 发送请求
      httpTool.send_async(url, param, callback);
      // 回调函数
      var _this = this;

      function callback(success, data) {
        // console.log(success, data);

        if (success) {
          if (data.err == 200) {   // 请求成功
            _this.trueNameDict = data.val.srcname;    // 存储 假名:真名
            _this.preloadImages();  // 预加载图片
          }
        }
      };
    },
    // 预下载图片
    preloadImages: function () {
      for (var angle in this.fakeNameDict) {
        // 如果已经下载了该图片
        if (this.imageDict[angle])   continue;

        // 没有, 则预下载
        this.preloadImage(angle);
      }
    },
    // 预下载单张图片
    preloadImage: function (angle) {
      var fakeName = this.fakeNameDict[angle];
      var trueName = this.trueNameDict[fakeName];

      var img = new Image();
      img.src = this.imageHost + trueName;
      console.log(img.src);

      var _this = this;
      img.onload = function () {
        _this.imageDict[angle] = this;
        if (angle == _this.angle) {
          _this.showWithAngle(_this.angle);
        }
      };
      img.onerror = function () {
        alert('图片加载失败');
      };
    },
    // 显示loading
    showLoading: function () {
      !$.PROCUTION && console.log(111111111111);
      $('.animation-loading').css('display', 'block');
    },
    // 移除loading
    hideLoading: function () {
      $('.animation-loading').css('display', 'none');
    }
  };
  console.log(3);
  return ShowingView;
}));
console.log(3);
