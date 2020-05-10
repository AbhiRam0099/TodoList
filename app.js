//jshint esversion:6

const express=require("express");
const bodyparser=require("body-parser");
let items=["eat","sleep","code"];
let workitems=[];
const app=express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
  var today=new Date();
  var options={
    weekday:"long",
    day:"numeric",
    month:"long",
  };

   let day=today.toLocaleDateString("en-US", options);

    res.render("list",{listTitle: day,newListItems:items});

});
app.post("/",function(req,res){
let item=req.body.newitem;
if(req.body.list === "work"){
  workitems.push(item);
  res.redirect("/work");
}
  else {
  items.push(item);
    res.redirect("/");
}
console.log(res.body);
});

app.get("/work",function(req,res){
res.render("list",{listTitle: "work Items",newListItems:workitems});
});
app.post("/",function(req,res){
  let item=req.body.newitem;
  workitems.push(item);
  res.redirect("/work");
});
app.get("/about",function(req,res){
res.render("about");
});

app.listen(3000,function(){
  console.log("this app is running on port 3000");
});
