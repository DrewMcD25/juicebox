const express = require('express');
const postsRouter = express.Router();
const { getAllPosts} = require ('../db')
postsRouter.use((req, res, next)=> {
    console.log("A request has been made to /posts")

    next()
})

postsRouter.get('/', async (req, res)=>{
    const Posts = await getAllPosts()

    res.send({
        "posts":[]
    })
})

module.exports = postsRouter