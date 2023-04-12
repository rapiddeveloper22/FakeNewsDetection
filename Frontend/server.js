var express = require('express');
const axios = require('axios');
var bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const { response } = require('express');

const configuration = new Configuration({
    apiKey: process.env.GPT_KEY,
});

const openai = new OpenAIApi(configuration);

var app = express();

var totalNumOfSearchResults = 5;



app.use(bodyParser.json());
app.use(express.static('Frontend'))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + "/" + "login.html");
})

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s//", host, port);
});


app.post('/', function (req, res) {
    var tweet = req.body;
    // res.send({
    //     tweet,
    // });

    tweet["tweet"] = "\"" + tweet["tweet"] + "\" ";

    console.log(tweet["tweet"]);

    var notFake = searchGoogle(tweet["tweet"], res);

})


function searchGoogle(tweetData, res) {
    var sum = 0;
    var ind = 0;

    const options = {
        method: 'GET',
        url: 'https://google-web-search1.p.rapidapi.com/',
        params: { query: tweetData, limit: totalNumOfSearchResults.toString(), related_keywords: 'true' },
        headers: {
            'X-RapidAPI-Key': '6e242bc5f1mshc4876b22b0d4e6dp138f36jsnc3c248b596ff',
            'X-RapidAPI-Host': 'google-web-search1.p.rapidapi.com'
        }
    };


    axios.request(options).then(function (response) {

        for (var i = 0; i < totalNumOfSearchResults - 1; i++) {
            var gResult = response.data.results[i].title;

            console.log("Answer is " + i + " : " + gResult);

            var toCompare = "Return just the semantic similarity percentage for \'" + gResult + "\' and \'" + tweetData + "\' between 0 and 1";

            var num = chatGPT(toCompare, i, sum)
                .then(response => {
                    // console.log(response[0] + " " + response[1]);
                    sum += response[0];
                    if (ind >= totalNumOfSearchResults - 2) {
                        var avg = sum / 13;
                        console.log(avg);
                        res.send(avg.toString());
                    }
                    ind++;
                });
        }


    }).catch(function (error) {
        console.error(error);
    });



}

async function chatGPT(toCompare, i, sum) {
    // console.log("Inside chatGPT : " + sum);
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: toCompare,
            temperature: 0,
            max_tokens: 2048,
        });
        var num = parseFloat(completion.data.choices[0].text)

        return [num, i];
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}

// function incrementSum(num, i) {
//     console.log(i + " : " + num);
//     if (i == 4) {
//         sum += num;
//         console.log("Avg is : " + (sum / 5));
//     um += num;
// }