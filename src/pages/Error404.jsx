import React,{ useEffect} from 'react'

const Error404 = () => {
     useEffect(() => {
    // Add class on mount
    document.body.classList.add('error404');

    // Remove class on unmount
    return () => {
      document.body.classList.remove('error404');
    };
  }, []);
    return (
        <div className="error404 text-center">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 mr-auto mt-5 text-md-left text-center">
                        <a href="/" className="ml-md-5">
                            <img alt="image-404" src="/assets/img/90x90.jpg" className="theme-logo" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="container-fluid error-content">
                <div className="">
                    <h1 className="error-number">404</h1>
                    <p className="mini-text">Ooops!</p>
                    <p className="error-text mb-4 mt-1">The page you requested was not found!</p>
                    <a href="/" className="btn btn-primary mt-5">Go Home</a>
                </div>
            </div>
        </div>
    )
}

export default Error404
