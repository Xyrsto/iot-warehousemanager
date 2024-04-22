import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        productName:{
            type: String,
            required: [true, "Introduza um nome válido"]
        },
        quantity:{
            type: Number, 
            required: [true, "Introduza uma quantidade"]
        },
        location:{
            type: String,
            required: [true, "Introduza uma localização"]
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

export { Product }; 
