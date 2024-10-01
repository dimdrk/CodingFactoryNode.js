const User = require('../models/user.model');

exports.findAll = async(req, res) => {

    console.log("Find all users products.");

    try {
        const result = await User.find({}, {username:1, products:1, _id:0});
        res.json({ status: true, data: result });
    } catch(err) {
        res.json({ status: false, data: err });
    }
}