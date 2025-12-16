import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const SalesByCategory = () => {
    const [chartData] = useState({
        series: [500, 300, 270], // Sample data: Apparel, Sports, Others
        options: {
            chart: {
                type: 'donut',
            },
            labels: ['Apparel', 'Sports', 'Others'],
            colors: ['#6f42c1', '#e0a800', '#f26666'], // Matching image colors
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: true,
                position: 'bottom',
                markers: {
                    radius: 5
                }
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val.toFixed(1)}`,
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '22px',
                                color: '#f26666',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '22px',
                                fontWeight: 600,
                                offsetY: 10,
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                fontSize: '22px',
                                fontWeight: 500,
                                color: '#f26666',
                                formatter: () => `270`,
                            },
                        },
                    },
                },
            },
        },
    });

    return (
        <div className="widget widget-chart-two">
            <div className="widget-heading">
                <h5 className="">Sales by Category</h5>
            </div>
            <div className="widget-content">
                <div id="chart-2">
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                        height="320"
                    />
                </div>
            </div>
        </div>
    );
};

export default SalesByCategory;
