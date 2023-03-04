const express = require('express')
const app = express()
app.use(express.urlencoded({extended : false}))
app.use(express.json())
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config();

app.use(cors())
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

const http = require('http')
const server = http.createServer(app)
const { Server}  = require('socket.io')
const io = new Server(server)


server.listen(3000,()=>{
  console.log(`app listening on ${3000}`);
})

app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/index.html')
})

let   lecturesData = []
app.get('/videos',(req,res)=>{
   res.send(lecturesData)
})


let userInfo = [1,22]


io.on('connection',(socket)=>{
  for (let i = 0; i < userInfo.length; i++) {
    socket.on(userInfo[i],(msg)=>{
      io.emit(userInfo[i],msg)
      console.log('emmited at ' + userInfo[i] + '  message : ' + msg);
    }) 
  }

})


app.post('/questionResponse',async (req,res)=>{
  let question = req.body.question
  console.log(question);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: question,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

 let answer = response.data.choices[0].text
 res.send({status : 200 , data : answer})

})
