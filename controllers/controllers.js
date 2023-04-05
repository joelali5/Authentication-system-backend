const {fetchUsers} = require('./../models/models');


exports.getUsers = (req, res) => {
    fetchUsers().then(users => {
        res.status(200).send({users});
    });
};