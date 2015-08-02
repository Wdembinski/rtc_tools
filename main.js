

  function RTC_Tools(rtc_obj,chat_window){

    
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
        alert:function(message_obj){
          chat_window.append(
            // alert div
          )},
        receive_message:function(message_obj){
          cl(message_obj)
          chat_window.append(


          "<li class='chat_box_entry chat_box_received_message'>\
            <hr>\
            <p class='message_timestamp'>\
              June 23rd, 2:26pm\
            </p>\
            <a href='' class='chat_box_user_icon'>\
              <i class='fa fa-user fa-3'></i>\
            </a>\
            <p class='chat_box_message'>"
                + message_obj.message.message + // <<-------------------The message goes here

            "</p>\
          </li>"
            
          )},
        send_message:function(message){
          console.log(message)
          chat_window.append(


            "<li class='chat_box_entry chat_box_sent_message'>\
              <hr>\
              <p class='message_timestamp'>\
                June 23rd, 2:26pm\
              </p>\
              <a href='' class='chat_box_user_icon'>\
                <i class='fa fa-user fa-3'></i>\
              </a>\
              <p class='chat_box_message'>" 
                      + message.message + // <<-------------------The message goes here
               "</p>\
            </li>"
          );
          rtc_obj.sendCustomMessage({
              userOnline: true,
              userid: MODERATOR_ID,
              message:message
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



  var rtc_tools = new RTC_Tools(connection,$(".chat_box_content_list")) //css class... not id or whatever
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


  $('.message_box').keypress(function(e) {
    txt_box = $('.message_box')
    console.log(txt_box)
    console.log("trying to send", txt_box.val())
    console.log(rtc_tools)

    if(e.which == 13) {
      rtc_tools.send_message({

          userOnline: true,
          userid: MODERATOR_ID,
          message: txt_box.val() 

      });
      txt_box.val('')
    }





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

