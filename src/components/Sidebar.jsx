import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const menuCategoriesRef = useRef(null);
    
    // State for expandable menus - all initially closed
    const [expandedMenus, setExpandedMenus] = useState({
        dashboard: false,
        notesCategories: false,
        memories: false,
        authentication: false,
        users: false,
        pages: false,
        futureMenu: false,
        yearlyMenu: false,
        quarterlyMenu: false,
        pagesError: false
    });

    // Function to scroll a menu item to the top
    const scrollToMenuItem = (element) => {
        if (!element || !menuCategoriesRef.current) return;
        
        const scrollContainer = menuCategoriesRef.current;
        const elementTop = element.offsetTop;
        
        // Scroll the element to top with a small offset (12px as in your original code)
        scrollContainer.scrollTop = elementTop - 200;
    };

    // Function to scroll active menu item to top (for route changes)
    const scrollActiveMenuToTop = () => {
        // Try to find an active submenu item first
        const activeSubItem = document.querySelector('.submenu li.active');
        if (activeSubItem) {
            const parentMenu = activeSubItem.closest('.menu');
            if (parentMenu) {
                scrollToMenuItem(parentMenu);
            }
        } else {
            // If no active subitem, look for active menu item
            const activeMenuItem = document.querySelector('.menu.active:not(.menu-heading)');
            if (activeMenuItem) {
                scrollToMenuItem(activeMenuItem);
            }
        }
    };

    // Function to initialize PerfectScrollbar
    const initializeSidebar = () => {
        if (window.PerfectScrollbar) {
            new window.PerfectScrollbar('.menu-categories', {
                wheelSpeed: 0.5,
                swipeEasing: true,
                minScrollbarLength: 40,
                maxScrollbarLength: 300
            });
        }

        setTimeout(() => {
            scrollActiveMenuToTop();
        }, 100);
    };

    // Handle menu click - expand/collapse with accordion behavior
    const handleMenuClick = (menuId, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
        }
        
        // Close all other menus and toggle the clicked one (accordion behavior)
        setExpandedMenus(prev => {
            const newState = {};
            // First, close all menus
            Object.keys(prev).forEach(key => {
                newState[key] = false;
            });
            // Then, open the clicked menu if it was closed
            newState[menuId] = !prev[menuId];
            return newState;
        });
        
        // DO NOT scroll when opening/closing dropdown - only for toggle
    };

    // Handle nested menu click (like pagesError) - this should NOT close parent
    const handleNestedMenuClick = (menuId, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
        }
        
        // For nested menus, just toggle that specific menu without affecting others
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
        
        // DO NOT scroll when opening/closing nested dropdown
    };

    // Handle ALL menu selections (for simple links and submenu items)
    const handleMenuSelection = (e) => {
        if (e) {
            e.stopPropagation(); // Prevent event bubbling
        }
        
        // Find the menu item that was clicked
        const linkElement = e.currentTarget;
        let menuItem;
        
        // Check if this is a submenu item
        if (linkElement.closest('.submenu li')) {
            menuItem = linkElement.closest('.submenu li');
            // Also scroll the parent dropdown menu to top
            const parentMenu = menuItem.closest('.menu');
            if (parentMenu) {
                setTimeout(() => {
                    scrollToMenuItem(parentMenu);
                }, 10);
            }
        } 
        // Check if this is a simple menu link (not a dropdown toggle)
        else if (linkElement.closest('.menu') && !linkElement.closest('.menu .dropdown-toggle[href^="#"]')) {
            menuItem = linkElement.closest('.menu');
            setTimeout(() => {
                scrollToMenuItem(menuItem);
            }, 10);
        }
    };

    // Handle simple link clicks (non-expandable menus) - Updated
    const handleLinkClick = (e) => {
        handleMenuSelection(e);
    };

    // Handle submenu link clicks (items inside dropdowns) - Updated
    const handleSubmenuLinkClick = (e) => {
        handleMenuSelection(e);
    };

    // Determine if a menu item should be active based on current route
    const isMenuActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    // Check if any sub-item of a menu is active
    const hasActiveSubItem = (subPaths) => {
        return subPaths.some(path => isMenuActive(path));
    };

    // Initialize on component mount
    useEffect(() => {
        initializeSidebar();
        
        const handleResize = () => {
            setTimeout(() => {
                scrollActiveMenuToTop();
            }, 100);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Re-initialize when location changes
    useEffect(() => {
        setTimeout(() => {
            scrollActiveMenuToTop();
        }, 100);
    }, [location.pathname]);

    return (
        <div className="sidebar-wrapper sidebar-theme">
            <nav id="sidebar">
                <ul className="navbar-nav theme-brand flex-row text-center">
                    <li className="nav-item theme-logo">
                        <Link to="/">
                            <img src="/assets/img/logop.jpg" className="navbar-logo" alt="logo" />
                        </Link>
                    </li>
                    <li className="nav-item theme-text">
                        <Link to="/" className="nav-link"> PERSONAL </Link>
                    </li>
                </ul>
                <ul className="list-unstyled menu-categories" id="accordionExample" ref={menuCategoriesRef}>
                    <li className={`menu ${isMenuActive('/') || isMenuActive('/prsnl') ? 'active' : ''}`}>
                        <a 
                            href="#dashboard" 
                            className="dropdown-toggle" 
                            onClick={(e) => handleMenuClick('dashboard', e)}
                        >
                            <div className="">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                <span>Dashboard</span>
                            </div>
                            <div>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width={24} 
                                    height={24} 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth={2} 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    className="feather feather-chevron-right"
                                    style={{ 
                                        transform: expandedMenus.dashboard ? 'rotate(90deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>
                        </a>
                        <ul className={`collapse submenu list-unstyled ${expandedMenus.dashboard ? 'show' : ''}`} id="dashboard">
                            <li className={isMenuActive('/') ? 'active' : ''}>
                                <Link to="/" onClick={handleSubmenuLinkClick}> Analytics </Link>
                            </li>
                            <li>
                                <Link to="/" onClick={handleSubmenuLinkClick}> Finance </Link>
                            </li>
                            <li className={isMenuActive('/prsnl') ? 'active' : ''}>
                                <Link to="/prsnl" onClick={handleSubmenuLinkClick}> Personal </Link>
                            </li>
                        </ul>
                    </li>
                    {(user?.role === 'emplyT1' || user?.role === 'adm') && (<>
                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>APPLICATIONS</span></div>
                        </li>
                        <li className={`menu ${isMenuActive('/chat') ? 'active' : ''}`}>
                            <Link to="/chat" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                    <span>Chat</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/apps_mailbox') ? 'active' : ''}`}>
                            <Link to="/mailbox" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <span>Mailbox</span>
                                </div>
                            </Link>
                        </li>
                        <li className="menu menu-heading">
                            <div className="heading">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal">
                                    <circle cx={12} cy={12} r={1} />
                                    <circle cx={19} cy={12} r={1} />
                                    <circle cx={5} cy={12} r={1} />
                                </svg>
                                <span>MY OWN</span>
                            </div>
                        </li>


                        <li className={`menu ${isMenuActive('/tdLst') ? 'active' : ''}`}>
                            <Link to="/tdLst" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                    <span>Todo List</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/nts') ? 'active' : ''}`}>
                            <Link to="/nts" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /><polyline points="10 9 9 9 8 9" /></svg>
                                    <span>Notes</span>
                                </div>
                            </Link>
                        </li>
                        {/* <li className={`menu ${isMenuActive('/scrmBrd') ? 'active' : ''}`}>
                            <Link to="/scrmBrd" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-plus"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={12} y1={18} x2={12} y2={12} /><line x1={9} y1={15} x2={15} y2={15} /></svg>
                                    <span>Scrumboard</span>
                                </div>
                            </Link>
                        </li> */}
                        <li className={`menu ${isMenuActive('/cnts') ? 'active' : ''}`}>
                            <Link to="/cnts" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx={12} cy={10} r={3} /></svg>
                                    <span>Contacts</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/clndr') ? 'active' : ''}`}>
                            <Link to="/clndr" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg>
                                    <span>Events</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${expandedMenus.memories ? 'active' : ''} ${hasActiveSubItem(['/memris', '/memrisBday', '/memrisWedng', '/memrisDth', '/memrisOthr']) ? 'active' : ''}`}>
                            <a 
                                href="#memories" 
                                className="dropdown-toggle"
                                onClick={(e) => handleMenuClick('memories', e)}
                            >
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
                                        <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
                                        <circle cx={8.5} cy={8.5} r={1.5} />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    <span>Memories</span>
                                </div>
                                <div>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width={24} 
                                        height={24} 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth={2} 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        className="feather feather-chevron-right"
                                        style={{ 
                                            transform: expandedMenus.memories ? 'rotate(90deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease'
                                        }}
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </a>
                            <ul className={`collapse submenu list-unstyled ${expandedMenus.memories ? 'show' : ''}`} id="memories">
                                <li>
                                    <Link to="/memris" onClick={handleSubmenuLinkClick}> New Record </Link>
                                </li>
                                <li>
                                    <Link to="/memrisBday" onClick={handleSubmenuLinkClick}> Birthdays </Link>
                                </li>
                                <li>
                                    <Link to="/memrisWedng" onClick={handleSubmenuLinkClick}> Wedding </Link>
                                </li>
                                <li>
                                    <Link to="/memrisDth" onClick={handleSubmenuLinkClick}>Death Anniversary </Link>
                                </li>
                                <li>
                                    <Link to="/memrisOthr" onClick={handleSubmenuLinkClick}> Others </Link>
                                </li>
                            </ul>
                        </li>
                    </>)}
                    {user?.role === 'adm' && (<>
                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>MUTUAL FUNDS</span></div>
                        </li>
                        {/* <li className={`menu ${isMenuActive('/listTable') ? 'active' : ''}`}>
                            <Link to="/listTale" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx={12} cy={12} r={10} /><circle cx={12} cy={12} r={6} /><circle cx={12} cy={12} r={2} /></svg>
                                    <span>New Mutual Funds</span>
                                </div>
                            </Link>
                        </li> */}
                        <li className={`menu ${isMenuActive('/mutlFnd') ? 'active' : ''}`}>
                            <Link to="/mutlFnd" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                                    <span>All Mutual Funds</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/mutualFund/follow') ? 'active' : ''}`}>
                            <Link to="/mutualFund/follow" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-repeat"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                                    <span>Follow ups</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/mutualFund/snoozed') ? 'active' : ''}`}>
                            <Link to="/mutualFund/snoozed" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    <span>Snoozed</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/mutualFund/wishlist') ? 'active' : ''}`}>
                            <Link to="/mutualFund/wishlist" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15 10 23 10 17 14 19 22 12 17 5 22 7 14 1 10 9 10 12 2" /></svg>
                                    <span>Wish List</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/mutualFund/other') ? 'active' : ''}`}>
                            <Link to="/mutualFund/other" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l2 3h8a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>Others</span>
                                </div>
                            </Link>
                        </li>
                        {/* <li className="menu">
                            <Link to="/marketbank" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V13H9v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" /></svg>
                                    <span>Market / Bank</span>
                                </div>
                            </Link>
                        </li> */}
                        
                    </>)}

                    {user?.role === 'adm' && (<>
                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>SHARES</span></div>
                        </li>
                        {/* <li className={`menu ${isMenuActive('/listTable') ? 'active' : ''}`}>
                            <Link to="/listTabl" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx={12} cy={12} r={10} /><circle cx={12} cy={12} r={6} /><circle cx={12} cy={12} r={2} /></svg>
                                    <span>New Shares</span>
                                </div>
                            </Link>
                        </li> */}
                        <li className={`menu ${isMenuActive('/shrs') ? 'active' : ''}`}>
                            <Link to="/shrs" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                                    <span>All Shares</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/shrsFlw') ? 'active' : ''}`}>
                            <Link to="/shrsFlw" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-repeat"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                                    <span>Follow ups</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/shrsSnzd') ? 'active' : ''}`}>
                            <Link to="/shrsSnzd" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                    <span>Snoozed</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/shtsWshlst') ? 'active' : ''}`}>
                            <Link to="/shtsWshlst" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15 10 23 10 17 14 19 22 12 17 5 22 7 14 1 10 9 10 12 2" /></svg>
                                    <span>Wish List</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/shrsOthr') ? 'active' : ''}`}>
                            <Link to="/shrsOthr" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l2 3h8a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>Others</span>
                                </div>
                            </Link>
                        </li>

                        </>)}
                    

                    {user?.role === 'adm' && (<>
                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>OTHERS</span></div>
                        </li>
                        <li className={`menu ${isMenuActive('/quotes') ? 'active' : ''}`}>
                            <Link to="/quotes" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M7 17a5 5 0 0 1 0-10h1v6h2V7H7a7 7 0 0 0 0 14h1v-4H7z" />
                                        <path d="M17 17a5 5 0 0 1 0-10h1v6h2V7h-3a7 7 0 0 0 0 14h1v-4h-2z" />
                                    </svg>
                                    <span> Quotes / Adage </span>
                                </div>
                            </Link>
                        </li>
                    </>)}
                    
                    {(user?.role === 'emplyT1' || user?.role === 'adm') && (<>
                        <li className={`menu ${isMenuActive('/dict') ? 'active' : ''}`}>
                            <Link to="/dict" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-open" viewBox="0 0 24 24">
                                        <path d="M2 7v13a2 2 0 0 0 2 2h6" />
                                        <path d="M22 7v13a2 2 0 0 1-2 2h-6" />
                                        <path d="M12 5v20" />
                                    </svg>
                                    <span> Dictionary </span>
                                </div>
                            </Link>
                        </li>
                    </>)}
                    
                    {user?.role === 'adm' && (<>
                        <li className={`menu ${isMenuActive('/mdcSts') ? 'active' : ''}`}>
                            <Link to="/mdcSts" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                                    <span> Medical Statistics </span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/medic') ? 'active' : ''}`}>
                            <Link to="/medic" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pill" viewBox="0 0 24 24">
                                        <rect x="3" y="11" width="8" height="10" rx="2" ry="2" />
                                        <path d="M21 6.5c0 2.21-2.5 4-5.5 4S10 8.71 10 6.5 12.5 2.5 15.5 2.5 21 4.29 21 6.5z" />
                                        <path d="M14 6.5h7" />
                                    </svg>
                                    <span> Medicines </span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/diary') ? 'active' : ''}`}>
                            <Link to="/diary" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"> <path d="M11 4h10v10h-4v4h-6V8H5V4h6z" /></svg>
                                    <span> Diary </span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/gnrlNms') ? 'active' : ''}`}>
                            <Link to="/gnrlNms" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user" viewBox="0 0 24 24">
                                        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <span>  Names </span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/stry') ? 'active' : ''}`}>
                            <Link to="/stry" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-smile"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                                    <span> Stories </span>
                                </div>
                            </Link>
                        </li>
                        

                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>HIGHLY SECURED</span></div>
                        </li>

                        <li className={`menu ${isMenuActive('/bussIdea') ? 'active' : ''}`}>
                            <Link to="/bussIdea" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-feather-list"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                                    <span>Business</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/mission') ? 'active' : ''}`}>
                            <Link to="/mission" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>

                                    <span>My Mission</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/vission') ? 'active' : ''}`}>
                            <Link to="/vission" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12C3.73 5.52 8.5 2 12 2s8.27 3.52 11 10c-2.73 6.48-7.5 10-11 10s-8.27-3.52-11-10z" /><circle cx="12" cy="12" r="3" /></svg>

                                    <span>My Vision</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/myTmln') ? 'active' : ''}`}>
                            <Link to="/myTmln" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    <span>My Timeline</span>
                                </div>
                            </Link>
                        </li>

                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>BUDGETS</span></div>
                        </li>
                        {/* <li className="menu">
                            <Link to="/newbudget" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-plus"><polyline points="5 9 2 12 5 15" /><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                                    <span>New Record</span>
                                </div>
                            </Link>
                        </li> */}
                        <li className={`menu ${isMenuActive('/budget/yearly') ? 'active' : ''}`}>
                            <Link to="/budget/yearly" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    <span>Yearly</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/budget/halfYearly') ? 'active' : ''}`}>
                            <Link to="/budget/halfYearly" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    <span>Half Yearly</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/budgetQtr') ? 'active' : ''}`}>
                            <Link to="/budgetQtr" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    <span>Quarterly</span>
                                </div>
                            </Link>
                        </li>
                        {/* <li className={`menu ${expandedMenus.authentication ? 'active' : ''}`}>
                            <a 
                                href="#authentication" 
                                className="dropdown-toggle"
                                onClick={(e) => handleMenuClick('authentication', e)}
                            >
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span>Quarterly</span>
                                </div>
                                <div>
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width={24} 
                                        height={24} 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth={2} 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        className="feather feather-chevron-right"
                                        style={{ 
                                            transform: expandedMenus.authentication ? 'rotate(90deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease'
                                        }}
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            </a>
                            <ul className={`collapse submenu list-unstyled ${expandedMenus.authentication ? 'show' : ''}`} id="authentication">
                                <li>
                                    <Link to="/budget/q1" onClick={handleSubmenuLinkClick}> 1st Quarter </Link>
                                </li>
                                <li>
                                    <Link to="/budget/q2" onClick={handleSubmenuLinkClick}> 2nd Quarter </Link>
                                </li>
                                <li>
                                    <Link to="/budget/q3" onClick={handleSubmenuLinkClick}> 3rd Quarter </Link>
                                </li>
                                <li>
                                    <Link to="/budget/q4" onClick={handleSubmenuLinkClick}> 4th Quarter </Link>
                                </li>
                            </ul>
                        </li> */}
                        <li className={`menu ${isMenuActive('/budget/mileStones') ? 'active' : ''}`}>
                            <Link to="/budget/mileStones" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-flag"><path d="M4 2v20" /><path d="M4 2h16l-4 6 4 6H4" /></svg>
                                    <span>Mile Stones</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/budget/targets') ? 'active' : ''}`}>
                            <Link to="/budget/targets" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-crosshair"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
                                    <span>Targets</span>
                                </div>
                            </Link>
                        </li>

                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>FUNDS</span></div>
                        </li>
                        {/* <li className="menu">
                            <Link to="/newfund" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-plus"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                                    <span>New Record</span>
                                </div>
                            </Link>
                        </li> */}
                        <li className={`menu ${isMenuActive('/fund/rainy') ? 'active' : ''}`}>
                            <Link to="/fund/rainy" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-umbrella"><path d="M23 12a11.05 11.05 0 0 0-22 0Z" /><path d="M12 12v8" /><path d="M12 20a4 4 0 0 0 8 0" /></svg>
                                    <span>Rainy Day Funds</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/fund/emergency') ? 'active' : ''}`}>
                            <Link to="/fund/emergency" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                    <span>Emergency Funds</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/fund/shortterm') ? 'active' : ''}`}>
                            <Link to="/fund/shortterm" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-down"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
                                    <span>Short Term Needs</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/fund/longterm') ? 'active' : ''}`}>
                            <Link to="/fund/longterm" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                                    <span>Long Term Needs</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/fund/liabilities') ? 'active' : ''}`}>
                            <Link to="/fund/liabilities" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                    <span> Credits & Liabilities</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/fund/friday') ? 'active' : ''}`}>
                            <Link to="/fund/friday" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><polyline points="5 9 2 12 5 15" /><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" /></svg>
                                    <span>Friday Investment</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/fund/others') ? 'active' : ''}`}>
                            <Link to="/fund/others" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-8-4.62a2 2 0 0 0-2 0l-8 4.62A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l8 4.62a2 2 0 0 0 2 0l8-4.62a2 2 0 0 0 1-1.73z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /></svg>
                                    <span>Others</span>
                                </div>
                            </Link>
                        </li>
                        
                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>FINANCIAL OUTLOOKS</span></div>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/compounding') ? 'active' : ''}`}>
                            <Link to="/financialOL/compounding" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                    <span>Compounding Magic</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/scoreboard') ? 'active' : ''}`}>
                            <Link to="/financialOL/scoreboard" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-award"><circle cx="12" cy="8" r="7" /><path d="M8 21v-4l4-4 4 4v4l-4 4z" /></svg>
                                    <span>Score Board</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/mindedideas') ? 'active' : ''}`}>
                            <Link to="/financialOL/mindedideas" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                                    <span>Minded Ideas</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/insights') ? 'active' : ''}`}>
                            <Link to="/financialOL/insights" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                                    <span>Insights</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/bigbites') ? 'active' : ''}`}>
                            <Link to="/financialOL/bigbites" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" /></svg>
                                    <span>Big Bites</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/myfinvision') ? 'active' : ''}`}>
                            <Link to="/financialOL/myfinvision" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12C3.73 5.52 8.5 2 12 2s8.27 3.52 11 10c-2.73 6.48-7.5 10-11 10s-8.27-3.52-11-10z" /><circle cx="12" cy="12" r="3" /></svg>
                                    <span>My Financial Vision</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/myfinmission') ? 'active' : ''}`}>
                            <Link to="/financialOL/myfinmission" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                                    <span>My Financial Mission</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/annualcosts') ? 'active' : ''}`}>
                            <Link to="/financialOL/annualcosts" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    <span>Annual Costs / 12</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/mindsets') ? 'active' : ''}`}>
                            <Link to="/financialOL/mindsets" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                                    <span>Mind Sets</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/dreams') ? 'active' : ''}`}>
                            <Link to="/financialOL/dreams" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-cloud"><path d="M20 16.58A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25" /></svg>
                                    <span>Dreams</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/financialOL/advices') ? 'active' : ''}`}>
                            <Link to="/financialOL/advices" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-circle"><path d="M21 11.5a8.38 8.38 0 0 1-1.23 4.28A8.5 8.5 0 1 1 4.21 4.21 8.38 8.38 0 0 1 8.5 3" /></svg>
                                    <span>Advices</span>
                                </div>
                            </Link>
                        </li>

                        <li className="menu menu-heading">
                            <div className="heading">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal">
                                    <circle cx={12} cy={12} r={1} />
                                    <circle cx={19} cy={12} r={1} />
                                    <circle cx={5} cy={12} r={1} />
                                </svg>
                                <span>PLANS</span>
                            </div>
                        </li>

                        <li className={`menu ${isMenuActive('/plan/future') ? 'active' : ''}`}>
                            <Link to="/plan/future" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>                                    
                                    <span>Future</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/plan/yearly') ? 'active' : ''}`}>
                            <Link to="/plan/yearly" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>                                    
                                    <span>Yearly</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/planQtr') ? 'active' : ''}`}>
                            <Link to="/planQtr" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart">
                                        <path d="M21.21 15.89A10 10 0 1 1 12 2v10z" />
                                    </svg>                                    
                                    <span>Quarterly</span>
                                </div>
                            </Link>
                        </li>
                        <li className={`menu ${isMenuActive('/plan/other') ? 'active' : ''}`}>
                            <Link to="/plan/other" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l2 3h8a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    <span>Other</span>
                                </div>
                            </Link>
                        </li>

{/* <li className={`menu ${expandedMenus.futureMenu ? 'active' : ''}`}>
    <a 
        href="#futureMenu" 
        className="dropdown-toggle"
        onClick={(e) => handleMenuClick('futureMenu', e)}
    >
        <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Future</span>
        </div>
        <div>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={24} 
                height={24} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="feather feather-chevron-right"
                style={{ 
                    transform: expandedMenus.futureMenu ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                }}
            >
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </div>
    </a>
    <ul className={`collapse submenu list-unstyled ${expandedMenus.futureMenu ? 'show' : ''}`} id="futureMenu">
        <li>
            <Link to="/plans/future/new" onClick={handleSubmenuLinkClick}> Add New </Link>
        </li>
        <li>
            <Link to="/plans/future/list" onClick={handleSubmenuLinkClick}> List Records </Link>
        </li>
        <li>
            <Link to="/plans/future/others" onClick={handleSubmenuLinkClick}> Others </Link>
        </li>
        <li>
            <Link to="/plans/future/plans" onClick={handleSubmenuLinkClick}> Plans </Link>
        </li>
    </ul>
</li>

<li className={`menu ${expandedMenus.yearlyMenu ? 'active' : ''}`}>
    <a 
        href="#yearlyMenu" 
        className="dropdown-toggle"
        onClick={(e) => handleMenuClick('yearlyMenu', e)}
    >
        <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Yearly</span>
        </div>
        <div>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={24} 
                height={24} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="feather feather-chevron-right"
                style={{ 
                    transform: expandedMenus.yearlyMenu ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                }}
            >
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </div>
    </a>
    <ul className={`collapse submenu list-unstyled ${expandedMenus.yearlyMenu ? 'show' : ''}`} id="yearlyMenu">
        <li>
            <Link to="/plans/yearly/new" onClick={handleSubmenuLinkClick}> Add New </Link>
        </li>
        <li>
            <Link to="/plans/yearly/list" onClick={handleSubmenuLinkClick}> List Records </Link>
        </li>
        <li>
            <Link to="/plans/yearly/others" onClick={handleSubmenuLinkClick}> Others </Link>
        </li>
    </ul>
</li>

<li className={`menu ${expandedMenus.quarterlyMenu ? 'active' : ''}`}>
    <a 
        href="#quarterlyMenu" 
        className="dropdown-toggle"
        onClick={(e) => handleMenuClick('quarterlyMenu', e)}
    >
        <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart">
                <path d="M21.21 15.89A10 10 0 1 1 12 2v10z" />
            </svg>
            <span>Quarterly</span>
        </div>
        <div>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={24} 
                height={24} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="feather feather-chevron-right"
                style={{ 
                    transform: expandedMenus.quarterlyMenu ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                }}
            >
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </div>
    </a>
    <ul className={`collapse submenu list-unstyled ${expandedMenus.quarterlyMenu ? 'show' : ''}`} id="quarterlyMenu">
        <li>
            <Link to="/plans/quarterly/new" onClick={handleSubmenuLinkClick}> Add New </Link>
        </li>
        <li>
            <Link to="/plans/quarterly/list" onClick={handleSubmenuLinkClick}> List Records </Link>
        </li>
        <li>
            <Link to="/plans/quarterly/others" onClick={handleSubmenuLinkClick}> Others </Link>
        </li>
    </ul>
</li>
<li className={`menu ${expandedMenus.quarterlyMenu ? 'active' : ''}`}>
    <a 
        href="#quarterlyMenu" 
        className="dropdown-toggle"
        onClick={(e) => handleMenuClick('quarterlyMenu', e)}
    >
        <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart">
                <path d="M21.21 15.89A10 10 0 1 1 12 2v10z" />
            </svg>
            <span>Other</span>
        </div>
        <div>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={24} 
                height={24} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="feather feather-chevron-right"
                style={{ 
                    transform: expandedMenus.quarterlyMenu ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                }}
            >
                <polyline points="9 18 15 12 9 6" />
            </svg>
        </div>
    </a>
    <ul className={`collapse submenu list-unstyled ${expandedMenus.quarterlyMenu ? 'show' : ''}`} id="quarterlyMenu">
        <li>
            <Link to="/plans/quarterly/new" onClick={handleSubmenuLinkClick}> Add New </Link>
        </li>
        <li>
            <Link to="/plans/quarterly/list" onClick={handleSubmenuLinkClick}> List Records </Link>
        </li>
        <li>
            <Link to="/plans/quarterly/others" onClick={handleSubmenuLinkClick}> Others </Link>
        </li>
    </ul>
</li> */}
                    </>)}

                    
                    {user?.role === 'adm' && (<>
                        <li className="menu menu-heading">
                            <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>SETTINGS</span></div>
                        </li>
                        <li className={`menu ${expandedMenus.users ? 'active' : ''} ${hasActiveSubItem(['/nwUsr', '/usrlst']) ? 'active' : ''}`}>
                                <a 
                                    href="#users" 
                                    className="dropdown-toggle"
                                    onClick={(e) => handleMenuClick('users', e)}
                                >
                                    <div className="">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-users">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx={9} cy={7} r={4} />
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        <span>Users</span>
                                    </div>
                                    <div>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width={24} 
                                            height={24} 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth={2} 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            className="feather feather-chevron-right"
                                            style={{ 
                                                transform: expandedMenus.users ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease'
                                            }}
                                        >
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </div>
                                </a>
                                <ul className={`collapse submenu list-unstyled ${expandedMenus.users ? 'show' : ''}`} id="users">
                                    <li className={isMenuActive('/nwUsr') ? 'active' : ''}>
                                        <Link to="/nwUsr" onClick={handleSubmenuLinkClick}> New Users </Link>
                                    </li>
                                    <li className={isMenuActive('/usrlst') ? 'active' : ''}>
                                        <Link to="/usrlst" onClick={handleSubmenuLinkClick}> Users</Link>
                                    </li>
                                   
                                </ul>
                            </li>
                       
                        <li className={`menu ${isMenuActive('/sttgs') ? 'active' : ''}`}>
                            <Link to="/sttgs" aria-expanded="false" className="dropdown-toggle" onClick={handleLinkClick}>
                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock">
                                        <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <span>Admin Settings</span>
                                </div>
                            </Link>
                        </li>
                        <li style={{ height: '100px' }} />
                        
                    </>)}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;

// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../contexts/AuthContext';
// import { Link } from 'react-router-dom';

// const Sidebar = () => {

//     const { user } = useContext(AuthContext);
//     const [expanded, setExpanded] = useState(false);


//     useEffect(() => {
//         // initialize perfect scrollbar or your sidebar scroll handler
//         if (window.PerfectScrollbar) {
//             new window.PerfectScrollbar('#sidebar');
//         }
//     }, []);

//     useEffect(() => {
//         // perfect-scrollbar expects a DOM element
//         if (window.PerfectScrollbar) {
//             new window.PerfectScrollbar('.menu-categories');
//         }
//     }, []);


//     return (
//         <div className="sidebar-wrapper sidebar-theme">
//             <nav id="sidebar">
//                 <ul className="navbar-nav theme-brand flex-row  text-center">
//                     <li className="nav-item theme-logo">
//                         <Link to="/">
//                             <img src="assets/img/logop.jpg" className="navbar-logo" alt="logo" />
//                         </Link>
//                     </li>
//                     <li className="nav-item theme-text">
//                         <Link to="/" className="nav-link"> PERSONAL </Link>
//                     </li>
//                 </ul>
//                 <ul className="list-unstyled menu-categories" id="accordionExample">
//                     <li className={`menu ${expanded ? "active" : ""}`}>
//                         <a href="#dashboard" data-toggle="collapse" aria-expanded={expanded} className="dropdown-toggle" onClick={() => setExpanded(!expanded)}>
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
//                                 <span>Dashboard</span>
//                             </div>
//                             <div>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                             </div>
//                         </a>
//                         <ul className="collapse submenu list-unstyled " id="dashboard" data-parent="#accordionExample">
//                             <li className="">
//                                 <Link to="/"> Analytics </Link>
//                             </li>
//                             <li>
//                                 <Link to="/"> Finance </Link>
//                             </li>
//                             <li>
//                                 <Link to="/prsnl"> Personal </Link>
//                             </li>
//                         </ul>
//                     </li>
//                     {(user?.role === 'emplyT1' || user?.role === 'adm') && (<>
//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>APPLICATIONS</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="/apps_chat" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
//                                     <span>Chat</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="apps_mailbox.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
//                                     <span>Mailbox</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="/tdLst" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
//                                     <span>Todo List</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="/nts" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /><polyline points="10 9 9 9 8 9" /></svg>
//                                     <span>Notes</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="/scrmBrd" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-plus"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={12} y1={18} x2={12} y2={12} /><line x1={9} y1={15} x2={15} y2={15} /></svg>
//                                     <span>Scrumboard</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="/cnts" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx={12} cy={10} r={3} /></svg>
//                                     <span>Contacts</span>
//                                 </div>
//                             </Link>
//                         </li>

//                         {/* <li className="menu">
//                         <a href="#invoice" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><line x1={12} y1={1} x2={12} y2={23} /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
//                                 <span>Invoice</span>
//                             </div>
//                             <div>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                             </div>
//                         </a>
//                         <ul className="collapse submenu list-unstyled" id="invoice" data-parent="#accordionExample">
//                             <li>
//                                 <Link to="apps_invoice-list.html"> List </Link>
//                             </li>
//                             <li>
//                                 <Link to="apps_invoice-preview.html"> Preview </Link>
//                             </li>
//                             <li>
//                                 <Link to="apps_invoice-add.html"> Add </Link>
//                             </li>
//                             <li>
//                                 <Link to="apps_invoice-edit.html"> Edit </Link>
//                             </li>
//                         </ul>
//                     </li> */}
//                         <li className="menu">
//                             <Link to="/clndr" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg>
//                                     <span>Calendar</span>
//                                 </div>
//                             </Link>
//                         </li></>)}
//                     {user?.role === 'adm' && (<>
//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>MUTUAL FUNDS</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="/listTable" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx={12} cy={12} r={10} /><circle cx={12} cy={12} r={6} /><circle cx={12} cy={12} r={2} /></svg>
//                                     <span>New Mutual Funds</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="widgets.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
//                                     <span>All Mutual Funds</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="widgets.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-repeat"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
//                                     <span>Follow ups</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="widgets.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
//                                     <span>Snoozed</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="widgets.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15 10 23 10 17 14 19 22 12 17 5 22 7 14 1 10 9 10 12 2" /></svg>
//                                     <span>Wish List</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="widgets.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V13H9v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" /></svg>
//                                     <span>Market / Bank</span>
//                                 </div>
//                             </Link>
//                         </li>



//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Stocks</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
//                                     <span>New Stock</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
//                                     <span>All Stocks</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-repeat"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
//                                     <span>Follow ups</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
//                                     <span>Snoozed</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" /><polygon points="12 15 17 21 7 21 12 15" /></svg>
//                                     <span>Wish List</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V13H9v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z" /></svg>
//                                     <span>Market / Bank</span>
//                                 </div>
//                             </Link>
//                         </li>
//                     </>)}
//                     {(user?.role === 'emplyT1' || user?.role === 'adm') && (<>

//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Friends</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-3-3.87" /><path d="M8 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
//                                     <span> New Friend </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-3-3.87" /><path d="M7 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></svg>
//                                     <span> All Friend </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-repeat"> <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
//                                     <span> Follow ups </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
//                                     <span> Snoozed </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2" /></svg>
//                                     <span> Wish List </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pause-circle"> <circle cx="12" cy="12" r="10" /><line x1="10" y1="15" x2="10" y2="9" /><line x1="14" y1="15" x2="14" y2="9" /></svg>
//                                     <span> Freezed </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle"> <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
//                                     <span> Rejected </span>
//                                 </div>
//                             </Link>
//                         </li>
//                     </>)}

//                     {user?.role === 'adm' && (<>
//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Others</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="/quotes" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
//                                         <path d="M7 17a5 5 0 0 1 0-10h1v6h2V7H7a7 7 0 0 0 0 14h1v-4H7z" />
//                                         <path d="M17 17a5 5 0 0 1 0-10h1v6h2V7h-3a7 7 0 0 0 0 14h1v-4h-2z" />
//                                     </svg>                                <span> Quotes / Adage </span>
//                                 </div>
//                             </Link>
//                         </li>
//                     </>)}
//                     {/* <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" /><path d="M20 2H6.5A2.5 2.5 0 0 0 4 4.5v15" /></svg>
//                                 <span> Inspired By Bible </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"> <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
//                                 <span> Spiritual </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-3-3.87" /><path d="M7 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></svg>
//                                 <span> Philosophers </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-1 4 8.5 8.5 0 0 1-7 4 8.38 8.38 0 0 1-4-1l-4 1 1-4a8.38 8.38 0 0 1-1-4 8.5 8.5 0 0 1 4-7 8.38 8.38 0 0 1 4-1 8.5 8.5 0 0 1 7 4 8.38 8.38 0 0 1 1 4z" /></svg>
//                                 <span> Adage </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-feather">  <path d="M20 2v7l-5 5H7l-5 5V2h18z" /></svg>
//                                 <span> Nature </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
//                                 <span> Common </span>
//                             </div>
//                         </Link>
//                     </li> */}



//                     {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Dictionary</span></div>
//                     </li> */}
//                     {(user?.role === 'emplyT1' || user?.role === 'adm') && (<>

//                         <li className="menu">
//                             <Link to="/dict" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-open" viewBox="0 0 24 24">
//                                         <path d="M2 7v13a2 2 0 0 0 2 2h6" />
//                                         <path d="M22 7v13a2 2 0 0 1-2 2h-6" />
//                                         <path d="M12 5v20" />
//                                     </svg>                                <span> Dictionary </span>
//                                 </div>
//                             </Link>
//                         </li>
//                     </>)}
//                     {/* <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-flag"><path d="M4 4h16l-4 8 4 8H4z" /></svg>
//                                 <span> English </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-flag"><path d="M4 4h16l-4 8 4 8H4z" /></svg>
//                                 <span> German </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-flag"><path d="M4 4h16l-4 8 4 8H4z" /></svg>
//                                 <span> Hindi </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-flag"><path d="M4 4h16l-4 8 4 8H4z" /></svg>
//                                 <span> Arabic </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-book"><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" /><path d="M20 2H6.5A2.5 2.5 0 0 0 4 4.5v15" /></svg>
//                                 <span> Medical Terms </span>
//                             </div>
//                         </Link>
//                     </li> */}


//                     {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Medical Statistics</span></div>
//                     </li> */}
//                     {user?.role === 'adm' && (<>
//                         <li className="menu">
//                             <Link to="/mdcSts" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>

//                                     <span> Medical Statistics </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         {/* <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-monitor"> <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /></svg>
//                                 <span> Weight % </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-activity"> <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
//                                 <span> Presure % </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-droplet"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
//                                 <span> Sugar % </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-grid"> <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
//                                 <span> Other </span>
//                             </div>
//                         </Link>
//                     </li> */}



//                         {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Medicines</span></div>
//                     </li> */}
//                         {/* <li className="menu">
//                         <Link to="/medic" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-leaf"> <path d="M6 2a10 10 0 0 0 10 10 10 10 0 0 0 10 10 10 10 0 0 0-10-10A10 10 0 0 0 6 2z" /></svg>
//                                 <span> Ayurveda </span>
//                             </div>
//                         </Link>
//                     </li> */}
//                         <li className="menu">
//                             <Link to="/medic" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pill" viewBox="0 0 24 24">
//                                         <rect x="3" y="11" width="8" height="10" rx="2" ry="2" />
//                                         <path d="M21 6.5c0 2.21-2.5 4-5.5 4S10 8.71 10 6.5 12.5 2.5 15.5 2.5 21 4.29 21 6.5z" />
//                                         <path d="M14 6.5h7" />
//                                     </svg>
//                                     <span> Medicines </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         {/* <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-droplet"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
//                                 <span> Homeopathy </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-heart"><path d="M20.8 4.6c-1.4-1.4-3.7-1.4-5 0L12 8.4l-3.8-3.8c-1.4-1.4-3.7-1.4-5 0s-1.4 3.7 0 5l8.8 8.8 8.8-8.8c1.4-1.4 1.4-3.7 0-5z" /></svg>
//                                 <span> Health Tips </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-grid"> <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
//                                 <span> Other </span>
//                             </div>
//                         </Link>
//                     </li> */}



//                         {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Diary</span></div>
//                     </li> */}
//                         <li className="menu">
//                             <Link to="/diary" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"> <path d="M11 4h10v10h-4v4h-6V8H5V4h6z" /></svg>
//                                     <span> Diary </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         {/* <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-open"><path d="M2 7v13a2 2 0 0 0 2 2h14" /><path d="M22 7v13a2 2 0 0 1-2 2H6" /><path d="M2 7h20V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" /></svg>
//                                 <span> Diarys </span>
//                             </div>
//                         </Link>
//                     </li> */}


//                         {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>NAMES</span></div>
//                     </li>
//                     <li className="menu">
//                         <Link to="/newNames" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
//                                 <span> Add New </span>
//                             </div>
//                         </Link>
//                     </li> */}
//                         <li className="menu">
//                             <Link to="/gnrlNms" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user" viewBox="0 0 24 24">
//                                         <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
//                                         <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
//                                         <circle cx="12" cy="7" r="4" />
//                                     </svg>                                <span>  Names </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         {/* <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M20 22V2H6.5A2.5 2.5 0 0 0 4 4.5v15" /></svg>
//                                 <span> Christian </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
//                                 <span> Hindu </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-circle"><circle cx="12" cy="12" r="10" /></svg>
//                                 <span> Budist </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" /></svg>
//                                 <span> Muslim </span>
//                             </div>
//                         </Link>
//                     </li> */}


//                         {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Stories</span></div>
//                     </li>
//                     <li className="menu">
//                         <Link to="/stry" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
//                                 <span> Add New </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book"> <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M20 22V2H6.5A2.5 2.5 0 0 0 4 4.5v15" /></svg>
//                                 <span> Bible </span>
//                             </div>
//                         </Link>
//                     </li> */}
//                         <li className="menu">
//                             <Link to="/stry" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-smile"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
//                                     <span> Stories </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         {/* <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-open"><path d="M2 7v13a2 2 0 0 0 2 2h14" /><path d="M22 7v13a2 2 0 0 1-2 2H6" /><path d="M2 7h20V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" /></svg>
//                                 <span> Knowledge </span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"> <path d="M22 19a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H12l-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h20z" /></svg>
//                                 <span> Other </span>
//                             </div>
//                         </Link>
//                     </li> */}
//                         <li className="menu">
//                             <Link to="/bussIdea" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-feather-list"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
//                                     <span>Bussiness</span>
//                                 </div>
//                             </Link>
//                         </li>

//                         {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Bussiness</span></div>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
//                                 <span>Create New Idea</span>
//                             </div>
//                         </Link>
//                     </li>
                    
//                     <li className="menu">
//                         <a href="#bussinessCategories" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
//                                 <span>Categories</span>
//                             </div>
//                             <div>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                             </div>
//                         </a>
//                         <ul className="collapse submenu list-unstyled" id="bussinessCategories" data-parent="#accordionExample">
//                             <li>
//                                 <Link to="#"> CRM </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> ERP </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Banking </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> General </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Agriculture</Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Construction</Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Alopathy </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Ayurvedam </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Homeopathic </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Electronics </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Web Links </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Youtube </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Insta </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> FB </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Softwares </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Prices </Link>
//                             </li>
//                         </ul>
//                     </li>
//  */}
//                         <li className="menu">
//                             <Link to="/misVis" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12C3.73 5.52 8.5 2 12 2s8.27 3.52 11 10c-2.73 6.48-7.5 10-11 10s-8.27-3.52-11-10z" /><circle cx="12" cy="12" r="3" /></svg>
//                                     <span>My Mission and Vission</span>
//                                 </div>
//                             </Link>
//                         </li>


//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Notes</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layout"><rect x={3} y={3} width={18} height={18} rx={2} ry={2} /><line x1={3} y1={9} x2={21} y2={9} /><line x1={9} y1={21} x2={9} y2={9} /></svg>
//                                     <span>Create New </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layout"><rect x={3} y={3} width={18} height={18} rx={2} ry={2} /><line x1={3} y1={9} x2={21} y2={9} /><line x1={9} y1={21} x2={9} y2={9} /></svg>
//                                     <span>List All Notes</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <a href="#notesCategories" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
//                                     <span>Categories</span>
//                                 </div>
//                                 <div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                 </div>
//                             </a>
//                             <ul className="collapse submenu list-unstyled" id="notesCategories" data-parent="#accordionExample">
//                                 <li>
//                                     <Link to="#"> Personal </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Bibilical </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Banking </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> General </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Agriculture</Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Construction</Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Alopathy </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Ayurvedam </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Homeopathic </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Electronics </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Web Links </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Youtube </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Insta </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> FB </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Softwares </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Prices </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#"> Others </Link>
//                                 </li>
//                             </ul>
//                         </li>


//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Todo List</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-square"><rect x={3} y={3} width={18} height={18} rx={2} ry={2} /><line x1={12} y1={8} x2={12} y2={16} /><line x1={8} y1={12} x2={16} y2={12} /></svg>
//                                     <span> New Record </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-square"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
//                                     <span> Todo List </span>
//                                 </div>
//                             </Link>
//                         </li>



//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Events Calander</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar-plus"> <rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /><line x1={12} y1={14} x2={12} y2={18} /><line x1={10} y1={16} x2={14} y2={16} /></svg>
//                                     <span> New Event </span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg>
//                                     <span> Events </span>
//                                 </div>
//                             </Link>
//                         </li>


//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>MY OWN</span></div>
//                         </li>
//                         <li className="menu">
//                             <a href="#memories" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-image"><rect x={3} y={3} width={18} height={18} rx={2} ry={2} /><circle cx={8.5} cy={8.5} r={1.5} /><polyline points="21 15 16 10 5 21" /></svg>
//                                     <span>Memories</span>
//                                 </div>
//                                 <div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                 </div>
//                             </a>
//                             <ul className="collapse submenu list-unstyled" id="memories" data-parent="#accordionExample">
//                                 <li>
//                                     <Link to="#" > New Record </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Birthdays </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Anniversarys </Link>
//                                 </li>
//                             </ul>
//                         </li>


//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>MY TIMELINE</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
//                                     <span> Friend List </span>
//                                 </div>
//                             </Link>
//                         </li>










//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>HIGHLY SECURED</span></div>
//                         </li>


//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>BUDGETS</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-plus"><polyline points="5 9 2 12 5 15" /><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
//                                     <span>New Record</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
//                                     <span>Yearly</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
//                                     <span>Half Yearly</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <a href="#authentication" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"> <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
//                                     <span>Quarterly</span>
//                                 </div>
//                                 <div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                 </div>
//                             </a>
//                             <ul className="collapse submenu list-unstyled" id="authentication" data-parent="#accordionExample">
//                                 <li>
//                                     <Link to="#" > 1st Quarter </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > 2nd Quarter </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > 3rd Quarter </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="auth_pass_recovery_boxed.html" > Dec Quarter </Link>
//                                 </li>
//                             </ul>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-flag"><path d="M4 2v20" /><path d="M4 2h16l-4 6 4 6H4" /></svg>
//                                     <span>Mile Stones</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-crosshair"><circle cx="12" cy="12" r="10" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>
//                                     <span>Targets</span>
//                                 </div>
//                             </Link>
//                         </li>


//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>FUNDS</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-plus"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
//                                     <span>New Record</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-umbrella"><path d="M23 12a11.05 11.05 0 0 0-22 0Z" /><path d="M12 12v8" /><path d="M12 20a4 4 0 0 0 8 0" /></svg>
//                                     <span>Rainy Day Funds</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
//                                     <span>Emergancy Funds</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-down"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></svg>
//                                     <span>Short Term Needs</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
//                                     <span>Long Term Needs</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
//                                     <span>Liabilities / Credits</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><polyline points="5 9 2 12 5 15" /><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" /></svg>
//                                     <span>ll Firdat Investment</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-8-4.62a2 2 0 0 0-2 0l-8 4.62A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l8 4.62a2 2 0 0 0 2 0l8-4.62a2 2 0 0 0 1-1.73z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /></svg>
//                                     <span>Others</span>
//                                 </div>
//                             </Link>
//                         </li>


//                         {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>My Vission and Mission</span></div>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
//                                 <span>Evangalization</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-award"><circle cx="12" cy="8" r="7" /><path d="M12 15v7" /><path d="M5 22h14" /></svg>
//                                 <span>Minded ideas</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chart"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
//                                 <span>Insights</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" /></svg>
//                                 <span>Big Bites</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12C3.73 5.52 8.5 2 12 2s8.27 3.52 11 10c-2.73 6.48-7.5 10-11 10s-8.27-3.52-11-10z" /><circle cx="12" cy="12" r="3" /></svg>
//                                 <span>My Vision</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
//                                 <span>My Mission</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
//                                 <span>Mind Sets</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-cloud"><path d="M20 16.58A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25" /></svg>
//                                 <span>Dreams</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-1.23 4.28A8.5 8.5 0 1 1 4.21 4.21 8.38 8.38 0 0 1 8.5 3" /></svg>
//                                 <span>Advices</span>
//                             </div>
//                         </Link>
//                     </li> */}



//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Financial Outlooks</span></div>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
//                                     <span>Compounding Magic</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-award"><circle cx="12" cy="8" r="7" /><path d="M8 21v-4l4-4 4 4v4l-4 4z" /></svg>
//                                     <span>Score Board</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
//                                     <span>Minded Ideas</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
//                                     <span>Insights</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" /></svg>
//                                     <span>Big Bites</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12C3.73 5.52 8.5 2 12 2s8.27 3.52 11 10c-2.73 6.48-7.5 10-11 10s-8.27-3.52-11-10z" /><circle cx="12" cy="12" r="3" /></svg>
//                                     <span>My Vission</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
//                                     <span>My Mission</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
//                                     <span>Annual Costs / 12</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
//                                     <span>Mind Sets</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-cloud"><path d="M20 16.58A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.25" /></svg>
//                                     <span>Dreams</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-circle"><path d="M21 11.5a8.38 8.38 0 0 1-1.23 4.28A8.5 8.5 0 1 1 4.21 4.21 8.38 8.38 0 0 1 8.5 3" /></svg>
//                                     <span>Advices</span>
//                                 </div>
//                             </Link>
//                         </li>


//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Plans</span></div>
//                         </li>

//                         <li className="menu">
//                             <a href="#futureMenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"> <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
//                                     <span>Future</span>
//                                 </div>
//                                 <div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                 </div>
//                             </a>
//                             <ul className="collapse submenu list-unstyled" id="futureMenu" data-parent="#accordionExample">
//                                 <li>
//                                     <Link to="#" > Add New </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > List Rcrds </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Others </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Plans </Link>
//                                 </li>
//                             </ul>
//                         </li>

//                         <li className="menu">
//                             <a href="#yearlyMenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"> <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
//                                     <span>Yearly</span>
//                                 </div>
//                                 <div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                 </div>
//                             </a>
//                             <ul className="collapse submenu list-unstyled" id="yearlyMenu" data-parent="#accordionExample">
//                                 <li>
//                                     <Link to="#" > Add New </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > List Rcrds </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Others </Link>
//                                 </li>
//                             </ul>
//                         </li>


//                         <li className="menu">
//                             <a href="#quarterlyMenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart"><path d="M21.21 15.89A10 10 0 1 1 12 2v10z" /></svg>
//                                     <span>Quarterly</span>
//                                 </div>
//                                 <div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                 </div>
//                             </a>
//                             <ul className="collapse submenu list-unstyled" id="quarterlyMenu" data-parent="#accordionExample">
//                                 <li>
//                                     <Link to="#" > Add New </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > List Rcrds </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Others </Link>
//                                 </li>
//                             </ul>
//                         </li>
//                     </>)}




//                     {/* <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>USER INTERFACE</span></div>
//                     </li>
//                     <li className="menu">
//                         <a href="#components" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1={12} y1="22.08" x2={12} y2={12} /></svg>
//                                 <span>Components</span>
//                             </div>
//                             <div>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                             </div>
//                         </a>
//                         <ul className="collapse submenu list-unstyled" id="components" data-parent="#accordionExample">
//                             <li>
//                                 <Link to="component_tabs.html"> Tabs </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_accordion.html"> Accordions</Link>
//                             </li>
//                             <li>
//                                 <Link to="component_modal.html"> Modals </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_cards.html"> Cards </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_bootstrap_carousel.html">Carousel</Link>
//                             </li>
//                             <li>
//                                 <Link to="component_blockui.html"> Block UI </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_countdown.html"> Countdown </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_counter.html"> Counter </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_sweetalert.html"> Sweet Alerts </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_timeline.html"> Timeline </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_snackbar.html"> Notifications </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_session_timeout.html"> Session Timeout </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_media_object.html"> Media Object </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_list_group.html"> List Group </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_pricing_table.html"> Pricing Tables </Link>
//                             </li>
//                             <li>
//                                 <Link to="component_lightbox.html"> Lightbox </Link>
//                             </li>
//                         </ul>
//                     </li>
//                     <li className="menu">
//                         <a href="#elements" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
//                                 <span>Elements</span>
//                             </div>
//                             <div>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                             </div>
//                         </a>
//                         <ul className="collapse submenu list-unstyled" id="elements" data-parent="#accordionExample">
//                             <li>
//                                 <Link to="element_alerts.html"> Alerts </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_avatar.html"> Avatar </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_badges.html"> Badges </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_breadcrumbs.html"> Breadcrumbs </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_buttons.html"> Buttons </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_buttons_group.html"> Button Groups </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_color_library.html"> Color Library </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_dropdown.html"> Dropdown </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_infobox.html"> Infobox </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_jumbotron.html"> Jumbotron </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_loader.html"> Loader </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_pagination.html"> Pagination </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_popovers.html"> Popovers </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_progress_bar.html"> Progress Bar </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_search.html"> Search </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_tooltips.html"> Tooltips </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_treeview.html"> Treeview </Link>
//                             </li>
//                             <li>
//                                 <Link to="element_typography.html"> Typography </Link>
//                             </li>
//                         </ul>
//                     </li>
//                     <li className="menu">
//                         <Link to="fonticons.html" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-target"><circle cx={12} cy={12} r={10} /><circle cx={12} cy={12} r={6} /><circle cx={12} cy={12} r={2} /></svg>
//                                 <span>Font Icons</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <Link to="widgets.html" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-airplay"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" /><polygon points="12 15 17 21 7 21 12 15" /></svg>
//                                 <span>Widgets</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu menu-heading">
//                         <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>TABLES AND FORMS</span></div>
//                     </li>
//                     <li className="menu">
//                         <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layout"><rect x={3} y={3} width={18} height={18} rx={2} ry={2} /><line x1={3} y1={9} x2={21} y2={9} /><line x1={9} y1={21} x2={9} y2={9} /></svg>
//                                 <span>Tables</span>
//                             </div>
//                         </Link>
//                     </li>
//                     <li className="menu">
//                         <a href="#datatables" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
//                                 <span>DataTables</span>
//                             </div>
//                             <div>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                             </div>
//                         </a>
//                         <ul className="collapse submenu list-unstyled" id="datatables" data-parent="#accordionExample">
//                             <li>
//                                 <Link to="table_dt_basic.html"> Basic </Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_striped_table.html"> Striped Table </Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_ordering_sorting.html"> Order Sorting </Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_multi-column_ordering.html"> Multi-Column </Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_multiple_tables.html"> Multiple Tables</Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_alternative_pagination.html"> Alt. Pagination</Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_custom.html"> Custom </Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_range_search.html"> Range Search </Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_html5.html"> HTML5 Export </Link>
//                             </li>
//                             <li>
//                                 <Link to="table_dt_live_dom_ordering.html"> Live DOM ordering </Link>
//                             </li>
//                             <li>
//                                 <Link to="#"> Miscellaneous </Link>
//                             </li>
//                         </ul>
//                     </li>
//                     <li className="menu">
//                         <a href="#forms" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                             <div className="">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clipboard"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x={8} y={2} width={8} height={4} rx={1} ry={1} /></svg>
//                                 <span>Forms</span>
//                             </div>
//                             <div>
//                                 <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                             </div>
//                         </a>
//                         <ul className="collapse submenu list-unstyled" id="forms" data-parent="#accordionExample">
//                             <li>
//                                 <Link to="form_bootstrap_basic.html"> Basic </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_input_group_basic.html"> Input Group </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_layouts.html"> Layouts </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_validation.html"> Validation </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_input_mask.html"> Input Mask </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_bootstrap_select.html"> Bootstrap Select </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_select2.html"> Select2 </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_bootstrap_touchspin.html"> TouchSpin </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_maxlength.html"> Maxlength </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_checkbox_radio.html"> Checkbox &amp; Radio </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_switches.html"> Switches </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_wizard.html"> Wizards </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_fileupload.html"> File Upload </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_quill.html"> Quill Editor </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_markdown.html"> Markdown Editor </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_date_range_picker.html"> Date &amp; Range Picker </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_clipboard.html"> Clipboard </Link>
//                             </li>
//                             <li>
//                                 <Link to="form_typeahead.html"> Typeahead </Link>
//                             </li>
//                         </ul>
//                     </li> */}
//                     {user?.role === 'adm' && (
//                         <div>
//                             <li className="menu menu-heading">
//                                 <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>USER AND PAGES</span></div>
//                             </li>

//                             <li className="menu">
//                                 <a href="#users" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                     <div className="">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
//                                         <span>Users</span>
//                                     </div>
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                     </div>
//                                 </a>
//                                 <ul className="collapse submenu list-unstyled" id="users" data-parent="#accordionExample">
//                                     <li>
//                                         <Link to="/nwUsr"> New Users </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="/usrlst"> Users</Link>
//                                     </li>
//                                     <li>
//                                         <Link to="/sttgs"> Account Settings </Link>
//                                     </li>
//                                 </ul>
//                             </li>

//                             <li className="menu">
//                                 <a href="#pages" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                     <div className="">
//                                         <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
//                                         <span>Pages</span>
//                                     </div>
//                                     <div>
//                                         <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                     </div>
//                                 </a>
//                                 <ul className="collapse submenu list-unstyled" id="pages" data-parent="#accordionExample">
//                                     <li>
//                                         <Link to="#"> Helpdesk </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="#"> Contact Form </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="#"> FAQ </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="#"> FAQ 2 </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="#"> Privacy Policy </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="#" > Coming Soon </Link>
//                                     </li>
//                                     <li>
//                                         <a href="#pages-error" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"> Error <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg> </a>
//                                         <ul className="collapse list-unstyled sub-submenu" id="pages-error" data-parent="#pages">
//                                             <li>
//                                                 <Link to="#" > 404 </Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="#" > 500 </Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="#" > 503 </Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="#" > Maintanence </Link>
//                                             </li>
//                                         </ul>
//                                     </li>
//                                 </ul>
//                             </li>
//                         </div>
//                     )}
//                     {user?.role === 'adm' && (<>
//                         <li className="menu menu-heading">
//                             <div className="heading"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg><span>Settings</span></div>
//                         </li>
//                         <li className="menu">
//                             <a href="#authentication" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock"><rect x={3} y={11} width={18} height={11} rx={2} ry={2} /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
//                                     <span>Authentication</span>
//                                 </div>
//                                 <div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                 </div>
//                             </a>
//                             <ul className="collapse submenu list-unstyled" id="authentication" data-parent="#accordionExample">
//                                 <li>
//                                     <Link to="#" > Login Boxed </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Register Boxed </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Unlock Boxed </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Recover ID Boxed </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Login Cover </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Register Cover </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Unlock Cover </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="#" > Recover ID Cover </Link>
//                                 </li>
//                             </ul>
//                         </li>
//                         <li className="menu">
//                             <Link to="#" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-move"><polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" /><polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" /><line x1={2} y1={12} x2={22} y2={12} /><line x1={12} y1={2} x2={12} y2={22} /></svg>
//                                     <span>Drag and Drop</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="map_jvector.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-map"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1={8} y1={2} x2={8} y2={18} /><line x1={16} y1={6} x2={16} y2={22} /></svg>
//                                     <span>Maps</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <Link to="charts_apex.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-pie-chart"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>
//                                     <span>Charts</span>
//                                 </div>
//                             </Link>
//                         </li>
//                         <li className="menu">
//                             <a href="#starter-kit" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-terminal"><polyline points="4 17 10 11 4 5" /><line x1={12} y1={19} x2={20} y2={19} /></svg>
//                                     <span>Starter Kit</span>
//                                 </div>
//                                 <div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right"><polyline points="9 18 15 12 9 6" /></svg>
//                                 </div>
//                             </a>
//                             <ul className="collapse submenu list-unstyled" id="starter-kit" data-parent="#accordionExample">
//                                 <li>
//                                     <Link to="starter_kit_blank_page.html"> Blank Page </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="starter_kit_breadcrumb.html"> Breadcrumb </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="starter_kit_boxed.html"> Boxed </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="starter_kit_alt_menu.html"> Alternate Menu </Link>
//                                 </li>
//                             </ul>
//                         </li>
//                         <li className="menu">
//                             <a  href="../../documentation/index.html" aria-expanded="false" className="dropdown-toggle">
//                                 <div className="">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
//                                     <span>Documentation</span>
//                                 </div>
//                             </a>
//                         </li>
//                     </>)}
//                 </ul>
//             </nav>
//         </div>

//     )
// }

// export default Sidebar
