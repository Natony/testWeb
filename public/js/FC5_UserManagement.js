var users = [
    { username: "admin", password: "123456", role: "admin" },
    { username: "user1", password: "1", role: "user" },
    { username: "user2", password: "2", role: "user" }
];
  
var isLogin;

document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser.role === "admin") {
            document.getElementById('div_login').style.display = 'none';
            fn_ScreenChange('Screen_Main', 'Screen_1', 'Screen_2', 'Screen_3', 'Screen_4', 'Screen_logout');
        } else if (currentUser.role === "user") {
            document.getElementById('div_login').style.display = 'none';
            fn_ScreenChange('Screen_Main', 'Screen_1', 'Screen_2', 'Screen_3', 'Screen_4', 'Screen_logout');
            document.getElementById("btt_Screen_1").disabled = true;
        }
    }
    else if(sessionStorage.getItem('isLoggedIn') === 'false'){
        loadPage('Screen_logout', 'Screen_Main', 'Screen_1', 'Screen_2', 'Screen_3', 'Screen_4');
        UnableBtt('btt_Screen_Main', 'btt_Screen_1', 'btt_Screen_2', 'btt_Screen_3', 'btt_Screen_4', 'bttLogout');
        document.getElementById('div_login').style.display = 'block';
        
    }
}); 

function login() {
    var username = document.getElementById("inputuser").value;
    var password = document.getElementById("inputpass").value;

    var currentUser = users.find(function(user) {
        return user.username === username && user.password === password;
    });

    if (currentUser) { 
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        if (currentUser.role === "admin") {
            fn_ScreenChange('Screen_Main', 'Screen_1', 'Screen_2', 'Screen_3', 'Screen_4', 'Screen_logout');
        } else if (currentUser.role === "user") {
            fn_ScreenChange('Screen_Main', 'Screen_1', 'Screen_2', 'Screen_3', 'Screen_4', 'Screen_logout');
            document.getElementById("btt_Screen_1").disabled = true;
        } 
        document.getElementById('div_login').style.display = 'none';
    } else {

        document.getElementById('div_login').style.display = 'block';
    }
}


function logout() {
    
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    alert("Đăng xuất thành công");
    fn_ScreenChange('Screen_logout', 'Screen_Main', 'Screen_1', 'Screen_2', 'Screen_3', 'Screen_4');
    UnableBtt('btt_Screen_Main', 'btt_Screen_1', 'btt_Screen_2', 'btt_Screen_3', 'btt_Screen_4', 'bttLogout');
}



