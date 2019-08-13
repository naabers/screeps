var celery = require("celery");
var spawn = require("spawn");

module.exports.loop = function() {
  //cleanup dead creap memory
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  //populate the job list
  celery.createJobQueue();

  for (var name in Game.creeps) {
    creep = creeps[name];
    if (creep.memory.taskComplete) {
      celery.clearJob(creep);
      celery.assignJob(creep);
    }
    celery.runJob(creep);
  }
  spawn.spawn();
};
