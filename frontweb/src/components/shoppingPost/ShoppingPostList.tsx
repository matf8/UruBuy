import { useKeycloak } from "@react-keycloak/web";
import { IShoppingPost } from "../../../types";
import ShoppingPostItem from "./ShoppingPostItem";
import { Loading } from "../../pages/Loading";

interface IShoppingPostList {
  categoryFilter: string;
  onSaleFilter: boolean;
  nameFilterList: string;
  shoppingPostItems: {
    [key: string]: IShoppingPost;
  };
  showItemHandler: (event: React.SyntheticEvent) => void;
}

const ShoppingPostList = (props: IShoppingPostList) => {
  const filterByCategory = (shoppingPost: IShoppingPost) =>
    shoppingPost.category.name === props.categoryFilter || props.categoryFilter === "";

  const filterByOnSale = (shoppingPost: IShoppingPost) =>
    (shoppingPost.saleDiscount! > 0 && props.onSaleFilter) || !props.onSaleFilter;

  const filterByQuery = (shoppingPost: IShoppingPost) =>
    !shoppingPost.title.toLowerCase().includes(props.nameFilterList);

  const { keycloak } = useKeycloak();

  return (
    <>
      {props.shoppingPostItems && Object.entries(props.shoppingPostItems).length > 0 ? (
        <div className="flex flex-wrap">
          {Object.entries(props.shoppingPostItems).map(
            ([key, shoppingPost]) =>
              filterByQuery(shoppingPost) ||
              (filterByCategory(shoppingPost) &&
              filterByOnSale(shoppingPost) &&
              keycloak.tokenParsed?.email !== shoppingPost.sellerEmail ? (
                <ShoppingPostItem
                  key={key}
                  id={shoppingPost.id}
                  title={shoppingPost.title}
                  description={shoppingPost.description}
                  price={shoppingPost.price}
                  base64Images={shoppingPost.base64Images}
                  saleDiscount={shoppingPost.saleDiscount!}
                  hasDelivery={shoppingPost.hasDelivery}
                  deliveryCost={shoppingPost.deliveryCost!}
                  addresses={shoppingPost.addresses}
                  stock={shoppingPost.stock}
                  averageRating={shoppingPost.averageRating!}
                  isNew={shoppingPost.isNew}
                  weight={shoppingPost.weight!}
                  showItemHandler={props.showItemHandler}
                  onSale={shoppingPost.onSale}
                  category={shoppingPost.category}
                  sellerEmail={shoppingPost.sellerEmail}
                  shoppingPostStatus={shoppingPost.shoppingPostStatus}
                />
              ) : null),
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ShoppingPostList;
