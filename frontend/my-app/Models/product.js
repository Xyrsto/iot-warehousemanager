import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        productId:{
            type: Number, 
        },
        categoryId:{
            type: String,
        }     
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

export { Product }; 
