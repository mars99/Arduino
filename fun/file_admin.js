function choose_left_item(th) {

    let all_item = document.getElementsByClassName("file_left_item_child");
    th.className = "file_left_item_child file_item_active"
    for (let i = 0; i < all_item.length; i++) {
        if (all_item[i] != th) {
            all_item[i].className = "file_left_item_child"
        }
    }





}

rush_list();

function rush_list() {
    list_table({
        data_url: serverip + "cafe/file_admin/list_file_api",
        tableid: "table_1",
        index: 1,
        limit: 15,
        order_by: "uid",
        order_way: 0,
        editfun: 'edit_the_task',
        delfun: 'del_the_task'
    })


}