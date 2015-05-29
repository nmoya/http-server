// Globals
var hideTimeout = 0;
var listOfConversations = [];
var listOfMessages = [];
var statsJSON = null;
var userName = null;
var userId = null;

var numberOfMessages = 1000;
var MsgAppLimited = "Due to heavy usage, our APP has been limited by Facebook. We will keep trying, please leave this window open.";


/* Facebook Login */
window.fbAsyncInit = function() {
  FB.init({
    appId: '1604163509840523',
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true, // parse social plugins on this page
    version: 'v2.3' // use version 2.2
  });
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

function statusChangeCallback(response) {
  if (response.status === 'connected') {
    main(); // Main is in init.js
  }
}

function fb_login() {
  FB.login(function(response) {
    if (response.status === 'connected') {
      main(); // Main is in init.js
    } else if (response.status === 'not_authorized') {
      document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    } else {
      document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
    }
  }, {
    scope: "public_profile,email,read_mailbox"
  });
};
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


/* UI Functions */
function changeScreen(screen) {
  if (screen == 1) {
    $(".step1 img").removeClass('shift-left', 500);
    $(".step1 h1").removeClass('shift-left', 500);
    $(".step1 a").removeClass('invisible', 500);
    $("nav").removeClass('shift-nav', 500);
  }
  if (screen == 2) {
    $(".step1 img").addClass('shift-left', 500);
    $(".step1 h1").addClass('shift-left', 500);
    $(".step1 a").addClass('invisible', 500);
    $("nav").addClass('shift-nav', 500);
    $(".progress").switchClass("visible", "invisible", 100);
  }
}

function showWarning(message) {
  $("#status span").html(message);
  $("#status").switchClass("invisible", "visible", 0);
}

function closeWarning() {
  $("#status span").html("");
  $("#status").switchClass("visible", "invisible", 500);
}

$(document).ready(function() {
  // document.getElementById("generateStats").addEventListener("click", handlerGenerateButton);
  // $(".step1").hide();
  // $(".step2").hide();
  // $(".step3").hide();
  // $(".step4").hide();
});


/* Give me some REST */
function sendDataTest() {
  userName = "Nikolas Moya";
  sendData(sampleJSON2.data);
}

function sendData(messages_data) {
  var json_object = {
    "data": messages_data,
    "name": userName
  }
  $.post("/whosintoyou/receivedata", json_object, function(data) {
    if (!data.error) {
      console.log(data);
      $(".step4").html(JSON.stringify(data));
    } else
      showWarning("Operation aborted, please reload the page. " + data.error);
  });
}

function getAllConversations(request_url, userName, callback) {
  FB.api(request_url, function(response) {
    if (response.error) {
      showWarning(MsgAppLimited);
      console.log(response.error.message);
      setTimeout(function() {
        getAllConversations(request_url, userName, callback)
      }, 60000);
    } else {
      closeWarning();
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].to.data.length == 2) {
          if (response.data[i].to.data[1].name != userName) {
            // console.log(response.data[i]);
            refreshHTML(response.data.length);
            listOfConversations.push(new Conversation(response.data[i].id, userName, response.data[i].to.data[1].name, response.data[i].to.data[1].id))
          }
        }
      }
      if (response.paging)
        getAllConversations(response.paging.next, userName, callback)
      else
        callback();
    }
  });
}

function getAllMessages(request_url, callback) {
  FB.api(request_url, function(response) {
    if (response.error) {
      console.log(response.error.message);
      showWarning(MsgAppLimited);
      setTimeout(function() {
        getAllMessages(request_url, callback)
      }, 60000);
    } else {
      closeWarning();
      if (!response.comments)
        callback();
      for (var i = 0; i < response.comments.data.length; i++) {
        listOfMessages.push(new Message(response.comments.data[i].id,
          response.comments.data[i].from.name,
          response.comments.data[i].message,
          response.comments.data[i].created_time));
      }
      if (response.comments.paging) {
        refreshHTML(response.comments.data.length);
        getAllMessagesPaging(response.comments.paging.next, callback, response.comments.data.length);
      }
    }
  });
}

function getAllMessagesPaging(request_url, callback, progress) {
  FB.api(request_url, function(response) {
    if (response.error) {
      console.log(response.error.message);
      showWarning(MsgAppLimited);
      setTimeout(function() {
        getAllMessagesPaging(request_url, callback, progress)
      }, 60000);
    } else {
      closeWarning();
      for (var i = 0; i < response.data.length; i++) {
        listOfMessages.push(new Message(response.data[i].id,
          response.data[i].from.name,
          response.data[i].message,
          response.data[i].created_time));
      }
      if (response.paging && progress < numberOfMessages) {
        progress += response.data.length
        refreshHTML(response.data.length);
        getAllMessagesPaging(response.paging.next, callback, progress);
      } else
        callback();
    }
  });
}

function refreshHTML(increment) {
  $(".progress").switchClass("invisible", "visible", 100);
  var progress = document.getElementById("progress");
  var counter = parseInt(progress.innerHTML);
  counter += increment;
  progress.innerHTML = counter;
}

function handlerGenerateButton() {
  $(".step2").hide(hideTimeout);
  $(".step3").show();
  var select = document.getElementById("conversations");
  var conversationId = select[select.selectedIndex].value;
  var to = select[select.selectedIndex].innerHTML;

  var counter = document.getElementById("progress");
  var table = document.getElementById("messagesTable");
  table.innerHTML = "";
  counter.innerHTML = 0;

  // 185506144849518
  console.log("Starting");
  getAllMessages("/" + conversationId, computeStatistics);
}

function computeStatistics() {
  $(".step3").hide(hideTimeout);
  $(".step4").show();
  console.log("callback called. computeStatistics");
  console.log("Number of messages: ");
  console.log(listOfMessages.length);
  sendData(listOfMessages);
  // generateTable();
}

function generateSelectOptions() {
  changeScreen(2);
  var ul = document.getElementById("conversations");
  for (var i = 0; i < listOfConversations.length; i++) {
    var li = document.createElement("li");
    li.conversationId = listOfConversations[i].id;
    li.toId = listOfConversations[i].toId;
    li.innerHTML = listOfConversations[i].to;
    li.onclick = (function() {
      var currentLi = li;
      return function() {
        test(currentLi);
      }
    })();
    ul.appendChild(li);
  }
}

function test(element) {
  console.log(element.conversationId);
  console.log(element.toId);
  console.log(element.innerHTML);
}

function generateTable() {
    var table = document.getElementById("messagesTable");
    for (var i = 0; i < listOfMessages.length; i++) {
      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = listOfMessages[i].from;
      cell2.innerHTML = listOfMessages[i].message;
      cell3.innerHTML = listOfMessages[i].datetime;
    }
  }
  //  http://graph.facebook.com/nikolas.moya/picture?type=large
function main() {
  FB.api('/me', function(response) {
    userId = response.id;
    userName = response.name;
    console.log(userId, userName);
    // alert("uncomment me");
    getAllConversations("/" + userId + '/inbox', userName, generateSelectOptions);
  });
}