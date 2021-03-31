//sudo apt-get install wiringpi
//npm install node-blinkt
//const Blinkt = require('node-blinkt');
//const leds = new Blinkt;
const { DEBUG, BRIGHTNESS } = require('./../helper/config');

let lastStatus = "";

function setColor(red: number, green: number, blue: number, brightness: number){
    if(DEBUG === "true"){
        console.log(`Setting leds with: Red: ${red}, Green: ${green}, Blue: ${blue} and Brightness: ${brightness}`);
    }

    //leds.setup();
    //leds.clearAll();
    //leds.setAllPixels(red, green, blue, brightness);
    //leds.sendUpdate();
}

export class ledService{
    clearLEDs(): void{
        if(lastStatus === "cleared"){
            return;
        }

        if(DEBUG === "true"){
            console.log("Clear all LEDs");
        }

        lastStatus = "cleared";
        
        //leds.setup();
        //leds.clearAll();
        //leds.sendUpdate();
    };

    async setAvailable(): Promise<void> {
        if(lastStatus === "Available"){
            return;
        }

        if(DEBUG === "true"){
            console.log("Set LEDs to green");
        }
        
        setColor(0, 255, 0, BRIGHTNESS);

        lastStatus = "Available";
    };

    async setAway(): Promise<void>{
        if(lastStatus === "Away"){
            return;
        }

        if(DEBUG === "true"){
            console.log("Set LEDs to yellow");
        }
        
        setColor(255, 100, 0, BRIGHTNESS);

        lastStatus = "Away";
    }

    async setBusy(): Promise<void> {
        if(lastStatus === "Busy"){
            return;
        }
        if(DEBUG === "true"){
            console.log("Set LEDs to red");
        }
        
        setColor(255, 0, 0, BRIGHTNESS);

        lastStatus = "Busy";
    };

    async errorBlink(): Promise<void> {
        await this.setBusy();
        await sleep(1000);
        await this.clearLEDs();
        await sleep(500);
        await this.setBusy();
        await sleep(1000);
        await this.clearLEDs();
        await sleep(500);
        await this.setBusy();
        await sleep(1000);
        await this.clearLEDs();
    }
}

function sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   
