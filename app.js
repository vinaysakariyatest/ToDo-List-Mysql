var express= require('express');
var bodyparser = require('body-parser');

var mysql= require('mysql');

var app= express();

var con = mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"",
    database:"todo_db"
})

con.connect();

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:false}));

 
var user_name=""


app.get('/dashboard',function(req,res){
    res.render('dashboard',{user_name})
})

// Admin Login
app.get('/',function(req,res){
    res.render('login');
})


app.post('/',function(req,res){
    var email = req.body.email;
    var pass = req.body.password;

    if(email && pass){

        var select = "select * from admin where email='"+email+"' and password='"+pass+"'";
            
        con.query(select,function(error,result,index){
            if(error) throw error;

            if(result.length>0){
                user_name=result[0].name;
                res.redirect('/dashboard')
            }else{
                res.send("Invalid username or Password")
            }
            res.end();
        }) 
    }else{
        res.send("Please enter Username or Password")
        res.end();
    }
})

// Add User
app.get('/addstaff', function(req, res){
    res.render('add_user')
})

app.post('/addstaff', function(req, res){
    var id=req.params.id;
    var uname=req.body.uname;
    var uemail=req.body.uemail;
    var upass=req.body.upass;

    var qr="insert into staff(name,email,password) values('"+uname+"','"+uemail+"','"+upass+"')";
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/addstaff')
    })
})

// View Staff
app.get('/viewstaff',function(req,res){
    var select = "select * from staff"
    con.query(select,function(error,result,index){
        if(error) throw error
        res.render('view_staff',{result})
    })
})

// Mange Staff
app.get('/managestaff',function(req,res){
    var select = "select * from staff"
    con.query(select,function(error,result,index){
        if(error) throw error
        res.render('manage_staff',{result})
    })
})

// Update staff
app.get('/update/:id',function(req,res){
    var id=req.params.id;
    
    var update="select * from staff where id="+id

    con.query(update,function(error,result,index){
        if(error) throw error
        res.render('update_staff',{result})
    })
})

app.post('/update/:id',function(req,res){
    var id=req.params.id;
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    var qr="update staff set name='"+name+"',email='"+email+"',password='"+password+"' where id="+id;
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/managestaff')
    })
})

// Delete Staff
app.get('/delete/:id',function(req,res){
    var id=req.params.id

    var qr="delete from staff where id="+id

    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect("/managestaff")
    })
})

// Add task
app.get('/addtask',function(req,res){
    var qr="select * from staff";

    con.query(qr,function(error,result,index){
        if(error) throw error
        res.render("add_task",{result})
    })
})

app.post('/addtask',function(req,res){
    
    var task_name =req.body.task_name;
    var user_id=req.body.user_id;

    var insert="insert into task (task_name,task_user,status) values ('"+task_name+"','"+user_id+"','0')";

    con.query(insert,function(error,result,field){
        if(error) throw error;
        res.redirect('/addtask');
    })
})

// View Task
app.get('/viewtask',function(req,res){
    
    var insert="select * from task";

    con.query(insert,function(error,result,index){
        if(error) throw error;
        res.render('view_task',{result});
    })
})

/*==============================================
                User
==============================================*/
app.get('/user_dashboard',function(req,res){

    // var qr="select * from task"
    var qr="select task.* , staff.* from task join staff on task.task_user=staff.id WHERE task.status NOT IN(2,4)"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.render('user_dashboard',{result,user_name})
    })
})
app.get('/userlogin',function(req,res){
    res.render('user_login')
})

app.post('/userlogin',function(req,res){
    var email = req.body.uemail;
    var pass = req.body.upass;

    if(email && pass){

        var select = "select * from staff where email='"+email+"' and password='"+pass+"'";
            
        con.query(select,function(error,result,index){
            if(error) throw error;

            if(result.length>0){
                user_name=result[0].name;
                res.redirect('/user_dashboard')
            }else{
                res.send("Invalid username or Password")
            }
            res.end();
        }) 
    }else{
        res.send("Please enter Username or Password")
        res.end();
    }
})

// Update Status
app.get('/updatestatus/:role/:id',function(req,res){
    var status = req.params.role;
    var id = req.params.id;
    var query = "update task set status='"+status+"' where task_id="+id;

    con.query(query,function(error,result,field){
        if(error) throw error;
        res.redirect('/user_dashboard');
    })
})

app.listen(4500)