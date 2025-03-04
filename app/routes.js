//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


// My routes


router.post('/name', function(request, response) {
    response.redirect("DoB")
});

router.post('/DoB', function(request, response) {
    response.redirect("relationship")
});

router.post('/relationship', function(request, response) {
    response.redirect("cya")
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

    // Step 3 : we push this new object to the temporary array. This will add on the new object to and old object pulled back from the session data above
    temporaryArray.push(temporaryObject);

    // Step 4 : We save eveything back to the session to use elsewhere in the service
    request.session.data['people'] = temporaryArray
    
    response.redirect("add-another");
});

router.post('/add-another', function(request, response) {
    if(request.session.data['addAnother']=='yes'){
        response.redirect("name");
    }
    else{
        response.redirect("confirmation");
    }
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

