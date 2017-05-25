'use strict';

require('./_profile-message.scss');

module.exports = {
  template: require('./profile-message.html'),
  controller: ['$log', '$mdDialog', '$mdToast', 'messageService', 'msgRecipient', ProfileMessageController],
  controllerAs: 'profileMessageCtrl'
};

function ProfileMessageController($log, $mdDialog, $mdToast, messageService, msgRecipient) {
  $log.debug('ProfileMessageController');

  this.targetProfile = msgRecipient;
  this.message = {};
  this.isLoading = false;

  this.sendMessage = function() {
    $log.debug('profileMessageCtrl.sendMessage');

    this.isLoading = true;
    this.message.toProfileID = this.targetProfile._id;

    messageService.createMessage(this.message)
    .then( () => {
      $mdToast.showSimple(`Message to ${this.targetProfile.displayName} sent successfully`)
      .then( () => {
        this.isLoading = false;
        this.message = {};
        $mdDialog.hide();
      });
    })
    .catch( err => {
      $mdToast.showSimple(err.data);
      this.isLoading = false;
    });
  };

  this.closeDialog = function() {
    $mdDialog.hide();
  };
}
