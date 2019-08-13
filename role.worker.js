var util = require("util");

function getEnergy(creep) {
  creep.say("⛏️");
  if (creep.carry.energy < creep.carryCapacity) {
    var sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(util.setEnergySource(creep)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(util.setEnergySource(creep), { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
}

function harvest(creep) {
  creep.say("🔋");
  getEnergy(creep);
  target = Game.getObjectById(creep.memory.taskTargetId);
  result = creep.transfer(target, RESOURCE_ENERGY);
  if (result == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  } else {
    creep.memory.taskComplete = true;
  }
}

function upgrade(creep) {
  creep.say("⏫");
  if (creep.memory.spendEnergy) {
    target = Game.getObjectById(creep.memory.taskTargetId);
    if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
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
  creep.say("🚧");
  target = Game.getObjectById(creep.memory.taskTargetId);
  if (creep.memory.spendEnergy) {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    if (creep.carry.energy == 0 || target == null) {
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
  creep.say("🛠️");
  target = Game.getObjectById(creep.memory.taskTargetId);
  if (creep.memory.spendEnergy) {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    if (creep.carry.energy == 0 || target.hits == target.maxHits) {
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
