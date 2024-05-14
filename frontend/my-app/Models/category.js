import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
    {
        categoryId:{
            type: String,
        },
        categoryName:{
            type: String, 
        },
        categoryStock:{
            type: Number,
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model('Category', categorySchema);

export { Category }; 
