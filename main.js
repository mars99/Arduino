const { app, BrowserWindow,electron } = require('electron')

const { ipcMain } = require('electron')


const path = require('path');



// Enable live reload for Electron too
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});



function createWindow() {

    win = new BrowserWindow({
        width: 1050,
        minWidth:850,
        minHeight:600,
        height: 700,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }


    })

    win.openDevTools({ mode: 'detach' });
    win.loadFile('./view/folder_admin.html');

    ipcMain.on('window-max', function() {
        if (win.isMaximized()) {
            // 若已经是最大化了，则还原
            win.unmaximize()
        } else {
            // 最大化窗口
            win.maximize()
        }
    })

    ipcMain.on('window-min', function() {

        win.minimize();
        win.setSkipTaskbar(true)


    })

    ipcMain.on('floadradminclose', function() {

     win.close();

        app.exit();

     


    })



}



function openloginwin() {


    loginwin = new BrowserWindow({
        width: 900,
        height: 500,
        frame: false,

        transparent: true,
        webPreferences: {
            nodeIntegration: true
        }

    })


    loginwin.openDevTools({ mode: 'detach' });
    loginwin.loadFile('./view/login.html');

    ipcMain.on("login-close", function() {
        loginwin.close();
        app.quit()

    })



    ipcMain.on("startlogin", function() {

            loginwin.setSize(700, 193);
            loginwin.center();
        }

    )








}

ipcMain.on("login-ok", function() {
    createWindow();
    loginwin.close();
})






function open_add_task_win() {
    add_task_win = new BrowserWindow({
        width: 600,
        height: 400,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        }

    })
    add_task_win.loadFile("add_task.html")
    add_task_win.openDevTools({ mode: 'detach' });



}



app.on('ready', openloginwin)




app.on('window-all-closed', () => {
        app.quit()
   
})