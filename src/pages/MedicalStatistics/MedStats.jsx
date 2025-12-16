import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader';
import { useEffect } from 'react';
import * as XLSX from 'xlsx';


const MedStats = () => {
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    const [subCategory, setSubCategory] = useState('Pressure');
    const [hospital, setHospital] = useState('');
    const [phone, setPhone] = useState('');
    const [consultedBy, setConsultedBy] = useState('');
    const [measures, setMeasures] = useState('');
    const [checkedOn, setCheckedOn] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState(true);
    const [descModalVisible, setDescModalVisible] = useState(false);
    const [descContent, setDescContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [stats, setStats] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('Pressure');
    const [searchQuery, setSearchQuery] = useState('');
    const [hospitalSuggestions, setHospitalSuggestions] = useState([]);


    const filteredStats = stats.filter(stat =>
        stat.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stat.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );



    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${VITE_BASE_URL}/api/medical-stats?page=${currentPage}&subCategory=${selectedCategory}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data.stats);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage);
            } catch (err) {
                console.error('Failed to fetch stats', err);
                toast.error('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [selectedCategory, currentPage]);

    useEffect(() => {
        $('#addContactModal').on('hidden.bs.modal', () => {
            clearForm();
        });
    }, []);

    const clearForm = () => {
        setEditId(null);
        setSubCategory(selectedCategory);
        setHospital('');
        setPhone('');
        setConsultedBy('');
        setMeasures('');
        setCheckedOn('');
        setDescription('');
        setActive(true);
        setErrors({});
    };


    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        const formData = {
            subCategory,
            hospital,
            phone,
            consultedBy,
            measures,
            checkedOn,
            description,
            sts: active,
        };
        const token = localStorage.getItem('token');
        try {
            let res;
            if (editId) {
                res = await axios.put(`${VITE_BASE_URL}/api/medical-stats/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Stat updated successfully!');
            } else {
                res = await axios.post(`${VITE_BASE_URL}/api/medical-stats`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Stat added successfully!');
            }
            clearForm();
            $('#addContactModal').modal('hide');
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            setStats(prev => editId ? prev.map(n => (n._id === editId ? res.data.stat : n)) : [res.data.stat, ...prev]);
        } catch (err) {
            console.error(err);
            toast.error(editId ? 'Update failed' : 'Add failed');
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (data) => {
        setEditId(data._id);
        setSubCategory(data.subCategory);
        setHospital(data.hospital);
        setPhone(data.phone);
        setConsultedBy(data.consultedBy);
        setMeasures(data.measures);
        setCheckedOn(data.checkedOn?.slice(0, 10));
        setDescription(data.description);
        setActive(data.sts);
        $('#addContactModal').modal('show');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure to delete this entry?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${VITE_BASE_URL}/api/medical-stats/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deleted successfully');
            setStats(stats.filter(n => n._id !== id));
        } catch (err) {
            toast.error('Deletion failed');
            console.error(err);
        }
    };

    const openAddModal = () => {
        setEditId(null);
        setSubCategory(selectedCategory);
        setHospital('');
        setPhone('');
        setConsultedBy('');
        setMeasures('');
        setCheckedOn('');
        setDescription('');
        setActive(true);
        setErrors({});
        $('#addContactModal').modal('show');
    };

    const openDescriptionModal = (description) => {
        setDescContent(description);
        setDescModalVisible(true);
    };


    const validate = () => {
        const newErrors = {};
        if (!subCategory) newErrors.subCategory = 'Sub Category is required';
        if (!hospital.trim()) newErrors.hospital = 'Hospital is required';
        if (!measures.trim()) newErrors.measures = 'Measures are required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleExportDoc = () => {
        const html = `
      <h2>Medical Stats List</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr>
<th>Sub Category</th><th>Hospital</th><th>Phone</th><th>Consulted By</th><th>Measures</th><th>Checked On</th><th>Description</th>          </tr>
        </thead>
        <tbody>
          ${filteredStats.map(n => `
            <tr>
            <td>${n.subCategory}</td>
              <td>${n.hospital}</td>
              
              <td>${n.phone || '-'}</td>
                <td>${n.consultedBy || '-'}</td>
                <td>${n.measures}</td>
              <td>${new Date(n.checkedOn).toLocaleDateString()}</td>
                
              <td>${n.description.replace(/<[^>]+>/g, '')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'MedStats.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const data = filteredStats.map(n => ({
            Hospital: n.hospital,
            SubCategory: n.subCategory,
            Phone: n.phone || '-',
            ConsultedBy: n.consultedBy || '-',
            Measures: n.measures || '-',
            CreatedOn: new Date(n.checkedOn).toLocaleDateString(),
            Description: n.description.replace(/<[^>]+>/g, '')
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'MedStats');
        XLSX.writeFile(workbook, 'MedStats.xlsx');
    };

    const handleExportPdf = async () => {
        const jsPDFModule = await import('jspdf');
        const autoTable = await import('jspdf-autotable');

        const jsPDF = jsPDFModule.default;
        const doc = new jsPDF();

        // Important: just call autoTable.default with doc — no need to "attach"
        doc.setFontSize(16);
        doc.text("Medical Stats Report", 105, 15, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(10, 20, 200, 20);

        const rows = filteredStats.map((n, idx) => [
            idx + 1,
            n.subCategory,
            n.hospital,
            n.phone || '-',
            n.consultedBy || '-',
            n.measures || '-',
            new Date(n.checkedOn).toLocaleDateString(),
            n.description.replace(/<[^>]+>/g, '') || '-'
        ]);

        // ✅ Correctly use the autoTable module
        autoTable.default(doc, {
            startY: 25,
            head: [['#', 'SubCategory', 'Hospital', 'Phone', 'Consulted By', 'Measures', 'Checked On', 'Description']],
            body: rows,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [22, 160, 133] }
        });

        doc.save("med_stats_report.pdf");
    };




    const handlePrint = () => {
        const html = `
      <h2>Medical Stats List</h2>
      <table border="1" style="border-collapse:collapse;width:100%">
        <thead>
          <tr>
            <th>SubCategory</th><th>Hospital</th><th>Phone</th><th>Consulted By</th><th>Measures</th><th>Checked On</th><th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${filteredStats.map(n => `
            <tr>
            <td>${n.subCategory}</td>
              <td>${n.hospital}</td>
              <td>${n.phone || '-'}</td>
              <td>${n.consultedBy || '-'}</td>
              <td>${n.measures || '-'}</td>
              <td>${new Date(n.checkedOn).toLocaleDateString()}</td>
              <td>${n.description.replace(/<[^>]+>/g, '')}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };

    const renderPagination = () => (
        <div className="pagination d-flex justify-content-center mt-4">
            <button
                className="btn btn-sm btn-primary mx-2"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            <span className="align-self-center mx-2">
                Page {currentPage} of {totalPages}
            </span>
            <button
                className="btn btn-sm btn-primary mx-2"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );


    if (loading) return <Loader />;


    return (
        <div>
            <div className="alt-menu sidebar-noneoverflow">
                {/*  BEGIN NAVBAR  */}
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
                            <div className="row layout-spacing layout-top-spacing" id="cancel-row">
                                <div className="col-lg-12">
                                    <div className="widget-content searchable-container list">
                                        <div className="row">
                                            <div className="col-xl-4 col-lg-5 col-md-5 col-sm-7 filtered-list-search layout-spacing align-self-center">
                                                <form className="form-inline my-2 my-lg-0 w-100">
                                                    <div className="d-flex align-items-center w-100">
                                                        <div className="d-flex align-items-center flex-grow-1 mr-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
                                                            <input type="text" className="form-control product-search" id="input-search" placeholder="Search Medical Stat..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                                        </div>
                                                        <button className="btn btn-sm btn-secondary mr-1" onClick={handleExportDoc} type="button">DOC</button>
                                                        <button className="btn btn-sm btn-success mr-1" onClick={handleExportExcel} type="button">Excel</button>
                                                        <button className="btn btn-sm btn-danger mr-1" onClick={handleExportPdf} type="button">PDF</button>
                                                        <button className="btn btn-sm btn-primary" onClick={handlePrint} type="button">Print</button>
                                                    </div>
                                                </form>
                                                {searchQuery.length > 0 && searchQuery.length < 3 && (
                                                    <small className="text-danger mt-1">
                                                        Please enter at least 3 letters to search.
                                                    </small>
                                                )}
                                            </div>
                                            <div className="col-xl-8 col-lg-7 col-md-7 col-sm-5 text-sm-right text-center layout-spacing align-self-center">
                                                <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
                                                    <select
                                                        className="form-control mr-2"
                                                        style={{ width: '150px' }}
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                    >
                                                        <option value="Pressure">Pressure</option>
                                                        <option value="Sugar">Sugar</option>
                                                        <option value="Weight">Weight</option>
                                                        <option value="Cholesterol">Cholesterol</option>
                                                        <option value="Others">Others</option>
                                                    </select>
                                                    <div className="d-flex justify-content-sm-end justify-content-center align-items-center gap-2">
                                                        <svg onClick={openAddModal} id="btn-add-contact" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`feather feather-list view-list ${viewMode === 'list' ? 'active-view' : ''}`}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy={7} r={4} /><line x1={20} y1={8} x2={20} y2={14} /><line x1={23} y1={11} x2={17} y2={11} /></svg>
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
                                                        </div></div>
                                                </div>
                                                {/* Modal */}
                                                <div className="modal fade" id="addContactModal" tabIndex={-1} role="dialog" aria-labelledby="addContactModalTitle" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '700px' }} role="document">
                                                        <div className="modal-content">
                                                            <div className="modal-body">
                                                                <i className="flaticon-cancel-12 close" data-dismiss="modal" />
                                                                <div className="add-contact-box">
                                                                    <div className="add-contact-content">
                                                                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                                                            <div className="row">
                                                                                {/* Sub Category */}
                                                                                <div className="col-md-8 mb-3">
                                                                                    <label className={`text-left d-block ${errors.subCategory ? 'text-danger' : ''}`}>
                                                                                        Sub Category <span className="text-danger">*</span>
                                                                                    </label>
                                                                                    <select
                                                                                        className={`form-control ${errors.subCategory ? 'border border-danger' : ''}`}
                                                                                        value={subCategory}
                                                                                        onChange={(e) => setSubCategory(e.target.value)}
                                                                                        required
                                                                                    >
                                                                                        <option value="">Select</option>
                                                                                        <option value="Pressure">Pressure</option>
                                                                                        <option value="Sugar">Sugar</option>
                                                                                        <option value="Weight">Weight</option>
                                                                                        <option value="Cholesterol">Cholesterol</option>
                                                                                        <option value="Others">Others</option>
                                                                                    </select>
                                                                                    {errors.subCategory && <small className="text-danger">{errors.subCategory}</small>}
                                                                                </div>

                                                                                {/* Name */}
                                                                                <div className="col-md-8 mb-3">
                                                                                    <label className={`text-left d-block ${errors.hospital ? 'text-danger' : ''}`}>
                                                                                        Hospital <span className="text-danger">*</span>
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className={`form-control ${errors.hospital ? 'border border-danger' : ''}`}
                                                                                        value={hospital}
                                                                                        onChange={async (e) => {
                                                                                            const value = e.target.value;
                                                                                            setHospital(value);
                                                                                            setPhone('');
                                                                                            setConsultedBy('');
                                                                                            setHospitalSuggestions([]);

                                                                                            if (value.length >= 2) {
                                                                                                const token = localStorage.getItem('token');
                                                                                                try {
                                                                                                    const res = await axios.get(`${VITE_BASE_URL}/api/medical-stats/hospital-lookup?query=${value}`, {
                                                                                                        headers: { Authorization: `Bearer ${token}` }
                                                                                                    });
                                                                                                    setHospitalSuggestions(res.data);
                                                                                                } catch (err) {
                                                                                                    console.error('Hospital lookup failed', err);
                                                                                                }
                                                                                            }
                                                                                        }}
                                                                                        autoComplete="off"
                                                                                    />
                                                                                    {hospitalSuggestions.length > 0 && (
                                                                                        <ul className="list-group position-absolute" style={{ zIndex: 10, maxHeight: '150px', overflowY: 'auto' }}>
                                                                                            {hospitalSuggestions.map((item, idx) => (
                                                                                                <li
                                                                                                    key={idx}
                                                                                                    className="list-group-item list-group-item-action"
                                                                                                    onClick={() => {
                                                                                                        setHospital(item.hospital);
                                                                                                        setPhone(item.phone);
                                                                                                        setConsultedBy(item.consultedBy);
                                                                                                        setHospitalSuggestions([]);
                                                                                                    }}
                                                                                                >
                                                                                                    {item.hospital}
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    )}

                                                                                    {errors.hospital && <small className="text-danger">{errors.hospital}</small>}
                                                                                </div>

                                                                                {/* phone */}
                                                                                <div className="col-md-8 mb-3">
                                                                                    <label className="text-left d-block">Phone</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={phone}
                                                                                        onChange={(e) => setPhone(e.target.value)}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-md-8 mb-3">
                                                                                    <label className="text-left d-block">Consulted by</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={consultedBy}
                                                                                        onChange={(e) => setConsultedBy(e.target.value)}
                                                                                    />
                                                                                </div>

                                                                                <div className="col-md-8 mb-3">
                                                                                    <label className={`text-left d-block ${errors.measures ? 'text-danger' : ''}`}>Measures <span className="text-danger">*</span></label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className={`form-control ${errors.measures ? 'border border-danger' : ''}`}
                                                                                        value={measures}
                                                                                        onChange={(e) => setMeasures(e.target.value)}
                                                                                    />
                                                                                    {errors.measures && <small className="text-danger">{errors.measures}</small>}

                                                                                </div>
                                                                                <div className="col-md-8 mb-3">
                                                                                    <label className="text-left d-block">Checked  on</label>
                                                                                    <input
                                                                                        type="date"
                                                                                        className="form-control"
                                                                                        value={checkedOn}
                                                                                        onChange={(e) => setCheckedOn(e.target.value)}
                                                                                    />
                                                                                </div>

                                                                                {/* Meaning */}
                                                                                <div className="col-md-12 mb-3">
                                                                                    <label className="text-left d-block">Description</label>
                                                                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                                                                        <CKEditor
                                                                                            editor={ClassicEditor}
                                                                                            config={{ licenseKey: 'GPL' }}
                                                                                            data={description}
                                                                                            onChange={(event, editor) => {
                                                                                                const data = editor.getData();
                                                                                                setDescription(data);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                {/* Active */}
                                                                                {/* <div className="col-md-12 mb-3">
                                          <div className="d-flex align-items-center">
                                            <label htmlFor="active" className="mb-0 mr-2">Active</label>
                                            <input
                                              type="checkbox"
                                              id="active"
                                              checked={active}
                                              onChange={(e) => setActive(e.target.checked)}
                                            />
                                          </div>
                                        </div> */}
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                {editId ? (
                                                                    <button id="btn-edit" className="float-left btn" onClick={(e) => { e.preventDefault(); handleSubmit(e); }}>Save</button>
                                                                ) : (
                                                                    <button id="btn-add" className="btn" onClick={(e) => { e.preventDefault(); handleSubmit(e); }}>Add</button>
                                                                )}
                                                                <button className="btn" data-dismiss="modal"> <i className="flaticon-delete-1" /> Discard</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`searchable-items ${viewMode}`}>
                                            <div className="items items-header-section">
                                                <div className="item-content">
                                                    <div className>
                                                        <div className="n-chk align-self-center text-center">
                                                            <label className="new-control new-checkbox checkbox-primary">
                                                                <input type="checkbox" className="new-control-input" id="contact-check-all" />
                                                                <span className="new-control-indicator" />
                                                            </label>
                                                        </div>
                                                        <h4>Measure</h4>
                                                    </div>
                                                    <div className="user-email">
                                                        <h4>Checked on</h4>
                                                    </div>
                                                    <div className="user-location">
                                                        <h4 style={{ marginLeft: 0 }}>Hospital</h4>
                                                    </div>
                                                    <div className="user-location">
                                                        <h4 style={{ marginLeft: 0 }}>Phone</h4>
                                                    </div>
                                                    <div className="user-phone">
                                                        <h4 style={{ marginLeft: 3 }}>Consulted by</h4>
                                                    </div>
                                                    <div className="user-phone">
                                                        <h4 style={{ marginLeft: 3 }}>Description</h4>
                                                    </div>
                                                    <div className="action-btn">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2  delete-multiple"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            {filteredStats.map((n, idx) => (
                                                <div className="items" key={n._id}>
                                                    <div className="item-content">
                                                        <div className="user-profile">
                                                            <div className="n-chk align-self-center text-center">
                                                                <label className="new-control new-checkbox checkbox-primary">
                                                                    <input type="checkbox" className="new-control-input contact-chkbox" />
                                                                    <span className="new-control-indicator" />
                                                                </label>
                                                            </div>
                                                            <img src="assets/img/90x90.jpg" alt="avatar" />
                                                            <div className="user-meta-info">
                                                                <p className="user-name" data-name="measures">{n.measures || '-'}</p>
                                                                <p className="user-work" data-occupation="subcategory">{n.subCategory}</p>
                                                            </div>
                                                        </div>

                                                        <div className="user-email">
                                                            <p className="info-title">Checked On:</p>
                                                            <p>{n.checkedOn ? new Date(n.checkedOn).toLocaleDateString() : '-'}</p>
                                                        </div>

                                                        <div className="user-location">
                                                            <p className="info-title">Hospital:</p>
                                                            <p>{n.hospital || '-'}</p>
                                                        </div>

                                                        <div className="user-location">
                                                            <p className="info-title">Phone:</p>
                                                            <p>{n.phone || '-'}</p>
                                                        </div>

                                                        <div className="user-location">
                                                            <p className="info-title">Consulted By:</p>
                                                            <p>{n.consultedBy || '-'}</p>
                                                        </div>

                                                        <div className="user-email">
                                                            <p className="info-title">Description:</p>
                                                            <p
                                                                className="usr-email-addr"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => openDescriptionModal(n.description)}
                                                                dangerouslySetInnerHTML={{
                                                                    __html: (n.description.replace(/<[^>]+>/g, '').slice(0, 30) + '...')
                                                                }}
                                                            />
                                                        </div>



                                                        <div className="action-btn">
                                                            <svg onClick={() => handleEdit(n)} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 edit"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                                            <svg onClick={() => handleDelete(n._id)} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-minus delete"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy={7} r={4} /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                    {descModalVisible && (
                                        <>
                                            <div
                                                className="modal fade show"
                                                style={{
                                                    display: 'block',
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    position: 'fixed',
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    zIndex: 1050,
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                                tabIndex="-1"
                                                role="dialog"
                                            >
                                                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title">Description</h5>
                                                            <button type="button" className="close" onClick={() => setDescModalVisible(false)}>
                                                                <span>&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                                            <div dangerouslySetInnerHTML={{ __html: descContent }} />
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button className="btn btn-secondary" onClick={() => setDescModalVisible(false)}>Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>{renderPagination()}
                        </div>
                    </div>
                    {/*  END CONTENT AREA  */}
                </div>
                {/* END MAIN CONTAINER */}
            </div>

        </div>
    )
}

export default MedStats
