const express = require("express");
const cors = require('cors');
const user = require('./routes/users');
const risks = require('./routes/risk');
const setting = require("./routes/setting");
const permission = require("./routes/permission");
const org = require("./routes/org");
const team = require("./routes/team");
const settingOptions = require("./routes/settingOptions");
const action = require("./routes/action");
const content = require("./routes/content");
const comment = require("./routes/comment");
const app = express();

app.use(cors());
global.__basedir = __dirname;
global.S3_URL = "https://riskproject.s3.us-east-2.amazonaws.com/";
app.use(express.json());
app.use(express.urlencoded({
  extended:true
}))

app.use('/',user);
app.use('/',risks);
app.use('/',setting);
app.use('/',permission);
app.use('/',org);
app.use('/',team);
app.use('/', settingOptions);
app.use('/', action);
app.use('/', content);
app.use('/', comment);


app.get('/',(req,res) => {
  res.setHeader('Access-Control-Allow-Origin','*','http://localhost:4000',{reconnect: true})
  res.header("Access-Control-Allow-Credentials", true);
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PUT,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Accept, X-Custom-Header,Authorization')
  
  if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }else{
      return res.send({ success: "0", message:'Hello World'});   
    }
  
  })



// app.use((req, res, next) => {
//   return res.status(404).json({
//     error: "Not Found",
//   });
// });

// module.exports.handler = serverless(app);




app.listen(4000, function () {
  console.log('Node app is running on port 4000');
  });
  module.exports = app;

