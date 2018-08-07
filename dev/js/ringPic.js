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
      this.cb('start');
      this.imgNum = imgArr.length;
      this.loadedImgArr = new Array(this.imgNum);
      this.loadedImgNum = 0;
      for (var i = 0; i < imgArr.length; i++) {
        this._load(imgArr[i], i)
      }
    },
    _load: function (src, i) {
      var me = this;
      var img = new Image();
      img.onload =(function (index) {
        return function () {
          if (!me.w) {
            me.w = img.width;
            me.h = img.height;
          }
          me.loadOneImg(index, this);
          this.onload = null;
          this.onerror = null;
        }
      })(i);
      img.onerror = function () {
        console.error('图片加载失败' + this.src);
        this.onload = null;
        this.onerror = null;
      };
      img.src = src;
    },
    loadOneImg: function (i, imgObj) {
      this.loadedImgNum++;
      this.loadedImgArr[i] = imgObj;
      this.cb('progress', parseInt(this.loadedImgNum / this.imgNum * 100));
      if (this.loadedImgNum === this.imgNum) {
        this.cb('end', this.loadedImgArr);
      }
    },
    getSize: function () {
      return {w: this.w, h: this.h}
    }
  };
  var getSoleId = (function () {
    var i = 0;
    return function () {
      i ++
      return 'cCanvas' + i;
    };
  })();
  var defaultOptions = {
    count: 24,
    picArr: [],
    el:null
  };

  var RingPic= function (options) {
    this.myCanvas = null;    // 存储 document.getElementById("myCanvas");
    this.cxt = null;         // 存储 this.myCanvas.getContext("2d");
    this.imageCount = 36;
    this.r = 0;
    this.c = 0;
    this.mode = 'ring';// scale
    this.cMode = 'half';// 竖直方向不循环
    this.setOptions(options);
    this.imgLoadObj = new ImgLoad();
    this.init();
  };

  RingPic.prototype = {
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
      var me = this;
      this.initCanvas();
      this.imgLoadObj.load(opts.picArr,function (type,data) {
        switch(type){
          case 'start':
            break;
          case 'progress':
            break;
          case 'end':
            // 拿到所有的图片，进行配置
            for(var i = 0,len = data.length; i < len; i ++){

            }
            console.log(me.imgLoadObj.getSize());
            break;
        }
      });
    },
    initCanvas: function () {
      var opts = this.getOptions();
      var id = getSoleId();
      var el =  opts.el
      var w = el.clientWidth;
      var h = el.clientHeight;
      el.innerHTML = '<canvas id="' + id + '" style="width:' + w+'px;height:' + h+'px; background-color: #ddd"></canvas>'
      this.canvasEl = document.getElementById(id);
      this.ctx = this.canvasEl.getContext('2d');
      this.bindEvent();
    },
    bindEvent: function () {
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
      this.canvasEl.addEventListener()
    },
    paint:function () {

    }
  };
  return RingPic;
}));
