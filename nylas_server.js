'use strict';

Nylas = {};

OAuth.registerService('Nylas', 2, null, function(query) {

  var respData = getAccessToken(query);
  var namespace = getIdentity(respData.account_id, respData.access_token);

  return {
    serviceData: {
      id: respData.account_id,
      accessToken: OAuth.sealSecret(respData.access_token),
      email: respData.email_address,
      provider: respData.provider,
      organization_unit: namespace.organization_unit,
      name: namespace.name
    },
    options: {profile: {email: respData.email_address, name: namespace.name}}
  };
});

// http://developer.github.com/v3/#user-agent-required
var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getIdentity = function (namespace, accessToken) {
  try {
    return HTTP.get(
      "https://api.nylas.com/account", {
        headers: {
          "User-Agent": userAgent
        }, // http://developer.github.com/v3/#user-agent-required
        auth:accessToken+":"
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Nylas. " + err.message),
                   {response: err.response});
  }
};

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'Nylas'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    response = HTTP.post(
      "https://api.nylas.com/oauth/token", {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent
        },
        params: {
          code: query.code,
          grant_type:'authorization_code',
          client_id: config.clientId,
          client_secret: OAuth.openSecret(config.secret)
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Nylas. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Nylas. " + response.data.reason);
  } else {
    return response.data;
  }
};

Nylas.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
