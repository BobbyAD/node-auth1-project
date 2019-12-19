exports.seed = function(knex) {
    return knex("roles").insert([
        { name: "admin" },
        { name: "moderators" },
        { name: "default" }
    ]);
};
