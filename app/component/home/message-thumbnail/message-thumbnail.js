'use strict';

require('./_message-thumbnail.scss');
const readMessageDialog = require('../../../dialog/message/read-message/read-message.js');

module.exports = {
  template: require('./message-thumbnail.html'),
  controller: ['$q','$log', '$http', '$interval', '$mdMedia', '$scope', '$mdDialog', 'profileService', 'messageService', MessageThumbnailController],
  controllerAs: 'messagethumbnailCtrl',
  bindings: {
    incoming: '='
  }
};

function MessageThumbnailController($q, $log, $http, $interval, $mdMedia, $scope, $mdDialog, profileService, messageService) { // eslint-line-disable
  $log.debug('MessageThumbnailController');



  this.messages = [];
  profileService.fetchProfile()
  .then( profile => {
    this.profile = profile;
    return messageService.fetchMessages();
  })
  .catch( err => {
    console.error(err.data);
    return messageService.fetchMessages();
  })
  .then((messages) => {
    this.messages = messages;
    if (this.incoming) {
      this.messages = this.messages.filter((msg) => (msg.toProfileID == this.profile._id));
    } else {
      this.messages = this.messages.filter((msg) => (msg.fromProfileID == this.profile._id));
    }

    for (let message of this.messages) {
      this.fetchDisplayName(message);
    }
  })
  .catch((err) => {
    $log.error(err.message);
    return $q.reject(err);
  });

  this.fetchDisplayName = function (message) {
    let profileId;
    if (this.incoming) {
      profileId = message.fromProfileID;
    } else {
      profileId = message.toProfileID;
    }
    profileService.fetchProfileByID(profileId)
    .then((profile) => {
      message.displayName = profile.displayName;
      message.photo = profile.photo;
      message.showTime = new Date(message.timestamp);
    });
  };

  this.readMessage = function ($event, bindFlag, message) {
    const dialogConfig = {
      fullscreen: !$mdMedia('gt-sm'),
      targetEvent: $event,
      scope: $scope.$new(bindFlag),
      resolve: {
        message: function() {
          return message;
        }
      },
    };
    $mdDialog.show(Object.assign(readMessageDialog, dialogConfig));
  };

  this.deleteMessage = function ($event, bindFlag, message) {
    messageService.deleteMessage(message._id);
    this.messages.splice(this.messages.indexOf(message), 1);
  };
}
