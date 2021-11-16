
newRubric();

function newRubric()
{
    // Get the dom that will house the rubric
    div = document.querySelector("#rubric");
    table = document.createElement("table");
    div.appendChild(table);
    
    //
    headerRow = document.createElement("tr");
    
    notesLabel = document.createElement("th");
    notesLabel.innerHTML = "Points";
    headerRow.appendChild(notesLabel);
    
    categoryLabel = document.createElement("th");
    categoryLabel.innerHTML = "Category";
    headerRow.appendChild(categoryLabel);
    
    notesLabel = document.createElement("th");
    notesLabel.innerHTML = "Notes";
    headerRow.appendChild(notesLabel);
    
    newRowButtonLabel = document.createElement("th");
    addNewButton = document.createElement("button");
    addNewButton.innerHTML = "Add New";
    newRowButtonLabel.appendChild(addNewButton);
    headerRow.appendChild(newRowButtonLabel);

    table.appendChild(headerRow);

    ////////////////////////////////////////////////////
    
    addNewButton.addEventListener("click", function()
    {
        newRow = document.createElement("tr");

        // Points
        pointsOutOf = document.createElement("td");
        pointsOutOf.appendChild(document.createElement("input"));
        pointsOutOf.innerHTML += "/";
        pointsOutOf.appendChild(document.createElement("input"));

        newRow.appendChild(pointsOutOf);

        // Category
        category = document.createElement("td");
        category.appendChild(document.createElement("input"));

        newRow.appendChild(category);

        // Notes
        comments = document.createElement("td");
        comments.appendChild(document.createElement("input"));

        newRow.appendChild(comments);

        // Remove button
        removeButton = document.createElement("button")
        removeButton.innerHTML = "Delete Row";
        remove = document.createElement("td");
        remove.appendChild(removeButton);

        // NEEDS FIX
        removeButton.addEventListener("click", function()
        {
            table.removeChild(newRow);
        });
        //

        newRow.appendChild(removeButton);

        //
        table.appendChild(newRow);
    });

    
    // Create a new rubric
    //  General idea:
    //      -The rubric will be a table
    //          -3 Columns
    //              -Column one is for points: input box that will update total on change
    //              -Column two is for category name
    //              -Column three is for notes: text box that will be saved on press of a button?
    //      -There will be a add new row button
    //      -There will be a subtract row button for each row
}