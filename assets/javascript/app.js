var config = {
	apiKey: "AIzaSyDts6Yhgaby6XqloH96wqm_8RZfcFP_Kv4",
	authDomain: "hifi-51014.firebaseapp.com",
	databaseURL: "https://hifi-51014.firebaseio.com",
	projectId: "hifi-51014",
	storageBucket: "hifi-51014.appspot.com",
	messagingSenderId: "199206818561",
	appId: "1:199206818561:web:6fade7bcdfb0c7f5bd4100"
  };
  
  firebase.initializeApp(config);
  var database = firebase.database();
  var tableBody = $("tbody");
  
  var submit = $("#submit");
  
  submit.on("click", function(e) {
	e.preventDefault();
	var name = $("#name").val();
	var destination = $("#destination").val();
	var first = $("#first").val();
	var frequency = $("#frequency").val();
  
	database.ref().push({
	  name: name,
	  destination: destination,
	  first: first,
	  frequency: frequency
	});
  });
  
  database.ref().on("child_added", function(snap) {
	var firstTrainTime = moment(first, "hh:mm");
	var timeDifference = moment().diff(moment(firstTrainTime), "minutes");
	var timeSinceLastDeparture = timeDifference % frequency;
	var minutesAway = frequency - timeSinceLastDeparture;
	var nextArrival = moment()
	  .add(minutesAway, "minutes")
	  .format("HH:mm");
  
	var data = snap.val();
	name = data.name;
	destination = data.destination;
	first = data.first;
	frequency = data.frequency;
	var id = snap.key;
	var results =
	  "<tr data-id='" +
	  id +
	  "'><td>" +
	  name +
	  "</td><td>" +
	  destination +
	  "</td><td>" +
	  first +
	  "</td><td>" +
	  frequency +
	  "</td><td>" +
	  nextArrival +
	  "</td><td>" +
	  parseInt(minutesAway) +
	  "</td><td><button class='btn btn-danger' id='delete'>Delete</button></td></tr>";
	tableBody.prepend(results);
	$("#delete").on("click", function(e) {
	  e.preventDefault();
	  var td = $(this).parent();
	  var tr = td.parent();
	  var id = tr.attr("data-id");
	  database.ref(id).remove();
	  tr.remove();
	});
	clearValues();
  });
  
  function clearValues() {
	$("#name").val("");
	$("#destination").val("");
	$("#first").val("");
	$("#frequency").val("");
  }