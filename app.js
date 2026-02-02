if (process.env.NODE_ENV!="production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listings.js");
// const review = require("../models/review.js");
const reviewRouter = require("./routes/reviews.js");
const { listingSchema } = require("./schema.js");
const { connect } = require("http2");
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter = require("./routes/user.js");
const dburl= process.env.ATLASDB_URL;


// Connect to MongoDB and start server after successful connection
async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("Connected to DB");

        // Start server only after DB connection
        app.listen(8080, () => {
            console.log("Server is listening on port 8080");
        });
    } catch (err) {
        console.error("DB connection error:", err);
    }
}
main();

// App configuration
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.locals.layout = "layouts/boilerplate";

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret:process.env.secret,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("❌ error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

console.log("ENV:", dburl);

// Routes

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.sucess=req.flash("sucess");
     res.locals.error=req.flash("error");
     res.locals.currUser=req.user;
     next();
})

//validate listings
const validateListing=(req,res,next)=>{
   let {error}= listingSchema.validate(req.body);
   
if (error) {
    let errMsg=error.details.map((el)=>el.message).join(",");
  throw new ExpressError(400,errMsg);
}else{
    next();
} 
}
//demouser
// app.get("/demouser", async (req,res)=>{
// let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-student",
// });
//  let registerUser= await User.register(fakeUser,"heloworld");
// res.send(registerUser);
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
// 404 handler
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


