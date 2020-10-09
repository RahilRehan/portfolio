const express = require("express"),
    router = express.Router(),
    Blog = require("../models/blog");


//new a blog view
router.get("/newblog", (req, res) => {
    res.render("new");
})

//create blog post
router.post("/newblog", (req, res) => {
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
router.get("/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/");
        } else {
            res.render("show", { blog: foundBlog });
        }
    })
})

//edit a blog
router.get("/:id/editblog", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log("blog not found to edit");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    })
})

//put route to edit blog
router.put("/:id", (req, res) => {
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
router.get("/:id/deleteblog", (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log("error deleting the blog");
        } else {
            res.redirect("/");
        }
    })
})

module.exports = router;