import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const MedicalStatsChart = () => {
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    axios.get(`${VITE_BASE_URL}/api/medical-stats/chart-data`)
      .then(res => {
        const data = res.data; // expected format: [{ date, sugar, pressure, weight }]

        // Extract all dates as categories
        const xCategories = data.map(entry => {
          const date = new Date(entry.date);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = String(date.getFullYear()).slice(-2); // last two digits
          return `${day}-${month}-${year}`;
        });

        // Extract data points per metric
        const sugarData = data.map(entry => entry.sugar || 0);
        const pressureData = data.map(entry => entry.pressure || 0);
        const weightData = data.map(entry => entry.weight || 0);

        setCategories(xCategories);
        setChartSeries([
          { name: 'Sugar', data: sugarData },
          { name: 'Pressure', data: pressureData },
          { name: 'Weight', data: weightData },
        ]);
      })
      .catch(err => console.error('Chart data fetch failed:', err));
  }, []);

  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '11px',
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#1E90FF', '#FF4C61', '#28a745'], // blue, red, green
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
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
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
        },
      },
      title: {
        text: 'Date',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val,
      },
      title: {
        text: 'Measures',
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
    grid: {
      borderColor: '#eee',
    },
  };

  return (
    <div className="widget widget-chart-one">
      <div className="widget widget-chart-three  rounded p-2 shadow-sm bg-white">
        <div className="widget-heading d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Medical Statistics</h5>
          <div className="dropdown">
            <a
              className="dropdown-toggle"
              href="#"
              role="button"
              id="medicalStatsMenu"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-more-horizontal"
              >
                <circle cx={12} cy={12} r={1} />
                <circle cx={19} cy={12} r={1} />
                <circle cx={5} cy={12} r={1} />
              </svg>
            </a>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="medicalStatsMenu">
              <a className="dropdown-item" href="#">Weekly</a>
              <a className="dropdown-item" href="#">Monthly</a>
              <a className="dropdown-item" href="#">Yearly</a>
            </div>
          </div>
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
    </div>
  );
};

export default MedicalStatsChart;
