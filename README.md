# Camping Trip Planner
## by Ryan O'Connor, Sebastian Tota, Shravanth Surapaneni, Marcus Anestad and Matthew Day 

### Reference Links
[Project Board](https://trello.com/b/uclUHtIM/camping-trip-planner)

[GitHub Repo](https://github.com/SebTota/Camping-Trip-Planner-Backend)

### User Features
* Create account
* Create new trips
* Invite friends to your trip planners
* Create multiple lists in each trip
* Edit/delete items on list
* Mobile friendly

### Security Features
* Hashing and encrypting user passwords
* ReCaptcha for bot prevention
* Protected endpoints using sessions, only allowing signed in users to access data

### Project Overview
_The goal of the project is to create an application for camping/outdoor trips. The project
functionality includes planning, responsibility sharing, and photo uploading. Users of the app
will be able to create a trip and invite friends. The focus of the planning section includes gear lists, 
food menus, directions, and maps. Responsibility sharing includes signing up for bringing food/gear, keeping track of 
how much each person spends, and a system for reimbursement after the trip. Finally, after the trip members can upload and 
make comments on photos._

### Vision Statement
_For a group of adventure seekers who are planning an outdoors activity together the Camping 
Trip Planner is a web app that allows groups to plan a trip together in a more intuitive and seamless 
way unlike Google Sheets which takes longer to create._

### Personas

#### Julia, a college student

_Julia, age 21, is a senior CS major at Temple University in Philadelphia. 
She grew up in Montgomery County, where she would enjoy hikes around the Wissahickon
with her family growing up. This extended to a true passion for outdoor activities and
does them to relax and escape the stresses of her daily life._

_With an increase in course difficulty on top of living in the age of COVID,
Julia relies heavily on weekly social distanced outings with her friends to
maintain her sanity. On a recent trip to the Poconos for some camping, her group
realized they forgot to bring anything substantial for dinner. Being out in the middle of
nowhere they had to drive 50 minutes to a supermarket to remedy the situation, cutting heavily
into their time with each other and nature. Being a person that is highly involved in the world of
new software technology, Julia wondered if there was an app that could help prevent an incident like
this in the future. Luckily, she stumbled across the Camping Trip Planner app. Since then,
every trip goes off without a hitch._

#### Juan, a father

_Juan is a parent of two. His family always looks forward to going on a yearly summer 
canoe trips with the Smith’s. Juan is a doctor and pretty inexperienced when it comes 
to new technology. However he loves learning new things. He hears about Camping Trip 
Planner and excitedly calls Mr. Smith. They are easily able to set up profiles and 
create a trip._

_Now they are easily able to organize and plan the trip. They are also able to get 
their children (Smith, John, Smitty, and Johnny) involved and begin to teach them 
everything that goes into organizing such a trip. They have a great time and plan 
on using Camping Trip Planner for planning their trip next year._

#### Tracy, a middle school teacher

_Tracy, a middle school English teacher, is getting ready to take her class on a camping trip. Every year, the 8th-grade class takes a 3-day trip to the local campground as a celebration for graduating from middle school. This is Tracys first year taking her class, and she is worried about helping her students plan for the trip._

_With the Camping Trip Planner, she can sign all her students up into a single trip list to make sure enough supplies are brought, without over packing the busses. Rather than speaking to each student individually in the hopes they remember to bring what they are asked to bring, she makes a list of all the necessities, and has the student assign themselves to certain items. This way, Tracy can keep track of what has been tracked, and what is still missing._

#### Tyler, a boy scout troop leader
_Tyler is is the troop leader for his son's boy scout troop. He wants to take his troop camping this weeknd
to teach them outdoor skills. However, he can't expect a bunch of middle schoolers to remember to bring everything, he needed
to find an effecient way to organize everything in preperation for the trip. As we all know the boy scout motto is: "Be prepared",
so clearly had to think of everything._

_So, to deal with this he asks the parents of the kids in his troop for ideas and one of them suggests, Camping Trip Planner.
Tyler, looked into it and found that Camping Trip Planner not only lets him create a list for his trip, but also allows him to 
add people to share the list with so that they could also collaborate and use it as a checklist. Tyler had found his solution,
he was able to add all the parents of the kids in his troop, and this way he has a way to keep track of everything and no longer
has to rely on the kids to make sure they have everything they will need._

### Testing
We focused mainly on manual testing for out application. We started with testing database functions in Python
Then, we created API route that used the database function and we would manually check to make sure that the database was updating as we expected for each database function/api route.

The API routes were tested with Postman by calling certain routes and manually checking the database. Once we tested it with postman, we would integrate the endpoint with out website and continue manual checking of the database and results being shown. 

To make teseting easier, we added code to the Python API web service that would check if we were running on localhost. If we were, that meant we were in testing mode and we could bypass the reCaptcha for authentication making testing a bit easier.

![](postman.png)
