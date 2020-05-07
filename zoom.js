const axios = require("axios");

let meetingUrl =
  "https://wmcc.zoom.us/closedcaption?id=99685121645&ns=U291cmFiaCBHYXJnJ3MgWm9vbSBNZWV0aW5n&expire=86400&sparams=id%2Cns%2Cexpire&signature=sITXauFh7CXK_gd51hRI3nPkHSW9wRkUoaJKnUUhpfw.EwEAAAFx5A7a1AABUYAYM2hwM1dJMlprM3BlWUs2R3UxcThCZz09OHhMbXExTlBRWEpUdGF4bkNxVTduM3MwSEZobkRxb1ZCWGFPZVFRd2pHNXRsYW9OK1lMR05Vdz09";
meetingUrl = meetingUrl + "&seq=";

let seq = 1;

const sendMessage = () => {
  axios
    .post(`${meetingUrl}${seq}`, "Im Message " + seq, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
    .then((response) => {
      console.log("seq", seq);
      console.log("success", response.data);
      seq++;
    })
    .catch((e) => {
      console.log("error", e);
    });
};

setInterval(sendMessage, 5000);
