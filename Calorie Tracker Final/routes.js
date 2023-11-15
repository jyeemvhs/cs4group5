let path = require("path");
let express = require("express");
let router = express.Router();
let fetch = require("node-fetch");


let foodList = [];
let foodListIndex = 0;

let foodList2 = [];

let total = [];
let totalIndex = 0;
//PARAMETERS WE PASS WHEN WE DO AN API CALL

let params = {
  api_key:'G5URR8VauFywFkn8SauA8YMn7zRGG1EfZSSinmK5',
  query : 'apple',
  dataType: ["Survey (FNDDS)"],
  pagesize: 5,
}

let api_url2 = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(params.api_key)}`;


router.get("/",function(req,res) {
  	var thePath = path.resolve(__dirname,"public/views/index.html");
	   res.sendFile(thePath);	
});
router.get("/total",function(req,response) {
  response.sendFile(__dirname + "/public/views/total.html");
});
router.get("/about",function(req,response) {
  response.sendFile(__dirname + "/public/views/about.html");
});
router.get("/foodsearch",function(req,res) {
  console.log("GET REQUEST")

  params.query = req.query.foodName;

  fetch(api_url2, {
  method: "POST",
  body: JSON.stringify({
    "query" : params.query,
    dataType: 
    ["Survey (FNDDS)",
    "Foundation",
    "SR LEGACY",
    "Branded"
    ],
    pagesize : 5,
    sortOrder: "asc"
  }),
  headers: {
    "Content-type": "application/json",

  }
})
  .then((response) => response.json())
  .then((json) => {
    

    if(json.totalHits<1){
      res.json(null);
    }
    else{
    res.json({name : json})
    }
    
  })
  
});


router.post("/addfoodlist",function(req,res) {
console.log("ADDED POST FOOD LIST")
if(foodListIndex == req.body.options)
  foodListIndex = 0;
var temp = {foodName : req.body.foodName,calories: req.body.calories, fats: req.body.fats,carbs:req.body.carbs,proteins:req.body.proteins,sugars:req.body.sugars};
foodList[foodListIndex] = temp;
console.log(foodList[foodListIndex])
console.log(foodListIndex)
foodListIndex++;
res.json(foodList[foodListIndex-1]);

});

router.delete("/deletefoodlist",function(req,res) {
console.log("DELETE FOOD LIST")

const newtotal = total.splice(req.params.index, 1);

totalIndex--;

console.log(total);
res.json(null);


});

router.put("/getfoodlist",function(req,res) {
console.log(req.body.index);
console.log("CHANGE ITEM FROM FOOD LIST")

foodList2 = [];
foodList2[req.body.index] = foodList[req.body.index];
console.log(foodList2[req.body.index])

foodList2[req.body.index].calories *= req.body.multiplier;
foodList2[req.body.index].fats *= req.body.multiplier;
foodList2[req.body.index].carbs *= req.body.multiplier;
foodList2[req.body.index].proteins *= req.body.multiplier;
foodList2[req.body.index].sugars *= req.body.multiplier;

console.log(foodList2[req.body.index]);


total[totalIndex] = foodList2[req.body.index]; //keeps updating even after totalIndex is changed?

totalIndex++;
res.json(foodList[req.body.index]);
});

router.post("/addfood",function(req,res) {
console.log("ADDED POST")
var temp = {foodName : req.body.foodName,calories: req.body.calories, fats: req.body.fats,carbs:req.body.carbs,proteins:req.body.proteins,sugars:req.body.sugars};
total[totalIndex] = temp;
totalIndex++;
res.json(total[totalIndex]);


});
router.get("/checktotal",function(req,res) {
console.log("CHECK GET");
if(total[0]==null){
  res.json(null);
}
else{
    res.json({total:total,index:totalIndex});


}


});


 
module.exports = router;
