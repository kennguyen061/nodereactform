const express = require('express')
const cors = require("cors");
const app = express()
app.use(express.json())

var request = require('request');
var sortJsonArray = require('sort-json-array');

app.get('/api/supervisors', async (req, res) => {
    //Pulls the json from the url
    request('https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers', function (error, response, body) {
        let sortedjson = JSON.parse(body);
        //Deletes entries with a numeric jurisdiction
        for(var i = 0; i < sortedjson.length; i++) {
            var string = sortedjson[i].jurisdiction.toString();
            var number = Number.parseFloat(string);
            if(!isNaN(number)) {
                delete sortedjson[i];
            }
        }
        //Sorts the json by jurisdiction first, then lastName and firstName respectively
        //sortJsonArray is a stable sort so the firstName and lastName will still be in place when the array is sorted by jurisdiction
        sortedjson = sortJsonArray(sortedjson, 'firstName');
        sortedjson = sortJsonArray(sortedjson, 'lastName');
        sortedjson = sortJsonArray(sortedjson, 'jurisdiction');

        //Creates and populates the arraay of supervisor strings
        var supervisors = Array();
        for(var i = 0; i < sortedjson.length; i++) {
            if(sortedjson[i] != null) {
                supervisors.push(sortedjson[i].jurisdiction + " - " + sortedjson[i].lastName + ", " + sortedjson[i].firstName);
            }
        }
        //Sends the result of supervisors
        res.send(supervisors);
    });
});

app.post('/api/submit', async (req, res) => {
    //Sends approrpriate res error message if these three fields are not filled in (other two are optional)
        //Checks if name only has letters and no numbers
        if (/[^a-zA-Z]/.test(req.body.firstName)) {
            res.send("Please enter a valid First name")
            console.log("INVALID FIRST NAME")
        }
        else if (/[^a-zA-Z]/.test(req.body.lastName)) {
            res.send("Please enter a valid Last name");
            console.log("INVALID LAST NAME")
        }
        //Checks if phone number and/or email are not null and valid
        else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi.test(req.body.email) && req.body.email != '') {
            res.send("Please enter a valid email");
            console.log("INVALID EMAIL");
        }
        //(123) 456-7890 (123)456-7890 123-456-7890 1234567890 are valid
        else if(!/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(req.body.phoneNumber) && req.body.phoneNumber != '') {
            res.send("Please enter a valid phone number");
            console.log("INVALID PHONE NUMBER");
        }
        //Prints to console if all valid (only prints email and phone number if entered)
        else {
            console.log("First Name: " + req.body.firstName);
            console.log("Last Name: " + req.body.lastName);
            console.log("Supervisor: " + req.body.Supervisor);
            if(req.body.email != null) {
                console.log("Email: " + req.body.email);
            }
            if(req.body.phoneNumber != null) {
                console.log("Phone number: " + req.body.phoneNumber);
            }
            res.send("Notification signup successful!")
        }
});

app.use(cors({ origin: "*" }));



// app.get('/hello', async (req, res) => {
//     res.json({'hello': 'world'})
// })

// app.post('/echo', async (req, res) => {
//     try {
//         res.json({
//             'body': req.body
//         })
//     }
//     catch(e) {
//         res.json({
//             'error': e.message
//         })
//     }
// })

app.listen(8080, () => {
    console.log('Listening on 8080. Ctrl+c to stop this server.')
})

module.exports = app;