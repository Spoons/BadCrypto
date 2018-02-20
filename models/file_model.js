let generic_model = require("./model_generic").model_generic;
let db = require("./model_generic").db;

let file_model = function() {
    this.id = null;
    this.name = null;
    this.data = null;


    this.update = function(name, data) {
        this.id = this.id;
        this.name = name;
        this.data = data;

        //this.write.call(this);
        this.write();
    }

    
    this.update_with_id = function(id, name, data) {
        this.id = id;
        update(name, data);
    }
    //Below here is testing code

}
file_model.prototype = generic_model; //Object.create(generic_model);

file_model.prototype.create_migration_table = function() {
        db.prepare("DROP TABLE IF EXISTS files").run();
        db.prepare("CREATE TABLE files (id INTEGER PRIMARY KEY, name TEXT, data BLOB)").run();
        db.prepare("CREATE UNIQUE INDEX files_idx ON files(id)").run();
        console.log("table create");
}

const sanity_test = function() {

    const test_model = new file_model();
    test_model.create_migration_table();

    test_model.update("cats", "0101010101010");
    //test_model.print();

    const new_model = new file_model(); 

    //new_model.load_by_id.call(new_model, 1);
    new_model.load_by_id(1);
    //console.log(new_model);
    new_model.print();
            
}

sanity_test();

//const test_model = new file_model();
//test_model.print();
//console.log(test_model);
