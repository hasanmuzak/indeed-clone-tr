module.exports = {
    isUserAuthenticated : function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/user/login');
    },

    dontAllowIfAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            res.redirect('/');
        }
        else{
            return next();
        }
    },

    onlyEmployerAllowed : function(req,res,next) {
        if(req.isAuthenticated() && req.user.is_employer == true){
            return next();
        }
        res.redirect('/');
    }
} 