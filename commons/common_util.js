/**
 * @author leoor
 */


/**
 *TAO 命名空间 namespace
 *  
 */
var TAO = {};
/**
 * Interface Class
 * 接口类需要2个参数么？
 * 参数1：接口的名字
 * 参数2：接受方法名称数组的集合（数组）
 */
TAO.Interface = function(name, methods) {
	// 判断接口参数的个数
	if(arguments.length != 2) {
		throw new Error('this instance interface constructor arguments must be 2 length!');
	}
	this.name = name;
	//this.methods = methods;
	this.methods = []; //定义一个内置的空数组对象，等待接受methods里的元素（方法名字）
	for(var i = 0, len = methods.length;i < len; i++) {
		if(typeof methods[i] !== 'string') {
			throw new Error('the Interface method name is error');
		}
		this.methods.push(methods[i]);
	}	
};

/**
 * Interface static method
 * @param {Object} object
 */
// 三：检验接口里的方法
// 如果检验通过，不做任何操作，不通过：浏览器抛出error
// 这个方法的目的，就是检测方法
TAO.ensureImplements = function(object) {
	// 如果检测方法接受的参数小于2个 参数传递失败！
	if(arguments.length < 2) {
		throw new Error('Interface.ensureImplements method constructor arguments must be >= 2!');
	}
	for(var i = 1,len = arguments.length; i < len; i++) {
		var instanceInterface = arguments[i];
		// 判断参数是否是接口的类型
		if(instanceInterface.constructor !== TAO.Interface) {
			throw new Error('the arguments constructor not be Interface Class');
		}
		// 循环接口实例对象里面的每一个方法
		for(var j = 0; j < instanceInterface.methods.length; j++) {
			// 用一个临时变量，接受每一个方法的名字（注意是字符串）
			var methodName = instanceInterface.methods[j];
			// object[key] 就是方法
			if(!object[methodName] || typeof object[methodName] !== 'function') {
				throw new Error('the method "'+ methodName +'"is not found!');
			}
		}
	}
};
	
/**
 * EXTEND method
 * @param {Object} sub
 * @param {Object} sup
 */
TAO.extend = function(sub, sup) {
	// 目的：实现只继承父类的原型对象
	
	var F = new Function(); // 1 创建一个空函数   目的： 空函数进行中转   function() {}
	F.prototype = sup.prototype; // 2 实现空函数的原型对象和超类（superclass，即父类）的原型对象转换
	sub.prototype = new F();	// 3 原型继承,每个函数都有一个prototype属性
	
	sub.prototype.constructor = sub; // 4 还原子类的构造器
	// 保存一下父类的原型对象：一方面方便解耦，另一方面方便获得父类的原型对象
	sub.superClass = sup.prototype; // 自定义一个子类的静态属性 接受父类的原型对象
	// 判断父类的原型对象的构造器（加保险）
	if(sup.prototype.constructor == Object.prototype.constructor) {
		sup.prototype.constructor = sup; // 手动还原父类原型对象的构造器
	}
};


/**
 * 单体模式
 * 实现一个跨浏览器的事件处理程序
 */
TAO.EventUtil = {
	// addHandler(el, type, fn);
	addHandler: function(element, type, handler) {
		if(element.addEventListener) {	//FF
			element.addEventListener(type, handler, false);	//false 代表冒泡时间
		} else if(element.attachEvent) {	//IE
			element.attachEvent('on' + type, handler);
		}
	},
	removeHandler: function(element, type, handler) {
		if(element.removeEventListener) {	//FF
			element.removeEventListener(type, handler, false);	//false 代表冒泡时间
		} else if(element.attachEvent) {	//IE
			element.detachEvent('on' + type, handler);
		}
	}
	
};
				