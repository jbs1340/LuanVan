var tanKinhDB = require('../models/tankinh')
var userDB = require('../models/user')
var moment = require('moment')

exports.create = (req, res) => {
    var currentUser = req.currentUser
    var query = req.body
    var name = query.name || ""
    var skill = query.skill || ""
    var books = query.books || []
    if (books.length == undefined) {
        return res.status(500).send({ status: 500, message: "Books must be array" })
    }
    if (skill == "" || name == "") {
        return res.status(500).send({ status: 500, message: "Input invalid." })
    }
    var ok = true
    tanKinhDB.get({ name: name }, 1, 0, (err, tk) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (tk.length > 0) {
            ok = false
            return res.status(400).send({ status: 400, message: "Tên đã được sử dụng" })
        } else {
            userDB.getFromId(currentUser._id, (err, usr) => {
                if (err)
                    return res.status(400).send({ status: 400, message: err.message })
                if (usr) {
                    var data = {
                        name: name,
                        code: moment().unix(),
                        books: books,
                        questions: [],
                        skill: skill,
                        creator: usr
                    }
                    tanKinhDB.create(data, (err, tk) => {
                        if (err)
                            return res.status(400).send({ status: 400, message: err.message })
                        if (tk) {
                            return res.status(200).send({ status: 200, message: "Created successfully", data: tk })
                        } else {
                            return res.status(400).send({ status: 400, message: "Cannot create" })
                        }
                    })
                } else {
                    return res.status(400).send({ status: 400, message: "Không tìm thấy user" })
                }
            })
        }
    })
}

exports.get = (req, res) => {
    var q = JSON.parse(req.query.q)
    var limit = parseInt(req.query.limit) || 1;
    var offset = parseInt(req.query.offset) || 0;
    tanKinhDB.get(q, limit, offset, (err, tk) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (tk.length > 0) {
            return res.status(200).send({ status: 200, message: "Query successfully", data: tk })
        } else {
            return res.status(404).send({ status: 404, message: "NOT FOUND", data: [] })
        }
    })
}

exports.add_books = (req, res) => {
    var query = req.body
    var id = req.query._id
    var code = req.query.code
    if (id == undefined && code == undefined) {
        return res.status(500).send({ status: 500, message: "Query is invalid" })
    }
    var querySearch = {}
    if (code != undefined) {
        querySearch.code = code
    } else if (id != undefined) {
        querySearch._id = id
    }

    var books = query.books || []
    if (books.length == undefined) {
        return res.status(500).send({ status: 500, message: "Books must be array" })
    } else if (books.length == 0) {
        return res.status(500).send({ status: 500, message: "Books is empty" })
    }
    tanKinhDB.get(querySearch, 1, 0, (err, currentTK) => {
        if (err)
            return res.status(400).send({ status: 400, message: err.message })
        if (currentTK.length > 0) {
            var currentBooks = currentTK[0].books
            books.forEach(book => {
                currentBooks.push(book)
            })
            tanKinhDB.update(querySearch, { books: currentBooks }, (err, newTK) => {
                if (err)
                    return res.status(400).send({ status: 400, message: err.message })
                if (newTK) {
                    newTK.books = currentBooks
                    return res.status(200).send({ status: 200, message: "Update successfully", data: newTK })
                } else {
                    return res.status(404).send({ status: 404, message: "NOT FOUND" })
                }

            })
        } else {
            return res.status(404).send({ status: 404, message: "NOT FOUND" })
        }
    })
}