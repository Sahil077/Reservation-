const mongoose = require("mongoose");
mongoose.pluralize(null);
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");



mongoose.connect("Enter the dataBase", { useUnifiedTopology: true , useNewUrlParser: true });
mongoose.set('useCreateIndex', true);


const reservationSchema = new mongoose.Schema({
    Destination:String,
    Check_In:String,
    Check_out:String,
    rooms:String,
    Adults:String,
    Children:String,
    EmailId:String,
    Phone_On:String,
});

const Reservation = mongoose.model("Reservation", reservationSchema);


const userdataSchema = new mongoose.Schema({

    email:String,
    password:String

});

userdataSchema.plugin(passportLocalMongoose);

const Userdata = mongoose.model("Userdata", userdataSchema );

passport.use(Userdata.createStrategy());

passport.serializeUser(Userdata.serializeUser());
passport.deserializeUser(Userdata.deserializeUser());

module.exports = function(app){

    app.get("/",function(req,res){
        res.render("home");
    });
    app.get("/login",function(req,res){
        res.render("login");
    });
    app.get("/register",function(req,res){
        res.render("register");
    });
    app.get("/reservation",function(req,res){
        res.render("reservation");
              
    });

    app.get("/logout",function(req,res){
        req.logout();
        res.redirect("/");
    });



    app.post("/register",function(req,res){
        Userdata.register({username:req.body.username},req.body.password,function(err,data){
            if(err){
                console.log(err);
                res.redirect("/register");
            }else{
                console.log(data);
                passport.authenticate("local")(req,res,function(){
                    res.redirect("/reservation");
                });
            }
        });
    });

    app.post("/login",function(req,res){
        
        const user = new Userdata({
            username:req.body.username,
            passport:req.body.password
        });

        req.login(user , function(err,data){
            if(err){
                console.log(err);
            }else{
                passport.authenticate("local")(req,res,function(){
                res.render("reservation"); 
                });
            }
        });

    });

    app.post("/reservationData",function(req,res){
       
        var {
            Destination,
            Check_In,
            Check_out,
            rooms,
            Adults,
            Children,
            EmailId,
            Phone_On,
        } = req.body
        console.log(req.body);

        const info = new Reservation({
            Destination,
            Check_In,
            Check_out,
            rooms,
            Adults,
            Children,
            EmailId,
            Phone_On,
        }).save(function(err,data){
            if(err){
                console.log(err);
            }else{
                res.render("sucessfull");
            }
        }); 
    });

    app.get("/submit",function(req,res){
        Reservation.find({},function(err,data){
            if(err)console.log(err);
            res.render("submit",{items:data});
        });
    });

    app.post("/submit",function(req,res){
        var EmailId = req.body.EmailId
        console.log(EmailId);
        Reservation.findOne({EmailId:EmailId},function(err,data){
            if(err){
                console.log(err);
            }else{
                Reservation.update({EmailId:EmailId},{$set:req.body},function(err,updateddata){
                    console.log(updateddata);
                    res.render("updateSucessfully");
                });
            }
    
        });
    });
    

}