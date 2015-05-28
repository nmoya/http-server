/* Facebook stuff */
window.fbAsyncInit = function () {
  FB.init({
    appId: '1604163509840523',
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true, // parse social plugins on this page
    version: 'v2.3' // use version 2.2
  });

  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });

};

// Load the SDK asynchronously
(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
}

function statusChangeCallback(response) {
  if (response.status === 'connected') {
    main(); // Main is in init.js
  } else if (response.status === 'not_authorized') {
    document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
  } else {
    document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
  }
}

var hideTimeout = 500;
var listOfConversations = [];
var listOfMessages = [];
var user_name = null;
$(document).ready(function () {
  $("#typed").typed({
    strings: ["........"],
    typeSpeed: 0,
    loop: true,
    typeSpeed: 150,
    startDelay: 0,
    backSpeed: 0,
    backDelay: 500,
    showCursor: false,
  });
  document.getElementById("generateStats").addEventListener("click", handlerGenerateButton);
  // $(".step1").hide();
  $(".step2").hide();
  $(".step3").hide();
  $(".step4").hide();
});

function sendDataTest() {
  sendData(sampleJSON2);
}

function sendData(messages_data) {
  $.post("/whosintoyou/sendata", messages_data, function (data) {
    if (!data.error) {
      console.log(data);
      $(".step4").html(JSON.stringify(data));
    } else
      alert("An error has occurred, please reload the page: " + data.error);
  });
}

function getAllConversations(request_url, user_name, callback) {
  FB.api(request_url, function (response) {
    // console.log(response);
    if (response.error) {
      $("#status").html("Due to heavy usage, our API has been limited by Facebook. We will keep trying, please leave this window open.");
      console.log(response.error.message);
      console.log("Waiting 60 seconds");
      setTimeout(function () {
        console.log("Trying again");
        getAllConversations(request_url, user_name, callback)
      }, 60000);
    } else {
      $("#status").html("");
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].to.data.length == 2) {
          if (response.data[i].to.data[1].name != user_name) {
            // console.log(response.data[i]);
            listOfConversations.push(new Conversation(response.data[i].id, user_name, response.data[i].to.data[1].name))
          }
        }
      }
      if (response.paging)
        getAllConversations(response.paging.next, user_name, callback)
      else
        callback();
    }
  });
}

function getAllMessages(request_url, callback) {
  FB.api(request_url, function (response) {
    if (response.error) {
      console.log(response.error.message);
      $("#status").html("Due to heavy usage, our API has been limited by Facebook. We will keep trying, please leave this window open.");
      console.log("Waiting 60 seconds to continue getting all messages");
      setTimeout(function () {
        getAllMessages(request_url, callback)
      }, 60000);
    } else {
      $("#status").html("");
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
  FB.api(request_url, function (response) {
    if (response.error) {
      console.log(response.error.message);
      $("#status").html("Due to heavy usage, our API has been limited by Facebook. We will keep trying, please leave this window open.");
      console.log("Waiting 60 seconds to continue getting all messages");
      setTimeout(function () {
        getAllMessagesPaging(request_url, callback, progress)
      }, 60000);
    } else {
      $("#status").html("");
      // console.log(response);
      for (var i = 0; i < response.data.length; i++) {
        listOfMessages.push(new Message(response.data[i].id,
          response.data[i].from.name,
          response.data[i].message,
          response.data[i].created_time));
      }
      if (response.paging && progress < 1000) {
        progress += response.data.length
        refreshHTML(response.data.length);
        getAllMessagesPaging(response.paging.next, callback, progress);
      } else
        callback();
    }
  });
}

function refreshHTML(increment) {
  var counter = document.getElementById("progress").innerHTML;
  counter = parseInt(counter);
  counter += increment;
  document.getElementById("progress").innerHTML = counter;
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
  sendData({
    "data": listOfMessages
  });
  // generateTable();
}

function generateSelectOptions() {
  var select = document.getElementById("conversations");
  for (var i = 0; i < listOfConversations.length; i++) {
    var option = document.createElement("option");
    option.value = listOfConversations[i].id;
    option.innerHTML = listOfConversations[i].to;
    select.appendChild(option);
  }
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

function main() {
  var user_id = null;
  $(".step1").hide(hideTimeout);
  $(".step2").show();
  FB.api('/me', function (response) {
    user_id = response.id;
    user_name = response.name;
    console.log(user_id, user_name);
    // alert("uncomment me");
    getAllConversations("/" + user_id + '/inbox', user_name, generateSelectOptions);
  });
}