var util = require("util");
var roleWorker = require("role.worker");

// dict of room to list of jobs
var jobs = {};

module.exports = {
  createJobQueue: function() {
    // recreate the entire job list
    jobs = {};

    for (var roomName in Game.rooms) {
      jobs[roomName] = [];
      room = Game.rooms[roomName];
      // Make sure each room gets upgraded as a top priority if it doesnt have one
      var roomUpgraderCount = _.filter(
        Game.creeps,
        creep => creep.memory.taskType == "upgrade" && creep.room.name == roomName
      ).length;
      if (roomUpgraderCount == 0) {
        jobs[roomName].unshift({ taskType: "upgrade", taskTargetId: room.controller.id });
      }

      // Repair what we can
      repairTargets = util.getRepairTargets(room);
      for (var repairTargetIndex in repairTargets) {
        repairTarget = repairTargets[repairTargetIndex];
        if (
          _.filter(Game.creeps, creep => creep.memory.role == "repair" && creep.taskTargetId == repairTarget.id)
            .length == 0
        ) {
          jobs[roomName].unshift({ taskType: "repair", taskTargetId: repairTarget.id });
        }
      }

      // Construct new things
      for (var constructionSiteId in Game.constructionSites) {
        if (
          _.filter(Game.creeps, creep => creep.memory.role == "build" && creep.taskTargetId == constructionSiteId)
            .length == 0
        ) {
          jobs[roomName].unshift({ taskType: "build", taskTargetId: constructionSiteId });
        }
      }

      // Harvest
      harvestTargets = util.getHarvestTargets(room);
      for (var harvestTargetIndex in harvestTargets) {
        harvestTarget = harvestTargets[harvestTargetIndex];
        if (
          _.filter(Game.creeps, creep => creep.memory.role == "harvest" && creep.taskTargetId == harvestTarget.id)
            .length == 0
        ) {
          jobs[roomName].unshift({ taskType: "harvest", taskTargetId: harvestTarget.id });
        }
      }
    }
  },

  assignJob: function(creep) {
    if (jobs[creep.room.name].length) {
      job = jobs[creep.room.name].pop();
      creep.memory.taskType = job.taskType;
      creep.memory.taskTargetId = job.taskTargetId;
    } else {
      creep.memory.taskType = "upgrade";
      creep.memory.taskTargetId = creep.room.controller.id;
    }
  },

  clearJob: function(creep) {
    role = creep.memory.role;
    delete Memory.creeps[creep.name];
    creep.memory.role = role;
  },

  runJob: function(creep) {
    roleWorker.run(creep);
  }
};
