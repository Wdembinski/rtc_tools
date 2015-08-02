

var firebaseURI = rtcmulti.resources.firebaseio + 'sessionid/' + rtcmulti.sessionid;
var firebase = new window.Firebase(firebaseURI);

btnOpenSmallRoom.onclick = function() {
    var smallRoomId = 'something';
    rtcmulti.sessionid = smallRoomId;
    rtcmulti.open();

    // storing small room over firebase servers
    firebase.set(smallRoomId);
};

firebase.once('value', function(data) {
    var isSmallRoomPresent = data.val() != null;
    if (!isSmallRoomPresent) {
        btnOpenSmallRoom.disabled = false;
        btnOpenSmallRoom.onclick();
    } else {
        var smallRoomid = data.val();
        rtcmulti.join(smallRoomid);
    }
});