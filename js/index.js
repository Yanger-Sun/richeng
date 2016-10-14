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

    botHS()

    setTimeout(function(){
        $(".arrive").css("line-height",$(window).height()-150+"px")
            .delay(2000)
            .css("font-size","2rem").delay(200).queue(function () {
            $(".arrive").addClass("close").dequeue()
        })
    },200);

    $(".top .top-left .menu").on("touchstart",function(){
        $(".cebar").addClass("open");
        $(".mask").addClass("open");
    });

    $(".cebar").on("touchstart",function(e){
        left = e.originalEvent.changedTouches[0].pageX
    });

    $(".cebar").on("touchend",function(e){
        var n = e.originalEvent.changedTouches[0].pageX
        if( n < left){
            $(".mask").removeClass("open");
            $(".cebar").removeClass("open");
        }
    })
    $(".addbtn").on("touchstart",function(){
        $(".inputText").addClass("open");
        $(".mask").addClass("open");
        $(".end-qu-btn").removeClass("close");
    });

    $(".end-qu-btn .qu").on("touchstart",function(){
        $(".inputText").removeClass("open");
        $(".mask").removeClass("open");
        $(".end-qu-btn .end").html("确定")
        $(".end-qu-btn").addClass("close");
        $(".inputText .infoText").val("");
    });

    $(".end-qu-btn .end").on("touchstart",function(){
        if($(this).html() == "确定"){
            var hour = $(".inputText .list-time .hour input").val()
            var minutes = $(".inputText .list-time .minutes input").val()
            var newtime=hour + ":" +minutes
            todos.push({title:$(".infoText").val(),time:newtime,status:1,isdel:0})
            localStorage.todo_item=JSON.stringify(todos)
        }else if($(this).html() == "修改"){
            var hour = $(".inputText .list-time .hour input").val()
            var minutes = $(".inputText .list-time .minutes input").val()
            var newtime=hour + ":" +minutes
            todos[changeIndex].time = newtime
            todos[changeIndex].title = $(".inputText .infoText").val()
            localStorage.todo_item=JSON.stringify(todos)
        }
        $(".inputText .infoText").val("");
        $(".inputText").removeClass("open");
        $(this).parent().addClass("close");
        $(".mask").removeClass("open");
        draw()
    })
    $(".top .top-right .tag").on("touchstart","div",function(){
        $(".top .top-right .tag div").removeClass("active");
        $(this).addClass("active");
        if($(this).hasClass("timepro")){
            draw()
        }else if($(this).hasClass("conf")){
            drawEnd()
        }
    })
    function draw(){
        $(".lists").html("")
        $.each(todos,function(i,v){
            if(v.status == 1){
                $("<li class='list' num="+ i +">").html("<div class='list-info'><div class='contentInfo'><div class='list-logo iconfont icon-shijian'></div><div class='list-con'><p>" + v.title + "</p><p>"+  v.time +"</p></div><div class='list-del iconfont icon-iconfonticonfontclose'></div></div></div>").appendTo($(".lists"));
            }
        });
        $(".con-top .showNum").html("便签("+$(".lists li").length +")")
        botHS()
    }
    function drawall(){
        $(".lists").html("")
        $.each(todos,function(i,v){
            if(v.status == 0){
                $("<li class='list' num="+ i +">").html("<div class='list-info'><div class='contentInfo'><div class='list-logo end iconfont icon-shijian'></div><div class='list-con'><p>" + v.title + "</p><p>"+  v.time +"</p></div></div></div>").appendTo($(".lists"));
            }else{
            $("<li class='list' num="+ i +">").html("<div class='list-info'><div class='contentInfo'><div class='list-logo  iconfont icon-shijian'></div><div class='list-con'><p>" + v.title + "</p><p>"+  v.time +"</p></div></div></div>").appendTo($(".lists"));
            }
        });
        $(".con-top .showNum").html("所有标签("+$(".lists li").length +")")
        botHS()
    }
    function drawEnd(){
        $(".lists").html("")
        $.each(todos,function(i,v){
            if(v.status == 0){
                $("<li class='list' num="+ i +">").html("<div class='list-info'><div class='contentInfo'><div class='list-logo iconfont icon-shijian'></div><div class='list-con'><p>" + v.title + "</p><p>"+  v.time +"</p></div></div></div>").appendTo($(".lists"));
            }
        });
        $(".con-top .showNum").html("已完成("+$(".lists li").length +")")
        botHS()
    }
    function botHS(){
        if($(".lists").find("li").length != 0){
            $(".bottom").hide();
        }else if($(".lists").find("li").length == 0){
            $(".bottom").show();
        }
        $(".con-top .showNum span").html($(".lists li").length)
    }

    $(".lists").on("touchstart",".list .contentInfo .list-del",function(event){
        event.stopPropagation();
        index = $(this).closest($(".list")).attr("num");
        $(".del-tit").addClass("show");
        $(".del-tit .del-tit-text").html("确定完成么?");
        $(".mask").addClass("open");
    });

    $(".del-tit .del-squr .del-btn").on("touchstart",".queding",function(){

        if($(".top .top-right .tag .timepro").hasClass("active")){
            todos[index].status = 0
            localStorage.todo_item=JSON.stringify(todos)
            draw()
        }else if($(".top .top-right .tag .conf").hasClass("active")){
             $(".lists").find("li[num = "+ index +" ]").addClass("close").delay(800).queue(function(){
             $(this).removeClass("close").remove().dequeue()
             })
           for(var i = index ; i<todos.length;i++){
               todos[i]=todos[i+1]
           }
            todos.length--
           localStorage.todo_item=JSON.stringify(todos)
        }

             $(".del-tit").removeClass("show")
             $(".mask").removeClass("open");

    });

    $(".del-tit .del-squr .del-btn").on("touchstart",".guidang",function(){
        $(".del-tit").removeClass("show")
        $(".mask").removeClass("open");
    });

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

    $(".lists").on("touchmove",".list",function(){
        if($(".con-top .top .top-right .tag .conf").hasClass("active")){
            index = $(this).attr("num");
            $(".del-tit .del-tit-text").html("确定不保留记录了么?");
            $(".del-tit").addClass("show");
            $(".mask").addClass("open")
        }
    })

    $(".cebar .save").on("click",function(){
        $(".cebar").removeClass("open");
        $(".mask").removeClass("open");
        drawall()
    })

})