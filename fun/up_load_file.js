function getfolderid(getid) {

}


function choose_left_item(th) {
    let all_item = document.getElementsByClassName("file_left_item_child");
    th.className = "file_left_item_child file_item_active"
    for (let i = 0; i < all_item.length; i++) {
        if (all_item[i] != th) {
            all_item[i].className = "file_left_item_child"
        }
    }

    list_up_data()


}


function debug() {

    add_up_load_task()
}

function readfile() {

    let select_all_files = document.getElementById("up_file_tmp_s").files;
    console.log(select_all_files);
    qiniu_up_file_single(select_all_files[0])

}




function add_up_load_task() {

    let file_save = JSON.parse(localStorage.getItem("select_file_save"))
    console.log(file_save);

    document.getElementById("up_file_tmp_s").files = file_save;



    return;


    let item_array = {
        "url_local": "D:/A.jpg",
        "local_file_name": "测试文件" + new Date().getTime(),
        "url_server": 8812,
        "url_server_name": "服务文件夹1",
        "file_size_show": "50GB",
        "file_size": 50000,
        "file_status": "等待中",
        "file_add_time": new Date().getTime()

    }
    up_list.push(item_array)

    localStorage.setItem("file_up_load_list", JSON.stringify(up_list));
    list_up_data();

}








up_list = Array();
//load_up_list();
list_up_data(false);


function load_up_list() {

    let up_list_tmp_string = localStorage.getItem("file_up_load_list");
    if (up_list_tmp_string == null) {
        document.getElementById("file_404").style.display = "block"
    } else {
        up_list = JSON.parse(up_list_tmp_string)
        console.log(up_list)

        list_up_data(false);

    }

}

function list_up_data(showloading) {

    let up_status_choose = document.getElementsByClassName("file_item_active")[0].getAttribute("up_status");

    if (up_status_choose == "全部文件") {

        document.getElementById("right_div_box").style.display = "none";

        count_all_task();

        list_folder(showloading);

    } else {
        document.getElementById("right_div_box").style.display = "block";
        let all_up_log_html = "";
        let task_count_in = 0;
        for (let i = 0; i < up_list.length; i++) {
            let up_button = ``;
            if (up_list[i]['file_status'] == "上传中") {
                up_button = `stop_upload_ico`;
            } else {
                up_button = `begin_upload`;
            }

            if (up_list[i]['file_status'] == up_status_choose) {
                task_count_in++;
                all_up_log_html += `<tr id="file_log_` + i + `"> 
                <td class="teble_tr" style="width:80px;letter-spacing: 0px;font-size: 13px;">` + up_list[i]['url_server_name'] + `</td>
                <td class="teble_tr" style="max-width:300px;letter-spacing: 0px;font-size: 13px;">` + up_list[i]['local_file_name'] + `</td>
                <td class="teble_tr" style="width:70px;letter-spacing:0.6px;font-size: 15px;" >` + up_list[i]['file_size_show'] + `</td>
                <td class="teble_tr" style="width:85px;letter-spacing: 0px;font-size: 13px;" id="item_up_status_` + i + `" >` + up_list[i]['file_status'] + `</td>
                <td class="teble_tr" style="width:75px;letter-spacing: 0px;font-size: 13px;"  >` + get_time_by_st(up_list[i]['file_add_time']) + `</td>
                <td class="teble_tr" style="width:50px; user-select:none " >
                 <img class="table_ico"   id="start_up_` + i + `" onclick="start_up_single(this)" src="../../img/ico/` + up_button + `.png" alt="">
                 <img class="table_ico"  id="del_up_` + i + `" onclick="del_up_single(this)" onclick="" src="../../img/ico/del.png" alt="">
                 </td>
                </tr>`;
            }

        }
        document.getElementById("up_title_in").innerHTML = up_status_choose + ":" + task_count_in
        document.getElementById("up_load_list_box").innerHTML = all_up_log_html;
        document.getElementById("file_404").style.display = "none"

        count_all_task();
    }

}

function count_all_task() {

    let count_so = {
        "wait": 0,
        "doing": 0,
        "error": 0,
        "success": 0,
        "del": 0
    }
    for (let i = 0; i < up_list.length; i++) {
        if (up_list[i]['file_status'] == "等待中") {
            count_so['wait']++;
        }
        if (up_list[i]['file_status'] == "上传中") {
            count_so['doing']++;
        }
        if (up_list[i]['file_status'] == "上传失败") {
            count_so['error']++;
        }
        if (up_list[i]['file_status'] == "已完成") {
            count_so['success']++;
        }
        if (up_list[i]['file_status'] == "已删除") {
            count_so['del']++;
        }

    }

    if (count_so['wait'] > 0) {
        document.getElementById("wait_up_item_title").innerHTML = "等待上传(" + count_so['wait'] + ")"
    } else {
        document.getElementById("wait_up_item_title").innerHTML = "等待上传"
    }
    if (count_so['doing'] > 0) {
        document.getElementById("loading_up_item_title").innerHTML = "正在上传(" + count_so['doing'] + ")"
    } else {
        document.getElementById("loading_up_item_title").innerHTML = "正在上传"
    }
    if (count_so['success'] > 0) {
        document.getElementById("done_up_item_title").innerHTML = "上传完成(" + count_so['success'] + ")"

    } else {
        document.getElementById("done_up_item_title").innerHTML = "上传完成"

    }
    if (count_so['error'] > 0) {
        document.getElementById("error_up_item_title").innerHTML = "传输失败(" + count_so['error'] + ")"

    } else {
        document.getElementById("error_up_item_title").innerHTML = "传输失败"

    }
    if (count_so['del'] > 0) {
        document.getElementById("del_up_item_title").innerHTML = "已删除(" + count_so['del'] + ")"
    } else {
        document.getElementById("del_up_item_title").innerHTML = "已删除"
    }



}


function get_time_by_st(str) {

    var n = parseInt(str);
    var D = new Date(n);
    var year = D.getFullYear(); //四位数年份

    var month = D.getMonth() + 1; //月份(0-11),0为一月份
    month = month < 10 ? ('0' + month) : month;

    var day = D.getDate(); //月的某一天(1-31)
    day = day < 10 ? ('0' + day) : day;

    var hours = D.getHours(); //小时(0-23)
    hours = hours < 10 ? ('0' + hours) : hours;

    var minutes = D.getMinutes(); //分钟(0-59)
    minutes = minutes < 10 ? ('0' + minutes) : minutes;

    // var seconds = D.getSeconds();//秒(0-59)
    // seconds = seconds<10?('0'+seconds):seconds;
    // var week = D.getDay();//周几(0-6),0为周日
    // var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];

    var now_time = year + '.' + month + '.' + day + ' ' + hours + ':' + minutes;
    return now_time;
}

function start_up_single(th) {
    let up_id = th.id.replace("start_up_", "");

    console.log(up_list[up_id]);
    if (up_list[up_id]['file_status'] == "等待中") {
        th.src = "../../img/ico/stop_upload_ico.png"
        start_up_task_by_id(up_id);
    } else {
        th.src = "../../img/ico/begin_upload.png"
        stop_up_task_by_id(up_id)

    }



}

function removeall() {
    localStorage.removeItem("file_up_load_list");
    load_up_list()

    window.location.reload()
}

function start_up_task_by_id(up_id) {

    up_list[up_id]['file_status'] = "上传中"
    localStorage.setItem("file_up_load_list", JSON.stringify(up_list));

    qiniu_up_file_single(up_list[up_id])


    count_all_task();
}

function stop_up_task_by_id(up_id) {

    up_list[up_id]['file_status'] = "等待中"
    localStorage.setItem("file_up_load_list", JSON.stringify(up_list));
    count_all_task();
}

function del_up_single(th) {
    let up_id = th.id.replace("del_up_", "");
    up_list[up_id]['file_status'] = "已删除"
    localStorage.setItem("file_up_load_list", JSON.stringify(up_list));
    document.getElementById("file_log_" + up_id).parentNode.removeChild(document.getElementById("file_log_" + up_id))
    count_all_task();
}