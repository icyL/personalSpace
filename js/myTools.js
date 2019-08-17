/**
 * 根据属性值改变元素样式
 * @param obj{String} jquery的选择器selector
 * @param json{Object} 要修改成的样式json对象
 */
function changeCssValue(obj, json){
    //清除定时器
    clearInterval($(obj).attr('timer'));
    //声明变量
    let begin=0,target=0,step=0;
    //设置定时器
    $(obj).attr('timer',setInterval(function () {
        //定义是否要清除定时器的标志
        let flag=true;

        //遍历json
        for(let key in json){
           if(json.hasOwnProperty(key)){
               if(key==="opacity"){  //透明度
                   begin=Math.round(parseFloat($(obj).css(key))*100)||100;
                   target=parseInt(parseFloat(json[key])*100);
               }else if(key==="zIndex"){
                   //设置层级
                   $(obj).css(key,json[key]);
               }else if(key==="backgroundImage"||key==="backgroundColor"){
                   //设置背景图片或背景颜色
                   $(obj).css(key,json[key]);
               }else{ //其他情况
                   begin=parseInt($(obj).css(key))||0;
                   target=parseInt(json[key]);
               }
               //步长
               step=(target-begin)*0.2;
               //取整 目的地比起始点数值大，意味向右走，则向上取整，反之，向下取整
               step=(target>begin)? Math.ceil(step) : Math.floor(step);

               //设置样式值
               if("opacity"===key){ //设置透明度
                   $(obj).css("opacity",(begin+step)/100); //支持opacity的浏览器
                   $(obj).css("filter","alpha(opacity=" +(begin+step)+ ")"); // IE浏览器
               }else{
                   $(obj).css(key,begin+step+'px');
               }

               //判断是否所有属性都设置完成
               if(begin!==target){
                   flag=false;
               }
           }
        }
        //清除定时器
        if(flag){
            clearInterval($(obj).attr('timer'));
        }
    },20));
}


/**
 * 绘制日历
 * @param year{Number} 当前年份
 * @param month{Number} 当前月份
 * @param title{String} jquery选择器，选择显示年月的元素
 * @param date{St@paramring} jquery选择器，选择要插入日期的元素
 */
function  drawCalendar(year,month,title,date) {
    $(title).text(year+"年"+month+"月");
    //确定当月第一天是星期几 记得月份是0-11
    let firstDay=new Date(year,month-1,1).getDay();
    //如果刚好是星期天，则空出一行（显示上个月的天数）
    firstDay =  firstDay === 0? 7 : firstDay;
    //确定当月有多少天,即本月最后一天是几号
    let currentDate=new Date(year,month,0).getDate();
    //确定上个月最后一天是几号
    let lastDate=new Date(year,month-1,0).getDate();
    //日历设置为6*7固定样式的总格子数
    let allNum=42;
    //剩余的留给下个月的格子数
    let num=allNum-firstDay-currentDate;

    //要插入的标签
    let ele='';
    //上个月的显示
    for(let i=0;i<firstDay;i++){
        ele+=`<span class="other">`+ (lastDate-(firstDay-1)+i) +`</span>`;
    }
    //当月的显示
    for(let j=0;j<currentDate;j++){
        ele+=`<span>`+(j+1)+`</span>`;
    }
    //下个月的显示
    for(let k=0;k<num;k++){
        ele+=`<span class="other">`+(k+1)+`</span>`;
    }
    //插入dom树
    $(date).html(ele);

    //给当前日期添加标注样式
    let currYear=new Date().getFullYear();
    let currMonth=new Date().getMonth()+1;
    let today=new Date().getDate();
    if(year===currYear&&month===currMonth){
        $(date+">span").eq(firstDay+today-1).addClass('current');
    }
}


/**
 *ajax局部请求数据刷新页面
 * @param url{String}请求的页面url
 * @param id{String}要显示响应数据的元素id，该项目默认显示请求数据到id为content的元素中
 **/
function changeContent(url,id='content') {
    //创建一个异步对象 浏览器兼容写法
    let xmlhttp;
    if (window.XMLHttpRequest) { //IE7+,Firefox,Cjrome,Opera,Safari
        xmlhttp = new XMLHttpRequest();
    } else { //IE6,IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //设置请求方式和请求地址
    xmlhttp.open("GET", url, true);
    //发送请求
    xmlhttp.send();

    //监听状态的变化
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) { //请求成功并成功返回
            document.getElementById(id).innerHTML = xmlhttp.responseText;
            // $('#'+id).html(xmlhttp.responseText);
        }
    }
}

/**
 * 获取当前时间
 * @returns {string} 返回yyyy-mm-dd hh:mm:ss形式的当前时间
 */
function getCurrentTime() {
    let date=new Date();
    let year=date.getFullYear();
    let month=date.getMonth()+1;
    let day=date.getDate();
    let hour=date.getHours();
    let minute=date.getMinutes();
    let second=date.getSeconds();
    second=second <10 ? '0'+second :second;
    let time=year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
    return time;
}


/**
 * 存储键值对到cookie中
 * @param key{String}  键名
 * @param value{String} 值
 * @param day{Number} 键值对数据在day天后过期
 */
function setCookie(key,value,day) {
    let date=new Date();
    date.setDate(date.getDate()+day);//从当前日期开始算起，day天后过期
    document.cookie=key+"="+value+"; expires="+date.toGMTString();
}


/**
 * 清除cookie中指定键名称的键值对
 * @param keyName{String} 键名
 */
function clearCookie(keyName) {
    let myDate=new Date();
    myDate.setTime(-1000);//设置时间
    document.cookie=keyName+"=''; expires="+myDate.toGMTString();
}


/**
 * 根据键名获取cookie中对应的值
 * @param keyName{String} 键名
 * @returns {string} 返回空字符串
 */
function getCookie(keyName) {
    //获取所有cookie,并把获取到的字符串拆分成数组
    let arr = document.cookie.split("; ");
    for (  let i=0,len=arr.length;i<len;i++ ){
        //把数组的当前项通过等号(=)再次分割成一个新数组
        let arrName = arr[i].split("=");
        //在新数组中,下标为0表示存入的cookie的key
        //如果下标为0的key与输入的key一样,那么该cookie就是我们想要的，
        if( arrName[0] === keyName ){
            //返回需要的被解码的value值
            return decodeURIComponent( arrName[1] );
        }
    }
    //如果没找到对应的key则认为对应的cookie不存在，返回一个空字符串
    return '';
}

