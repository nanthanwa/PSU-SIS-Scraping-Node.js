# PSU-SIS-Scraping-Node.js
This project is scraping SIS website [https://sis.psu.ac.th](https://sis.psu.ac.th) to get the profile of student such as name, email, photo, etc. by call REST API from client to node.js server on url `http://server-ip:3000/getProfileStudent` which require 2 parameters (username, password) of student PSU Passport (maybe work on teacher and staff) then server will return object profile of student.

### Features
- Authenticate SIS via PSU Passport
- Get student name
- Get student email
- Get student photo
- Get student cumulative GPA
- Get student class schedule
- Get student registration result

### How to use
- Clone this project
```
git clone https://github.com/nanthan/PSU-SIS-Scraping-Node.js.git
```

- Go to PSU-SIS-Scraping-Node.js
```
cd PSU-SIS-Scraping-Node.js
```

- Install dependencies
```
npm install
```

- If you already have gulp you can run gulpfile
```
gulp
```

Or
```
node index.js
```

### Example client-side call API
- AgularJS
```
  $http.post('http://localhost:3000/getProfileStudent', 
    {
      username : 'Your student ID',
      password : 'Your password'
    })
    .then(function(response){
      console.log(response.data);
    }
    , function(error){
      console.log(error);
    });
```
- jQuery
```
$.post("http://localhost:3000/getProfileStudent",
    {
      username : 'Your student ID',
      password : 'Your password'
    },
    function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
```

### If don't want to use REST API
You can move the code inner `app.post('/getProfileStudent')` to outer function and set value of `req.body.username` to `YOUR_USERNAME` and `req.body.username` to `YOUR_PASSWORD` and change `resToClient` function to `console.log()` to display resule.

Good luck Have fun.

### Special thanks
<a href="https://github.com/Kusumoto/psu-sis-autoregister">psu-sis-autoregister</a> (PHP version.)

### License
MIT

### Contact info
* Website : [https://inan.in.th](http://inan.in.th)
* Facebook : [Thanwa Nooploy](https://fb.com/thanwa.np)
* Email : [thanwa.npl@gmail.com](mailto:thanwa.npl@gmail.com)
