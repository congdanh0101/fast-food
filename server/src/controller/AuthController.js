class AuthController{
    hello(req,res){
        return res.send(`hello everybody`)
    }
}

module.exports = new AuthController()