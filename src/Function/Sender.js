function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return encodedMail;
}

async function sendMessage(to) {
    var raw = makeBody(to, 'me',
     'Subject', 'Body : Welcome to Email Sender , Thaks for Signing up');

    const gmail = google.gmail({version: 'v1', oAuth2Client});
    await gmail.users.messages.send({
        auth: oAuth2Client,
        userId: 'me',
        resource: {
            raw: raw
        }

    }, function(err, response) {
        console.log(err,response)
    });
}

module.exports = {sendMessage:sendMessage}
