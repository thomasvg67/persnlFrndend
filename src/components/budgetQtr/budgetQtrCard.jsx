import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import axios from "axios";

const tagClasses = {
  q1: "note-banking",   // 1st Quarter
  q2: "note-agri",      // 2nd Quarter
  q3: "note-health",    // 3rd Quarter
  q4: "note-business",  // 4th Quarter

  "": "note-default"
};

const quarterOptions = [
  { label: "1st Quarter", value: "q1", dot: "banking" },
  { label: "2nd Quarter", value: "q2", dot: "agri" },
  { label: "3rd Quarter", value: "q3", dot: "health" },
  { label: "4th Quarter", value: "q4", dot: "business" }
];


const BudgetQtrCard = ({ budgetQtr, onDelete, onToggleFav, onTagChange, setLoading, onEdit }) => {

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const [tag, setTag] = useState(budgetQtr.tag || "");
  const [isFav, setIsFav] = useState(Boolean(budgetQtr.isFav));

  useEffect(() => {
    setIsFav(Boolean(budgetQtr.isFav));
  }, [budgetQtr.isFav]);

  const handleTagChange = async (newTag) => {
    // setLoading?.(true);
    try {
      const res = await axios.put(`${VITE_BASE_URL}/api/budgetQtr/tag/${budgetQtr._id}`, {
        tag: newTag,
      });
      if (res.data.success) {
        setTag(newTag);
        onTagChange?.(budgetQtr._id, newTag);
      } else {
        toast.error(res.data.message || 'Tag update failed');
      }
    } catch (err) {
      console.error('Error updating tag:', err);
      toast.error('Server error during tag update');
    } finally {
      // setLoading?.(false);
    }
  };

  const handleFavToggle = async () => {
    // setLoading?.(true);
    try {
      const res = await axios.put(`${VITE_BASE_URL}/api/budgetQtr/fav/${budgetQtr._id}`, {
        isFav: !isFav,
      });
      if (res.data.success) {
        setIsFav(!isFav);
        onToggleFav?.(budgetQtr._id, !isFav);
      } else {
        toast.error(res.data.message || 'Failed to update favourite');
      }
    } catch (err) {
      console.error("Error updating favourite status:", err);
      toast.error("Server error while updating favourite");
    } finally {
      // setLoading?.(false);
    }
  };

  const handleDelete = async () => {
    // setLoading?.(true);
    try {
      const res = await axios.delete(`${VITE_BASE_URL}/api/budgetQtr/${budgetQtr._id}`);
      if (res.data.success) {
        onDelete?.(budgetQtr._id);
      } else {
        toast.error(res.data.message || 'Delete failed');
      }
    } catch (err) {
      console.error("Error deleting budgetQtr:", err);
      toast.error("Server error while deleting budgetQtr");
    } finally {
      // setLoading?.(false);
    }
  };


  const formattedDate = new Date(budgetQtr.crtdOn).toLocaleDateString();

  return (
    <div className={`note-item all-notes ${tagClasses[tag] || 'note-default'}`}>
      <div className="note-inner-content">
        <div className="note-content">
          <p className="note-title" data-notetitle={budgetQtr.title}>{budgetQtr.title}</p>
          <p className="meta-time">{formattedDate}</p>
          <div className="note-description-content">
            <div className="note-description-content">
              <div
                className="note-description"
                data-notedescription={budgetQtr.desc}
                dangerouslySetInnerHTML={{ __html: budgetQtr.desc }}
              />
            </div>
          </div>
        </div>
        <div className="note-action">
          {/* Favourite Star */}
          <svg
            onClick={handleFavToggle}
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill={isFav ? "gold" : "none"}
            stroke={isFav ? "gold" : "currentColor"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-star fav-note"
            style={{ cursor: 'pointer' }}
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 
              12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill={isFav ? "gold" : "none"} // Fully filled star
            />
          </svg>

          {/* Edit Icon */}
          {/* <svg
            onClick={() => onEdit(note)}
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-edit"
            style={{ cursor: 'pointer', marginLeft: 8 }}
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg> */}

          {/* Delete Icon */}
          <svg
            onClick={handleDelete}
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-trash-2 delete-note"
            style={{ cursor: 'pointer' }}
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1={10} y1={11} x2={10} y2={17} />
            <line x1={14} y1={11} x2={14} y2={17} />
          </svg>
        </div>

        <div className="note-footer">
          <div className="tags-selector btn-group">
            <a className="nav-link dropdown-toggle d-icon label-group" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="true">
              <div className="tags">
                {/* <div className="g-dot-personal" />
                <div className="g-dot-work" /> */}
                {/* <div className="g-dot-social" /> */}
                {/* <div className="g-dot-important" /> */}
                {/* <div className='g-dot-bibilical' /> */}
                <div className="g-dot-banking" />
                <div className="g-dot-agri" />
                <div className="g-dot-health" />
                <div className="g-dot-business" />
                {/* <div className="g-dot-allopathy" />
                <div className="g-dot-ayurvedam" />
                <div className="g-dot-homio" />
                <div className="g-dot-electronics" /> */}
                {/* <div className="g-dot-software" />
                <div className="g-dot-general" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  className="feather feather-more-vertical">
                  <circle cx={12} cy={12} r={1} />
                  <circle cx={12} cy={5} r={1} />
                  <circle cx={12} cy={19} r={1} />
                </svg>
              </div>
            </a>
            {/* <div className="dropdown-menu dropdown-menu-right d-icon-menu">
              {["personal", "work", "social", "important", "bibilical"].map((t) => (
                <a
                  key={t}
                  onClick={() => handleTagChange(t)}
                  className={`dropdown-item position-relative g-dot-${t} note-${t} label-group-item label-${t}`}
                  href="#"
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </a>
              ))}
            </div> */}
            <div className="dropdown-menu dropdown-menu-right d-icon-menu">
              {quarterOptions.map(q => (
                <a
                  key={q.value}
                  onClick={() => handleTagChange(q.value)}
                  className={`dropdown-item position-relative g-dot-${q.dot} note-${q.dot} label-group-item`}
                  href="#"
                >
                  {q.label}
                </a>
              ))}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetQtrCard;
