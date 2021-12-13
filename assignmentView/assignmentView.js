// Get user session data
var username = sessionStorage.getItem("username");
var password = sessionStorage.getItem("password");
var userType = sessionStorage.getItem("userType");

// If we are missing any of the data change to login page
if(username == null || username == null || userType == null)
{
    window.location.replace("../session/login.html");
}

// Add login info to the logged in tab
document.querySelector(".currentUser").innerHTML = username + " " + "(" + userType + ")";

// Add listener to logout if logout button is clicked
document.querySelector(".logout").addEventListener("click", function()
{
    window.location.href = "../session/logout.html";
});

// Display all the assignments to the page

//// GET ASSIGNMENTS
let assignments = ["thing", "thing", "thing", "thing", "thing", "thing", "thing"];

// Get the body of the assignment ready
let body = document.querySelector("body");

// Add the assignments to the body
for(var i = 0; i < assignments.length; i++)
{
    // Construct divs
    var square = document.createElement("div");
    square.classList.add("square");
    body.appendChild(square);

    var content = document.createElement("div");
    content.classList.add("content");
    square.appendChild(content);

    var outerPositioner = document.createElement("div");
    outerPositioner.classList.add("outerPositioner");
    content.appendChild(outerPositioner);

    var item = document.createElement("div");
    item.classList.add("item");
    outerPositioner.appendChild(item);

    var assignment = document.createElement("a");
    item.appendChild(assignment);
    
    //
    item.innerHTML = "i";
    //
}