// Create a new rubric
    //  General idea:
    //      -The rubric will be a table
    //          -3 Columns
    //              -Column one is for points: input box that will update total on change
    //              -Column two is for category name
    //              -Column three is for notes: text box that will be saved on press of a button?
    //      -There will be a add new row button
    //      -There will be a subtract row button for each row




newRubric();

function newRubric()
{
    // Get the dom that will house the rubric
    var div = document.querySelector("#rubric");
    let table = document.createElement("table");
    div.appendChild(table);
    
    //
    var headerRow = document.createElement("tr");
    
    var notesLabel = document.createElement("th");
    notesLabel.innerHTML = "Points";
    headerRow.appendChild(notesLabel);
    
    var categoryLabel = document.createElement("th");
    categoryLabel.innerHTML = "Category";
    headerRow.appendChild(categoryLabel);
    
    var notesLabel = document.createElement("th");
    notesLabel.innerHTML = "Notes";
    headerRow.appendChild(notesLabel);
    
    var newRowButtonLabel = document.createElement("th");
    var addNewButton = document.createElement("button");
    addNewButton.innerHTML = "Add New";
    newRowButtonLabel.appendChild(addNewButton);
    headerRow.appendChild(newRowButtonLabel);

    table.appendChild(headerRow);

    ////////////////////////////////////////////////////
    
    addNewButton.addEventListener("click", function()
    {
        var newRow = document.createElement("tr");

        // Points
        var pointsOutOf = document.createElement("td");
        pointsOutOf.appendChild(document.createElement("input"));
        pointsOutOf.innerHTML += "/";
        pointsOutOf.appendChild(document.createElement("input"));

        newRow.appendChild(pointsOutOf);

        // Category
        var category = document.createElement("td");
        category.appendChild(document.createElement("input"));

        newRow.appendChild(category);

        // Notes
        var comments = document.createElement("td");
        comments.appendChild(document.createElement("textarea"));

        newRow.appendChild(comments);

        // Remove button
        var removeButton = document.createElement("button")
        removeButton.innerHTML = "Delete Row";
        var remove = document.createElement("td");
        remove.appendChild(removeButton);

        // NEEDS FIX
        removeButton.addEventListener("click", function()
        {
            (function(thisRow)
            {
                console.log(table);
                console.log(thisRow);
                table.removeChild(thisRow);
            })(newRow);
        });
        //

        newRow.appendChild(removeButton);

        //
        table.appendChild(newRow);
    });

    
    
}