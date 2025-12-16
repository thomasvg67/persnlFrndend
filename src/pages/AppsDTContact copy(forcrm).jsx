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


const AppsDTContact = () => {
  const { token, user } = useContext(AuthContext);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [feedbackCache, setFeedbackCache] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    ph: '',
    loc: '',
    occup: '',
    nxtAlrt: '',
    subject: '',
    assignedTo: '',
    gmap: '',
    fdback: '',
    audioFiles: [],
    newAudio: null
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({
      ...prev,
      [id.replace('c-', '')]: value
    }));

    // Clear error when user starts typing
    if (errors[id.replace('c-', '')]) {
      setErrors(prev => ({ ...prev, [id.replace('c-', '')]: false }));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, newAudio: file }));
    }
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

  const fetchContactForEdit = async (id) => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/api/contacts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log("API returned error status:", response.status);
        const data = await response.json();
        const contact = data.contact;

        // Format date for datetime-local input
        const nxtAlrt = contact.nxtAlrt
          ? new Date(contact.nxtAlrt).toISOString().slice(0, 16)
          : '';
        console.log("Form being set:", {
          name: contact.name,
          ph: contact.ph,
          audio: contact.audio
        });

        setForm({
          name: contact?.name || '',
          email: contact?.email || '',
          ph: contact?.ph || '',
          loc: contact?.loc || '',
          occup: contact?.occup || '',
          nxtAlrt: contact?.nxtAlrt
            ? new Date(contact.nxtAlrt).toISOString().slice(0, 16)
            : '',
          subject: contact?.subject || '',
          assignedTo: contact?.assignedTo || '',
          gmap: contact?.gmap || '',
          fdback: '',
          audioFiles: contact?.audio || [],
          newAudio: null
        });


        // Fetch feedbacks for this contact
        await fetchFeedbacks(id);

        // Return true to indicate success
        return true;
      }

      const data = await response.json();

      if (!data.contact) {
        console.log("No contact returned");
        return;
      }
    } catch (err) {
      console.error('Error fetching contact:', err);
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

  const fetchFeedbacks = async (contactId) => {
    try {
      const response = await fetch(`${VITE_BASE_URL}/api/feedbacks/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const feedbacks = await response.json();
        setFeedbacks(feedbacks);
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      ph: '',
      loc: '',
      occup: '',
      nxtAlrt: '',
      subject: '',
      assignedTo: '',
      gmap: '',
      fdback: '',
      audioFiles: [],
      newAudio: null
    });
    setErrors({});
    setEditingId(null);
    setFeedbacks([]);
  };

  const handleSave = async () => {
    // Validate form
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.ph.trim()) newErrors.ph = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(form).forEach(key => {
        if (key !== 'newAudio' && key !== 'audioFiles') {
          formData.append(key, form[key] || '');
        }
      });

      // Append audio file if exists
      if (form.newAudio) {
        formData.append('audioFile', form.newAudio);
      }

      const url = editingId
        ? `${VITE_BASE_URL}/api/contacts/edit/${editingId}`
        : `${VITE_BASE_URL}/api/contacts/add`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        // Close modal and reload data
        // $('#addContactModal').modal('hide');
        setShowModal(false);
        resetForm();

        // Reload DataTable
        const table = $('#style-1').DataTable();
        table.ajax.reload();

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: editingId ? 'Contact updated successfully!' : 'Contact added successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        throw new Error('Failed to save contact');
      }
    } catch (err) {
      console.error('Error saving contact:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save contact. Please try again.',
      });
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
    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipElements.forEach(el => {
      // Check if tooltip is already initialized
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

  const fetchFeedbackForContact = async (contactId) => {
    if (feedbackCache[contactId]) {
      return feedbackCache[contactId];
    }

    try {
      const response = await fetch(`${VITE_BASE_URL}/api/feedbacks/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) return null;
      const feedbacks = await response.json();

      // Get latest feedback
      const latestFeedback = feedbacks.length > 0 ? feedbacks[0].fdback : null;

      // Update cache
      setFeedbackCache(prev => ({
        ...prev,
        [contactId]: latestFeedback
      }));

      return latestFeedback;
    } catch (err) {
      console.error('Error fetching feedback:', err);
      return null;
    }
  };

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
          2: 'email',
          3: 'ph',
          4: 'loc',
          5: null,
          6: null,
          7: 'crtdOn',
          8: null
        };

        // $.fn.dataTable.ext.pager.numbers_length = 3;

        //         $.fn.dataTable.ext.pager.simple_numbers = function (page, pages) {
        //   const numbers = [];
        //   const start = Math.max(page - 1, 0);
        //   const end = Math.min(page + 2, pages);

        //   for (let i = start; i < end; i++) {
        //     numbers.push(i);
        //   }

        //   return ['previous', numbers, 'next'];
        // };


        const c1 = $('#style-1').DataTable({
          processing: false,
          serverSide: true,
          order: [[7, 'desc']],
          columnDefs: [
            { orderable: false, targets: [0, 5, 6, 8] }
          ],
          pagingType: "simple_numbers",

          ajax: {
            url: `${VITE_BASE_URL}/api/contacts`,
            type: 'GET',
            data: function (d) {
              const columnIndex = d.order?.[0]?.column;
              const sortBy = columnMap[columnIndex] || 'crtdOn';
              return {
                draw: d.draw,
                page: Math.floor(d.start / d.length) + 1,
                limit: d.length,
                search: d.search.value,
                sortBy,
                sortDir: d.order[0].dir
              };
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            },
            drawCallback: function (settings) {
              // Reinitialize tooltips after each table draw
              setTimeout(() => {
                initializeTooltips();
              }, 100);
            },
            dataSrc: function (json) {
              // Return data immediately, we'll fetch feedbacks async
              return json.contacts.map((contact, index) => ({
                record: index + 1,
                name: contact.name,
                email: contact.email,
                ph: contact.ph,
                location: contact.loc,
                audio: contact.audio || [], // Make sure audio is included
                feedback: 'Loading...', // Placeholder
                nxtAlrt: contact.nxtAlrt ? new Date(contact.nxtAlrt).toLocaleDateString() : 'No Alert',
                id: contact._id,
                gmap: contact.gmap
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
            {
              data: 'name',
              render: function (data, type, row) {
                const initials = data ? data.charAt(0).toUpperCase() : 'C';
                const colors = ['primary', 'success', 'danger', 'warning', 'info'];
                const colorIndex = row.id ? row.id.charCodeAt(row.id.length - 1) % colors.length : 0;
                return `<div class="d-flex align-items-center">
                  <div class="avatar avatar-${colors[colorIndex]} me-3">
                  </div>
                  <div>
                    <h6 class="mb-0">${data || 'No Name'}</h6>
                  </div>
                </div>`;
              }
            },
            { data: 'email' },
            { data: 'ph' },
            // { data: 'location' },
            {
              data: 'location',
              render: function (data, type, row) {
                if (data && row.gmap) {
                  // Both loc and gmap present
                  return `<a href="https://www.google.com/maps?q=${encodeURIComponent(row.gmap)}" 
                             target="_blank" rel="noopener noreferrer"
                             style="color:#4361ee;text-decoration:underline;">
                            ${data}
                          </a>`;
                } else if (data) {
                  // Only loc text available
                  return data;
                } else if (row.gmap) {
                  // Only gmap coordinates available
                  return `<a href="https://www.google.com/maps?q=${encodeURIComponent(row.gmap)}" 
                             target="_blank" rel="noopener noreferrer"
                             style="color:#4361ee;text-decoration:underline;">
                            Location
                          </a>`;
                } else {
                  return '-';
                }
              }
            },
            {
              data: 'audio',
              className: 'text-center',
              render: function (data, type, row) {
                // Debug log to check data
                console.log('Audio data for row:', row.id, data);

                if (data && Array.isArray(data) && data.length > 0 && data[0].file) {
                  const latestAudio = data[data.length - 1];
                  // const audioUrl = `${VITE_BASE_URL}/uploads/${latestAudio.file}`;
                  const audioUrl = `${VITE_BASE_URL}/uploads/audio/${latestAudio.file}`;
                  const audioId = `audio-${row.id.replace(/[^a-zA-Z0-9]/g, '')}`;
                  return `
                    <div class="audio-player-container" style="max-width: 150px; margin: 0 auto;">
                      <audio id="${audioId}" controls style="width: 100%; height: 35px;">
                        <source src="${audioUrl}" type="audio/mpeg">
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  `;
                }
                return `<span class="text-muted">No Audio</span>`;
              }
            },
            {
              data: 'feedback',
              render: function (data, type, row) {
                // Format feedback text (max 15 chars with ellipsis)
                let displayText = 'No Feedback';
                if (data && data !== 'Loading...') {
                  if (data.length > 15) {
                    displayText = data.substring(0, 15) + '...';
                  } else {
                    displayText = data;
                  }
                } else if (data === 'Loading...') {
                  displayText = '<span class="text-muted">Loading...</span>';
                }
                return `<div title="${data && data !== 'Loading...' ? data : ''}">${displayText}</div>`;
              }
            },
            {
              data: 'nxtAlrt',
              render: function (data) {
                return data;
              }
            },
            {
              data: 'id',
              className: 'text-center',
              render: function (id, type, row) {
                return `<ul class="table-controls">
                  <li><a href="#" class="edit-contact" data-id="${id}" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 p-1 br-6 mb-1"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></a></li>                 
                  <li><a href="#" class="delete-contact" data-id="${id}" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash p-1 br-6 mb-1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a></li>
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
                  await fetch(`${VITE_BASE_URL}/api/contacts/delete/${id}`, {
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
          createdRow: function (row, data, dataIndex) {
            // Fetch feedback for this row after it's created
            if (data.id) {
              fetchFeedbackForContact(data.id).then(feedback => {
                if (feedback) {
                  // Update the cell with the feedback
                  const api = c1;
                  const rowNode = api.row(row).node();
                  if (rowNode) {
                    const feedbackCell = rowNode.cells[6]; // 7th column for feedback (0-indexed)
                    if (feedbackCell) {
                      let displayText = 'No Feedback';
                      if (feedback.length > 15) {
                        displayText = feedback.substring(0, 15) + '...';
                      } else {
                        displayText = feedback;
                      }

                      // Create span with tooltip attributes
                      function stripHtml(html) {
                        const tmp = document.createElement("div");
                        tmp.innerHTML = html;
                        return tmp.textContent || tmp.innerText || "";
                      }

                      const cleanFeedback = stripHtml(feedback);

                      feedbackCell.innerHTML = `
                        <span 
                          class="inv-feedback bs-tooltip"
                          data-bs-toggle="tooltip" 
                          data-bs-html="false"
                          title="${cleanFeedback.replace(/"/g, '&quot;')}"
                          style="cursor: pointer"
                        >
                          ${displayText}
                        </span>
                        `;


                      // Initialize tooltip for this specific element
                      if (window.bootstrap && window.bootstrap.Tooltip) {
                        new window.bootstrap.Tooltip(feedbackCell.querySelector('[data-bs-toggle="tooltip"]'));
                      }
                    }
                  }
                } else {
                  // Update to show "No Feedback" if null
                  const api = c1;
                  const rowNode = api.row(row).node();
                  if (rowNode) {
                    const feedbackCell = rowNode.cells[6];
                    if (feedbackCell) {
                      feedbackCell.innerHTML = `<div>No Feedback</div>`;
                    }
                  }
                }
              });
            }
          }
        });

        // Insert dropdown before search box
        $('.dataTables_filter').prepend(`
          <select
            id="medicine-filter"
            class="form-control mr-2"
            style="width:150px; display:inline-block;"
          >
            <option value="">All</option>
            <option value="Relatives">Relatives</option>
            <option value="Friends">Friends</option>
            <option value="Close Friends">Close Friends</option>
            <option value="Close Relatives">Close Relatives</option>
            <option value="Business">Business</option>
            <option value="Mentors">Mentors</option>
            <option value="Inspirators">Inspirators</option>
            <option value="Others">Others</option>

          </select>
        `);


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

        // $('#style-1').on('click', '.edit-contact', function (e) {
        //   e.preventDefault();
        //   const contactId = $(this).data('id');
        //   setEditingId(contactId);
        //   fetchContactForEdit(contactId);
        //   setShowModal(true);
        // });

        $(document).on("click", ".edit-contact", function (e) {
          e.preventDefault();
          const contactId = $(this).data("id");
          setEditingId(contactId);

          fetchContactForEdit(contactId).then(success => {
            if (success) {
              setShowModal(true); // open modal only after data is loaded
            }
          });
        });


        $(document).on("click", ".delete-contact", async function (e) {
          e.preventDefault();

          const id = $(this).data("id");
          console.log("Delete clicked → ID:", id);

          try {
            const response = await fetch(
              `${VITE_BASE_URL}/api/contacts/delete/${id}`,
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
              await fetch(`${VITE_BASE_URL}/api/contacts/delete/${id}`, {
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
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="2">Email</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="3">Phone</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="4">Location</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="5">Audio</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="6">Feedback</a>
            <a class="btn btn-sm btn-primary toggle-vis ml-2 mb-2" data-column="7">Next Alert</a>
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
                        <h4>Contacts List</h4>
                      </div>
                    </div>
                  </div>
                  <div className="widget-content widget-content-area">
                    <div className="table-responsive mb-4 style-1">
                      <table id="style-1" className="table style-1 style-3 table-hover">
                        <thead>
                          <tr>
                            <th className="checkbox-column"> Record no. </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th className="text-center">Audio</th>
                            <th>Feedback</th>
                            <th>Next Alert</th>
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
                        <div className="contact-name">
                          <i className="flaticon-user-11" />
                          <input
                            type="text"
                            id="c-name"
                            className={`form-control ${errors.name ? 'border border-danger' : ''}`}
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                          />
                          <small id="error-name" className={`text-danger ${errors.name ? '' : 'd-none'}`}>Name is required</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="contact-email">
                          <i className="flaticon-mail-26" />
                          <input
                            type="text"
                            id="c-email"
                            className="form-control"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                          />
                          <small id="error-email" className="text-danger d-none">Email is required</small>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="contact-occupation">
                          <i className="flaticon-fill-area" />
                          <input
                            type="text"
                            id="c-occup"
                            className="form-control"
                            placeholder="Occupation"
                            value={form.occup}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="contact-phone">
                          <i className="flaticon-telephone" />
                          <input
                            type="text"
                            id="c-ph"
                            className={`form-control ${errors.ph ? 'border border-danger' : ''}`}
                            placeholder="Phone"
                            value={form.ph}
                            onChange={handleChange}
                          />
                          <small id="error-phone" className={`text-danger ${errors.ph ? '' : 'd-none'}`}>Phone number is required</small>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="contact-location">
                          <i className="flaticon-location-1" />
                          <input
                            type="text"
                            id="c-loc"
                            className="form-control"
                            placeholder="Location"
                            value={form.loc}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="contact-next-alert">
                          <i className="flaticon-calendar" />
                          <input
                            type="datetime-local"
                            id="c-nxtAlrt"
                            className="form-control"
                            value={form.nxtAlrt}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="contact-subject">
                          <i className="flaticon-edit" />
                          <input
                            type="text"
                            id="c-subject"
                            className="form-control"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {user?.role === 'adm' && (
                        <div className="col-md-6">
                          <div className="contact-assigned-to">
                            <i className="flaticon-user-11" />
                            <select
                              id="c-assignedTo"
                              className="form-control"
                              value={form.assignedTo}
                              onChange={handleChange}
                            >
                              <option value="">-- Select Assigned User --</option>
                              {assignableUsers.map((u) => (
                                <option key={u.uId} value={u.uId}>
                                  {u.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="contact-gmap">
                          <i className="flaticon-map" />
                          <input
                            type="text"
                            id="c-gmap"
                            className="form-control"
                            placeholder="Google Map Location (click to select)"
                            value={form.gmap || ""}
                            onChange={handleChange}
                            onClick={handleGetLocation}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        {form.gmap && (
                          <div className="mt-2 contact-location-link" style={{ textAlign: "left" }}>
                            <i className="flaticon-link" />
                            <a
                              href={`https://www.google.com/maps?q=${encodeURIComponent(form.gmap)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: "16px", color: "#4361ee" }}
                            >
                              View Location on Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="contact-audio">
                          <i className="flaticon-music" />
                          <p style={{ textAlign: "left" }}>Select Audio</p>
                          <input
                            type="file"
                            name="audioFile"
                            id="c-audio"
                            className="form-control"
                            accept="audio/*"
                            onChange={handleAudioChange}
                          />
                          {form.newAudio && (
                            <audio
                              key={form.newAudio.name + form.newAudio.size}
                              controls
                              style={{ width: "100%" }}
                            >
                              <source src={URL.createObjectURL(form.newAudio)} />
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </div>
                      </div>
                    </div>
                    {Array.isArray(form.audioFiles) && form.audioFiles.length > 0 && (
                      <div className="row mt-3">
                        {form.audioFiles
                          .filter(item => item.file)
                          .slice()
                          .reverse()
                          .map((item, index) => (
                            <div className="col-md-2 mb-3" key={index}>
                              <audio controls style={{ width: "100%" }}>
                                <source src={`${VITE_BASE_URL}/uploads/audio/${item.file}`} />
                                Your browser does not support the audio element.
                              </audio>
                              <div style={{ fontSize: "12px", textAlign: "center", marginTop: "4px" }}>
                                {new Date(item.uploadedOn).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    <div className="row">
                      <div className="col-md-12">
                        <div className="contact-review mb-3">
                          <i className="flaticon-chat" />
                          <div style={{ height: '200px', overflow: 'hidden' }}>
                            <CKEditor
                              editor={ClassicEditor}
                              config={{
                                licenseKey: 'GPL',
                              }}
                              data={form.fdback}
                              onChange={(event, editor) => {
                                const data = editor.getData();
                                setForm((prev) => ({ ...prev, fdback: data }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  {editingId && feedbacks.length > 0 && (
                    <div className="mt-3">
                      <h6 style={{ textAlign: 'left' }}>Previous Feedbacks 📝</h6>
                      <div
                        className="feedback-list"
                        style={{
                          textAlign: 'left',
                          maxHeight: '150px',
                          overflowY: 'auto'
                        }}
                      >
                        {feedbacks.map(fb => (
                          <div key={fb._id} className="mb-1 border-bottom pb-1">
                            <small className="text-muted d-block">{new Date(fb.crtdOn).toLocaleString()}</small>
                            <div className="mb-0" dangerouslySetInnerHTML={{ __html: fb.fdback }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {editingId ? (
                <>
                  <button id="btn-edit" className="float-left btn btn-primary" onClick={handleSave}>Save</button>
                  {/* <button className="btn" data-dismiss="modal">Discard</button> */}
                  <button className="btn" onClick={() => setShowModal(false)}>Discard</button>
                </>
              ) : (
                <>
                  {/* <button className="btn" data-dismiss="modal">Discard</button> */}
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

export default AppsDTContact;