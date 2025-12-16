// Check if DataTable is already initialized
if (!$.fn.DataTable.isDataTable('#invoice-list')) {
    var invoiceList = $('#invoice-list').DataTable({
        // "dom": "<'inv-list-top-section'<'row'<'col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center'l<'dt-action-buttons align-self-center'B>><'col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-3'f<'toolbar align-self-center'>>>>" +
        //     "<'table-responsive'tr>" +
        //     "<'inv-list-bottom-section d-sm-flex justify-content-sm-between text-center'<'inv-list-pages-count  mb-sm-0 mb-3'i><'inv-list-pagination'p>>",

        "dom":
            "<'inv-list-top-section'\
    <'row align-items-center'\
        <'col-sm-12 col-md-6 d-flex justify-content-md-start justify-content-center'\
            l\
            <'dt-action-buttons align-self-center'B>\
        >\
        <'col-sm-12 col-md-6 d-flex justify-content-md-end justify-content-center mt-md-0 mt-0'\
            <'dt-export-buttons mr-2'>\
            f\
            <'toolbar ml-2'>\
        >\
    >\
>" +
            "<'table-responsive'tr>" +
            "<'inv-list-bottom-section d-sm-flex justify-content-sm-between text-center'\
    <'inv-list-pages-count mb-sm-0 mb-3'i>\
    <'inv-list-pagination'p>\
>",


        headerCallback: function (e, a, t, n, s) {
            e.getElementsByTagName("th")[0].innerHTML = '<label class="new-control new-checkbox checkbox-primary m-auto">\n<input type="checkbox" class="new-control-input chk-parent select-customers-info" id="customer-all-info">\n<span class="new-control-indicator"></span><span style="visibility:hidden">c</span>\n</label>'
        },
        columnDefs: [{
            targets: 0,
            width: "30px",
            className: "",
            orderable: !1,
            render: function (e, a, t, n) {
                return '<label class="new-control new-checkbox checkbox-primary  m-auto">\n<input type="checkbox" class="new-control-input child-chk select-customers-info" id="customer-all-info">\n<span class="new-control-indicator"></span><span style="visibility:hidden">c</span>\n</label>'
            },
        }],
        buttons: [
            // {
            //     text: 'Add New',
            //     className: 'btn btn-primary btn-sm',
            //     action: function(e, dt, node, config ) {
            //         window.location = 'apps_invoice-add.html';
            //     }
            // },
            {
                text: `
        <svg id="btn-add-contact" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-list view-list">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
    `,
                className: 'btn',
                action: function (e, dt, node, config) {
                    window.dispatchEvent(new CustomEvent('open-add-contact-modal'));
                }
            },

            {
                text: 'Name',
                className: 'btn btn-primary toggle-vis mb-1',
                action: function (e, dt, node, config) {
                    var column = dt.column(1); // Name column
                    column.visible(!column.visible());
                }
            },
            {
                text: 'Email',
                className: 'btn btn-primary toggle-vis mb-1',
                action: function (e, dt, node, config) {
                    var column = dt.column(2); // Email column (adjust index as needed)
                    column.visible(!column.visible());
                }
            },
            {
                text: 'Location',
                className: 'btn btn-primary toggle-vis mb-1',
                action: function (e, dt, node, config) {
                    var column = dt.column(3); // Email column (adjust index as needed)
                    column.visible(!column.visible());
                }
            },
            {
                text: 'Phone',
                className: 'btn btn-primary toggle-vis mb-1',
                action: function (e, dt, node, config) {
                    var column = dt.column(4); // Date column (adjust index as needed)
                    column.visible(!column.visible());
                }
            },

            {
                text: 'Alert',
                className: 'btn btn-primary toggle-vis mb-1',
                action: function (e, dt, node, config) {
                    var column = dt.column(7); // Email column (adjust index as needed)
                    column.visible(!column.visible());
                }
            }
        ],
        "order": [[1, "asc"]],
        "oLanguage": {
            "oPaginate": { "sPrevious": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' },
            "sInfo": "Showing page _PAGE_ of _PAGES_",
            "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
            "sSearchPlaceholder": "Search...",
            "sLengthMenu": "Results :  _MENU_",
        },
        "stripeClasses": [],
        "lengthMenu": [7, 10, 20, 50],
        "pageLength": 7
    });

    // Insert export buttons before search box
    $("div.dt-export-buttons").html(`
    <button class="btn btn-sm btn-secondary mr-1" id="btnDoc">DOC</button>
    <button class="btn btn-sm btn-success mr-1" id="btnExcel">Excel</button>
    <button class="btn btn-sm btn-danger mr-1" id="btnPdf">PDF</button>
    <button class="btn btn-sm btn-primary mr-2" id="btnPrint">Print</button>
`);


    // $("div.toolbar").html('<button class="dt-button dt-delete btn btn-danger btn-sm" tabindex="0" aria-controls="invoice-list"><span>Delete</span></button>');

    // multiCheck(invoiceList);

    // $('.dt-delete').on('click', function() {
    //     $(".select-customers-info:checked").each(function () {
    //         if (this.classList.contains('chk-parent')) {
    //             return;
    //         } else {
    //             $(this).parents('tr').remove();
    //         }
    //     });
    // });

    // $('.action-delete').on('click', function() {
    //     $(this).parents('tr').remove();
    // });

    $("div.toolbar").html(`
    <div class="action-btn">
        <svg id="delete-multiple-btn-cnt"
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-trash-2 delete-multiple"
            style="margin-top:4px;">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    </div>
`);

    // Initialize multiCheck
    multiCheck(invoiceList);

    // DELETE MULTIPLE — new button
    $(document).on("click", "#delete-multiple-btn-cnt", function () {
        $(".select-customers-info:checked").each(function () {
            if (!this.classList.contains('chk-parent')) {
                $(this).closest('tr').remove();
            }
        });
    });

    // DELETE SINGLE
    $('.action-delete').on('click', function () {
        $(this).closest('tr').remove();
    });

}