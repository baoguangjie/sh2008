// 1,获取地址栏参数函数
// 获取地址栏信息中心,字符串参数,转化为对象形式

function getURLValue() {
    // 1,获取地址栏参数字符串
    // 中文正常显示,不要问号
    var str = decodeURI(window.location.search).substr(1);

    // 2,字符串转化为对象
    var obj = {};

    // 按照&符号转数组
    var arr1 = str.split('&');

    // 循环遍历数组arr1
    // 将数据按照 = 等号 再次转化为数组
    // 数组0索引存储的是 键名   
    // 数组1索引存储的是 键值
    // 设定给对象新增单元
    arr1.forEach(function (v) {
        // v按照等号转化为数组
        var arr2 = v.split('=');
        // 将 arr2[0] 作为属性
        // 将 arr2[1] 作为属性值
        // 设定给对象obj
        obj[arr2[0]] = arr2[1];
    })

    // 定义返回值obj
    return obj;
}


// 2,随机颜色
function setColor() {
    // 方法1: 不推荐使用  颜色比较少
    // 创建所有英文单词的数组,随机索引下标,获取随机颜色字符串
    // var colorArr = ['red' , 'blue' , 'pink' , 'yellow' , 'orange' , 'green'];
    // var num = parseInt( Math.random()*colorArr.length );
    // return colorArr[num];

    // 方法2: #6位十六进制数值
    // 设定字符串,通过随机下标,获取6个字符,拼接在#号之后
    // var str = '0123456789abcdef';
    // var color = '#';
    // for(var i = 1 ; i <= 6 ; i++){
    //     var num = parseInt( Math.random()*str.length );
    //     color += str[num];
    // }
    // return color;

    // 方法3: rgb()  0-255的随机数
    return `rgb(${parseInt(Math.random() * 256)},${parseInt(Math.random() * 256)},${parseInt(Math.random() * 256)})`;
}


// 3,随机6位验证码
function setVc() {
    var str = '0123456789abcdefghijklmnopqrestuvwxyzABCDEFGHIJKLMNOPQRESTUVWXYZ';
    var vc = '';
    while (vc.length !== 6) {
        var num = parseInt(Math.random() * str.length);
        if (vc.indexOf(str[num]) === -1) {
            vc += str[num];
        }
    }
    return vc;
}


// 3,兼容语法,获取指定标签的指定css样式属性值
// 两个参数 : 参数1:标签对象  参数2:标签属性
function myGetStyle(ele, style) {
    // 兼容低版本IE浏览器
    // 如果有 window.getComputedStyle 就使用 window.getComputedStyle
    if (window.getComputedStyle) {
        // ele是要获取属性的标签
        // style是要获取的样式属性,[]语法解析变量
        return window.getComputedStyle(ele)[style];
    } else {
        // 没有 window.getComputedStyle , 使用低版本IE语法
        return ele.currentStyle(style);
    }
}


// 4,兼容语法,添加监听事件
function myAddEventListener(ele, type, fun) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fun)
    } else {
        ele.attachEvent('on' + type, fun)
    }
}

// 5,兼容语法,删除监听事件
function myRemoveEventListener(ele, type, fun) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, fun)
    } else {
        ele.detachEvent('on' + type, fun)
    }
}


// 6,move运动函数
// 参数1:运动的标签对象
// 参数2:运动的属性和属性值 对象类型
// 参数3:运动终止,执行的回调函数 函数名称 / 匿名函数

function move(element, type, callback) {
    // 创建对象,存储不同属性的定时器
    let obj = {};
    // 循环遍历参数2,key存储的是运动css样式属性
    for (let key in type) {
        // 创建定时器,存储在对象中,属性是运动css样式属性,属性值是 setInterval() 的返回值,也就是定时器序号
        obj[key] = setInterval(() => {
            // 获取原始属性值
            // 如果是透明度,直接获取属性值,并且乘以 100
            // 不是透明度,去除px单位,获取数值部分
            let oldStyle = key === 'opacity' ? myGetStyle(element, key) * 100 : parseInt(myGetStyle(element, key));

            // 计算步长
            // 如果是透明度,原始属性值*100 - 初始属性值 / 次数
            // 不是透明度, 原始属性值 - 初始属性值 / 次数
            let speed = key === 'opacity' ? (type[key] * 100 - oldStyle) / 5 : (type[key] - oldStyle) / 5;

            // 步长取整
            // 正数 : 向上取整
            // 负数 : 向下取整
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            // 初始值累加步长
            oldStyle += speed;

            // 将改变的初始值,赋值给标签对象
            // 如果是透明度, 改变的初始值/100 赋值
            // 如果不是透明度 , 改变的初始值 拼接 px 单位
            element.style[key] = key === 'opacity' ? oldStyle / 100 : `${oldStyle}px`;

            // 判断改变的初始值 等于 最终位置

            if (key === 'opacity') {
                if (oldStyle === type[key] * 100) {
                    // 清除定时器
                    clearInterval(obj[key]);
                    // 删除对象中的对应的数据单元
                    delete (obj[key]);
                }
            } else {
                if (oldStyle === type[key]) {
                    // 清除定时器
                    clearInterval(obj[key]);
                    // 删除对象中的对应的数据单元
                    delete (obj[key]);
                }
            }

            // 获取对象的所有键名,组成新的数组
            var arr = Object.keys(obj);
            // 如果数组长度为0,证明对象没有单元,所有定时器都清除
            if (arr.length === 0) {
                // 执行回调函数
                callback()
            }
        }, 30)
    }
}


// 定义一个函数,专门生成table表格内容
// 参数:需要根据生成table表格的数组
function setTable(array) {
    let str = '';
    // item 是 数组的单元,就是存储每一行内容的对象
    array.forEach((item) => {
        str += `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.sex}</td>
                        <td>${item.age}</td>
                        <td>${item.city}</td>
                        <td>${item.dep}</td>
                        <td>${item.pay}</td>
                        <td><button index="${item.id}" name="del">删除</button></td>
                        <td><button index="${item.id}" name="update">修改</button></td>
                    </tr>
                `;
    });

    return str;
}


// 设定cookie函数
// 参数1:cookie的键名
// 参数2:cookie的键值
// 参数3:cookie的时效
function mySetCookie(key,value,time){
    // 1,定义时间对象
    const nowTime = new Date();

    // 2,获取当前时间对象的时间戳 / 单位是毫秒
    let timeStamp = nowTime.getTime() ;

    // 3,将当前中国时区的时间转化为世界标准时间 -8小时时差的 毫秒数
    timeStamp -= 8*60*60*1000;

    // 4,当前的时间要加上 时效的秒数 转化为毫秒数
    // 结果是 设定 cookie的时效 的 时间戳毫秒数
    timeStamp += time*1000;

    // 5,将这个时效的时间戳秒数 , 设定给当前的时间对象
    nowTime.setTime( timeStamp );

    // 6,设定变量,存储空字符串,或者时间对象
    
    // 设定一个变量,如果参数3,time有数据,这个变量,存储的是 nowTime 时间对象
    //             如果参数3,time没有数据,这个变量,存储的是 '' 空字符串
    let t = time === undefined ? '' : nowTime;

    // 7,设定cookie
    // JavaScript中,通过 document.cookie 来设定 cookie 键值对
    // 应该是  document.cookie = '键名=数值'  键值对字符串
    // 现在 键名是 形参 key 键值是 形参 value,需要解析,使用模板字符串
    // document.cookie = `${key}=${value}'
    // 键值对之后,所有的设定都是 对这个键值对的 修饰/属性设定
    // expires : 设定这个 cookie 键值对的时效性
    //           expires=''       空字符串 cookie的时效性就是 session 会话时效
    //           expires=时间对象  cookie的时效性就是这个时间对象的 时间戳表示的时间
    // path : 设定cookie的访问路径
    //        / 表示根目录  当前的 根目录是 www 只要 www文件夹中的 文件都可以访问
    //        实际项目中,可以根据需求来设定
    //        
    document.cookie = `${key}=${value};expires=${t};path=/`;

}


function myGetCookie() {
    // 将cookie字符串,按照 分号空格 为间隔符号,转化为数组
    // 在按照 =等号 转化为数组 数组[0] 是对象的键名 数组[1]是对象的键值

    // 1,获取cookie字符串
    let str = document.cookie;
    var obj = {};
    var arr1 = str.split('; ');
    arr1.forEach(function (v) {
        var arr2 = v.split('=');
        obj[arr2[0]] = arr2[1];
    })
    return obj;
}