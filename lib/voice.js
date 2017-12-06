/*!
 * qcloudsms_js
 */

"use strict";

/**
 * Module dependencies.
 * @ignore
 */

var url = require("url");
var util = require("./util");


/**
 * Module exports
 * @ignore
 */

exports.SmsVoicePromptSender = SmsVoicePromptSender;
exports.SmsVoiceVerifyCodeSender = SmsVoiceVerifyCodeSender;

/**
 * SmsVoicePromptSender
 *
 * @param  {string}  appid - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @constructor
 */
function SmsVoicePromptSender(appid, appkey) {
    this.appid = appid;
    this.appkey = appkey;
    this.url = "https://yun.tim.qq.com/v5/tlsvoicesvr/sendvoiceprompt";
}

/**
 * Send a voice prompt message
 *
 * @param  {string}    nactionCode - nation dialing code, e.g. China is 86, USA is 1
 * @param  {string}    phoneNumber - phone number
 * @param  {string}    prompttype - voice prompt type, currently value is 2
 * @param  {string}    msg - voice prompt message
 * @param  {number}    playtimes - playtimes, optional, max is 3, default is 2
 * @param  {string}    ext - ext field, content will be returned by server as it is
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
SmsVoicePromptSender.prototype.send = function(nationCode, phoneNumber, prompttype, msg, playtimes, ext, callback) {
    // assert
    util.assert(typeof playtimes == "number" && playtimes > 0,
                "playtimes must be an integer and great than zero");

    var reqUrl = url.parse(this.url);
    var random = util.getRandom();
    var now = util.getCurrentTime();
    var options = {
        host: reqUrl.host,
        path: reqUrl.path + "?sdkappid=" + this.appid + "&random=" + random,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            tel: {
                nationcode: nationCode,
                mobile: phoneNumber
            },
            prompttype: prompttype,
            promptfile: msg,
            playtimes: parseInt(playtimes),
            sig: util.calculateSignature(this.appkey, random, now, [phoneNumber]),
            time: now,
            ext: !ext ? "" : ext + ""
        }
    };

    util.request(options, callback);
};


/**
 * SmsVoiceVerifycodeSender
 *
 * @param  {string}  appid - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @constructor
 */
function SmsVoiceVerifyCodeSender(appid, appkey) {
    this.appid = appid;
    this.appkey = appkey;
    this.url = "https://yun.tim.qq.com/v5/tlsvoicesvr/sendvoice";
}

/**
 * Send a voice verify code message
 *
 * @param  {string}    nationCode - nation dialing code, e.g. China is 86, USA is 1
 * @param  {string}    phonenumber -  phone number
 * @param  {string}    msg - voice verify code message
 * @param  {number}    playtimes - playtimes, optional, max is 3, default is 2
 * @param  {string}    ext - ext field, content will be returned by server as it is
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
SmsVoiceVerifyCodeSender.prototype.send = function(nationCode, phoneNumber, msg, playtimes, ext, callback) {
    // assert
    util.assert(typeof playtimes == "number" && playtimes > 0,
                "playtimes must be an integer and great than zero");

    var reqUrl = url.parse(this.url);
    var random = util.getRandom();
    var now = util.getCurrentTime();
    var options = {
        host: reqUrl.host,
        path: reqUrl.path + "?sdkappid=" + this.appid + "&random=" + random,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            tel: {
                nationcode: nationCode,
                mobile: phoneNumber
            },
            msg: msg,
            playtimes: playtimes,
            sig: util.calculateSignature(this.appkey, random, now, [phoneNumber]),
            time: now,
            ext: !ext ? "" : ext + ""
        }
    };

    util.request(options, callback);
};
