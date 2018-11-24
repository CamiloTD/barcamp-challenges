let DB = require('./db');
let Users, Challenges;
let Sessions = {};
let utils = require('util');
let fs = require('fs');
let [ read, write, readdir, mkdir ] = [utils.promisify(fs.readFile), utils.promisify(fs.writeFile), utils.promisify(fs.readdir), utils.promisify(fs.mkdir)];
let Scripts = require('./scripts');

module.exports = {
    
    login (name) {
        let id = name.toLowerCase().trim().replace(/ /g, '');
        if(Sessions[id]) throw "NAME_ALREADY_TAKEN";

        return Sessions[id] = { id, name };
    },

    users () {
        return Users;
    },

    async challenges () {
        let x = {};

        console.log(Challenges)

        for(let i in Challenges) {
            let { name, desc, owner, winners, points } = Challenges[i];
            files = await readdir('./public/' + toId(name));

            x[i] = { name, desc, owner, winners, files, points };
        }

        return x;
    },

    users () {
        return Users;
    },

    submit (chall, user, code) {
        user = toId(user);
        if(!Challenges[chall]) throw "INVALID_CHALLENGE";
        let challenge = Challenges[chall];

        if(challenge.code !== code) return false;
        if(challenge.winners.indexOf(user) !== -1) return true;
        
        challenge.winners.push(user);
        Users[user] = (Users[user] || 0 ) + challenge.points;

        Scripts.win(challenge, user, code);

        DB.save('challenges', Challenges);
        DB.save('users', Users);

        return true;
    },

    async addChallenge (master_key, { name, desc, code, points }) {
        if(master_key !== "@fz") throw "INVALID_MASTER_KEY";

        let id = toId(name);

        Challenges[id] = { id, name, desc, code, winners: [], points: +points || 1 };

        DB.save("challenges", Challenges);
        try { await mkdir("./public/" + id); } catch(exc) {}

        return Challenges[id];
    }

};

function toId (e) {
    return e.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '');
}

(async () => {
    Users = await DB.load("users");
    Challenges = await DB.load("challenges");
})();