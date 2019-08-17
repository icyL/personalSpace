$(function () {
/***旋转木马轮播处理***/
    //旋转木马图片信息
    let arr = [
        {width: 250, left: 115, top: 60, opacity: 0.6, zIndex: 2},
        {width: 380, left: 50, top: 110, opacity: 0.8, zIndex: 3},
        {width: 500, left: 180, top: 160, opacity: 1, zIndex: 4},
        {width: 380, left: 430, top: 110, opacity: 0.8, zIndex: 3},
        {width: 250, left: 495, top: 60, opacity: 0.6, zIndex: 2}
    ];

    //改变旋转木马图片各个样式
    for (let j = 0; j < arr.length; j++) {
        changeCssValue($("#section>li")[j], arr[j]);
    }

    //监听左右按钮点击事件
    for (let i = 0; i < $("#point>span").length; i++) {
        $("#point>span").eq(i).mousedown(function () {
            if (this.className === 'back') { //左箭头
                //把第一条数据移到最后面
                arr.push(arr.shift());
            } else {  //右箭头
                //把最后一条数据移到最前面
                arr.unshift(arr.pop());
            }
            //根据新的图片信息重新加载各样式
            for (let j = 0; j < arr.length; j++)
                changeCssValue($("#section>li")[j], arr[j]);
        });
    }


/***换肤蒙版处理***/
    //监听换肤键点击
    $("#btn").click (function () {
        $("#panel").css("display","block");
        $("#show").css("display","block");
    });

    $(document).click (function (event) {
        let e = event || window.event;
        //获取点击的标签
        let targetId = e.target ? e.target.id : e.srcElement.id;
        if (targetId === 'closeImg') { //如果点击的是关闭按钮位置
            //隐藏蒙版
            $("#panel").css("display","none");
            $("#show").css("display","none");
            //去掉菜单项被选中的样式
            $("#btn").removeClass("selected");
        }

        //获取选中的li标签
        for (let i = 0; i < $("#select>li").length; i++) {
            $("#select>li").eq(i).unbind('click').click (function () {
                let img = $(this).children('img'); //选中的图片元素
                let msg = "您确定要换成这张壁纸吗？";
                if (confirm(msg) === true) {
                    //更改背景图片
                    changeCssValue("body", {'backgroundImage': 'url(' + img.attr('src') + ')'});
                    //改变背景颜色
                    changeCssValue("nav", {'backgroundColor': img.attr('name')});
                    changeCssValue("footer", {'backgroundColor': img.attr('name')});
                    //保存壁纸url和背景颜色到cookie，设置过期时间为1天
                    setCookie("bgImg",img.attr('src'),1);
                    setCookie("bgColor",img.attr('name'),1);
                }
            });
        }
    });


/**页面一加载就显示上次保存的装扮**/
    //读取cookie中保存的背景设置值,若没有则取默认图片
    let bgImg=getCookie("bgImg") || 'images/index/bg01.jpg';
    let bgColor=getCookie("bgColor");
    //加载背景图片
    changeCssValue("body", {'backgroundImage': 'url(' + bgImg + ')'});
    //加载背景颜色
    changeCssValue("nav", {'backgroundColor': bgColor});
    changeCssValue("footer", {'backgroundColor': bgColor});


/***日历绘制***/
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    drawCalendar(year, month, '#yearMonth', '#date');
    //左箭头点击事件
    $('#prev').click(function () {
        month--;
        if (month === 0) {
            year--;
            month = 12;
        }
        drawCalendar(year, month,'#yearMonth', '#date');
    });
    //右箭头点击事件
    $('#next').click(function () {
        month++;
        if (month === 13) {
            year++;
            month = 1;
        }
        drawCalendar(year, month,'#yearMonth', '#date');
    });


/***菜单项选中的样式处理***/
    //上次选中的li标签索引
    let lastIndex = 0;
    //换肤蒙版关闭后不想把其他菜单项选中样式也清掉，所以i从1开始，即排除换肤的li标签
    for (let i = 1; i < $("#slider>li").length; i++) {
        //采用闭包实现高级排他
        (function (index) {
            $("#slider>li").eq(index).click(function () {
                //清除上次选中的样式
                $("#slider>li").eq(lastIndex).attr('class','');
                //当前选中的li标签加上被选中的样式
                $(this).attr('class','selected');
                //再把这次选中的索引赋值给上一次
                lastIndex = index;

                /*资料设置版块处理*/
                if (index === 1) { //当点击资料设置菜单项
                    //资料设置版块显示
                    $("#personalInfo").css("display",'block');
                } else {
                    //资料设置版块隐藏
                    $("#personalInfo").css("display",'none');
                }
            });
        })(i);
    }


/***资料设置板块内容 使用jquery***/
    //监听file上传头像控件的“打开”按钮的点击
    $(".file-show").change(function () {
        //上传头像的路径
        let file=$("#file-hid").val();
        let arr = file.split('\\');
        //要取得的图片名称
        let  fileName  = arr[arr.length-1];
        $(".headImg").attr('src', 'images/head/'+fileName);
    });

    //保存信息
    $("#save").click(function () {
        //获取用户输入的信息
        let headImg=$(".headImg").attr('src');
        let name=$(".name").val();
        let sex;
        if($("input:radio[name='sex']:checked").val()==="男"){
            sex="男";
        }else{
            sex="女";
        }
        let age=$(".age").val();
        let birthday=$(".birthday").val();

        //右侧边栏上个人信息的显示
        $(".headImgInfo").attr('src',headImg);
        $(".nameInfo").text(name);
        $(".sexInfo").text(sex);
        $(".ageInfo").text(age);
        $(".birthdayInfo").text(birthday);

        //同时更改首页和网页标题名称
        $(".owner").text(name+'的个人空间');
        $("title").text(name+'的个人空间');

        //个人信息json对象
        let personalInfo={
            "headImg":headImg,
            "name":name,
            "sex":sex,
            "age":age,
            "birthday":birthday
        };
        //转换为JSON字符串
        let obj=JSON.stringify(personalInfo);
        //保存个人信息到cookie中，设置过期时间为1天
        setCookie("info",obj,1);

        alert("资料保存成功！");
    });


/**页面一加载就显示上次保存的个人信息**/
    //定义一个存储记录的json对象数组
    let infoObj;
    if(getCookie("info")){ //如果有个人信息保存在cookie中
        //转换为json对象
        infoObj=JSON.parse(getCookie("info"));
    }else{
        infoObj={};//空对象
    }

    //资料设置版块个人信息的显示
    $(".headImg").attr('src',infoObj.headImg);
    $(".name").val(infoObj.name);
    if(infoObj.sex==="男"){
        $(".sex[value='男']").prop("checked", true);
    }else{
        $(".sex:last-child").prop("checked",true);
    }
    $(".age").val(infoObj.age);
    $(".birthday").val(infoObj.birthday);

    //右侧边栏个人信息的显示
    $(".headImgInfo").attr('src',infoObj.headImg);
    $(".nameInfo").text(infoObj.name);
    $(".sexInfo").text(infoObj.sex);
    $(".ageInfo").text(infoObj.age);
    $(".birthdayInfo").text(infoObj.birthday);

    //顺便更改首页和网页标题名称
    if(infoObj.name===undefined){ //如果没有保存过个人信息
        $(".owner").text('xxx的个人空间');
        $("title").text('xxx的个人空间');
    }else{
        $(".owner").text(infoObj.name+'个人空间');
        $("title").text(infoObj.name+'个人空间');
    }


/***控制背景音乐的暂停或播放***/
    $("#music").click(function () {
        let src=getCookie('musicSrc');
        let ele=`<audio src="`+src+`" id="hidAudio">您的浏览器不支持</audio>`;
        //每次点击该按键就往nav元素中插入一个audio，因此每次只能都从头播放
        $("nav").append($(ele));
        if(src){  //如果cookie中存有设置过的背景音乐src
                if (!($("#hidAudio")[0].paused)) { //如果背景音乐正播放
                    //让其暂停
                    $("#hidAudio")[0].pause();
                    //按钮换成暂停图片
                    $("#music").attr("src", "images/index/pause.png");
                    //移除nav中的前两个audio元素
                    $("nav").children("audio").eq(0).remove();
                    $("nav").children("audio").eq(1).remove();
                }else{ //如果暂停
                    //让其播放
                    $("#hidAudio")[0].play();
                    //按钮换成播放图片
                    $("#music").attr("src", "images/index/play.png");
                }
            }
    });

});



