'use strict';

module.exports = ['$mdThemingProvider', appStyleConfig];

function appStyleConfig($mdThemingProvider) {
  let themes = {
    blueGreyPrmCyanAcc: {
      themeName: 'blueGreyPrmCyanAcc',
      primaryPalette: 'blue-grey',
      accentPalette: 'cyan',
      warnPalette: 'red',
      backgroundPalette: 'grey'
    },
    traffic1: {
      themeName: 'traffic1',
      primaryPalette: 'indigo',
      accentPalette: 'blue',
      warnPalette: 'grey',
      backgroundPalette: 'grey'
    },
    swag: {
      themeName: 'swag',
      primaryPalette: 'blue',
      accentPalette: 'green',
      warnPalette: 'red',
      backgroundPalette: 'grey'
    },
  };

  for (let theme in themes) {
    $mdThemingProvider
    .theme(theme)
    .primaryPalette(themes[theme].primaryPalette)
    .accentPalette(themes[theme].accentPalette)
    .warnPalette(themes[theme].warnPalette)
    .backgroundPalette(themes[theme].backgroundPalette);
  }

  // $mdThemingProvider.setDefaultTheme('traffic1');
  // $mdThemingProvider.theme('swag')
  //   .dark();
  $mdThemingProvider.setDefaultTheme('swag');
  // $mdThemingProvider.setDefaultTheme('blueGreyPrmCyanAcc');

}
