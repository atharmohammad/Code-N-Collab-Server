const axios = require("axios");

function getAuthUrl(){

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });

}

async function getGoogleUser(token){
  try{
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${token.id_token}`,
          },
        },
      );

      return googleUser.data;

  }catch(e){
    throw new Error("Problem getting user");
  }

}

module.exports = {
  getAuthUrl:getAuthUrl,
  getGoogleUser:getGoogleUser
}
