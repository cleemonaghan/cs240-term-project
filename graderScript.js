// Create a new rubric
    //  General idea:
    //      -The rubric will be a table
    //          -3 Columns
    //              -Column one is for points: input box that will update total on change
    //              -Column one is also for category name
    //              -Column three is for notes: text box that will be saved on press of a button?
    //      -There will be a add new row button
    //      -There will be a subtract row button for each row




//newRubric();

let children = [];
let maxPoints = 0;
let totalPoints = 0;



Rubric()

function Rubric()
{
    

    //
    let div = document.querySelector(".rubric-hub");

    console.log(div);
    
    let table = document.createElement("table");
    div.appendChild(table);

    //
    let pointInfoBox = document.createElement("tr");
    
    let pointMaxBox = document.createElement("td");
    let pointMax = document.createElement("input");
    pointMax.type = "number";
    pointMax.addEventListener("change", function()
    {
        maxPoints = parseInt(pointMax.value);
    });
    pointMaxBox.appendChild(pointMax);
    pointInfoBox.appendChild(pointMaxBox);

    let pointTotalBox = document.createElement("td");
    pointInfoBox.appendChild(pointTotalBox);
    pointTotalBox.innerHTML = "Total Points: " + totalPoints;

    table.appendChild(pointInfoBox);

    //
    let headers = document.createElement("tr");

    let catAndPtHead = document.createElement("th");
    catAndPtHead.classList.add("pointsBox");
    catAndPtHead.innerHTML = "Category and points";
    headers.appendChild(catAndPtHead);

    let commentsHead = document.createElement("th");
    commentsHead.classList.add("commentsBox");
    commentsHead.innerHTML = "Comments";
    headers.appendChild(commentsHead);

    table.appendChild(headers);

    //
    
    //
    let newRowButton = document.createElement("button");
    let newRowButtonHeader = document.createElement("th");
    newRowButtonHeader.classList.add("removeButtonBox");
    newRowButtonHeader.appendChild(newRowButton);
    newRowButton.addEventListener("click", function()
    {
        let row = newCategory(table);
        var rowNum = children.length;
        row.dataset.rowNum = rowNum;
        children.push(row);//splice(children.length - 1, 0, row);
        table.appendChild(row);
        
    });
    headers.appendChild(newRowButtonHeader);

}

function newCategory(table)
{
    let newRow = document.createElement("tr");
    
    let catAndPt = document.createElement("td");

    // ON INPUT CHANGE MAKE SURE ITS WITHIN MAX/MIN BOUNDS AND NOT EXCEEDING TOTALS

    let category = document.createElement("input");
    ////category.style.gridRowStart = "2";

    let input1 = document.createElement("input");
    input1.type = "number";
    input1.min = "0";
    input1.max = "100";
    //input1.style.left = "0%";
    //input1.style.top = "0%";
    input1.value = "0";
    ////input1.style.gridRowStart = "1";

    input1.addEventListener("change", function()
    {
        (function(row, pointsBar)
        {
            if(parseInt(row.firstChild.firstChild.value) < 0)
            {
                row.firstChild.firstChild.value = "0";
            }
            totalPoint(row, pointsBar);
        })(newRow, table.children[0].children[1]);
    });

    let input2 = document.createElement("input");
    input2.type = "number";
    input2.min = "0";
    input2.max = "100";
    //input2.style.left = "70%";
    //input2.style.top = "0%";
    input2.value = "0";
    ////input2.style.gridRowStart = "1";

    input2.addEventListener("change", function()
    {
        (function(row)
        {
            normalizeMaxPoints(row);
        })(newRow);
    });

    catAndPt.appendChild(category);
    catAndPt.appendChild(input1);
    catAndPt.appendChild(input2);
    catAndPt.classList.add("pointsBox");

    newRow.appendChild(catAndPt);

    let comments = document.createElement("td");
    comments.appendChild(document.createElement("textarea"));
    comments.classList.add("commentsBox");

    newRow.appendChild(comments);

    //let removeBox = document.createElement("td");
    let removeButton = document.createElement("button");
    removeButton.innerHTML = "&#10005;";
    newRow.appendChild(removeButton);
    //removeBox.classList.add("removeButtonBox");

    removeButton.addEventListener("click", function()
    {
        (function(t, row)
        {
            moveup(row);
            removeRow(t, row);
        })(table, newRow);
    });

    //newRow.appendChild(removeBox);

    //newRow.style.top = "" + ((thisIndex + 1) * 5) + "%";

    return newRow;
}

// prevent category max point totals from adding up to over the total points 
function normalizeMaxPoints(row)
{
    var index = parseInt(row.dataset.rowNum);

    console.log("Normalizing point cap of " + index);


    // Evaluate the proposed value of this category and make sure there are no violations
    var currentCap = parseInt(row.firstChild.children[2].value);

    if(currentCap < 0)
    {
        row.firstChild.children[2].value = 0;
    }
    
    // The total amount of max points allocated to categories so far
    var totalMaxSoFar = 0;

    for(var i = 0; i < children.length; i++)
    {
        if(i != index)
        {
            totalMaxSoFar += parseInt(children[i].firstChild.children[2].value);
        }
    }

    if((currentCap + totalMaxSoFar) > maxPoints)
    {
        row.firstChild.children[2].value = "" + (maxPoints - totalMaxSoFar);
    }
}

// prevent category max point totals from adding up to over the total points 
function totalPoint(row, pointsBox)
{
    
    // The total amount of max points allocated to categories so far
    totalPoints = 0;

    for(var i = 0; i < children.length; i++)
    {
        totalPoints += parseInt(children[i].firstChild.children[1].value);
    }

    pointsBox.innerHTML = "Total Points: " + totalPoints;
}

function moveup(row)
{
    var index = parseInt(row.dataset.rowNum);

    console.log("" + children.length + " >= " + index + " ?");

    if(index >= children.length)
    {
        return;
    }

    for(var i = index + 1; i < children.length; i++)
    {
        console.log("Moving up child " + i);
        children[i].dataset.rowNum = "" + (i - 1);
        //children[i].style.top = "" + ((i) * 5) + "%";    
    }
}

function removeRow(table, row)
{
    var index = parseInt(row.dataset.rowNum);

    console.log("Removing child " + index);

    totalPoints -= parseInt(row.firstChild.children[1].value);

    table.firstChild.children[1].innerHTML = "Total Points: " + totalPoints;

    //
    table.removeChild(row);
    children.splice(index, 1);
}






// function newRubric()
// {
//     // Get the dom that will house the rubric
//     var div = document.querySelector("#rubric");
//     let table = document.createElement("table");
//     div.appendChild(table);
    
//     //
//     var headerRow = document.createElement("tr");
    
//     var notesLabel = document.createElement("th");
//     notesLabel.innerHTML = "Points";
//     headerRow.appendChild(notesLabel);
    
//     var categoryLabel = document.createElement("th");
//     categoryLabel.innerHTML = "Category";
//     headerRow.appendChild(categoryLabel);
    
//     var notesLabel = document.createElement("th");
//     notesLabel.innerHTML = "Notes";
//     headerRow.appendChild(notesLabel);
    
//     var newRowButtonLabel = document.createElement("th");
//     var addNewButton = document.createElement("button");
//     addNewButton.innerHTML = "Add New";
//     newRowButtonLabel.appendChild(addNewButton);
//     headerRow.appendChild(newRowButtonLabel);

//     table.appendChild(headerRow);

//     ////////////////////////////////////////////////////
//     var newRow = document.createElement("tr");

//         // Points
//         var pointsOutOf = document.createElement("td");
//         input1 = document.createElement("input");
//         input1.size = "4";
//         pointsOutOf.appendChild(input1);
//         pointsOutOf.innerHTML += "/";
//         input2 = document.createElement("input");
//         input2.size = "4";
//         pointsOutOf.appendChild(input2);

//         newRow.appendChild(pointsOutOf);

//         // Category
//         var category = document.createElement("td");
//         category.appendChild(document.createElement("textarea"));

//         newRow.appendChild(category);

//         // Notes
//         var comments = document.createElement("td");
//         comments.appendChild(document.createElement("textarea"));

//         newRow.appendChild(comments);

//         //
//         table.appendChild(newRow);
    
//     addNewButton.addEventListener("click", function()
//     {
//         var newRow = document.createElement("tr");

//         // Points
//         var pointsOutOf = document.createElement("td");
//         input1 = document.createElement("input");
//         input1.size = "4";
//         pointsOutOf.appendChild(input1);
//         pointsOutOf.innerHTML += "/";
//         input2 = document.createElement("input");
//         input2.size = "4";
//         pointsOutOf.appendChild(input2);

//         newRow.appendChild(pointsOutOf);

//         // Category
//         var category = document.createElement("td");
//         var input3 = document.createElement("input");
//         category.appendChild(input3);

//         newRow.appendChild(category);

//         // Notes
//         var comments = document.createElement("td");
//         comments.appendChild(document.createElement("textarea"));

//         newRow.appendChild(comments);

//         // Remove button
//         var removeButton = document.createElement("button")
//         removeButton.innerHTML = "Delete Row";
//         var remove = document.createElement("td");
//         remove.appendChild(removeButton);

//         removeButton.addEventListener("click", function()
//         {
//             (function(thisRow)
//             {
//                 console.log(table);
//                 console.log(thisRow);
//                 table.removeChild(thisRow);
//             })(newRow);
//         });
//         //

//         newRow.appendChild(removeButton);

//         //
//         table.appendChild(newRow);
//     });

    
    
// }