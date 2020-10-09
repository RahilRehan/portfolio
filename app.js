const bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    express = require("express"),
    app = express();


const  blogRouter = require("./routes/blog"),
    Blog = require("./models/blog");

const PORT = 3000;

mongoose.connect("mongodb://localhost/portfolio", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");

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

app.listen(PORT, () => {
    console.log(`Server up and running at port: ${PORT}`)
})