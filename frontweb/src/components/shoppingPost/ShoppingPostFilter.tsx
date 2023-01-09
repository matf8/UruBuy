import { useState, useEffect } from "react";
import ShoppingPostSideBar from "./ShoppingPostSideBar";
import ShoppingPostList from "./ShoppingPostList";
import ShoppingPost from "./ShoppingPostDetails";
import { getCategories, getShoppingPosts } from "../../services/Requests";
import { Category, IShoppingPost } from "../../../types.d";
import { emptyShoppingPost } from "../../emptyTypes";

interface INameFilter {
  name: string;
}

const ShoppingPostFilter = (props: INameFilter) => {
  const [categoryFilter, setCategoryFilter] = useState(String);
  const [onSaleFilter, setOnSaleFilter] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [showItem, setShowItem] = useState<IShoppingPost>(emptyShoppingPost);
  const [shoppingPostItems, setShoppingPostItems] = useState<{
    [key: string]: IShoppingPost;
  }>({});

  const showItemHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    +target.id > -1 ? setShowItem(shoppingPostItems[target.id]) : setShowItem(emptyShoppingPost);
  };

  useEffect(() => {
    getCategories()
      .then((res) => {
        if (res.status === 200) {
          setCategoryList(res.data as Category[]);
        }
      })
      .catch((er) => {});

    getShoppingPosts().then((res) => {
      let posts = res.data;
      posts.forEach((elem: any) =>
        setShoppingPostItems((shoppingPostItems) => {
          return {
            ...shoppingPostItems,
            [elem.id]: {
              id: elem.id,
              title: elem.title,
              date: elem.date,
              description: elem.description,
              price: elem.price,
              onSale: elem.onSale,
              saleDiscount: elem.saleDiscount,
              category: elem.category,
              hasDelivery: elem.hasDelivery,
              deliveryCost: elem.deliveryCost,
              addresses: elem.addresses,
              stock: elem.stock,
              averageRating: elem.averageRating,
              isNew: elem.isNew,
              weight: elem.weight,
              base64Images: elem.base64Images,
              sellerEmail: elem.sellerEmail,
              shoppingPostStatus: elem.shoppingPostStatus,
            },
          };
        }),
      );
    });
  }, []);

  return (
    <>
      {showItem.title === "" ? (
        <div className="flex flex-col">
          <ShoppingPostSideBar
            categories={categoryList}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onSaleFilter={onSaleFilter}
            setOnSaleFilter={setOnSaleFilter}
          ></ShoppingPostSideBar>
          {
            <ShoppingPostList
              categoryFilter={categoryFilter}
              onSaleFilter={onSaleFilter}
              nameFilterList={props.name}
              shoppingPostItems={shoppingPostItems}
              showItemHandler={showItemHandler}
            ></ShoppingPostList>
          }
        </div>
      ) : (
        <ShoppingPost showItem={showItem} showItemHandler={showItemHandler}></ShoppingPost>
      )}
    </>
  );
};

export default ShoppingPostFilter;
