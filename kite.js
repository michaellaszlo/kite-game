var Kite = {
  colors: {
    bronze: '#a16a39',
    silver: '#a1aab2',
    gold: '#c1981f',
    platinum: '#99b5c5'
  },
  length: {
    initial: 4,
    bronze: 7,
    silver: 14,
    platinum: 20
  },
  width: 720,
  height: 400,
  segmentRadius: 20,
  minDistance: 40,
  maxDistance: 50,
  narrowAngleDegrees: 35,
  damping: 15,
  update: {
    frequency: 60
  },
  obstacle: {
    radius: 30
  }
};

function Obstacle(kind, velocity) {
  var obstacle = {
    kind: kind,
    velocity: velocity
  };
  var radius = Kite.obstacle.radius;
  obstacle.x = Kite.width + radius;
  obstacle.y = radius + Math.floor(Math.random() * (Kite.width - radius));
  return obstacle;
};

Kite.load = function () {
  var container = document.getElementById('gameContainer'),
      canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      width = Kite.width,
      height = Kite.height,
      segmentRadius = Kite.segmentRadius,
      maxDistance = Kite.maxDistance,
      minDistance = Kite.minDistance,
      damping = Kite.damping,
      narrowAngle = Math.PI * Kite.narrowAngleDegrees / 180,
      wideAngle = Math.PI / 2 - narrowAngle,
      initialTurn = Math.PI - narrowAngle,
      sideTurn = Math.PI - 2 * wideAngle,
      tailTurn = Math.PI - 2 * narrowAngle,
      sideLength = segmentRadius / Math.cos(narrowAngle);
  canvas.width = width;
  canvas.height = height;
  container.appendChild(canvas);

  var segments = new Array(Kite.length.initial);
  for (var i = 0; i < segments.length; ++i) {
    segments[i] = { id: i, x: 9 * width / 10, y: 9 * height / 10, angle: 0 };
  }
  var mouse = { x: width / 10, y: height / 10, mouse: true };

  function follow(segment, leader) {
    var dx = leader.x - segment.x,
        dy = leader.y - segment.y,
        dd = Math.hypot(dx, dy),
        angle = segment.angle = Math.atan2(dy, dx),
        direction = (dd < minDistance ? -1 : 1);
    if (dd > maxDistance && !leader.mouse) {
      segment.x += Math.cos(angle) * (dd - maxDistance);
      segment.y += Math.sin(angle) * (dd - maxDistance);
      dd = maxDistance;
    }
    if (dd - minDistance < 0.5) {
      return;
    }
    segment.x += direction * Math.cos(angle) * dd / damping;
    segment.y += direction * Math.sin(angle) * dd / damping;
  }

  function paint() {
    context.clearRect(0, 0, width, height);
    var color = Kite.colors.bronze;
    if (segments.length >= Kite.length.platinum) {
      color = Kite.colors.platinum;
    } else if (segments.length >= Kite.length.gold) {
      color = Kite.colors.gold;
    } else if (segments.length >= Kite.length.silver) {
      color = Kite.colors.silver;
    }
    context.fillStyle = color;
    for (var i = 0; i < segments.length; ++i) {
      var segment = segments[i],
          angle = segment.angle,
          x = segment.x + Math.cos(angle) * segmentRadius,
          y = segment.y + Math.sin(angle) * segmentRadius;
      context.beginPath();
      context.moveTo(x, y);
      angle += initialTurn;
      x += Math.cos(angle) * sideLength;
      y += Math.sin(angle) * sideLength;
      context.lineTo(x, y);
      angle += sideTurn;
      x += Math.cos(angle) * sideLength;
      y += Math.sin(angle) * sideLength;
      context.lineTo(x, y);
      angle += tailTurn;
      x += Math.cos(angle) * sideLength;
      y += Math.sin(angle) * sideLength;
      context.lineTo(x, y);
      angle += sideTurn;
      x += Math.cos(angle) * sideLength;
      y += Math.sin(angle) * sideLength;
      context.lineTo(x, y);
      context.closePath();
      context.fill();
    }
  }

  function update() {
    follow(segments[0], mouse);
    for (var i = 1; i < segments.length; ++i) {
      follow(segments[i], segments[i - 1]);
    }
    paint();
  }

  canvas.onmousemove = function (event) {
    event = event || window.event;
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  };

  window.setInterval(update, 1000 / Kite.update.frequency);
  var obstacle = Obstacle('plus', 50);
  console.log(JSON.stringify(obstacle));
};

window.onload = Kite.load;
