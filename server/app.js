const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');

const PORT = 3421
const app = express();

app.use(bodyParser.json());

const services =
  [
    'http://ec2-34-217-60-83.us-west-2.compute.amazonaws.com:1121',
    'http://ec2-35-160-46-186.us-west-2.compute.amazonaws.com:1121',
    'http://ec2-35-160-216-99.us-west-2.compute.amazonaws.com:1121',
    'http://ec2-34-217-214-70.us-west-2.compute.amazonaws.com:1121'
  ]
let current = 0

const handler = (req, res) => {
  console.log(`handling request to ${services[current] + req.url}`)
  req.pipe(request({ url: services[current] + req.url }))
    .on('error', (err) => {
      console.log('error from load balance request', err);
      res.sendStatus(500);
    }).pipe(res);
  current = (current + 1) % services.length;
}

app.get('*', handler)
app.post('*', handler)


// app.get('*', (req, res) => {
//   //console.log(`req url ${req.url}`) 
//   let url = services[current] + req.url
//   if (current === services.length - 1) {
//     current = 0
//   } else {
//     current = current + 1
//   }
//   console.log(`requesting index ${current} url ${url}`)
//   req.pipe(request(url)).on('error', (err) => {
//     console.log('error from load balance request', err)
//     res.sendStatus(500);
//   }).pipe(res)
// })

app.listen(PORT, () => console.log(`app listening on port ${PORT}`))

