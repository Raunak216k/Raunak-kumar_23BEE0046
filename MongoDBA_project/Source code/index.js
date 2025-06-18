require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const { student } = require("./models/student.js");
const methodOverride = require("method-override");
const { data_students } = require("./initData/studentdata.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { admin } = require("./models/admin.js");
const session = require("express-session");
const flash = require("connect-flash");

const PORT = process.env.PORT || 8080;
const url = process.env.MONGO_URL;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
//flash not working somehow!!!!
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
  console.log("_______________app is listening________________");
  mongoose.connect(url);

  console.log("_____________db connected_________________");
});

// app.get("/addData", (req, res) => {
//   const data = data_students;
//   data.forEach((stud) => {
//     let newStudent = new student({
//       name: stud.name,
//       reg_no: stud.reg_no,
//       school: stud.school,
//       contactNo: stud.contactNo,
//       hostel: stud.contactNo,
//       cgpa: stud.cgpa,
//       image: stud.image,
//     });
//     newStudent.save();
//   });
//   res.send("Data Saved ");
// });

passport.use(new LocalStrategy(admin.authenticate()));
passport.serializeUser(admin.serializeUser());
passport.deserializeUser(admin.deserializeUser());
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", " logged in to access !!!");
    return res.redirect("/login");
  }
  next();
};

//____________auth______________
//signup
app.get("/signup", (req, res) => {
  res.render("./admin/signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newAdmin = new admin({ email, username });
    const registerAdmin = await admin.register(newAdmin, password);
    res.redirect("/students");
    console.log(registerAdmin);
  } catch (err) {
    console.log(err);
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => {
  res.render("./admin/login.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    res.redirect("/students");
  }
);

app.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/students");
  });
});
// ___________CRUD____________
//index route
app.get("/students", isLoggedIn, async (req, res) => {
  const allstudents = await student.find({});
  res.render("./students/index.ejs", { allstudents });
});

app.get("/students/new", isLoggedIn, (req, res) => {
  res.render("./students/newStudent.ejs");
});

//create route
app.post("/students", async (req, res) => {
  const newstudents = new student(req.body.student);
  await newstudents.save();
  console.log(newstudents);
  res.redirect("/students");
});

//update route ->1:edit , 2:update
app.get("/students/:id/edit", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  const showStudent = await student.findById(id);
  console.log(showStudent);
  res.render("./students/edit.ejs", { showStudent });
});

app.put("/students/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  await student.findByIdAndUpdate(id, { ...req.body.student });
  res.redirect("/students");
});

//delete route

app.delete("/students/:id", isLoggedIn, async (req, res) => {
  let { id } = req.params;
  await student.findByIdAndDelete(id);
  res.redirect("/students");
});

//show route
app.get("/students/:id", async (req, res) => {
  let { id } = req.params;
  const showStudents = await student.findById(id);
  res.render("./students/show.ejs", { showStudents });
});
