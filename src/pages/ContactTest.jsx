import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import '../assets/plugins/table/datatable/datatables.css';
import '../assets/css/forms/theme-checkbox-radio.css';
import '../assets/plugins/table/datatable/dt-global_style.css';
import '../assets/plugins/table/datatable/custom_dt_custom.css';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const ContactTest = () => {

    useEffect(() => {
        // Dynamically load the external JS file
        const script = document.createElement('script');
        script.src = '/assets/js/apps/invoice-list.js'; // Adjust path as needed
        script.async = true;

        document.body.appendChild(script);

        setTimeout(() => {
            $('#btnDoc').on('click', handleExportDoc);
            $('#btnExcel').on('click', handleExportExcel);
            $('#btnPdf').on('click', handleExportPdf);
            $('#btnPrint').on('click', handlePrint);
        }, 500);

        const handleOpenModal = () => {
            setForm({ name: '', email: '', occup: '', ph: '', loc: '', fdback: '', nxtAlrt: '', subject: '', assignedTo: '', gmap: '', audio: null });
            setEditingId(null);
            setErrors({});
            window.$('#addContactModal').modal('show');
        };

        window.addEventListener('open-add-contact-modal', handleOpenModal);

        return () => {
            // Cleanup
            window.removeEventListener('open-add-contact-modal', handleOpenModal);
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
  const tooltipList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipList.forEach((el) => new bootstrap.Tooltip(el));
}, []);


    const [contacts, setContacts] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', occup: '', ph: '', loc: '', fdback: '', nxtAlrt: '', subject: '', assignedTo: '', gmap: '', audio: null });
    const [editingId, setEditingId] = useState(null);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbacksMap, setFeedbacksMap] = useState({});
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalContacts, setTotalContacts] = useState(0);
    const [viewMode, setViewMode] = useState('list');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [operationLoading, setOperationLoading] = useState(false);
    const currentContacts = contacts;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);

    const { user } = useContext(AuthContext);


    const handleChange = (e) => {
        const key = e.target.id.split('-')[1];
        setForm({ ...form, [key]: e.target.value });
    };

    const handleAudioChange = (e) => {
        console.log(e.target.name);
        console.log(e.target.files);
        const file = e.target.files[0];
        if (file) {
            setForm((prev) => ({
                ...prev,
                newAudio: e.target.files[0]
            }));

        }
    };

    const handleSave = () => {

        const newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.ph.trim()) newErrors.ph = "Phone number is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const finalForm = {
            ...form,
            assignedTo: editingId
                ? form.assignedTo
                : user.role !== 'adm'
                    ? user._id
                    : form.assignedTo
        };

        const url = editingId
            ? `${VITE_BASE_URL}/api/contacts/edit/${editingId}`
            : `${VITE_BASE_URL}/api/contacts/add`;
        const method = editingId ? 'put' : 'post';

        const formData = new FormData();

        // put all form fields in
        for (const key in finalForm) {
            if (
                finalForm[key] !== undefined &&
                finalForm[key] !== null &&
                key !== 'audio' &&
                key !== 'audioFiles' &&
                key !== 'newAudio'
            ) {
                formData.append(key, finalForm[key]);
            }
        }


        // append *audio file* correctly
        if (form.newAudio) {
            formData.append("audioFile", form.newAudio);
        }

        setOperationLoading(true);
        axios({
            method,
            url,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                if (editingId) {
                    setContacts(contacts.map((c) => (c._id === editingId ? res.data : c)));
                    toast.success('Contact updated successfully!');
                } else {
                    setContacts([...contacts, res.data]);
                    toast.success('Contact added successfully!');
                }
                if (form.fdback?.trim()) {
                    const newReview = {
                        _id: Date.now().toString(),
                        fdback: form.fdback,
                        crtdOn: new Date(),
                        crtdBy: 'You'
                    };
                    setFeedbacks((prev) => [newReview, ...prev]);
                }
                setForm((prev) => ({
                    ...prev,
                    fdback: "",
                    newAudio: null
                }));
                setEditingId(null);
                window.$('#addContactModal').modal('hide');
                window.dispatchEvent(new CustomEvent('contact-saved', { detail: editingId }));
            })
            .catch((err) => {
                console.error(err);
                toast.error('Failed to save contact');
            })
            .finally(() => setOperationLoading(false));
    };


    const handleExportDoc = () => {
        let html = `
        <h2>Contact List</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">
          <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Occupation</th>
            <th>Location</th>
            <th>Next Alert</th>
            <th>Subject</th>
            <th>Assigned To</th>
            <th>Feedback</th>
          </tr>
          </thead>
          <tbody>
          ${currentContacts.map(contact => `
            <tr>
              <td>${contact.name}</td>
              <td>${contact.email}</td>
              <td>${contact.ph}</td>
              <td>${contact.occup || '-'}</td>
              <td>${contact.loc || '-'}</td>
              <td>${contact.nxtAlrt ? new Date(contact.nxtAlrt).toLocaleString() : '-'}</td>
              <td>${contact.subject || '-'}</td>
              <td>${assignableUsers.find(u => u.uId === contact.assignedTo)?.name || '-'}</td>
              <td>${stripHtml(feedbacksMap[contact._id] || '-').slice(0, 200)}</td>
            </tr>
          `).join('')}
          </tbody>
        </table>
      `;

        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Contacts.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const data = currentContacts.map(contact => ({
            Name: contact.name,
            Email: contact.email,
            Phone: contact.ph,
            Occupation: contact.occup || '-',
            Location: contact.loc || '-',
            NextAlert: contact.nxtAlrt ? new Date(contact.nxtAlrt).toLocaleString() : '-',
            Subject: contact.subject || '-',
            AssignedTo: assignableUsers.find(u => u.uId === contact.assignedTo)?.name || '-',
            Feedback: stripHtml(feedbacksMap[contact._id] || '-').slice(0, 200)
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

        XLSX.writeFile(workbook, 'Contacts.xlsx');
    };

    const handleExportPdf = () => {
        import("jspdf").then(({ default: jsPDF }) => {
            const doc = new jsPDF();

            doc.setFontSize(16);
            doc.text("Contacts Report", 105, 15, { align: "center" });
            doc.setLineWidth(0.5);
            doc.line(10, 20, 200, 20);

            let y = 30;
            doc.setFontSize(10);

            currentContacts.forEach((c, idx) => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFont(undefined, "bold");
                doc.text(`Contact #${idx + 1}`, 10, y);
                y += 6;

                doc.setFont(undefined, "normal");
                doc.text(`Name: ${c.name}`, 10, y);
                y += 5;
                doc.text(`Email: ${c.email}`, 10, y);
                y += 5;
                doc.text(`Phone: ${c.ph}`, 10, y);
                y += 5;
                doc.text(`Occupation: ${c.occup || '-'}`, 10, y);
                y += 5;
                doc.text(`Location: ${c.loc || '-'}`, 10, y);
                y += 5;
                doc.text(`Next Alert: ${c.nxtAlrt ? new Date(c.nxtAlrt).toLocaleString() : '-'}`, 10, y);
                y += 5;
                doc.text(`Subject: ${c.subject || '-'}`, 10, y);
                y += 5;
                doc.text(`Assigned To: ${assignableUsers.find(u => u.uId === c.assignedTo)?.name || '-'}`, 10, y);
                y += 5;
                const feedback = stripHtml(feedbacksMap[c._id] || '-').slice(0, 200);
                doc.text(`Feedback: ${feedback}`, 10, y);
                y += 8;

                doc.setDrawColor(150);
                doc.line(10, y, 200, y);
                y += 5;
            });

            doc.save("contacts.pdf");
        });
    };

    const handlePrint = () => {
        let html = `
        <h2>Contacts</h2>
        <table border="1" style="border-collapse:collapse;width:100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Occupation</th>
              <th>Location</th>
              <th>Next Alert</th>
              <th>Subject</th>
              <th>Assigned To</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
      `;

        currentContacts.forEach(c => {
            html += `
          <tr>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.ph}</td>
            <td>${c.occup || '-'}</td>
            <td>${c.loc || '-'}</td>
            <td>${c.nxtAlrt ? new Date(c.nxtAlrt).toLocaleString() : '-'}</td>
            <td>${c.subject || '-'}</td>
            <td>${assignableUsers.find(u => u.uId === c.assignedTo)?.name || '-'}</td>
            <td>${stripHtml(feedbacksMap[c._id] || '-').slice(0, 200)}</td>
          </tr>
        `;
        });

        html += "</tbody></table>";

        const printWindow = window.open("", "", "height=600,width=800");
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setForm(prev => ({
                    ...prev,
                    gmap: `${lat},${lon}`,
                }));
                toast.success("Location added to form.");
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    toast.error("Location access denied.");
                } else {
                    toast.error("Unable to retrieve your location.");
                }
            }
        );
    };

    return (
        <div className="alt-menu sidebar-noneoverflow">
            <Navbar />
            {/*  END NAVBAR  */}
            {/*  BEGIN MAIN CONTAINER  */}
            <div className="main-container sidebar-closed sbar-open" id="container">
                <div className="overlay" />
                <div className="cs-overlay" />
                <div className="search-overlay" />
                {/*  BEGIN SIDEBAR  */}
                <Sidebar />
                {/*  END SIDEBAR  */}
                {/*  BEGIN CONTENT AREA  */}
                <div id="content" className="main-content">
                    <div className="layout-px-spacing">
                        <div className="row" id="cancel-row">
                            <div className="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
                                <div className="widget-content widget-content-area br-6">

                                    <table id="invoice-list" className="table table-hover" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th className="checkbox-column"> Record no. </th>
                                                {/* <th>Invoice Id</th> */}
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Location</th>
                                                <th>Phone</th>
                                                <th>Audio</th>
                                                <th>Feedback</th>
                                                <th>Alert</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                {/* <td><a href="apps_invoice-preview.html"><span className="inv-number">#098424</span></a></td> */}
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Alma Clarke  </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> alma.clarke@gmail.com</span></td>
                                                <td><span className="inv-loc">Kottayam, kerala, india</span></td>
                                                <td><span className="inv-phone">9465752356</span></td>
                                                <td><audio controls style={{ width: "100px" }}>
                                                    <source src="#" />
                                                </audio></td>
                                                <td><span className="inv-feedback"> {"Meet me next monday".slice(0, 15) + "..."} </span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 10 Feb 2021</span></td>

                                                <td>
                                                    <div className="action-icons d-flex align-items-center">
                                                        <a className="action-edit mr-3" href="apps_invoice-edit.html" title="Edit">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none"
                                                                stroke="#007bff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                                                className="feather feather-edit-3">
                                                                <path d="M12 20h9" />
                                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                            </svg>
                                                        </a>
                                                        <a className="action-delete" href="javascript:void(0);" title="Delete">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none"
                                                                stroke="#dc3545" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                                                className="feather feather-trash">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path
                                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </td>

                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 2 </td>
                                                {/* <td><a href="apps_invoice-preview.html"><span className="inv-number">#098424</span></a></td> */}
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Kelly Young  </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> alma.clarke@gmail.com</span></td>
                                                <td><span className="inv-loc">Thrissur, kerala, india</span></td>
                                                <td><span className="inv-phone">9465752356</span></td>
                                                <td><audio controls style={{ width: "100px" }}>
                                                    <source src="#" />
                                                </audio></td>
                                                <td><span className="inv-feedback"> {" all necessary docunmnts at sharp time".slice(0, 15) + "..."}</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 10 Feb 2021</span></td>

                                                <td>
                                                    <div className="action-icons d-flex align-items-center">
                                                        <a className="action-edit mr-3" href="apps_invoice-edit.html" title="Edit">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none"
                                                                stroke="#007bff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                                                className="feather feather-edit-3">
                                                                <path d="M12 20h9" />
                                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                            </svg>
                                                        </a>
                                                        <a className="action-delete" href="javascript:void(0);" title="Delete">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none"
                                                                stroke="#dc3545" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                                                className="feather feather-trash">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path
                                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </td>

                                            </tr>

                                            <tr>
                                                <td className="checkbox-column"> 3 </td>
                                                {/* <td><a href="apps_invoice-preview.html"><span className="inv-number">#098424</span></a></td> */}
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Vincent Carpenter  </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> alma.clarke@gmail.com</span></td>
                                                <td><span className="inv-loc">bengluru, india</span></td>
                                                <td><span className="inv-phone">946536356</span></td>
                                                <td><audio controls style={{ width: "100px" }}>
                                                    <source src="#" />
                                                </audio></td>
                                                {/* <td><span className="inv-feedback">  all necessary docunmnts at sharp time</span></td> */}
                                                {/* <td>
                                                    <span className="inv-feedback">
                                                        {"all necessary docunmnts at sharp time".slice(0, 15) + "..."}
                                                    </span>
                                                </td> */}
                                                <td>
  <span
    className="inv-feedback bs-tooltip"
    data-bs-toggle="tooltip"
    data-bs-html="true"
    title="all necessary docunmnts at sharp time"
    style={{ cursor: "pointer" }}
  >
    {"all necessary docunmnts at sharp time".slice(0, 15) + "..."}
  </span>
</td>


                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 10 Feb 2021</span></td>

                                                <td>
                                                    <div className="action-icons d-flex align-items-center">
                                                        <a className="action-edit mr-3" href="apps_invoice-edit.html" title="Edit">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none"
                                                                stroke="#007bff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                                                className="feather feather-edit-3">
                                                                <path d="M12 20h9" />
                                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                            </svg>
                                                        </a>
                                                        <a className="action-delete" href="javascript:void(0);" title="Delete">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none"
                                                                stroke="#dc3545" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                                                className="feather feather-trash">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path
                                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </td>

                                            </tr>

                                        </tbody>
                                    </table>
                                </div>

                                <div className="modal fade" id="addContactModal" tabIndex={-1} role="dialog">
                                    <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                                        <div className="modal-content">
                                            <div className="modal-body">
                                                <i className="flaticon-cancel-12 close" data-dismiss="modal" />
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

                                                                {/* Show Assigned To field only for Admins */}
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

                                                                <div className="col-md-6">  {/* FIXED */}
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
                                                                        {/* preview new upload */}
                                                                        {form.newAudio && (
                                                                            <audio
                                                                                key={form.newAudio.name + form.newAudio.size} // force re-mount
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
                                                        <button id="btn-edit" className="float-left btn" onClick={handleSave}>Save</button>
                                                        <button className="btn" data-dismiss="modal">Discard</button>
                                                    </>
                                                ) : (
                                                    <><button className="btn" data-dismiss="modal">Discard</button>
                                                        <button id="btn-add" className="btn" onClick={handleSave}>Add</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  END CONTENT AREA  */}

            </div> <Footer />
        </div>

    )
}

export default ContactTest
