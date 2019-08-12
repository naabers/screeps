var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var spawn = require('spawn');

module.exports.loop = function () {
    //cleanup dead creap memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    var upgraderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
    var harvesterCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
    var builderCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
    var repairerCount = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer').length;
    var construction_sites = + Object.keys(Game.constructionSites).length
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        var renewed = Game.spawns['home'].renewCreep(creep)
        if(renewed == ERR_NOT_ENOUGH_ENERGY) {
            continue;
        }
        if(renewed == ERR_FULL) {
            creep.memory.dying = false;
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            if(construction_sites){
                roleBuilder.run(creep);   
            }
            else {
                creep.suicide()
            }
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
    spawn.spawn(construction_sites, harvesterCount, upgraderCount, builderCount, repairerCount);
}