const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const qs = require('querystring')

const hostname = ('127.0.0.1'); // hostname defined
const port=3000 // port defined

// This funciton will perform routing
function onRequest(req,res) {
    // var baseURl ='http: //' + req.headers.host + '/';
    // var myURL = new URL(req.url,baseURL);
    res.statusCode=200
    res.setHeader=('Content-Type','text/html')

    console.log(req.url)

    if (req.url == '/')
    {
        index(req,res)
    }
    else if (req.url == '/showssignin')
    {
        showssignin(req,res)
    }
    else if (req.url == '/dosignin')
    {
        dosignin(req,res)
    }
    else if (req.url == '/showssignup')
    {
        showssignup(req,res)
    }
    else if (req.url == '/dosignup')
    {
        dosignup(req,res)
    }
    else{
        res.writeHead (404, {'Content-Type': '/text/html'});
        return res.end("Page not Found");
    }
}

function index(req,res) {
    fs.readFile('index.html', function(err,data)
    {
        res.write(data);
        return res.end();
    });
}

function showssignin(req,res) {
    fs.readFile('sign_in.html', function(err,data)
    {
        res.write(data);
        return res.end();
    });
}


function dosignin(req,res) 
{
    var body = ''
    req.on('data', function (data)
    {
        body+= data // collecting the request data in the body variable
        console.log('Partial body: ' + body)
    })
    
    req.on('end',function()
    {
        console.log('Body: ' + body)
        var qs = new URLSearchParams(body)
        var username = qs.get("username")
        var passwd = qs.get("passwd")
        
        //build the connect object
        var con = mysql.createConnection({
            host: "localhost", //IP Address
            user: "root",
            password: "ashish110020",
            database: "credentials"
        });
        // connect to the database
        con.connect(function (err)
        {
        if (err) throw err;

        con.query ("SELECT * FROM logindata WHERE username=? and passwd=?", [username, passwd],
        function (err, result, fields) 
        {
            if (err) throw err;
            console.log(result);
            if (result.length == 1)
            {
                res.write("<h1>Sign-In Successful<h1>")
                res.end()
            }
            else
            {
                res.write("<h1>Sign-In Failed<h1>")
                res.end()
            }
        });
    });
    
})
}

function showssignup(req,res) {
    fs.readFile('sign_up.html', function(err,data)
    {
        res.write(data);
        return res.end();
    });
}
function dosignup(req,res)
{
    var body = ''
    req.on('data', function (data)
    {
        body+= data // collecting the request data in the body variable
        console.log('Partial body: ' + body)
    })
    
    req.on('end',function()
    {
        console.log('Body: ' + body)
        var qs = new URLSearchParams(body)
        var username = qs.get("username")
        var passwd = qs.get("passwd")
        var confpasswd = qs.get('confpasswd')
        if(passwd!=confpasswd){
            res.write("<h1>Password Mismatch</h1>")
        } 
        var con = mysql.createConnection({
            host:  "localhost",
            user: "root",
            password: "ashish110020",
            database: "credentials"
        });
        con.connect(function (err)
        {
            if (err) throw err;
            console.log(Connected)

            var sql = "INSERT INTO logindata (username,passwd) VALUES (?,?)";
            
            con.query(sql,[username,passwd],function(err,result){
                if(err) throw err;
                console.log("1 record inserted");
                res.write("<h1>Congratulations! You have signed up successfully")
                res.end()
            });
        });
    })
}

const server =http.createServer(onRequest)
server.listen(port,/*hostname*/(err) => {
    // console.log("Server running at http://${hostname}: ${port}/");
    console.log('server started on port: '+ port);
});