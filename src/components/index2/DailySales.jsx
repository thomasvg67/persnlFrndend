import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const DailySales = () => {
    const [chartData] = useState({
        series: [{
            name: 'Sales',
            data: [44, 55, 57, 56, 61, 58, 30] // Sample sales for Sun-Sat
        }],
        options: {
            chart: {
                type: 'bar',
                height: 200,
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: '40%',
                    borderRadius: 5,
                }
            },
            colors: ['#e0a800'], // golden orange
            dataLabels: {
                enabled: false
            },
            grid: {
                show: false,
            },
            xaxis: {
                categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        colors: '#999',
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                show: false
            },
            tooltip: {
                y: {
                    formatter: val => `Sales: ${val}`
                }
            }
        }
    });

    return (
        <div className="widget-two">
            <div className="widget-content">
                <div className="w-numeric-value">
                    <div className="w-content">
                        <span className="w-value">Daily sales</span>
                        <span className="w-numeric-title">Go to columns for details.</span>
                    </div>
                    <div className="w-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><line x1={12} y1={1} x2={12} y2={23} /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                </div>
                <div className="w-chart">
                    <div id="daily-sales">
                        <Chart
                            options={chartData.options}
                            series={chartData.series}
                            type="bar"
                            height={200}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailySales;
