import React from 'react'
import StatisticsWidget from '../components/index/StatisticsWidget'
import AreaChartWidget from '../components/index/AreaChartWidget'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Expenses from '../components/index/Expenses'
import TotalBalance from '../components/index/TotalBalance'
import ActivityLog from '../components/index/ActivityLog'
import VisitorsByBrowser from '../components/index/VisitorsByBrowser'
import Media from '../components/index/Media'
import Footer from '../components/Footer'
import MedicalStatsChart from '../components/index/MedicalStatsChart'
import UniqueVisitors from '../components/index/UniqueVisitors'


const Index = () => {
    return (
        <div className="alt-menu sidebar-noneoverflow">
            <div>
                {/* BEGIN LOADER */}
                {/* <div id="load_screen"> <div className="loader"> <div className="loader-content">
                    <div className="spinner-grow align-self-center" />
                </div></div></div> */}
                {/*  END LOADER */}
                <Navbar />
                {/*  BEGIN MAIN CONTAINER  */}
                <div className="main-container sidebar-closed sbar-open" id="container">
                    <div className="overlay" />
                    <div className="cs-overlay" />
                    <div className="search-overlay" />
                    {/*  BEGIN SIDEBAR  */}
                    <Sidebar />
                    {/*  END SIDEBAR  */}
                    {/*  BEGIN CONTENT AREA  */}
                    <div id="content" className="main-content">
                        <div className="layout-px-spacing">
                            <div className="row layout-top-spacing">
                                <StatisticsWidget />
                                <Expenses />
                                <TotalBalance />
                                <UniqueVisitors />
                                {/* <div className="col-xl-9 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                                    <MedicalStatsChart />
                                </div> */}
                                <ActivityLog />
                                <VisitorsByBrowser />
                                <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                                    <div className="row widget-statistic">

                                        {/* Followers */}
                                        <AreaChartWidget
                                            title="Followers"
                                            value="31.6K"
                                            label="Followers"
                                            color="#007bff"
                                            data={[10, 15, 18, 25, 20, 30, 35, 40]}
                                            icon={
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx={9} cy={7} r={4} />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                            }
                                        />

                                        {/* Referral */}
                                        <AreaChartWidget
                                            title="Referral"
                                            value="1,900"
                                            label="Referral"
                                            color="#dc3545"
                                            data={[5, 10, 6, 15, 12, 20, 18, 24]}
                                            icon={
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-link">
                                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                                </svg>
                                            }
                                        />

                                        {/* Engagement */}
                                        <AreaChartWidget
                                            title="Engagement"
                                            value="18.2%"
                                            label="Engagement"
                                            color="#28a745"
                                            data={[8, 12, 14, 10, 18, 16, 20, 22]}
                                            icon={
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
                                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                                </svg>
                                            }
                                        />

                                    </div>
                                </div>
                                <Media />
                            </div>
                        </div>
                    </div>
                    {/*  END CONTENT AREA  */}
                </div>
                {/* END MAIN CONTAINER */}
                <Footer />
            </div>

        </div>
    )
}

export default Index
