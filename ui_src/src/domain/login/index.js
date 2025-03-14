// Copyright 2022-2023 The Memphis.dev Authors
// Licensed under the Memphis Business Source License 1.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// Changed License: [Apache License, Version 2.0 (https://www.apache.org/licenses/LICENSE-2.0), as published by the Apache Foundation.
//
// https://github.com/memphisdev/memphis-broker/blob/master/LICENSE
//
// Additional Use Grant: You may make use of the Licensed Work (i) only as part of your own product or service, provided it is not a message broker or a message queue product or service; and (ii) provided that you do not use, provide, distribute, or make available the Licensed Work as a Service.
// A "Service" is a commercial offering, product, hosted, or managed service, that allows third parties (other than your own employees and contractors acting on your behalf) to access and/or use the Licensed Work or a substantial set of the features or functionality of the Licensed Work to third parties as a software-as-a-service, platform-as-a-service, infrastructure-as-a-service or other similar services that compete with Licensor products or services.

import './style.scss';

import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'antd';

import { LOCAL_STORAGE_TOKEN } from '../../const/localStorageConsts';
import betaFullLogo from '../../assets/images/betaFullLogo.svg';
import { ApiEndpoints } from '../../const/apiEndpoints';
import sharps from '../../assets/images/sharps.svg';
import { httpRequest } from '../../services/http';
import AuthService from '../../services/auth';
import Button from '../../components/button';
import Loader from '../../components/loader';
import { Context } from '../../hooks/store';
import Input from '../../components/Input';
import pathDomains from '../../router';
import { connect } from 'nats.ws';
import { SOCKET_URL } from '../../config';

const Login = (props) => {
    const [state, dispatch] = useContext(Context);
    const history = useHistory();
    const [loginForm] = Form.useForm(); // form controller
    const [formFields, setFormFields] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const referer = props?.location?.state?.referer || '/overview';
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(LOCAL_STORAGE_TOKEN) && AuthService.isValidToken()) {
            history.push(referer);
        } else {
            getSignupFlag();
        }
    }, []);

    const getSignupFlag = async () => {
        setisLoading(true);
        try {
            const data = await httpRequest('GET', ApiEndpoints.GET_SIGNUP_FLAG);
            if (data.show_signup && !state.skipSignup) {
                history.push(pathDomains.signup);
            }
            setIsSignup();
            setisLoading(false);
        } catch (error) {
            setisLoading(false);
        }
    };

    const handleUserNameChange = (e) => {
        setFormFields({ ...formFields, username: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setFormFields({ ...formFields, password: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const values = await loginForm.validateFields();
        if (values?.errorFields) {
            return;
        } else {
            try {
                setLoadingSubmit(true);
                const { username, password } = formFields;
                const data = await httpRequest('POST', ApiEndpoints.LOGIN, { username, password }, {}, {}, false);
                if (data) {
                    AuthService.saveToLocalStorage(data);
                    try {
                        const conn = await connect({
                            servers: [SOCKET_URL],
                            token: '::memphis'
                        });
                        dispatch({ type: 'SET_SOCKET_DETAILS', payload: conn });
                    } catch (error) {}
                    dispatch({ type: 'SET_USER_DATA', payload: data });
                    history.push(referer);
                }
            } catch (err) {
                setError(err);
            }
            setLoadingSubmit(false);
        }
    };

    return (
        <>
            {!isLoading && !isSignup && (
                <section className="loginContainers">
                    {state.loading ? <Loader></Loader> : ''}
                    <div className="desktop-container">
                        <div className="desktop-content">
                            <div className="logoImg">
                                <img alt="logo" src={betaFullLogo}></img>
                            </div>
                            <div className="title">
                                <p>Hey Memphiser,</p>
                                <p>Welcome</p>
                            </div>
                            <div className="login-form">
                                <Form
                                    name="basic"
                                    initialValues={{
                                        remember: true
                                    }}
                                    form={loginForm}
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Username can not be empty'
                                            }
                                        ]}
                                    >
                                        <div className="field name">
                                            <p>Username / Email</p>
                                            <div>
                                                <Input
                                                    placeholder="Type username / email"
                                                    type="text"
                                                    radiusType="semi-round"
                                                    colorType="gray"
                                                    backgroundColorType="none"
                                                    borderColorType="gray"
                                                    width="19vw"
                                                    height="43px"
                                                    minWidth="200px"
                                                    onBlur={handleUserNameChange}
                                                    onChange={handleUserNameChange}
                                                    value={formFields.username}
                                                />
                                            </div>
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Password can not be empty'
                                            }
                                        ]}
                                    >
                                        <div className="field password">
                                            <p>Password</p>
                                            <div>
                                                <Input
                                                    placeholder="Password"
                                                    type="password"
                                                    radiusType="semi-round"
                                                    colorType="gray"
                                                    backgroundColorType="none"
                                                    borderColorType="gray"
                                                    width="19vw"
                                                    height="43px"
                                                    minWidth="200px"
                                                    onChange={handlePasswordChange}
                                                    onBlur={handlePasswordChange}
                                                    value={formFields.password}
                                                />
                                            </div>
                                        </div>
                                    </Form.Item>
                                    <Form.Item className="button-container">
                                        <div>
                                            <Button
                                                width="19vw"
                                                height="43px"
                                                minWidth="200px"
                                                placeholder="Sign in"
                                                colorType="white"
                                                radiusType="circle"
                                                backgroundColorType="purple"
                                                fontSize="12px"
                                                fontWeight="600"
                                                isLoading={loadingSubmit}
                                                onClick={handleSubmit}
                                            />
                                        </div>
                                    </Form.Item>

                                    {error && (
                                        <div className="error-message">
                                            <p>The username and password you entered did not match our records. Please double-check and try again.</p>
                                        </div>
                                    )}
                                </Form>
                            </div>
                        </div>
                        <div className="brand-shapes">
                            <img alt="sharps" src={sharps}></img>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default Login;
