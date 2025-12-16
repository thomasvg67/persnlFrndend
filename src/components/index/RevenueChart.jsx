import React from 'react';
import Chart from 'react-apexcharts';

const RevenueChart = () => {
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#1E90FF', '#FF4C61'], // blue for income, red for expenses
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      markers: {
        radius: 12,
      },
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ],
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value / 1000}K`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val}`,
      },
    },
    grid: {
      borderColor: '#eee',
    },
  };

  const chartSeries = [
    {
      name: 'Income',
      data: [16500, 17000, 15000, 17500, 16000, 18000, 19000, 16500, 15500, 17000, 14000, 17500],
    },
    {
      name: 'Expenses',
      data: [16800, 17500, 15500, 17000, 16500, 20000, 17000, 16000, 18000, 19000, 18500, 19500],
    },
  ];

  return (
    <div className="widget widget-chart-one">
      <div className="widget-heading">
        <h5>Revenue</h5>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Total Profit <span className="text-primary">$10,840</span></span>
      </div>
      <div className="widget-content">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default RevenueChart;
