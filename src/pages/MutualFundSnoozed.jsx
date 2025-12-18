import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import Footer from "../components/Footer";
import Header from "../components/Header";
import Nav from "../components/Nav";
import '../assets/plugins/table/datatable/datatables.css';
import '../assets/css/forms/theme-checkbox-radio.css';
import '../assets/plugins/table/datatable/dt-global_style.css';
import '../assets/plugins/table/datatable/custom_dt_custom.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import Loader from "../components/Loader";


const MutualFundSnoozed = () => {
  const { token, user } = useContext(AuthContext);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    nseCode: '',
    bseCode: '',
    isin: '',
    sector: '',
    actionType: '',
    followUp: '',
    startFrom: '',
    description: '',
    status: true
  });

  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);

  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target;

    // Action Type checkboxes
    if (type === 'radio') {
      setForm(prev => ({ ...prev, [name]: value }));
      return;
    }

    // Status checkbox
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [id]: checked }));
      return;
    }

    setForm(prev => ({
      ...prev,
      [id.replace('c-', '')]: value
    }));
  };




  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = `${latitude},${longitude}`;
          setForm(prev => ({ ...prev, gmap: location }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const fetchAssignableUsers = async () => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/api/users/assignable`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const users = await response.json();
        setAssignableUsers(users);
      }
    } catch (err) {
      console.error('Error fetching assignable users:', err);
    }
  };

  const fetchMutualFundForEdit = async (id) => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/api/mutualfund/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) return false;

      const data = await response.json();
      const mutualFund = data.mutualFund;

      setForm({
        name: mutualFund.name || '',
        nseCode: mutualFund.nseCode || '',
        bseCode: mutualFund.bseCode || '',
        isin: mutualFund.isin || '',
        sector: mutualFund.sector || '',
        actionType: mutualFund.actionType || '',
        followUp: mutualFund.followUp || '',
        startFrom: mutualFund.startFrom
          ? new Date(mutualFund.startFrom).toISOString().slice(0, 10)
          : '',
        description: mutualFund.description || '',
        status: mutualFund.status ?? true
      });

      return true;
    } catch (err) {
      console.error('Error fetching mutualFund:', err);
      return false;
    }
  };


  // Update the edit button handler
  // $(document).on("click", ".edit-contact", function (e) {
  //   e.preventDefault();
  //   const contactId = $(this).data("id");
  //   console.log("Edit clicked → ID:", contactId);


  //   setEditingId(contactId);

  //   // Fetch data first, then open modal
  //   fetchContactForEdit(contactId).then(success => {
  //     if (success) {
  //       console.log('Data loaded, opening modal');
  //       setShowModal(true);
  //     }
  //   });
  // });

  const resetForm = () => {
    setForm({
      name: '',
      nseCode: '',
      bseCode: '',
      isin: '',
      sector: '',
      actionType: '',
      followUp: '',
      startFrom: '',
      description: '',
      status: true
    });
    setErrors({});
    setEditingId(null);
  };


  const handleSave = async () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      const url = editingId
        ? `${VITE_BASE_URL}/api/mutualfund/edit/${editingId}`
        : `${VITE_BASE_URL}/api/mutualfund/add`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Backend error:', err);
        throw new Error(err);
      }

      setShowModal(false);
      resetForm();
      $('#style-1').DataTable().ajax.reload();

    } catch (err) {
      console.error('Error saving mutualFund:', err);
    }
  };

  // Initialize modal when component mounts
  useEffect(() => {
    if (showModal) {
      // Fetch assignable users if admin
      if (user?.role === 'adm') {
        fetchAssignableUsers();
      }

      // Show modal using jQuery (since DataTable uses jQuery)
      $('#addContactModal').modal('show');

      // Handle modal hidden event
      $('#addContactModal').on('hidden.bs.modal', function () {
        resetForm();
        setShowModal(false);
      });

      // Cleanup event listener
      return () => {
        $('#addContactModal').off('hidden.bs.modal');
      };
    } else {
      // Hide the modal when showModal is false
      $('#addContactModal').modal('hide');
    }
  }, [showModal]);

  const initializeTooltips = () => {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      if (!el.getAttribute('data-bs-original-title')) {
        new bootstrap.Tooltip(el);
      }
    });
  };


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

  let selectedRowIds = new Set();


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

        const columnMap = {
          1: 'name',
          2: 'nseCode',
          3: 'bseCode',
          4: 'isin',
          5: 'sector',
          6: 'startFrom',
          7: 'description',
          8: 'crtdOn'
        };

        const defaultTypeFilter = 'snoozed';
        $('#medicine-filter').val(defaultTypeFilter);

        const c1 = $('#style-1').DataTable({
          processing: false,
          serverSide: true,
          order: [[8, 'desc']],
          columnDefs: [
            { orderable: false, targets: [0, 8] }
          ],
          pagingType: "simple_numbers",

          ajax: {
            url: `${VITE_BASE_URL}/api/mutualfund`,
            type: 'GET',
            data: function (d) {
              const columnIndex = d.order?.[0]?.column;
              const sortBy = columnMap[columnIndex] || 'crtdOn';
              const filterValue = $('#medicine-filter').val() || defaultTypeFilter;
              return {
                draw: d.draw,
                page: Math.floor(d.start / d.length) + 1,
                limit: d.length,
                search: d.search.value,
                sortBy,
                sortDir: d.order[0].dir,
                type: filterValue
              };
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            },
            drawCallback: function () {
              // Reinitialize tooltips after each table draw
              setTimeout(() => {
                initializeTooltips();
              }, 100);
            },
            dataSrc: function (json) {
              // Return data immediately, we'll fetch feedbacks async
              return json.data.map((mutualFund, index) => ({
                record: index + 1,
                name: mutualFund.name,
                nseCode: mutualFund.nseCode,
                bseCode: mutualFund.bseCode,
                isin: mutualFund.isin,
                sector: mutualFund.sector,
                startFrom: mutualFund.startFrom
                  ? new Date(mutualFund.startFrom).toLocaleDateString()
                  : '-',
                description: mutualFund.description
                  ? mutualFund.description.replace(/<[^>]*>?/gm, '')
                  : '',
                id: mutualFund._id
              }));
            }

          },
          columns: [
            {
              data: null,
              orderable: false,
              render: function (data, type, row) {
                return `
                  <label class="new-control new-checkbox checkbox-outline-primary m-auto">
                    <input 
                      type="checkbox" 
                      class="new-control-input child-chk"
                      data-id="${row.id}"
                    />
                    <span class="new-control-indicator"></span>
                  </label>
                `;
              }
            },
            { data: 'name' },
            { data: 'nseCode' },
            { data: 'bseCode' },
            { data: 'isin' },
            { data: 'sector' },
            { data: 'startFrom' },
            { data: 'description' },
            //  {
            //   data: 'description',
            //   render: function () {
            //     return `<span class="text-muted">Loading...</span>`;
            //   }
            // },
            {
              data: 'id',
              className: 'text-center',
              render: function (id, type, row) {
                return `<ul class="table-controls-cnt">
                  <li><a href="#" class="edit-contact" data-id="${id}" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 p-1 br-6 mb-1"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg></a></li>                 
                  <li><a href="#" class="delete-contact" data-id="${id}" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash p-1 br-6 mb-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a></li>
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
          dom: '<"row"<"col-md-6"B><"col-md-6 text-right customToggleBtns">> <"row mt-2"<"col-md-6"l><"col-md-6"f>> <"col-md-12"rt> <"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>>',
          buttons: [
            { extend: 'copy', className: 'btn btn-sm btn-primary' },
            { extend: 'csv', className: 'btn btn-sm btn-primary' },
            { extend: 'excel', className: 'btn btn-sm btn-primary' },
            { extend: 'print', className: 'btn btn-sm btn-primary' },
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
              className: 'btn btn-sm btn-primary',
              action: function (e, dt, node, config) {
                resetForm();
                setEditingId(null);
                setShowModal(true);
              }
            },
            {
              text: `
                <div class="action-btn">
                <svg 
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
                `,
              className: 'btn btn-sm btn-danger delete-multiple-btn',
              action: async function () {
                if (selectedRowIds.size === 0) {
                  // alert("No contacts selected");
                  return;
                }

                for (const id of selectedRowIds) {
                  await fetch(`${VITE_BASE_URL}/api/mutualfund/delete/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                  });
                }

                selectedRowIds.clear();
                $("#style-1").DataTable().ajax.reload(null, false);
              }
            }
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
          pageLength: 10,
          createdRow: function (row, data) {
            const description = data.description;
            if (!description) return;

            const cellIndex = 7; // adjust if needed
            const descCell = row.cells[cellIndex];
            if (!descCell) return;

            const maxLength = 40;
            const displayText =
              description.length > maxLength
                ? description.substring(0, maxLength) + '...'
                : description;

            const safeText = description.replace(/"/g, '&quot;');

            descCell.innerHTML = `
    <span
      class="inv-feedback bs-tooltip"
      data-bs-toggle="tooltip"
      data-bs-html="false"
      title="${safeText}"
      style="cursor: pointer"
    >
      ${displayText}
    </span>
  `;

            // 🔥 THIS IS THE IMPORTANT PART
            if (window.bootstrap && window.bootstrap.Tooltip) {
              new window.bootstrap.Tooltip(
                descCell.querySelector('[data-bs-toggle="tooltip"]')
              );
            }
          }

        });

        // Insert dropdown before search box
        // $('.dataTables_filter').prepend(`
        //   <select
        //     id="medicine-filter"
        //     class="form-control mr-2"
        //     style="width:150px; display:inline-block;"
        //   >
        //     <option value="">All</option>
        //     <option value="follow">Follow</option>
        //     <option value="wishlist">Wishlist</option>
        //     <option value="snoozed">Snoozed</option>
        //     <option value="other">Other</option>

        //   </select>
        // `);

        // Add change event for the filter dropdown
        $(document).on('change', '#medicine-filter', function () {
          // Trigger DataTable reload to apply filter
          c1.ajax.reload();
        });

        c1.on('preXhr.dt', function () {
          setLoading(true);
        });

        c1.on('xhr.dt', function () {
          setLoading(false);
        });

        $('#style-1').on('click', '.view-contact', function (e) {
          e.preventDefault();
          const contactId = $(this).data('id');
          navigate('/vwCntct', { state: { contactId } });
        });

        $(document).on("click", ".edit-contact", function (e) {
          e.preventDefault();
          const id = $(this).data("id");
          setEditingId(id);

          fetchMutualFundForEdit(id).then(success => {
            if (success) setShowModal(true);
          });
        });



        $(document).on("click", ".delete-contact", async function (e) {
          e.preventDefault();

          const id = $(this).data("id");
          console.log("Delete clicked → ID:", id);

          try {
            const response = await fetch(
              `${VITE_BASE_URL}/api/mutualfund/delete/${id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            console.log("Delete response status:", response.status);

            if (!response.ok) {
              const msg = await response.text();
              console.error("Delete error:", msg);
              return;
            }

            // Refresh DataTable (without losing current page)
            $("#style-1").DataTable().ajax.reload(null, false);

          } catch (error) {
            console.error("Delete failed:", error);
          }
        });

        // MULTIPLE DELETE — NO SWAL — INSTANT DELETE
        $(document).on("click", "#delete-multiple-btn-cnt", async function () {
          const table = $("#style-1").DataTable();

          // Collect selected row IDs
          const selectedIds = [];
          $("#style-1 tbody .child-chk:checked").each(function () {
            const row = $(this).closest("tr");
            const rowData = table.row(row).data();
            if (rowData?.id) {
              selectedIds.push(rowData.id);
            }
          });

          console.log("Selected IDs:", selectedIds);

          if (selectedIds.length === 0) {
            console.log("No contacts selected to delete.");
            return;
          }

          try {
            // Delete each selected ID
            for (let id of selectedIds) {
              await fetch(`${VITE_BASE_URL}/api/mutualfund/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            }

            // Reload table (keep page)
            table.ajax.reload(null, false);
            console.log("Multiple contacts deleted");

          } catch (error) {
            console.error("Multiple delete error:", error);
          }
        });

        $(document).on("change", ".chk-parent", function () {
          const checked = this.checked;

          $("#style-1 tbody .child-chk").each(function () {
            const id = $(this).data("id");
            $(this).prop("checked", checked);

            if (checked) {
              selectedRowIds.add(id);
            } else {
              selectedRowIds.delete(id);
            }
          });
        });


        $(document).on("change", ".child-chk", function () {
          const id = $(this).data("id");

          if (this.checked) {
            selectedRowIds.add(id);
          } else {
            selectedRowIds.delete(id);
          }

          // Update parent checkbox (current page only)
          const total = $("#style-1 tbody .child-chk").length;
          const checked = $("#style-1 tbody .child-chk:checked").length;

          $(".chk-parent").prop("checked", total > 0 && total === checked);
        });



        // Toggle buttons
        $('.customToggleBtns').html(`
          <div class="toggle-list d-inline-block">
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="1">Name</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="2">NSE</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="3">BSE</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="4">ISIN</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="5">Sector</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="6">Start From</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="7">Description</a>
          </div>
        `);

        $('a.toggle-vis').on('click', function (e) {
          e.preventDefault();
          var column = c1.column($(this).attr('data-column'));
          column.visible(!column.visible());
        });

        if (typeof multiCheck === 'function') multiCheck(c1);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    initializeTooltips();
  }, []);


  return (
    <div>
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
                        <h4>MutualFunds </h4>
                      </div>
                    </div>
                  </div>
                  <div className="widget-content widget-content-are">
                    <div className="table-responsive mb-4 style-1">
                      <table id="style-1" className="table style-1 style-3 table-hover">
                        <thead>
                          <tr>
                            <th className="checkbox-column"> Record no. </th>
                            <th>Name</th>
                            <th>NSE</th>
                            <th>BSE</th>
                            <th>ISIN</th>
                            <th>Sector</th>
                            <th>Start From</th>
                            <th>Description</th>
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
      {/* Add Contact Modal */}
      <div className="modal fade" id="addContactModal" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
          <div className="modal-content">
            <div className="modal-body">
              {/* <i className="flaticon-cancel-12 close" data-dismiss="modal" /> */}
              <i
                className="flaticon-cancel-12 close"
                onClick={() => setShowModal(false)}
                style={{ cursor: 'pointer' }}
              />
              <div className="add-contact-box">
                <div className="add-contact-content">
                  <form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input id="c-name" className="form-control" placeholder="Name"
                          value={form.name} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <input id="c-nseCode" className="form-control" placeholder="NSE Code"
                          value={form.nseCode} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input id="c-bseCode" className="form-control" placeholder="BSE Code"
                          value={form.bseCode} onChange={handleChange} />
                      </div>

                      <div className="col-md-6">
                        <input id="c-isin" className="form-control" placeholder="ISIN"
                          value={form.isin} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input id="c-sector" className="form-control" placeholder="Sector"
                          value={form.sector} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <select
                          id="c-followUp"
                          className="form-control"
                          value={form.followUp}
                          onChange={handleChange}
                        >
                          <option value="" hidden>-- Follow Up --</option>
                          <option value="30min">30 Minutes</option>
                          <option value="1hour">1 Hour</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="d-block mb-2">Action Type</label>

                        <div className="form-check form-check-primary form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="actionType"
                            id="action-follow"
                            value="follow"
                            checked={form.actionType === 'follow'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="action-follow">
                            Follow
                          </label>
                        </div>

                        <div className="form-check form-check-primary form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="actionType"
                            id="action-wishlist"
                            value="wishlist"
                            checked={form.actionType === 'wishlist'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="action-wishlist">
                            Wishlist
                          </label>
                        </div>

                        <div className="form-check form-check-primary form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="actionType"
                            id="action-snoozed"
                            value="snoozed"
                            checked={form.actionType === 'snoozed'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="action-snoozed">
                            Snoozed
                          </label>
                        </div>

                        <div className="form-check form-check-primary form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="actionType"
                            id="action-other"
                            value="other"
                            checked={form.actionType === 'other'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="action-other">
                            Other
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="d-block mb-2">Start From</label>

                        <input
                          type="date"
                          id="c-startFrom"
                          className="form-control"
                          value={form.startFrom}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label>Description</label>
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          <CKEditor
                            editor={ClassicEditor}
                            config={{ licenseKey: 'GPL' }}
                            data={form.description}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setForm(prev => ({ ...prev, description: data }));
                            }}
                          />
                        </div>

                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="new-control new-checkbox checkbox-outline-success">
                          <input
                            type="checkbox"
                            className="new-control-input"
                            id="status"
                            checked={form.status}
                            onChange={handleChange}
                          />
                          <span className="new-control-indicator"></span>
                          <span className="d-inline-block mt-2">Active</span>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {editingId ? (
                <>
                  <button id="btn-edit" className="float-left btn btn-primary" onClick={handleSave}>Save</button>
                  <button className="btn" onClick={() => setShowModal(false)}>Discard</button>
                </>
              ) : (
                <>
                  <button className="btn" onClick={() => setShowModal(false)} >Discard</button>
                  <button id="btn-add" className="btn btn-primary" onClick={handleSave}>Add</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MutualFundSnoozed;