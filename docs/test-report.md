#### Suggestions

Don't make testers cry, please :) Define various restrictions/requirements to data in the docs and also define structures of responses in addition to examples.

#### Bugs

##### It's possible to post promotion with params like read_only or enabled 
*Steps*  
1. Send post request to /promotions with required params and 'enabled: true'
2. Send get request to /promotions/{id}  
*AR:* No errors in the post response, but get response contains 'enabled: false'  
*ER:* To be clarified. If it's fine to set such params during creation, then params should be applied. If params can be changed by separated methods only, then post should return an error.

##### It's impossible to set any localizations except 'en'
*Steps*  
1. Send post request to /promotions with required params and 'label': {'ru': 'test'}  
*AR:* Error: "Локализации могут быть только en"  
*ER:* To be clarified. Need to provide an ability to set any localization or define such restrictions in the docs.

##### There are russian error messages instead of english
*Steps*  
1. Send post request to /promotions with required params and 'label': {'ru': 'test'}  
*AR:* Error with message: "Локализации могут быть только en"  
*ER:* The message field should be always in english, in accordance to the docs

##### Empty 'label' field has wrong value
*Steps*  
1. Send post request to /promotions with required params  
2. Send get request to /promotions/{id}  
*AR:* Value of 'label' field is null  
*ER:* Value of 'label' field is {}  

##### Empty 'description' field has wrong value
*Steps*  
1. Send post request to /promotions with required params  
2. Send get request to /promotions/{id}  
*AR:* Value of 'description' field is []  
*ER:* Value of 'description' field is {}  

##### Empty 'name' field has wrong value
*Steps*  
1. Send post request to /promotions with required params  
2. Send get request to /promotions/{id}  
*AR:* Value of 'description' field is []  
*ER:* Value of 'description' field is {}

##### Incorrect status codes for requests without required params
*Steps*  
1. Send post request to /promotions with empty body  
*AR:* Status code of the response is 422  
*ER:* Status code of the response is 400, in accordance to the docs  