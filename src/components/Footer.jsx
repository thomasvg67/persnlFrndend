import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Footer = () => {
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = () => {
            axios
                .get(`${VITE_BASE_URL}/api/alerts/today`)
                .then((res) => {
                    const data = res.data || [];

                    data.forEach((alert) => {
                        const now = Date.now();
                        const alertTime = new Date(alert.alertTime).getTime();
                        const delay = alertTime - now;

                        if (delay <= 0) {
                            // Already due, show immediately
                            setAlerts((prev) => {
                                if (prev.find((a) => a._id === alert._id)) return prev;
                                return [...prev, alert];
                            });
                        } else {
                            // Schedule future popup
                            setTimeout(() => {
                                setAlerts((prev) => {
                                    if (prev.find((a) => a._id === alert._id)) return prev;
                                    return [...prev, alert];
                                });
                            }, delay);
                        }
                    });
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Error fetching today's alerts");
                });
        };

        // fetch on mount
        fetchAlerts();

        // poll every minute
        const interval = setInterval(fetchAlerts, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleContactSaved = (e) => {
            const savedId = e.detail;
            setAlerts(prev => prev.filter(a => a.contactId?._id !== savedId));
        };

        window.addEventListener("contact-saved", handleContactSaved);

        return () => window.removeEventListener("contact-saved", handleContactSaved);
    }, []);



    const handleSnooze = (alertId, minutes) => {
        if (minutes === 1440) {
            // 1 day snooze should use the snoozeOneDay route
            axios
                .put(`${VITE_BASE_URL}/api/alerts/snooze1d/${alertId}`)
                .then(() => {
                    toast.success("Snoozed for 1 day");
                    setAlerts(prev => prev.filter(a => a._id !== alertId));
                    if (alerts.length === 1) {
                        window.$('#alertModal').modal('hide');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Error snoozing 1-day alert");
                });
        } else {
            // normal minutes snooze
            const newTime = new Date(Date.now() + minutes * 60 * 1000);
            axios
                .put(`${VITE_BASE_URL}/api/alerts/edit/${alertId}`, {
                    alertTime: newTime.toISOString(),
                })
                .then(() => {
                    toast.success(`Snoozed for ${minutes} minutes`);
                    setAlerts(prev => prev.filter(a => a._id !== alertId));
                    if (alerts.length === 1) {
                        window.$('#alertModal').modal('hide');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Error snoozing alert");
                });
        }
    };


    return (
        <div>
            <div className="footer-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "30px" }}>
                <div className="footer-section f-section-1">
                    <p className="">Copyright © 2009 - {new Date().getFullYear()}{" "} <a target="_blank" href="https://www.zoomlabs.in">Zoomlabs</a>, All rights reserved.</p>
                </div>
                <div className="footer-section f-section-2">
                    <p className="">Designed and developed by <a target="_blank" href="https://www.zoomlabs.in">zoomlabs</a></p>
                </div>

            </div> 
            {/* ALERT MODAL */}

            {alerts.length > 0 && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 9999,
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        width: "410px",         
                        maxHeight: "500px",     
                        overflowY: "auto",
                        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
                    }}
                >
                    <h5 style={{ marginBottom: "10px", fontSize: "18px" }}>Today's Alerts</h5>
                    {alerts.map(alert => (
                        <div
                            key={alert._id}
                            style={{
                                background: "rgba(255,255,255,0.1)",
                                padding: "12px",
                                borderRadius: "4px",
                                marginBottom: "10px",
                                fontSize: "16px"
                            }}
                        >
                            <Link
                                to={`/cnts?editContact=${alert.contactId?._id}`}
                                style={{ color: "white", textDecoration: "none", display: "block" }}
                            >
                                <strong>{alert.contactId?.name || "N/A"}</strong><br />
                                {alert.subject || "No subject"}<br />
                                <small style={{ fontSize: "14px" }}>{new Date(alert.alertTime).toLocaleString()}</small>
                            </Link>
                            <div
                                style={{
                                    marginTop: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    flexWrap: "nowrap",
                                    gap: "4px",
                                    fontSize: "15px"
                                }}
                            >
                                <span style={{ marginRight: "5px" }}>Snooze:</span>
                                <button
                                    className="btn btn-sm btn-light rounded-pill"
                                    style={{ fontSize: "14px" }}
                                    onClick={() => handleSnooze(alert._id, 30)}
                                >
                                    30m
                                </button>
                                <button
                                    className="btn btn-sm btn-light rounded-pill"
                                    style={{ fontSize: "14px" }}
                                    onClick={() => handleSnooze(alert._id, 60)}
                                >
                                    1h
                                </button>
                                <button
                                    className="btn btn-sm btn-light rounded-pill"
                                    style={{ fontSize: "14px" }}
                                    onClick={() => handleSnooze(alert._id, 180)}
                                >
                                    3h
                                </button>
                                <button
                                    className="btn btn-sm btn-light rounded-pill"
                                    style={{ fontSize: "14px" }}
                                    onClick={() => handleSnooze(alert._id, 1440)}
                                >
                                    1day
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}



        </div>
    )
}

export default Footer;