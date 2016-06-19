$(document).ready(onDocumentReady);

function onDocumentReady() {
    var calendar = new Calendar({
        el: "#calendar",
        defaultDate: Date.today().add(2).day(),
        calendarDateFormat: "MMMM yyyy",
        dateFormat: "d-MMM-yyyy",
        title: "Select a date"
    });

    $(calendar).on("change", function(e, param) {
        console.log(param);
    });

    // var link = new Link();
}
