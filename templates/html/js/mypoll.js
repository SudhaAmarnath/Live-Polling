/*
This file contains all the custom code for ConnectMe and will be used for ajax calls
*/
$(document).ready(function() {

/* First Check for Page Auth, this will be the first function which will be executed  */

 $.ajaxSetup({
    headers: {
      'Authorization': "bearer " + $.cookie('token')
    }
 });

 alert(" I m in my poll");
/* Call this function for validating token at server side to make sure that user is authenticated */
 var ret_code=validateToken();

/*###### Following section container code for user admin tables. Please check useradmin.html pages################  */
$("#useradmintab1").hide();

/* ### Admin block for user administration will be enabled if and only if current role of the user is admin */
if ($.cookie('role') == 'ADMIN')
{

$("#useradmintab1").show();

$("#adduser1").hide();
$("#adduserbtn1").hide();
$("#showuserreportbtn1").hide();

$("#showuserreportbtn1").click(function() {
  $("#listuserdata1").show();
  $("#adduser1").hide();
  $("#adduserbtn1").hide();
  $("#showuserreportbtn1").hide();
  $("#popadduserfrm1").show();
  populateTabData();
});

$("#useradmintab1").click(function() {
  $("#listuserdata1").show();
  $("#adduser1").hide();
  $("#adduserbtn1").hide();
  $("#showuserreportbtn1").hide();
  $("#popadduserfrm1").show();
  populateTabData();
});

$("#popadduserfrm1").click(function() {
  $("#adduser1").show();
  $("#adduserbtn1").show();
  $("#showuserreportbtn1").show();
  $("#listuserdata1").hide();
  $("#popadduserfrm1").hide();
});

$("#adduser1").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    var data = $('#adduser1').serializeArray();
    console.log(data);
    var tenancy_id = $.cookie('tenancy_id');
    data.push({name: "tenancy_id", value: tenancy_id})
    console.log(data);
    var req=$.ajax({
      type: "POST",
      url: "/api/usermgmt",
      data: $.param(data),
    });
    req.done();
    req.fail();
 });
}
else {
  $("#adduser1").hide();
  $("#adduserbtn1").hide();
  $("#showuserreportbtn1").hide();
  $("#listuserdata1").hide();
  $("#popadduserfrm1").hide();
  $("#useradmintab1").hide();
}
/* ##### ADMIn Role Check Ends here ######## */
/*###### The above section contain code for user admin tables. Please check useradmin.html pages. The above code section ends here ################  */

});


/* ########### Token Auth block begins here  #################### */

function validateToken()
{
 alert("I am in validatetoken, sucess2");
if ( $.cookie('token') && $.cookie('username'))
  {
     var req = $.ajax({
        type: "GET",
        url: "/api/items",
    });
    req.complete(chkResponse);
 alert("I am in validatetoken, sucess1");
}
else
 {
  alert(" I am in validatetoken. failed");
  redirectLogin();
 }
}

function redirectLogin()
{
  alert("You have not logged in! please Signin");
  window.location.href = "login.html";
}

function chkResponse(response)
{
console.log(response);
if (response['status']==200 && response['statusText']=='OK')
 {
          console.log(' I am in sucess');
	  return 0;
 }
 else
  {
	redirectLogin();
  }
redirectLogin();
}

/* ########### Token Auth block end here  #################### */


/* ############ User Admin Table Management begin here ############## */

function populateTabData()
{
 var tenancy_id = $.cookie('tenancy_id');
 console.log('tenancy_id');

 var req = $.ajax({
    type: "GET",
    url: "/api/usermgmt",
    dataType: "json",
    data:
    {
      "tenancy_id": tenancy_id,
      "querytype": "userreport"
    }
 });
 req.done(buildTable);
 req.fail(checkError);
}

function buildTable(response)
{
  console.log(response);
  obj = JSON.parse(response);
  var rowdata;
  console.log(obj);
$('#listuserdata1').append(
    $.map(obj, function (item, index) {
      rowdata1 =   '<tr><td>' + obj[index].first_name;
      rowdata2 =   '</td><td>' + obj[index].last_name;
      rowdata3 =   '</td><td>' + obj[index].email_id;
      rowdata4 =   '</td><td>' + obj[index].role;
      rowdata5 =   '</td><td>' + obj[index].designation;
      rowdata6 =   '</td><td>' + obj[index].mobile_num;
      rowdata7 =   '</td><td>' + obj[index].user_uid + '</td></tr>';
      rowdata = rowdata1 + rowdata2 + rowdata3 + rowdata4 + rowdata5 + rowdata6 + rowdata7;
      return rowdata;
}));

function checkError(response) {
  var errordesc;
  var errorcode;

  if (response.responseJSON['description'])
  {
    errordesc = response.responseJSON['description'];
  }
  else
  {
    errordesc = "Unkown Error Occurred";
  }
  if (response.responseJSON['status_code'])
  {
    errorcode = response.responseJSON['status_code'];
  }
  else
  {
      errorcode = "Please try Again!";
  }

  alert("Login Failed :" + " " + errordesc + " - " + errorcode);
  deleteCookie();
  console.log(response);
}

function resetAdduser1Form()
{
$("#adduser1").reset();
}

}

/* ############ User Admin Table Management end here ########### */
