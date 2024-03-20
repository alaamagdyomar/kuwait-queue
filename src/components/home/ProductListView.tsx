import { Category } from '@/types/queries';
import { ListOutlined } from '@mui/icons-material';
import React, { FC, useState, useRef, useMemo } from 'react';
import TextTrans from '../TextTrans';
import ScrollSpy from 'react-scrollspy';
import VerProductWidget from '../widgets/product/VerProductWidget';
import MenuModal from '../modals/MenuModal';
import UpcomingOrders from '@/components/home/UpcomingOrders';
import { alexandriaFont, alexandriaFontBold, appLinks } from '@/constants/*';
import { setCategory } from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { map } from 'lodash';

type Props = {
  productCategories: Category[];
  templateType?: string;
};

const ProductListView: FC<Props> = ({
  productCategories,
  templateType = 'BASIC_LIST',
 }): React.ReactNode => {
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const color = useAppSelector(themeColor);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);
  const [firstElement, setFirstElement] = useState<boolean>(true);

  const handleUpdate = async (el: any) => {
    if (el && el.id) {
      setCurrentId(el.id.toString());
    }
  };

  useMemo(() => {
    if (currentRef.current && currentId) {
      if (currentId === productCategories[0].cat_id.toString()) {
        setFirstElement(true);
        currentRef.current.scrollLeft = 0;
      } else {
        setFirstElement(false);
        if (isRTL) {
          currentRef.current.scrollLeft =
            -(currentRef.current.offsetLeft * parseInt(currentId)) - 50;
        } else {
          currentRef.current.scrollLeft =
            currentRef.current.offsetLeft * parseInt(currentId);
        }
      }
    }
  }, [currentId]);

  const handleSearchRedirection = (id: string) => {
    dispatch(setCategory(id));
    router.push(`${appLinks.productSearch.path}`);
  };

  return (
    <div>
      {/* sticky header */}
      <header
        className="flex gap-x-2 bg-white pt-2 pb-4 sticky top-0 z-10 px-4"
        style={{ boxShadow: '0px 4px 8px #00000026' }}
      >
        <div
          className="rounded-full bg-gray-100 w-fit h-fit p-1 cursor-pointer"
          onClick={() => {
            setOpenCategoryModal(true);
          }}
        >
          <ListOutlined />
        </div>
        <div
          ref={currentRef}
          className="flex gap-x-2 overflow-x-scroll  scroll scroll-smooth whitespace-nowrap scrollbar-hide snap-x"
        >
          <ScrollSpy
            currentClassName=""
            onUpdate={handleUpdate}
            // rootEl="div"
            // componentTag="div"
            items={productCategories.map((i) => i.cat_id as string)}
            style={{ display: 'flex' }}
            offset={-200}
          >
            {map(productCategories, (c: Category, i) => (
              <a
                ref={React.createRef()}
                onClick={() => setCurrentId(c.cat_id.toString())}
                id={`category_${c.cat_id}`}
                key={i}
                href={`#${c.cat_id}`}
                className={`${alexandriaFont} xs-mobile-sm-desktop rounded-full px-4 py-2 whitespace-nowrap snap-center ${
                  c.cat_id == currentId ? `text-white active-cat` : ''
                }`}
                style={{
                  backgroundColor:
                    c.cat_id.toString() === currentId ? color : '#F3F2F2',
                  // transition: c.cat_id == currentId ? 'all 0.5s' : '',
                }}
              >
                {c.name}
              </a>
            ))}
          </ScrollSpy>
        </div>
      </header>
      <UpcomingOrders />
      {/* products and cats names */}
      <div>
        {map(productCategories, (category: Category, i) => (
          <section id={`${category.cat_id}`} key={i}>
            <div className="mt-5 px-4">
              {/* cat name */}
              <button
                onClick={() =>
                  handleSearchRedirection(category.cat_id as string)
                }
              >
                <TextTrans
                  className={`base-mobile-lg-desktop mt-5 ${alexandriaFontBold}`}
                  ar={category.name_ar}
                  en={category.name_en}
                />
              </button>

              {/* products */}
              <div>
                {category.items?.map((product, i) => {
                  return (
                    <VerProductWidget
                      key={i}
                      element={product}
                      category_id={category?.cat_id as string}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>

      <MenuModal
        isOpen={openCategoryModal}
        onRequestClose={() => setOpenCategoryModal(false)}
        Categories={productCategories}
      />
    </div>
  );
};
export default ProductListView;
