
## Promise

这是一个Promise的简单实现，不含任何第三方插件。

## 兼容性

基本实现了 `es6` 中 `Promise` 的基本功能，但部分功能存在差异。

## 用法

```js

var p = new Promise(function(resolve, reject) {
	var bool=1;
	setTimeout(function(){
		if(bool){
			resolve("success");
		}else{
			reject("error");
		}
	},1000);
});
p.then(function(e){
	console.log(e);
	return "处理结果";
}).then(function(e){
	console.log(e);
}).catch(function(err){
	console.log(err);
});


```


## 版本更新

目前继续探索中...

## 关于

目前是开发阶段，并不能完全实现Promise中的大部分功能，仅供学习，线上成品谨慎使用。

