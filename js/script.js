$(document).ready(function () {

  // Initialize AOS
  AOS.init({
    offset: 0,
    duration: 600,
    once: false
  })
  //Home button 
  $("button").click(function () {
    $(".container").removeClass("exit").addClass("return")
    $(".team-info").attr("class", "team-info remove")
    $('body').css('overflow-y', "hidden")


  })
  //animating after a league choosed
  $(".col-sm").click(function () {
    var img = $(this).children('img').attr('src')
    var id = $(this).attr('id');
    $(".team-info").children('img').attr('src', img)
    $('.list-group-item').remove("#list");
    $(".container").toggleClass("exit")
    $(".team-info").attr("class", "team-info enter")
    $('body').css('overflow-y', "auto")
    //gets standings for the selected league
    $.ajax({
      headers: { 'X-Auth-Token': 'a65dc5386ad14455a743b88dd047b5df' },
      url: `https://api.football-data.org/v2/competitions/${id}/standings`,
      dataType: 'json',
      type: 'GET',
    }).done(function (response) {
      $stand = $('#standings-list')

      var array = response.standings[0].table;
      for (let i = 0; i < array.length; i++) {
        standings(array[i]);
      }
      //appends standings positions
      function standings(pos) {
        var position = pos.position
        var name = pos.team.name
        var played = pos.playedGames
        var won = pos.won
        var draw = pos.draw
        var lost = pos.lost
        var points = pos.points
        $stand.append(`<li class="list-group-item" id="list" data-aos="fade-right">
        <p> ${position}. ${name}</p>
        <p>${played}</p> 
        <p>${won}</p>      
        <p>${draw}</p>
        <p>${lost}</p>
        <p>${points}</p>
    </li> `)
      }

      var matchDay = response.season.currentMatchday
      match(matchDay)
      //gets matches of the selected league
      function match(matchDay) {
        $.ajax({
          headers: { 'X-Auth-Token': 'a65dc5386ad14455a743b88dd047b5df' },
          url: `https://api.football-data.org/v2/competitions/${id}/matches?matchday=${matchDay}`,
          dataType: 'json',
          type: 'GET',
        }).done(function (response) {
          $("#list-home-list ,#list-profile-list").click(function () {
            setTimeout(function () { AOS.refreshHard(); }, 300);
          })
          var $team = $(`#matches-list`);

          for (let j = 0; j < response.matches.length; j++) {
            //formats the date from the response
            var date = new Date(response.matches[j].utcDate);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var format = month + "/" + day;

            if (response.matches[j].status === "FINISHED") {
              finish(response.matches[j])
            }
            else if (response.matches[j].status === "SCHEDULED") {
              scheduled(response.matches[j])
            }

          }
          // appends the finished matches
          function finish(match) {
            var home = match.homeTeam.name;
            var away = match.awayTeam.name;
            var homeScore = match.score.fullTime.homeTeam;
            var awayScore = match.score.fullTime.awayTeam;

            $team.append(`<li class="list-group-item" id="list" data-aos="fade-right" >
              <div class="date">${format}</div>
                <div class = "match"><span class="home">${home}</span><span class="score"> ${homeScore + " - " + awayScore}</span><span class="away">${away}</span></div></li>`);


          }
          //appends the scheduled matches
          function scheduled(match) {
            var home = match.homeTeam.name;
            var away = match.awayTeam.name;

            var hours = date.getHours();
            var min = date.getMinutes();
            //adds zero to the miniutes less than 10 like 10:01 not 10:1
            if (min < 10) {
              min = "0" + min
            }

            var time = hours + ":" + min;
            $team.append(`<li class="list-group-item" data-aos="fade-right"  id="list">
              <div class="date">${format}</div>
                <div class = "match">
                <span class="home">${home}</span><span class="time">${time}</span><span class="away">${away}</span>
                </div>
                </li>`);
          }
        })


      }
    })
  })
})