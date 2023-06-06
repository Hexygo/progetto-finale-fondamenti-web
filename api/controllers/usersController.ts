const User=require('../models/User')

module.exports={
    getAllUsers:(req, res)=>{
        User.find({}).exec().then((data)=>{
            res.setHeader("Content-Type", "application/json")
            res.json(data)
        })
        
    },

    getUserByUsername:(req, res)=>{
        User.find({username:req.params.username}).exec().then((data)=>{
            res.setHeader("Content-Type", "application/json")
            res.json(data)
        })
    }
}



