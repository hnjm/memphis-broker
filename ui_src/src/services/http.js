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

import { message } from 'antd';
import axios from 'axios';

import { SERVER_URL, SHOWABLE_ERROR_STATUS_CODE, AUTHENTICATION_ERROR_STATUS_CODE, SANDBOX_SHOWABLE_ERROR_STATUS_CODE } from '../config';
import { LOCAL_STORAGE_TOKEN, LOCAL_STORAGE_EXPIRED_TOKEN, LOCAL_STORAGE_SKIP_GET_STARTED } from '../const/localStorageConsts.js';
import { ApiEndpoints } from '../const/apiEndpoints';
import pathDomains from '../router';
import AuthService from './auth';

export async function httpRequest(method, endPointUrl, data = {}, headers = {}, queryParams = {}, authNeeded = true, timeout = 0, serverUrl = null) {
    let isSkipGetStarted;
    if (authNeeded) {
        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
        headers['Authorization'] = 'Bearer ' + token;
    }

    const HTTP = axios.create({
        withCredentials: serverUrl ? false : true
    });
    if (method !== 'GET' && method !== 'POST' && method !== 'PUT' && method !== 'DELETE')
        throw {
            status: 400,
            message: `Invalid HTTP method`,
            data: { method, endPointUrl, data }
        };
    try {
        const url = `${serverUrl || SERVER_URL}${endPointUrl}`;
        const res = await HTTP({
            method,
            url,
            data,
            headers,
            timeout,
            params: queryParams
        });
        const results = res.data;
        return results;
    } catch (err) {
        if (
            window.location.pathname !== pathDomains.login &&
            window.location.pathname !== pathDomains.signup &&
            err?.response?.status === AUTHENTICATION_ERROR_STATUS_CODE &&
            !serverUrl
        ) {
            isSkipGetStarted = localStorage.getItem(LOCAL_STORAGE_SKIP_GET_STARTED);
            localStorage.clear();
            if (isSkipGetStarted === 'true') {
                localStorage.setItem(LOCAL_STORAGE_SKIP_GET_STARTED, isSkipGetStarted);
            }
            window.location.assign('/login');
        }
        if (err?.response?.data?.message !== undefined && err?.response?.status === SANDBOX_SHOWABLE_ERROR_STATUS_CODE) {
            message.warning({
                key: 'memphisWarningMessage',
                content: (
                    <>
                        You are in a sandbox environment; this operation is not allowed. <hr /> For a full Memphis experience, please
                        <a
                            className="a-link"
                            href="https://docs.memphis.dev/memphis/getting-started/readme?utm_source=sandbox&utm_medium=banner&utm_campaign=sandbox+installation+banner#getting-started"
                            target="_blank"
                        >
                            install
                        </a>
                    </>
                ),
                duration: 5,
                style: { cursor: 'pointer' },
                onClick: () => message.destroy('memphisWarningMessage')
            });
        }
        if (err?.response?.data?.message !== undefined && err?.response?.status === SHOWABLE_ERROR_STATUS_CODE) {
            message.warning({
                key: 'memphisWarningMessage',
                content: err?.response?.data?.message,
                duration: 5,
                style: { cursor: 'pointer' },
                onClick: () => message.destroy('memphisWarningMessage')
            });
        }
        if (err?.response?.data?.message !== undefined && err?.response?.status === 500) {
            message.error({
                key: 'memphisErrorMessage',
                content: (
                    <>
                        We have some issues. Please open a
                        <a className="a-link" href="https://github.com/memphisdev/memphis-broker" target="_blank">
                            GitHub issue
                        </a>
                    </>
                ),
                duration: 5,
                style: { cursor: 'pointer' },
                onClick: () => message.destroy('memphisErrorMessage')
            });
        }
        if (err?.message?.includes('Network Error') && serverUrl) {
            message.warning({
                key: 'memphisWarningMessage',
                content: `${serverUrl} can not be reached`,
                duration: 5,
                style: { cursor: 'pointer' },
                onClick: () => message.destroy('memphisWarningMessage')
            });
        }
        throw err.response;
    }
}

export async function handleRefreshTokenRequest() {
    let isSkipGetStarted;
    const HTTP = axios.create({
        withCredentials: true
    });
    try {
        const url = `${SERVER_URL}${ApiEndpoints.REFRESH_TOKEN}`;
        const res = await HTTP({ method: 'POST', url });
        const now = new Date();
        const expiryToken = now.getTime() + res.data.expires_in;
        if (process.env.REACT_APP_SANDBOX_ENV) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN, res.data.jwt);
            localStorage.setItem(LOCAL_STORAGE_EXPIRED_TOKEN, expiryToken);
        } else {
            await AuthService.saveToLocalStorage(res.data);
        }
        return true;
    } catch (err) {
        isSkipGetStarted = localStorage.getItem(LOCAL_STORAGE_SKIP_GET_STARTED);
        localStorage.clear();
        if (isSkipGetStarted === 'true') {
            localStorage.setItem(LOCAL_STORAGE_SKIP_GET_STARTED, isSkipGetStarted);
        }
        window.location.assign('/login');
        return false;
    }
}
