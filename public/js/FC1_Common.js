////////////// YÊU CẦU DỮ LIỆU TỪ SERVER- REQUEST DATA //////////////
var myVar = setInterval(myTimer, 100);
function myTimer() {
    socket.emit("Client-send-data", "Request data client");
}


// Chương trình con chuyển trang
function fn_ScreenChange(scr_1, scr_2, scr_3, scr_4, scr_5, scr_6)
{
    document.getElementById(scr_1).style.visibility = 'visible';   // Hiển thị trang được chọn
    document.getElementById(scr_2).style.visibility = 'hidden';    // Ẩn trang 2
    document.getElementById(scr_3).style.visibility = 'hidden';    // Ẩn trang 3
    document.getElementById(scr_4).style.visibility = 'hidden';    // Ẩn trang 4
    document.getElementById(scr_5).style.visibility = 'hidden';    // Ẩn trang 5
    document.getElementById(scr_6).style.visibility = 'hidden';    // Ẩn trang 6
}

// Hàm chức năng nút sửa/lưu dữ liệu
function fn_DataEdit(button1, button2)
{
    document.getElementById(button1).style.zIndex='1';  // Hiển nút 1
    document.getElementById(button2).style.zIndex='0';  // Ẩn nút 2
}

function fn_LogoutScreen(scr_1, scr_2, scr_3, scr_4, scr_5, scr_6){
    document.getElementById(scr_1).style.visibility = 'visible';   // Hiển thị trang được chọn
    document.getElementById(scr_2).style.visibility = 'hidden';    // Ẩn trang 2
    document.getElementById(scr_3).style.visibility = 'hidden';    // Ẩn trang 3
    document.getElementById(scr_4).style.visibility = 'hidden';    // Ẩn trang 4 
    document.getElementById(scr_5).style.visibility = 'hidden';    // Ẩn trang 5
    document.getElementById(scr_6).style.visibility = 'hidden';    // Ẩn trang 5
}

function loadPage(scr_1, scr_2, scr_3, scr_4, scr_5, scr_6){
    document.getElementById(scr_1).style.visibility = 'visible';  
    document.getElementById(scr_2).style.visibility = 'visible';  
    document.getElementById(scr_3).style.visibility = 'visible';  
    document.getElementById(scr_4).style.visibility = 'visible';  
    document.getElementById(scr_5).style.visibility = 'visible'; 
    document.getElementById(scr_6).style.visibility = 'visible'; 
}

function UnableBtt(btt_1, btt_2, btt_3, btt_4, btt_5, btt_6){
    document.getElementById(btt_1).style.display = "none";  
    document.getElementById(btt_2).style.display = "none";
    document.getElementById(btt_3).style.display = "none";
    document.getElementById(btt_4).style.display = "none";
    document.getElementById(btt_5).style.display = "none";
    document.getElementById(btt_6).style.display = "none";
}
function AbleBtt(btt_1, btt_2, btt_3, btt_4, btt_5, btt_5){
    document.getElementById(btt_1).style.display = "block";  
    document.getElementById(btt_2).style.display = "block";
    document.getElementById(btt_3).style.display = "block";
    document.getElementById(btt_4).style.display = "block";
    document.getElementById(btt_5).style.display = "block";
    document.getElementById(btt_6).style.display = "block";
}


document.addEventListener('DOMContentLoaded', function() {
    var sidebar = document.getElementById('slidebar');
    var isMouseOverSidebar = false;
    
    // Function to expand sidebar and show buttons
    function expandSidebar() {
        sidebar.classList.remove('collapsed');
    }

    // Function to collapse sidebar and hide buttons
    function collapseSidebar() {
        sidebar.classList.add('collapsed');
    }

    // Event listener for mouse enter (hover in) on sidebar
    sidebar.addEventListener('mouseenter', function() {
        isMouseOverSidebar = true;
        expandSidebar();
    });

    // Event listener for mouse leave (hover out) on sidebar
    sidebar.addEventListener('mouseleave', function() {
        isMouseOverSidebar = false;
        setTimeout(function() {
            if (!isMouseOverSidebar) {
                collapseSidebar();
            }
        }, 200); // Delay collapse to allow time for mouse to leave sidebar area
    });

    // Event listener for mouse move inside sidebar
    sidebar.addEventListener('mousemove', function() {
        if (!isMouseOverSidebar) {
            expandSidebar();
        }
    });

    // Initially collapse the sidebar
    collapseSidebar();
}); 

// Hàm hiển thị dữ liệu lên IO Field
function fn_IOFieldDataShow(tag, IOField, tofix){
    socket.on(tag,function(data){
        if(tofix == 0){
            document.getElementById(IOField).value = data;
        } else{
        document.getElementById(IOField).value = data.toFixed(tofix);
        }
    });
}

// Hàm chức năng nút sửa/lưu dữ liệu
function fn_DataEdit(button1, button2)
{
    document.getElementById(button1).style.zIndex='1';  // Hiển nút 1
    document.getElementById(button2).style.zIndex='0';  // Ẩn nút 2
}