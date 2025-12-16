window.initCalendar = function () {
    $(document).ready(function () {

        // Get the modal
        var modal = document.getElementById("addEventsModal");

        // Get the button that opens the modal
        var btn = document.getElementById("myBtn");

        // Get the Add Event button
        var addEvent = document.getElementById("add-e");
        // Get the Edit Event button
        var editEvent = document.getElementById("edit-event");
        // Get the Discard Modal button
        var discardModal = document.querySelectorAll("[data-dismiss='modal']")[0];

        // Get the Add Event button
        var addEventTitle = document.getElementsByClassName("add-event-title")[0];
        // Get the Edit Event button
        var editEventTitle = document.getElementsByClassName("edit-event-title")[0];

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // Get the all <input> elements insdie the modal
        var input = document.querySelectorAll('input[type="text"]');
        var radioInput = document.querySelectorAll('input[type="radio"]');

        // Get the all <textarea> elements insdie the modal
        var textarea = document.getElementsByTagName('textarea');

        // Create BackDrop ( Overlay ) Element
        function createBackdropElement() {
            var btn = document.createElement("div");
            btn.setAttribute('class', 'modal-backdrop fade show')
            document.body.appendChild(btn);
        }

        // Reset radio buttons

        function clearRadioGroup(GroupName) {
            var ele = document.getElementsByName(GroupName);
            for (var i = 0; i < ele.length; i++)
                ele[i].checked = false;
        }

        // Reset Modal Data on when modal gets closed
        function modalResetData() {
            modal.style.display = "none";
            for (i = 0; i < input.length; i++) {
                input[i].value = '';
            }
            for (j = 0; j < textarea.length; j++) {
                textarea[j].value = '';
                i
            }
            clearRadioGroup("marker");
            // Get Modal Backdrop
            document.getElementById('event-category').selectedIndex = 0;

            // Hide error messages
            $('#title-error').hide();
            $('#category-error').hide();
            $('#start-error').hide();
            $('#end-error').hide();

// Clear label colors and borders
$('label').removeClass('text-danger');
$('#write-e, #event-category, #start-date, #end-date').removeClass('border border-danger');


            // Remove backdrop
            const getModalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
            if (getModalBackdrop) {
                document.body.removeChild(getModalBackdrop);
            }
        }

        // When the user clicks on the button, open the modal
        btn.onclick = function () {
            modal.style.display = "block";
            addEvent.style.display = 'block';
            editEvent.style.display = 'none';
            addEventTitle.style.display = 'block';
            editEventTitle.style.display = 'none';
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            createBackdropElement();
            enableDatePicker();
        }

        // Clear Data and close the modal when the user clicks on Discard button
        discardModal.onclick = function () {
            modalResetData();
            document.getElementsByTagName('body')[0].removeAttribute('style');
        }

        // Clear Data and close the modal when the user clicks on <span> (x).
        span.onclick = function () {
            modalResetData();
            document.getElementsByTagName('body')[0].removeAttribute('style');
        }

        // Clear Data and close the modal when the user clicks anywhere outside of the modal.
        window.onclick = function (event) {
            if (event.target == modal) {
                modalResetData();
                document.getElementsByTagName('body')[0].removeAttribute('style');
            }
        }

        newDate = new Date()
        monthArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

        function getDynamicMonth(monthOrder) {
            var getNumericMonth = parseInt(monthArray[newDate.getMonth()]);
            var getNumericMonthInc = parseInt(monthArray[newDate.getMonth()]) + 1;
            var getNumericMonthDec = parseInt(monthArray[newDate.getMonth()]) - 1;

            if (monthOrder === 'default') {

                if (getNumericMonth < 10) {
                    return '0' + getNumericMonth;
                } else if (getNumericMonth >= 10) {
                    return getNumericMonth;
                }

            } else if (monthOrder === 'inc') {

                if (getNumericMonthInc < 10) {
                    return '0' + getNumericMonthInc;
                } else if (getNumericMonthInc >= 10) {
                    return getNumericMonthInc;
                }

            } else if (monthOrder === 'dec') {

                if (getNumericMonthDec < 10) {
                    return '0' + getNumericMonthDec;
                } else if (getNumericMonthDec >= 10) {
                    return getNumericMonthDec;
                }
            }
        }

        /* initialize the calendar
        -----------------------------------------------------------------*/

        var calendar = $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            events: function (start, end, timezone, callback) {
                fetch(`${window.VITE_BASE_URL}/api/calendar`, {
                    headers: {
                        Authorization: `Bearer ${window.AUTH_TOKEN}`,
                    },
                })
                    .then(res => res.json())
                    .then(data => {
                        const events = data.map(event => ({
                            id: event._id,
                            title: event.title,
                            start: event.start,
                            end: event.end,
                            className: event.badge,
                            description: event.description,
                            category: event.category
                        }));
                        callback(events);
                    })
                    .catch(err => {
                        console.error('Failed to load events:', err);
                    });
            }
            ,

            editable: true,
            eventLimit: true,
            eventMouseover: function (event, jsEvent, view) {
                $(this).attr('id', event.id);

                $('#' + event.id).popover({
                    template: '<div class="popover popover-primary" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                    title: event.title,
                    content: event.description,
                    placement: 'top',
                });

                $('#' + event.id).popover('show');
            },
            eventMouseout: function (event, jsEvent, view) {
                $('#' + event.id).popover('hide');
            },
            eventClick: function (info) {

                addEvent.style.display = 'none';
                editEvent.style.display = 'block';

                addEventTitle.style.display = 'none';
                editEventTitle.style.display = 'block';
                modal.style.display = "block";
                document.getElementsByTagName('body')[0].style.overflow = 'hidden';
                createBackdropElement();

                // Calendar Event Featch
                var eventTitle = info.title;
                var eventDescription = info.description;

                // Task Modal Input
                var taskTitle = $('#write-e');
                var taskTitleValue = taskTitle.val(eventTitle);

                var taskDescription = $('#taskdescription');
                var taskDescriptionValue = taskDescription.val(eventDescription);

                $('#event-category').val(info.category || '');

                var taskInputStarttDate = $("#start-date");
                var taskInputStarttDateValue = taskInputStarttDate.val(info.start.format("YYYY-MM-DD HH:mm:ss"));

                var taskInputEndDate = $("#end-date");
                var taskInputEndtDateValue = taskInputEndDate.val(info.end.format("YYYY-MM-DD HH:mm:ss"));

                var startDate = flatpickr(document.getElementById('start-date'), {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    defaultDate: info.start.format("YYYY-MM-DD HH:mm:ss"),
                });

                var abv = startDate.config.onChange.push(function (selectedDates, dateStr, instance) {
                    var endtDate = flatpickr(document.getElementById('end-date'), {
                        enableTime: true,
                        dateFormat: "Y-m-d H:i",
                        minDate: dateStr
                    });
                })

                var endtDate = flatpickr(document.getElementById('end-date'), {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    defaultDate: info.end.format("YYYY-MM-DD HH:mm:ss"),
                    minDate: info.start.format("YYYY-MM-DD HH:mm:ss")
                });

                $('#edit-event').off('click').on('click', async function (event) {
                    event.preventDefault();
                    const radioValue = $("input[name='marker']:checked").val();
                    const taskStartTimeValue = document.getElementById("start-date").value;
                    const taskEndTimeValue = document.getElementById("end-date").value;
                    const taskTitle = $('#write-e').val();
                    const taskDescription = $('#taskdescription').val();
                    const category = $("#event-category").val();

                    try {
                        const res = await fetch(`${window.VITE_BASE_URL}/api/calendar/${info.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${window.AUTH_TOKEN}`,
                            },
                            body: JSON.stringify({
                                title: taskTitle,
                                description: taskDescription,
                                start: taskStartTimeValue,
                                end: taskEndTimeValue,
                                badge: radioValue,
                                category
                            })
                        });

                        const result = await res.json();

                        info.title = result.event.title;
                        info.description = result.event.description;
                        info.start = result.event.start;
                        info.end = result.event.end;
                        info.className = result.event.badge;

                        $('#calendar').fullCalendar('updateEvent', info);
                        modal.style.display = "none";
                        modalResetData();
                        document.getElementsByTagName('body')[0].removeAttribute('style');
                    } catch (err) {
                        console.error("Edit event failed", err);
                    }
                });

            }
        })


        function enableDatePicker() {
            var startDate = flatpickr(document.getElementById('start-date'), {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: new Date()
            });

            var abv = startDate.config.onChange.push(function (selectedDates, dateStr, instance) {

                var endtDate = flatpickr(document.getElementById('end-date'), {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    minDate: dateStr
                });
            })

            var endtDate = flatpickr(document.getElementById('end-date'), {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: new Date()
            });
        }


        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        }
        $("#add-e").off('click').on('click', async function (event) {
            event.preventDefault();
            const inputValue = $("#write-e").val();
            const start = $("#start-date").val();
            const end = $("#end-date").val();
            const category = $("#event-category").val();
            const description = $("#taskdescription").val();
            const badge = $("input[name='marker']:checked").val();

            let hasError = false;

         // Title
if (!inputValue) {
    $('label[for="write-e"]').addClass('text-danger'); // 🔴 Make label red
    $('#write-e').addClass('border border-danger');    // 🔴 Add red border
    hasError = true;
} else {
    $('label[for="write-e"]').removeClass('text-danger');
    $('#write-e').removeClass('border border-danger');
}

// Category
if (!category) {
    $('label[for="event-category"]').addClass('text-danger');
    $('#event-category').addClass('border border-danger');
    hasError = true;
} else {
    $('label[for="event-category"]').removeClass('text-danger');
    $('#event-category').removeClass('border border-danger');
}

// Start Date
if (!start) {
    $('label[for="start-date"]').addClass('text-danger');
    $('#start-date').addClass('border border-danger');
    hasError = true;
} else {
    $('label[for="start-date"]').removeClass('text-danger');
    $('#start-date').removeClass('border border-danger');
}

// End Date
if (!end) {
    $('label[for="end-date"]').addClass('text-danger');
    $('#end-date').addClass('border border-danger');
    hasError = true;
} else {
    $('label[for="end-date"]').removeClass('text-danger');
    $('#end-date').removeClass('border border-danger');
}

// Start > End check
if (start && end && new Date(start) > new Date(end)) {
    $('label[for="start-date"]').addClass('text-danger');
    $('label[for="end-date"]').addClass('text-danger');
    $('#start-date').addClass('border border-danger');
    $('#end-date').addClass('border border-danger');
    hasError = true;
}


            if (hasError) return;

            try {
                const res = await fetch(`${window.VITE_BASE_URL}/api/calendar`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${window.AUTH_TOKEN}`, // from context or localStorage
                    },
                    body: JSON.stringify({ title: inputValue, start, end, category, description, badge })
                });
                const result = await res.json();
                if (!result.event || !result.event._id) {
                    throw new Error("Invalid response");
                }


                $('#calendar').fullCalendar('renderEvent', {
                    id: result.event._id,
                    title: result.event.title,
                    start: result.event.start,
                    end: result.event.end,
                    className: result.event.badge,
                    description: result.event.description
                }, true);

                modal.style.display = "none";
                modalResetData();
                document.getElementsByTagName('body')[0].removeAttribute('style');

            } catch (err) {
                console.error("Add event failed", err);
            }
        });


        // Setting dynamic style ( padding ) of the highlited ( current ) date

        function setCurrentDateHighlightStyle() {
            getCurrentDate = $('.fc-content-skeleton .fc-today').attr('data-date');
            if (getCurrentDate === undefined) {
                return;
            }
            splitDate = getCurrentDate.split('-');
            if (splitDate[2] < 10) {
                $('.fc-content-skeleton .fc-today .fc-day-number').css('padding', '3px 8px');
            } else if (splitDate[2] >= 10) {
                $('.fc-content-skeleton .fc-today .fc-day-number').css('padding', '3px 4px');
            }
        }
        setCurrentDateHighlightStyle();

        const mailScroll = new PerfectScrollbar('.fc-scroller', {
            suppressScrollX: true
        });

        var fcButtons = document.getElementsByClassName('fc-button');
        for (var i = 0; i < fcButtons.length; i++) {
            fcButtons[i].addEventListener('click', function () {
                const mailScroll = new PerfectScrollbar('.fc-scroller', {
                    suppressScrollX: true
                });
                $('.fc-scroller').animate({ scrollTop: 0 }, 100);
                setCurrentDateHighlightStyle();
            })
        }
    });

}