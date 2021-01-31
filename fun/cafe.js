const serverip = "http://api.musaetime.com/cafe/api/";
const socketip = "";
const cdnurl = "http://cdn.musaetime.com/";
const im_server_ip = '121.196.125.43';
const im_server_port = 5556;



system_user_token = localStorage.getItem("token");


system_user_id = localStorage.getItem("userid");

function post(apiname, json, callback) {
    let getway = json.type ? json.type : 'post';
    json.async = json.async == false ? false : true;
    json.contentType = json.contentType ? json.contentType : 'application/x-www-form-urlencoded';
    json.data = json.data ? json.data : '';
    var ajax = new XMLHttpRequest();
    if (getway.toLowerCase() == 'post') {
        ajax.open('post', serverip + apiname, json.async);
        ajax.setRequestHeader('Content-type', json.contentType + ';charset=utf-8');
        ajax.send(json.data);
    } else {
        ajax.open('get', serverip + apiname + '?' + json.data, json.async);
        ajax.send();
    }
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            try {
                callback(JSON.parse(ajax.response), "")

            } catch {
                callback("", "接口数据错误:102 " + ajax.response);
            }
        }
    }
}


function cafe(json) {

    /*

    let key = md5("cafearelightwithnorth" + json.time);

    let string = Base64.decode(json.data);
    let len = key.length;
    let code = '';
    for (let i = 0; i < string.length; i++) {
        k = i % len;
        code += String.fromCharCode(string.charCodeAt(i) ^ key.charCodeAt(k));
    }

    return Base64.decode(code);


*/
}

function cafe_post(url, array, fun) {

    array['hash'] = hash(array);
    array['token'] = system_user_token;
    array['userid'] = system_user_id;
    let formData = new FormData();
    for (let key in array) {
        formData.append(key, array[key]);
    }
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("post", url);
    xmlHttp.send(formData);
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {

                if (fun) {
                    try {

                        try {
                            let backjson = JSON.parse(this.responseText);

                            try {
                                fun(backjson);
                            } catch (error) {
                                console.log("cafe post 回调函数处理错误");
                                console.log("----------error-------------");
                                console.log(error);
                                console.log("-----------------------------");
                                console.log(this.responseText);

                            }
                        } catch {
                            console.log("cafe post 数据序列化错误");
                            console.log(this.responseText);
                        }


                    } catch {

                        console.log("cafe post 数据操作错误");
                        console.log(this.responseText);

                    }


                }

            } else {
                console.log("cafe_post_error :" + this);
            }
        }

    };


}

function cafe_get(url, fun) {

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("get", url);
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {

                if (fun) {
                    try {

                        try {
                            let backjson = JSON.parse(this.responseText);
                            try {
                                fun(backjson);
                            } catch {
                                console.log("cafe get 回调函数处理错误");
                                console.log(this.responseText);

                            }
                        } catch {
                            console.log("cafe get 数据序列化错误");
                            console.log(this.responseText);
                        }


                    } catch {

                        console.log("cafe get 数据操作错误");
                        console.log(this.responseText);

                    }


                }

            } else {
                console.log("cafe_post_error :" + this);
            }
        }

    };


}



function hash() {


    return "debughash";

}

function getParam(paramName) {

    paramValue = "", isFound = !1;

    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {

        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;

        while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++

    }

    return paramValue == "" && (paramValue = null), paramValue

}

function toast(value, title, time, type) {

    if (document.getElementById("toast-icon")) {

        document.getElementById("toast-tip").innerHTML = value
        return;
    }
    type = type || "warring";
    title = title || "系统提醒";


    var toastTxt = value

    let ico_array = {
        "warring": "warring_ico.png",
        "success": "success_ico.png",
        "error": "error_ico.png",
    }
    let iconSrc = ico_array[type];
    let html = '<div id="toast-icon" class="toast-icon"><img class="toat_img" src="../../img/ico/' + iconSrc + '"></div><div class="toast-tip" id="toast-tip">' + toastTxt + '</div></div>';
    let toastBox = document.createElement('div');
    toastBox.className = 'toast';
    toastBox.id = 'toast';
    toastBox.innerHTML = html;
    document.body.appendChild(toastBox);
    setTimeout(function() {
        document.getElementById('toast').parentNode.removeChild(document.getElementById('toast'));
    }, time || 2000)


};

function confirm(value, title, done, datavalue, cancelfun) {

    if (document.getElementById("toast-confirm")) {
        document.getElementById('toast-confirm').parentNode.removeChild(document.getElementById('toast-confirm'));

    }

    let type = "warring";
    title = title || "系统提醒";
    cancelfun = cancelfun || "cancel_toast_confirm"
    var toastTxt = value
    let ico_array = {
        "warring": "warring_ico.png",
        "success": "success_ico.png",
        "error": "error_ico.png",
    }

    let iconSrc = ico_array[type];
    let html = `<div class="toast-icon-confirm">
    <img class="toat_img" src="../../img/ico/` + iconSrc + `"></div>
    <div class="toast-tip-confirm">` + toastTxt + `</div>
    <div onclick="` + done + `('` + datavalue + `');cancel_toast_confirm()" class="toast-sure-button">确认</div>
    <div onclick="` + cancelfun + `()"  class="toast-cancel-button">取消</div>
    </div>`;
    let toastBox = document.createElement('div');
    toastBox.className = 'toast-confirm';
    toastBox.id = 'toast-confirm';
    toastBox.innerHTML = html;
    document.body.appendChild(toastBox);



};

function cancel_toast_confirm() {

    document.getElementById('toast-confirm').parentNode.removeChild(document.getElementById('toast-confirm'));
}

function errheader(th) {
    th.src = "../../img/ico/personal_head_ico_gray.png";
    th.error = null
}

/*
 * @description    根据某个字段实现对json数组的排序
 * @param   array  要排序的json数组对象
 * @param   field  排序字段（此参数必须为字符串）
 * @param   reverse 是否倒序（默认为false）
 * @return  array  返回排序后的json数组
 */
function jsonSort(array, field, reverse) {
    //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
    if (array.length < 2 || !field || typeof array[0] !== "object") return array;
    //数字类型排序
    if (typeof array[0][field] === "number") {
        array.sort(function(x, y) { return x[field] - y[field] });
    }
    //字符串类型排序
    if (typeof array[0][field] === "string") {
        array.sort(function(x, y) { return x[field].localeCompare(y[field]) });
    }
    //倒序
    if (reverse) {
        array.reverse();
    }
    return array;
}

function timeto(timestamp) {
    timestamp = parseInt(timestamp);

    function zeroize(num) {
        return (String(num).length == 1 ? '0' : '') + num;
    }

    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

    var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
    var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate();
    var H = tmDate.getHours(),
        i = tmDate.getMinutes(),
        s = tmDate.getSeconds();

    if (timestampDiff < 60) { // 一分钟以内
        return "刚刚";
    } else if (timestampDiff < 3600) { // 一小时前之内
        return Math.floor(timestampDiff / 60) + "分钟前";
    } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
        return '今天' + zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
            return '昨天';
        } else if (curDate.getFullYear() == Y) {
            return zeroize(m) + '月' + zeroize(d) + '日 ';
        } else {
            return Y + '年';
        }
    }
}

function timeto_line(timestamp) {
    timestamp = parseInt(timestamp);

    function zeroize(num) {
        return (String(num).length == 1 ? '0' : '') + num;
    }

    var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
    var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

    var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
    var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

    var Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate();
    var H = tmDate.getHours(),
        i = tmDate.getMinutes(),
        s = tmDate.getSeconds();

    if (timestampDiff < 60) { // 一分钟以内
        return zeroize(H) + ':' + zeroize(i);;
    } else if (timestampDiff < 3600) { // 一小时前之内
        return zeroize(H) + ':' + zeroize(i);;
    } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
        return zeroize(H) + ':' + zeroize(i);
    } else {
        var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
        if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
            return '昨天' + zeroize(H) + ':' + zeroize(i);;
        } else if (curDate.getFullYear() == Y) {
            return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
        } else {
            return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);;
        }
    }
}