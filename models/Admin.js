const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const AdminSchema=new Schema({
	name:{
		type:String,
		require:true
	},
		email:{
		type:String,
		require:true
	},
		password:{
		type:String,
		require:true
	}
});
module.exports=Admin=mongoose.model('Admin',AdminSchema);