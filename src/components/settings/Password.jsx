import React from 'react';

const Password = ({
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword
}) => {
    return (
        <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
            <form id="general-info" className="section general-info">
                <div className="info">
                    <h6 className="">Password</h6>
                    <div className="col-lg-11 mx-auto">
                        <div className="row">
                            {/* Old Password - half width */}
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="oldPassword">Old Password</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        id="oldPassword"
                                        placeholder="Old Password"
                                        defaultValue=""
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* New Password - half width */}
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        id="newPassword"
                                        placeholder="New Password"
                                        defaultValue=""
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password - half width */}
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="text"
                                        className="form-control mb-4"
                                        id="confirmPassword"
                                        placeholder="Confirm Password"
                                        defaultValue=""
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    );
};

export default Password;
