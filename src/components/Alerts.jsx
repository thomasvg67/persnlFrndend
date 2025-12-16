import React from 'react'
import '../assets/css/components/custom-sweetalert.css';
import '../assets/plugins/sweetalerts/sweetalert.css';
import '../assets/plugins/sweetalerts/sweetalert2.min.css';
import '../assets/plugins/sweetalerts/promise-polyfill.js';
import '../assets/plugins/animate/animate.css';
import '../assets/css/scrollspyNav.css';
// import '../assets/';
// import '../assets/';
// import '../assets/';
// import '../assets/';
// import '../assets/';


const Alerts = () => {
  return (
    <div>
     {/*  BEGIN NAVBAR  */}
{/*  END NAVBAR  */}
{/*  BEGIN MAIN CONTAINER  */}
<div className="main-container sidebar-closed sbar-open" id="container">
  <div className="overlay" />
  <div className="cs-overlay" />
  <div className="search-overlay" />
  {/*  BEGIN SIDEBAR  */}
  {/*  END SIDEBAR  */}
  {/*  BEGIN CONTENT AREA  */}
  <div id="content" className="main-content">
    <div className="container">
      <div className="container">
        <div id="navSection" data-spy="affix" className="nav  sidenav">
          <div className="sidenav-content">
            <a href="#saBasic" className="active nav-link">Basic</a>
            <a href="#saMessage" className="nav-link">Message</a>
            <a href="#saDynamic" className="nav-link">Dynamic</a>
            <a href="#satitle" className="nav-link">A title with text</a>
            <a href="#saChaining" className="nav-link">Chaining modals</a>
            <a href="#saAnimation" className="nav-link">Animation</a>
            <a href="#saAuto" className="nav-link">Auto close timer</a>
            <a href="#saImage" className="nav-link">Custom image</a>
            <a href="#saHTML" className="nav-link">Custom HTML</a>
            <a href="#saWarning" className="nav-link">Warning message</a>
            <a href="#saCancel" className="nav-link">Cancel</a>
            <a href="#saCustom" className="nav-link">Custom Style</a>
            <a href="#saFooter" className="nav-link">Footer</a>
            <a href="#saRTL" className="nav-link">RTL</a>
            <a href="#saMixin" className="nav-link">Mixin</a>
          </div>
        </div>
        <div className="row layout-top-spacing" id="cancel-row">
          <div id="saBasic" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Basic message</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary message">Basic message</button>
                <div className="code-section-container show-code">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary message"&gt;Basic message&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .message').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"      "}title: 'Saved succesfully',{"\n"}{"      "}padding: '2em'{"\n"}{"    "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saMessage" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Success message</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary success">Success message!</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary success"&gt;Success message!&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .success').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"      "}title: 'Good job!',{"\n"}{"      "}text: "You clicked the!",{"\n"}{"      "}type: 'success',{"\n"}{"      "}padding: '2em'{"\n"}{"    "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saDynamic" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Dynamic queue</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary dynamic-queue">Dynamic queue</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary dynamic-queue"&gt;Dynamic queue&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .dynamic-queue').on('click', function () {"{"}{"\n"}{"    "}const ipAPI = 'https://api.ipify.org?format=json'{"\n"}{"    "}swal.queue([{"{"}{"\n"}{"        "}title: 'Your public IP',{"\n"}{"        "}confirmButtonText: 'Show my public IP',{"\n"}{"        "}text:{"\n"}{"          "}'Your public IP will be received ' +{"\n"}{"          "}'via AJAX request',{"\n"}{"        "}showLoaderOnConfirm: true,{"\n"}{"        "}preConfirm: function() {"{"}{"\n"}{"          "}return fetch(ipAPI){"\n"}{"            "}.then(function (response) {"{"} {"\n"}{"                "}return response.json();{"\n"}{"            "}{"}"}){"\n"}{"            "}.then(function(data) {"{"}{"\n"}{"               "}return swal.insertQueueStep(data.ip){"\n"}{"            "}{"}"}){"\n"}{"            "}.catch(function() {"{"}{"\n"}{"              "}swal.insertQueueStep({"{"}{"\n"}{"                "}type: 'error',{"\n"}{"                "}title: 'Unable to get your public IP'{"\n"}{"              "}{"}"}){"\n"}{"            "}{"}"}){"\n"}{"        "}{"}"}{"\n"}{"    "}{"}"}]){"\n"}{"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="satitle" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>A title with a text under</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary  title-text">Title &amp; text</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary{"  "}title-text"&gt;Title &amp; text&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .title-text').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"      "}title: 'The Internet?',{"\n"}{"      "}text: "That thing is still around?",{"\n"}{"      "}type: 'question',{"\n"}{"      "}padding: '2em'{"\n"}{"  "}{"}"}){"\n"}{"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saChaining" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Chaining modals (queue)</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary chaining-modals">Chaining modals (queue)</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary chaining-modals"&gt;Chaining modals (queue)&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .chaining-modals').on('click', function () {"{"}{"\n"}{"  "}swal.mixin({"{"}{"\n"}{"    "}input: 'text',{"\n"}{"    "}confirmButtonText: 'Next →',{"\n"}{"    "}showCancelButton: true,{"\n"}{"    "}progressSteps: ['1', '2', '3'],{"\n"}{"    "}padding: '2em',{"\n"}{"  "}{"}"}).queue([{"\n"}{"    "}{"{"}{"\n"}{"      "}title: 'Question 1',{"\n"}{"      "}text: 'Chaining swal2 modals is easy'{"\n"}{"    "}{"}"},{"\n"}{"    "}'Question 2',{"\n"}{"    "}'Question 3'{"\n"}{"  "}]).then(function(result) {"{"}{"\n"}{"    "}if (result.value) {"{"}{"\n"}{"      "}swal({"{"}{"\n"}{"        "}title: 'All done!',{"\n"}{"        "}padding: '2em',{"\n"}{"        "}html:{"\n"}{"          "}'Your answers: &lt;pre&gt;' +{"\n"}{"            "}JSON.stringify(result.value) +{"\n"}{"          "}'&lt;/pre&gt;',{"\n"}{"        "}confirmButtonText: 'Lovely!'{"\n"}{"      "}{"}"}){"\n"}{"    "}{"}"}{"\n"}{"  "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saAnimation" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Custom animation</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary html-jquery">Custom animation</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary html-jquery"&gt;Custom animation&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .html-jquery').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"    "}title: 'Custom animation with Animate.css',{"\n"}{"    "}animation: false,{"\n"}{"    "}customClass: 'animated tada',{"\n"}{"    "}padding: '2em'{"\n"}{"  "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saAuto" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Message with auto close timer</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary timer">Message timer</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary timer"&gt;Message timer&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .timer').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"    "}title: 'Auto close alert!',{"\n"}{"    "}text: 'I will close in 2 seconds.',{"\n"}{"    "}timer: 2000,{"\n"}{"    "}padding: '2em',{"\n"}{"    "}onOpen: function () {"{"}{"\n"}{"      "}swal.showLoading(){"\n"}{"    "}{"}"}{"\n"}{"  "}{"}"}).then(function (result) {"{"}{"\n"}{"    "}if ({"\n"}{"      "}// Read more about handling dismissals{"\n"}{"      "}result.dismiss === swal.DismissReason.timer{"\n"}{"    "}) {"{"}{"\n"}{"      "}console.log('I was closed by the timer'){"\n"}{"    "}{"}"}{"\n"}{"  "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saImage" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Message with custom image</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary custom-image">Message with custom image</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary custom-image"&gt;Message with custom image&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .custom-image').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"    "}title: 'Sweet!',{"\n"}{"    "}text: 'Modal with a custom image.',{"\n"}{"    "}imageUrl: 'assets/img/300x300.jpg',{"\n"}{"    "}imageWidth: 400,{"\n"}{"    "}imageHeight: 200,{"\n"}{"    "}imageAlt: 'Custom image',{"\n"}{"    "}animation: false,{"\n"}{"    "}padding: '2em'{"\n"}{"  "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saHTML" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Custom HTML description and buttons</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary  html">Custom Description &amp; buttons</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary{"  "}html"&gt;Custom Description &amp; buttons&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .html').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"    "}title: '&lt;i&gt;HTML&lt;/i&gt; &lt;u&gt;example&lt;/u&gt;',{"\n"}{"    "}type: 'info',{"\n"}{"    "}html:{"\n"}{"      "}'You can use &lt;b&gt;bold text&lt;/b&gt;, ' +{"\n"}{"      "}'&lt;a href="//github.com"&gt;links&lt;/a&gt; ' +{"\n"}{"      "}'and other HTML tags',{"\n"}{"    "}showCloseButton: true,{"\n"}{"    "}showCancelButton: true,{"\n"}{"    "}focusConfirm: false,{"\n"}{"    "}confirmButtonText:{"\n"}{"      "}'&lt;i class="flaticon-checked-1"&gt;&lt;/i&gt; Great!',{"\n"}{"    "}confirmButtonAriaLabel: 'Thumbs up, great!',{"\n"}{"    "}cancelButtonText:{"\n"}{"    "}'&lt;i class="flaticon-cancel-circle"&gt;&lt;/i&gt; Cancel',{"\n"}{"    "}cancelButtonAriaLabel: 'Thumbs down',{"\n"}{"    "}padding: '2em'{"\n"}{"  "}{"}"}){"\n"}{"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saWarning" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Warning message, with "Confirm" button</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary  warning confirm">Confirm</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary{"  "}warning confirm"&gt;Confirm&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .warning.confirm').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"      "}title: 'Are you sure?',{"\n"}{"      "}text: "You won't be able to revert this!",{"\n"}{"      "}type: 'warning',{"\n"}{"      "}showCancelButton: true,{"\n"}{"      "}confirmButtonText: 'Delete',{"\n"}{"      "}padding: '2em'{"\n"}{"    "}{"}"}).then(function(result) {"{"}{"\n"}{"      "}if (result.value) {"{"}{"\n"}{"        "}swal({"\n"}{"          "}'Deleted!',{"\n"}{"          "}'Your file has been deleted.',{"\n"}{"          "}'success'{"\n"}{"        "}){"\n"}{"      "}{"}"}{"\n"}{"    "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saCancel" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Execute something else for "Cancel".</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary  warning cancel">Addition else for "Cancel".</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary{"  "}warning cancel"&gt;Addition else for "Cancel".&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .warning.cancel').on('click', function () {"{"}{"\n"}{"  "}const swalWithBootstrapButtons = swal.mixin({"{"}{"\n"}{"    "}confirmButtonClass: 'btn btn-success btn-rounded',{"\n"}{"    "}cancelButtonClass: 'btn btn-danger btn-rounded mr-3',{"\n"}{"    "}buttonsStyling: false,{"\n"}{"  "}{"}"}){"\n"}{"\n"}{"  "}swalWithBootstrapButtons({"{"}{"\n"}{"    "}title: 'Are you sure?',{"\n"}{"    "}text: "You won't be able to revert this!",{"\n"}{"    "}type: 'warning',{"\n"}{"    "}showCancelButton: true,{"\n"}{"    "}confirmButtonText: 'Yes, delete it!',{"\n"}{"    "}cancelButtonText: 'No, cancel!',{"\n"}{"    "}reverseButtons: true,{"\n"}{"    "}padding: '2em'{"\n"}{"  "}{"}"}).then(function(result) {"{"}{"\n"}{"    "}if (result.value) {"{"}{"\n"}{"      "}swalWithBootstrapButtons({"\n"}{"        "}'Deleted!',{"\n"}{"        "}'Your file has been deleted.',{"\n"}{"        "}'success'{"\n"}{"      "}){"\n"}{"    "}{"}"} else if ({"\n"}{"      "}// Read more about handling dismissals{"\n"}{"      "}result.dismiss === swal.DismissReason.cancel{"\n"}{"    "}) {"{"}{"\n"}{"      "}swalWithBootstrapButtons({"\n"}{"        "}'Cancelled',{"\n"}{"        "}'Your imaginary file is safe :)',{"\n"}{"        "}'error'{"\n"}{"      "}){"\n"}{"    "}{"}"}{"\n"}{"  "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saCustom" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>A message with custom width, padding and background</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary  custom-width-padding-background">Custom Message</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary{"  "}custom-width-padding-background"&gt;Custom Message&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .custom-width-padding-background').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"    "}title: 'Custom width, padding, background.',{"\n"}{"    "}width: 600,{"\n"}{"    "}padding: "7em",{"\n"}{"    "}customClass: "background-modal",{"\n"}{"    "}background: '#fff url(assets/img/600x300.jpg) no-repeat 100% 100%',{"\n"}{"  "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saFooter" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>With Footer</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary  footer">With Footer</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary{"  "}footer"&gt;With Footer&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .footer').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"    "}type: 'error',{"\n"}{"    "}title: 'Oops...',{"\n"}{"    "}text: 'Something went wrong!',{"\n"}{"    "}footer: '&lt;a href&gt;Why do I have this issue?&lt;/a&gt;',{"\n"}{"    "}padding: '2em'{"\n"}{"  "}{"}"}){"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saRTL" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>RTL Support</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary  RTL">RTL</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary{"  "}RTL"&gt;RTL&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .RTL').on('click', function () {"{"}{"\n"}{"  "}swal({"{"}{"\n"}{"    "}title: 'هل تريد الاستمرار؟',{"\n"}{"    "}confirmButtonText:{"  "}'نعم',{"\n"}{"    "}cancelButtonText:{"  "}'لا',{"\n"}{"    "}showCancelButton: true,{"\n"}{"    "}showCloseButton: true,{"\n"}{"    "}padding: '2em',{"\n"}{"    "}target: document.getElementById('rtl-container'){"\n"}{"  "}{"}"}){"\n"}{"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="saMixin" className="col-lg-12 col-12 layout-spacing">
            <div className="statbox widget box box-shadow">
              <div className="widget-header">                                
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                    <h4>Mixin</h4>
                  </div>
                </div>
              </div>                            
              <div className="widget-content widget-content-area text-center">
                <button className="mr-2 btn btn-primary  mixin">Mixin</button>
                <div className="code-section-container">
                  <button className="btn toggle-code-snippet"><span>Code</span></button>
                  <div className="code-section text-left">
                    <pre>&lt;button class="mr-2 btn btn-primary{"  "}mixin"&gt;Mixin&lt;/button&gt;{"\n"}{"\n"}$('.widget-content .mixin').on('click', function () {"{"}{"\n"}{"  "}const toast = swal.mixin({"{"}{"\n"}{"    "}toast: true,{"\n"}{"    "}position: 'top-end',{"\n"}{"    "}showConfirmButton: false,{"\n"}{"    "}timer: 3000,{"\n"}{"    "}padding: '2em'{"\n"}{"  "}{"}"});{"\n"}{"\n"}{"  "}toast({"{"}{"\n"}{"    "}type: 'success',{"\n"}{"    "}title: 'Signed in successfully',{"\n"}{"    "}padding: '2em',{"\n"}{"  "}{"}"}){"\n"}{"\n"}{"}"})</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/*  END CONTENT AREA  */}        
</div>
{/* END MAIN CONTAINER */}

    </div>
  )
}

export default Alerts
