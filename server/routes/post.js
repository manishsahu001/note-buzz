const express = require('express');
const router = express.Router();
const postSchema = require('../models/postSchema');
const authentication = require('../middleware/authentication');
const {body, validationResult} = require('express-validator');

// Get all notes of specific user
router.get('/fetchallpost', authentication, async (req, res)=>{
    try {
        const userId = req.user;
        const post = await postSchema.find({user: userId});
        res.json(post);
    } catch (error) {
        return res.status(404).json({error: error.message})
    }
})


// Adding new tweet
router.post('/addpost',authentication, 
[
    body("title", "Title must be at least 4 character logn").isLength({min: 4}),
    body("description", "Description must be at least 4 characters long").isLength({min: 4})
], 
async(req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error: error.message});
    }

    try {
        const {title, description} = req.body

        const userId = req.user;
        const add_post = await postSchema({
            user: userId,
            title,
            description
        });
        const post = await add_post.save();
        return res.status(201).json({success: true, post});
    } catch (error) {
        return res.status(401).json({success: false, error: error.message})    
    } 
});

// Upadating existing tweet
router.put('/updatepost/:id', authentication, 
[
    body("title", "Title must be at least 4 characters long").isLength({min: 4}),
    body("description", "Description must be at least 4 characters long").isLength({min: 4})
], 
async (req, res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(404).json({success: false, error: error.message});
    }

    try {
      
        const {title, description} = req.body;

        // Creating empty object to store updated tweet
        const newPost = {};

        // Replacing tweet
        if(title){newPost.title = title}
        if(description){newPost.description = description};

        // Check if tweet is exist or not
        let post = await postSchema.findById(req.params.id);
        if(!post){
            return res.status(404).json({success: false, error: "Tweet Not Found"});
        }

        // Checking if the user is genuin or not 
        if(post.user.toString() !== req.user){
            return res.status(404).json({success: false, error: "Access Denied!"});
        }

        post = await postSchema.findByIdAndUpdate(req.params.id, {$set: newPost}, {new: true});
        return res.status(201).json({success: true, post});
        
    } catch (error) {
        return res.status(404).json({success: false, error: error.message})
    }

});

// Delete tweet
router.delete('/delete/:id', authentication, async(req, res)=>{
    try {
        
        let post = await postSchema.findById(req.params.id);
        if(!post){
            return res.status(404).json({success: false, error: "Post Not found"});
        }

        if(post.user.toString() !== req.user){
            return res.status(404).json({success: false, error: "Access denied!"});
        }

        post = await postSchema.findByIdAndDelete(req.params.id);
        return res.status(200).json({sucess: true, post});
    } catch (error) {
        return res.status(404).json({success: false, error: error.message})
        
    }
})

module.exports = router;