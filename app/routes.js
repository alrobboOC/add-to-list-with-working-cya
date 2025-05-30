//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


// My routes


router.post('/name', function(request, response) {
    if(request.session.data['check']==true){
        response.redirect("cya")
    }
    else{
        response.redirect("DoB")
    }
    
});

router.post('/DoB', function(request, response) {
    if(request.session.data['check']==true){
        response.redirect("cya")
    }
    else{
        response.redirect("relationship")
    }
});

router.post('/relationship', function(request, response) {
    if(request.session.data['check']==true){
        response.redirect("cya")
    }
    else{
        response.redirect("cya")
    }
});



router.post('/cya', function(request, response) {
    let temporaryArray = [] // this creates a temporary array to use only on this post
    
    // Step 1: We're going to if we already have any objects stored in our session data
    if(request.session.data['people']){
        temporaryArray = request.session.data['people']; //if we do we add this to our temporary array
    }
    // Step 2: We're going to create a new object
    // First we combine the three date inputs (day/month/year) and sets them as a date
    let createdDob = new Date(request.session.data['DoB-year'] +"-"+ request.session.data['DoB-month'] +"-"+ request.session.data['DoB-day']);
    // next we create a temporary object just for the data we've just captured
    let temporaryObject = {name: request.session.data['name'], dob: createdDob, relationship: request.session.data['relationship']};


    if(request.session.data['check']==true){
        //if check is true we replace the values at the loop index rather than add another object
        let x = request.session.data['loop'];
        temporaryArray[x]=temporaryObject
    }
    else{
        // Step 3 : we push this new object to the temporary array. This will add on the new object to and old object pulled back from the session data above
        temporaryArray.push(temporaryObject);
    }

    
    

    // Step 4 : We save eveything back to the session to use elsewhere in the service
    request.session.data['people'] = temporaryArray
    request.session.data['check']=false;
    response.redirect("add-another");
});

router.post('/add-another', function(request, response) {
    if(request.session.data['addAnother']=='yes'){
        request.session.data['name'] = null;
        request.session.data['DoB-day'] = null;
        request.session.data['DoB-month'] = null;
        request.session.data['DoB-year'] = null;
        request.session.data['relationship'] = null;
        response.redirect("name");
    }
    else{
        response.redirect("confirmation");
    }
});

router.get('/fakePage', function(request, response) {
    // Use a fake page to pull back the values for the record you've chsen to change

    // just set a session to say youre in check mode this is used in the routes for the individual pages to know to go straight back to cya
    request.session.data['check']=true;

    //pull back the loop index from the add another page
    let x = request.session.data['loop']

    //create your tempoarary array as normal and pull pack the data from the person array
    let temporaryArray = [];
    temporaryArray = request.session.data['people']

    //pull out the values for the record we're chaning and write them to the standard session we use when capturing the data
    request.session.data['name'] = temporaryArray[x].name;
    request.session.data['relationship'] = temporaryArray[x].relationship;

    // as DoB is saved in the object as a date string we'll need to pull the individual values from the string
    let DoB = temporaryArray[x].dob;
    request.session.data['f'] = DoB; 
    request.session.data['DoB-year'] = DoB.slice(0, 4); 
    request.session.data['DoB-day'] = DoB.substring(8,10);
    request.session.data['DoB-month'] = DoB.substring(5,7);
      
    response.redirect("cya");
});



router.post('/delete', function(request, response) {
    if(request.session.data['delete']=='yes'){      //if the user answers yes on the delete page

        // we take the row number we passed across on the delete link and set it to a variable
        let x = request.session.data['loop'];

        // again we create a temporary array and load our data into it
        let temporaryArray = [];
        temporaryArray = request.session.data['people']

        // we now delete the object at position x
        temporaryArray.splice(x, 1);

        // one again we return our temporary array (minus the object we've removed) to our session
        request.session.data['people'] = temporaryArray

        //finally we reset the loop session so it won't cause us any issues
        request.session.data['loop'] = null;  
    }
    response.redirect('add-another')
});







































router.post('/name', function(request, response) {
    if(request.session.data['name'] == ""){
        request.session.data['error'] = 'true'
        response.redirect('name');
    }
    else{
        request.session.data['error'] = null;
        response.redirect('name-confirm');
    }
})

