let Id;
let accounts;
let contract;
let userName;
let owner = "0x5a3136525e762e16D28bBF699728E5026C51e612";
var contractAddress = "0xde9B1FACaD35b0EC0F38c00480B6155D780515a6"
var web3;
var tweet;
var finalw = 0;

const getContract = async (web3) => {
    const supp = await $.getJSON('Twitter.json');
    const netId = await web3.eth.net.getId();

    const deployedNetwork = supp.networks[netId];
    const supply = new web3.eth.Contract(
        supp.abi,
        deployedNetwork && deployedNetwork.address
    );
    supply.options.address = contractAddress;

    return supply;
};

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener("load", async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject("Must install MetaMask");
            }
        });
    });

};



let register = async () => {
    $("#egister").on("click", async (e) => {
        e.preventDefault();
        var email = $("#email").val();
        var pass = $("#pass").val();
        var name = $("#name").val();

        var id = Math.floor(Math.random() * 100);
        var username = $("#uname").val();

        await contract.methods.addUser(id, name, accounts[0], username, email, pass).send({ from: accounts[0] }).then(function (tx) {
            console.log("User added");
        });
    })
}

let login = async () => {
    $("#loginn").on("click", async (e) => {
        e.preventDefault();
        var pass = $("#passs").val();
        var username = $("#uname").val();

        var ans = await contract.methods.login(accounts[0], pass).call()
        console.log(ans);

        if (await contract.methods.login(accounts[0], pass).call() == true) {
            userName = username;
            console.log("Logged in");
        }
        else if (await contract.methods.login(accounts[0], pass).call() == false) {
            console.log("Wrong credentials");
        }
    })
}

let addTweet = async () => {
    $("#addTweet").on("click", async (e) => {
        e.preventDefault();

        tweet = $("#tweetContent").val();

        await contract.methods.addTweet(accounts[0], userName, tweet, "").send({ from: accounts[0] }).then(function (tx) {
            console.log("Tweet added successfully");
        });

    });
}




let viewTweets = async () => {
    $("#viewAllTweets").on("click", async (e) => {
        e.preventDefault();

        var allTweets = await contract.methods.viewTweets().call()

        for (var i = 0; i < allTweets.length; i++) {
            $("#allTweets").append("<p class='dvclass' id='" + i + "' onclick='downVote(this.id)' >" + allTweets[i].tweet + "</p>")
        }

        console.log(allTweets);
    })
}

let downVote = async (id) => {
    $(".dvclass").on("click", async (e) => {
        e.preventDefault();
        if (accounts[0] == '0x5a3136525e762e16D28bBF699728E5026C51e612') {
            var users = await contract.methods.downVotesUsers(id).call();
            for (var i = 0; i < users.length; i++) {
                web3.eth.sendTransaction({ from: accounts[0], to: users[i], value: '2000000000000000000' })
            }
            return;
        }

        console.log(accounts);

        web3.eth.sendTransaction({ from: accounts[0], to: '0x5a3136525e762e16D28bBF699728E5026C51e612', value: '1000000000000000000' })


        await contract.methods.downVote(accounts[0], owner, id).send({ from: accounts[0] }).then(function () {
            console.log("Downvote increased");
        });



        var ans = await contract.methods.checkFake(id).call();
        tweet = $("#tweetContent").val()
        console.log("My tweet is : " + tweet);
        console.log(ans);

        if (await contract.methods.checkFake(id).call() == true) {
            fetch('/', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer abcdxyz',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tweet,
                }),
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log(data)
                    finalw += ((data) * 70);
                    finalw += 30;
                    console.log(finalw);
                });
        }

        var text = null;

        $.get("/", function (data) {
            var gs = randomIpsum(text, data);
            gs = parseFloat(gs);
            // console.log(gs);

            if (gs) {
                finalw += ((gs / 1) * 70);
            }
            if (ans) {
                finalw += 30
            }

            console.log("al " + finalw);
        })
    })
}

function randomIpsum(text, data) {
    text.value = data
    console.log(data);
    return data;
}


let viewacc = async () => {
    console.log("Accounts");
    console.log(contract.methods.viewAllAccounts().call());
}

async function app() {
    web3 = await getWeb3();
    accounts = await web3.eth.getAccounts();
    console.log(web3.eth.getBalance(accounts[0]))
    contract = await getContract(web3);
    console.log(web3);
    register();
    login();
    addTweet();
    viewTweets();
    viewacc();
}

app();