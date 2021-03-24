///<reference path="./../services/storageService.d.ts" />
///<reference path="./../services/mailService.d.ts" />

import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import { AccessToken } from "../models/accessToken";
const { APP_ID, TENANT_ID, AAD_ENDPOINT, DEVICE_CODE_REQUEST_TIMEOUT, EMAIL_ON, DEBUG } = require('./config');

const msal = require('@azure/msal-node');
import { mailService } from './../services/mailService';
import { storageService } from './../services/storageService';

export class CustomAuthenticationProvider implements AuthenticationProvider {

    config: any;
    pca: any;
    scope: string[] = ["user.read", "presence.read"];

    _mailService = new mailService();
    _storageService = new storageService();

    constructor(){

        this.config = {
            auth: {
                clientId: APP_ID,
                authority: AAD_ENDPOINT + TENANT_ID,
            }
        };

        this.pca = new msal.PublicClientApplication(this.config);
    }

	/**
	 * This method will get called before every request to the msgraph server
	 * This should return a Promise that resolves to an accessToken (in case of success) or rejects with error (in case of failure)
	 * Basically this method will contain the implementation for getting and refreshing accessTokens
	 */
	public async getAccessToken(): Promise<string> {
        const accessToken: AccessToken | null = await this._storageService.getToken();
        
        const now: Date = new Date();
        const expiresOn: Date = accessToken ? new Date(accessToken.expiresOn) : new Date(0);

        if (accessToken && expiresOn > now) {
            if (DEBUG === "true") {
              console.log(`Valid Accesstoken found (${accessToken.value}).`);
            }
            return accessToken.value;
        }

        if (accessToken && accessToken.refreshToken) {
            if (DEBUG === "true") {
                console.log(`Refreshtoken present (${accessToken.refreshToken}). Getting new accesstoken.`);
            }

            const refreshTokenRequest = {
                refreshToken: accessToken.refreshToken,
                scopes: this.scope,
            };
            
            this.pca.acquireTokenByRefreshToken(refreshTokenRequest).then((response: any) => {
                if(DEBUG === "true"){
                    console.log(JSON.stringify(response));
                }

                let parsedResponse = JSON.parse(response);
                console.log("Logged in as: " + parsedResponse.account.username)

                var accessToken : AccessToken = {
                    value: parsedResponse.accessToken,
                    expiresOn: parsedResponse.expiresOn,
                    refreshToken: ""
                }

                this._storageService.setToken(accessToken);

                return parsedResponse.accessToken;
            }).catch((error: any) => {
                this._storageService.removeToken();
                console.log(JSON.stringify(error));
            });
        } else {
            var deviceCodeDate = await this._storageService.getDeviceCodeDate();

            if(DEBUG === "true" && deviceCodeDate){
                console.log("Stored Device Code Date: " + deviceCodeDate);
            }

            if(!deviceCodeDate || deviceCodeDate <= now){
                this._storageService.removeDeviceCodeDate();

                const deviceCodeRequest = {
                    deviceCodeCallback: (response: any) => {
                        console.log(response.message);
                        var expiresOn = new Date(now.getTime() + DEVICE_CODE_REQUEST_TIMEOUT * 60000);
                        this._mailService.sendLoginEmail(expiresOn.toLocaleString(), response.message);
                    },
                    scopes: this.scope,
                    timeout: DEVICE_CODE_REQUEST_TIMEOUT,
                };
                
                this.pca.acquireTokenByDeviceCode(deviceCodeRequest).then(async (response: any) => {
                    if(DEBUG === "true"){
                        console.log(JSON.stringify(response));
                    }
                    
                    console.log("Logged in as: " + response.account.username)

                    var accessToken : AccessToken = {
                        value: response.accessToken,
                        expiresOn: response.expiresOn,
                        refreshToken: ""
                    }

                    await this._storageService.setToken(accessToken);

                    return response.accessToken;
                }).catch((error: any) => {
                    this._storageService.removeToken();
                    console.log(error.message);
                    console.log(error.stack);
                });

                this._storageService.setDeviceCodeDate(now);
            } else {
                if(DEBUG === "true"){
                    console.log("Device Code was requested within timout frame. Doing nothing.");
                }
            }
        }

        return ""
    }
    
}