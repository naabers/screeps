var util = require("util");
var roleWorker = require("role.worker");

// dict of room to list of jobs
var jobs = {};

module.exports = {
  createJobQueue: function() {
    // recreate the entire job list
    jobs = {};

    for (var roomName in Game.rooms) {
      room = Game.rooms[roomName];
      // Make sure each room gets upgraded as a top priority if it doesnt have one
      var roomUpgraderCount = _.filter(Game.creeps, creep => creep.memory.role == "upgrade" && creep.room.name == room)
        .length;
      if (roomUpgraderCount == 0) {
        jobs[roomName].unshift({ taskType: "upgrade", taskTarget: room.controller });
      }

      // Repair what we can
      repairTargets = util.getRepairTargets(room);
      for (var repairTarget in repairTargets) {
        if (
          _.filter(Game.creeps, creep => creep.memory.role == "repair" && creep.taskTarget == repairTarget).length == 0
        ) {
          jobs[roomName].unshift({ taskType: "repair", taskTarget: repairTarget });
        }
      }

      // Construct new things
      for (var constructionSiteId in Game.constructionSites) {
        if (
          _.filter(
            Game.creeps,
            creep => creep.memory.role == "build" && creep.taskTarget == Game.constructionSites[constructionSiteId]
          ).length == 0
        ) {
          jobs[roomName].unshift({ taskType: "build", taskTarget: Game.constructionSites[constructionSiteId] });
        }
      }

      // Harvest
      harvestTargets = util.getHarvestTargets(room);
      for (var harvestTarget in harvestTargets) {
        if (
          _.filter(Game.creeps, creep => creep.memory.role == "harvest" && creep.taskTarget == harvestTarget).length ==
          0
        ) {
          jobs[roomName].unshift({ taskType: "harvest", taskTarget: harvestTarget });
        }
      }
    }
  },

  assignJob: function(creep) {
    if (jobs[creep.room.name].length) {
      job = jobs[creep.room.name].pop();
      creep.memory.taskType = job.taskType;
      creep.memory.taskTarget = job.taskTarget;
    } else {
      creep.memory.taskType = "upgrade";
      creep.memory.taskTarget = creep.room.conroller;
    }
  },

  clearJob: function(creep) {
    creep.memory.taskComplete = false;
    creep.memory.taskType = undefined;
    creep.memory.taskTarget = undefined;
  },

  runJob: function(creep) {
    roleWorker.run();
  }
};
