## Xsolla Promotions API Test Plan

#### Introduction
This document describes the plan for testing the [Xsolla REST API](https://api.xsolla.com/) project.

Xsolla is a video games storefront management and billing solution provider, providing game developers and publishers with payment and billing services for doing business on a global scale.
Their monetization solutions make it easy to accept in-game payments worldwide via their payment platforms.

Xsolla provides the API service that is the target for testing.

#### References
- [project documentation](http://developers.xsolla.com/api.html)

#### Scope
- *Automated Functional testing*
    
    The API implements CRUD methods that should be tested.
    
    *Currently, in scope*
    - GET https://api.xsolla.com/merchant/merchants/{merchant_id}/promotions
    - GET https://api.xsolla.com/merchant/merchants/{merchant_id}/promotions/{promotion_id}
    - POST https://api.xsolla.com/merchant/merchants/{merchant_id}/promotions
    - DELETE https://api.xsolla.com/merchant/merchants/{merchant_id}/promotions/{promotion_id}
    
    *Out of scope*
    - authorization
    - pagination
    - any other API's endpoints
    
    *Coverage*  
    The goal is to cover most major use cases for regression tests.

#### Approach
Since we have no access to a DB or any other middle ware, the API can be tested as a black box only, using user scenarios with combined requests.  
The tests will be "self-described" via [mocha](https://mochajs.org/) and [expect](https://github.com/Automattic/expect.js) notations, so not needed to create separated checklist.

#### Tools
As a test automation tool will be used the [Chakram framework](http://dareid.github.io/chakram/), because it provides http related assertions and json structure validation.  
The framework is for javascript, so tests will be implemented on the [Node.js](https://nodejs.org/en/) platform.