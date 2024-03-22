const Admin = require("../models/adminModel");
const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");



// function for string comparison
function similarity(s1, s2) {
     let longer = s1;
     let shorter = s2;
     if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
     }
     let longerLength = longer.length;
     if (longerLength === 0) {
          return 1.0;
     }
     return (
          (longerLength - editDistance(longer, shorter)) /
          parseFloat(longerLength)
     );
}

function editDistance(s1, s2) {
     s1 = s1.toLowerCase();
     s2 = s2.toLowerCase();

     let costs = new Array();
     for (let i = 0; i <= s1.length; i++) {
          let lastValue = i;
          for (let j = 0; j <= s2.length; j++) {
               if (i == 0) costs[j] = j;
               else {
                    if (j > 0) {
                         let newValue = costs[j - 1];
                         if (s1.charAt(i - 1) != s2.charAt(j - 1))
                              newValue =
                                   Math.min(
                                        Math.min(newValue, lastValue),
                                        costs[j]
                                   ) + 1;
                         costs[j - 1] = lastValue;
                         lastValue = newValue;
                    }
               }
          }
          if (i > 0) costs[s2.length] = lastValue;
     }
     return costs[s2.length];
}



//render new category page
const newCategory = async (req, res, next) => {
     res.render("admin/newCategory");
};


//create new category
const createCategory = asyncHandler(async (req, res, next) => {
     let categoryName = req.body.cat_name;
     let largestMatch = 0;
     categoryName = categoryName.replace(/\s/g, "").toLowerCase();
     const categories = await Category.find({});
     categories.forEach((category) => {
          const perc =
               Math.round(
                    similarity(
                         category.cat_name.replace(/\s/g, ""),
                         categoryName
                    ) * 10000
               ) / 100;
          if (perc > largestMatch) {
               largestMatch = perc;
          }
     });
     if (largestMatch > 85) {
          const error = new Error("A similar category already exists");
          error.statusCode = 409;
          error.status = "fail";
          throw error;
     } else {
          await Category.create(req.body);
          res.status(200).json({ status: "success" });
     }
});


//render all categories
const getCategories = asyncHandler(async (req, res) => {
     let categories = await Category.find({ is_delete: false });
     categories = categories.map((category) => {
          return {
               ...category.toObject(),
               createdAt: new Date(category.createdAt).toLocaleDateString(),
          };
     });
     res.render("admin/category", { categories });
});


//render edit category page
const editCategory = asyncHandler(async (req, res) => {
     const category = await Category.findById(req.params.id);
     if (category) {
          res.render("admin/editCategory", { admin: true, category });
     } else {
          throw new Error();
     }
});


// save edit category
const updateCategory = asyncHandler(async (req, res) => {
     const categoryId = req.params.id;
     const updateData = req.body;
     delete updateData.id;
     let categoryName = req.body.cat_name;
     let largestMatch = 0;
     categoryName = categoryName.replace(/\s/g, "").toLowerCase();
     const categories = await Category.find({ _id: { $nin: [categoryId] } });
     categories.forEach((category) => {
          const perc =
               Math.round(
                    similarity(
                         category.cat_name.replace(/\s/g, ""),
                         categoryName
                    ) * 10000
               ) / 100;
          if (perc > largestMatch) {
               largestMatch = perc;
          }
     });
     if (largestMatch > 85) {
          const error = new Error("A similar category already exists");
          error.statusCode = 409;
          error.status = "fail";
          throw error;
     } else {
          const updatedCategory = await Category.findByIdAndUpdate(
               categoryId,
               updateData,
               { new: true } // Return the updated category
          );
          if (updatedCategory) {
               res.json({ status: "success" });
          } else {
               throw new Error();
          }
     }
});


//delete category
const deleteCategory = asyncHandler(async (req, res) => {
     const categoryId = req.params.id;
     const updatedCategory = await Category.findByIdAndUpdate(
          categoryId,
          { is_delete: true },
          { new: true } // Return the updated category
     );
     if (updatedCategory) {
          res.json({ status: "success" });
     } else {
          throw new Error();
     }
});

module.exports = {
     getCategories,
     createCategory,
     editCategory,
     updateCategory,
     newCategory,
     deleteCategory,
};
