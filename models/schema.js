let db = require("./model_generic").db;
const schema = {
    return_properties_array: function() {
        let properties = this.get_schema_properties();

        let data_object = {};
        properties.forEach(function(prop) {
            data_object[prop.column_name] = prop.value;
        });

        

        return(data_object);
    },


    create_table: function() {
        let properties = this.get_schema_properties();

        db.prepare("DROP TABLE IF EXISTS files").run();
        let table_create_query = `CREATE TABLE ${this.get_table_name()} (`;
        properties.forEach(function(prop){
            table_create_query += prop.column_name +" "+ prop.db_type + ", ";

        });
        table_create_query = table_create_query.substring(0, table_create_query.length - 2);
        table_create_query += ');';
        
        db.prepare(table_create_query).run();
    },

    drop_table: function() {
        db.prepare(`DROP TABLE IF EXISTS ${this.get_table_name()}`).run();
    },

    write: function() {
        let properties = this.get_schema_properties();


        
        let query = "INSERT OR REPLACE INTO " + this.properties.table_name + "(";
        let values = "";
        properties.forEach(function(p) {
            //do not write id to db if no id exists
            if (p.column_name == 'id' && !p.value) {
                query+=p.column_name + ", ";
                values+=p.value + ", ";
            }else{
                query+=p.column_name + ", ";
                values+="\'"+p.value + "\', ";    
            }
            
        });
        query = query.substring(0, query.length-2) + ") VALUES (";
        query += values + ")";  
        query = query.substring(0, query.length-3);
        query += ");"
        console.log("\tQUERY: "+query);
        let last_id = db.prepare(query).run().lastInsertROWID;
        this.id.value = last_id;
        return last_id;
    },

    // Optional search term allows querying via other columns, such as username. Also allows for string value searching.
    load: function(id, optional_search_term = 'id', optional_search_term_type = 'int') {
        let q = '';

        q = `SELECT * FROM ${this.properties.table_name} WHERE ${optional_search_term}='${id}';`;

        let v = db.prepare(q).get();
        let properties = this.get_schema_properties();
        let object = this;
        if (v){
            properties.forEach(function(p) {
                object[p.column_name].value = v[p.column_name];
            });
        }else{
            properties.forEach(function(p) {
                object[p.column_name].value = null;
            });
        }

    },

    load_multiple: function(value, column) {
        let q = `SELECT * FROM ${this.properties.table_name} WHERE ${column}='${value}'`;
        let v = db.prepare(q).all();
        if (v === undefined) {
            console.log("[schema: load_multiple] Query returned undefined... somehow?");
            return(v);
        } else {
            return(v);
        }

    },

    get_schema_properties: function() {
        let list = [];
        for (var property in this) {
            if (property.exported != false
                && typeof(this[property]) !== "function"
                && property !== "properties") {
                    list.push(this[property]);
                }
            }
            return (list);
        },
    get_table_name: function() {
        return (this.properties.table_name);
    }
}
module.exports = schema;
