<p align="center">

  <h3 align="center">Road trip itinerary generator</h3>

  <p align="center">
    React app to generate a road trip itinerary given a starting point and a destination.
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)


<!-- ABOUT THE PROJECT -->
## About The Project

<p>This React app lets the user choose a start and an end point for their trip, as well as selecting various parameters regarding their trip (type of attractions they'd like to visit, how much they're prepared to deviate from the original route). The app will then return a map of the route with the suggested attractions and some basic information regarding the initerary (total distance and time, list of suggested attractions). </p>

<p>Demo at https://itinerary-generator.netlify.app/</p>

<p> The back end for this application is made with Node.js and Express and can be found at https://itinerary-generator-node.nw.r.appspot.com/ </p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Node >= 14.15.1<br>

An OpenRouteService API key ([get one here](https://openrouteservice.org/dev/#/signup))<br>

An OpenTripMap API key ([get one here](https://opentripmap.io/register))


### Installation

1. Clone the repo
```sh
git clone https://github.com/cbaggini/itinerary-generator-react.git
```
2. Install the necessary Node packages
```sh
npm install
```
3. Start the local development app.
```sh
npm start
```

<!-- USAGE EXAMPLES -->
## Usage

#### Search view

Here the user can select where they'd like their trip to start and end, as well as how many kilometers they want to deviate from the most direct route (between 1 and 30) and one or more types of attractions they'd like to visit.
![alt text](https://github.com/cbaggini/itinerary-generator-react/blob/master/search.png?raw=true)

#### Results view

<p>Here the user is shown a map of the calculated itinerary with the suggested attractions shown as red circle markers and origin and destination shown as blue markers. The route between the starting point, all suggested attractions and the destination is also shown (blue line). The green buffer represent the search area used to look for attractions.</p>
<p>Above the map, the user can see some basic information about the trip, as well as the list of suggested places to visit.</p>

![alt text](https://github.com/cbaggini/itinerary-generator-react/blob/master/result.png?raw=true)
