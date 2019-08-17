$(function () {

//获取相册页面点击的a标签的title的值即相册分类名，以便显示的是对应相册的照片页面
    let kindName;
    $("#content").delegate("#box li","click",function () {
        kindName=$(this).find("a").attr("title");
    });


/**用jquery事件委托 监听file控件的打开按钮的点击**/
    $("#content").delegate(".picShow","change",function () {
        //上传照片
        let file=$("#picHid").val();
        let arr = file.split('\\');
        //要取得的照片名称
        let  fileName  = arr[arr.length-1];

        //创建元素 插入DOM树
        $(".pictures>ul").append($(`<li>`+
            `<div class="pic">`+
                `<img src="images/picture/`+kindName+`/`+fileName+`" alt=""
                    onerror="this.src='images/picture/default/01.jpg'" >`+
                `<div class="cover"></div>`+
            `</div>`+
            `<div class="delBtn">`+
                `<a href="javascript:;">删除</a>`+
            `</div>`+
          `</li>`));

        //当插入照片过多，撑出的长度过长，则显示滚动条
        if($("#content").height()>640){
            $("body").css("overflow","auto");
        }

        //手动清除file控件中已选的文件，避免不可以连续插入同样的文件
        $("#picHid").val('');
    });


/**返回相册页面的按钮点击事件**/
    $("#content").delegate(".return","click",function () {
        changeContent('album.html');
    });


/**蒙版和删除键的显示与隐藏**/
    $("#content").delegate("li","mouseover",function () {
        $(this).find(".delBtn").css("display","block");
        $(this).find(".cover").css("display","block");
     });
     $("#content").delegate("li","mouseout",function () {
         $(this).find(".delBtn").css("display","none");
         $(this).find(".cover").css("display","none");
     });


/**删除键点击事件**/
    $("#content").delegate(".delBtn>a","click",function () {
        if(confirm('确定要删除该照片?')){
            $(this).parents("li").remove();
        }
    });

});