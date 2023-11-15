let chosenOption = 0;


function clicked()
{
    var query = $("#search").val();
$("#search").val("");
$.ajax({
url: "/foodsearch",
type: "GET",
data: {foodName:query},
success: add
});


}
function askServings(number)
{
	chosenOption = number;
	console.log(chosenOption);
	$(".serving").empty();
	$(".serving").text("How many servings of option " + (number+1) +  "? (Serving size = 100g)")
	$(".serving").append('<input id="servings" type="number" value="1" >');
	
}
function updateTotal(multiplier)
{
	var servingAmount = Number($("#servings").val());
	console.log(servingAmount);
	$(".serving").empty();

	if(servingAmount > 0){
	$.ajax({
	url: "/getfoodlist",
	type: "PUT",
	data: {index:chosenOption, multiplier:multiplier},
	success: alertClient
	

});
}
	else {
		alert("Servings must be greater than 0");
	}

}
function alertClient(data){
	
	if(data == null){
		alert("Food already in list, not added")
	}
	else{
		alert("Food added to list")
		console.log(data);
	}
}
function addTotal(){
	console.log("THIS WORKS FOOD ADDED")
}
function add(data){
if(!data){
    alert("Please Enter a Valid Food or Drink");
}

$(".serving").empty();
$("#food").empty();

var calories = 0;
var fats = 0;
var carbs = 0;
var proteins = 0;
var sugars = 0;


for(var j = 0;j<10;j++){
	var nutrients = data.name.foods[j].foodNutrients

		for(var i = 0;i<nutrients.length;i++){
			if (nutrients[i].nutrientId == 1008){
				calories = nutrients[i].value;
			}
			else if (nutrients[i].nutrientId == 1004){
				fats = nutrients[i].value;
			}
			else if (nutrients[i].nutrientId == 1005){
				carbs = nutrients[i].value;
			}
			else if (nutrients[i].nutrientId == 1003){
				proteins = nutrients[i].value;
			}
			else if (nutrients[i].nutrientId == 2000){
				sugars = nutrients[i].value;
			}

		}
		$("#food").append('<li>' + data.name.foods[j].description + " : Calories - " + calories +
    " kcal, Total Fats - " + fats + " g, Carbs - " + carbs + " g, Proteins - " + proteins +
    " g , Sugars - " + sugars + " g"  +"   " +  "<button class = 'button' onclick='askServings("+ j +")' type='button' >Choose option "+ (j+1) +"</button>" +'</li>');


		$.ajax({
            url: "/addfoodlist",
            type: "POST",
            data: {foodName:data.name.foods[j].description, calories:calories, fats:fats, carbs:carbs, proteins:proteins, sugars:sugars, options:10},  
            dataType: "json"
          });
		document.getElementById("spinner").style.display="none";
	
		//let str = "<button class = 'button' onclick='askServings("+ j +")' type='button' >Choose option "+ (j+1) +"</button>";
		//$("#food").append(str);
	}


}
$(document).ready(function(){        

	$("#search").keydown( function( event ) {
        if ( event.which === 13 ) {
	  document.getElementById("spinner").style.display="block"
          clicked();
          event.preventDefault();
          return false;
        }
    });
    
    $(".serving").keydown( function( event ) {
        if ( event.which === 13 ) {
          //alert("serving button + enter")
          console.log($("#servings").val());
          updateTotal($("#servings").val())
          $("#food").empty();
          event.preventDefault();
          return false;
        }
      }); 
  });