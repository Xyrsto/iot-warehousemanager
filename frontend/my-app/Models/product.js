import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        productId:{
            type: Number, 
        },
        productName:{
            type: String,
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
