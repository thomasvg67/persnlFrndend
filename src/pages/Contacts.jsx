import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // adjust the path if needed
import Footer from '../components/Footer';
import * as XLSX from 'xlsx';


const Contacts = () => {

    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

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

    useEffect(() => {
        if (user?.role === 'adm') {
            axios.get(`${VITE_BASE_URL}/api/users/assignable`)
                .then(res => setAssignableUsers(res.data))
                .catch(err => console.error("Error fetching users:", err));
        }
    }, [user]);

    useEffect(() => {
        if (searchTerm.length >= 3 || searchTerm.trim() === "") {
            setLoading(true);
            axios
                .get(`${VITE_BASE_URL}/api/contacts?page=${currentPage}&limit=10&search=${encodeURIComponent(searchTerm)}`)
                .then(res => {
                    setContacts(res.data.contacts || []);
                    setTotalContacts(res.data.total || 0);
                })
                .catch(err => {
                    console.error(err);
                    setContacts([]);
                })
                .finally(() => setLoading(false));
        }
    }, [currentPage, searchTerm]);

    useEffect(() => {
        const addButton = document.getElementById('btn-add-contact');
        const handleAddClick = () => {
            setForm({ name: '', email: '', occup: '', ph: '', loc: '', fdback: '', nxtAlrt: '', subject: '', assignedTo: '', gmap: '', audio: null });
            setEditingId(null);
            setErrors({});
            window.$('#addContactModal').modal('show');
        };

        if (addButton) {
            addButton.addEventListener('click', handleAddClick);
        }

        return () => {
            if (addButton) {
                addButton.removeEventListener('click', handleAddClick);
            }
        };
    }, []);

    useEffect(() => {
        const fetchAllLatestFeedbacks = async () => {
            const newMap = {};
            await Promise.all(
                contacts.map(async (contact) => {
                    try {
                        const res = await axios.get(`${VITE_BASE_URL}/api/feedbacks/${contact._id}`);
                        if (Array.isArray(res.data) && res.data.length > 0) {
                            newMap[contact._id] = res.data[0].fdback;
                        }
                    } catch (err) {
                        console.error(`Error fetching feedback for ${contact._id}`, err);
                    }
                })
            );
            setFeedbacksMap(newMap);
            setLoading(false);
        };

        if (contacts.length > 0) {
            fetchAllLatestFeedbacks();
        }
    }, [contacts]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const editId = params.get("editContact");

        if (editId && contacts.length > 0) {
            const contactToEdit = contacts.find(c => c._id === editId);
            if (contactToEdit) {
                (async () => {
                    setOperationLoading(true);
                    await handleEditClick(contactToEdit);  // if handleEditClick made async
                    setOperationLoading(false);
                })();
            }
        }
    }, [contacts]);

    const handleSelect = (id, checked) => {
        setSelectedContacts(prev =>
            checked ? [...prev, id] : prev.filter(x => x !== id)
        );
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        if (checked) setSelectedContacts(contacts.map(c => c._id));
        else setSelectedContacts([]);
    };

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

    const handleDeleteSelected = () => {
    if (!window.confirm(`Delete ${selectedContacts.length} contact(s)?`)) return;

    setOperationLoading(true);
    axios
        .all(selectedContacts.map(id => axios.delete(`${VITE_BASE_URL}/api/contacts/delete/${id}`)))
        .then(() => {
            setContacts(prev => prev.filter(c => !selectedContacts.includes(c._id)));
            setSelectedContacts([]);
            toast.success("Selected contacts deleted!");
        })
        .catch(err => {
            console.error(err);
            toast.error("Failed to delete selected contacts");
        })
        .finally(() => setOperationLoading(false));
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

    const handleDelete = (id) => {
    setOperationLoading(true);
    axios.delete(`${VITE_BASE_URL}/api/contacts/delete/${id}`)
        .then(() => {
            setContacts(contacts.filter(c => c._id !== id));
            toast.success("Contact deleted successfully!");
        })
        .catch(err => {
            console.error(err);
            toast.error("Failed to delete contact");
        })
        .finally(() => setOperationLoading(false));
};

    const handleEditClick = (contact) => {
        setForm({
            name: contact.name || "",
            email: contact.email || "",
            occup: contact.occup || "",
            ph: contact.ph || "",
            loc: contact.loc || "",
            nxtAlrt: contact.nxtAlrt || "",
            fdback: "",
            subject: contact.subject || '',
            assignedTo: contact.assignedTo || "",
            gmap: contact.gmap || "",
            audioFiles: contact.audio || [],
            newAudio: null
        }); setEditingId(contact._id);
        setFeedbacks([]);
        setErrors({});
        setOperationLoading(true);

        axios.get(`${VITE_BASE_URL}/api/feedbacks/${contact._id}`)
            .then(res => {
                setFeedbacks(res.data);
            })
            .catch(err => {
                console.error(err);
                setFeedbacks([]);
            })
            .finally(() => setOperationLoading(false));

        window.$('#addContactModal').modal('show');
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


    const handleFeedbackClick = async (contactId) => {
        try {
            setOperationLoading(true);
            const res = await axios.get(`${VITE_BASE_URL}/api/feedbacks/${contactId}`);
            setSelectedFeedbacks(res.data || []);
            setFeedbackModalVisible(true);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load feedbacks");
        } finally {
            setOperationLoading(false);
        }
    };



    function stripHtml(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    return (
        <div className="alt-menu sidebar-noneoverflow">
            {(loading || operationLoading) && <Loader />}
            <Navbar />
            <div className="main-container sidebar-closed sbar-open" id="container">
                <div className="overlay" />
                <div className="cs-overlay" />
                <div className="search-overlay" />
                <Sidebar />
                <div id="content" className="main-content">
                    <div className="layout-px-spacing">
                        <div className="row layout-spacing layout-top-spacing" id="cancel-row">
                            <div className="col-lg-12">
                                <div className="widget-content searchable-container list">
                                    <div className="row">
                                        <div className="col-xl-4 col-lg-5 col-md-5 col-sm-7 filtered-list-search layout-spacing align-self-center">
                                            <form className="form-inline my-2 my-lg-0 w-100">
                                                <div className="d-flex align-items-center w-100">
                                                    <div className="d-flex align-items-center flex-grow-1 mr-3">  {/* <-- margin-right 3 */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
                                                        <input
                                                            type="text"
                                                            className="form-control product-search ml-2"
                                                            id="input-search"
                                                            placeholder="Search Contacts..."
                                                            value={searchTerm}
                                                            onChange={e => {
                                                                setSearchTerm(e.target.value);
                                                                setCurrentPage(1);
                                                            }}
                                                        />
                                                    </div>
                                                    <button className="btn btn-sm btn-secondary mr-1" onClick={handleExportDoc} type="button">DOC</button>
                                                    <button className="btn btn-sm btn-success mr-1" onClick={handleExportExcel} type="button">Excel</button>
                                                    <button className="btn btn-sm btn-danger mr-1" onClick={handleExportPdf} type="button">PDF</button>
                                                    <button className="btn btn-sm btn-primary" onClick={handlePrint} type="button">Print</button>
                                                </div>
                                            </form>
                                            {searchTerm.length > 0 && searchTerm.length < 3 && (
                                                <small className="text-danger mt-1">
                                                    Please enter at least 3 letters to search.
                                                </small>
                                            )}

                                        </div>
                                        <div className="col-xl-8 col-lg-7 col-md-7 col-sm-5 text-sm-right text-center layout-spacing align-self-center">
                                            <div className="d-flex justify-content-sm-end justify-content-center align-items-center gap-2">
                                                <svg id="btn-add-contact" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`feather feather-list view-list ${viewMode === 'list' ? 'active-view' : ''}`}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy={7} r={4} /><line x1={20} y1={8} x2={20} y2={14} /><line x1={23} y1={11} x2={17} y2={11} /></svg>
                                                <div className="d-flex align-items-center gap-2">
                                                    <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`}
                                                        onClick={() => setViewMode('list')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                            <line x1={8} y1={6} x2={21} y2={6} /><line x1={8} y1={12} x2={21} y2={12} /><line x1={8} y1={18} x2={21} y2={18} /><line x1={3} y1={6} x2={3} y2={6} /><line x1={3} y1={12} x2={3} y2={12} /><line x1={3} y1={18} x2={3} y2={18} />
                                                        </svg>
                                                    </button>
                                                    <button className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-light'}`}
                                                        onClick={() => setViewMode('grid')}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={3} y={3} width={7} height={7} /><rect x={14} y={3} width={7} height={7} /><rect x={14} y={14} width={7} height={7} /><rect x={3} y={14} width={7} height={7} /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Modal */}
                                            <div className="modal fade" id="addContactModal" tabIndex={-1} role="dialog">
                                                <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-body">
                                                            <i className="flaticon-cancel-12 close" data-dismiss="modal" />
                                                            <div className="add-contact-box">
                                                                <div className="add-contact-content">
                                                                    <form>
                                                                        <div className="row">
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

                                    <div className={`searchable-items ${viewMode}`}>
                                        <div className="items items-header-section">
                                            <div className="item-content">
                                                <div className="">
                                                    <div className="n-chk align-self-center text-center">
                                                        <label className="new-control new-checkbox checkbox-primary">
                                                            <input type="checkbox" className="new-control-input" id="contact-check-all" checked={selectedContacts.length === contacts.length && contacts.length > 0} onChange={handleSelectAll} />
                                                            <span className="new-control-indicator" />
                                                        </label>
                                                    </div>
                                                    <h4>Name</h4>
                                                </div>
                                                <div className="user-email"><h4>Email</h4></div>
                                                <div className="user-location"><h4>Location</h4></div>
                                                <div className="user-phone"><h4>Phone</h4></div>
                                                <div className="user-audio"><h4>Audio</h4></div>
                                                <div className="user-feedback"><h4>Feedback</h4></div>
                                                <div className="user-alert"><h4>Alert</h4></div>
                                                <div className="action-btn">
                                                    <svg onClick={handleDeleteSelected} disabled={selectedContacts.length === 0} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 delete-multiple"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {Array.isArray(currentContacts) && currentContacts.map(contact => (
                                            <div className="items" key={contact._id}>
                                                <div className="item-content">
                                                    <div className="user-profile">
                                                        <div className="n-chk align-self-center text-center">
                                                            <label className="new-control new-checkbox checkbox-primary">
                                                                <input type="checkbox" className="new-control-input contact-chkbox" checked={selectedContacts.includes(contact._id)} onChange={e => handleSelect(contact._id, e.target.checked)} />
                                                                <span className="new-control-indicator" />
                                                            </label>
                                                        </div>
                                                        <img src="assets/img/90x90.jpg" alt="avatar" />
                                                        <div className="user-meta-info">
                                                            <p className="user-name">{contact.name}</p>
                                                            <p className="user-work">{contact.occup}</p>
                                                        </div>
                                                    </div>
                                                    <div className="user-email"><p className="info-title">Email: </p><p>{contact.email}</p></div>
                                                    <div className="user-location">
                                                        <p className="info-title">Location: </p>
                                                        {contact.loc && contact.gmap ? (
                                                            <a
                                                                href={`https://www.google.com/maps?q=${encodeURIComponent(contact.gmap)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ color: "blue", textDecoration: "underline" }}
                                                            >
                                                                {contact.loc}
                                                            </a>
                                                        ) : contact.loc ? (
                                                            <p>{contact.loc}</p>
                                                        ) : contact.gmap ? (
                                                            <a
                                                                href={`https://www.google.com/maps?q=${encodeURIComponent(contact.gmap)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ color: "#4361ee", textDecoration: "underline" }}
                                                            >
                                                                Location
                                                            </a>
                                                        ) : (
                                                            <p>-</p>
                                                        )}
                                                    </div>

                                                    <div className="user-phone"><p className="info-title">Phone: </p><p>{contact.ph}</p></div>
                                                    <div className="user-audio">
                                                        {Array.isArray(contact.audio) && contact.audio.length > 0 ? (
                                                            <audio controls style={{ width: "100px" }}>
                                                                <source src={`${VITE_BASE_URL}/uploads/audio/${contact.audio[contact.audio.length - 1].file}`} />
                                                            </audio>
                                                        ) : (
                                                            <p>-</p>
                                                        )}
                                                    </div>


                                                    <div className="user-feedback"
                                                        onClick={() => feedbacksMap[contact._id] && handleFeedbackClick(contact._id)}
                                                        style={{ cursor: feedbacksMap[contact._id] ? "pointer" : "default", color: feedbacksMap[contact._id] ? "#007bff" : "inherit" }}>
                                                        <p>
                                                            {feedbacksMap[contact._id]
                                                                ? stripHtml(feedbacksMap[contact._id]).slice(0, 60) + (stripHtml(feedbacksMap[contact._id]).length > 60 ? '...' : '')
                                                                : '-'}
                                                        </p>
                                                    </div>

                                                    <div className="user-alert">
                                                        <p>{contact.nxtAlrt ? new Date(contact.nxtAlrt).toLocaleString() : '-'}</p>
                                                    </div>
                                                    <div className="action-btn">
                                                        <svg onClick={() => handleEditClick(contact)} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 edit"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                                        <svg onClick={() => handleDelete(contact._id)} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-minus delete"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy={7} r={4} /><line x1={23} y1={11} x2={17} y2={11} /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
            </div><div className="d-flex justify-content-center mt-3">
                {Array.from({ length: Math.ceil(totalContacts / 10) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn btn-sm mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-light'}`}
                    >
                        {i + 1}
                    </button>
                ))}

            </div>
            <Footer />
            {feedbackModalVisible && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">All Feedbacks</h5>
                                <button type="button" className="close" onClick={() => setFeedbackModalVisible(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {selectedFeedbacks.length > 0 ? (
                                    selectedFeedbacks.map(fb => (
                                        <div key={fb._id} className="mb-3 border-bottom pb-2">
                                            <small className="text-muted">{new Date(fb.crtdOn).toLocaleString()}</small>
                                            <div dangerouslySetInnerHTML={{ __html: fb.fdback }} />
                                        </div>
                                    ))
                                ) : (
                                    <p>No feedback available.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setFeedbackModalVisible(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Contacts;
