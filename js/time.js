//Time function for use a time object inherited by Date object.
function init(){
	//Init object
	Time = {};
	
	Function.prototype.time = function () {
		return new Date();
	};
	
	Time.time = Function.time();
	
	//Date: Week, Day, Month, Year
	
	Time.week = function (week) {
		week = this.time.getDay();
		return parseInt(week);
	};
	
	Time.week = Time.week();
	
	Time.day = function (day) {
		day = this.time.getDate();
		return parseInt(day);
	};
	
	Time.day = Time.day();
	
	Time.month = function (month) {
		month = this.time.getMonth();
		return parseInt(month);
	};
	
	Time.month = Time.month();
	
	Time.year = function (year) {
		if (typeof year !== 'undefined') {
			if (year == 'short') {
				year = this.time.getYear();
				return parseInt(year);		
			} else {
				return false;
			}
		} else {
			year = this.time.getFullYear();
			return parseInt(year);
		}
	};
	
	Time.year = Time.year();
	
	//Time: Hour, Minuts, Seconds, Miliseconds
	
	Time.hour = function (hour) {
		hour = this.time.getHours();
		return parseInt(hour);
	};
	
	Time.hour = Time.hour();
	
	Time.minute = function (minute) {
		minute = this.time.getMinutes();
		return parseInt(minute);
	};
	
	Time.minute = Time.minute();
	
	Time.second = function (second) {
		second = this.time.getSeconds();
		return parseInt(second);
	};
	
	Time.second = Time.second();
	
	Time.millisecond = function (millisecond) {
		millisecond = this.time.getMilliseconds();
		return parseInt(millisecond);
	};
	
	Time.millisecond = Time.millisecond();
	
	//Exactly time and date
	
	Time.now_date = function () {
		var args = arguments,
			c = 0;

		if (typeof args[0] !== 'undefined' && typeof args[0] == 'string' && args[0] !== '') {
			while (true) {
				if (c == 3) {
					break;
				} else {
					if (args[0].search(/([%][d|D]){1}/) !== 1) {
						args[0] = args[0].replace(/([%][d|D])/, this.day());
					} if (args[0].search(/([%][m|M])/) !== 1) {
						args[0] = args[0].replace(/([%][m|M])/, this.month());
					} if (args[0].search(/([%][y|Y])/) !== 1) {
						args[0] = args[0].replace(/([%][y|Y])/, this.year());
					} else {
						return false;
					}
				}
			
				c++;
			}
		
			return args[0];	
		} else {
			return false;
		}
	};
	
	Time.now_time = function () {
		var args = arguments,
			c = 0;

		if (typeof args[0] !== 'undefined' && typeof args[0] == 'string'  && args[0] !== '') {
			while (true) {
				if (c == 4) {
					break;
				} else {
					if (args[0].search(/([%][h|H]){1}/) !== 1) {
						args[0] = args[0].replace(/([%][h|H])/, this.hour());
					} if (args[0].search(/([%][m|M])/) !== 1) {
						args[0] = args[0].replace(/([%][m|M])/, this.minute());
					} if (args[0].search(/([%][s|S])/) !== 1) {
						args[0] = args[0].replace(/([%][s|S])/, this.second());
					} if (args[0].search(/([%]([s][s])|([S][S]))/) !== 1) {
						args[0] = args[0].replace(/([%]([s][s])|([S][S]))/, this.millisecond());
					} else {
						return false;
					}
				}
			
				c++;
			}
		
			return args[0];	
		} else {
			return false;
		}	
	};
}

(function () {
	init()
} ())
