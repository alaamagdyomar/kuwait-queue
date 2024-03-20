import Modal from 'react-modal';
import { FC, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { alexandriaFont } from '@/constants/*';
type Props = {
  isOpen: boolean;
  children: JSX.Element;
  closeModal: () => void;
  contentClass?: string;
};

const MainModal: FC<Props> = ({
  isOpen = false,
  children,
  closeModal,
  contentClass = '',
}): JSX.Element => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(isOpen);
  const {
    locale: { isRTL },
  } = useAppSelector((state) => state);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className={`w-full lg:w-2/4 xl:w-1/3 rounded-t-lg border-white h-1/4 ${
          isRTL ? 'right-0' : 'left-0'
        }`}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 100 },
        }}
        shouldFocusAfterRender={false}
      >
        <div
          className={`bg-white text-black rounded-t-lg absolute w-full lg:w-2/4 xl:w-1/3 bottom-0 ${contentClass} ${alexandriaFont} ${
            isRTL ? ' right-0' : 'left-0'
          }`}
        >
          <div className="grid grid-cols-3 pt-2 ms-[5%]">
            <div></div>
            <button onClick={closeModal}>
              <span className="block w-32 h-1 mb-2 bg-zinc-300 rounded-md mx-auto"></span>
            </button>
          </div>
          <div className={`pb-4`}>{children}</div>
        </div>
      </Modal>
    </div>
  );
};

export default MainModal;
