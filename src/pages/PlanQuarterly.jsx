import React, { useEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Footer from '../components/Footer';
import axios from 'axios';
import PlanQtrCard from '../components/planQtr/PlanQtrCard';


const PlanQuarterly = () => {
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const modalRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [desc, setDescription] = useState('');
  const [quarter, setQuarter] = useState('');
  const [planQtrs, setPlanQtrs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPlanQtrId, setEditPlanQtrId] = useState(null);
  const [loading, setLoading] = useState({ page: true, action: false });
  const bsModalRef = useRef(null);


  const fetchPlanQtrs = async () => {
    try {
      setLoading(prev => ({ ...prev, page: true }));
      const response = await axios.get(`${VITE_BASE_URL}/api/planQtr`);
      setPlanQtrs(response.data);
    } catch (err) {
      console.error('Error fetching planQtrs:', err);
      toast.error('Failed to load planQtrs');
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  };

  useEffect(() => {
    fetchPlanQtrs();
  }, []);



  // const handleAddPlanQtr = () => {
  //   const modalElement = modalRef.current;
  //   if (modalElement) {
  //     const modal = new window.bootstrap.Modal(modalElement);
  //     bsModalRef.current = modal; // ✅ store instance
  //     modal.show();
  //     setErrors({});
  //   }
  // };

  const handleAddPlanQtr = () => {
    setTitle('');
    setDescription('');
    setErrors({});
    setIsEditMode(false);
    setEditPlanQtrId(null);
    const modal = new window.bootstrap.Modal(modalRef.current);
    bsModalRef.current = modal;
    modal.show();
  };

  const handleEditPlanQtr = (planQtr) => {
    setTitle(planQtr.title);
    setDescription(planQtr.desc);
    setQuarter(planQtr.quarter);
    setEditPlanQtrId(planQtr._id);
    setIsEditMode(true);
    setErrors({});
    const modal = new window.bootstrap.Modal(modalRef.current);
    bsModalRef.current = modal;
    modal.show();
  };

  const updatePlanQtr = async () => {
    if (!validate()) return;
    try {
      const res = await axios.put(`${VITE_BASE_URL}/api/planQtr/${editPlanQtrId}`, {
        title,
        desc,
        quarter
      });
      if (res.data.success) {
        setPlanQtrs(prev =>
          prev.map(n => (n._id === editPlanQtrId ? { ...n, title, desc } : n))
        );
        toast.success("PlanQtr updated");
        setTitle('');
        setDescription('');
        setIsEditMode(false);
        setEditPlanQtrId(null);
        bsModalRef.current?.hide();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating planQtr:", err);
      toast.error("Server error while updating planQtr");
    }
  };

  const savePlanQtr = async () => {
    if (!validate()) return;

    // setLoading(prev => ({ ...prev, action: true }));
    try {
      const response = await axios.post(`${VITE_BASE_URL}/api/planQtr/add`, {
        title,
        desc,
        quarter,
        uname: user?.uname
      });

      const result = response.data;
      if (!result.success) {
        toast.error(result.message || 'Failed to save planQtr');
        return;
      }

      setPlanQtrs(prevPlanQtrs => [result.planQtr, ...prevPlanQtrs]);
      setTitle('');
      setDescription('');
      setErrors({});
      bsModalRef.current?.hide();
      toast.success('PlanQtr saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save planQtr.");
    } finally {
      // setLoading(prev => ({ ...prev, action: false }));
    }
  };



  const handleRemovePlanQtr = async (id) => {
    // setLoading(prev => ({ ...prev, action: true }));
    try {
      await axios.delete(`${VITE_BASE_URL}/api/planQtr/${id}`);
      setPlanQtrs(prev => prev.filter(n => n._id !== id));
      toast.success("PlanQtr deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete planQtr.");
    } finally {
      // setLoading(prev => ({ ...prev, action: false }));
    }
  };


  // const getFilteredPlanQtrs = () => {
  //   if (filter === 'fav') return planQtrs.filter(planQtr => planQtr.isFav);
  //   if (filter.startsWith('tag:')) {
  //     const tag = filter.split(':')[1];
  //     return planQtrs.filter(planQtr => planQtr.tag === tag);
  //   }
  //   return planQtrs;
  // };

  const getFilteredPlanQtrs = () => {
    if (filter === 'all') return planQtrs;

    if (filter.startsWith('q:')) {
      const q = Number(filter.split(':')[1]);
      return planQtrs.filter(p => p.quarter === q);
    }

    if (filter.startsWith('tag:')) {
      const tag = filter.split(':')[1];
      return planQtrs.filter(p => p.tag === tag);
    }

    if (filter === 'fav') {
      return planQtrs.filter(p => p.isFav);
    }

    return planQtrs;
  };


  const handleFavToggle = async (id, newIsFav) => {
    try {
      await axios.put(`${VITE_BASE_URL}/api/planQtr/fav/${id}`, {
        isFav: newIsFav,
      });
      setPlanQtrs(prev =>
        prev.map(planQtr =>
          planQtr._id === id ? { ...planQtr, isFav: newIsFav } : planQtr
        )
      );
      toast.success("Favourite status updated");
    } catch (err) {
      console.error("Favourite toggle failed:", err);
      toast.error("Failed to update favourite status");
    }
  };



  const handleTagChange = async (id, newTag) => {
    try {
      await axios.put(`${VITE_BASE_URL}/api/planQtr/tag/${id}`, {
        tag: newTag,
      });
      setPlanQtrs(prev =>
        prev.map(planQtr =>
          planQtr._id === id ? { ...planQtr, tag: newTag } : planQtr
        )
      );
      toast.success("Tag updated");
    } catch (err) {
      console.error("Tag update failed:", err);
      toast.error("Failed to update tag");
    }
  };

  const getEmptyMessage = () => {
    if (filter === 'all') {
      return 'No quarterly plans found.';
    }

    if (filter === 'fav') {
      return 'No favourite quarterly plans found.';
    }

    if (filter.startsWith('q:')) {
      const q = filter.split(':')[1];
      return `No ${q}-month quarterly plans found.`;
    }

    if (filter.startsWith('tag:')) {
      const tag = filter.split(':')[1];
      return `No ${tag} quarterly plans found.`;
    }

    return 'No quarterly plans found.';
  };


  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!quarter) newErrors.quarter = 'Quarter is required';
    if (!desc || desc.trim() === '' || desc === '<p>&nbsp;</p>') newErrors.desc = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const quarterOptions = [
    { label: "Done", value: "done", dot: "banking" },
    { label: "Pending", value: "pending", dot: "agri" },
    { label: "Important", value: "important", dot: "health" },
    { label: "Trash", value: "trash", dot: "business" }
  ];

  return (

    <div className="alt-menu sidebar-noneoverflow">
      {(loading.page || loading.action) && (<Loader />)}
      <Navbar />
      <div className="main-container sidebar-closed sbar-open" id="container">
        <div className="overlay" />
        <div className="cs-overlay" />
        <div className="search-overlay" />
        <Sidebar />
        <div id="content" className="main-content">
          <div className="layout-px-spacing">
            <div className="row app-notes layout-top-spacing" id="cancel-row">
              <div className="col-lg-12">
                <div className="app-hamburger-container">
                  <div className="hamburger">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu chat-menu d-xl-none"><line x1={3} y1={12} x2={21} y2={12} /><line x1={3} y1={6} x2={21} y2={6} /><line x1={3} y1={18} x2={21} y2={18} /></svg>
                  </div>
                </div>
                <div className="app-container">
                  <div className="app-note-container">
                    <div className="app-note-overlay" />
                    <div className="tab-title">
                      <div className="row">
                        <div className="col-md-12 text-center">
                          <a className="btn btn-dark" href="#"
                            onClick={(e) => { e.preventDefault(); handleAddPlanQtr(); }}>
                            Add
                          </a>
                        </div>
                        <div className="col-md-12 mt-5">
                          <ul className="nav nav-pills d-block" role="tablist">
                            <li className="nav-item">
                              <a className="nav-link list-actions" onClick={() => setFilter('all')}>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg> */}
                                All  Qaterly Plans
                              </a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link list-actions" onClick={() => setFilter('q:3')}>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg> */}
                                3 Months
                              </a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link list-actions" onClick={() => setFilter('q:6')}>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>  */}
                                6 Months
                              </a>
                            </li>
                            <li className="nav-item">
                              <a className="nav-link list-actions" onClick={() => setFilter('q:9')}>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>  */}
                                9 Months
                              </a>
                            </li>

                          </ul>
                          <hr />
                          <p className="group-section">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-tag">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                              <line x1={7} y1={7} x2={7} y2={7} />
                            </svg> Type
                          </p>
                          <ul className="nav nav-pills d-block group-list">
                            {/* <li className="nav-item">
                              <a className="nav-link list-actions g-dot-primary" onClick={() => setFilter('tag:personal')}>Personal</a>
                            </li> */}
                            {/* <li className="nav-item">
                              <a className="nav-link list-actions g-dot-warning" onClick={() => setFilter('tag:work')}>Work</a>
                            </li> */}
                            {/* <li className="nav-item">
                              <a className="nav-link list-actions g-dot-success" onClick={() => setFilter('tag:social')}>Social</a>
                            </li> */}
                            {/* <li className="nav-item">
                              <a className="nav-link list-actions g-dot-danger" onClick={() => setFilter('tag:important')}>Important</a>
                            </li> */}
                            {/* <li className="nav-item">
                              <a className="nav-link list-actions g-dot-bibilical" onClick={() => setFilter('tag:bibilical')}>Bibilical</a>
                            </li> */}
                          </ul>
                          <ul className="nav nav-pills d-block group-list">
                            {quarterOptions.map(q => (
                              <li className="nav-item" key={q.value}>
                                <a
                                  className={`nav-link list-actions g-dot-${q.dot}`}
                                  onClick={() => setFilter(`tag:${q.value}`)}
                                >
                                  {q.label}
                                </a>
                              </li>
                            ))}
                          </ul>


                        </div>
                      </div>
                    </div>

                    <div id="ct" className="note-container note-grid">
                      {getFilteredPlanQtrs().length === 0 ? (
                        <p className="text-center text-muted mt-4">
                          {getEmptyMessage()}
                        </p>
                      ) : (
                        getFilteredPlanQtrs().map(planQtr => (
                          <PlanQtrCard key={planQtr._id} planQtr={planQtr} onDelete={handleRemovePlanQtr} onToggleFav={handleFavToggle} onTagChange={handleTagChange} onEdit={handleEditPlanQtr} setLoading={(loader) => setLoading(prev => ({ ...prev, action: loader }))} />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal */}
                <div className="modal fade" id="notesMailModal" tabIndex={-1} role="dialog" ref={modalRef}>
                  <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '700px' }} role="document">
                    <div className="modal-content">
                      <div className="modal-body">
                        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} className="feather feather-x close" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" onClick={() => {
                          setTitle('');
                          setDescription('');
                          bsModalRef.current?.hide();
                        }}>
                          <line x1={18} y1={6} x2={6} y2={18} />
                          <line x1={6} y1={6} x2={18} y2={18} />
                        </svg>
                        <div className="notes-box">
                          <div className="notes-content">
                            <form onSubmit={(e) => e.preventDefault()}>
                              <div className="row">
                                <div className="col-md-12 mb-2">
                                  <label className={`form-label ${errors.title ? 'text-danger' : ''}`}>
                                    Title <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className={`form-control ${errors.title ? 'border border-danger' : ''}`}
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                  />
                                </div>
                                <div className="col-md-12 mb-2">
                                  <label className={`form-label ${errors.quarter ? 'text-danger' : ''}`}>
                                    Quarter <span className="text-danger">*</span>
                                  </label>

                                  <select
                                    className={`form-control ${errors.quarter ? 'border border-danger' : ''}`}
                                    value={quarter}
                                    onChange={(e) => setQuarter(Number(e.target.value))}
                                  >
                                    <option value="" hidden>Select Quarter</option>
                                    <option value="3">3 Months</option>
                                    <option value="6">6 Months</option>
                                    <option value="9">9 Months</option>
                                  </select>
                                </div>


                                <div className="col-md-12 mb-2">
                                  <label className={`form-label ${errors.desc ? 'text-danger' : ''}`}>
                                    Description <span className="text-danger">*</span>
                                  </label>
                                  <div className={`${errors.desc ? 'border border-danger rounded' : ''}`}>
                                    <CKEditor
                                      editor={ClassicEditor}
                                      config={{ licenseKey: "GPL" }}
                                      data={desc}
                                      onReady={(editor) => {
                                        // console.log("PlanQtrs CKEditor ready!", editor);
                                      }}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setDescription(data);
                                      }}
                                    />
                                  </div>

                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button className="btn" onClick={() => {
                          setTitle('');
                          setDescription('');
                          bsModalRef.current?.hide();
                        }}>Discard</button>
                        <button className="btn btn-primary" onClick={isEditMode ? updatePlanQtr : savePlanQtr}>{isEditMode ? 'Update' : 'Add'}</button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Modal */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlanQuarterly;
