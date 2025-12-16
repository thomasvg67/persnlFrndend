import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Footer from "../components/Footer";
import Header from "../components/Header";
import Nav from "../components/Nav";
import '../assets/plugins/table/datatable/datatables.css';
import '../assets/css/forms/theme-checkbox-radio.css';
import '../assets/plugins/table/datatable/dt-global_style.css';
import '../assets/plugins/table/datatable/custom_dt_custom.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import Loader from "../components/Loader";


const AppsDTCustom = () => {
  const { token } = useContext(AuthContext);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  const hasLoaded = useRef(false);
  function loadScript(src, options = {}) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;

      // Options for loading behavior
      if (options.async) script.async = true;
      if (options.defer) script.defer = true;

      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to load ${src}`));

      document.body.appendChild(script);
    });
  }

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    (async () => {
      try {
        await loadScript('/plugins/table/datatable/datatables.js');
        await loadScript('/plugins/table/datatable/button-ext/dataTables.buttons.min.js');
        await loadScript('/plugins/table/datatable/button-ext/jszip.min.js');
        await loadScript('/plugins/table/datatable/button-ext/buttons.html5.min.js');
        await loadScript('/plugins/table/datatable/button-ext/buttons.print.min.js');

        const $ = window.$; // jQuery must be globally available

        const c1 = $('#style-1').DataTable({
          processing: false,
          serverSide: true,
          order: [[7, 'desc']],
          ajax: {
            url: `${VITE_BASE_URL}/api/users/paginated`,
            type: 'GET',
            data: function (d) {
              // d.search.value contains the search string
              return {
                draw: d.draw,
                page: Math.floor(d.start / d.length) + 1, // DataTables uses start index
                limit: d.length,
                search: d.search.value,
                sortBy: d.columns[d.order[0].column].data,
                sortDir: d.order[0].dir
              };
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            },
            dataSrc: function (json) {
              return json.data.map((user, index) => ({
                record: index + 1,
                name: user.name,
                customers: user.avtr,
                email: user.email,
                ph: user.ph,
                job: user.job,
                sts: user.sts,
                uId: user.uId
              }));
            }

          },
          columns: [
            {
              data: null,
              orderable: false,
              render: () => `<label class="new-control new-checkbox checkbox-outline-primary m-auto">
                      <input type="checkbox" class="new-control-input child-chk select-customers-info" />
                      <span class="new-control-indicator"></span>
                    </label>`
            },
            {
              data: 'customers',
              render: function (data) {
                const imageUrl = data ? `${VITE_BASE_URL}${data}` : 'assets/img/90x90.jpg';
                return `<a class="profile-img" href="javascript:void(0);"><img src="${imageUrl}"  alt="product" /></a>`;
              }
            },
            { data: 'name' },
            { data: 'email' },
            { data: 'ph' },
            { data: 'job' },
            {
              data: 'sts',
              className: 'text-center',
              render: function (data) {
                if (data === 1 ) {
                  return `<span class="btn btn-primary">Approved</span>`;
                } else if (data === 0 ) {
                  return `<span class="btn btn-warning">Pending</span>`;
                } else {
                  return `<span class="btn btn-danger">Suspended</span>`;
                }
              }

            }
            ,
            {
              data: 'uId',
              className: 'text-center',
              render: function (id) {
                return `<ul class="table-controls">
                  <li><a href="#" class="view-user" data-id="${id}" title="View"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye p-1 br-6 mb-1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></a></li>
                  <li><a href="#" class="edit-user" data-id="${id}" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 p-1 br-6 mb-1"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></a></li>                 
                  <li><a href="#" class="delete-user" data-id="${id}" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash p-1 br-6 mb-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a></li>
                </ul>`;
              }
            }
          ],
          headerCallback: function (e) {
            e.getElementsByTagName("th")[0].innerHTML = `
            <label class="new-control new-checkbox checkbox-outline-primary m-auto">
              <input type="checkbox" class="new-control-input chk-parent select-customers-info" id="customer-all-info">
              <span class="new-control-indicator"></span><span style="visibility:hidden">c</span>
            </label>`;
          },
          // columnDefs: [
          //   {
          //     targets: 0,
          //     width: "30px",
          //     orderable: false,
          //     render: () => `
          //     <label class="new-control new-checkbox checkbox-outline-primary m-auto">
          //       <input type="checkbox" class="new-control-input child-chk select-customers-info" >
          //       <span class="new-control-indicator"></span><span style="visibility:hidden">c</span>
          //     </label>`
          //   }
          // ],
          dom: '<"row"<"col-md-6"B><"col-md-6 text-right customToggleBtns">> <"row mt-2"<"col-md-6"l><"col-md-6"f>> <"col-md-12"rt> <"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>>',
          buttons: [
            { extend: 'copy', className: 'btn btn-sm btn-primary' },
            { extend: 'csv', className: 'btn btn-sm btn-primary' },
            { extend: 'excel', className: 'btn btn-sm btn-primary' },
            { extend: 'print', className: 'btn btn-sm btn-primary' }
          ],
          oLanguage: {
            oPaginate: {
              sPrevious: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
              sNext: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`
            },
            sInfo: "Showing page _PAGE_ of _PAGES_",
            sSearch: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
            sSearchPlaceholder: "Search...",
            sLengthMenu: "Results :  _MENU_"
          },
          stripeClasses: [],
          lengthMenu: [10, 20, 50],
          pageLength: 10
        });

        c1.on('preXhr.dt', function () {
  setLoading(true);
});
c1.on('xhr.dt', function () {
  setLoading(false);
});


        $('#style-1').on('click', '.view-user', function (e) {
          e.preventDefault();
          const userId = $(this).data('id');

          // Navigate to /prfl with user ID passed in router state
          navigate('/vwUsr', { state: { uId: userId } });
        });

        $('#style-1').on('click', '.edit-user', function (e) {
          e.preventDefault();
          const userId = $(this).data('id');

          // Navigate to /sttgs and pass the user ID as state
          navigate('/edtUsr', { state: { uId: userId } });
        });

        $(document).on('click', '.delete-user', function (e) {
          e.preventDefault();
          const userId = $(this).data('id');

          const swalWithBootstrapButtons = Swal.mixin({
            confirmButtonClass: 'btn btn-success btn-rounded',
            cancelButtonClass: 'btn btn-danger btn-rounded',
            buttonsStyling: false
          });

          swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning', // ✅ valid in older versions
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            padding: '2em'
          }).then((result) => {
            if (result.value) {
              // ✅ old SweetAlert2 uses result.value for confirm
              fetch(`${VITE_BASE_URL}/api/users/${userId}/delete`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  dltSts: '1',
                  dltOn: new Date().toISOString(),
                  dltBy: 'admin',
                  dltIp: '127.0.0.1'
                })
              })
                .then(res => {
                  if (!res.ok) throw new Error('Delete request failed');
                  return res.json();
                })
                .then(() => {
                  swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'User has been marked as deleted.',
                    'success'
                  );
                  $('#style-1').DataTable().ajax.reload();
                })
                .catch(err => {
                  console.error('Delete failed:', err);
                  Swal.fire('Error', 'Failed to delete user', 'error');
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              swalWithBootstrapButtons.fire(
                'Cancelled',
                'User deletion cancelled :)',
                'error'
              );
            }
          });
        });




        // Toggle buttons
        $('.customToggleBtns').html(`
        <div class="toggle-list d-inline-block">
          <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="1">Customers</a>
          <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="2">Name</a>
          <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="3">Email</a>
          <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="4">Contact</a>
          <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="5">Profession</a>

        </div>
      `);

        $('a.toggle-vis').on('click', function (e) {
          e.preventDefault();
          var column = c1.column($(this).attr('data-column'));
          column.visible(!column.visible());
        });

        // Optional: If you have `multiCheck` defined, call it here
        if (typeof multiCheck === 'function') multiCheck(c1);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);


  return (
    <div className="alt-menu sidebar-noneoverflow">
      {loading && (<Loader />)}

      <Navbar />
      <div className="main-container sidebar-closed sbar-open" id="container">
        <div className="overlay"></div>
        <div className="search-overlay"></div>
        <Sidebar />

        <div id="content" className="main-content">
          <div className="layout-px-spacing">


            <div className="row layout-spacing">
              <div className="col-lg-12">
                <div className="statbox widget box box-shadow">
                  <div className="widget-header">
                    <div className="row">
                      <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                        <h4>Users List</h4>
                      </div>
                    </div>
                  </div>
                  <div className="widget-content widget-content-area">
                    <div className="table-responsive mb-4 style-1">
                      <table id="style-1" className="table style-1 style-3 table-hover">
                        <thead>
                          <tr>
                            <th className="checkbox-column"> Record no. </th>
                            <th>Customers</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Profession</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>

                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
      {/* <Footer/> */}
      <Footer />
    </div>

  )
}

export default AppsDTCustom;