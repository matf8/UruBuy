import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Category } from "../../../types";
import UrubuyApp from "../../pages/UrubuyApp";
import { Sliders } from "phosphor-react";
interface IShoppingPostSideBar {
  categories: Category[];
  categoryFilter: string;
  setCategoryFilter: Dispatch<SetStateAction<string>>;
  onSaleFilter: boolean;
  setOnSaleFilter: Dispatch<SetStateAction<boolean>>;
}

const ShoppingPostSideBar = (props: IShoppingPostSideBar) => {
  const ref = useRef<HTMLInputElement[]>([]);
  const [showFilters, setShowfilters] = useState(false);

  const onSaleFilterHandler = () => {
    props.setOnSaleFilter(!props.onSaleFilter);
  };

  const categoryFilterHandler = (event: React.SyntheticEvent): void => {
    let target = event.target as HTMLInputElement;
    props.setCategoryFilter(target.id !== props.categoryFilter ? target.id : "");
  };

  return (
    <>
      <UrubuyApp />
      <div className="2xl:container 2xl:mx-auto">
        <div className="px-4 md:py-8 lg:px-10 md:px-6 py-9">
          <div className="flex items-center justify-between mb-4 ">
            <button
              onClick={() => setShowfilters(!showFilters)}
              className=" items-center justify-center hidden px-6 py-4 text-base font-normal leading-4 text-white bg-gray-800 cursor-pointer sm:flex hover:bg-gray-700 focus:ring focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            >
              <Sliders size={24} color="#d9d9d9" weight="thin" />
              Filtros
            </button>
          </div>

          <button
            onClick={() => setShowfilters(!showFilters)}
            className="items-center justify-center block w-full py-2 mt-6 text-base font-normal leading-4 text-white bg-gray-800 rounded-lg cursor-pointer sm:hidden hover:bg-gray-700 focus:ring focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 "
          >
            Filtros
          </button>
        </div>

        <div
          id="filterSection"
          className={
            "relative md:py-2 lg:px-20 md:px-6 py-9 px-4 bg-gray-50 w-full " + (showFilters ? "block" : "hidden")
          }
        >
          <div
            onClick={() => setShowfilters(false)}
            className="absolute top-0 right-0 px-4 cursor-pointer md:py-10 lg:px-20 md:px-6 py-9"
          ></div>

          <hr className="w-full my-8 bg-gray-200 lg:w-6/12 md:my-2" />

          <div>
            <div className="flex space-x-3 ">
              <p className="text-xl font-medium leading-5 text-gray-800 lg:text-2xl lg:leading-6">Categorías</p>
            </div>
            <div className="grid flex-wrap grid-cols-3 mt-8 md:flex md:space-x-6 gap-y-8">
              <div className="flex items-center justify-start md:justify-center md:items-center ">
                {props.categories &&
                  props.categories.map((category) => (
                    <li key={"key" + category.id}>
                      <input
                        className="w-4 h-4 mr-2"
                        type="checkbox"
                        ref={(element: HTMLInputElement) => !ref.current.includes(element) && ref.current.push(element)}
                        onChange={categoryFilterHandler}
                        checked={category.name === props.categoryFilter}
                        id={category.name}
                      />
                      <div className="inline-block ">
                        <div className="flex items-center justify-center space-x-6 ">
                          <label className="mr-2 text-sm font-normal leading-3 text-gray-600 " htmlFor="Large">
                            {category.name}
                          </label>
                        </div>
                      </div>
                    </li>
                  ))}
              </div>
              <div className="flex items-center justify-start md:justify-center md:items-center">
                <input
                  className="w-4 h-4 mr-2"
                  type="checkbox"
                  ref={(element: HTMLInputElement) => !ref.current.includes(element) && ref.current.push(element)}
                  onClick={onSaleFilterHandler}
                  id="onSaleCheckbox"
                />
                <div className="inline-block ">
                  <div className="flex items-center justify-center space-x-6 ">
                    <label htmlFor="onOfferCheckbox" className="mr-2 text-sm font-normal leading-3 text-gray-600 ">
                      En oferta
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="w-full my-8 bg-gray-200 lg:w-6/12 md:my-2" />
        </div>
      </div>
    </>
  );
};

export default ShoppingPostSideBar;
