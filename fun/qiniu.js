const qiniu_config = {
    useCdnDomain: true,
    region: qiniu.region.z2
};


function up_qiniu_next(res, index) {

    //console.log(res);
    up_list[index]['file_size'] = res['total']['size']
    if (document.getElementById('item_up_status_' + index)) {
        let up_per = parseInt((res['total']['loaded'] / res['total']['size']) * 100) + '%';
        document.getElementById('item_up_status_' + index).innerHTML = "上传中(" + up_per + ")"
    }



}




function up_qiniu_err(up_task) {

    up_task['file_status'] = "上传失败"
    count_all_task();
}

function up_qiniu_done(index, res) {


    up_list[index]['file_status'] = "已完成"
    upload_done_callback(index, res);
    qiniu_up_all_list();
    list_up_data(false);




}

up_scan_Index = -1;

all_file_up_status = false;


function qiniu_up_all_list() {

    all_file_up_status = true;
    up_scan_Index++;
    if (up_list.length > up_scan_Index) {
        console.log(up_list[up_scan_Index]);
        if (up_list[up_scan_Index]['file_status'] == "上传中") {
            cafe_post(serverip + "cdn/qiniu/cafe_token_get", { way: "qiniu" }, function(data) {
                if (data['status'] == 200) {

                    var putExtra = {
                        fname: "",
                        params: {},
                        mimeType: null
                    };

                    const observable = qiniu.upload(
                        up_list[up_scan_Index]['file_obj'],
                        data['data']['key'],
                        data['data']['token'],
                        putExtra,
                        qiniu_config
                    )
                    const observer = {
                        next(res) {
                            up_qiniu_next(res, up_scan_Index)
                        },
                        error(err) {

                            // ...
                        },
                        complete(res) {
                            up_qiniu_done(up_scan_Index, res)
                        }
                    }
                    const subscription = observable.subscribe(observer) // 上传开始
                } else {
                    toast(data['data'], "上传文件")
                }
            })

        } else {
            qiniu_up_all_list();
        }
    } else {
        console.log("上传完成");

        all_file_up_status = false;
        up_scan_Index = -1
        list_folder(false);

    }



}


function upload_done_callback(index, res) {


    let fihehash = res['key'];
    cafe_post(serverip + "/cafe/file_admin/add_file", {
        filename: up_list[index]['local_file_name'],
        filesize: up_list[index]['file_size'],
        p_id: up_list[index]['url_server'],
        fihehash: fihehash
    }, function(data) {
        if (data['status'] == 200) {




        } else {
            toast(data['data'], "上传文件")
        }
    })

}