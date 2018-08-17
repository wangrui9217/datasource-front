function downloadFile(blob, fileName){
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    //此写法兼容可火狐浏览器
    document.body.appendChild(link);

    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", false, false);
    link.dispatchEvent(evt);

    document.body.removeChild(link);
}
export default downloadFile