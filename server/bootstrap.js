Meteor.startup(function() {
  Houston.add_collection(Meteor.users);
  Houston.add_collection(Houston._admins);

  process.env.MAIL_URL = 'smtp://postmaster%40sandboxa2fe94f745734744a0c72bb155d0f05a.mailgun.org:c898efff537a660081bdd08385beff4f@smtp.mailgun.org:587';

  Accounts.config({
    forbidClientAccountCreation: true
  });

  SyncedCron.start();
  Kadira.connect('64y4kmecnXbtEtDyB', 'f19c03c0-0bd7-4139-8fa0-8958fab4fcd9');
});
