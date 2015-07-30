

  function rtc_tools_chat(rtc_obj,chat_window){

    
    //might want to come up with our own 'default for handling channel id etc'
    var rtc_obj = typeof rtc_obj !== 'undefined' ?  rtc_obj : new RTCMultiConnection();


    if(typeof rtc_obj !== 'object'){
      return {
        error:"RTC_tools - Please pass valid RTCMultiConnection Object"
      }

    }
    if(chat_window == 'undefined'){
      return {
        error:"RTC_tools - Unable to find Chat Box"
      }
    }
    else{
      return {
        update_personal_chat:function(message_obj){
          chat_window.append(
            "<div class='row msg_container base_sent'>\
              <div class='col-md-10 col-xs-10'>\
                  <div class='messages msg_sent'>\
                      <p>" +
                       message_obj.message
                      + "</p>\
                      <time datetime='2009-11-13T20:00'>Timothy • 51 min</time>\
                  </div>\
              </div>\
              <div class='col-md-2 col-xs-2 avatar'>\
                  <img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class=' img-responsive '>\
              </div>\
            </div>"
          )},
        receive_message:function(message_obj){
          chat_window.append(
            "<div class='row msg_container base_receive'>\
              <div class='col-md-10 col-xs-10'>\
                  <div class='messages msg_receive'>\
                      <p>" +
                      message_obj.message.message
                      + "</p>\
                      <time datetime='2009-11-13T20:00'>Timothy • 51 min</time>\
                  </div>\
              </div>\
              <div class='col-md-2 col-xs-2 avatar'>\
                  <img src='http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg' class=' img-responsive '>\
              </div>\
            </div>"
          )},
        send_message:function(message_string){
          this.update_personal_chat(message_string)
          rtc_obj.sendCustomMessage({
              userOnline: true,
              userid: MODERATOR_ID,
              message:message_string
          });
        },
        open:function(string){ //new room
          rtc_obj.open(string)
        },
        join:function(string){ //join existing
          rtc_obj.join(string)
        }
      }
    }
  } 


  var MODERATOR_CHANNEL_ID = 'rtc_tools'// + window.RMCDefaultChannel;

  var MODERATOR_SESSION_ID = 'XYZ';    // room-id
  var MODERATOR_ID         = 'HOST';    // user-id
  var MODERATOR_SESSION    = {         // media-type
    audio: false,
    video: false,
    data:  true
  };

  var role;
  var connection =  new RTCMultiConnection(MODERATOR_CHANNEL_ID)
      connection.onopen = function(e) {
        console.log("User Joined:", e.userid, e.extra)
        new_member = $('#join-box #members .template').clone().
          prependTo($('#join-box #members')).removeClass('template').
          attr('user_id', e.user).
          find('#name').
            html(' ->['+e.userid+'] ' + e.extra.name);
      }
      connection.onconnected = function(e) {
        console.log("Connected to host:", e)
        e.peer.onCustomMessage = function(m) {
          console.log("Recieved Custom Msg", m)
          start_game( m.loc )
        }
      }



  var rtc_tools = new rtc_tools_chat(connection,$("#rtc_tools_chat"))
  console.log(rtc_tools)

  connection.onCustomMessage = rtc_tools.receive_message //BAD SEPARATION OF CONCERNS
  $('#open-room').click(function(e){
    rtc_tools.open("qqqqq")
    // setup()
  });


  $('#join-room').click(function(e){
    rtc_tools.join("qqqqq")
    // setup()
  });


  $('#btn-chat').click(function(e) {
    txt_box = $('#btn-input')
    console.log(txt_box)
    console.log("trying to send", txt_box.val())
    console.log(rtc_tools)
    rtc_tools.send_message({
        userOnline: true,
        userid: MODERATOR_ID,
        message:txt_box.val()
    });
    txt_box.val('')
  });







// function setup() {




//   $('#join-box #title').html('('+role+')')
//   if (role == 'moderator') $('body').addClass('host')

//   $('#join-box #start').click(function() {
//     loc = _.sample(locations)
//     spy_id = _.sample(_.keys(rtcmulti.peers))
//     console.log('LLL',loc,spy_id)
//     _.each(rtcmulti.peers, function(p, id) {
//       if (id == spy_id) {
//         if (p.userid) p.sendCustomMessage({loc: "You're the Spy!!"})
//         else start_game( "You're the Spy!!" )
//       } else {
//         if (p.userid) p.sendCustomMessage({loc: loc})
//         else start_game( loc )
//       }
//     })
//   })
// }








function start_game(e) {
  console.log('starting_game..', e)
  $('#game-box').html(e)
}

