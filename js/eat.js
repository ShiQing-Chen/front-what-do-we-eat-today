$(function () {
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    if (!window.localStorage.getItem('u')) {
        const u = new Date().Format("yyyyMMddHHmmss") + '-' + Math.random()
        window.localStorage.setItem('u', u)
    }

    $.ajax({
        async: false,
        // url: "https://api.farmeryun.com/api/eat/report?u=" + window.localStorage.getItem('u') + '&c=-1',
        url: "http://127.0.0.1:9999/api/eat/report?u=" + window.localStorage.getItem('u') + '&c=-1',
        type: "GET",
        dataType: 'jsonp',
        jsonp: 'callback',
        data: null,
        success: function (json) {
        }
    });

    var run = 0,
        heading = $("h1"),
        timer;
    let count = 0;
    $("#start").click(function () {
        let x = window.localStorage.getItem('c')
        if (x) {
            x = Number(x) + 1;
        } else {
            x = 0;
        }
        window.localStorage.setItem('c', x)

        $.ajax({
            async: false,
            url: "http://127.0.0.1:9999/api/eat/report?u=" + window.localStorage.getItem('u') + '&c=' + x,
            type: "GET",
            dataType: 'jsonp',
            jsonp: 'callback',
            data: null,
            success: function (json) {
            }
        });

        if (count > 5) {
            alert('这么作？今天别吃了！')
            $(this).hide();
            return;
        }
        var list = $("#list").val().replace(/ +/g, " ").replace(/^ | $/g, "").split(" ");
        if (!run) {
            heading.html(heading.html().replace("那就吃这个叭！", "吃什么？"));
            $(this).html("停一下");
            timer = setInterval(function () {
                var r = Math.ceil(Math.random() * list.length),
                    food = list[r - 1];
                $("#what").html(food);
                var rTop = Math.ceil(Math.random() * $(document).height()),
                    rLeft = Math.ceil(Math.random() * ($(document).width() - 50)),
                    rSize = Math.ceil(Math.random() * (34 - 14) + 14);
                $("<span class='temp'></span>").html(food).hide().css({
                    "top": rTop,
                    "left": rLeft,
                    "color": "rgba(0,0,0,." + Math.random() + ")",
                    "fontSize": rSize + "px"
                }).appendTo("body").fadeIn("slow", function () {
                    $(this).fadeOut("slow", function () {
                        $(this).remove();
                    });
                });
            }, 50);
            run = 1;
        } else {
            heading.html(heading.html().replace("吃什么？", "那就吃这个叭！"));
            $(this).html("咦，换一个");
            clearInterval(timer);
            run = 0;
            count++;
        }
    });

    document.onkeydown = function enter(e) {
        var e = e || event;
        if (e.keyCode == 13) $("#start").trigger("click");
    };
});