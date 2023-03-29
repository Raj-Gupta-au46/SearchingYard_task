const express = require('express');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const route = require('./routes/route');
const session = require('express-session')
const bodyparser= require('body-parser')
const passport = require('passport')
const facebookStrategy = require("passport-facebook").Strategy
const config = require('./config/config');
const taskModel = require('./models/taskModel');

const app = express();
app.use(bodyparser.json());

app.use(session({
    resave:false,
    saveUninitialized:true.valueOf,
    secret:'SECRET'
}));
app.set('view engine','ejs');
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(function (user,cb){
    cb(null,user)
});
passport.deserializeUser(function (obj,bd){
    cb(null,obj)
});

passport.use( new facebookStrategy({
    clientID:config.facebookAuth.clientId,
    clientSecret:config.facebookAuth.clientSecret,
    callbackURL:config.facebookAuth.callbackURL
},
   async function(accessToken, refreshToken,profile,done){
      
        const user = await taskModel.findOne({
            "accountId": task.id,
            "provider": 'facebook'
          });

          if (!user) {
            console.log('Adding new facebook user to DB..');
            const user = new taskModel({
              accountId: task.id,
              name: profile.displayName,
              provider: profile.provider,
            });
            await user.save();
            
            return cb(null, profile);
          } else {
            console.log('Facebook User already exist in DB..');

        return done(null,profile);
    }
}
))



app.use(bodyParser.json());



mongoose.connect("mongodb+srv://rajgupta07082000:0Um5TBcHGam3DxeZ@cluster0.p92r9bx.mongodb.net/rajgupta07082000-Searching_Yard", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route);

app.listen(process.env.PORT || 3006, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3006))
});