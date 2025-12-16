import React from "react";
import Chart from "react-apexcharts";

const StatisticsWidget = () => {
    const sparklineBase = {
        chart: {
            type: "line",
            sparkline: { enabled: true },
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        tooltip: {
            enabled: true,
            theme: "light", // or "dark" for dark theme
            style: {
                fontSize: '12px'
            },
            x: {
                show: false,
            },
            marker: {
                show: true,
            }
        }
    };

    const totalVisitsOptions = {
        ...sparklineBase,
        colors: ["#00c9a7"], // Teal
    };

    const paidVisitsOptions = {
        ...sparklineBase,
        colors: ["#f8b400"], // Orange
    };

    const sparklineData = [25, 45, 35, 55, 45, 65, 50]; // Sample data

    return (

        <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
            <div className="widget widget-one">
                <div className="widget-heading d-flex justify-content-between">
                    <h6>Statistics</h6>
                    <div className="dropdown">
                        <a className="dropdown-toggle" href="#" data-toggle="dropdown">
                            <i className="feather feather-more-horizontal"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="#">View</a>
                            <a className="dropdown-item" href="#">Download</a>
                        </div>
                    </div>
                </div>

                <div className="w-chart d-flex justify-content-between">
                    {/* Total Visits */}
                    <div className="w-chart-section total-visits-content me-4">
                        <div className="w-detail">
                            <p className="w-title">Total Visits</p>
                            <p className="w-stats" style={{ color: "#ff4c9d", fontWeight: "bold", fontSize: "20px" }}>
                                423,964
                            </p>
                        </div>
                        <div className="w-chart-render-one">
                            <Chart
                                options={totalVisitsOptions}
                                series={[{ data: sparklineData }]}
                                type="line"
                                height={80}
                                width={150}
                            />
                        </div>
                    </div>

                    {/* Paid Visits */}
                    <div className="w-chart-section paid-visits-content">
                        <div className="w-detail">
                            <p className="w-title">Paid Visits</p>
                            <p className="w-stats" style={{ color: "#ff4c9d", fontWeight: "bold", fontSize: "20px" }}>
                                7,929
                            </p>
                        </div>
                        <div className="w-chart-render-one">
                            <Chart
                                options={paidVisitsOptions}
                                series={[{ data: [10, 25, 20, 35, 30, 40, 37] }]}
                                type="line"
                                height={80}
                                width={150}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default StatisticsWidget;
