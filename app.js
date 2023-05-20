import { completeDate } from "./today.js"
import dotenv from "dotenv"
import lodash from "lodash"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express from "express";
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
dotenv.config();
mongoose.connect(process.env.uri);

const ItemSchema = mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", ItemSchema);

const ListSchema = mongoose.Schema({
    name: String,
    items: [ItemSchema]
})
const List = mongoose.model("List", ListSchema);


app.get("/", (req, res) => {
    Item.find({}).then(function (data) {
        res.render("index", {
          HEADER: completeDate(),
          itemArray: data,
        });
    })  
});

app.get("/:customListName", (req, res) => {
    const customListName = lodash.capitalize(req.params.customListName);
    List.findOne({ name: customListName }).then(function (item) {
        if (item) {
            res.render("index", { itemArray: item.items, HEADER: item.name });
        }
        else {
            const newListItem = List({ name: customListName, items: [] });
            newListItem.save();
            res.redirect("/" + customListName);
        }
    })

})

app.post("/delete", (req, res) => {
    const item = req.body.checkbox;
    const lName = req.body.listname;
    if (lName == completeDate()) {
        Item.deleteOne({ _id: item }).then(function (data) {
            res.redirect("/");
        });
    }
    else {
        List.findOneAndUpdate({ name: lName }, {$pull: {items:{_id:item}}}).then(function (data) { 
            res.redirect("/" + lName);
        })
    }
});

app.post("/", (req, res) => {
    const item = req.body.item;
    const lName = req.body.list;
    const itemObj = new Item({ name: item });
    if (lName == completeDate()) {
        itemObj.save().then(function (data) {
          res.redirect("/");
        });
    }
    else {
        List.findOne({ name: lName }).then((data) => {
            data.items.push(itemObj);
            data.save();
            res.redirect("/" + lName);
        })
    }
    
});

app.listen(3000);
