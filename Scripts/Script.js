/*
Speciale zaken die ik zou willen melden: 

Vijanden en kogels die op het einde van het scherm geraken worden terug op hun startpositie gezet ipv ze te deleten en een nieuwe te spawnen.

*/
var container,
    horton,
    background1,
    background2,
    background3,
    counter,
    amountOfEnemies,
    enemyIDcounter,
    background_speed,
    enemy_speed,
    maxValue,
    keysPressed,
    distancePerIteration,
    enemies,
    divProjectiles,
    projectile_speed,
    fireCounter,
    horton_current_top,
    horton_current_left,
    horton_current_mid_y,
    horton_current_mid_x,
    rocket,
    projectile_exists,
    killcount,
    best,
    hp,
    divEndscreen,
    pEndscreen,
    maxX,
    maxY,
    checkMobile,
    start,
    divEnemies;


$(function () {
    container = $('#container');
    horton = $('#horton');
    background1 = $('#background1');
    background2 = $('#background2');
    background3 = $('#background3');
    hp = 5;
    enemy_speed = 2;
    projectile_speed = 40;
    counter = 0;
    amountOfEnemies = 0;
    enemyIDcounter = 0;
    background_speed = 20;
    maxValue = container.width() - horton.width();
    keysPressed = {};
    distancePerIteration = 3;
    rocket = 0;
    enemies = [];
    fireCounter = 0;
    horton_current_top = 0;
    horton_current_left = 0;
    horton_current_mid_y = 0;
    horton_current_mid_x = 0;
    killcount = 0;
    start = 1;

    maxX = container.clientWidth - horton.clientWidth;
    maxY = container.clientHeight - horton.clientHeight;
    checkMobile = false;
    projectile_exists = false;
    $(divProjectiles = document.getElementById("projectiles"));
    $(divEnemies = document.getElementById("enemies"));
    $(divEndscreen = document.getElementById("divEndscreen"));
    $(pEndscreen = document.getElementById("pEndscreen"));




    // Deze functie is deels van het internet

    function calculateNewValue(oldValue, keyCode1, keyCode2) {
        var newValue = parseInt(oldValue, 10) -
            (keysPressed[keyCode1] ? distancePerIteration : 0) +
            (keysPressed[keyCode2] ? distancePerIteration : 0);
        return newValue < 0 ? 0 : newValue > maxValue ? maxValue : newValue;
    }

    $(window).keydown(function (event) {
        keysPressed[event.which] = true;
    });
    $(window).keyup(function (event) {
        keysPressed[event.which] = false;
    });

    // Deze functie is deels van het internet 
    if (!isMobile()) {
        setInterval(function () {

            horton.css({
                left: function (index, oldValue) {
                    return calculateNewValue(oldValue, 37, 39);
                },
                top: function (index, oldValue) {
                    return calculateNewValue(oldValue, 38, 40);
                }
            });
        }, 1);
    }


    function StartTime() {
        if (start === 1) {
            $(document.body).append($("<div></div>").attr("id", "divStart").text("Are you ready?"));
            setTimeout(function () {
                $("#divStart").text("Go!");
            }, 1000);
            setTimeout(function () {
                $("#divStart").remove();
            }, 2000);
            start = 0;
        }

    }

    function repeat() {


        requestAnimationFrame(repeat);
        background_Down(background1, 0.6);
        background_Down(background2, 0.2);
        background_Down(background3, 0.1);

        if (start === 1) {
            StartTime();
        }

        if (hp === 0) {
            container.remove();
            $(document.body).append($("<div></div>").attr("class", "divEndscreen").text("You lose! You have let too many enemies through"));
            $(document.body).append(background1);
            $(document.body).append(background2);
            $(document.body).append(background3);
            hp--;
        }

        if (killcount === 10) {
            container.remove();
            $(document.body).append($("<div></div>").attr("class", "divEndscreen").text("You won!"));
            $(document.body).append(background1);
            $(document.body).append(background2);
            $(document.body).append(background3);
            killcount++;

        }

        if (fireCounter === 150 && projectile_exists === false) {
            Fire();
        }

        if (amountOfEnemies < 10) {
            if (start === 0) {
                if (counter === 120) {
                    spawnFunction();
                    amountOfEnemies += 1;
                    counter = 0;
                }
            }
        }
        if (projectile_exists === true) {
            projectiles_Up(rocket.el, 1);


        }
        if (enemies.length > 0) {
            for (var i in enemies) {
                enemy_Down(enemies[i].el, 1);

            }
        }

        for (var x in enemies) {
            collisioncheck(rocket.el, enemies[x].el);
            collisioncheckHorton(horton, enemies[x].el);

        }
        fireCounter += 1;
        counter += 1;

    }
    repeat();

    function collisioncheckHorton(horton, enemyEl) {
        var horton_current_top = parseInt($("#horton").css("top"));
        var horton_current_left = parseInt($("#horton").css("left"));
        var horton_current_top_converted = $(window).height() - horton_current_top;
        var enemy_current_left = parseInt($(enemyEl).css("left"));
        var enemy_current_top = parseInt($(enemyEl).css("top"));
        var enemy_height = parseInt($(enemyEl).height());
        var enemy_width = parseInt($(enemyEl).width());

        if ((horton_current_left > enemy_current_left && horton_current_left < (enemy_current_left + enemy_width)) && (horton_current_top > enemy_current_top && horton_current_top < (enemy_current_top + enemy_height))) {
            container.remove();
            $(document.body).append($("<div></div>").attr("class", "divEndscreen").text("You crashed into an enemy!"));
            $(document.body).append(background1);
            $(document.body).append(background2);
            $(document.body).append(background3);
        }

    }

    function collisioncheck(rocketEl, enemyEl) {
        var rocket_current_top = parseInt($(rocketEl).css("top"));
        var rocket_current_left = parseInt($(rocketEl).css("left"));
        var rocket_current_right = parseInt($(rocketEl).css("right"));
        var enemy_current_left = parseInt($(enemyEl).css("left"));
        var enemy_current_bottom = parseInt($(enemyEl).css("bottom"));
        var enemy_height = parseInt($(enemyEl).height());
        var rocket_current_top_converted = $(window).height() - rocket_current_top;
        var enemy_width = parseInt($(enemyEl).width());

        if ((rocket_current_left > enemy_current_left && rocket_current_left < (enemy_current_left + enemy_width)) && (rocket_current_top > enemy_current_bottom && rocket_current_top < (enemy_current_bottom + enemy_height))) {
            killcount += 1;
            $("#score").text(killcount);

            var horton_current_top = parseInt($("#horton").css("top"));
            var horton_current_left = parseInt($("#horton").css("left"));
            var horton_current_mid_y = horton_current_top + ($("#horton").height() / 2);
            var horton_current_mid_x = horton_current_left + ($("#horton").width() / 2.68);
            $("#projectile").css("left", horton_current_mid_x);
            $("#projectile").css("bottom", ($(window).height()) - (horton_current_mid_y));
            enemyEl.remove();

        }

    }

    function Fire() {
        var projectile = {
            bottom: 0,
            left: 0,
            zIndex: 4,
            el: null
        };


        projectile.el = document.createElement("img");
        projectile.el.src = "Images/Bullet.png";
        projectile.el.id = "projectile";
        projectile.el.className = "projectile";

        rocket = projectile;
        $(projectile.el).css("z-index", projectile.zIndex);
        $("#projectile").css("left", (horton_current_mid_x * 5));
        $("#projectile").css("bottom", ($(window).height()) - (horton_current_mid_y));
        divProjectiles.appendChild(projectile.el);

        projectile_exists = true;


    }

    function spawnFunction() {

        var en = {
            top: -10 + "em",
            left: Math.random().toString(10).substr(1, 10) * 50,
            zIndex: 4,
            el: null
        };
        en.el = document.createElement("img");
        en.el.src = "Images/P47.png";
        en.el.id = "enemy" + enemies.length;
        en.el.className = "enemy";
        enemies.push(en);
        $(en.el).css("z-index", en.zIndex);
        $(en.el).css("left", en.left + "em");
        $(en.el).css("top", en.top);
        divEnemies.appendChild(en.el);
        enemy_speed += 0.175;


    }

    function projectiles_Up(el, indiv_speed) {
        var horton_current_top = parseInt($("#horton").css("top"));
        var horton_current_left = parseInt($("#horton").css("left"));
        var horton_current_mid_y = horton_current_top + ($("#horton").height() / 2);

        var horton_current_mid_x = horton_current_left + ($("#horton").width() / 2.68);
        var el_current_bottom = parseInt($("#" + el.id).css("bottom"));
        $("#" + el.id).css("bottom", el_current_bottom + (projectile_speed * indiv_speed));
        if (el_current_bottom > $(window).height()) {
            $("#projectile").css("left", horton_current_mid_x);
            $("#projectile").css("bottom", ($(window).height()) - (horton_current_mid_y));
        }

    }

    function enemy_Down(el, indiv_speed) {

        var el_current_top = parseInt($("#" + el.id).css("top"));
        $("#" + el.id).css("top", el_current_top + (enemy_speed * indiv_speed));
        if (el_current_top > $(window).height()) {
            hp -= 1;
            $("#" + el.id).css("top", "-20em");
            if (enemy_speed <= 18) {
                enemy_speed += 0.5;
            }


        }
    }

    // Hulp gekregen van Rens Coenars.
    //Deze code is herschreven om voor meerdere verticale backgrounds te werken.
    // Ik heb u hier over aangesproken in de les voor raad over plagiaat.
    function background_Down(background, indiv_speed) {

        var background_current_bottom = parseInt(background.css("bottom"));
        var background_height = parseInt(background.css("height"));
        var background_half = background_height / 2;
        if (background_current_bottom < -background_half) {
            background_current_bottom = 0;

        }
        background.css("bottom", background_current_bottom - (background_speed * indiv_speed));

    }

    function isMobile() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }

    //Tilt controls voor mobile
    if (isMobile()) {
        window.addEventListener('deviceorientation', handleOrientation);

        function handleOrientation(event) {
            var x = event.beta;
            var y = event.gamma;


            if (x > 90) {
                x = 90
            };
            if (x < -90) {
                x = -90
            };


            x += 90;
            y += 90;


            $("#horton").css("top", (maxX / 180 - 10) + "px");
            $("#horton").css("left", (maxY / 180 - 10) + "px");
        }

    }








});
