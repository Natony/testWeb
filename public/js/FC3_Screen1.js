// Hàm hiển thị màu nút nhấn
function fn_btt_Color(tag, bttID, on_Color, off_Color){
    socket.on(tag,function(data){
        if(data == true){
            document.getElementById(bttID).style.backgroundColor = on_Color;
        } else{
            document.getElementById(bttID).style.backgroundColor = off_Color;
        }
    });
}

// Hàm chức năng hiển thị trạng thái symbol
function fn_SymbolStatus(ObjectID, SymName, Tag)
{
    var imglink_0 = "images/Symbol/" + SymName + "_0.png"; // Trạng thái tag = 0
    var imglink_1 = "images/Symbol/" + SymName + "_1.png"; // Trạng thái tag = 1
    socket.on(Tag, function(data){
        if (data == false)
        {
            document.getElementById(ObjectID).src = imglink_0;
        }
        else if (data == true)
        {
            document.getElementById(ObjectID).src = imglink_1;
        }
    });
}

///// HÀM CHỨC NĂNG NÚT NHẤN SỬA //////
// Tạo 1 tag tạm báo đang sửa dữ liệu
var Auto_data_edditting = false;

function fn_Auto_EditBtt(bttSaveID, bttEditID){
    // Cho hiển thị nút nhấn lưu
    fn_DataEdit(bttSaveID, bttEditID);
    // Cho tag báo đang sửa dữ liệu lên giá trị true
    Auto_data_edditting = true;
    // Kích hoạt chức năng sửa của các IO Field
    document.getElementById("tbx_SetPoint").disabled = false;
    document.getElementById("tbx_PID_Gain").disabled = false;
    document.getElementById("tbx_PID_Ti").disabled = false;
    document.getElementById("tbx_PID_Td").disabled = false;
}
///// HÀM CHỨC NĂNG NÚT NHẤN LƯU //////
function fn_Auto_SaveBtt(bttSaveID, bttEditID){
    // Cho hiển thị nút nhấn sửa
    fn_DataEdit(bttEditID, bttSaveID);
    // Cho tag đang sửa dữ liệu về 0
    Auto_data_edditting = false;
                        // Gửi dữ liệu cần sửa xuống PLC
    var data_edit_array = [document.getElementById('tbx_SetPoint').value,
                            document.getElementById('tbx_PID_Gain').value,
                            document.getElementById('tbx_PID_Ti').value,
                            document.getElementById('tbx_PID_Td').value];
    socket.emit('cmd_Auto_Edit_Data', data_edit_array);
    alert('Dữ liệu đã được lưu!');
    // Vô hiệu hoá chức năng sửa của các IO Field
    document.getElementById("tbx_SetPoint").disabled = true;
    document.getElementById("tbx_PID_Gain").disabled = true;
    document.getElementById("tbx_PID_Ti").disabled = true;
    document.getElementById("tbx_PID_Td").disabled = true;

    updateRealtimeGraph();
}

///// HÀM CHỨC NĂNG NÚT NHẤN SỬA //////
// Tạo 1 tag tạm báo đang sửa dữ liệu
var Man_data_edditting = false;

function fn_Man_EditBtt(bttSaveID, bttEditID){
    // Cho hiển thị nút nhấn lưu
    fn_DataEdit(bttSaveID, bttEditID);
    // Cho tag báo đang sửa dữ liệu lên giá trị true
    Man_data_edditting = true;
    // Kích hoạt chức năng sửa của các IO Field
    document.getElementById("tbx_Man_Frequency").disabled = false;
}
///// HÀM CHỨC NĂNG NÚT NHẤN LƯU //////
function fn_Man_SaveBtt(bttSaveID, bttEditID){
    // Cho hiển thị nút nhấn sửa
    fn_DataEdit(bttEditID, bttSaveID);
    // Cho tag đang sửa dữ liệu về 0
    Man_data_edditting = false;
                        // Gửi dữ liệu cần sửa xuống PLC
    var data_edit_array = [document.getElementById('tbx_Man_Frequency').value];
    socket.emit('cmd_Man_Edit_Data', data_edit_array);
    alert('Dữ liệu đã được lưu!');
    // Vô hiệu hoá chức năng sửa của các IO Field
    document.getElementById("tbx_Man_Frequency").disabled = true;

}

// Hàm chức năng đọc dữ liệu lên IO Field
function fn_IOFieldDataShow(tag, IOField, tofix)
{
    socket.on(tag, function(data){
        if (tofix == 0 & Auto_data_edditting != true)
        {
            document.getElementById(IOField).value = data;
        }
        else if(Auto_data_edditting != true)
        {
            document.getElementById(IOField).value = data.toFixed(tofix);
        }
    });
}

function fn_IOFieldDataShow2(tag, IOField, tofix)
{
    socket.on(tag, function(data){
        if (tofix == 0 & Man_data_edditting != true)
        {
            document.getElementById(IOField).value = data;
        }
        else if(Man_data_edditting != true)
        {
            document.getElementById(IOField).value = data.toFixed(tofix);
        }
    });
}

function updateRealtimeGraph() {
    // Gọi lại các dữ liệu cần thiết từ PLC hoặc từ các trường input trong HTML
    var data_SP_trend = 0;
    var data_PV_trend = 0;

    // Cập nhật dữ liệu lên đồ thị
    Plotly.newPlot('plotly_container', [{
        y: [data_SP_trend],
        type: 'line',
        name: 'SP'
    }, {
        y: [data_PV_trend],
        type: 'line',
        name: 'PV'
    }]);

    cnt = 0;
}

// Hàm thực hiện toggle switch
function fn_SwitchControl(ObjectID, Tag) {
    var switchElement = document.getElementById(ObjectID);
    var switchTextOn = switchElement.nextElementSibling.querySelector('.switch-text.on');
    var switchTextOff = switchElement.nextElementSibling.querySelector('.switch-text.off');

    // Biến tạm để lưu trữ trạng thái trước đó của switch
    var lastChecked = switchElement.checked;

    // Lắng nghe sự kiện thay đổi trạng thái của switch
    switchElement.addEventListener('change', function() {
        var isChecked = this.checked;
        // Chỉ gửi yêu cầu đến máy chủ nếu trạng thái thực tế của switch thay đổi
        if (isChecked !== lastChecked) {
            // Gửi yêu cầu đến máy chủ thông qua socket.io
            socket.emit('Client-send-cmdSwitch', isChecked);
            // Cập nhật giá trị trạng thái trước đó của switch
            lastChecked = isChecked;
        }
    });

    socket.on(Tag, function(data) {
        switchElement.checked = data;
        // Cập nhật giao diện của switch dựa trên trạng thái mới
        if (data) {
            switchElement.nextElementSibling.style.backgroundColor = '#2196F3';
            switchTextOn.style.display = 'block';
            switchTextOff.style.display = 'none';
        } else {
            switchElement.nextElementSibling.style.backgroundColor = '#ccc';
            switchTextOn.style.display = 'none';
            switchTextOff.style.display = 'block';
        }
        // Cập nhật giá trị trạng thái trước đó của switch sau khi cập nhật
        lastChecked = data;
    });
}

// Hàm chức năng nút sửa/lưu dữ liệu
function fn_DataEdit(button1, button2)
{
    document.getElementById(button1).style.zIndex='1';  // Hiển nút 1
    document.getElementById(button2).style.zIndex='0';  // Ẩn nút 2
}