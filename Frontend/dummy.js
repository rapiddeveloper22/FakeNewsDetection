app.post('/', function (req, res) {
    console.log("Inside addTweet");
    var tweet = req.body.tweetContent;
    console.log(req.body);
    console.log(tweet);
    // axios.get('https://app.scrapingbee.com/api/v1/store/google', {
    //     params: {
    //         'api_key': '42W7CHEVCB6VR9HQ3MN94I21RY9SU4491QHUSTHI0CFU21VSDIZ58KH9ZN9EIN198YSLER40VLNT652X',
    //         'search': tweet,
    //     }
    // }).then(function (response) {
    //     console.log(response);
    // })
})