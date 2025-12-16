import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../components/Loader';
import { useEffect } from 'react';
import * as XLSX from 'xlsx';


const Quotes = () => {
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    const [subCategory, setSubCategory] = useState('Common');
    const [writtenBy, setWrittenBy] = useState('');
    const [source, setSource] = useState('');
    const [quote, setQuote] = useState('');
    const [active, setActive] = useState(true);
    const [quoteModalVisible, setQuoteModalVisible] = useState(false);
    const [quoteContent, setQuoteContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [names, setNames] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [editId, setEditId] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('Common');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredQuotes = names?.filter(n =>
        n.writtenBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.subCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.quote?.toLowerCase().includes(searchQuery.toLowerCase())

    ) || [];






    useEffect(() => {
        const fetchQuotes = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${VITE_BASE_URL}/api/quotes?page=${currentPage}&category=${selectedCategory}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Make sure response matches new backend structure
                setNames(res.data.quotes);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage);
            } catch (err) {
                console.error('Failed to fetch quotes', err);
                toast.error('Failed to load quotes');
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [selectedCategory, currentPage]);

    useEffect(() => {
        $('#addContactModal').on('hidden.bs.modal', () => {
            setEditId(null);
            setSubCategory('General');
            setWrittenBy('');
            setSource('');
            setQuote('');
            setActive(true);
        });
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error('Please fill all required fields.');
            return;
        }
        setLoading(true);

        const formData = {
            subCategory,
            writtenBy,
            source,
            quote,
            sts: active,
        };

        const token = localStorage.getItem('token');

        try {
            let res;
            if (editId) {
                res = await axios.put(`${VITE_BASE_URL}/api/quotes/${editId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Quote updated successfully!');
            } else {
                res = await axios.post(`${VITE_BASE_URL}/api/quotes`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Quote added successfully!');
            }

            // Reset form
            setSubCategory('');
            setWrittenBy('');
            setSource('');
            setQuote('');
            setActive(true);
            setEditId(null);
            $('#addContactModal').modal('hide');
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
            setNames(prev =>
                editId
                    ? prev.map(n => (n._id === editId ? res.data.quote : n))
                    : [res.data.quote, ...prev]
            );


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
        setWrittenBy(data.writtenBy);
        setSource(data.source || '');
        setQuote(data.quote || '');
        setActive(data.sts);
        // Open modal via jQuery/Bootstrap
        $('#addContactModal').modal('show');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure to delete this quote?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${VITE_BASE_URL}/api/quotes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deleted successfully');
            setNames(names.filter(n => n._id !== id));
        } catch (err) {
            toast.error('Deletion failed');
            console.error(err);
        }
    };

    const openAddModal = () => {
        setEditId(null);
        setSubCategory(selectedCategory);
        setWrittenBy('');
        setSource('');
        setQuote('');
        setActive(true);
        setErrors({});
        $('#addContactModal').modal('show');
    };

    const openQuoteModal = (quoteHtml) => {
        setQuoteContent(quoteHtml || '');
        setQuoteModalVisible(true);
    };

    const validate = () => {
        const newErrors = {};
        if (!subCategory) newErrors.subCategory = 'Sub Category is required';
        if (!writtenBy.trim()) newErrors.writtenBy = 'Written By is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleExportDoc = () => {
        const html = `
      <h2>Quotes List</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr>
            <th>Written By</th><th>Sub Category</th><th>Quote</th><th>Source</th><th>Created On</th>
          </tr>
        </thead>
        <tbody>
          ${filteredQuotes.map(n => `
            <tr>
              <td>${n.writtenBy}</td>
              <td>${n.subCategory}</td>
              <td>${n.quote.replace(/<[^>]+>/g, '')}</td>
              <td>${n.source || '-'}</td>
              <td>${new Date(n.crtdOn).toLocaleDateString()}</td>              
            </tr>
          `).join('')}
        </tbody>
      </table>`;

        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Quotes.doc';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const data = filteredQuotes.map(n => ({
            Name: n.writtenBy,
            SubCategory: n.subCategory,
            Meaning: n.quote.replace(/<[^>]+>/g, ''),
            Source: n.source || '-',
            CreatedOn: new Date(n.crtdOn).toLocaleDateString(),
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Quotes');
        XLSX.writeFile(workbook, 'Quotes.xlsx');
    };

    const handleExportPdf = async () => {
        const jsPDFModule = await import('jspdf');
        const autoTable = await import('jspdf-autotable');

        const jsPDF = jsPDFModule.default;
        const doc = new jsPDF();

        // Important: just call autoTable.default with doc — no need to "attach"
        doc.setFontSize(16);
        doc.text("Quotes Report", 105, 15, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(10, 20, 200, 20);

        const rows = filteredQuotes.map((n, idx) => [
            idx + 1,
            n.writtenBy,
            n.subCategory,
            n.quote.replace(/<[^>]+>/g, '') || '-',
            n.source || '-',
            new Date(n.crtdOn).toLocaleDateString(),
        ]);

        // ✅ Correctly use the autoTable module
        autoTable.default(doc, {
            startY: 25,
            head: [['#', 'Written By', 'SubCategory', 'Quote', 'Source', 'Created On']],
            body: rows,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [22, 160, 133] }
        });

        doc.save("quotes_list.pdf");
    };




    const handlePrint = () => {
        const html = `
      <h2>Name List</h2>
      <table border="1" style="border-collapse:collapse;width:100%">
        <thead>
          <tr>
            <th>Written By</th><th>SubCategory</th><th>Quote</th><th>Source</th><th>Created On</th>
          </tr>
        </thead>
        <tbody>
          ${filteredQuotes.map(n => `
            <tr>
              <td>${n.writtenBy}</td>
              <td>${n.subCategory}</td>
              <td>${n.quote.replace(/<[^>]+>/g, '')}</td>
              <td>${n.source || '-'}</td>
              <td>${new Date(n.crtdOn).toLocaleDateString()}</td>
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
                                                            <input type="text" className="form-control product-search" id="input-search" placeholder="Search Quotes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                                                        <option value="Inspired By Bible">Inspired By Bible</option>
                                                        <option value="Spiritual">Spiritual</option>
                                                        <option value="Philosophers">Philosophers</option>
                                                        <option value="Adage">Adage</option>
                                                        <option value="Nature">Nature</option>
                                                        <option value="Common">Common</option>
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
                                                                                <div className="col-md-12 mb-3">
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
                                                                                        <option value="Inspired By Bible">Inspired By Bible</option>
                                                                                        <option value="Spiritual">Spiritual</option>
                                                                                        <option value="Philosophers">Philosophers</option>
                                                                                        <option value="Adage">Adage</option>
                                                                                        <option value="Nature">Nature</option>
                                                                                        <option value="Common">Common</option>

                                                                                    </select>
                                                                                    {errors.subCategory && <small className="text-danger">{errors.subCategory}</small>}
                                                                                </div>

                                                                                {/* Written By */}
                                                                                <div className="col-md-12 mb-3">
                                                                                    <label className={`text-left d-block ${errors.writtenBy ? 'text-danger' : ''}`}>
                                                                                        Written By <span className="text-danger">*</span>
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className={`form-control ${errors.writtenBy ? 'border border-danger' : ''}`}
                                                                                        value={writtenBy}
                                                                                        onChange={(e) => setWrittenBy(e.target.value)}
                                                                                        required
                                                                                    />
                                                                                    {errors.writtenBy && <small className="text-danger">{errors.writtenBy}</small>}
                                                                                </div>


                                                                                {/* Quote */}
                                                                                <div className="col-md-12 mb-3">
                                                                                    <label className="text-left d-block">Quote</label>
                                                                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                                                                        <CKEditor
                                                                                            editor={ClassicEditor}
                                                                                            config={{ licenseKey: 'GPL' }}
                                                                                            data={quote}
                                                                                            onChange={(event, editor) => {
                                                                                                const data = editor.getData();
                                                                                                setQuote(data);
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                {/* Source */}
                                                                                <div className="col-md-12 mb-3">
                                                                                    <label className="text-left d-block">Source</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={source}
                                                                                        onChange={(e) => setSource(e.target.value)}
                                                                                    />
                                                                                </div>

                                                                                {/* Active */}
                                                                                <div className="col-md-12 mb-3">
                                                                                    <div className="d-flex align-items-center">
                                                                                        <label htmlFor="active" className="mb-0 mr-2">Active</label>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            id="active"
                                                                                            checked={active}
                                                                                            onChange={(e) => setActive(e.target.checked)}
                                                                                        />
                                                                                    </div>
                                                                                </div>
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
                                                        <h4>Written By</h4>
                                                    </div>
                                                    <div className="user-email">
                                                        <h4>Quote</h4>
                                                    </div>
                                                    <div className="user-location">
                                                        <h4 style={{ marginLeft: 0 }}>Source</h4>
                                                    </div>
                                                    <div className="user-phone">
                                                        <h4 style={{ marginLeft: 3 }}>Created on</h4>
                                                    </div>
                                                    <div className="user-phone">
                                                        <h4 style={{ marginLeft: 3 }}>Status</h4>
                                                    </div>
                                                    <div className="action-btn">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2  delete-multiple"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            {filteredQuotes.map((n, idx) => (
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
                                                                <p className="user-name" data-name="Alan Green">{n.writtenBy}</p>
                                                                <p className="user-work" data-occupation="Web Developer">{n.subCategory}</p>
                                                            </div>
                                                        </div>
                                                        <div className="user-email">
                                                            <p className="info-title">Quote:</p>
                                                            <p
                                                                className="usr-email-addr"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => openQuoteModal(n.quote)}
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        (n.quote || '')
                                                                            .replace(/<[^>]+>/g, '')
                                                                            .slice(0, 10) +
                                                                        ((n.quote || '').replace(/<[^>]+>/g, '').length > 10 ? '...' : '')
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="user-location">
                                                            <p className="info-title">Source: </p>
                                                            <p className="usr-location" data-location="Boston, USA">{n.source || '-'}</p>
                                                        </div>
                                                        <div className="user-phone">
                                                            <p className="info-title">Created on: </p>
                                                            <p className="usr-ph-no" data-phone="+1 (070) 123-4567">{new Date(n.crtdOn).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="user-phone">
                                                            <span
                                                                style={{
                                                                    display: 'inline-block',
                                                                    width: '12px',
                                                                    height: '12px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: n.sts ? '#049141' : '#c7042e', // dark green or dark red
                                                                }}
                                                                title={n.sts ? 'Active' : 'Inactive'}
                                                            ></span>
                                                        </div>

                                                        <div className="action-btn">
                                                            <svg onClick={() => handleEdit(n)} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 edit"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                                            <svg onClick={() => handleDelete(n._id)} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-minus delete"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy={7} r={4} /><line x1={23} y1={11} x2={17} y2={11} /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                    {quoteModalVisible && (
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
                                                            <h5 className="modal-title">Quote</h5>
                                                            <button type="button" className="close" onClick={() => setQuoteModalVisible(false)}>
                                                                <span>&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                                            <div dangerouslySetInnerHTML={{ __html: quoteContent }} />
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button className="btn btn-secondary" onClick={() => setQuoteModalVisible(false)}>Close</button>
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

export default Quotes
