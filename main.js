    //Todo: Setup way of handling chat window that either has separate rtc objects for them or some delegation system that puts messages in right chat box
    // Also youre leaving everythig in a state of seriouly fucked up
    // Theres scope issues - referenceing things in wierd loopy ways - You need to figure out how you wnt people to use thing.
    var MODERATOR_CHANNEL_ID = 'rtc_tools' // + window.RMCDefaultChannel;
    var MODERATOR_NAME = 'Will Dembinski' // + window.RMCDefaultChannel;
    var MODERATOR_SESSION_ID = 'XYZ'; // room-id
    var MODERATOR_ID = 'HOST'; // user-id
    var MODERATOR_SESSION = { // media-type
      audio: false,
      video: false,
      data: true
    };
    var connection = new RTCMultiConnection(MODERATOR_CHANNEL_ID)
    RTC_Tools.prototype = new RTCMultiConnection();
    var rtc_tools = new RTC_Tools(connection, $(".chat_box_dock"), $(".chat_box_content_list")) //todo: more specfici needed - currently css class... not id or whatever
    rtc_tools.onCustomMessage = function(message) {
      console.log(message)
    }
    rtc_tools.onopen(function(e) {
      console.log("User Joined:", e.userid, e.extra)
        // new_member = $('#join-box #members .template').clone().
        // prependTo($('#join-box #members')).removeClass('template').
        // attr('user_id', e.user).
        // find('#name').
    });
    rtc_tools.onconnected(function(e) {
      console.log("Connected to host:", e)
      e.peer.onCustomMessage = function(m) {
        console.log("Recieved Custom Msg", m)
      }
    });
    var sample_message_obj = {
      userName: "Will Dembinski",
      userOnline: true,
      userid: "1909992-this_is_test_id",
      message: "SAMPLE INITIAL MESSAGE"
    }
    var qqqqq = new rtc_tools.ChatBox(sample_message_obj)
    // rtc_tools.onCustomMessage = console.log("weeeeee")
    RTC_Tools.prototype = Object.create(RTCMultiConnection.prototype)

    function RTC_Tools(rtc_obj, chat_box_dock, chat_window) {

      //todo: might want to come up with our own 'default for handling channel id etc'
      var rtc_obj = typeof rtc_obj !== 'undefined' ? rtc_obj : new RTCMultiConnection();
      if (typeof rtc_obj !== 'object') { //why did i do this.
        console.error({
          error: "RTC_tools - Please pass valid RTCMultiConnection Object"
        })
      }
      if (chat_window == 'undefined') {
        console.error({
          error: "RTC_tools - Unable to find Chat Box"
        })
      } else {
        this.alert = function(message_obj) {
            chat_window.append(
              // alert div
            )
          },
          this.ChatBox = function(message_obj) { //pass the incoming message obj
            this.chat_box_template =
              $("<li class='chat_box'>\
                <div class='chat_box_title'>\
                </div>\
                <div class='chat_box_content'>\
                  <hr>\
                  <ul class='chat_box_content_list'>\
                  </ul>\
                </div>\
                <div class='chat_box_form'>\
                    <textarea name='message_box' class='message_box'></textarea>\
                </div>\
              </li>")
            this.chat_box_template.attr("id", "chat_box_" + message_obj.userid)
            this.chat_box_content = this.chat_box_template.children(".chat_box_content")
            this.title_bar = this.chat_box_template.children(".chat_box_title").click(
              function(e) {
                $(this).siblings().toggleClass("collapsed");
              });
            $("<a class='fa fa-times fa-3 chat_box_close'></a>").click(
              function(e) {
                $("#chat_box_" + message_obj.userid).remove();
              }).appendTo(this.title_bar);
            this.username_and_icon = $(
              "<a class='fa fa-weixin fa-3 chat_box_icon'></a>"
            ).text(message_obj.userName)
            this.username_and_icon.appendTo(this.title_bar);
            chat_box_scope = this;
            this.chat_box_template.find("textarea").keydown(function(e) { //can use for 'is typing..'
              cl(this)
              $this = $(this)
              var txt_box_val = $this.val();
              $this.height(this.scrollHeight > $this.height() ? this.scrollHeight : $this.height());
              if (e.shiftKey && e.which == 13) {
                cl("No message - NEW LINE")
                return
              }
              if (!e.shiftKey && e.which == 13 && txt_box_val.length == 0) {
                cl("No message")
                e.preventDefault();
                $this.height('2.0em');
                return
              }
              var filter = txt_box_val.replace(/(\r\n|\n|\r)/gm, "").length //prevents user from sending new line chars alone
              cl("Filter reached :", filter)
              if (e.which == 13 && !e.shiftKey && txt_box_val.length > 0) {
                if (!filter) {
                  e.preventDefault();
                  $this.val('');
                  $this.height('2.0em');
                  cl("Only return chars - clearing. No message sent.")
                  return
                }
                cl("Send message", txt_box_val)
                chat_box_scope.send_message({
                  username: MODERATOR_NAME,
                  userOnline: true,
                  userid: MODERATOR_ID,
                  message: txt_box_val
                });
                $this.height('2.0em')
                $this.val('');
                e.preventDefault();
              }
            });
            this.chat_list = this.chat_box_template.find(".chat_box_content_list")
            chat_box_dock.append(this.chat_box_template);
            this.send_message = function(message_obj) {
              if (message_obj.message == '') {
                return
              }
              this.chat_list.append(
                "<li class='chat_box_entry chat_box_sent_message'>\
                  <hr>\
                  <p class='message_timestamp'>\
                    June 23rd, 2:26pm\
                  </p>\
                  <a href='' class='chat_box_user_icon'>\
                    <i class='fa fa-user fa-3'></i>\
                  </a>\
                  <p class='chat_box_message'>" + message_obj.message + // <<---The message goes here
                "</p>\
                </li>"
              );
              this.chat_box_content[0].scrollTop = this.chat_box_content[0].scrollHeight
              rtc_obj.sendCustomMessage(message_obj);
            }
            this.receive_message = function(message_obj) {
              cl(message_obj)
              this.chat_list.append(
            "<li class='chat_box_entry chat_box_received_message'>\
              <hr>\
              <p class='message_timestamp'>\
                June 23rd, 2:26pm\
              </p>\
              <a href='' class='chat_box_user_icon'>\
                <i class='fa fa-user fa-3'></i>\
              </a>\
              <p class='chat_box_message'>"
                + message_obj.message + // <<---The message goes here
              "</p>\
            </li>"
              )
              this.chat_box_content[0].scrollTop = this.chat_box_content[0].scrollHeight
            }
          }
      }
    }
    $('#open-room').click(function(e) {
      console.log(rtc_tools)
      connection.open("qqqqq")
        // setup()
    });
