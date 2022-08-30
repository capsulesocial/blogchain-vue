const config = require('@capsulesocial/capsule-config').config;

config.content.push('./src/App.vue');
config.content.push('./src/pages/**');
config.content.push('./src/components/**');

module.exports = config;
