module.exports = {
        ensureAuthenticated : function(req,res,next){
            if(req.isAuthenticated()){
                return next();
            }
            req.flash('error_msg','Non Autorisé')
            res.redirect('/users/login')
        }
    }