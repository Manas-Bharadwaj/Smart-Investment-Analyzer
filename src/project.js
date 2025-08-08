const mongoose=require('mongoose');
const connect=mongoose.connect("mongodb+srv://saitejathammali19:3qTh4p9j3aOpRzKc@cluster0.f4mpxua.mongodb.net/SIA?retryWrites=true&w=majority&appName=Cluster0");
connect.then(()=>{
    console.log("Project database connected Successfully");
})
.catch(()=>{
    console.log("Problem in connecting with project database"); 
});

const projectSchema=new mongoose.Schema({
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
      },
    //   projectName: String,
      cashFlows: [Number],
      initialInvestment: Number,
      discountRate: Number,
      npv: Number,
      irr: Number,
      pi: Number,
      createdAt: {
        type: Date,
        default: Date.now
      }
    });
    
    module.exports = mongoose.model('Project', projectSchema);

