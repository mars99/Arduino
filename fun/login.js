const { ipcMain, ipcRenderer } = require("electron");

function ready() {

    document.getElementById("tel_input").focus();


}

function checktel(e) {


    let th = document.getElementById("tel_input");
    let tel = th.value;

    if (tel.length >= 11) {

        if (tel.length > 11) {
            tel = tel.substr(0, tel.length - 1);
            th.value = tel
        }

        document.getElementById("login_button").className = "send_button";


        if (e.keyCode == 13) {
            sendsms()
        }


    } else {
        document.getElementById("login_button").className = "send_button_hidden";
    }

}

title_text = "请输入手机号码接收验证码 .";
title_text_wait = "请输入手机号码接收验证码 ";
title_text_index = 0;

showtitle()

function showtitle() {

    let title_text_array = title_text.split("");

    document.getElementById("input_title").innerHTML += title_text_array[title_text_index]
    title_text_index++
    if (title_text_index < title_text_array.length - 1) {
        setTimeout(function() {
            showtitle()
        }, 70)
    } else {
        show_point();

    }

}

function show_point() {

    setInterval(() => {
        if (document.getElementById("input_title").innerHTML == title_text) {
            document.getElementById("input_title").innerHTML = title_text_wait
        } else {
            document.getElementById("input_title").innerHTML = title_text
        }

    }, 500);


}
now_active_id = 0

function choose_input(th) {

    let input_box = document.getElementsByClassName("ver_code_input");
    now_active_id = parseInt(th.id.replace("code_", ""));

    for (let i = 0; i < input_box.length; i++) {
        if (input_box[i] != th) {
            input_box[i].className = "ver_code_input";
        } else {
            input_box[i].className = "ver_code_input input_active";
        }
    }




    1
}

function event_key(e) {


    let input_box = document.getElementsByClassName("ver_code_input");

    now_active_id = parseInt(document.getElementsByClassName("ver_code_input input_active")[0].id.replace("code_", ""));

    if (e.keyCode == 8) {
        if (now_active_id >= 0) {
            console.log("last");
            document.getElementById("code_" + now_active_id).value = "";
            if (now_active_id > 0) {

                now_active_id = now_active_id - 1
            }
            document.getElementById("code_" + now_active_id).className = "ver_code_input input_active";
        }


    } else {



        if (now_active_id <= 5) {
            document.getElementById("code_" + (now_active_id)).value = String.fromCharCode(e.keyCode);


            if (now_active_id < 5) {
                now_active_id++;
            }

            document.getElementById("code_" + now_active_id).className = "ver_code_input input_active";

        }

    }

    for (let i = 0; i < input_box.length; i++) {
        if (input_box[i].id != "code_" + now_active_id) {
            input_box[i].className = "ver_code_input";
        }
    }


    let result_code = "";
    for (let i = 0; i < 6; i++) {
        result_code = result_code + document.getElementById("code_" + i).value;
    }
    if (result_code.length == 6) {

        check_sms_code();
    }


}

ver_code_input_hidden_index = 0;

function sendsms() {

    document.getElementById("login_button").className = "send_button_hidden"
    title_text = "验证码请求中 .";
    title_text_wait = "验证码请求中 ... ";

    let tel = document.getElementById("tel_input").value;

    cafe_post(serverip + "api/login/send_sms_api", { tel: tel, token: 'debugtoken' },
        function(data) {
            console.log("sms:" + JSON.stringify(data));
            if (data['status'] == 200) {
                setTimeout(() => {
                    sendsms_done();
                }, 1000);
            } else {


                toast(data['data'])

                setTimeout(() => {
                    title_text = "请输入手机号码接收验证码 .";
                    title_text_wait = "请输入手机号码接收验证码 ";
                    document.getElementById("login_button").className = "send_button"

                }, 1000);



            }
        })



}


function sendsms_done() {
    title_text = "验证码已发送到 " + document.getElementById("tel_input").value;
    title_text_wait = "验证码已发送到 " + document.getElementById("tel_input").value + " .";

    sms_time = 60;
    check_sms_time()

    document.getElementById("sms_ver_div").style.display = "block"
    document.getElementById("tel_input").className = "tel_input_hidden"
    document.getElementById("reload_sms_div").className = "reload_sms_div"
    show_input_box();


}

function show_input_box() {


    setTimeout(function() {
        let newclass = "ver_code_input"
        if (ver_code_input_hidden_index == 0) {
            newclass = "ver_code_input input_active";

        }

        document.getElementById("code_" + ver_code_input_hidden_index).className = newclass;
        if (ver_code_input_hidden_index < 5) {
            ver_code_input_hidden_index++;
            show_input_box();
        } else {
            document.getElementById("code_1").focus();
        }
    }, 70);
}

sms_time = 0;

function check_sms_time() {

    document.getElementById("reload_sms_div").innerHTML = "重新发送(" + sms_time + ")"


    if (sms_time > 0) {
        setTimeout(() => {
            document.getElementById("reload_sms_div").innerHTML = "重新发送(" + sms_time + ")"
            sms_time--;
            check_sms_time();
        }, 1000);

    } else {
        document.getElementById("reload_sms_div").className = "reload_sms_div_hidden"




        setTimeout(() => {
            document.getElementById("login_button").className = "send_button"
        }, 400);

    }

}

function closewin() {

    toast("关闭提醒", "正在退出系统", 1000);


}

function check_sms_code() {
    let result_code = "";
    for (let i = 0; i < 6; i++) {
        result_code = result_code + document.getElementById("code_" + i).value;
    }

    console.log("check code :" + result_code);

    cafe_post(serverip + "api/login/check_sms_api.php", { tel: document.getElementById("tel_input").value, code: result_code }, function(data) {

        if (data['status'] == 200) {

            toast("登录成功");


            setTimeout(function() {
                localStorage.setItem("token", data['data']['token'])
                localStorage.setItem("userid", data['data']['userid'])
                window.location.href = "./index"
            }, 2000)



        } else {
            toast(data['data']);

        }

    })


}

function closesure() {

    confirm("确认退出吗？", "退出确认", "closeapp", "1");
}

function closeapp() {

    ipcRenderer.send("closeapp");

}

function show_qr_box() {

    document.getElementById("qr_box").className = "hide_box_max";
    document.getElementById("input_div").className = "input_div_hidden";
    document.getElementById("login_phone_ico").className = "login_phone_ico"
    document.getElementById("login_qr_ico").className = "login_qr_ico_move_out_right_bottom"



    creat_a_qr()



}

check_login_status();




function show_tel_box() {

    scan_status = false;
    document.getElementById("qr_box").className = "hide_box_max";
    document.getElementById("qr_box").className = "hide_box_min";
    document.getElementById("input_div").className = "input_div_hidden";
    document.getElementById("input_div").className = "input_div";

    document.getElementById("login_phone_ico").className = "login_phone_ico_move_out_right_bottom"
    document.getElementById("login_qr_ico").className = "login_qr_ico"

}

qr_text = "";


function creat_a_qr() {

    document.getElementById("qr_img").src = "../../img/ico/loading02(1).gif";
    cafe_post(serverip + "/login/get_qr", { "way": "qr" }, function(data) {
        if (data['status'] == 200) {
            qr_text = data['data'];
            scan_status = true;
            get_a_qr(data['data']);
        } else {
            toast(data['data'])
        }
    })



}

function get_a_qr(qrinfo) {

    var dotsize = 5; // size of box drawn on canvas
    var padding = 10; // (white area around your QRCode)
    var black = "rgb(0,0,0)";
    var white = "rgb(255,255,255)";
    var QRCodeVersion = 15; // 1-40 see http://www.denso-wave.com/qrcode/qrgene2-e.html

    var canvas = document.createElement('canvas');
    var qrCanvasContext = canvas.getContext('2d');
    try {
        // QR Code Error Correction Capability 
        // Higher levels improves error correction capability while decreasing the amount of data QR Code size.
        // QRErrorCorrectLevel.L (5%) QRErrorCorrectLevel.M (15%) QRErrorCorrectLevel.Q (25%) QRErrorCorrectLevel.H (30%)
        // eg. L can survive approx 5% damage...etc.
        var qr = new QRCode(QRCodeVersion, QRErrorCorrectLevel.L);
        qr.addData(qrinfo);
        qr.make();
    } catch (err) {
        var errorChild = document.createElement("p");
        var errorMSG = document.createTextNode("QR Code FAIL! " + err);
        errorChild.appendChild(errorMSG);
        return errorChild;
    }

    var qrsize = qr.getModuleCount();
    canvas.setAttribute('height', (qrsize * dotsize) + padding);
    canvas.setAttribute('width', (qrsize * dotsize) + padding);
    var shiftForPadding = padding / 2;
    if (canvas.getContext) {
        for (var r = 0; r < qrsize; r++) {
            for (var c = 0; c < qrsize; c++) {
                if (qr.isDark(r, c))
                    qrCanvasContext.fillStyle = black;
                else
                    qrCanvasContext.fillStyle = white;
                qrCanvasContext.fillRect((c * dotsize) + shiftForPadding, (r * dotsize) + shiftForPadding, dotsize, dotsize); // x, y, w, h
            }
        }
    }

    var imgElement = document.createElement("img");
    document.getElementById("qr_img").src = canvas.toDataURL("image/png");


}

let scan_status = false;

setInterval(function() {
    check_qr();
}, 1000)

function check_qr() {
    console.log("checkqr");
    if (scan_status != false) {
        cafe_post(serverip + "cafe/login/qr_check", { "qr": qr_text }, function(data) {
            console.log(data);
            if (data['status'] == 200) {
                if (data['data'] != "等待扫描") {
                    if (data['data']['qr_status'] == "已确认登录") {
                        scan_status = false;
                        document.getElementById("user_info_header").src = "../../img/ico/loading02(1).gif"

                        document.getElementById("user_info_header").className = "user_info_header_noborder"
                        document.getElementById("user_info_name").innerHTML = ""
                        document.getElementById("user_info_qr_status").innerHTML = "正在登录..."
                        localStorage.setItem("userid", data['data']['user_id'])
                        localStorage.setItem("token", data['data']['token'])


                        setTimeout(() => {
                            check_login_status();
                        }, 1000);

                    } else {

                        document.getElementById("user_info_div").className = "user_info_div"
                        document.getElementById("user_info_header").src = cdnurl + data['data']['qr_header']
                        document.getElementById("user_info_name").innerHTML = data['data']['qr_user_name']
                        document.getElementById("user_info_qr_status").innerHTML = data['data']['qr_status']
                    }

                }

            } else {

            }
        })
    }
}



function check_login_status() {

    cafe_post(serverip + "cafe/login/admin_token_check", { "way": "checktoken" }, function(data) {

        if (data['status'] == 200) {
            console.log("check token success");

            ipcRenderer.send("openmain")

        } else {

            // show_qr_box()

        }
    })
}


ipcRenderer.send("login-ok")