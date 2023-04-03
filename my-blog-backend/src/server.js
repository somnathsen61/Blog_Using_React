import express from "express";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/react-blog-db");

const articleSchema= new mongoose.Schema({
    name: String,
    upvotes: Number,
    comments: [{postedBy:String, text: String}]
});

const Article= mongoose.model("Article", articleSchema);

const app= express();
app.use(express.json());


const arr= [{
    name: "learn-react",
    upvotes:0, 
    comments:[],
},{
    name: "learn-node",
    upvotes:0,
    comments:[],
},{
    name: "modgodb",
    upvotes:0,
    comments:[],
}
]

// Article.insertMany(arr,function(err){
//    if(err)  
//      console.log(err);
// });

app.get("/api/articles/:name", (req,res)=>{
    const {name}= req.params;
    Article.findOne({name: name}, function(err,data){
        if(data)
            // console.log(data);
            res.json(data);
        else
            res.send("This article does not exist");
    })
})


app.put("/api/articles/:name/upvotes", (req,res)=>{
    const {name}= req.params;
    Article.findOneAndUpdate({name: name},{$inc : {upvotes : 1}}, function(err,response){
        if(err)
            res.sendStatus(404);
        else
            res.send(response);  
    })
})

app.post("/api/articles/:name/comments", (req,res)=>{
    const {name}= req.params;
    const {postedBy, text}= req.body;
    const newComment= {postedBy: postedBy, text: text};
    Article.findOneAndUpdate({name: name}, {$push: {comments: newComment}}, function(err,success){
        if(err)
            res.sendStatus(404);
        else
            res.send(success.comments);
    })
    // const article= articlesInfo.find((a)=> a.name=== name)
    // if(article){
    //     article.upvotes +=1;
    //     res.send(`the upvotes of ${article.name} is ${article.upvotes}`)
    // }
    // else{
    //     res.send("No such article found");
    // }
})

app.listen(5000, ()=>{
    console.log("server is running on port: 5000");
})