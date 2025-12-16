// var e;
c1 = $('#style-1').DataTable({
    headerCallback:function(e, a, t, n, s) {
        e.getElementsByTagName("th")[0].innerHTML='<label class="new-control new-checkbox checkbox-outline-primary m-auto">\n<input type="checkbox" class="new-control-input chk-parent select-customers-info" id="customer-all-info">\n<span class="new-control-indicator"></span><span style="visibility:hidden">c</span>\n</label>'
    },
    columnDefs:[ {
        targets:0, width:"30px", className:"", orderable:!1, render:function(e, a, t, n) {
            return'<label class="new-control new-checkbox checkbox-outline-primary  m-auto">\n<input type="checkbox" class="new-control-input child-chk select-customers-info" id="customer-all-info">\n<span class="new-control-indicator"></span><span style="visibility:hidden">c</span>\n</label>'
        }
    }],
//  dom: '<"row"<"col-md-12"l<"row"<"col-md-6"B><"col-md-6"f> > ><"col-md-12"rt> <"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>> >',
    dom: '<"row"<"col-md-6"l><"col-md-6"f> > <"row"<"col-md-6"B><"col-md-6 text-right customToggleBtns"> > <"col-md-12"rt> <"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>> >',
    buttons: {
        buttons: [
            { extend: 'copy', className: 'btn btn-sm btn-primary' },
            { extend: 'csv', className: 'btn btn-sm btn-primary' },
            { extend: 'excel', className: 'btn btn-sm btn-primary' },
            { extend: 'print', className: 'btn btn-sm btn-primary' }
        ]
    },
    "oLanguage": {
        "oPaginate": { "sPrevious": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' },
        "sInfo": "Showing page _PAGE_ of _PAGES_",
        "sSearch": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        "sSearchPlaceholder": "Search...",
        "sLengthMenu": "Results :  _MENU_",
    },
    "stripeClasses": [],
    "lengthMenu": [5, 10, 20, 50],
    "pageLength": 5,
});

multiCheck(c1);

$('.customToggleBtns').html(`
    <div class="toggle-list d-inline-block">
        <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="1">Name</a>
        <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="2">Customers</a>
        <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="3">Email</a>
        <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="4">Contact</a>
    </div>
`);

$('a.toggle-vis').on( 'click', function (e) {
    e.preventDefault(); 
    // Get the column API object
    var column = c1.column( $(this).attr('data-column') );
    // Toggle the visibility
    column.visible( ! column.visible() );
} );