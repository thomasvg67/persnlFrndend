import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

const TotalOrders = () => {
  useEffect(() => {
    const options = {
      chart: {
        type: 'area',
        height: 120,
        sparkline: { enabled: true },
      },
      series: [
        {
          name: 'Orders',
          data: [20, 35, 25, 45, 30, 40, 28],
        },
      ],
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#20c997'], // green
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      tooltip: {
        enabled: false,
      },
    };

    const chart = new ApexCharts(document.querySelector('#total-orders'), options);
    chart.render();

    return () => chart.destroy();
  }, []);

  return (
    <div className="widget-one widget">
      <div className="widget-content">
        <div className="w-numeric-value">
          <div className="w-icon" style={{ background: '#e6faf5', padding: 12, borderRadius: 12 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#20c997" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
              <circle cx={9} cy={21} r={1} />
              <circle cx={20} cy={21} r={1} />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div className="w-content">
            <span className="w-value">3,192</span>
            <span className="w-numeric-title">Total Orders</span>
          </div>
        </div>
        <div className="w-chart">
          <div id="total-orders"></div>
        </div>
      </div>
    </div>
  );
};

export default TotalOrders;
