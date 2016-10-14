/**
 * Created by 小样儿 on 2016/10/12.
 */
$(function(){
    var todos=[];
    if(!localStorage.todo_item){
        localStorage.todo_item = JSON.stringify(todos)
        draw()
    }else{
        todos=JSON.parse(localStorage.todo_item)
        draw()
    }
    //删除的下标
    var index = 0;
    //侧栏按下时的left值
    var left = 0;
    //要修改的备忘的下标
    var changeIndex=0;


    $(".del-tit").height($(window).height());
    $(".cebar").height($(window).height());
    $(".mask").height($(window).height());
    $(".arrive").height($(window).height());
    $(".devo").height($(window).height());

    botHS()

    // setTimeout(function(){
    //     $(".arrive").css("line-height",$(window).height()-150+"px")
    //         .delay(2000)
    //         .css("font-size","2rem").delay(200).queue(function () {
    //         $(".arrive").addClass("close").dequeue()
    //     })
    // },200);

    $(".top .top-left .menu").on("touchstart",function(){
        $(".cebar").addClass("open");
        $(".mask").addClass("open");
    });

    //侧栏移除
    $(".cebar").on("touchstart",function(e){
        left = e.originalEvent.changedTouches[0].pageX
    });
    $(".cebar").on("touchend",function(e){
        var n = e.originalEvent.changedTouches[0].pageX
        if( n < left){
            $(".mask").removeClass("open");
            $(".cebar").removeClass("open");
        }
    });

    //添加信息显示
    $(".addbtn").on("touchstart",function(){
        $(".inputText").addClass("open");
        $(".mask").addClass("open");
        $(".end-qu-btn").removeClass("close");
    });

    //添加修改时取消设置
    $(".end-qu-btn .qu").on("touchstart",function(){
        $(".inputText").removeClass("open");
        $(".mask").removeClass("open");
        $(".end-qu-btn .end").html("确定")
        $(".end-qu-btn").addClass("close");
        $(".inputText .infoText").val("");
    });

    //添加修改信息
    $(".end-qu-btn .end").on("touchstart",function(){
            if($(".infoText").val() == ""){
                return;
            }
             var setlan = $(".inputText .setLan .set-per").html();
             var hour = $(".inputText .list-time .hour input").val();
             var minutes = $(".inputText .list-time .minutes input").val();
             var newtime=hour + ":" +minutes;
            if(hour == "" || minutes == ""){
                var newtime = "未设置时间";
            }
        if($(this).html() == "确定"){
            todos.push({title:$(".infoText").val().slice(0,10),time:newtime,status:1,isdel:0,lanmu:setlan});
            localStorage.todo_item=JSON.stringify(todos);
        }else if($(this).html() == "修改"){
            todos[changeIndex].time = newtime;
            todos[changeIndex].lanmu = setlan;
            todos[changeIndex].title = $(".inputText .infoText").val().slice(0,10);
            localStorage.todo_item=JSON.stringify(todos);
        }
        $(".inputText .infoText").val("");
        $(".inputText").removeClass("open");
        $(this).parent().addClass("close");
        $(".mask").removeClass("open");
        draw()
    });

    //顶部右侧的选项 完成与未完成切换
    $(".top .top-right .tag").on("touchstart","div",function(){
        $(".top .top-right .tag div").removeClass("active");
        $(this).addClass("active");
        if($(this).hasClass("timepro")){
            draw()
        }else if($(this).hasClass("conf")){
            drawEnd()
        }
    })

    //显示未完成信息
    function draw(){
        $(".lists").html("");
        var lanname = $(".top .top-left .lanmu .person").html()
        $.each(todos,function(i,v){
            if(v.status == 1 && v.isdel == 0 && v.lanmu == lanname){
                $("<li class='list' num="+ i +">").html("<div class='list-info'><div class='contentInfo'><div class='list-logo'>"+(v.lanmu)[0]+"</div><div class='list-con'><p>" + v.title + "</p><p>"+  v.time +"</p></div><div class='list-del iconfont icon-iconfonticonfontclose'></div></div></div>").appendTo($(".lists"));
            }else{
                $(".lists").html("")
            }
        });
        $(".con-top .showNum").html("便签("+$(".lists li").length +")")
        botHS()
    }
    //显示所有信息
    function drawall(){
        $(".lists").html("")
        $.each(todos,function(i,v){
            if(v.status == 0 && v.isdel == 0){
                $("<li class='list' num="+ i +">").html("<div class='list-info'><div class='contentInfo'><div class='list-logo end'>"+(v.lanmu)[0]+"</div><div class='list-con'><p>" + v.title + "</p><p>"+  v.time +"</p></div></div></div>").appendTo($(".lists"));
            }else if(v.status  == 1 && v.isdel == 0){
            $("<li class='list' num="+ i +">").html("<div class='list-info'><div class='contentInfo'><div class='list-logo'>"+(v.lanmu)[0]+"</div><div class='list-con'><p>" + v.title + "</p><p>"+  v.time +"</p></div></div></div>").appendTo($(".lists"));
            }else{
                $(".lists").html("")
            }
        });
        $(".con-top .showNum").html("所有标签("+$(".lists li").length +")")
        botHS()
    }
    //显示已完成信息
    function drawEnd(){
        $(".lists").html("");
        var lanname = $(".top .top-left .lanmu .person").html()
        $.each(todos,function(i,v){
            if(v.status == 0 && v.isdel == 0 && v.lanmu == lanname){
                $("<li class='list' num="+ i +">").html("<div class='list-info'><div class='contentInfo'><div class='list-logo end'>"+(v.lanmu)[0]+"</div><div class='list-con'><p>" + v.title + "</p><p>"+  v.time +"</p></div></div></div>").appendTo($(".lists"));
            }
        });
        $(".con-top .showNum").html("已完成("+$(".lists li").length +")")
        botHS()
    }
    //判断底部是否显示
    function botHS(){
        if($(".lists").find("li").length != 0){
            $(".bottom").hide();
        }else if($(".lists").find("li").length == 0){
            $(".bottom").show();
        }
        $(".con-top .showNum span").html($(".lists li").length)
    }

    //列表信息处的删除
    $(".lists").on("touchstart",".list .contentInfo .list-del",function(event){
        event.stopPropagation();
        index = $(this).closest($(".list")).attr("num");
        $(".del-tit").addClass("show");
        $(".del-tit .del-tit-text").html("确定完成么?");
        $(".mask").addClass("open");
    });

    //删除弹出框的确定设置
    $(".del-tit .del-squr .del-btn").on("touchstart",".queding",function(){
        if($(".top .top-right .tag .timepro").hasClass("active")){
            todos[index].status = 0
            localStorage.todo_item=JSON.stringify(todos)
            draw()
        }else if($(".top .top-right .tag .conf").hasClass("active")){

             $(".lists").find("li[num = "+ index +" ]").addClass("close").delay(800).queue(function(){
             $(this).removeClass("close").remove().dequeue()
             })
             todos[index].isdel = 1
           localStorage.todo_item=JSON.stringify(todos)
        }

             $(".del-tit").removeClass("show")
             $(".mask").removeClass("open");

    });

    //删除弹出框的取消设置
    $(".del-tit .del-squr .del-btn").on("touchstart",".guidang",function(){
        $(".del-tit").removeClass("show")
        $(".mask").removeClass("open");
    });

    //未完成信息列表的信息修改
    $(".lists").on("touchstart",".list",function(){
        if($(".con-top .top .top-right .tag .conf").hasClass("active")){
            return;
        }
        changeIndex = $(this).attr("num");

        var info = $(this).find(".list-info .contentInfo .list-con p:first").text();

        $(".mask").addClass("open");
        $(".inputText").addClass("open");
        $(".inputText .infoText").val(info);
        $(".end-qu-btn").removeClass("close");
        $(".end-qu-btn .end").html("修改")
    })

    //已完成的信息列表的删除
    $(".lists").on("touchmove",".list",function(){
        if($(".con-top .top .top-right .tag .conf").hasClass("active")){
            index = $(this).attr("num");
            $(".del-tit .del-tit-text").html("确定不保留记录了么?");
            $(".del-tit").addClass("show");
            $(".mask").addClass("open")
            botHS()
        }
    })

    //显示所有的便签信息
    $(".cebar .save").on("touchstart",function(){
        $(".cebar").removeClass("open");
        $(".mask").removeClass("open");
        drawall()
    })

    //设置显示信息的栏目名
    $(".top .top-left").on("touchstart",".lanmu",function(event){
        event.stopPropagation();
        $(this).toggleClass("show")
    })
    $(".top .top-left .work").on("touchstart",function(){
        var trag = $(this).html();
        $(this).html($(".person").html());
        $(".person").html(trag);
        if($(".top .top-right .tag .timepro").hasClass("active")){
            draw()
        }else if($(".top .top-right .tag .conf").hasClass("active")){
            drawEnd()
        }
    })

    //设置添加信息的栏目名
    $(".inputText .setLan").on("touchstart",function(){
        $(this).toggleClass("show")
    })
    $(".inputText .setLan .set-work").on("touchstart",function(){
        var trag = $(this).html()
        $(this).html($(".setLan .set-per").html())
        $(".setLan .set-per").html(trag)
    })

    //查看成长树
    $(".cebar").on("touchstart",".user",function(){
        $(".mask").removeClass("open");
        $(".cebar").removeClass("open");
        $(".devo").addClass("show")
    })

})