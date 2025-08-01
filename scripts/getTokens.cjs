const {default: axios} = require("axios");

// Only a script to generate tokens.
async function getTokenTwitch() {
    const gettoken = await axios.post(`
      ${process.env.TWITCH_TOKEN_URL}`
    );

    let gentoken = gettoken.data.access_token;
    console.log(gentoken);
}

getTokenTwitch();
