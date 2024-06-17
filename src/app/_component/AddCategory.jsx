"use client"
import React, { useState, useEffect, useCallback } from "react";
import AddBtn from "./Addbtn";
import RemoveIcon from "@mui/icons-material/Remove";
import AddCategoryBtn from "./AddCategoryBtn";

const AddCategory = (props) => {
  const [types, setTypes] = useState([]);
  const [token, setToken] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("https://jomyeakapi.rok-kh.lol/api/v1/types-with-categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const handleTypeOrCategory = useCallback(
    async (url, method, body) => {
      try {
        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        fetchData();
      } catch (error) {
        console.error("Failed to perform action:", error);
      }
    },
    [token, fetchData]
  );

  const handleAddType = (type) => {
    handleTypeOrCategory("https://jomyeakapi.rok-kh.lol/api/v1/add-type", "POST", { type });
  };

  const handleAddCategory = (type, category) => {
    handleTypeOrCategory("https://jomyeakapi.rok-kh.lol/api/v1/add-type", "POST", { type, category_name: category });
  };

  const handleDeleteCategory = (categoryId) => {
    handleTypeOrCategory(`https://jomyeakapi.rok-kh.lol/api/v1/categories/${categoryId}`, "DELETE");
  };

  const handleDeleteType = (typeId) => {
    handleTypeOrCategory(`https://jomyeakapi.rok-kh.lol/api/v1/types/${typeId}`, "DELETE");
  };

  return (
    <div className="max-w-[1000px] w-full container mx-auto px-4">
      <div className="flex justify-end mb-5">
        <AddBtn btnName="Add Category" btnTitle="Add new category type" btnValue="Category type" handleSubmit={handleAddType} />
      </div>

      <div className="flex flex-wrap -mx-2">
        {types.map((type) => (
          <div key={type.id} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{type.type}</h5>
                <div className="flex space-y-9 space-x-2">
                  <AddCategoryBtn
                    btnName="+"
                    btnTitle="Add new category"
                    btnValue="category"
                    handleSubmit={(category) => handleAddCategory(type.type, category)}
                  />
                  <button className="btn btn-xs" onClick={() => handleDeleteType(type.id)}>
                    <RemoveIcon />
                  </button>
                </div>
              </div>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                  {type.categories.map((category) => (
                    <li key={category.id} className="py-3 sm:py-4">
                      <div className="flex items-center">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{category.name}</p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          <button className="btn btn-xs" onClick={() => handleDeleteCategory(category.id)}>
                            <RemoveIcon />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddCategory;
