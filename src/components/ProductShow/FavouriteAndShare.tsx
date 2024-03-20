import React, { FC, useEffect, useState } from 'react';
import Favourite from '@/appIcons/favourite.svg';
import ActiveFavourite from '@/appIcons/red_love.svg';
import Share from '@/appIcons/share.svg';
import SigninAddFavModal from '../modals/SigninAddFavModal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isAuthenticated } from '@/redux/slices/customerSlice';
import {
  useAddToWishListMutation,
  useDeleteFromWishListMutation,
} from '@/redux/api/CustomerApi';
import { showToastMessage } from '@/redux/slices/appSettingSlice';

type Props = {
  url: string;
  product_id: string;
  existInWishlist: boolean;
  slug: string
};
const FavouriteAndShare:FC<Props> = ({
  product_id,
  url,
  existInWishlist = false,
  slug
}) => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const [openSigninFavModal, setOpenSigninFavModal] = useState(false);
  const [triggerAddToWishList] = useAddToWishListMutation();
  const [triggerDeleteFromWishList] = useDeleteFromWishListMutation();

  // console.log({ isAuth });

  const handleAddRemvWishlist = async () => {
    if (isAuth) {
      if (existInWishlist) {
        // remove from wishlist
        await triggerDeleteFromWishList({
          url,
          product_id,
        }).then((r: any) => {
          if (r.data && r.data?.status) {
            dispatch(
              showToastMessage({
                content: `deleted_from_wishlist`,
                type: 'success',
              })
            );
          }
        });
      } else {
        // add to wishlist
        await triggerAddToWishList({ url, body: { product_id } }).then(
          (r: any) => {
            if (r.data && r.data?.status) {
              dispatch(
                showToastMessage({
                  content: `saved_in_wish_list`,
                  type: 'success',
                })
              );
            }
          }
        );
      }
    } else {
      // openmodal
      setOpenSigninFavModal(true);
    }
  };
  const handleShare = async () => {
    // try {
    //   if (navigator.share) {
    //     await navigator.share({
    //       title: `${window.location.href}`,
    //       text: `${window.location.href}`,
    //       url: `${window.location.href}`
    //     });
    //   } else {
    //     console.log('Web Share API not supported');
    //   }
    // } catch (error) {
    //   console.error('Sharing Error', error);
    // }
    navigator.clipboard.writeText(`${window.location.href}`)
      .then(() => {
        dispatch(showToastMessage({
          content: 'the_link_has_been_copied_successfully',
          type: 'success'
        }))
      })
      .catch((error) => {
        console.error('Failed to copy URL to clipboard:', error);
      });
  };
  
  return (
    <>
      <SigninAddFavModal
        isOpen={openSigninFavModal}
        onRequestClose={() => setOpenSigninFavModal(false)}
      />
      <div className="flex justify-end items-center space-x-2">
        <button onClick={() => handleAddRemvWishlist()}>
          {existInWishlist ? <ActiveFavourite /> : <Favourite />}
        </button>
        <button onClick={handleShare}>
          <Share />
        </button>
      </div>
    </>
  );
}
export default FavouriteAndShare;
