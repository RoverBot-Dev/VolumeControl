var loudness = require("loudness")
var lastVolumeChange = new Date(); 
const express = require('express');
var bodyParser = require('body-parser');
const alert = require('alert');
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
        // check if the request body length is too big
        if (req.body.length > 100) {
            res.status(400).send('Request body too big');
            return;
        }
        console.log(req.body);
        if(!req.body.volume) return
        if(req.body.message)
        {
            if (timeDiff < 2) {
                res.send({ 
                    error: "Too fast. Wait 2 seconds between messages"
                });
                return
            }
            alert(req.body.message)
        }
        var volume = req.body.volume;

        volume = parseInt(volume);

        if (volume > 100) { volume = 100; }
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

        loudness.setVolume(volume)

        lastVolumeChange = new Date(); 
        res.redirect('/');
      }) 
      
      app.get('/currentvolume', async (req, res) => {  
        // send the current volume to the client
        var volume = await loudness.getVolume();
        res.send(volume.toString());
     }
     );
   