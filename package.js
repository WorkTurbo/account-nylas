Package.describe({
    name: 'workturbo:nylas',
    version: '0.0.1',
    summary: 'Login using nylas'
})

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('oauth2', ['client', 'server']);
    api.use('oauth', ['client', 'server']);
    api.use('http', ['server']);
    api.use('accounts-base', ['client', 'server']);
    // Export Accounts (etc) to packages using this one.
    api.imply('accounts-base', ['client', 'server']);
    api.use('accounts-oauth', ['client', 'server']);
    api.use(['underscore', 'service-configuration'], ['client', 'server']);
    api.use(['random', 'templating'], 'client');

    api.addFiles('account_nylas.js')
    api.addFiles('nylas_server.js', 'server')
    api.addFiles(['nylas_client.js', 'nylas_login.css'], 'client')
    api.export('Nylas')
})

