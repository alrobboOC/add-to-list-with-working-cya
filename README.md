# Building a working HMRC 'Add to List' pattern
## Introduction
The HMRC ‘Add To List' pattern allows users to add more than one item to a list. Its great for capturing repeating data based on a specific topic. It follows a standard flow which can be repeated multiple times to build the full picture. I have personally used this pattern across many government departments and although some departments have slightly differing patterns, the HMRC version is often seen as the benchmark.

This is a more advanced how-to guide to demonstrate how to build a working version of the pattern within your prototype.

## The techniques we’ll use
We’ll use a number of techniques that may feel a little complicated but hopefully we can explain them as we go. Heres a quick glossary of terms that we’ll cover in detail during this exercise.

### Storing Data
**Arrays**\
An array can hold multiple values\
`cars = ["Saab", "Volvo", "BMW"];`

**Objects**\
An object has properties. Data is stored as a matched pair ‘property name’ and ‘property value’. You have to remember that property names are case sensitive.\
`car = {make: "Ford", model: ”Transit", cc: "2500”};`

**An array of objects (multi-dimensional array)**\
We can combine the two methods to build our own data model\
`cars = [{make: "Ford", model: ”Transit", cc: "2500”}, {make: ”Smart", model: ”451", cc: ”700”}];`

This might sound complicated concept but image this as a table:

**Family**
| Name | Age | Relationship |
|---|---|---|
| John | 23 | Son |
| Amy | 56 | Wife |
| William | 74 | Father |\

The table an array and each row are objects\
`family = [{name: ”John", age: ”23", relationship: ”Son”}, {name: ”Amy", age: ”56", relationship: ”wife”}, {name: ”William", age: ”74", relationship: ”father”}];`

### Using loops to retrieve data
Because we’re going to store multiple pieces of data we need a way to loop through the data to identify each element. For this we’ll be using a ‘for’ loop. These are fully documented with examples at [https://mozilla.github.io/nunjucks/templating.html#for ](url)

## The structure

As previously explained ‘Add To List’ follows a fairly common flow:

1. Capture the data using one thing per page
2. Replay the data in a Check Your Answers
3. Add to the list
4. Ask the user if they’d like to add more 

For our example we’re going to keep things fairly simple. 

## The building blocks

We first build the three question pages and check your answers as we normally would. I personally use the routes file to navigate between pages 

`router.post('/name', function(request, response) {
    response.redirect("DoB")
});`

However if you normally use an action on your form then this method is fine too.

Its only on the post of check your answers that we need to start with a little more code.

### Creating your array of objects

To confirm the answers are correct the user will press ‘Save and continue’ and this is where we use javascript within the routes file. We’ll:

1. Look to see if we already have an array stored in a session
2. Create the new object
3. Add the object to the array
4. Save the array to a session 

It’ll look something like this but don’t worry we’ll walk through it step by step.\
`router.post('/cya', function(request, response) {`\
`let temporaryArray = []`\
`if(request.session.data['people']){`\
`temporaryArray = request.session.data['people'];`\
`}`\
`let createdDob = new Date(request.session.data['DoB-year'] +"-"+ request.session.data['DoB-month'] +"-"+ request.session.data['DoB-day']);`\
`let temporaryObject = {name: request.session.data['name'], dob: createdDob, relationship: request.session.data['relationship']};`\
`temporaryArray.push(temporaryObject);`\
`request.session.data['people'] = temporaryArray`\
`response.redirect("add-another");`\
`});`\

**1. First create a temporary array**

`let temporaryArray = []`

 We use the square brackets [ ] to define a variable as an array. This array will only exist until we redirect to the next page.

**2. Next we check to see if a session array already exists**

`if(request.session.data['people']){
  temporaryArray = request.session.data['people']; 
}`

This allows us to pull back any data we’ve already added, don’t forget this might not be the first time we’ve been through this loop. If the session data['people'] exists we’re going to load all the objects in it into our temporary array. 

**3. Convert our date of birth into an actual date**

`let createdDob = new Date(request.session.data['DoB-year'] +"-"+ request.session.data['DoB-month'] +"-"+ request.session.data['DoB-day']);`

As we captured the date on birth in three seperate text fields we ned to convert it to a javascript date. This format needs to be YYYY-MM-DD. By doing this we can use filters to transfer it to a readable date later.

**4. We create our new object**

`let temporaryObject = {name: request.session.data['name'], dob: createdDob, relationship: request.session.data['relationship']};`

Using the values we’ve collected from the questions and the date we constructed above we can create our new temporary object. As with the temporary array, as soon as we redirect to another page it will cease to exist. An object is define using curly brackets { } and individual match pair ‘property names’ and 'property values' are separated by a comma.

**5. We add our new object to the temporary array**

`temporaryArray.push(temporaryObject);`

using the push method will simple tag our new object onto the end of the array. This allows us to keep our array of objects in sequence as we loop through the flow again and again.

**6. Finally we save our array to a session and move to the next page**

`request.session.data['people'] = temporaryArray;
response.redirect("add-another");`

This will transfer our temporary array containing all of our objects to an array stored in session data. This is the same array that we looked to see existed in step 2 above. We then move onto our final page to display our array of objects

## Displaying our values

The add another page is split into two areas. The top presents the data within our session array back to the user. While the bottom controls our flow if we need to add more loops.

### Using a for loop to bring back data

As this loop is within the page rather that the routes we need to use Nunjunks templating code. The idea is to loop through each object in the array and retrieve the values we require. Because we’ve used an object it become really easy as we can simply use the ‘property name’ to return the 'property value'.

First we start our loop

`{% for person in data['people']%}`

person is just a variable that we’re going to use to retrieve the values. Its just a word that we use later, the word itself has no significance. We’ll use `{{person.name}}` to retrieve the value of the name but we could have easily said `{% for banana in data['people']%}` and then we’d use `{{banana.name}}`

We construct our repeating section using the code example from the HMRC design pattern and then simply place the data you want to display in the right place. {{person.name}} will give us the name, {{person.dob}} will give us the date of birth and `{{person.relationship}}` will give us the relationship.

The loop would then simple circle around until all objects within the array have been displayed. 

Don’t forget you need to close the for loop at the end of the repeating section.

`{% endfor %}`

### Capturing more data

To capture more objects simply use some javascript logic within the routes to start the whole flow again if the user answers yes to the question.

`router.post('/add-another', function(request, response) {
    if(request.session.data['addAnother']=='yes'){
        response.redirect("name");
    }
    else{
        response.redirect("confirmation");
    }
});`

## Extending the functionality to remove an object

If you’d like to push your design further you could look to build a working remove/delete function. This would look for a specific object and remove it from the array. To do this we’ll need to amend your loop on the add-another page. 

### Identifying the object to delete

Each object in the array is assigned a position. Arrays always start numbering the position from zero so the third item in your array will be at position two. As we loop through we can use this numbering to identify which position in the loop we’d like to remove using:

`loop.index0`

The way we’ll use this is to set a session variable on the URL for the remove link with the corresponding loop number. This way when we redirect to the delete confirmation we’ll know which object we’ll want to delete. 

Every time it circles through the loop a new loop.index0 will be added for example:

Loop 1 - `href="delete?loop=0"`\
Loop 2 - `href="delete?loop=1"`\
Loop 3 - `href="delete?loop=2" `       

This means as when someone clicks on the link we’ll move to the delete confirmation page and set the session.data['loop'] to whatever the loop.index0 is.

### Removing the object from the array

To remove the object we add a short piece of code within the routes post to identify the object number and then remove that object. Remember we only want this to happen if the user selects the Yes confirmation.

`router.post('/delete', function(request, response) {`\
`if(request.session.data['delete']=='yes'){`\
`let x = request.session.data['loop'];`\
`let temporaryArray = [];`\
`temporaryArray = request.session.data['people'];`\
`temporaryArray.splice(x, 1);`\
`request.session.data['people'] = temporaryArray;`\
`request.session.data['loop'] = null;`\
`}`\
`response.redirect('add-another')`\
`});`

**1. Identify if the remove has been confirmed**

`if(request.session.data['delete']=='yes'){ `

**2. Find the object number to remove**

`let x = request.session.data['loop'];`

This is the session we save on the remove link

**3. Create a temporary array**

`let temporaryArray = [];`

Again this will cease to exist as soon as we move to a new page

**4. Load our session array into the temporary array**

`temporaryArray = request.session.data['people']`

**5. Remove the object at position x (loop number)**

`temporaryArray.splice(x, 1);`

**6. Save the temporary array back to our session array**

`request.session.data['people'] = temporaryArray`

**7. Finally we clear the loop number session**

`request.session.data['loop'] = null;`



We then redirect back to the add-another page and the table will now show the list minus the record we’ve just removed. One thing to notice is the array will have also renumbered the records. If you had three objects and deleted the second (loop=1) then the third object now become second object (loop=1)
