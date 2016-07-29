Template.healthcheck.helpers({
    generalInfo: function() {
        var environment;
        if (Meteor.isDevelopment) {
            environment = "Development"
        } else if (Meteor.isProduction) {
            environment = "Production"
        } else if (Meteor.isTest) {
            environment = "Test"
        }
        return {
            title: "General information",
            absoluteUrl: Meteor.absoluteUrl(),
            environment: environment,
            serverTime: new Date(TimeSync.serverTime())
        }
    },
    serverConnection: function(){
        var status = Meteor.status();

        if (status.status == 'connected') {
            return {
                title: 'Server connection',
                bg: 'bg-success',
                status: 'Connected',
                description: 'The connection between the client and the Meteor server is stable.'
            }
        } else if (status.status == 'connecting' || status.status == 'waiting') {
            return {
                title: 'Server connection',
                bg: 'bg-warning',
                status: 'Connecting/Waiting',
                description: 'Disconnected and trying to open a new connection or failed to connect and waiting to try to reconnect'
            }
        } else if (status.status == 'failed') {
            return {
                title: 'Server connection',
                bg: 'bg-danger',
                status: 'Failed',
                description: 'Permanently failed to connect; e.g., the client and server support different versions of DDP'
            }
        } else if (status.status == 'offline') {
            return {
                title: 'Server connection',
                bg: 'bg-danger',
                status: 'Offline',
                description: 'User has disconnected the connection'
            }
        }
    },
    analytics: function(){
        var settings = Meteor.settings.public;

        if (settings.analyticsSettings && settings.analyticsSettings['Google Analytics'].trackingId == "UA-80980189-1") {
            return {
                title: 'Analytics',
                bg: 'bg-success',
                status: 'Tracking',
                description: 'Google Analytics is active and tracking activity on the platform. Tracking is using the <b>development</b> tracking code.'
            }
        } else if (settings.analyticsSettings && settings.analyticsSettings['Google Analytics'].trackingId == "UA-51184647-6") {
            return {
                title: 'Analytics',
                bg: 'bg-success',
                status: 'Tracking',
                description: 'Google Analytics is active and tracking activity on the platform. Tracking is using the <b>production</b> tracking code.'
            }
        } else {
            return {
                title: 'Analytics',
                bg: 'bg-warning',
                status: 'Not Tracking',
                description: 'Google Analytics doesn\'t seem to be active. No activity is being tracked.'
            }
        }
    },
    databaseConnection: function() {
        var status = Meteor.users.find({}).fetch();

        if (status) {
            return {
                title: 'Database connection',
                bg: 'bg-success',
                status: 'Connected',
                description: 'The database is connected.'
            }
        } else {
            return {
                title: 'Database connection',
                bg: 'bg-danger',
                status: 'Offline',
                description: 'The database is not connected'
            }
        }
    }
});