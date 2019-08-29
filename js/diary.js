$(function () {
    //由于该页面是请求到首页显示的，当首页内容加载完毕，显示被请求的该页面内容时，该页面其实还未加载，
    //所以该页面上绑定的js事件都不能被触发，因此该页面的js事件需要用事件委托来绑定到首页其父元素上来触发
    //其他通过ajax请求到首页显示的页面同理

/***jquery事件委托监听文本区内容的实时输入***/
       $("#content").delegate( "#word", 'propertychange input',function(){
           //获取文本区域的内容
           let text=$(this).val();
           if(text.length>0){ //如果文本区内有内容
               //让发表按钮可用
               $("#publish").prop("disabled",false);
               $("#publish").css("cursor",'pointer');
           }
       });


/***发表日记内容***/
       //定义一个存储记录的json对象数组
       let jsonObj;
       if(getCookie("diaryData")){ //如果有日记记录保存在cookie中
           //将其转换为json对象数组
           jsonObj=JSON.parse(getCookie("diaryData"));
       }else{
           jsonObj=[];//否则为空数组
       }

       //监听发表按钮的点击
       $("#content").on( "click", '#publish',function(){
           //获取用户输入的内容
           let text=$("#word").val();
           //要插入的标签
           let ele=`<div class="note">
                       <p class="top">${text}</p>
                       <p class="bottom">
                       <span>${getCurrentTime()}</span>
                           <a href="javascript:;" class="delete">删除</a>
                       </p>
                   </div>`;
           //越晚发表的内容越往上排列，即往元素前面插入
          $(".items").prepend(ele);

           //把每条日记存成json数据
           let diary={"id":getCurrentTime(),"text":text};
           //然后插入对象数组中
           jsonObj.push(diary);
           //再把json对象数组转换为json字符串
           let jsonString=JSON.stringify(jsonObj);
           //把该json字符串记录存储到cookie中,设置过期时间为1天
           setCookie('diaryData',jsonString,1);

           //发表完成后清除文本区
           $("#word").val('');
           if($("#word").val()<=0){ //文本区没有内容
               //发表按钮不可用
               $("#publish").prop("disabled",true);
               $("#publish").css("cursor",'not-allowed');
           }

           //如果显示发表的日记过多，则显示滚动条（因为滚动条默认是隐藏的）
           if($("#content").height()>640){
               $("body").css("overflow","auto");
           }
       });


/**对已发表过的日记的删除***/
       $("#content").on( "click", '.delete',function(e){
           let msg = "您确定要删除吗？";
           if (confirm(msg)===true) {
               //删除该记录
               $(this).parents(".note").remove();
              //获取该条记录的时间，即json对象的id属性
               let id=$(this).prev().text();
               //删除cookie中对应的内容
               for(let k in jsonObj) {
                  if (jsonObj.hasOwnProperty(k)) {
                       //如果找到cookie中要删除的那条数据
                      if(jsonObj[k].id===id){
                          //从数组中索引为k的位置删除1条数据
                          jsonObj.splice(k,1);
                          //再把剩下的内容转换为json字符串
                          let jsonString=JSON.stringify(jsonObj);
                          //把该字符串存储到cookie中覆盖原有的字符串内容,设置过期时间为1天
                          setCookie('diaryData',jsonString,1);
                      }
                  }
               }
           }
       });

});



