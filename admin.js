var express = require('express');
var router = express.Router();
var pool=require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');

/* GET home page. */

function checkAdminsession()
{
  try{
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    if(admin==null)
    {return false}
    else
    {return admin}
  }
  catch(e)
  {
return false
  }
}

router.get('/adminlogin', function(req, res, next) {
  var data=checkAdminsession()
  if(data)
  {
    res.render('dashboard',{userdata:data});
  }
  else
  {
     res.render('adminlogin')
  }

});
router.get('/logout', function(req, res, next) {
  localStorage.clear()
  res.redirect('/admin/adminlogin');
});


router.post('/chklogin', function(req, res, next) {
  pool.query('select * from admins where (emailid=? or mobileno=?) and password=?',[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
    console.log("Error",error)
    if(error)
    {
      res.render('adminlogin',{msg:'Server Error'})
    }
    else
    {
      if(result.length==1)
      {
        res.render('dashboard',{userdata:result[0]});
        localStorage.setItem('ADMIN',JSON.stringify(result[0]))
      }
      else
      {
        res.render('adminlogin',{msg:'Invalid Emailid/Password'});
      }
    }
  })

});
module.exports = router;
