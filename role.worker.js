var util = require("util");

function getEnergy(creep) {
  if (creep.carry.energy < creep.carryCapacity) {
    var sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(util.setEnergySource(creep)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(util.setEnergySource(creep), { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
}

function harvest(creep) {
  getEnergy(creep);
  result = creep.transfer(creep.memory.taskTarget, RESOURCE_ENERGY);
  if (result == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.memory.taskTarget, { visualizePathStyle: { stroke: "#ffffff" } });
  } else {
    creep.memory.taskComplete = true;
  }
}

function upgrade(creep) {
  if (creep.memory.spendEnergy) {
    if (creep.upgradeController(creep.memory.taskTarget) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.memory.taskTarget);
    }
    if (creep.carry.energy == 0) {
      creep.memory.taskComplete = true;
    }
  } else {
    if (creep.carry.energy < creep.carryCapacity) {
      getEnergy(creep);
    } else {
      creep.memory.spendEnergy = true;
    }
  }
}

function build(creep) {
  if (creep.memory.spendEnergy) {
    if (creep.build(creep.memory.taskTarget) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.memory.taskTarget);
    }
    if (creep.carry.energy == 0 || creep.memory.taskTarget.progress == creep.memory.taskTarget.progressTotal) {
      creep.memory.taskComplete = true;
    }
  } else {
    if (creep.carry.energy < creep.carryCapacity) {
      getEnergy(creep);
    } else {
      creep.memory.spendEnergy = true;
    }
  }
}

function repair(creep) {
  if (creep.memory.spendEnergy) {
    if (creep.repair(creep.memory.taskTarget) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.memory.taskTarget);
    }
    if (creep.carry.energy == 0 || creep.memory.taskTarget.hits == creep.memory.taskTarget.maxHits) {
      creep.memory.taskComplete = true;
    }
  } else {
    if (creep.carry.energy < creep.carryCapacity) {
      getEnergy(creep);
    } else {
      creep.memory.spendEnergy = true;
    }
  }
}

var roleWorker = {
  run: function(creep) {
    switch (creep.memory.taskType) {
      case "harvest":
        harvest(creep);
        break;
      case "build":
        build(creep);
        break;
      case "repair":
        repair(creep);
        break;
      case "upgrade":
        upgrade(creep);
        break;
      default:
        creep.say("Im bored, nothing to do");
    }
  }
};

module.exports = roleWorker;
