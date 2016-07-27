Template.healthcheck.helpers({
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
    }
});