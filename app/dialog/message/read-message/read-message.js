'use strict';

require('./_read-message.scss');
// require('./_message-thumbnail.scss');

module.exports = {
  template: require('./read-message.html'),
  controller: ['$q', '$log', '$mdDialog', '$mdToast','messageService', '$timeout', 'message', 'wayService', '$scope', ReadMessageController],
  controllerAs: 'readMessageCtrl'
};

function ReadMessageController($q, $log, $mdDialog, $mdToast,  messageService, $timeout, message, wayService, $scope) {
  $log.debug('ReadMessageController');
  this.isLoadingWayer = false;

  this.message = message;
  this.isAddMessage = this.message.subject.includes('wants to join your way');
  if (this.isAddMessage) {
    this.showMessage = this.message.text.slice(0, this.message.text.lastIndexOf(':'));
  } else this.showMessage = this.message.text;

  console.log('this up in read message', this);

  this.readMessageSubmit = function() {
    this.isLoadingWayer = true;
    $timeout(2000, () => {
      //2 sec delay to simulate async(call to api)
      return;
    })
    .then( () => {
      $mdToast.showSimple('Success!');
      this.isLoadingWayer = false;
      $mdDialog.hide();
    })
    .catch( err => {
      $mdToast.showSimple(err.data);
      this.isLoadingWayer = false;
    });
  };

  this.addWayerSubmit = () => {
    this.isLoadingWayer = true;

    if (!this.isAddMessage) return;

    let wayToAddID = this.message.text.slice(this.message.text.lastIndexOf(':') + 2);

    console.log('wayToAddID:',wayToAddID);

    wayService.addWayer(wayToAddID, this.message.fromProfileID)
    .then( wayer => {
      $mdToast.showSimple('Added Wayer Successfully');
      this.isLoadingWayer = false;
      $scope.$emit('wayModify');
      $mdDialog.hide();
    })
    .catch( err => {
      $mdToast.showSimple(err.message);
      this.isLoadingWayer = false;
    });
  };

  this.closeDialog = function() {
    $mdDialog.hide();
  };
}
