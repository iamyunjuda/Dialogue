/*const apn = require('apn');

// Developer mode
var dev_options = {
    gateway : "gateway.sandbox.push.apple.com",
    cert: './ios-certificates/development/swift_apns_development_cert.pem',
    key: './ios-certificates/development/swift_apns_development_server.pem',
    production: true
};

// Production(App store)
var pro_options = {
    gateway : "gateway.push.apple.com",
    cert: './ios-certificates/development/swift_apns_production_cert.pem',
    key: './ios-certificates/development/swift_apns_production_server.pem',
    production: false
};

/*


var apnConnection = new apn.Connection(dev_options);

// Notification setting
var note = new apn.Notification();
note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
note.badge = 1;
note.sound = "ping.aiff";
note.alert = "프로젝트에서 Push 메시지 수신!";
*/
/*
// Devices Array
var tokenArr =
    [
        '수집된 디바이스 토큰값',
    ];
var deviceArr = [];

for(var i=0;i<tokenArr.length;i++){
    var token = tokenArr[i];
    var myDevice = new apn.Device(token);
    deviceArr.push(myDevice);
}

apnConnection.pushNotification(note, deviceArr);


*/