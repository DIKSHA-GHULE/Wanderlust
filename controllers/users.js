const User=require("../models/user")

//render signup form
module.exports.renderSignupForm=(req, res) => {
  res.render("users/signup");  
}

//signup page
module.exports.signup=async (req, res) => {
    try {
        const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);

    console.log(registerUser);
    req.login(registerUser,(err)=>{
if(err){
    return next(err);
}
  req.flash("sucess", "Welcome to Wandurlust");
    res.redirect("/listings");
    });
  
    } catch (e) {
      req.flash("error",e.message);
      res.redirect("/signup");
    }
};

// render login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
//login page
module.exports.login=
  async (req, res) => {
      req.flash("sucess", `Welcome back, ${req.user.username}!`);
 let redirectUrl = res.locals.redirectUrl || "/listings";
 delete req.session.redirectUrl;
res.redirect(redirectUrl);
  }

//logout
module.exports.logout= (req, res, next) => {
req.logout((err) => {
if (err) {
 return next(err);
}
req.flash("sucess", "you are logged out!");
res.redirect("/listings");
});
}











