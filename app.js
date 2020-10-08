const bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

mongoose.connect("mongodb://localhost/portfolio");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer()); //goes after bodyParser

// Schemas
var blogSchema = new mongoose.Schema({
    title: String,
    image: { type: String, default: "placeholder.img" },
    body: String,
    created: { type: Date, default: Date.now },
})

var Blog = mongoose.model("Blog", blogSchema);

// Seed Blog
// Blog.create({
//     title: "Test Blog 01",
//     image: "https://bulma.io/images/placeholders/1280x960.png",
//     body: "lorem ipsum text",
// })

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


//Blog Routes
//new a blog view
app.get("/blog/newblog", (req, res) => {
    res.render("new");
})

//create blog post
app.post("/blog/newblog", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log("Error creating new blog")
        } else {
            res.redirect("/")
        }
    })
})

//show a blog
app.get("/blog/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/");
        } else {
            res.render("show", { blog: foundBlog });
        }
    })
})

//edit a blog
app.get("/blog/:id/editblog", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log("blog not found to edit");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    })
})

//put route to edit blog
app.put("/blog/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, foundBlog) => {
        if (err) {
            console.log("blog not found to update");
        } else {
            res.redirect("/blog/" + req.params.id)
        }
    })
})

//delete route to delete blog
app.get("/blog/:id/deleteblog", (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log("error deleting the blog");
        } else {
            res.redirect("/");
        }
    })
})


app.listen(3000, () => {
    console.log("Server running at 3000!")
})