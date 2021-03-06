// Globals
var hideTimeout = 0;
var listOfConversations = [];
var listOfMessages = [];
var statsJSON = null;
var userName = null;
var userId = null;
var toName = null;
var toId = null;
var progressCounter = 0;

var numberOfMessages = 1500;
var numberOfContacts = 999;
var minNumberOfMessages = 2;
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

function fb_logout() {
  FB.logout(function(response) {
    changeScreen(1);
  });
}

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


/* UI Functions */
function changeScreen(screen, intoYou) {
  if (screen == 1) {
    $(".step1 img").removeClass('shift-left', 500);
    $(".step1 h1").removeClass('shift-left', 500);
    $(".step1 a").removeClass('invisible', 500);
    $("#fb-logout").switchClass("visible", "invisible", 100);
    $("nav").removeClass('shift-nav', 500);
    $("#fb-like").removeClass("shift-left", 500);
    progressCounter = 0;
  }
  if (screen == 2) {
    $(".result").hide();
    $(".step1").show();
    $(".step1 img").addClass('shift-left', 500);
    $(".step1 h1").addClass('shift-left', 500);
    $("#fb-like").addClass('shift-left', 500);
    $("#fb-login").addClass('invisible', 500);
    $("nav").addClass('shift-nav', 500);
    $(".my-progress").switchClass("visible", "invisible", 100);
    $("#fb-logout").switchClass("invisible", "visible", 100);
    $(".step1 h1").addClass('visible', 0);
    $("nav").addClass('visible', 0);
    progressCounter = 0;
  }
  if (screen == 3) {
    progressCounter = 0;
    $(".my-progress").switchClass("visible", "invisible", 100);
    $(".step1").hide();
    $(".result").show();
    $(".contact-img").attr("src", "http://graph.facebook.com/" + toId + "/picture?type=large");
    $(".contact-img").attr("height", "200");
    $("#toName").html(toName);
    if (intoYou == true) {
      $("#toYou").html(" is definitely into you!");
      $(".contact-img").switchClass("red-glow", "green-glow");
    } else {
      $("#toYou").html(" is not into you!");
      $(".contact-img").switchClass("green-glow", "red-glow");
    }
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
  // $(".step1").hide();
  $(".result").hide();

  // toId = "andrew.slesaczek";
  // toName = "Andrew Slesaczek";
  // changeScreen(3, false);
  // createCharts(statsObject, "Nikolas Moya", toName);
});


/* Give me some REST */
function getAllConversations(request_url, userName, progress, callback) {
  FB.api(request_url, function(response) {
    if (response.error) {
      showWarning(MsgAppLimited);
      console.log(response.error.message);
      setTimeout(function() {
        getAllConversations(request_url, userName, progress, callback)
      }, 60000);
    } else {
      closeWarning();
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].to.data.length == 2) {
          for (var j = 0; j < response.data[i].to.data.length; j++) {
            if (response.data[i].to.data[j].name != userName) {
              listOfConversations.push(new Conversation(response.data[i].id, userName, response.data[i].to.data[j].name, response.data[i].to.data[j].id))
              break;
            }
          }
        }
      }
      if (response.paging && progress < numberOfContacts) {
        refreshHTML(response.data.length, true);
        getAllConversations(response.paging.next, userName, progress, callback)
      } else
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
        if (response.comments.data.length > minNumberOfMessages)
          callback(true);
        else
          callback(false);
      for (var i = 0; i < response.comments.data.length; i++) {
        listOfMessages.push(new Message(response.comments.data[i].id,
          response.comments.data[i].from.name,
          response.comments.data[i].message,
          response.comments.data[i].created_time));
      }
      if (response.comments.paging) {
        refreshHTML(response.comments.data.length, false);
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
        refreshHTML(response.data.length, false);
        getAllMessagesPaging(response.paging.next, callback, progress);
      } else
      if (progress > minNumberOfMessages)
        callback(true);
      else
        callback(false);
    }
  });
}

function computeStatistics(enough_messages) {
  if (enough_messages) {
    console.log("Number of messages: ");
    console.log(listOfMessages.length);
    var json_object = {
      "data": listOfMessages,
      "name": userName
    }
    $.post("/whosintoyou/receivedata", json_object, function(data) {
      if (data.error) {
        showWarning("Operation aborted, please reload the page and restart. " + data.error);
      } else {
        JSONData = JSON.parse(data.stats);
        intoYou = JSONData.outcome;
        if (intoYou) {
          changeScreen(3, true);
          createCharts(JSONData, userName, toName);
        } else {
          changeScreen(3, false);
          createCharts(JSONData, userName, toName);
        }
        // changeScreen(3, false, function () {
        //   console.log("Screen appeared");
        //   createCharts(JSONData, userName, toName);
        // });
        statsJSON = data;
      }
    });
  } else {
    showWarning("You do not have enough messages with this contact. Please chose another.");
  }
}

function refreshHTML(increment, conversations) {
  $(".my-progress").switchClass("invisible", "visible", 100);
  var progress = document.getElementById("progress");
  progressCounter += increment;
  if (conversations) {
    progress.innerHTML = "Fetched " + progressCounter + " contacts so far";
  } else {
    progress.innerHTML = "Fetched " + progressCounter + " messages";
  }
}

function handlerContactStatistics(element) {
  document.getElementById("progress").innerHTML = 0;
  var conversationId = element.conversationId;
  toName = element.innerHTML;
  toId = element.toId;
  // console.log(element.toId);
  // console.log(element.innerHTML);
  console.log("Starting");
  listOfMessages = []
  getAllMessages("/" + conversationId, computeStatistics);
}

function populateConversations() {
  changeScreen(2);
  var ul = document.getElementById("conversations");
  ul.innerHTML = "";
  for (var i = 0; i < listOfConversations.length; i++) {
    var li = document.createElement("li");
    li.conversationId = listOfConversations[i].id;
    li.toId = listOfConversations[i].toId;
    li.innerHTML = listOfConversations[i].to;
    li.onclick = (function() {
      var currentLi = li;
      return function() {
        handlerContactStatistics(currentLi);
      }
    })();
    ul.appendChild(li);
  }
}

function main() {
  //  http://graph.facebook.com/nikolas.moya/picture?type=large
  FB.api('/me', function(response) {
    userId = response.id;
    userName = response.name;
    // console.log(userId, userName);
    $("#fb-login").addClass('invisible', 100);
    listOfConversations = [];
    getAllConversations("/" + userId + '/inbox', userName, 0, populateConversations);
  });
}



// function generateTable() {
//     var table = document.getElementById("messagesTable");
//     for (var i = 0; i < listOfMessages.length; i++) {
//       var row = table.insertRow(-1);
//       var cell1 = row.insertCell(0);
//       var cell2 = row.insertCell(1);
//       var cell3 = row.insertCell(2);
//       cell1.innerHTML = listOfMessages[i].from;
//       cell2.innerHTML = listOfMessages[i].message;
//       cell3.innerHTML = listOfMessages[i].datetime;
//     }
//   }