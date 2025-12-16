import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import MedicalStatsChart from '../components/index2/MedicalStatsChart'
import SalesByCategory from '../components/index2/SalesByCategory'
import DailySales from '../components/index2/DailySales'
import Summary from '../components/index2/Summary'
import TotalOrders from '../components/index2/TotalOrders'
import RecentActivities from '../components/index2/RecentActivities'
import Transactions from '../components/index2/Transactions'
import Wallet from '../components/index2/Wallet'
import RecentOrders from '../components/index2/RecentOrders'
import TopSellProd from '../components/index2/TopSellProd'

const Index2 = () => {
    return (
        <div className="alt-menu sidebar-noneoverflow">
            <Navbar />
            <div className="main-container sidebar-closed sbar-open" id="container">
                <div className="overlay" />
                <div className="cs-overlay" />
                <div className="search-overlay" />
                <Sidebar />
                <div id="content" className="main-content">
                    <div className="layout-px-spacing">
                        <div className="row layout-top-spacing">
                            <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                                <MedicalStatsChart />
                            </div>
                            <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                                <SalesByCategory />
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
                                <DailySales />
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 layout-spacing">
                                <Summary />
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                                <TotalOrders />
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                                <RecentActivities />
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                                <Transactions />
                            </div>
                            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                                <Wallet />
                            </div>
                            <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                                <RecentOrders />
                            </div>
                            <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                                <TopSellProd />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index2
