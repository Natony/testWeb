// Yêu cầu dữ liệu bảng
function fn_Table01_SQL_Show(){
    socket.emit("msg_SQL_Show", "true");
    socket.on('SQL_Show',function(data){
        fn_table_01(data);
    });
}
// Hiển thị dữ liệu ra bảng
function fn_table_01(data){
    if(data){
        $("#table_01 tbody").empty();
        var len = data.length;
        var txt = "<tbody>";
        if(len > 0){
            for(var i=0;i<len;i++){
                    txt += "<tr><td>"+data[i].date_time
                        +"</td><td>"+data[i].data_Setpoint
                        +"</td><td>"+data[i].data_PID_Freq_Hz
                        +"</td><td>"+data[i].data_PV_Pressure
                        +"</td><td>"+data[i].data_PID_Gain
                        +"</td><td>"+data[i].data_PID_Ti
                        +"</td><td>"+data[i].data_PID_Td
                        +"</td></tr>";
                    }
            if(txt != ""){
            txt +="</tbody>";
            $("#table_01").append(txt);
            }
        }
    }
}

// Tìm kiếm SQL theo khoảng thời gian
function fn_SQL_By_Time()
{
    var val = [document.getElementById('dtpk_Search_Start').value,
               document.getElementById('dtpk_Search_End').value];
    socket.emit('msg_SQL_ByTime', val);
    socket.on('SQL_ByTime', function(data){
        fn_table_01(data); // Show sdata
    });
}

// Hàm chức năng xuất dữ liệu Excel
function fn_excel(){
    var linktext = "";
    var bookname = "";
    socket.emit("msg_Excel_Report", true);
    socket.on('send_Excel_Report',function(data){
        linktext = data[0];
        bookname = data[1];
        // Delay save as
        var delayInMilliseconds = 1000; //Delay 1 second
        setTimeout(function() {
            saveAs(linktext, bookname);
        }, delayInMilliseconds);
    });
}



