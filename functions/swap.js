const btoa = require('btoa');
const axios = require('axios');
const qs = require('qs');

const clientId        = process.env.SPOTIFY_CLIENT_ID;
const clientSecret    = process.env.SPOTIFY_CLIENT_SECRET;
const clientCallback  = process.env.SPOTIFY_CALLBACK_URL;

const spotifyEndpoint = 'https://accounts.spotify.com/api/token';

exports.handler = (event, context, callback) => {
    const urlParams = new URLSearchParams(event.body)

    const config = {
	    method: "POST",
	    url: spotifyEndpoint,
	    headers: {
	      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
	    },
	    data: {
	      grant_type: 'authorization_code',
	      redirect_uri: clientCallback,
	      code: urlParams.get('code')
	    }
    }
    
    config.data = qs.stringify(config.data)

    axios.request(config).then((response) => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(response.data),
        });
    }).catch((error) => {
        callback(error);
    });
};
