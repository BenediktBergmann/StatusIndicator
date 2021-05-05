///<reference path="./services/ledService.d.ts" />
///<reference path="./services/storageService.d.ts" />

const {POLL_INTERVAL, POLL_WEEKENDS, START_TIME, END_TIME, DEBUG } = require('./helper/config');

import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import { CustomAuthenticationProvider } from "./helper/authProvider";
import { Availability } from './models/availability';
import cron from 'node-cron';

import { ledService } from "./services/ledService";
import { storageService } from './services/storageService';

const _ledService = new ledService();
const _storageService = new storageService();

async function app(){
    _storageService.removeDeviceCodeDate();
    _storageService.clear();
    checkStatus();

    const intervall = (POLL_INTERVAL > 0 && POLL_INTERVAL < 60)? POLL_INTERVAL : 1;

    const seconds = (DEBUG === "true")? "*/15 " : "";
    const minutes = "*/" + intervall + " ";
    const hours = (getEndHour() === 23)? "* " : getStartHour() + "-" + (getEndHour() + 1) + " ";
    const daysOfMonth = "* ";
    const month = "* "
    const daysOfWeek = (POLL_WEEKENDS === "true")? "*" : "1-5"

    const cronSchedule = seconds + minutes + hours + daysOfMonth + month + daysOfWeek;

    cron.schedule(cronSchedule, checkStatus);

    if(DEBUG === "true"){
        console.log("Cron started with following schedule: " + cronSchedule);
    }
}

async function checkStatus(){
    console.log("--------------------------------------------------")
    console.log(new Date());
    console.log("Checking Presence Status");
    if(withinConfiguredTimeframe()){
        if(DEBUG === "true"){
            console.log("Within configured timeframe. Will proceed");
        }

        const authProvider = new CustomAuthenticationProvider();

        const options = {
            authProvider, // An instance created from previous step
        };
        const graphClient = Client.initWithMiddleware(options);
    
        try {
            if(DEBUG === "true"){
                console.log("Attempt to get presence");
            }

            /*const scheduleInformation = {
                schedules: ['Solutions@crmkonsulterna.se'],
                startTime: {
                    dateTime: '2021-04-05T07:00:00',
                    timeZone: 'Europe/Berlin'
                },
                endTime: {
                    dateTime: '2021-04-05T18:00:00',
                    timeZone: 'Europe/Berlin'
                },
                availabilityViewInterval: 60
            };
            
            let test = await graphClient.api('/me/calendar/getSchedule')
                .version('beta')
                .post(scheduleInformation);*/
            
            let presence = await graphClient.api("me/presence").get();

            if(presence && presence.availability){
                if(presence.availability === Availability.Available ||
                   presence.availability === Availability.AvailableIdle){
                   _ledService.setAvailable();
                }
                else if(presence.availability === Availability.Away ||
                    presence.availability === Availability.BeRightBack){
                    _ledService.setAway();
                }
                else if(presence.availability === Availability.Busy ||
                    presence.availability === Availability.BusyIdle ||
                    presence.availability === Availability.DoNotDisturb){
                    _ledService.setBusy();
                } else {
                    _ledService.clearLEDs();
                }
            }

            if(DEBUG === "true"){
                console.log(presence);
                console.log("ready with getting presence");
            }
        } catch (error) {
            console.log(error);
            await _ledService.errorBlink();
            throw error;
        }
    } else {
        _ledService.clearLEDs();
        if(DEBUG === "true"){
            console.log("Outside configured timeframe. Will try again.");
        }
    }
}

function withinConfiguredTimeframe(){
    const startHour = getStartHour();
    const startMinute = getStartMinutes();

    const endHour = getEndHour();
    const endMinute = getEndMinutes();

    const now = new Date();
    const from  = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
    const to  = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

    return now > from && now < to;
}

function getStartHour(){
    const defaultStartHour = 8;

    const splitStart = START_TIME.split(":");
    if(splitStart.length !== 2){
        return defaultStartHour;
    }
    else {
        const parsedStartHour = parseInt(splitStart[0]);
        
        if(!isNaN(parsedStartHour)){
            return parsedStartHour;
        } else {
            return defaultStartHour;
        }
    }
}

function getStartMinutes(){
    const defaultStartMinutes = 0;

    const splitStart = START_TIME.split(":");
    if(splitStart.length !== 2){
        return defaultStartMinutes;
    }
    else {
        const parsedStartMinutes = parseInt(splitStart[1]);
        
        if(!isNaN(parsedStartMinutes)){
            return parsedStartMinutes;
        } else {
            return defaultStartMinutes;
        }
    }
}

function getEndHour(){
    const defaultEndHour = 17;

    const splitEnd = END_TIME.split(":");
    if(splitEnd.length !== 2){
        return defaultEndHour;
    }
    else {
        const parsedEndHour = parseInt(splitEnd[0]);
        
        if(!isNaN(parsedEndHour)){
            return parsedEndHour;
        } else {
            return defaultEndHour;
        }
    }
}

function getEndMinutes(){
    const defaultEndMinutes = 0;

    const splitEnd = END_TIME.split(":");
    if(splitEnd.length !== 2){
        return defaultEndMinutes;
    }
    else {
        const parsedEndMinutes = parseInt(splitEnd[1]);
        
        if(!isNaN(parsedEndMinutes)){
            return parsedEndMinutes;
        } else {
            return defaultEndMinutes;
        }
    }
}

app();