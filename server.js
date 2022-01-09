// Lets import the express module
const { NodeAudioVolumeMixer } = require("node-audio-volume-mixer");
var lastVolumeChange = new Date(); 
const express = require('express');
var bodyParser = require('body-parser');
const { nodeModuleNameResolver } = require("typescript");
//start the express app
const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 

// add a route to the app
app.get('/', (req, res) => {
   // send a html file to the client
    res.sendFile(__dirname + '/index.html');
}
);

app.listen(80,  () => {

    console.log('listening on port 80');
}
);

    // if the server gets a POST request, log the data to the console
    app.post('/volume', urlencodedParser, async function (req, res) {
        
        console.log(req.body);
        if(!req.body.volume) return 
        var volume = req.body.volume;

        volume = parseInt(volume);

        //map the volume between 0 and 100 to the range 0 to 1 

        volume = volume / 100;

        if (volume > 1) { volume = 1; }
        if (volume < 0) { volume = 0; }

        //check time between last volume change and now
        var now = new Date();
        var timeDiff = now.getTime() - lastVolumeChange.getTime();
        timeDiff = timeDiff / 1000;
        //if the time difference is less than 1 second, do not change the volume
        if (timeDiff < 2) {
            res.send({ 
                error: "Volume change too fast. " + timeDiff + " seconds since last change"
            });
            return
        }

        NodeAudioVolumeMixer.setMasterVolumeLevelScalar(volume);
        lastVolumeChange = new Date(); 
        res.redirect('/');
      }) 
      
      app.get('/currentvolume', (req, res) => {  
        // send the current volume to the client
        var volume = NodeAudioVolumeMixer.getMasterVolumeLevelScalar();
        volume = volume * 100;
        //remove the decimal point
        volume = Math.round(volume);

        res.send(volume.toString());
     }
     );
   