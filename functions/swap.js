const btoa = require('btoa');
const axios = require('axios');
const qs = require('qs');

const clientId        = '5bf0778b83024abba5ba4f2146eb7272';
const clientSecret    = '52cf3b723802409780e83055bd793395';
const clientCallback  = 'votify://spotify-login-callback';

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
