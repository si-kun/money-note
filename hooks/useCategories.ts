import { categoriesAtom } from "@/app/atoms/category";
import { getCategory } from "@/app/server-aciton/balance/getCategory";
import { useAtom } from "jotai";

export const useCategories = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);

  const fetchCategories = async () => {
    try {
      if (categories.length > 0) return; // すでにカテゴリーがある場合は取得しない

      const result = await getCategory();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  import { categoriesAtom } from "@/app/atoms/category";
  import { getCategory } from "@/app/server-aciton/balance/getCategory";
  import { useAtom } from "jotai";
  
  export const useCategories = () => {
    const [categories, setCategories] = useAtom(categoriesAtom);
  
    const fetchCategories = async () => {
      try {
        if (categories.length > 0) return; // すでにカテゴリーがある場合は取得しない
  
        const result = await getCategory();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    return { categories, setCategories, fetchCategories };
  };
  
  return { categories, setCategories, fetchCategories };
};
