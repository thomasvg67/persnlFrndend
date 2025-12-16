import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader'; // Use your loader component path

const AddNewNames = () => {
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const [subCategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [meaning, setMeaning] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      subCategory,
      name,
      source,
      meaning,
      sts: active
    };

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${VITE_BASE_URL}/api/names`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Name added successfully!');
      console.log(res.data);

      // Reset form
      setSubCategory('');
      setName('');
      setSource('');
      setMeaning('');
      setActive(true);
    } catch (err) {
      console.error('Error adding name:', err.response?.data || err.message);
      toast.error('Failed to add name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alt-menu sidebar-noneoverflow">
      <Navbar />
      <div className="main-container sidebar-closed sbar-open" id="container">
        <div className="overlay" />
        <div className="cs-overlay" />
        <div className="search-overlay" />
        <Sidebar />

        {loading && <Loader />}

        <div id="content" className="main-content">
          <div className="layout-px-spacing">
            <div className="row layout-spacing layout-top-spacing" id="cancel-row">
              <div className="col-lg-12">
                <div className="widget-content searchable-container list">
                  <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                    <form id="addSubCategory" className="section contact" onSubmit={handleSubmit}>
                      <div className="info">
                        <h5>Add Names</h5>
                        <div className="row">
                          <div className="col-md-11 mx-auto">
                            <div className="row">
                              {/* Sub Category */}
                              <div className="col-md-8 mb-3">
                                <div className="form-group">
                                  <label htmlFor="subCategory">
                                    Sub Category <span className="text-danger">*</span>
                                  </label>
                                  <select
                                    className="form-control"
                                    id="subCategory"
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                    required
                                  >
                                    <option value="">Select</option>
                                    <option value="General">General</option>
                                    <option value="Christian">Christian</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Budist">Budist</option>
                                    <option value="Muslim">Muslim</option>
                                  </select>
                                </div>
                              </div>

                              {/* Name */}
                              <div className="col-md-8 mb-3">
                                <div className="form-group">
                                  <label htmlFor="name">
                                    Name <span className="text-danger">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                  />
                                </div>
                              </div>

                              {/* Source */}
                              <div className="col-md-8 mb-3">
                                <div className="form-group">
                                  <label htmlFor="source">Source</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="source"
                                    placeholder="Source"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* Meaning */}
                              <div className="col-md-12 mb-3">
                                <div className="form-group">
                                  <label htmlFor="meaning">Meaning</label>
                                  <div className="contact-review">
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                      <CKEditor
                                        editor={ClassicEditor}
                                        config={{ licenseKey: 'GPL' }}
                                        data={meaning}
                                        onChange={(event, editor) => {
                                          const data = editor.getData();
                                          setMeaning(data);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Active Checkbox */}
                              <div className="col-md-12 mb-3">
                                <div className="form-group">
                                  <label className="d-block" htmlFor="active">Active</label>
                                  <input
                                    type="checkbox"
                                    id="active"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                  />{' '}
                                  <span>Is Active?</span>
                                </div>
                              </div>
                            </div>

                            {/* Submit */}
                            <div className="text-right mt-3">
                              <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* main-container */}
    </div>
  );
};

export default AddNewNames;
