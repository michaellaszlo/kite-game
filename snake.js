function rotate(element, radians) {
  radians += Math.PI / 2;
  var s = 'rotate(' + radians + 'rad)';
  $(element).css('-moz-transform', s)
      .css('-webkit-transform', s)
      .css('-o-transform', s)
      .css('-ms-transform', s);
}

function initSnakes(container, numSnakes) {
  var snakeWidth = 22,
      snakeHeight = 22,
      snakeRadius = Math.max(snakeWidth, snakeHeight),
      maxDistance = 1.5 * snakeRadius,
      frameRate = 60,
      damping = 9 * frameRate / 30,
      width = container.width(),
      height = container.height(),
      border = parseInt(container.css('border-left-width'), 10),
      left = container.offset().left + border,
      top = container.offset().top + border,
      snakes = new Array(numSnakes),
      mouse = { x: width / 5, y: height / 5, mouse: true };

  function positionSnake(snake) {
    $(snake.element).css({ left: snake.x - snakeWidth / 2,
        top: snake.y - snakeHeight / 2 });
    rotate(snake.element, snake.angle);
  }

  for (var i = 0; i < numSnakes; ++i) {
    var snake = snakes[i] = {
      id: i,
      x: width * 4 / 5,
      y: height * 4 / 5,
      angle: Math.PI * 3 / 2,
      element: $.parseHTML('<div class="snakeSegment"></div>')
    };
    var color = 'rgb(90, 150, ' + Math.min(200, (120 + 35 * i)) + ')';
    $(snake.element).css('border-bottom-color', color);
    container.append(snake.element);
    positionSnake(snake);
    if (i == 0) {
      follow(snake, mouse);
    } else {
      follow(snake, snakes[i - 1]);
    }
  }

  function follow(snake, leader) {
    function update () {
      var dx = leader.x - snake.x,
          dy = leader.y - snake.y,
          dd = Math.hypot(dx, dy),
          angle = snake.angle = (dy >= 0 ? Math.acos(dx / dd) :
                         2 * Math.PI - Math.acos(dx / dd)),
          direction = (dd < snakeRadius ? -1 : 1);
      if (dd > maxDistance && !leader.mouse) {
        snake.x += Math.cos(angle) * (dd - maxDistance);
        snake.y += Math.sin(angle) * (dd - maxDistance);
        dx = leader.x - snake.x;
        dy = leader.y - snake.y;
        dd = maxDistance;
      }
      if (dd - snakeRadius < 0.5) {
        return;
      }
      snake.x += direction * Math.cos(angle) * dd / damping;
      snake.y += direction * Math.sin(angle) * dd / damping;
      positionSnake(snake);
    }
    update();
    snake.moveInterval = window.setInterval(update, 1000 / frameRate);
  }

  function mouseUpdate(event) {
    event = event || window.event;
    mouse.x = event.pageX - left;
    mouse.y = event.pageY - top;
  }
  container.mousemove(mouseUpdate);
}

function launch() {
  initSnakes($('#snakeShadowDemo'), 5);
}

$(document).ready(launch);

$(window).resize(function () {
  $('.snakeSegment').remove();
  launch();
});
