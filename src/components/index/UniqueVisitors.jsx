import React from 'react';
import Chart from 'react-apexcharts';

const UniqueVisitors = () => {
  const series = [
    {
      name: 'Direct',
      data: [55, 42, 52, 56, 53, 60, 58, 61, 57, 63, 49, 60]
    },
    {
      name: 'Organic',
      data: [87, 73, 81, 98, 95, 84, 100, 87, 111, 95, 68, 72]
    }
  ];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    colors: ['#a855f7', '#facc15'], // Purple, Yellow
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.95,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
      markers: {
        width: 10,
        height: 10,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: val => `${val}`
      }
    },
    grid: {
      borderColor: '#e5e7eb', // light gray
      strokeDashArray: 4
    }
  };

  return (
    <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
      <div className="widget widget-chart-three border rounded p-3 shadow-sm bg-white">
        <div className="widget-heading d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Unique Visitors</h5>
          <div className="dropdown">
            <a
              className="dropdown-toggle"
              href="#"
              role="button"
              id="uniqueVisitors"
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
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="uniqueVisitors"
            >
              <a className="dropdown-item" href="#">View</a>
              <a className="dropdown-item" href="#">Update</a>
              <a className="dropdown-item" href="#">Download</a>
            </div>
          </div>
        </div>
        <div className="widget-content">
          <Chart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
};

export default UniqueVisitors;
