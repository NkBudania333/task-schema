const experss = require("express");
const router = experss.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const User = require("../models/Users");
const flash = require("connect-flash");

router.get("/", (req, res) => res.render("login"));

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    User.find({}, "tasks").exec((err, value) => {
        if(err) {
            return next(err);
        } else {
            res.render("dashboard", {
                name: req.user.name,
                value: value[0].tasks,
            })
        }
    })
});

router.get("/tasks/:name", (req, res) => {
    res.render("dashboard", {
        name: req.params.name
    })
})

router.post("/tasks/:name", (req, res, next) => {
    // console.log(req.body.toString());
    const obj = JSON.parse(JSON.stringify(req.body));

    if(obj.newtask == ""){
        res.render("dashboard", {
            name: req.params.name,
        })
    }
    else{
        User.findOneAndUpdate(
            {name: req.params.name},
            { $addToSet: { tasks: obj.newtask }},
            { upsert: true, new: true },
            function(err, value) {
                res.render("dashboard", {
                    name: req.params.name,
                    value: value.tasks,
                })
                console.log(value.tasks);.03
                265
            }
        )
    }
})

module.exports = router;
