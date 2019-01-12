$('document').ready(function() {

  var webAuth = new auth0.WebAuth({
    domain: 'livepoll.auth0.com',
    clientID: 'C6iRZ1M8uYyg3PPCc3vKmtgZZ8pDETXc',
    redirectUri: 'http://localhost/index.html', 
    audience: 'https://livepoll-rest.com/',
    responseType: 'token id_token',
    scope: 'openid email profile'
  });


var loginBtn = $('#loginbtn');

  loginBtn.click(function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

function setSession(authResult) {
    // Set the time that the Access Token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
     console.log(authResult);
     var token=authResult.accessToken;
     var idToken=authResult.idToken;
     var expires_at=expiresAt;
     var username= authResult.idTokenPayload.email;
     $.cookie('token', token);
     $.cookie('username',username);
     $.cookie('expires_at',expires_at);
     $.cookie('idToken',idToken);
  
//    localStorage.setItem('access_token', authResult.accessToken);
 //   localStorage.setItem('id_token', authResult.idToken);
 //   localStorage.setItem('expires_at', expiresAt);
 //   localStorage.setItem('username', authResult.idTokenPayload.email);
  }

function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
         window.location.hash = '';
         console.log("I am insie the prog1");  
         setSession(authResult);
        $("#loginshow").hide();
         $("#loginhide").show();
         cosnole.log(authResult.accessToken + ' ' + authResult.idToken + ' ' + authResult);
         alert(authResult.accessToken + ' ' + authResult.idToken + ' ' + authResult);
      } else if (err) {
         $("#loginshow").show();
         $("#loginhide").hide();
         console.log("I am insie the prog2");
        console.log(err);
      }
    });
  }

 handleAuthentication();


});
