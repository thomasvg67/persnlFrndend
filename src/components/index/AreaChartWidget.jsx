import React from 'react';
import Chart from 'react-apexcharts';

const AreaChartWidget = ({ title, value, label, icon, data, color = '#1abc9c' }) => {
  const chartOptions = {
    chart: {
      type: 'area',
      height: 100,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      opacity: 0.3,
      type: 'solid',
    },
    colors: [color],
    tooltip: {
      enabled: true,
      theme: 'light',
      x: { show: false },
      y: {
        title: {
          formatter: () => '',
        },
      },
    },
    grid: { show: false },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
    },
  };

  const chartSeries = [
    {
      name: title,
      data: data || [],
    },
  ];

  return (
    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 layout-spacing">
      <div className={`widget widget-one_hybrid widget-${label.toLowerCase()}`}>
        <div className="widget-heading">
          <div className="w-title">
            <div className="w-icon">
              {icon}
            </div>
            <div>
              <p className="w-value">{value}</p>
              <h5>{label}</h5>
            </div>
          </div>
        </div>
        <div className="widget-content">
          <div className="w-chart">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaChartWidget;
