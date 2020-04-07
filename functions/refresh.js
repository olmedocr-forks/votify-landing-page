const btoa = require('btoa');
const axios = require('axios');
const qs = require('qs');

const clientId        = process.env.SPOTIFY_CLIENT_ID;
const clientSecret    = process.env.SPOTIFY_CLIENT_SECRET;
const clientCallback  = process.env.SPOTIFY_CALLBACK_URL;

const spotifyEndpoint = 'https://accounts.spotify.com/api/token';

exports.handler = (event, context, callback) => {
    const urlParams = new URLSearchParams(event.body)

    // CHECK: if at some point token refresh fails, check the way Spotify encodes the refresh_token, 
    // it might be included in the event instead of being encoded in the url as a query parameter,
    // use "refresh_token: event.body.refresh_token" in line 26
    const config = {
	    method: "POST",
	    url: spotifyEndpoint,
	    headers: {
	      "Content-Type": "application/x-www-form-urlencoded",
	      "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
	    },
	    data: {
	      grant_type: 'refresh_token',
	      refresh_token: urlParams.get('refresh_token')
	    }
    }
    
    config.data = qs.stringify(config.data)

    axios.request(config).then((response) => {
        callback(null, {
            statusCode: 200,
            body: response.data,
        });
    }).catch((error) => {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify(error)
        });
    });

};
