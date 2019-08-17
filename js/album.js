$(function () {
/**jquery事件委托 绑定创建相册按钮的点击事件**/
       $("#content").delegate(".create","click",function () {
           $(".panel").css("display",'block');
       });


/**点击创建表单的确定按钮 创建相册**/
       $("#content").delegate(".yes","click",function () {
           // 根据/对file控件上传的相册封面的路径字符串进行分割
           let arr =$("#coverUpload").val().split('\\');
           //数组中最后一个元素为要取得的封面名称，若没有上传则为默认图片
           let  fileName  = arr[arr.length-1]  ||"default01.jpg";
           //截取相册的分类名称
           let kindName=fileName .split("0")[0];
           //上传过后，手动清除file控件保留的上次选择的文件
           $("#coverUpload").val('');

           //获取相册名称
           let name=$("#name").val();
           //单选框选中的类别
           let kind=$('input:radio[name="kind"]:checked').val() || '未分类';
           if(name!==''){ //如果有起相册名称
               //创建要插入的标签
               let ele=$(`<li>`+
                   `<a href="javascript:;" onclick="changeContent('picture.html');"
                        title="`+kindName+`">`+
                   `<img src="images/album/`+fileName+`" alt=""  
                        onerror="this.src='images/album/default01.jpg'">`+
                   `</a>`+
                   `<div class="detail">`+
                       `<p>《`+name+`》</p>`+
                       `<span>`+kind+`</span>`+
                       `<button class="remove">删除</button>`+
                   `</div>`+
                   `</li>`);
               //从后插入DOM树
               $(".album>ul").append(ele);

               //当插入的相册过多，撑出的长度过长，则显示滚动条
               if($("#content").height()>640){
                   console.log(2);
                   $("body").css("overflow","auto");
               }

               alert("相册创建成功！");
               //清空内容
               $("#name").val('');
               $('input:radio[name="kind"]:checked').attr('checked',false);

               //创建成功，隐藏蒙版
               $(".panel").css("display",'none');
           }else{
               alert("请填写相册名称！");
           }
       });


/**点击创建表单的取消按钮 隐藏蒙版**/
    $("#content").delegate(".no","click",function () {
        $(".panel").css("display",'none');
    });


/**相册删除按钮的点击**/
       $("#content").on( "click", '.remove',function(){
           let msg = "您确定要删除吗？";
           if (confirm(msg)===true) {
               $(this).parents("li").remove();
           }
       });

});

