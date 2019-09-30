# redd-clone

## Technologies Used
* HTML
* CSS
* Javascript
* Bulma.io
* Mocha.js
* Chai.js
* Chai-Dom.js
* Pivotal Tracker
* Figma

## Approach
We divided the project into three phases - Planning, Development, Debugging and Refactoring Code

### Planning
We discussed project both of our working styles, our experiences, and how to best work together in completing the project.
Then, we created a list of features that are minimally required to deliver the project. Additionally we listed features, which we thought are helpful or nice to have, but were outside the scope of the project (i.e. email validation on the user side ).  We then created user stories for the features in Pivotal Tracker, so we could focus on implementing the minimum required features and manage the tasks effectively.

After creating the user stories, we decided to create the wireframes for the required features using Figma, a web application for wireframing and prototyping.

### Development
We decided to code with pair-programming technique in which one of us codes and another navigates the coder. We decided to pair-program, because we figured it kept us disciplined and we were actually more efficient in finishing the tasks. Additionally, we were able to teach other.  We didn't do pair-programming, but we were strict about one computer being used to code at a time.
We decided in the planning stage to focus primarily on the core functionality. Hence, we started with the simpler  GET fetches and then delved into POST and DELETE fetches. Once we had the core functionality down, we focused on lower priority features, while making sure core features remained functional.

### Debugging and Refactoring Code
We decided to refactor code, so we could eliminate bugs and build upon the application, as we wanted to add features outside the scope of the project. Additionally, the file was quite large and we noticed the need for helper functions to simplify the code for readability. Hence, we wrote bunch of helper functions.

## Unsolved Problems and Major Hurdles
One major hurdle was how to work with the JWT. We managed to overcome this hurdle by using Google and figuring out that the token needed to be passed in the headers for POST requests. Another hurdle was having the application to remember that we were authenticated for coniditional rendering purposes such as whether login and sign up buttons should appear or be replaced with a user greeting.

There is a bug with the Load More button that implements Posts pagination where it appears unexpectedly. We were unable to get to fixing this bug before the features freeze and presentations deadline. 

## Installation
* Clone the repo to a local directory using: git clone <clone link>
* In commandline, cd into project directory
* Open index.html in the browser
  
### Tests
To run test-suite:
* Clone the repo to a local directory using: git clone <clone link>
* In commandline, cd into project directory
* In commandline, cd into test-suite directory
* Open tests.html in the browser

## User Stories
[User Stories (Pivotal Tracker)](https://www.pivotaltracker.com/n/projects/2400266)

## Wireframes
[Wireframes (Figma)](https://www.figma.com/file/CMN8EEv8dqMifxlgwgM5ru/ReddClone?node-id=17%3A4)

## Deadlines
| Date | Deliverable |
| ----------- | ----------- |
| Wednesday, September 25th @ 11:00am | Complete user stories in pivotal tracker |
| Sunday, September 29th @ 12:00pm | Feature freeze |
| Monday, September 30th @ 9:15am | Project due and presentations |
