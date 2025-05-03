const user = require("../models/users");
const asyncHandler = require("express-async-handler");

// Display list of all users.

exports.users_list = asyncHandler(async(req, res, next) => {
    res.send("NOT Implemented : Users List");
});

// handle user creation
exports.users_create_get = asyncHandler(async(req, res, next) => {
    res.send("NOT implemented : User Create GET");
});

// handle user deletion
exports.users_delete_get = asyncHandler(async(req, res, next) =>{
    res.send("NOT Implemented: User delete GEt")
});

// Handle user update on POST
exports.users_update_post = asyncHandler(async(req, res, next) =>{
    res.send("NOT implemented; User update  POST");
});

exports.users_wishlist_add = asyncHandler(async(req, res, ))