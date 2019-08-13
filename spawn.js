function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(50000));
}

function spawnCreep() {
  workerCount = Object.keys(Game.creeps).length;
  if (workerCount < 10) {
    Game.spawns["home"].spawnCreep([WORK, CARRY, MOVE], "Worker" + getRandomInt(), {
      memory: { role: "worker", taskComplete: true }
    });
  }
}

function spawnConstructionSite(constructionSites) {
  for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];
    if (room.controller.level == 2 && constructionSites < 5) {
      var x = Game.spawns["home"].pos.x + 1 + constructionSites;
      var y = Game.spawns["home"].pos.y + 1 + constructionSites;
      room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
    } else if (room.controller.level == 3 && constructionSites < 10) {
      var x = Game.spawns["home"].pos.x + constructionSites;
      var y = Game.spawns["home"].pos.y + 1 + constructionSites;
      room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
    }

    if (room.controller.level > 1 && !room.memory.hasRoads) {
      var sources = Game.spawns["home"].room.find(FIND_SOURCES);
      for (var source in sources) {
        createRoadsBetween(room, Game.spawns["home"].room.controller.pos, sources[source].pos);
        createRoadsBetween(room, Game.spawns["home"].pos, sources[source].pos);
        room.memory.hasRoads = true;
      }
    }
  }
}

function createRoadsBetween(room, apos, bpos) {
  paths = PathFinder.search(apos, bpos).path;
  for (path in paths) {
    room.createConstructionSite(paths[path].x, paths[path].y, STRUCTURE_ROAD);
  }
}

module.exports = {
  spawn: function() {
    spawnCreep();
    var constructionSites = Object.keys(Game.constructionSites).length;
    spawnConstructionSite(constructionSites);
  }
};
