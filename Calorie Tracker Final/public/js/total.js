$(document).ready(function(){        
	console.log("HERE")
	$.ajax({
	url: "/checktotal",
	type: "GET",
	data: null,
	success: add
	});
    


 }); 
function add(data){
let totalCal = 0;
let totalProtein =0;
let totalCarb = 0;
let totalFat = 0; 
let totalSugar = 0;

	if(data){
		console.log(data);
		for(var i=0; i<data.index; i++){
		totalCal= totalCal + Number(data.total[i].calories);
		totalProtein= totalProtein + Number(data.total[i].proteins);
		totalCarb= totalCarb + Number(data.total[i].carbs);
		totalFat= totalFat + Number(data.total[i].fats);
		totalSugar= totalSugar + Number(data.total[i].sugars);

		

		
		console.log("HERE FROM FOR LOOP")
		let str = "<tr id='row"+ (i+1) +"' > <th>" + data.total[i].foodName +  "</th> <th>" + round(data.total[i].calories,2) + "</th> <th>" +round(data.total[i].proteins,2) + "</th> <th>" + round(data.total[i].carbs,2) +
		 "</th> <th>" +round(data.total[i].fats,2)+ "</th> <th>" + round(data.total[i].sugars,2) + "</th> + <th>" + "<button onclick='remove("+ (i+1) +")' class = 'button' type='button' >Remove item "+ (i+1) +"</button>" + "</th> </tr>";
		$("#total").append(str);
		totalCal= round(totalCal,2);
		totalProtein= round(totalProtein,2);
		totalCarb= round(totalCarb,2);
		totalFat= round(totalFat,2);
		totalSugar=round(totalSugar,2);
		
		}
		let str = "<tr> <th>" + "TOTAL" +  "</th> <th>" + totalCal + "</th> <th>" +totalProtein + "</th> <th>" + totalCarb+ "</th> <th>" +totalFat+ "</th> <th>" + totalSugar + "</th> </tr>";
		$("#total").append(str);
		console.log(totalCal,totalProtein,totalCarb,totalFat,totalSugar);

	}
	else{
		console.log("EMPTY")
	}
}
function remove(index){
	
	
	$('#row' + (index)).remove();
	$.ajax({
      url: "/deletefoodlist",
      type: "DELETE",
      data: {index:index},
      success: function(data){
		alert("Item deleted");
      },
      dataType: "json"
    }); 


    $("#total").empty();
    let str = "<tr> <th>" + "Food Name" +  "</th> <th>" + "Calories" + "</th> <th>" + "Protein" + "</th> <th>" + "Carbohydrates" + "</th> <th>" + "Fats" + "</th> <th>" + "Sugars" + "</th> <th>" + "Remove Option?" + "</th> </tr>";
	$("#total").append(str);
    
    $.ajax({
	url: "/checktotal",
	type: "GET",
	data: null,
	success: add  
	});
}
function round(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}
