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

    //TODO: set LEDs
    //leds.setup();
    //leds.clearAll();
    //leds.setAllPixels(red, green, blue, brightness);
    //leds.sendUpdate();
}

export class ledService{
    clearLEDs(): void{
        if(DEBUG === "true"){
            console.log("Clear all LEDs");
        }
        
        //leds.setup();
        //leds.clearAll();
        //leds.sendUpdate();
    };

    setAvailable(): void {
        if(lastStatus === "Available"){
            return;
        }

        if(DEBUG === "true"){
            console.log("Set LEDs to green");
        }
        
        setColor(0, 255, 0, BRIGHTNESS);
        
        lastStatus = "Available";
    };

    setAway(): void{
        if(lastStatus === "Away"){
            return;
        }

        if(DEBUG === "true"){
            console.log("Set LEDs to yellow");
        }
        
        setColor(255, 100, 0, BRIGHTNESS);

        lastStatus = "Away";
    }

    setBusy(): void {
        if(lastStatus === "Busy"){
            return;
        }
        if(DEBUG === "true"){
            console.log("Set LEDs to red");
        }
        
        setColor(255, 0, 0, BRIGHTNESS);

        lastStatus = "Busy";
    };
}
