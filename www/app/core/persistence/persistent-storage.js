/**
 * Created by justin on 2014-05-21.
 */

angular.module('sproutApp.persistentStorage', [])

.value('persistentStorage', window.localStorage)
;