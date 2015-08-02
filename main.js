

var MODERATOR_CHANNEL_ID = 'rtc_tools'// + window.RMCDefaultChannel;

var MODERATOR_SESSION_ID = 'XYZ';    // room-id
var MODERATOR_ID         = 'HOST';    // user-id
var MODERATOR_SESSION    = {         // media-type
  audio: false,
  video: false,
  data:  true
};
var connection =  new RTCMultiConnection(MODERATOR_CHANNEL_ID)


var rtc_tools = new RTC_Tools(connection,$(".chat_box_dock"),$(".chat_box_content_list")) //todo: more specfici needed - currently css class... not id or whatever

  rtc_tools.onopen(function(e){
    console.log("User Joined:", e.userid, e.extra)
    // new_member = $('#join-box #members .template').clone().
    // prependTo($('#join-box #members')).removeClass('template').
    // attr('user_id', e.user).
    // find('#name').

  });
  rtc_tools.onconnected(function(e){
    console.log("Connected to host:", e)
    e.peer.onCustomMessage = function(m) {
      console.log("Recieved Custom Msg", m)
    }
  });





rtc_tools.newChatBox()



  function RTC_Tools(rtc_obj,chat_box_dock,chat_window){

    
    //todo: might want to come up with our own 'default for handling channel id etc'
    var rtc_obj = typeof rtc_obj !== 'undefined' ?  rtc_obj : new RTCMultiConnection();


    if(typeof rtc_obj !== 'object'){
      console.error({
        error:"RTC_tools - Please pass valid RTCMultiConnection Object"
      })

    }
    if(chat_window == 'undefined'){
      console.error({
        error:"RTC_tools - Unable to find Chat Box"
      })
    }
    else{
      return {
        onconnected:function(fxn){

          rtc_obj.onconnected = fxn
        },

        onopen:function(fxn){

          rtc_obj.onopen = fxn

        },
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
                + message_obj.message.message + // <<---The message goes here

            "</p>\
          </li>"
          )
          $('.chat_box_content')[0].scrollTop = $('.chat_box_content')[0].scrollHeight;
        
        },
        close_chat:function(elem){

          chat_box_dock.remove(elem);

        },

        newChatBox:function(message_obj){ //gotta pass this something
          var chat_box_close="<i class='fa fa-times fa-3'></i>"
          

          var chat_box_template=
          "<li class='chat_box'>\
            <div class='chat_box_title'>\
              <a class='chat_box_icon'>\
                <i class='fa fa-weixin fa-3'></i>\
              </a>\
              <a class='chat_box_username'>\
                willdembinsk...  \
              </a>\
              <a class='chat_box_max'>\
                <i class='fa fa-chevron-up fa-3'>\
                </i>\
              </a>\
              <a class='chat_box_minimize'>\
                <i class='fa fa-chevron-down fa-3'>\
                </i>\
              </a>\
              <a class='chat_box_close'>"
              + chat_box_close +
              "</a>\
              </div>\
            <div class='chat_box_content'>\
              <ul class='chat_box_content_list'>\
              </ul>\
            </div>\
            <div class='chat_box_form'>\
                <textarea name='message_box' class='message_box'></textarea>\
            </div>\
          </li>"

          new_chat_box = $(chat_box_template)

          $('fa-times').click(function(e){
            console.log("asdasdasdasdasd")
            this.closest('li').remove();   //THIS WORKS BUT YOU NEED TO GET IT WORKING ON THE Xicon
          });


          chat_box_dock.append(new_chat_box);




        },



        send_message:function(message){

          console.log(message)
          if(message.message==''){
            return
          }

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
                      + message.message + // <<---The message goes here
               "</p>\
            </li>"
          );
          $('.chat_box_content')[0].scrollTop = $('.chat_box_content')[0].scrollHeight

          //todo:make this chat selection more specific
          //todo: refactor so we can just pass a chat_box element and user its scroll top and just .append() for when messages arrive or send


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



  connection.onCustomMessage = rtc_tools.receive_message //BAD SEPARATION OF CONCERNS
  $('#open-room').click(function(e){
    rtc_tools.open("qqqqq")
    // setup()
  });
  $('#open-room').click(function(e){
    rtc_tools.open("qqqqq")
    // setup()
  });


  // $('.chat_box_close').click(function(e){
  //   cl($(this))
  //   rtc_tools.close_chat($(this));
  // });


  $('.message_box').keydown(function(e) { //can use for 'is typing..'
    var txt_box = $(this);
    var txt_box_val = txt_box.val()
    txt_box.height(this.scrollHeight > txt_box.height() ? this.scrollHeight : txt_box.height()); 
    if(e.shiftKey && e.which == 13) {
      cl("No message - NEW LINE")
      return
    }
    if(!e.shiftKey && e.which == 13 && txt_box_val.length == 0 ) {
      cl("No message")
      e.preventDefault();
      txt_box.height('2.0em');
      return
    }
    cl("Filter reached :",filter)
    var filter = txt_box_val.replace(/(\r\n|\n|\r)/gm,"").length //prevents user from sending new line chars alone
    if(e.which == 13 && !e.shiftKey && txt_box_val.length > 0 ) {
      if(!filter){
        e.preventDefault();
        txt_box.val('');
        txt_box.height('2.0em');
        cl("Only return chars - clearing. No message sent.")
        return
      }
      e.preventDefault();
      cl("Send message", txt_box_val)
      rtc_tools.send_message({
          userOnline: true,
          userid: MODERATOR_ID,
          message: txt_box_val
      });
      txt_box.height('2.0em')
      txt_box.val('');
    }
  });



$('.chat_box_minimize').click(function(e){ //todo: make only one toggle call - use parent container.
  // console.log(e)
  $('.chat_box_content').toggleClass('collapsed')
  $('.chat_box_form').toggleClass('collapsed')


})





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

