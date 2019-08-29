$(function () {
/**用jquery事件委托 监听file控件的打开按钮的点击**/
    $("#content").delegate(".musicShow","change",function () {
        //上传音频
        let file=$("#musicHid").val();
        let arr = file.split('\\');
        //数组中最后一个元素为要取得的音频名称
        let  fileName  = arr[arr.length-1];
        //截掉字符串中最后的.mp3，然后再用-进行分割，获取音乐封面url，歌手名，歌名
        let musicInfo=fileName.substring(0,fileName .length-4).split('-');
        //音乐封面，没有上传则使用默认图片
        let img=musicInfo[0] ||'images/music/default.jpg' ;
        //歌手姓名
        let singer=musicInfo[1] || '';
        //歌曲名
        let song=musicInfo[2]||'';

        //创建元素
        let ele=`<li>
                    <img src="images/music/${img}" alt="" >
                    <div class="voice">
                        <div class="audioStyle">
                            <audio src="source/${fileName}" loop controls>您的浏览器不支持</audio>
                        </div>
                        <div class="oper">
                            <p>
                              <span>歌手：${singer}</span>
                              <span>歌曲：${song}</span>
                            </p>
                            <button class="del">删除</button>
                            <button class="bgMusic">设为背景音乐</button>
                            <button class="btn">播放</button>
                        </div>
                    </div>
                </li>`;
        //插入DOM树
        $(".list>ul").append(ele);

        //如果添加的音乐过多，撑出的高度过长，则显示滚动条
        if($("#content").height()>640){
            $("body").css("overflow","auto");
        }
    });


/**音乐的删除**/
    $("#content").on( "click", '.del',function(){
        let msg = "您确定要删除吗？";
        if (confirm(msg)===true) {
            $(this).parents("li").remove();
        }
    });


/**音乐播放或暂停按钮的点击事件**/
    $("#content").delegate( ".btn", 'click',function(){
        //点击显示播放的按钮
        if($(this).text()==="播放"){
            //把其他播放按钮改为暂停，目的是只能有一个音频播放
            let btns=$(".voice").find(".btn");
            for(let i=0;i<btns.length;i++){
                //修改其他正在播放的按钮为暂停
                let other =  $(".btn").parents(".voice").find("audio")[i];
                other.pause();
                //选取第i个按钮，修改其文本为播放，表示将其暂停
                $(".btn").eq(i).text("播放");
            }

            //音乐播放，更改当前点击的按钮文本为暂停
            let audio = $(this).parents(".voice").find("audio")[0];
            audio.play();
            $(this).text('暂停');
            //导航栏按键换成播放图片
            $("#music").attr("src", "images/index/play.png");
        }else{  //点击显示暂停的按钮
            //音乐暂停，修改当前按钮文本为播放
            let audio=$(this).parents(".voice").find("audio")[0];
            audio.pause();
            $(this).text('播放');
            //导航栏按键换成暂停图片
            $("#music").attr("src", "images/index/pause.png");
        }
    });


/**设为背景音乐按钮的点击事件**/
    $("#content").delegate( ".bgMusic", 'click',function() {
        if($(this).text()==="设为背景音乐"){
            let btns=$(".voice").find(".bgMusic");
            for(let i=0;i<btns.length;i++){
                $(".bgMusic").eq(i).text("设为背景音乐");
            }

            let audio = $(this).parents(".voice").find("audio")[0];
            //把背景音乐的src存储到cookie中，设置过期时间为1天
            setCookie("musicSrc",audio.src,1);

            $(this).text('取消背景音乐');
            alert("背景音乐设置成功！");
        }else{ //取消背景音乐
            //清除cookie中的背景音乐src
            clearCookie("musicSrc");
            $(this).text('设为背景音乐');
        }
    });

});
