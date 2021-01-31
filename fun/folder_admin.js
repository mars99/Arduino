const { ipcMain, ipcRenderer } = require("electron");


show_loading_status = false;

function mousePosition(ev) {
    // console.log(ev.pageY);

    //  console.log(document.documentElement.clientHeight);

    if (ev.pageX || ev.pageY) {
        return { x: ev.pageX, y: ev.pageY };
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    };
}

url_json = Array();

let url_json_tmp = localStorage.getItem("cloud_file_url_json");

if (url_json_tmp == null) {

    console.log("初始化pid:0");
    let url_item = {
        "name": "根目录",
        "id": 0
    }
    url_json.push(url_item)
    localStorage.setItem("cloud_file_url_json", JSON.stringify(url_json))
    p_id = 0;
} else {

    url_json = JSON.parse(url_json_tmp);
    p_id = url_json[url_json.length - 1]['id'];
    console.log("start_pid:" + p_id);

}


meanu_show = false;
list_folder(true);

function mouseevent(e) {

    if (e.button == 2) {
        if (document.getElementsByClassName("f_active").length == 0) {
            document.getElementById("rename_meanu").style.display = "none"
            document.getElementById("rename_del").style.display = "none"
            document.getElementById("rename_copy").style.display = "none"
            document.getElementById("rename_cut").style.display = "none"
            document.getElementById("rename_open").style.display = "none"
            document.getElementById("rename_new_folder").style.display = "block";

            if (copy_file_id != null) {
                document.getElementById("p_buttom").style.display = "block"
            } else {
                document.getElementById("p_buttom").style.display = "none"
            }

        } else {

            document.getElementById("rename_new_folder").style.display = "none";
            document.getElementById("rename_meanu").style.display = "block"
            document.getElementById("rename_del").style.display = "block"
            document.getElementById("rename_copy").style.display = "block"
            document.getElementById("rename_cut").style.display = "block"
            document.getElementById("rename_open").style.display = "block"
            if (copy_file_id != null) {
                document.getElementById("p_buttom").style.display = "block"
            } else {
                document.getElementById("p_buttom").style.display = "none"
            }


        }
        e = event || window.event;
        var shu = mousePosition(e);
        let meanu = document.getElementById("menu");
        meanu.style.display = "block";
        meanu.style.left = shu.x - 5 + "px";
        meanu.style.top = shu.y - 5 + "px";
        meanu_show = true;

    } else {

        if (meanu_show == false) {
            if (document.getElementsByClassName("f_active").length > 0) {
                document.getElementsByClassName("f_active")[0].className = "folder_item"
            }
        }

        return false;
    }


}

function hidemeanu() {



    if (meanu_show == true) {
        if (document.getElementById("menu").style.display == "block") {
            document.getElementById("menu").style.display = "none"
            meanu_show = false
        }
    }

}


function click_folder(th) {
    let folder_array = document.getElementsByClassName("folder_item")
    th.className = "folder_item f_active"
    for (let i = 0; i < folder_array.length; i++) {
        if (th != folder_array[i]) {
            folder_array[i].className = "folder_item"
        }
    }
}

function openfolder(th) {

    let url_item = {
        "name": document.getElementById("f_name_" + th.id.replace("f_id_", "")).innerHTML,
        "id": th.id.replace("f_id_", "")
    }

    url_json.push(url_item)

    p_id = th.id.replace("f_id_", "");

    list_folder(true);

}

show_loading_text();



function show_loading_text() {

    if (show_loading_status == false) {
        return;
    } else {}

    let loading_point = document.getElementById("loading_status").innerHTML.replace("", "").split(".")



    let point_long = loading_point.length;

    if (point_long < 6) {
        document.getElementById("loading_status").innerHTML += "."
        setTimeout(function() {
            show_loading_text()
        }, 500)
    } else {

        document.getElementById("loading_status").innerHTML = "."
        setTimeout(function() {
            show_loading_text()
        }, 500)
    }


}

function hidden_loading() {
    show_loading_status = false
    if (document.getElementById("loading_div").className != "loading_div_hidden") {
        document.getElementById("loading_div").className = "loading_div_hidden";
        setTimeout(function() {
            document.getElementById("loading_div").style.display = "none"

        }, 200)
    }


}

function clear_folder() {

    hidemeanu();
    document.getElementById("folder_list_box").innerHTML = ""

}




function list_folder(showloading) {


    get_url_nav();
    if (showloading == true) {
        document.getElementById("folder_list_box").innerHTML = ""
        show_loading_status = true;;
        document.getElementById("loading_div").style.display = "block"
        document.getElementById("loading_div").className = "loading_div";
    }


    cafe_post(serverip + "/cafe/file_admin/list_folder_api", { p_id: p_id }, function(data) {


        if (data['status'] == 200) {

            let folders_file_list = data['data']['folders'];
            let files_file_list = data['data']['files'];

            document.getElementById("cloud_count_size").innerHTML = parseInt(data['data']['cloud_count'] / 1024 / 1024 / 1024) + "/" + parseInt(data['data']['cloud_max'] / 1024 / 1024 / 1024) + "(GB)"


            let file_list_html = '';


            for (let i = 0; i < folders_file_list.length; i++) {
                let folder_ico = "folder_normal"
                if (folders_file_list[i]['folder_file_count'] > 0) {
                    folder_ico = "folder_normal";
                } else {
                    folder_ico = "folder_null";
                }
                file_list_html += ` <div draggable="true" id="f_id_` + folders_file_list[i]['uid'] + `" 
                ondragstart="drag_folder_start(this)" 
                ondragenter="drag_folder_down(this)" 
                ondragend="done_drag_folder(this)" 
                ondragover="prevfun(event)" 
                ondrop="done_drag_folder()" 
                onmousedown="mouse_up_fun(this,event)" 
                file_type="folder"
                class="folder_item"  
                ondblclick="openfolder(this)" 
                onclick="click_folder(this)" 
                >
                <img src="../../img/ico/` + folder_ico + `.png" class="folder_ico">
                <div class="folder_text"  id="f_name_` + folders_file_list[i]['uid'] + `">` + folders_file_list[i]['folder_name'] + `</div>
            </div>`;
            }



            for (let i = 0; i < files_file_list.length; i++) {

                let file_url = `../../img/ico/` + files_file_list[i]['file_type'] + `_ico.png`;
                if (files_file_list[i]['file_type'] == "jpg" || files_file_list[i]['file_type'] == "png" || files_file_list[i]['file_type'] == "jpeg") {
                    file_url = cdnurl + files_file_list[i]['file_hash'] + '-thumb'
                } else {

                }

                file_list_html += ` <div draggable="true" id="f_id_` + files_file_list[i]['uid'] + `" 
                ondragstart="drag_folder_start(this)" 
                ondragenter="drag_folder_down(this)" 
                ondragend="done_drag_folder(this)" 
                ondragover="prevfun(event)" 
                ondrop="done_drag_folder()" 
                onmousedown="mouse_up_fun(this,event)" 
                class="folder_item"  
                ondblclick="openfile(this)" 
                onclick="click_folder(this)" 
                file_type="file" 
                >
                
                <img    onerror=unknowfile(this)  src="` + file_url + `"  class="folder_ico">
                <div class="folder_text"  id="f_name_` + files_file_list[i]['uid'] + `">` + files_file_list[i]['file_name'] + `</div>
            </div>`;

            }



            document.getElementById("folder_list_box").innerHTML = file_list_html

            hidden_loading();


        } else {
            toast(data['data'], "文件拉取错误");
        }

    })

}
let choose_folder = null;
let drage_to_folder = null;

function drag_folder_start(th) {

    move_file_type = th.getAttribute("file_type")
    choose_folder = th.id.replace("f_id_", "")
    drag_start = true;


}

function drag_folder_down(th) {

    drage_to_folder = th.id.replace("f_id_", "")
        //   let last_active_item = document.gete


    try {
        document.getElementsByClassName("folder_item_drag_active")[0].className = "folder_item"
    } catch {

    }
    document.getElementById("f_id_" + drage_to_folder).className = "folder_item_drag_active"






}

function done_drag_folder() {

    if (choose_folder == drage_to_folder) {
        return
    }
    console.log(document.getElementById("f_id_" + drage_to_folder).getAttribute("file_type"));
    if (document.getElementById("f_id_" + drage_to_folder).getAttribute("file_type") == "file") {
        return
    }




    if (drag_start == false) {
        return;
    } else {
        drag_start = false
    }


    let move_to_folder_name = document.getElementById("f_name_" + drage_to_folder).innerHTML;

    confirm("确认移动到「" + move_to_folder_name + "」", "确认移动", "done_drag", "1");


    try {
        document.getElementsByClassName("folder_item_drag_active")[0].className = "folder_item"
    } catch {

    }
}



let drag_status = false;
let drag_start = false;

function draging() {

    console.log("drag_ing");

}

function prevfun(e) {
    e.preventDefault();

}

function done_drag() {


    cafe_post(serverip + "/cafe/file_admin/move_folder", {
        move_folder_id: choose_folder,
        move_to_folder_id: drage_to_folder,
        move_file_type: move_file_type
    }, function(data) {
        console.log(data);
        if (data['status'] == 200) {


            document.getElementById('f_id_' + choose_folder).parentNode.removeChild(document.getElementById('f_id_' + choose_folder));
            //  list_folder();


        } else {
            toast(data['data'], "移动文件")
        }
    })

}




function get_url_nav() {

    localStorage.setItem("cloud_file_url_json", JSON.stringify(url_json))

    let url_html = '';
    for (let i = 0; i < url_json.length; i++) {
        url_html += `<div onclick="go_nav(this)"  class="url_item" id="url_n_` + url_json[i]['id'] + `">/ ` + url_json[i]['name'] + `</div>`;
    }

    document.getElementById("top_bar_native").innerHTML = url_html;





}

function go_nav(th) {
    let nav_array = document.getElementsByClassName("url_item");
    let new_url_json = Array();
    for (let index = 0; index < nav_array.length; index++) {
        if (nav_array[index] != th) {
            new_url_json.push(url_json[index])

        } else {
            new_url_json.push(url_json[index])
            p_id = th.id.replace("url_n_", "")
            url_json = new_url_json;
            list_folder(true);
            break;
        }

    }


}

function mouse_up_fun(th, e) {
    click_folder(th)
}

function rename() {

    let active_file = document.getElementsByClassName("f_active")[0];
    active_file_id = active_file.id.replace("f_id_", "")
    let active_file_type = active_file.getAttribute("file_type")
    let active_name = document.getElementById("f_name_" + active_file_id)
    active_name_old = active_name.innerText;
    active_name.setAttribute("contenteditable", true);
    active_name.className = "edit_folder_text";
    active_name.focus();
    active_name.onblur = function() {
        confirm("确认保存修改？", "文件修改", "rename_sure", "1", "cancel_reaname");
    };


    active_name.onkeydown = function(e) {
        if (e.keyCode == 13) {
            active_name.onblur = null;
            active_name.setAttribute("contenteditable", false);
            active_name.className = "folder_text";
            cafe_post(serverip + "/cafe/file_admin/rename_file", {
                file_id: active_file_id,
                file_type: active_file_type,
                new_name: active_name.innerText
            }, function(data) {
                console.log(data);
                if (data['status'] == 200) {

                } else {
                    toast(data['data'], "修改文件")
                }
            })

        }
    }


}


function rename_sure() {

    let active_file = document.getElementsByClassName("edit_folder_text")[0];
    active_file_id = active_file.id.replace("f_name_", "")
    let active_father_div = document.getElementById("f_id_" + active_file_id)
    let active_file_type = active_father_div.getAttribute("file_type")
    let active_name = document.getElementById("f_name_" + active_file_id)
    active_name.onblur = null;
    active_name.setAttribute("contenteditable", false);
    active_name.className = "folder_text";

    cafe_post(serverip + "/cafe/file_admin/rename_file", {
        file_id: active_file_id,
        file_type: active_file_type,
        new_name: active_name.innerText
    }, function(data) {
        console.log(data);
        if (data['status'] == 200) {

        } else {
            toast(data['data'], "修改文件")
        }
    })
}

function right_butto_open() {
    let active_file = document.getElementsByClassName("edit_folder_text")[0];
    let active_file_id = active_file.id.replace("f_name_", "")

    let url_item = {
        "name": document.getElementById("f_name_" + active_file_id).innerHTML,
        "id": active_file_id
    }

    url_json.push(url_item)
    list_folder(true);

}
copy_file_id = null;


function cancel_reaname() {

    cancel_toast_confirm();
    console.log("cancel_rename");
    let active_file = document.getElementsByClassName("edit_folder_text")[0];
    active_file_id = active_file.id.replace("f_name_", "")
    let active_father_div = document.getElementById("f_id_" + active_file_id)
    let active_name = document.getElementById("f_name_" + active_file_id)
    active_name.onblur = null;
    active_name.setAttribute("contenteditable", false);
    active_name.className = "folder_text";
    console.log(active_name_old);
    active_name.innerHTML = active_name_old;



}


function copy_button() {
    let active_file = document.getElementsByClassName("f_active")[0];
    let active_file_id = active_file.id.replace("f_id_", "")

    copy_file_id = active_file_id;
    copy_file_name = document.getElementById("f_name_" + active_file_id).innerHTML;
    copy_file_type = document.getElementById("f_id_" + active_file_id).getAttribute("file_type")
    p_way_type = "c";
    toast("已复制", "文件管理", 500)
}

function p_button() {


    confirm("确认将「" + copy_file_name + "」粘贴到「" + url_json[url_json.length - 1]['name'] + "」", "复制文件", "done_copy")



}

function cut_button() {
    let active_file = document.getElementsByClassName("f_active")[0];
    let active_file_id = active_file.id.replace("f_id_", "")
    copy_file_id = active_file_id;
    copy_file_name = document.getElementById("f_name_" + active_file_id).innerHTML;
    copy_file_type = document.getElementById("f_id_" + active_file_id).getAttribute("file_type")
    p_way_type = "p";
    toast("已剪辑，请粘贴到目标文件夹", "文件管理", 2000)


}

function d_button() {
    let active_file = document.getElementsByClassName("f_active")[0];
    let active_file_id = active_file.id.replace("f_id_", "")
    del_file_id = active_file_id;
    del_file_name = document.getElementById("f_name_" + del_file_id).innerHTML;
    del_file_type = document.getElementById("f_id_" + del_file_id).getAttribute("file_type");

    let toast_fils = "文件夹";
    if (del_file_type == "file") {
        toast_fils = "文件";
    }
    confirm("确认删除" + toast_fils + "「" + del_file_name + "」", "删除文件", "done_del")


}

function done_copy() {
    cafe_post(serverip + "/cafe/file_admin/copy_file", {
        copy_file_id: copy_file_id,
        copy_p_id: p_id,
        file_type: copy_file_type,
        done_way: p_way_type
    }, function(data) {
        console.log(data);
        if (data['status'] == 200) {

            list_folder(true);

        } else {
            toast(data['data'], "复制文件")
        }
    })


}

function done_del() {


    console.log("删除文件" + del_file_id);



    cafe_post(serverip + "/cafe/file_admin/del_file", {
        del_file_id: del_file_id,
        file_type: del_file_type,
    }, function(data) {
        console.log(data);
        if (data['status'] == 200) {
            toast(data['data'], "删除文件")
            list_folder(false);

        } else {
            toast(data['data'], "删除文件")
        }
    })




}

function rushlist() {
    document.getElementById("folder_list_box").innerHTML = ""

    list_folder()
}

function add_new_folder() {


    cafe_post(serverip + "/cafe/file_admin/add_folder", {
        p_id: p_id,
        file_type: 'folder',
    }, function(data) {
        console.log(data);
        if (data['status'] == 200) {
            let new_folder_html = ` <div draggable="true" id="f_id_` + data['data']['uid'] + `" 
    ondragstart="drag_folder_start(this)" 
    ondragenter="draddg_folder_down(this)" 
    ondragend="done_drag_folder(this)" 
    ondragover="prevfun(event)" 
    ondrop="done_drag_folder()" 
    onmousedown="mouse_up_fun(this,event)" 
    file_type="folder"
    class="folder_item"  
    ondblclick="openfolder(this)" 
    onclick="click_folder(this)" 
    >
    <img src="../../img/ico/folder_null.png" class="folder_ico">
    <div class="folder_text"  id="f_name_` + data['data']['uid'] + `">` + data['data']['folder_name'] + `</div>
</div>`;

            document.getElementById("folder_list_box").innerHTML += new_folder_html



        } else {
            toast(data['data'], "文件管理")
        }
    })






}

function open_upload_win() {


    //  window.open("./up_load_file.html?floderid=" + p_id, "上传文件", "location=no,directories=no,toolbar=no,width=1000,height=700,scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");

    win = window.open("", "debug");
    if (win.location.href === "about:blank") {
        //窗口不存在
        uploadwin = window.open("./up_load_file.html?floderid=" + p_id, "debug");

    } else {
        //窗口以已经存在了

        uploadwin.getfolderid(p_id)
        uploadwin.focus();
    }

}


up_list = Array();


//load_up_list();



function load_up_list() {

    let up_list_tmp_string = localStorage.getItem("file_up_load_list");
    if (up_list_tmp_string == null) {} else {
        up_list = JSON.parse(up_list_tmp_string)
        console.log(up_list)
            //  list_up_data();
    }

}

function choosefilechange() {

    let select_all_files = document.getElementById("up_file_tmp_s").files;

    let filehtml = '';

    let tag_folder_name = url_json[url_json.length - 1]['name'];

    for (let i = 0; i < select_all_files.length; i++) {

        let item_array = {
            "url_local": select_all_files[i]['name'],
            "local_file_name": select_all_files[i]['name'],
            "url_server": p_id,
            "url_server_name": tag_folder_name,
            "file_size_show": getsize(select_all_files[i]['size']),
            "file_size": 50000,
            "file_status": "上传中",
            "file_add_time": new Date().getTime(),
            "file_obj": select_all_files[i]
        }



        up_list.push(item_array)

    }

    document.getElementById("folder_list_box").innerHTML += filehtml;
    start_up_load_task_list();
    list_up_data(false);


}



function choose_file_up() {
    document.getElementById("up_file_tmp_s").click()

}

function unknowfile(th) {

    th.src = "../../img/ico/unknown_ico.png"
}


function getsize(sizeint) {

    if (sizeint < 1024) {
        return (sizeint / 1024).toFixed(2) + "K";

    } else {
        if (sizeint < 1024 * 1024) {
            return (sizeint / (1024 * 1024)).toFixed(2) + "M";
        } else {
            if (sizeint > 1024 * 1024 * 1024) {
                return (sizeint / (1024 * 1024 * 1024)).toFixed(2) + "G";
            } else {
                return (sizeint / (1024 * 1024)).toFixed(2) + "M";
            }
        }
    }




}



function start_up_load_task_list() {

    if (all_file_up_status == false) {
        qiniu_up_all_list();
    }


}

function openfile(th) {

    let file_id = th.id;
    toast(file_id)
}


function close_win(){
    console.log("cloaeapp");
    ipcRenderer.send("floadradminclose")

}