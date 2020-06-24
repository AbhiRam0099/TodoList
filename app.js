//jshint esversion:6

const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const app=express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-name:password@cluster0-pnoeg.gcp.mongodb.net/todolistDB?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology: true});
const itemsSchema={
  name:String
};

const Item  =mongoose.model("Item" ,itemsSchema);

const item1=new Item({
  name:"welcome to todolist"
});
//document
const item2=new Item({
  name:"Hit the + button to add a new item"
});

const item3=new Item({
  name:"Hit this to delete item "
});

const defaultItems=[item1, item2, item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);

var today=new Date();
var options={
  weekday:"long",
  day:"numeric",
  month:"long",
};

 var day=today.toLocaleDateString("en-US", options);

app.get("/",function(req,res){

//find method using model for showing in frontend
   Item.find({},function(err,foundItems){
     if(foundItems.length === 0){
       Item.insertMany(defaultItems,function(err){
       if(err){
         console.log(err);
       }  else {
         console.log("successfully inserted");
       }
       });
       res.redirect("/");
     }else {
       res.render("list",{listTitle: day,newListItems:foundItems});
     }
   });
});

app.post("/",function(req,res){
const itemName=req.body.newitem;
const listName=req.body.list;

const item=new Item({
  name:itemName
});
if(listName === day ){
  item.save();
  res.redirect("/");
}else {
  List.findOne({name:listName},function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName);
  });
}

});

app.post("/delete",function(req,res){

const checkedItem=req.body.checkbox;
const listName=req.body.listName;
if(listName === day){
  Item.findByIdAndRemove(checkedItem,function(err){
    if(!err){
      console.log("successfully removed item");
      res.redirect("/");
    };
  });
}else {
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}},function(err,foundList){
    if(!err){
      res.redirect("/"+listName);
    }
  })
}

});

app.get("/:customListName",function(req,res){
const customListName=_.capitalize(req.params.customListName);
List.findOne({name:customListName},function(err,foundList){
  if(!err){
    if(!foundList){
      //create a new list
      const list=new List({
        name:customListName,
        items:defaultItems
      });
      list.save();

  }else {
    //show an existing list
   res.render("list",{listTitle: foundList.name,newListItems:foundList.items});
  }
}
});
});
app.post("/",function(req,res){
  let item=req.body.newitem;
  workitems.push(item);
  res.redirect("/work");
});
app.get("/about",function(req,res){
res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.listen(port,function(){
  console.log("this app is running on port 3000");
});
