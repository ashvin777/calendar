$(document).ready(onDocumentReady);

function onDocumentReady() {
    var calendar = new Calendar();
    var link = new Link();
}

function Link() {
    var $link = $(".link");

    $link.on("mousedown touchstart", function() {
        $(this).addClass("active-state");
    });

    $link.on("mouseup touchend", function() {
        $(this).removeClass("active-state");
    });

}

function Calendar() {
    var $cal = $(".calendar");
    var $calTitle = $cal.find(".center");
    var $calPrevIcon = $cal.find(".left");
    var $calNextIcon = $cal.find(".right");
    var $calWeekDays = $cal.find(".calendar-week-days");
    var $calMonthsInner = $cal.find(".calendar-months-inner");
    var $calMonth = $("<div class='calendar-month'></div>");
    var $calRow = $("<div class='calendar-row'></div>");
    var $calDay = $("<div class='calendar-day'><span></span></div>");
    var classOtherDay = "calendar-day-other";
    var classToday = "calendar-day-today";
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var calendar = {
        current: Date.today().moveToFirstDayOfMonth(),
        init: function() {
            calendar.bind();
            calendar.setMonth(false);
        },
        bind: function() {
            $calNextIcon.on("click", {
                direction: 'next'
            }, calendar.goToMonth);
            $calPrevIcon.on("click", {
                direction: 'prev'
            }, calendar.goToMonth);
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
            $calTitle.html(monthNames[calendar.current.getMonth()] + ", " + calendar.current.getFullYear());
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

            $currMonth.addClass("calendar-month-off").addClass("animate-move-out-"+direction);
            $calMonthsInner.append($nextMonth);
            $nextMonth.addClass("animate-move-in-" + direction);

            $currMonth.animate(300,
                function() {
                    $(this).remove();
                }
            );
        },
        addDataToDate: function($day, dayDate) {
            $day.attr("data-date", dayDate.toString());
            dayDate.setMinutes(0);
            var today = Date.today();
            if (calendar.current.getMonth() != dayDate.getMonth()) {
                $day.addClass(classOtherDay);
            }
            if (Date.today().equals(dayDate)) {
                $day.addClass(classToday);
            }
        }
    };
    calendar.init();
}
