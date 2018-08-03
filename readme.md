### custom_option 右侧选项组件

#### 依赖  jquery mCustomScrollBAr

#### 使用方式

 > 静态文件引用

  ```html
  <link rel="stylesheet" href="http://47.97.108.129/web_static/custom_option/font/iconfont.css"> // 字体文件
  ```

 > npm

  ```nodejs
    npm install custom-option
  ```

##### 初始

```js
var optionObj = new $.C_option({
    el: '',// dom 元素
    mk_jsLib:SPU的实例  //null,// lychee 对象
    defaultOrfer: SPUorder  //optionsData,// lychee的返回主选项数据 （需要说明，这个数据结构）
    dataTheme: 'ZEST', //数据类型（删掉）
    cssTheme: 'ZEST', // 主题
    mainOptionNormalWidth: 0,// zest 0(线上) 或者 90(云设计)  ca 150(线上和云设计)
    subOptionWidth: 330, // Zest 330  Ca330
    hasCloseBtn: false,// 是否有关闭按钮
    hasThumb: false, // 是否有放大图功能
    hasCollect: true,// 时候有收藏
    firstOpen: false,// 进来是否展开
  })

```

##### 方法

*	update

拿到数据后更新

        optionObj.update({
          theme: opts.dataTheme,//数据主题（删掉）
          data: SPUorder  //optionsData,// lychee的返回主选项数据 （需要说明，这个数据结构）
          openOption: {0} // 初始是否点击 0 或 空 不打开 -1 就是打开第一个  id带确定id的主选项
        });

*	reset

 重置

*	resetOrder

  SKU   重置当前选项的选择值等于SKU设定的选项值
*	updateCollectListObj

: 更新收藏的数据（CA用）

*	openMainOptions(OptionId)

：打开当前编辑器的某个主选项

*	selectOptionValue(optionId,valueid)

 将当前选项编辑器的某个Option（OptionID值指定）的值修改成value（ValueID指定）

##### 事件

* **select**

Section(SPU. OptionID, ValueID)
{
	Debug.Log（SPU.GetOptionByID(OptionID).GetText（））；
}
所有发生order改变的事件（选择，点击头部标签删除，以及选择不可选的选项）通知可以去lychee获取新的 SPU.GetOptions order designmanager.getOrderForRender()

* **opensub**

 打开子选项的事件 OptenSub(SPU, OptionID)
{
	Xxx.addLog(SPU.GetID, SPU.

* **suboptions.item-one**

 子选项一级选项点击，data为{name: ‘选项名称’}

* **suboptions.item-two**

 子选项二级选项点击  data为{name: ‘选项名称’}
‘main-item
