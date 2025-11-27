const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
    const win = new BrowserWindow({
        width: 650,
        height: 700,

        // 🔥 창 크기 조절 허용
        resizable: true,
        maximizable: true,
        fullscreenable: true,

        // 🔥 너무 작아지면 룰렛 망가짐 → 최소 크기 지정
        minWidth: 500,
        minHeight: 550,

        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
