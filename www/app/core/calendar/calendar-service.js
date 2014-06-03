/**
 * Created by justin on 2014-06-03.
 */



angular.module('sproutApp.calendar', [])

.service('calendar', ['$log', '$q', function($log, $q) {
  var service = {

  };

  service.addEvent = function(startDate, endDate, title, location, notes) {
    if (!angular.isObject(startDate)) {
      startDate =  new Date(startDate);
      startDate += new Date( startDate.getTime() + ( startDate.getTimezoneOffset() * 60000 ) );;
    }

    if (!angular.isObject(endDate)) {
      endDate =  new Date(endDate);
      endDate += new Date( endDate.getTime() + ( endDate.getTimezoneOffset() * 60000 ) );;
    }

    $log.log('Event added: ', startDate, endDate, title, location, notes);
    if (window.plugins && window.plugins.calendar) {
      window.plugins.calendar.createEvent(title, location, notes, startDate, endDate, function(arg) {
        $log.log('Successfully added event to device calendar.', arg);
      }, function error(arg) {
        $log.error('Failed to add event to device calendar', arg);
      });
    }
    return $q.when('sher');
  };

  return service;
}]);
//      var startDate = new Date(2014,2,15,18,30,0,0,0); // beware: month 0 = january, 11 = december
//      var endDate = new Date(2014,2,15,19,30,0,0,0);
//      var title = "My nice event";
//      var location = "Home";
//      var notes = "Some notes about this event.";
//      var success = function(message) { alert("Success: " + JSON.stringify(message)); };
//      var error = function(message) { alert("Error: " + message); };
//
//      // create a calendar (iOS only for now)
//      window.plugins.calendar.createCalendar(calendarName,success,error);
//      // if you want to create a calendar with a specific color, pass in a JS object like this:
//      var createCalOptions = window.plugins.calendar.getCreateCalendarOptions();
//      createCalOptions.calendarName = "My Cal Name";
//      createCalOptions.calendarColor = "#FF0000"; // an optional hex color (with the # char), default is null, so the OS picks a color
//      window.plugins.calendar.createCalendar(createCalOptions,success,error);
//
//      // create an event silently (on Android < 4 an interactive dialog is shown)
//      window.plugins.calendar.createEvent(title,location,notes,startDate,endDate,success,error);