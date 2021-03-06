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

router.get("/delete/:name/:tasks", (req, res) => {
    User.findOneAndUpdate(
        { name: req.params.name },
        { $pull: { tasks: req.params.tasks }},
        { new: true },
        function(err, value) {
            res.render("dashboard", {
                name: req.params.name,
                value: value.tasks,
            })
        }
    )
})

router.get("/edit/:name/:tasks", (req, res) => {
    res.render("editform.ejs", {
        name: req.params.name,
        tasks: req.params.tasks,
    })
})

router.post("/edittask/:name/:tasks", (req, res) => {
    console.log(req.body.newtask);
    console.log(req.params.tasks)
    User.findOneAndUpdate(
        { name: req.params.name, tasks: req.params.tasks },
        { $set: { tasks: req.body.newtask }},
        { new: true },
        function(err, value) {
            res.render("dashboard", {
                name: req.params.name,
                value: value.tasks,
            })
        }
    )
})

router.post("/tasks/:name", (req, res, next) => {
    // console.log(req.body.toString());
    const obj = JSON.parse(JSON.stringify(req.body));

        User.findOneAndUpdate(
            {name: req.params.name},
            { $addToSet: { tasks: obj.newtask }},
            { upsert: true, new: true },
            function(err, value) {
                res.render("dashboard", {
                    name: req.params.name,
                    value: value.tasks,
                })
                console.log(value.tasks);
            }
        )
})

router.post("/logout", (req, res) => {
    req.logOut();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });

module.exports = router;
