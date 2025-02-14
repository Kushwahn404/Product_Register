var express = require('express');
var fs=require('fs')
var router = express.Router();
var pool = require("./pool")
var upload=require("./multer"); 
const { error } = require('console');
var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');

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
router.get('/productinterface', function(req, res, next) {
  if(checkAdminsession())
  res.render('productinterface',{status:0});
else
res.redirect('/admin/adminlogin')
});
router.get("/fetch_all_category",function(req,res){
 pool.query("select * from category",function(error,result){
    if(error)
    {console.log("deepak error=",error)
      res.status(500).json({message:'Database error',status:false,data:[] })
    }
    else
    {
      res.status(200).json({message:'Success',status:true,data:result})
    }
  })
})
/*PRODUCT TYPE FILL DROPDOWN*/

router.get("/fetch_all_type",function(req,res){
  pool.query("select * from producttype where categoryid=?",[req.query.categoryid],function(error,result){
     if(error)
     {
       res.status(500).json({message:'Database error',status:false,data:[] })
     }
     else
     {
       res.status(200).json({message:'Success',status:true,data:result})
     }
   })
 })

             /* RECORD SUBMIT FROM PRODUCT INTERFACE */

    router.post('/product_submit',upload.single("productpicture"),function(req,res){
      pool.query("insert into products(productname, categoryid, producttypeid, packaging, quantity, weight, weighttype, price, offerprice, productpicture) values(?,?,?,?,?,?,?,?,?,?)",[req.body.productname, req.body.categoryid, req.body.producttypeid, req.body.packaging, req.body.quantity, req.body.weight, req.body.weighttype, req.body.price, req.body.offerprice, req.file.filename],function(error,result){
       
        if(error) 
        {
          res.render('productinterface',{status:1})
        }
        else
        {
           res.render('productinterface',{status:2})
        }


      })
    })
    /*DISPLAY ALL PRODUCT*/
    router.get('/displayallproducts',function(req,res,next){
      if(checkAdminsession())
      {
      pool.query("select P.*,(select C.categoryname from category C where C.categoryid=P.categoryid) as categoryname, (select PT.producttype from producttype PT where PT.producttypeid=P.producttypeid) as producttype from products P ",function(error,result){
        if(error)
        {
          res.render('displayallproducts',{data:[]})
        }
        else
        {
          res.render('displayallproducts',{data:result})
        }
      })
    }
    else
    {
      res.redirect('/admin/adminlogin')
    }
    })
  
                /* Show product to edit */

        router.get('/showproducttoedit',function(req,res,next){

          pool.query("select P.*,(select C.categoryname from category C where C.categoryid=P.categoryid) as categoryname, (select PT.producttype from producttype PT where PT.producttypeid=P.producttypeid) as producttype from products P where P.productid=?,"[req.query.pid],function(error,result){
            if(error)
            {
              res.render('showproducttoedit',{data:[]})
            }
            else
            {
              res.render('showproducttoedit',{data:result[0]})
            }
          })

        })

        router.post('/product_edit_data',function(req,res){
          if(req.body.btn=="Edit")
          {

            pool.query("update products set productname=?, categoryid=?, producttypeid=?, packaging=?, quantity=?, weight=?, weighttype=?, price=?, offerprice=?, where productid=?",[req.body.productname, req.body.categoryid, req.body.producttypeid, req.body.packaging, req.body.quantity, req.body.weight, req.body.weighttype, req.body.price,req.body.offerprice,req.body.productid],function(error,result){

              if(error)
             {
              res.redirect('displayallproducts')
             }
               else
             {
              res.redirect('displayallproducts')
              }
            })
          }
              
         else
         {
          pool.query("delete from products where productid=?",[req.body.productid],function(error,result){

            if(error)
           {
            res.redirect('displayallproducts')
           }
             else
           {
            res.redirect('displayallproducts')
            }
          })

         }
        })

    router.get('/showproductpicturetoedit',function(req,res,next){
      res.render('showproductpicturetoedit',{data:req.query})
    })

    /*Edit Picture*/

    router.post('/editproductpicture',upload.single('productpicture'),function(req,res,next){
      pool.query("update products set productpicture=? where productid=?",[req.file.filename,req.body.pid],function(error,result){
        if(error)
        {
          res.redirect('displayallproducts')
        }
        else
        {
          fs.unlinkSync(`public/images/${req.body.oldpicture}`)
          console.log('nitin',error)
          res.redirect('displayallproducts')
        }
      })
    })



module.exports = router;
