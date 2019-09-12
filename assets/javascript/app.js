  var firebaseConfig = {
		apiKey: "AIzaSyBVGrcxHrcmaI1pm2-0bAFHwH4xETsbfI4",
		authDomain: "train-schedule-1d6ca.firebaseapp.com",
		databaseURL: "https://train-schedule-1d6ca.firebaseio.com",
		projectId: "train-schedule-1d6ca",
		storageBucket: "",
		messagingSenderId: "769607346079",
		appId: "1:769607346079:web:48e546e0cb986cc4483faa"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

function presentTimeHeader() {
    var time = moment().format("HH:mm:ss");
    $("#presentTime").text(time);
    setTimeout(presentTimeHeader, 1000);
}

database.ref().on("child_added", function(snapshot) {

    console.log(snapshot.val());

    newTrainName = snapshot.val().trainName;
    newDestination = snapshot.val().destination;
    newFrequency = snapshot.val().frequency;
    newFirstTrainTime = snapshot.val().firstTrainTime;

    var newFirstTrainTimeConverted = moment(newFirstTrainTime, "hh:mm")
    console.log(newFirstTrainTimeConverted);

    var currentTime = moment().format("HH:mm:ss");
    console.log("current time: " + currentTime);

    var timeDifference = moment().diff(moment(newFirstTrainTimeConverted), "minutes");
    // console.log("difference between times: " + timeDifference);

    var timeSinceLastDeparture = timeDifference % newFrequency;
    console.log("minutes since last departure: " + timeSinceLastDeparture);

    var minutesAway = newFrequency - timeSinceLastDeparture
    console.log("minutes until next departure: " + minutesAway);

    var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm")

    var trainRow =
        $("<tr><td>" + newTrainName + "</td>" +
            "<td>" + newDestination + "</td>" +
            "<td>" + newFrequency + "</td>" +
            "<td>" + nextArrival + "</td>" +
            "<td>" + minutesAway + "</td></tr>");

    $("#trainScheduleTable").append(trainRow);

});

// // Submit Button
$("#submit").on("click", function(event) {


    event.preventDefault();

    // Input values
    var trainNameInput = $("#trainName").val().trim();
    var destinationInput = $("#destination").val().trim();
    var frequencyInput = $("#frequency").val().trim();
    var firstTrainTimeInput = $("#firstTrainTime").val().trim();

    console.log(trainNameInput);
    console.log(destinationInput);
    console.log(frequencyInput);
    console.log(firstTrainTimeInput);

    database.ref().push({
        trainName: trainNameInput,
        destination: destinationInput,
        frequency: frequencyInput,
        firstTrainTime: firstTrainTimeInput,
    });

});

presentTimeHeader();