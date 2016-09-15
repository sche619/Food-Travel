//var currentMood: Mood;
/* 1. DOM Object Use */
// Get elements from DOM
var pageheader = $("#page-header")[0]; //note the [0], jQuery returns an object, so to get the html DOM object we need the first item in the object
var pagecontainer = $("#page-container")[0];
// The html DOM object has been casted to a input element (as defined in index.html) as later we want to get specific fields that are only avaliable from an input element object
var imgSelector = $("#my-file-selector")[0];
var refreshbtn = $("#sweetalert")[0]; //You dont have to use [0], however this just means whenever you use the object you need to refer to it with [0].
var age;
var gender;
var recommendation;
// Register button listeners
imgSelector.addEventListener("change", function () {
    pageheader.innerHTML = "Just a sec while we analyse...";
    processImage(function (file) {
        // Get emotions based on image
        sendFaceRequest(file, function (faceAttributes) {
            // Find out most dominant emotion
            age = Math.floor(getAge(faceAttributes));
            gender = getGender(faceAttributes);
            recommendation = findFoodorTravel(age, gender);
            //currentMood = getCurrMood(emotionScores); //this is where we send out scores to find out the predominant emotion
            changeUI(); //time to update the web app, with their emotion!
            //Done!!
        });
    });
});
/*refreshbtn.addEventListener("click", function () {
    // TODO: Load random song based on mood
    alert("You clicked the button");
});*/
/* 2. File Checking */
function processImage(callback) {
    var file = imgSelector.files[0]; //get(0) is required as imgSelector is a jQuery object so to get the DOM object, its the first item in the object. files[0] refers to the location of the photo we just chose.
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); //used to read the contents of the file
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        //After loading the file it checks if extension is jpg or png and if it isnt it lets the user know.
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
            //if file is photo it sends the file reference back up
            callback(file);
        }
    };
}
/* 4. Updating the UI */
function changeUI() {
    //Show detected mood
    pageheader.innerHTML = "You look like " + age + " years old. You feel like: "; //Remember currentMood is a Mood object, which has a name and emoji linked to it. 
    //Show mood emoji
    var img = $("#selected-img")[0]; //getting a predefined area on our webpage to show the emoji
    img.src = recommendation.picture; //link that area to the emoji of our currentMood.
    img.style.display = "block"; //just some formating of the emoji's location
    //Display song refresh button
    refreshbtn.style.display = "inline";
    //Remove offset at the top
    pagecontainer.style.marginTop = "20px";
}
// Refer to http://stackoverflow.com/questions/35565732/implementing-microsofts-project-oxford-emotion-api-and-file-upload
// and code snippet in emotion API documentation
function sendFaceRequest(file, callback) {
    $.ajax({
        //url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
        url: "https://api.projectoxford.ai/face/v1.0/detect?returnFaceAttributes=age,gender",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "46cacea7905b4f8d8da319e2d4223676");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
        if (data.length != 0) {
            // Get the emotion scores
            var faceAttributes = data[0].faceAttributes;
            callback(faceAttributes);
        }
        else {
            pageheader.innerHTML = "Hmm, we can't detect a human face in that photo. Try another?";
        }
    })
        .fail(function (error) {
        pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
        console.log(error.getAllResponseHeaders());
    });
}
// Section of code that handles the mood
function getAge(faceAttributes) {
    return faceAttributes.age;
}
function getGender(faceAttributes) {
    return faceAttributes.gender;
}
function findFoodorTravel(age, gender) {
    var recommendation;
    if (age < 20) {
        recommendation = chocolate;
    }
    else if (age < 30 && gender === "female") {
        recommendation = Paris;
    }
    else if (age < 30 && gender === "male") {
        recommendation = Canada;
    }
    else if (age < 40 && gender === "female") {
        recommendation = salad;
    }
    else if (age < 40 && gender === "male") {
        recommendation = burger;
    }
    else {
        recommendation = Queenstown;
    }
    return recommendation;
}
var FoodorTravel = (function () {
    function FoodorTravel(picName, picUrl) {
        this.picName = picName;
        this.picUrl = picUrl;
        this.name = picName;
        this.picture = picUrl;
    }
    return FoodorTravel;
}());
var chocolate = new FoodorTravel("Chocolate", "http://demandware.edgesuite.net/sits_pod21/dw/image/v2/AAKG_PRD/on/demandware.static/-/Sites-godiva-master-catalog-us/default/dwde2e684e/large/FALL2013/Product/Truffles24_76143_01.jpg?sw=475&sh=475");
var Paris = new FoodorTravel("Paris", "http://www.planetware.com/photos-large/F/france-paris-eiffel-tower.jpg");
var Canada = new FoodorTravel("Canada", "https://www.askideas.com/media/82/Boat-Near-The-Niagara-Falls-In-Canada.jpg");
var salad = new FoodorTravel("salad", "http://www.taste.com.au/images/recipes/agt/2011/01/chicken-caesar-salad-21436_l.jpeg");
var burger = new FoodorTravel("burger", "http://www.bajiroo.com/wp-content/uploads/2013/02/biggest-big-burger-epic-food-world-funny-images-pictures-bajiroo-photos-5.jpg");
var Queenstown = new FoodorTravel("Queenstown", "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTRPtmlPdNKgUkHo9BDxI3pH4LN7_zmi9SVLtSXX9Tg5W1O3iQ5");
/* 3. Handling our Anticipated Response */
//A Mood class which has the mood as a string and its corresponding emoji
/*class Mood {
    name: string;
    emoji: string;
    constructor(public mood, public emojiurl) {
        this.name = mood;
        this.emoji = emojiurl;
    }
}

var happy : Mood = new Mood("happy", "http://emojipedia-us.s3.amazonaws.com/cache/a0/38/a038e6d3f342253c5ea3c057fe37b41f.png");
var sad : Mood  = new Mood("sad", "https://cdn.shopify.com/s/files/1/1061/1924/files/Sad_Face_Emoji.png?9898922749706957214");
var angry : Mood = new Mood("angry", "https://cdn.shopify.com/s/files/1/1061/1924/files/Very_Angry_Emoji.png?9898922749706957214");
var neutral : Mood  = new Mood("neutral", "https://cdn.shopify.com/s/files/1/1061/1924/files/Neutral_Face_Emoji.png?9898922749706957214");

// any type as the scores values is from the project oxford api request (so we dont know the type)
function getCurrMood(scores : any) : Mood {
    // In a practical sense, you would find the max emotion out of all the emotions provided. However we'll do the below just for simplicity's sake :P
    if (scores.happiness > 0.4) {
        currentMood = happy;
    } else if (scores.sadness > 0.4) {
        currentMood = sad;
    } else if (scores.anger > 0.4) {
        currentMood = angry;
    } else {
        currentMood = neutral;
    }
    return currentMood;
}
*/ 
