const key_model = require('../models/key_model').key_model,
      file_controller = require('./user-controller').file_controller,
      keys_controller = require('./user-controller').keys_controller,
      openPGP = require('openpgp');

let key_controller = {
    get_all_keys: function(req,res){
        const user_id = req.user.schema.id.value,
              key_model_instance = new key_model();

        const all_keys = key_model_instance.schema.load_multiple(user_id, 'user');
        res.render('users/keys/all_keys', {KEYS: all_keys});
    },

    get_all_keys_by_user_id: function(user_id){
        const key_model_instance = new key_model();

        const all_keys = key_model_instance.schema.load_multiple(user_id, 'user');
        return all_keys;
    },

    get_single_key: function(req,res){
        const user_id = req.user.schema.id.value,
              key_model_instance = new key_model();

        if (req.params.pref_key != "none"){
            key_model_instance.schema.load(req.params.pref_key);

            key_model_instance.to_string();
        }else{
            key_model_instance.schema.load(user_id, 'user');
        }

        let jsonObj = {
          public_key: key_model_instance.schema.public_key.value || null,
          // private_key: key_model_instance.schema.private_key || "",
          key_id: key_model_instance.schema.id.value || null
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(jsonObj));
    },

    store_keys: function(req,res){
        const user_id = req.user.schema.id.value,
              key_name = req.body.key_name;

        const key_model_instance = new key_model();
        key_model_instance.set(null, key_name, req.body.private_key, req.body.public_key, -1, user_id);

        const keyObj = {
          key_id: key_model_instance.schema.id.value
        }
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(keyObj));

    },

    update_file_key: (req,res) => {
      //        const key_pair = req.body.link_data.key_pair,
//              file_data = req.body.link_data.file_data,
//              key_model_instance = new key_model();
//
//        const key_model_instance = new key_model(),
//              file_controller_instance = new file_controller();
//
//        key_model_instance.schema.load(key_pair.private_key, 'private_key');
//        const file_id = file_controller_instance.get_file_id_by_data(file_data);
//
//
    },

    get_key_by_id: (req,res) => {
      let key_model_instance = new key_model();
      key_model_instance.schema.load(req.params.id);

      let key_data = {
        key_id: key_model_instance.schema.id.value,
        private_key: key_model_instance.schema.private_key.value
      }

      if (req.user.schema.id.value != key_model_instance.schema.user.value){
        req.flash('error', "You do not have access to view this key.");
        res.redirect('/');
      }

      res.send(JSON.stringify(key_data));
    }
};

module.exports.key_controller = key_controller;
