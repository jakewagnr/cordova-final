"use strict"
if (document.deviceready) {
    document.addEventListener('deviceready', sportsScores, false);
}
else {
    document.addEventListener('DOMContentLoaded', sportsScores, false);
}
var nav = {
    pages: []
    , links: []
    , init: function () {
        nav.pages = document.querySelectorAll('[data-role="page"]');
        nav.links = document.querySelectorAll('[data-role="link"]');
        console.log(nav.pages);
    [].forEach.call(nav.links, function (item) {
            item.addEventListener("click", nav.nav);
            console.log(item.href);
        });
    }
    , nav: function (ev) {
        ev.preventDefault(); //stop the link from doing anything
        console.log("clicked");
        var item = ev.currentTarget; //the anchor tag
        var href = item.href; //the href attribute
        var id = href.split("#")[1]; //just the letter to the right of "#"
    [].forEach.call(nav.pages, function (item) {
            console.log(item.id);
            if (item.id == id) {
                item.className = "active";
            }
            else {
                item.className = "";
            }
        });
    }
}

function sportsScores() {
    document.getElementById("refresh").addEventListener("click", refresh);
    //////////////////Storage Check/////////////////////////////////    
    if (!localStorage.getItem("sportsData")) {
        getData.getJSON();
    }
    else {
        displayData();
    }
}
//////////////////////Fetch////////////////////////////////////    
var getData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/soccer.php"
    , httpRequest: "GET"
    , getJSON: function () {
        let headers = new Headers();
        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
        //Options
        let options = {
            method: getData.httpRequest
            , mode: "cors"
            , headers: headers
        };
        // Request
        let request = new Request(getData.url, getData.options);
        console.log(request);
        fetch(request).then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data);
            storeData(data);
            displayData();
        }).catch(function (err) {
            alert("Error: " + err.message);
        });
    }
}

function storeData(data) {
    localStorage.setItem("sportsData", JSON.stringify(data));
    console.log(localStorage);
}

function refresh(ev) {
    localStorage.clear();
    document.getElementById("games").innerHTML = "<h1>Games</h1><table id='gameTable'> </table>";
    document.getElementById("scores").innerHTML = "<h1>Scores</h1>";
    getData.getJSON();
    console.log(localStorage);
}

function displayData() {
    ///////////////////////////Display Scheduale///////////////////////////////
    let rawData = localStorage.getItem("sportsData");
    let gamesPage = document.getElementById("games");
    rawData = JSON.parse(rawData);
    console.log(rawData);
    let team1 = rawData.teams[0].name;
    let team2 = rawData.teams[1].name;
    let team3 = rawData.teams[2].name;
    let team4 = rawData.teams[3].name;
    let team1Wins = 0;
    let team2Wins = 0;
    let team3Wins = 0;
    let team4Wins = 0;
    let team1Draw = 0;
    let team2Draw = 0;
    let team3Draw = 0;
    let team4Draw = 0;
    for (let i = 0; i < rawData.scores.length; i++) {
        let calender = document.createElement("h3")
        let calanderTable = document.getElementById("gameTable");
        let dateRow = document.createElement("tr");
        let dateData = document.createElement("td")
        calender.textContent = rawData.scores[i].date;
        calanderTable.appendChild(dateRow);
        dateRow.appendChild(dateData);
        dateData.appendChild(calender);
        gamesPage.appendChild(calanderTable);
        /////////////////////matches in a day/////////////////////////////////////
        for (let a = 0; a < rawData.scores[i].games.length; a++) {
            let homeId = rawData.scores[i].games[a].home;
            let homeScore = rawData.scores[i].games[a].home_score;
            //get home name     
            for (var x = 0; x < rawData.teams.length; x++) {
                if (homeId == rawData.teams[x].id) {
                    var homeName = rawData.teams[x].name;
                    //console.log(homeName);
                }
            }
            let awayId = rawData.scores[i].games[a].away;
            let awayScore = rawData.scores[i].games[a].away_score;
            //get away name     
            for (let x = 0; x < rawData.teams.length; x++) {
                if (awayId == rawData.teams[x].id) {
                    var awayName = rawData.teams[x].name;
                    //console.log(awayName);
                }
            }
            //populate match list
            var homeNoSpace = homeName.split(" ").join("_");
            var awayNoSpace = awayName.split(" ").join("_");
            console.log(homeNoSpace);
            console.log(awayNoSpace);
            var svg = document.querySelector("#svgss");
            //console.log(svg.classList);
            var homeSvg = svg.cloneNode(true);
            var awaySvg = svg.cloneNode(true);
            homeSvg.className = "svgs";
            awaySvg.className = "svgs";
            homeSvg.classList.add(homeNoSpace);
            awaySvg.classList.add(awayNoSpace);
            console.log(homeSvg.classList);
            console.log(awaySvg.classList);
            let dateData2 = document.createElement("td");
            let match = homeName + " / " + awayName;
            let game = document.createElement("p");
            game.textContent = match;
            calanderTable.appendChild(dateRow);
            dateRow.appendChild(dateData2);
            dateData2.appendChild(homeSvg);
            dateData2.appendChild(awaySvg);
            dateData2.appendChild(game);
            /////////////////////////////check win/loss///////////////////////////   
            if (homeScore > awayScore) {
                console.log("Home Win");
                if (homeName == team1) {
                    team1Wins++;
                }
                if (homeName == team2) {
                    team2Wins++;
                }
                if (homeName == team3) {
                    team3Wins++;
                }
                if (homeName == team4) {
                    team4Wins++;
                }
            }
            if (homeScore < awayScore) {
                console.log("Away Win");
                if (awayName == team1) {
                    team1Wins++;
                }
                if (awayName == team2) {
                    team2Wins++;
                }
                if (awayName == team3) {
                    team3Wins++;
                }
                if (awayName == team4) {
                    team4Wins++;
                }
            }
            if (homeScore == awayScore) {
                console.log("Draw");
                if (homeName == team1 && awayName == team2) {
                    team1Draw++;
                    team2Draw++;
                }
                if (homeName == team1 && awayName == team3) {
                    team1Draw++;
                    team3Draw++;
                }
                if (homeName == team1 && awayName == team4) {
                    team1Draw++;
                    team4Draw++;
                }
                if (homeName == team2 && awayName == team1) {
                    team2Draw++;
                    team1Draw++;
                }
                if (homeName == team2 && awayName == team3) {
                    team2Draw++;
                    team3Draw++;
                }
                if (homeName == team2 && awayName == team4) {
                    team2Draw++;
                    team4Draw++;
                }
                if (homeName == team3 && awayName == team1) {
                    team3Draw++;
                    team1Draw++;
                }
                if (homeName == team3 && awayName == team2) {
                    team3Draw++;
                    team2Draw++;
                }
                if (homeName == team3 && awayName == team4) {
                    team3Draw++;
                    team4Draw++;
                }
                if (homeName == team4 && awayName == team1) {
                    team4Draw++;
                    team1Draw++;
                }
                if (homeName == team4 && awayName == team2) {
                    team4Draw++;
                    team2Draw++;
                }
                if (homeName == team4 && awayName == team3) {
                    team4Draw++;
                    team3Draw++;
                }
            }
        }
    }
    console.log(team1Wins, team1Draw, team2Wins, team2Draw, team3Wins, team3Draw, team4Wins, team4Draw);
    ///////////////table sorting///////////////
    let team1Loss = rawData.scores.length - (team1Wins + team1Draw);
    let team2Loss = rawData.scores.length - (team2Wins + team2Draw);
    let team3Loss = rawData.scores.length - (team3Wins + team3Draw);
    let team4Loss = rawData.scores.length - (team4Wins + team4Draw);
    var standings = [
        {
            "team": team1
            , "wins": team1Wins
            , "draws": team1Draw
            , "losses": team1Loss
        }
        , {
            "team": team2
            , "wins": team2Wins
            , "draws": team2Draw
            , "losses": team2Loss
        }
        , {
            "team": team3
            , "wins": team3Wins
            , "draws": team3Draw
            , "losses": team3Loss
        }
        , {
            "team": team4
            , "wins": team4Wins
            , "draws": team4Draw
            , "losses": team4Loss
        }
                ];
    standings = standings.sort(function (a, b) {
        let teamA = a.wins;
        let teamB = b.wins;
        if (teamA > teamB) {
            return -1;
        }
        if (teamA < teamB) {
            return 1;
        }
        if (teamA == teamB) {
            let teamADraws = a.draws;
            let teamBDraws = b.draws;
            if (teamADraws > teamBDraws) {
                return -1;
            }
            if (teamADraws < teamBDraws) {
                return 1;
            }
        }
    });
    console.log(standings);
    ///////////////////////////Display Standings//////////////////////////////
    let scoresPage = document.getElementById("scores");
    let table = scoresPage.appendChild(document.createElement("table"));
    //table headers
    let teamHeader = document.createElement("th");
    teamHeader.textContent = "Teams";
    let winHeader = document.createElement("th");
    winHeader.textContent = "Wins";
    let drawHeader = document.createElement("th");
    drawHeader.textContent = "Draws";
    let lossHeader = document.createElement("th");
    lossHeader.textContent = "Losses";
    table.appendChild(teamHeader);
    table.appendChild(winHeader);
    table.appendChild(drawHeader);
    table.appendChild(lossHeader);
    //populate table
    for (let t = 0; t < rawData.teams.length; t++) {
        let row = document.createElement("tr");
        let team = document.createElement("td");
        team.textContent = standings[t].team;
        let wins = document.createElement("td");
        wins.textContent = standings[t].wins;
        let draws = document.createElement("td");
        draws.textContent = standings[t].draws;
        let losses = document.createElement("td");
        losses.textContent = standings[t].losses;
        var teamNoSpae = standings[t].team.split(" ").join("_");
        var teamIcon = svg.cloneNode(true);
        teamIcon.className = "svgs";
        teamIcon.classList.add(teamNoSpae);
        table.appendChild(row);
        team.appendChild(teamIcon);
        row.appendChild(team);
        row.appendChild(wins);
        row.appendChild(draws);
        row.appendChild(losses);
    }
    nav.init();
}