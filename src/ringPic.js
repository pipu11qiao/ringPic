;(function(factory){
  if(typeof define==="function" && define.amd){
    define(factory);
  }else if(typeof module!=="undefined" && module.exports){
    module.exports=factory;
  }else{
    this.RingPic = factory();
  }
}(function(){

  var nano = function(s) {
    if (typeof s === "string") {
      this.value = Array.prototype.slice.call(document.querySelectorAll(s));
    }
    if (typeof s === "object") {
      this.value = [s];
    }
    this.length = this.value.length;
  };

  nano.prototype = {
    get:function (index) {
      return this.value[index];// 获得dom对象
    },
    each: function(fn) {
      [].forEach.call(this.value, fn);
      return this;
    },
    cssdom: function (v) {
      return this.each(function (i) {
        for (var key in v) {
          i.style[key] = v[key];
        }
      });
    },
    attr: function (name,value) {
      if(typeof value !== undefined){
        return this.each(function (i) {
          i.setAttribute(name, value);
        });
      }else {
        return this.value[0].getAttribute(name);
      }
    },
    getAttr: function (v) {
      return this.value[0].getAttribute(v);
    },
    data: function (name,value) {
      if(!name || typeof name !== 'string'){return}
      var support = !!document.body.dataset
      if(typeof value !== 'undefined') {// 设置
        return this.each(function (el) {
          if(support){
            el.dataset[name] = value;
          }else {
            el.setAttribute('data-' + name,value);
          }
        });
      }else {
        // 获取
        var el = this.value[0];
        if(support){
          return el.dataset[name];
        }else {
          return el.getAttribute('data-' + name);
        }
      }
    },
    on: function (type, fn) {
      return this.each(function (i) {
        i.addEventListener(type, fn, false);
      });
    },
    html: function (v) {
      return this.each(function (i) {
        i.innerHTML = v;
      });
    },
    width: function () {return this.value[0].clientWidth;},
    height: function () {return this.value[0].clientHeight;},
    append: function (v) {
      return this.each(function (i) {
        i.insertAdjacentHTML("beforeEnd",v);
      });
    },
    find: function (selector) {
      return new nano(this.value[0].querySelectorAll(selector)[0])
    }
  };

  var $ = function(selector) {
    return new nano(selector);
  };
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
      this.loadedImgObj = {}; // 所有经过下载的图片缓存
      this.loadedImgNum = 0;
      var me = this;
      for (var i = 0; i < imgArr.length; i++) {
        this.loadOne(imgArr[i], (function (index) {
          return function (obj) {
            if(obj){
              if (!me.w) {
                me.w = obj.w;
                me.h = obj.h;
              }
              me.loadOneImg(index,obj.imgObj)
            }else{
              console.error('图片加载失败')
            }
          }
        })(i))
      }
    },
    loadOne: function (src,cb) {
      var me = this;
      if(typeof this.loadedImgObj[src] === 'object'){
        cb(this.loadedImgObj[src]);
      } else if (!me.loadedImgObj[src]) {
        // 保证一个图片只加载一次
        me.loadedImgObj[src] = 1;
        var img = new Image();
        img.onload = function () {
          var obj = {
            imgObj: this,
            w: this.width,
            h: this.height
          };
          cb(obj);
          me.loadedImgObj[this.src] = obj;
          this.onload = null;
          this.onerror = null;
        };
        img.onerror = function () {
          cb();
          this.onload = null;
          this.onerror = null;
        };
        img.src = src;
      }
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
      i ++;
      return 'cCanvas' + i;
    };
  })();
  var defaultOptions = {
    count: 24,
    picArr: [],
    picArrBig: [],
    el:null,
    intervalX: 30,
    intervalY: 30,
    maxSize: 0.8 // 最大显示范围，宽或者高达到整体的80%
  };
  // todo 大图 键盘事件 移动端 放大效果
  var RingPic= function (options) {
    this.$myCanvas = null;    // 存储 document.getElementById("myCanvas");
    this.cxt = null;         // 存储 this.myCanvas.getContext("2d");
    this.r = 0;
    this.c = 0;
    this.maxC = 0;
    this.mode = 'ring';// scale
    this.cMode = 'half';// 竖直方向不循环
    this.setOptions(options);
    this.imgLoadObj = new ImgLoad();
    this.maxLengthDirection = 'h';// 以哪个方向为准确定最大尺寸
    this.imgArr = [];
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
      this.maxC = parseInt(opts.picArr.length / opts.count) - 1;
      this.initCanvas();
      this.hasLoadImgObj = {}
      this.imgLoadObj.load(opts.picArr,function (type,data) {
        switch(type){
          case 'start':
            me.loading('show');
            break;
          case 'progress':
            me.loading('show',data);
            break;
          case 'end':
            me.loading('hide',data);
            // 拿到所有的图片，进行配置
            var imgSize = me.imgLoadObj.getSize();
            for(var i = 0,len = data.length; i < len; i ++){
              me.imgArr.push({
                w: imgSize.w,
                h: imgSize.h,
                s: data[i],
                b: null
              });
            }
            me.maxLengthDirection = me.w / me.h > imgSize.w / imgSize.h ? 'v' : 'h';
            me.paint(me.imgArr[0],0);
            me.bindEvent();
            break;
        }
      });
    },
    initCanvas: function () {
      var opts = this.getOptions();
      $('head').append('<style>.r-loading-box *{box-sizing:border-box;}.r-loading-box{position:absolute;width:210px;height:50px;top:50%;left:50%;padding:0 20px;margin-top:-25px;margin-left:-105px;background:#333;border-radius:10px;overflow:hidden; box-sizing:border-box;}.r-loading-veil{position: absolute;top:0;left:0;width:100%;height:100%;background:#fff;opacity:.6;}.r-bar-text{width:60%;height:25px;line-height:30px;margin:0 auto;color:#fff;font-size:12px;text-align:center;}.r-bar-box{width:100%;height:10px;border-radius: 5px;overflow:hidden;border: 1px solid #333;}.r-text-first{float:left;}.r-text-last{float:right;}.r-bar-item{width:50%; height:10px;margin-top:10px;border-radius:5px;background-color:#fff;}</style>');
      var id = getSoleId();
      var $el = this.$el =  $(opts.el);
      this.w = $el.width();
      this.h = $el.height();
      $el.append('<div class="r-loading-box"><div class="r-loading-veil"></div><div class="r-bar-text"><span class="r-text-first">加载中...</span><span class="r-text-last">50%</span></div><div class="r-bar-item"></div></div><canvas id="' + id + '" tabindex="0" style="outline: none;"></canvas>');
      this.$canvasEl = $('#' + id).attr('width',this.w).attr('height',this.h).cssdom({cursor: 'pointer'});
      this.ctx = this.$canvasEl.get(0).getContext('2d');
    },
    bindEvent: function () {
      var opts = this.getOptions();
      var me = this;
      this.$canvasEl.on('mousedown',function (e) {
        $(this).data('valid','1').data('firstX', e.clientX).data('firstY',e.clientY); // 已改变
      }).on('mouseup', function () {     // 鼠标抬起
        $(this).data('valid', '0');
      }).on('mouseout', function () {     // 鼠标滑出
        $(this).data('valid', '0');
      }).on('mousemove', function (e) {  // 鼠标移动
        var $this = $(this);
        // clientX > firstX 方向向右 clientY > firstY 方向向上
        var valid = $this.data('valid');
        if(!valid || valid === '0' ){return;}
        // x
        var firstX = $(this).data('firstX');    // 按下鼠标的初始x值
        var deltX = Math.abs(e.clientX - firstX);
        var directionX = e.clientX > firstX ? 1 : -1;
        // y
        var firstY = $(this).data('firstY');    // 按下鼠标的初始x值
        var deltY = Math.abs(e.clientY - firstY);
        var directionY = e.clientY < firstY ? 1 : -1;
        var numX = 0,numY = 0;
        if(deltX > opts.intervalX || deltY > opts.intervalY){
          if(deltX > opts.intervalX){
            // 如果移动距离大于间隔距离 计算移动了多少步
            numX = Math.floor(deltX / opts.intervalX);
            $this.data('firstX',-(-firstX) +  directionX * numX * opts.intervalX);
          }
          if(deltY > opts.intervalY){
            numY = Math.floor(deltY / opts.intervalY);
            $this.data('firstY',-(-firstY) -  directionY * numY * opts.intervalY);
          }
          me.ring(directionX * numX, directionY * numY);
        }
      });
      // 键盘事件
      this.$el.on('keydown',function (e) {
        // 37 - 40 左上右下
        var d = e.keyCode;
        var r = d === 37 ? -1 : d == 39 ? 1 : 0;
        var c = d === 38 ? 1 : d == 40 ? -1 : 0;
        me.ring(r,c)
      });
    },
    ring: function (r,c) { // r > 0 方向向右 c > 0 方向向上
      var opts = this.getOptions();
      if(r === 0 && c === 0){return}
      // r 循环 c 不循环，从零开始到最高结束
      this.r = parseInt((this.r + opts.count + r) % opts.count);
      // c 从零到maxC
      if(c > 0){
        this.c = Math.max(this.c - c,0)
      }else if(c < 0){
        this.c = Math.min(this.c - c,this.maxC);
      }
      var index = this.c * opts.count + this.r;
      this.paint(this.imgArr[index],index);
    },
    paint:function (imgObj,index) {
      var img;
      var me = this;
      var opts = this.getOptions();
      this.curIndex = index;
      // 判断是否有大图如果没有大图就加载大图
      if(typeof imgObj.b === 'object' && imgObj.b){// 有大图
        img = imgObj.b;
      }else {
        // 没有大图 先画小图 记载大图并绘制
        img = imgObj.s;

        if(opts.picArrBig[index] && !this.hasLoadImgObj[opts.picArrBig[index]]){
          this.hasLoadImgObj[opts.picArrBig[index]] = 1;
          this.imgLoadObj.loadOne(opts.picArrBig[index],(function(i){
            // i 所处的位置
            return function (obj) {
              if(obj){
                me.imgArr[i].b = obj.imgObj;
                if(i === me.curIndex){
                  me.paint(me.imgArr[i],i);
                }
              }
            }
          })(index));
        }
      }
      // 获得画布中心点，获得图片绘制尺寸，计算开始位置绘制
      var info = this.getPositionInfo(imgObj);
      this.ctx.drawImage(img,info.x,info.y,info.w,info.h);
    },
    getPositionInfo:function (imgObj){
      var w,h;
      var opts = this.getOptions();
      if(this.maxLengthDirection === 'h'){// 水平方向为主
        w = parseInt(this.w * opts.maxSize);
        h = parseInt(w * imgObj.h/ imgObj.w);
      }else {
        h = parseInt(this.h * opts.maxSize);
        w = parseInt(h * imgObj.w / imgObj.h);
      }
      return {
        x:parseInt((this.w - w) / 2),
        y:parseInt((this.h - h) / 2),
        w: w,
        h: h
      };
    },
    loading: function (type,process) {
      var opts = this.getOptions();
      var $el = $(opts.el);
      $el.find('.r-loading-box').cssdom({
        display: type === 'show' ? 'block' : 'none'
      });
      $el.find('.r-bar-item').cssdom({
        width: process ? process + '%' : '0%'
      });
      $el.find('.r-text-last').html(process ? process + '%' : '0%');
    }
  };
  return RingPic;
}));
