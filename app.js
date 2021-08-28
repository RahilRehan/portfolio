const bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    express = require("express"),
    app = express(),
    morgan = require("morgan");
require("dotenv").config();


const  blogRouter = require("./routes/blog"),
    Blog = require("./models/blog");

const PORT = process.env.PORT || 3000;


mongoose.connect(`mongodb+srv://rahilmuti:${process.env.MONGO_PASSWORD}@cluster0.fptgk.gcp.mongodb.net/portfolio?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");

app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer()); //goes after bodyParser

app.use("/blog", blogRouter);

// Routes
app.get("/", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("Error, cannot find blogs!");
        } else {
            res.render("home", { blogs: blogs });
        }
    })
})

app.get("/about", (req, res)=>{
    res.render("about");
})

app.get("/projects", (req, res)=>{
    res.render("projects")
})

app.get('/resume', function (req, res) {
    res.sendFile(__dirname + "/public/docs/resume.pdf");
});

app.listen(PORT, () => {
    console.log(`Server up and running at port: ${PORT}`)
})
