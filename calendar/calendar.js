function Link() {
    var $link = $(".link");

    $link.on("mousedown touchstart", function() {
        $(this).addClass("active-state");
    });

    $link.on("mouseup touchend", function() {
        $(this).removeClass("active-state");
    });

}

function Calendar(param) {
    var self = this;
    var templateContainer = param.templateContainer || '<div class="calendar animated">' +
        '<div class="calendar-inner">' +
        '</div>' +
        '</div>';

    var templateHeader = param.templateHeader || '<div class="calendar-header">' +
        '<div class="title"></div>' +
        '<div class="calendar-header-inner">' +
        '<div class="left link">' +
        '<i class="icon-android-arrow-back"></i>' +
        '</div>' +
        '<div class="center"></div>' +
        '<div class="right link">' +
        '<i class="icon-android-arrow-forward"></i>' +
        '</div>' +
        '</div>' +
        '</div>';

    var templateContent = param.templateContent || '<div class="calendar-content">' +
        '<div class="calendar-months">' +
        '<div class="calendar-week-days">' +
        '</div>' +
        '<div class="calendar-months-inner">' +
        '</div>' +
        '</div>' +
        '</div>';

    var $templateContainer = $(templateContainer);
    var $templateHeader = $(templateHeader);
    var $templateContent = $(templateContent);
    var title = param.title || "";

    $templateContainer.find(".calendar-inner").append($templateHeader);
    $templateContainer.find(".calendar-inner").append($templateContent);

    var $body = $("body");
    var $el = $(param.el);
    var $cal = $templateContainer;
    var $calTitle = $cal.find(".title");
    var $calTitleDate = $cal.find(".center");
    var $calPrevIcon = $cal.find(".left");
    var $calNextIcon = $cal.find(".right");
    var $calWeekDays = $cal.find(".calendar-week-days");
    var $calMonthsInner = $cal.find(".calendar-months-inner");
    var $calMonth = $("<div class='calendar-month animated'></div>");
    var $calRow = $("<div class='calendar-row'></div>");
    var $calDay = $("<div class='calendar-day'><span></span></div>");
    var $calWeekDay = $("<div class='calendar-week-day'></div>");
    var classOtherDay = "calendar-day-other";
    var classToday = "calendar-day-today";
    var classSelectedDay = "calendar-day-selected";
    var monthNames = param.monthNames || ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var dayNamesShort = param.dayNamesShort || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var defaultDate = param.defaultDate || Date.today();
    var dateFormat = param.dateFormat || 'M/d/yyyy';
    var calendarDateFormat = param.calendarDateFormat || 'MMMM, yyyy';
    var tagName = $el.prop('tagName').toLowerCase();
    var isInput = tagName == "input";
    var animationTime = 400;
    var classAnimCalIn = "slideInUp";
    var classAnimCalOut = "slideOutDown";
    var classAnimationSlideOut = "slideOut";
    var classAnimationSlideIn = "slideIn";
    var $overlay = $("<div class='calendar-overlay overlay'></div>")

    var calendar = {
        current: new Date(defaultDate.toString()),
        selectDate: new Date(defaultDate.toString()),
        hammer : null,
        init: function() {
            calendar.bind();
            calendar.setMonth(false);
            calendar.setDaysNames();
            if (isInput) {
                calendar.inputBinding();
            }
            calendar.setLabels();
        },
        bind: function() {
            $calNextIcon.on("click", {
                direction: 'next'
            }, calendar.goToMonth);
            $calPrevIcon.on("click", {
                direction: 'prev'
            }, calendar.goToMonth);
            $cal.on('change', calendar.onDayChange);

            calendar.hammer = new Hammer( $calMonthsInner[0] );

            calendar.hammer.on("swipeleft", function(){
              calendar.goToMonth({ data : { direction : "next"}})
            });
            calendar.hammer.on("swiperight", function(){
              calendar.goToMonth({ data : { direction : "prev"}})
            });
        },
        inputBinding: function() {
            $el.val(calendar.selectDate.toString(dateFormat));
            $el.on('click', calendar.onInputClick);
            $body.append($templateContainer);
            $body.append($overlay);
        },
        setLabels: function() {
            $calTitle.html(title);
        },
        onInputClick: function() {
            calendar.show();
        },
        setDaysNames: function() {
            dayNamesShort.forEach(function(dayName) {
                $calWeekDays.append($calWeekDay.clone().html(dayName));
            });
        },
        onDayChange: function(event, date) {
            if (isInput) {
                $el.val(date);
            }
            $(self).trigger("change", date);
            calendar.hide();
        },
        show: function() {
            $templateContainer.show();
            $overlay.show();
            $templateContainer.addClass(classAnimCalIn);
            $body.append
            setTimeout(function() {
                $templateContainer.removeClass(classAnimCalIn);
            }, animationTime);
        },
        hide: function() {
            $templateContainer.addClass(classAnimCalOut);
            $overlay.hide();
            setTimeout(function() {
                $templateContainer.removeClass(classAnimCalOut);
                $templateContainer.hide();
            }, animationTime);
        },
        onDayClick: function(event) {
            calendar.current = new Date(event.data.date);
            calendar.selectDate = new Date(event.data.date);
            $cal.trigger("change", calendar.selectDate.toString(dateFormat));
            $("." + classSelectedDay).removeClass(classSelectedDay);
            $(this).addClass(classSelectedDay);
        },
        goToMonth: function(event) {
            var currentMonth = calendar.current.getMonth();
            if (event.data.direction == 'next') {
                currentMonth++;
            } else {
                currentMonth--;
            }
            calendar.current.setMonth(currentMonth);
            calendar.setMonth(true, event.data.direction);
        },
        setMonth: function(animate, direction) {
            $calTitleDate.html(calendar.current.toString(calendarDateFormat));
            calendar.setDaysOfMonth(calendar.current.moveToFirstDayOfMonth(), animate, direction); //curr month
        },
        setDaysOfMonth: function(monthFirstDate, animate, direction) {

            var first = monthFirstDate.getDate() - monthFirstDate.getDay(); //to set first day on monday, not on sunday, first+1 :
            if (monthFirstDate.getDay() == 0) {
                //for sunday
                first = -6;
            }
            var $calRowClone = $calRow.clone();
            var $calMonthClone = $calMonth.clone();
            for (var i = 1; i <= 7 * 6; i++) {
                var next = new Date(monthFirstDate.getTime());
                next.setDate(first + i);
                var $day = $calDay.clone();
                $day.find("span").html(next.getDate());
                calendar.addDataToDate($day, next);
                $calRowClone.append($day);
                if (i % 7 == 0 && i != 0) {
                    $calMonthClone.append($calRowClone);
                    $calRowClone = $calRow.clone();
                }
            }
            $calMonthClone.attr('data-date', monthFirstDate.toString());
            if (animate) {
                calendar.animateMonths($calMonthClone, direction);
            } else {
                $calMonthsInner.html($calMonthClone);
            }
            $calMonthClone = $calMonth.clone();
        },
        animateMonths: function($calMonthClone, direction) {
            var $currMonth = $calMonthsInner.find(".calendar-month");
            var $nextMonth = $calMonthClone;
            var outClass = direction == 'next' ? "Left" : "Right";
            var inClass = direction == 'prev' ? "Left" : "Right";
            $currMonth.addClass("calendar-month-off").addClass(classAnimationSlideOut + outClass);
            $calMonthsInner.append($nextMonth);
            $nextMonth.addClass(classAnimationSlideIn + inClass);
            setTimeout(function() {
                //$currMonth.remove();
            }, animationTime);
        },
        addDataToDate: function($day, dayDate) {
            $day.attr("data-date", dayDate.toString());
            dayDate.setMinutes(0);
            var today = Date.today();
            if (calendar.current.getMonth() != dayDate.getMonth()) {
                $day.addClass(classOtherDay);
            }
            if (today.equals(dayDate)) {
                $day.addClass(classToday);
            }
            if (calendar.selectDate.equals(dayDate)) {
                $day.addClass(classSelectedDay);
            }
            $day.off('click', calendar.onDayClick);
            $day.on('click', {
                date: dayDate
            }, calendar.onDayClick);
        }
    };
    calendar.init();
}
