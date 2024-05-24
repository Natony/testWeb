// Yêu cầu dữ liệu bảng
function fn_Table02_SQL_Show(){
    socket.emit("msg_SQL2_Show", "true");
    socket.on('SQL2_Show',function(data){
        fn_table_02(data);
    });
}
// Hiển thị dữ liệu ra bảng
function fn_table_02(data){
    if(data){
        $("#table_02 tbody").empty();
        var len = data.length;
        var txt = "<tbody>";
        if(len > 0){
            for(var i=0;i<len;i++){
                    txt += "<tr><td>"+data[i].DateTime
                        +"</td><td>"+data[i].Event
                        +"</td><td>"+data[i].Class
                        +"</td></tr>";
                    }
            if(txt != ""){
            txt +="</tbody>";
            $("#table_02").append(txt);
            }
        }
    }
}

// Tìm kiếm SQL theo khoảng thời gian
function fn_SQL2_By_Time()
{
    var val = [document.getElementById('dtpk_Search_Start2').value,
               document.getElementById('dtpk_Search_End2').value];
    socket.emit('msg_SQL2_ByTime', val);
    socket.on('SQL2_ByTime', function(data){
        fn_table_02(data); // Show sdata
    });
}