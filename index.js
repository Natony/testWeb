//////////////////////CẤU HÌNH KẾT NỐI KEPWARE////////////////////
const {TagBuilder, IotGateway} = require('kepserverex-js');
const tagBuilder = new TagBuilder({ namespace: 'Channel1.Device1' });
const iotGateway = new IotGateway({
    host: '127.0.0.1',
    port: 5000
});

/////////////HÀM ĐỌC/GHI DỮ LIỆU XUỐNG KEPWARE(PLC)//////////////
//Đọc dữ liệu
var tagArr = [];
function fn_tagRead(){
	iotGateway.read(TagList).then((data)=>{
		var lodash = require('lodash');
		tagArr = lodash.map(data, (item) => item.v);
		console.log(tagArr);
	});
}
// Ghi dữ liệu
function fn_Data_Write(tag,data){
    tagBuilder.clean();
    const set_value = tagBuilder
        .write(tag,data)
        .get();
    iotGateway.write(set_value);
}

///////////////////////////ĐỊNH NGHĨA TAG////////////////////////
// Khai báo tag
var WebSite_Setpoint = 'WebSite_Setpoint';
var WebSite_PID_Freq_Hz = 'WebSite_PID_Freq_Hz';
var WebSite_PV_Pressure = 'WebSite_PV_Pressure';
var WebSite_PID_Gain = 'WebSite_PID_Gain';
var WebSite_PID_Ti = 'WebSite_PID_Ti';
var WebSite_PID_Td = 'WebSite_PID_Td';
var WebSite_Man_OnOff = 'WebSite_Man_OnOff';
var sql_insert_Trigger = 'sql_insert_Trigger';
var WebSite_Man_Frequency = 'WebSite_Man_Frequency';
var WebSite_Light_Status = 'WebSite_Light_Status';
var WebSite_SW_Man_Auto = 'WebSite_SW_Man_Auto';
var WebSite_Man_Status = 'WebSite_Man_Status';
var WebSite_Err_Status = 'WebSite_Err_Status';
var WebSite_FS_Status = 'WebSite_FS_Status';
var WebSite_Start_Ivt = 'WebSite_Start_Ivt';

//Alarm
var sql_Alarm_Trigger1 = 'sql_Alarm_Trigger1';
var sql_Alarm_Trigger2 = 'sql_Alarm_Trigger2';
var sql_Alarm_Trigger3 = 'sql_Alarm_Trigger3';
var sql_Alarm_Trigger4 = 'sql_Alarm_Trigger4';
var sql_Alarm_Trigger5 = 'sql_Alarm_Trigger5';
var sql_Alarm_Trigger6 = 'sql_Alarm_Trigger6';

var WebSite_String_Sql1 = 'WebSite_String_Sql1';
var WebSite_String_Sql2 = 'WebSite_String_Sql2';
var WebSite_String_Sql3 = 'WebSite_String_Sql3';
var WebSite_String_Sql4 = 'WebSite_String_Sql4';
var WebSite_String_Sql5 = 'WebSite_String_Sql5';
var WebSite_String_Sql6 = 'WebSite_String_Sql6';

//time

var sql_Year ='sql_Year';
var sql_Month ='sql_Month';
var sql_Day ='sql_Day';
var sql_Hour ='sql_Hour';
var sql_Minute ='sql_Minute';
var sql_Second ='sql_Second';

// Đọc dữ liệu
const TagList = tagBuilder
.read(sql_insert_Trigger)
.read(WebSite_Setpoint)
.read(WebSite_PID_Freq_Hz)
.read(WebSite_PV_Pressure)
.read(WebSite_PID_Gain)
.read(WebSite_PID_Ti)
.read(WebSite_PID_Td)
.read(WebSite_Man_OnOff)
.read(WebSite_Man_Frequency)
.read(WebSite_Light_Status)
.read(WebSite_SW_Man_Auto)
.read(WebSite_Man_Status)
.read(WebSite_Err_Status)
.read(WebSite_FS_Status)
.read(WebSite_Start_Ivt)
//Alarm
.read(sql_Alarm_Trigger1)
.read(sql_Alarm_Trigger2)
.read(sql_Alarm_Trigger3)
.read(sql_Alarm_Trigger4)
.read(sql_Alarm_Trigger5)
.read(sql_Alarm_Trigger6)
.read(WebSite_String_Sql1)
.read(WebSite_String_Sql2)
.read(WebSite_String_Sql3)
.read(WebSite_String_Sql4)
.read(WebSite_String_Sql5)
.read(WebSite_String_Sql6)
//time
.read(sql_Year)
.read(sql_Month)
.read(sql_Day)
.read(sql_Hour)
.read(sql_Minute)
.read(sql_Second)

.get();

///////////////////////////QUÉT DỮ LIỆU////////////////////////
// Tạo Timer quét dữ liệu
setInterval(
	() => fn_read_data_scan(),
	1000 //100ms = 1s
);

var sqlins1_done = false;
var sqlins2_done = false;
var sqlins3_done = false;
var sqlins4_done = false;
var sqlins5_done = false;
var sqlins6_done = false;

// Quét dữ liệu
function fn_read_data_scan(){
	fn_tagRead();	// Đọc giá trị tag
    fn_sql_insert(); // Ghi dữ liệu vào SQL
    sendDateTimeParts();// gửi thời gian
    fn_sql_insert_alarm(sqlins1_done, tagArr[15], tagArr[21], sql_Alarm_Trigger1);
    fn_sql_insert_alarm(sqlins2_done, tagArr[16], tagArr[22], sql_Alarm_Trigger2);
    fn_sql_insert_alarm(sqlins3_done, tagArr[17], tagArr[23], sql_Alarm_Trigger3);
    fn_sql_insert_alarm(sqlins4_done, tagArr[18], tagArr[24], sql_Alarm_Trigger4);
    fn_sql_insert_alarm(sqlins5_done, tagArr[19], tagArr[25], sql_Alarm_Trigger5);
    fn_sql_insert_alarm(sqlins6_done, tagArr[20], tagArr[26], sql_Alarm_Trigger6);
}

//
// /////////////////////////KẾT NỐI CƠ SỞ DỮ LIỆU SQL/////////////////////
// Khai báo SQL
var mysql = require('mysql');
var sqlcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "sql_plc_datn",
  dateStrings:true
}); 

// Ghi dữ liệu vào SQL
var sqlins_done = false; // Biến báo đã ghi xong dữ liệu

function getCurrentDateTime() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; // Vùng Việt Nam (GMT7+)
    var temp_datenow = new Date();
    var timeNow = (new Date(temp_datenow - tzoffset));
    return timeNow;
}

function fn_sql_insert() {
    var trigger = tagArr[0]; // Trigger đọc về từ PLC
    var sqltable_Name = "plc_data";
    // Lấy thời gian hiện tại
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //Vùng Việt Nam (GMT7+)
    var temp_datenow = new Date();
    var timeNow = (new Date(temp_datenow - tzoffset)).toISOString().slice(0, -1).replace("T", " ");
    var timeNow_toSQL = "'" + timeNow + "',";

    // Dữ liệu đọc lên từ các tag
    var data_Setpoint = "'" + tagArr[1] + "',";
    var data_PID_Freq_Hz = "'" + tagArr[2] + "',"; 
    var data_PV_Pressure = "'" + tagArr[3] + "',"; 
    var data_PID_Gain = "'" + tagArr[4] + "',"; 
    var data_PID_Ti = "'" + tagArr[5] + "',"; 
    var data_PID_Td = "'" + tagArr[6] + "'"; 

    // Ghi dữ liệu vào SQL
    if (trigger == true & trigger != sqlins_done) { // Replaced single '&' with '&&'
        var sqlins1 = "INSERT INTO " +
            sqltable_Name +
            " (date_time, data_Setpoint, data_PID_Freq_Hz, data_PV_Pressure, data_PID_Gain, data_PID_Ti, data_PID_Td) VALUES (";
        var sqlins2 = timeNow_toSQL +
            data_Setpoint +
            data_PID_Freq_Hz +
            data_PV_Pressure +
            data_PID_Gain +
            data_PID_Ti +
            data_PID_Td;
        var sqlins = sqlins1 + sqlins2 + "); ";
        console.log(sqlins);
        // Thực hiện ghi dữ liệu vào SQL
        sqlcon.query(sqlins, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("SQL - Ghi dữ liệu thành công");
            }
        });
    }
    sqlins_done = trigger;

}

function fn_sql_insert_alarm(sqlins_done, tagTrigger, sql_excute, tagName){
    var trigger = tagTrigger;
    var sqlins = sql_excute;

    if (trigger == true & trigger != sqlins_done) {
        sqlcon.query(sqlins, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("SQL - Ghi Alarm thành công");
            }
        });
    }
    fn_Data_Write(tagName, false);
    sqlins_done = trigger;
}

// /////////////////////////THIẾT LẬP KẾT NỐI WEB/////////////////////////
var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3000);
// Home calling
app.get("/", function(req, res){
    res.render("home")
});

// ///////////LẬP BẢNG TAG ĐỂ GỬI QUA CLIENT (TRÌNH DUYỆT)///////////
function fn_tag(){
    io.sockets.emit("sql_insert_Trigger", tagArr[0]);    
    io.sockets.emit("WebSite_Setpoint", tagArr[1]);
    io.sockets.emit("WebSite_PID_Freq_Hz", tagArr[2]);
    io.sockets.emit("WebSite_PV_Pressure", tagArr[3]);
    io.sockets.emit("WebSite_PID_Gain", tagArr[4]);
    io.sockets.emit("WebSite_PID_Ti", tagArr[5]);
    io.sockets.emit("WebSite_PID_Td", tagArr[6]);
    io.sockets.emit("WebSite_Man_OnOff", tagArr[7]);
    io.sockets.emit("WebSite_Man_Frequency", tagArr[8]);
    io.sockets.emit("WebSite_Light_Status", tagArr[9]);
    io.sockets.emit("WebSite_SW_Man_Auto", tagArr[10]);
    io.sockets.emit("WebSite_Man_Status", tagArr[11]);
    io.sockets.emit("WebSite_Err_Status", tagArr[12]);
    io.sockets.emit("WebSite_FS_Status", tagArr[13]);
    io.sockets.emit("WebSite_Start_Ivt", tagArr[14]);
    //Alarm
    io.sockets.emit("sql_Alarm_Trigger1", tagArr[15]);
    io.sockets.emit("sql_Alarm_Trigger2", tagArr[16]);
    io.sockets.emit("sql_Alarm_Trigger3", tagArr[17]);
    io.sockets.emit("sql_Alarm_Trigger4", tagArr[18]);
    io.sockets.emit("sql_Alarm_Trigger5", tagArr[19]);
    io.sockets.emit("sql_Alarm_Trigger6", tagArr[20]);

    io.sockets.emit("WebSite_String_Sql1", tagArr[21]);
    io.sockets.emit("WebSite_String_Sql2", tagArr[22]);
    io.sockets.emit("WebSite_String_Sql3", tagArr[23]);
    io.sockets.emit("WebSite_String_Sql4", tagArr[24]);
    io.sockets.emit("WebSite_String_Sql5", tagArr[25]);
    io.sockets.emit("WebSite_String_Sql6", tagArr[26]);
    //Time
    io.sockets.emit("sql_Year", tagArr[27]);
    io.sockets.emit("sql_Month", tagArr[28]);
    io.sockets.emit("sql_Day", tagArr[29]);
    io.sockets.emit("sql_Hour", tagArr[30]);
    io.sockets.emit("sql_Minute", tagArr[31]);
    io.sockets.emit("sql_Second", tagArr[32]);
}


// ++++++++++++++++++++++++++GHI DỮ LIỆU XUỐNG PLC+++++++++++++++++++++++++++
// MÀN HÌNH ĐIỀU KHIỂN
// ///////////GHI DỮ LIỆU NÚT NHẤN XUỐNG PLC///////////////////
// Điều khiên Manual
io.on("connection", function(socket)
{
    socket.on("Client-send-cmdSys", function(data){
		fn_Data_Write(WebSite_Man_OnOff,data);
	});
});

io.on("connection", function(socket)
{
    socket.on("cmd_Man_Edit_Data", function(data){
        fn_Data_Write(WebSite_Man_Frequency,data[0]);
    });
});

io.on("connection", function(socket)
{
    socket.on("Client-send-cmdSwitch", function(data){
		fn_Data_Write(WebSite_SW_Man_Auto,data);
	});
});
// Điều chỉnh các thông số PID
io.on("connection", function(socket)
{
    socket.on("cmd_Auto_Edit_Data", function(data){
        fn_Data_Write(WebSite_Setpoint,data[0]);
        fn_Data_Write(WebSite_PID_Gain,data[1]);
        fn_Data_Write(WebSite_PID_Ti,data[2]);
        fn_Data_Write(WebSite_PID_Td,data[3]);
    });
});

io.on("connection", function(socket)
{
    socket.on("cmd_Auto_Edit_Wait", function(data){
        fn_Data_Write(WebSite_Edit_Wait,data);
    });
});


// ///////////GỬI DỮ LIỆU BẢNG TAG ĐẾN CLIENT (TRÌNH DUYỆT)///////////
io.on("connection", function(socket){
    socket.on("Client-send-data", function(data){
    fn_tag();
});});

// Đọc dữ liệu từ SQL
io.on("connection", function(socket){
    socket.on("msg_SQL_Show", function(data)
    {
        var sqltable_Name = "plc_data";
        var query = "SELECT * FROM " + sqltable_Name + ";"
        sqlcon.query(query, function(err, results, fields) {
            if (err) {
                console.log(err);
            } else {
                const objectifyRawPacket = row => ({...row});
                const convertedResponse = results.map(objectifyRawPacket);
                socket.emit('SQL_Show', convertedResponse);
            }
        });
    });
});

io.on("connection", function(socket){
    socket.on("msg_SQL2_Show", function(data)
    {
        var sqltable_Name = "sql_plc_datn.alarm";
        var query = "SELECT * FROM " + sqltable_Name + ";"
        sqlcon.query(query, function(err, results, fields) {
            if (err) {
                console.log(err);
            } else {
                const objectifyRawPacket = row => ({...row});
                const convertedResponse = results.map(objectifyRawPacket);
                socket.emit('SQL2_Show', convertedResponse);
            }
        });
    });
});

// Tìm kiếm DashBoard
// Mảng xuất dữ liệu Excel
var SQL_Excel = [];  // Dữ liệu Excel
io.on("connection", function(socket){
    socket.on("msg_SQL_ByTime", function(data)
    {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset time Việt Nam (GMT7+)
        // Lấy thời gian tìm kiếm từ date time piker
        var timeS = new Date(data[0]); // Thời gian bắt đầu
        var timeE = new Date(data[1]); // Thời gian kết thúc
        // Quy đổi thời gian ra định dạng cua MySQL
        var timeS1 = "'" + (new Date(timeS - tzoffset)).toISOString().slice(0, -1).replace("T"," ") + "'";
        var timeE1 = "'" + (new Date(timeE - tzoffset)).toISOString().slice(0, -1).replace("T"," ") + "'";
        var timeR = timeS1 + "AND" + timeE1; // Khoảng thời gian tìm kiếm (Time Range)

        var sqltable_Name = "plc_data"; // Tên bảng
        var dt_col_Name = "date_time";  // Tên cột thời gian

        var Query1 = "SELECT * FROM " + sqltable_Name + " WHERE "+ dt_col_Name + " BETWEEN ";
        var Query = Query1 + timeR + ";";

        sqlcon.query(Query, function(err, results, fields) {
            if (err) {
                console.log(err);
            } else {
                const objectifyRawPacket = row => ({...row});
                const convertedResponse = results.map(objectifyRawPacket);
                SQL_Excel = convertedResponse; // Xuất báo cáo Excel
                socket.emit('SQL_ByTime', convertedResponse);
            }
        });
    });
});

// Tìm kiếm Alarm
// Mảng xuất dữ liệu Excel
var SQL2_Excel = [];  // Dữ liệu Excel
io.on("connection", function(socket){
    socket.on("msg_SQL2_ByTime", function(data)
    {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset time Việt Nam (GMT7+)
        // Lấy thời gian tìm kiếm từ date time piker
        var timeS2 = new Date(data[0]); // Thời gian bắt đầu
        var timeE2 = new Date(data[1]); // Thời gian kết thúc
        // Quy đổi thời gian ra định dạng cua MySQL
        var timeS3 = "'" + (new Date(timeS2 - tzoffset)).toISOString().slice(0, -1).replace("T"," ") + "'";
        var timeE3 = "'" + (new Date(timeE2 - tzoffset)).toISOString().slice(0, -1).replace("T"," ") + "'";
        var timeR3 = timeS3 + "AND" + timeE3; // Khoảng thời gian tìm kiếm (Time Range)

        var sqltable_Name = "sql_plc_datn.alarm"; // Tên bảng
        var dt_col_Name = "DateTime";  // Tên cột thời gian

        var Query2 = "SELECT * FROM " + sqltable_Name + " WHERE "+ dt_col_Name + " BETWEEN ";
        var Query3 = Query2 + timeR3 + ";";

        sqlcon.query(Query3, function(err, results, fields) {
            if (err) {
                console.log(err);
            } else {
                const objectifyRawPacket = row => ({...row});
                const convertedResponse = results.map(objectifyRawPacket);
                socket.emit('SQL2_ByTime', convertedResponse);
            }
        });
    });
});

// /////////////////////////////// BÁO CÁO EXCEL ///////////////////////////////
const Excel = require('exceljs');
const { CONNREFUSED } = require('dns');
const { time } = require('console');
const { fn } = require('jquery');

function fn_excelExport(){
    // =====================CÁC THUỘC TÍNH CHUNG=====================
        // Lấy ngày tháng hiện tại
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let day = date_ob.getDay();
        var dayName = '';
        if(day == 0){dayName = 'Chủ nhật,'}
        else if(day == 1){dayName = 'Thứ hai,'}
        else if(day == 2){dayName = 'Thứ ba,'}
        else if(day == 3){dayName = 'Thứ tư,'}
        else if(day == 4){dayName = 'Thứ năm,'}
        else if(day == 5){dayName = 'Thứ sáu,'}
        else if(day == 6){dayName = 'Thứ bảy,'}
        else{};
    // Tạo và khai báo Excel
    let workbook = new Excel.Workbook()
    let worksheet =  workbook.addWorksheet('Báo cáo sản xuất', {
      pageSetup:{paperSize: 9, orientation:'landscape'},
      properties:{tabColor:{argb:'FFC0000'}},
    });
    // Page setup (cài đặt trang)
    worksheet.properties.defaultRowHeight = 20;
    worksheet.pageSetup.margins = {
      left: 0.3, right: 0.25,
      top: 0.75, bottom: 0.75,
      header: 0.3, footer: 0.3
    };
    // =====================THẾT KẾ HEADER=====================
    // Logo công ty
    const imageId1 = workbook.addImage({
        filename: 'public/images/logoHcmute.png',
        extension: 'png',
      });
    worksheet.addImage(imageId1, 'A1:A3');
    // Thông tin công ty
    worksheet.getCell('B1').value = 'Trường Đại Học Sư Phạm Kỹ Thuật Thành phố Hồ Chí Minh';
    worksheet.getCell('B1').style = { font:{bold: true,size: 14},alignment: {vertical: 'middle'}} ;
    worksheet.getCell('B2').value = 'Địa chỉ:  Số 1 Võ Văn Ngân, Linh Chiểu, Thủ Đức, Thành Phố Hồ Chí Minh';
    worksheet.getCell('B3').value = 'Hotline: + 0999 999 999';
    // Tên báo cáo
    worksheet.getCell('A5').value = 'BÁO CÁO SẢN XUẤT';
    worksheet.mergeCells('A5:F5');
    worksheet.getCell('A5').style = { font:{name: 'Times New Roman', bold: true,size: 16},alignment: {horizontal:'center',vertical: 'middle'}} ;
    // Ngày in biểu
    worksheet.getCell('F6').value = "Ngày in biểu: " + dayName + date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
    worksheet.getCell('F6').style = { font:{bold: false, italic: true},alignment: {horizontal:'right',vertical: 'bottom',wrapText: false}} ;

    // Tên nhãn các cột
    var rowpos = 9;
    var collumName = ["STT","Thời gian", "SetPoint", "PID Freq Hz", "PV Pressure", "Gain", "Ti", "Td"]
    worksheet.spliceRows(rowpos, 1, collumName);

    // =====================XUẤT DỮ LIỆU EXCEL SQL=====================
    // Dump all the data into Excel
    var rowIndex = 0;
    SQL_Excel.forEach((e, index) => {
    // row 1 is the header.
    rowIndex =  index + rowpos;
    // worksheet1 collum
    worksheet.columns = [
          {key: 'STT'},
          {key: 'date_time'},
          {key: 'data_Setpoint'},
          {key: 'data_PID_Freq_Hz'},
          {key: 'data_PV_Pressure'},
          {key: 'data_PID_Gain'},
          {key: 'data_PID_Ti'},
          {key: 'data_PID_Td'},
        ]
    worksheet.addRow({
          STT: {
            formula: index + 1
          },
          ...e
        })
    })
    // Lấy tổng số hàng
    const totalNumberOfRows = worksheet.rowCount;
    // Tính tổng
    worksheet.addRow([
        'Tổng cộng:',
        '',
        '',
      {formula: `=sum(D${rowpos + 1}:D${totalNumberOfRows})`},
      {formula: `=sum(E${rowpos + 1}:E${totalNumberOfRows})`},
    ])
    // Style cho hàng total (Tổng cộng)
    worksheet.getCell(`A${totalNumberOfRows+1}`).style = { font:{bold: true,size: 12},alignment: {horizontal:'center',}} ;
    // Tô màu cho hàng total (Tổng cộng)
    const total_row = ['A','B', 'C', 'D', 'E','F', 'G', 'H']
    total_row.forEach((v) => {
        worksheet.getCell(`${v}${totalNumberOfRows+1}`).fill = {type: 'pattern',pattern:'solid',fgColor:{ argb:'f2ff00' }}
})

    // =====================STYLE CHO CÁC CỘT/HÀNG=====================
    // Style các cột nhãn
    const HeaderStyle = ['A','B', 'C', 'D', 'E','F', 'G', 'H']
    HeaderStyle.forEach((v) => {
        worksheet.getCell(`${v}${rowpos}`).style = { font:{bold: true},alignment: {horizontal:'center',vertical: 'middle',wrapText: true}} ;
        worksheet.getCell(`${v}${rowpos}`).border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        }
    })
    // Cài đặt độ rộng cột
    worksheet.columns.forEach((column, index) => {
        column.width = 15;
    })
    // Set width header
    worksheet.getColumn(1).width = 12;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;

    // ++++++++++++Style cho các hàng dữ liệu++++++++++++
    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      var datastartrow = rowpos;
      var rowindex = rowNumber + datastartrow;
      const rowlength = datastartrow + SQL_Excel.length
      if(rowindex >= rowlength+1){rowindex = rowlength+1}
      const insideColumns = ['A','B', 'C', 'D', 'E','F', 'G', 'H']
    // Tạo border
      insideColumns.forEach((v) => {
          // Border
        worksheet.getCell(`${v}${rowindex}`).border = {
          top: {style: 'thin'},
          bottom: {style: 'thin'},
          left: {style: 'thin'},
          right: {style: 'thin'}
        },
        // Alignment
        worksheet.getCell(`${v}${rowindex}`).alignment = {horizontal:'center',vertical: 'middle',wrapText: true}
      })
    })


    // =====================THẾT KẾ FOOTER=====================
    worksheet.getCell(`F${totalNumberOfRows+2}`).value = 'Ngày …………tháng ……………năm 20………';
    worksheet.getCell(`F${totalNumberOfRows+2}`).style = { font:{bold: true, italic: false},alignment: {horizontal:'right',vertical: 'middle',wrapText: false}} ;

    worksheet.getCell(`B${totalNumberOfRows+3}`).value = 'Giám đốc';
    worksheet.getCell(`B${totalNumberOfRows+4}`).value = '(Ký, ghi rõ họ tên)';
    worksheet.getCell(`B${totalNumberOfRows+3}`).style = { font:{bold: true, italic: false},alignment: {horizontal:'center',vertical: 'bottom',wrapText: false}} ;
    worksheet.getCell(`B${totalNumberOfRows+4}`).style = { font:{bold: false, italic: true},alignment: {horizontal:'center',vertical: 'top',wrapText: false}} ;

    worksheet.getCell(`D${totalNumberOfRows+3}`).value = 'Trưởng ca';
    worksheet.getCell(`D${totalNumberOfRows+4}`).value = '(Ký, ghi rõ họ tên)';
    worksheet.getCell(`D${totalNumberOfRows+3}`).style = { font:{bold: true, italic: false},alignment: {horizontal:'center',vertical: 'bottom',wrapText: false}} ;
    worksheet.getCell(`D${totalNumberOfRows+4}`).style = { font:{bold: false, italic: true},alignment: {horizontal:'center',vertical: 'top',wrapText: false}} ;

    worksheet.getCell(`F${totalNumberOfRows+3}`).value = 'Người in biểu';
    worksheet.getCell(`F${totalNumberOfRows+4}`).value = '(Ký, ghi rõ họ tên)';
    worksheet.getCell(`F${totalNumberOfRows+3}`).style = { font:{bold: true, italic: false},alignment: {horizontal:'center',vertical: 'bottom',wrapText: false}} ;
    worksheet.getCell(`F${totalNumberOfRows+4}`).style = { font:{bold: false, italic: true},alignment: {horizontal:'center',vertical: 'top',wrapText: false}} ;

    // =====================THỰC HIỆN XUẤT DỮ LIỆU EXCEL=====================
    // Export Link
    var currentTime = year + "_" + month + "_" + date + "_" + hours + "h" + minutes + "m" + seconds + "s";
    var saveasDirect = "Report/Report_" + currentTime + ".xlsx";
    SaveAslink = saveasDirect; // Send to client
    var booknameLink = "public/" + saveasDirect;

    var Bookname = "Report_" + currentTime + ".xlsx";
    // Write book name
    workbook.xlsx.writeFile(booknameLink)

    // Return
    return [SaveAslink, Bookname]
} // Đóng fn_excelExport

// =====================TRUYỀN NHẬN DỮ LIỆU VỚI TRÌNH DUYỆT=====================
// Truyền nhận dữ liệu với trình duyệt
io.on("connection", function(socket){
    socket.on("msg_Excel_Report", function(data)
    {
        const [SaveAslink1, Bookname] = fn_excelExport();
        var data = [SaveAslink1, Bookname];
        socket.emit('send_Excel_Report', data);
    });
});

function sendDateTimeParts(){
    var currentTime = getCurrentDateTime();
    var year = currentTime.getFullYear();
    var month = currentTime.getMonth() + 1; // Tháng bắt đầu từ 0
    var day = currentTime.getDate();
    var hour = currentTime.getHours();
    var minute = currentTime.getMinutes();
    var second = currentTime.getSeconds();

    fn_Data_Write(sql_Year, year);
    fn_Data_Write(sql_Month, month);
    fn_Data_Write(sql_Day, day);
    fn_Data_Write(sql_Hour, hour);
    fn_Data_Write(sql_Minute, minute);
    fn_Data_Write(sql_Second, second);
}


