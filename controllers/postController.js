var postDB = require('../models/post');
var likeDB = require('../models/like');
var commentDB = require('../models/comment');
var moment = require('moment')
var userDB = require('../models/user')

exports.create = async(req, res) => {
    var currentUser = req.currentUser;
    var query = req.body;
    userDB.getFromId(currentUser._id, (err, user) => {
        if (err)
            return res.status(500).send({ status: 500, message: err.message })
        if (!user)
            return res.status(404).send({ status: 404, message: "Không tìm thấy user" })

        var data = {
            content: query.content,
            createdTime: moment().format(),
            tags: query.tags || [],
            hashTags: query.hashTags || [],
            type: query.type || "PUBLIC",
            img: query.img || [],
            creator: user,
            isLiked: false,
            comments: [],
            likesTotal: 0,
            commentsTotal: 0
        }

        postDB.create(data, (err, post) => {
            if (err)
                return res.status(500).send({ status: 500, message: err })
            return res.status(200).send({ status: 200, message: "Created successfully", data: post })
        })
    })
}

exports.getPosts = async(req, res) => {
    var currentUser = req.currentUser;
    var limit = parseInt(req.query.limit) || 0;
    var offset = parseInt(req.query.offset) || 0;

    var query = {
        $or: [
            { type: "PUBLIC" },
            { type: "PRIVATE", "creator._id": currentUser._id },
        ]
    }
    postDB.getPosts(query, limit, offset, async(err, posts) => {
        if (err)
            return res.status(500).send({ status: 500, message: err })
        if (posts.length > 0) {
            var arrayPosts = []
            for (const post of posts) {
                await likeDB.isLiked({ postID: post._id, userID: currentUser._id }).then(like => {
                    like ? post.isLiked = true : post.isLiked = false
                }).catch(err => console.log(err))

                await likeDB.total({ postID: post._id }, (err, total) => {
                    total ? post.likesTotal = total : post.likesTotal = 0
                })

                await commentDB.total({ postID: post._id }, (err, total) => {
                    total ? post.commentsTotal = total : post.commentsTotal = 0
                })
            }
            return res.status(200).send({ status: 200, message: "Query successfully", data: posts })
        } else {
            return res.status(404).send({ status: 404, message: "Không tìm thây", data: [] })
        }
    })
}