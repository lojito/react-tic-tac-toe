import { useCallback, useState } from "react";
import { ImageName } from "../../types";

const IMAGES_PER_CATEGORY = 20;

function useImages(user: ImageName = 0, computer: ImageName = 1) {
  const [images, setImages] = useState({ user, computer });

  const randomImage = useCallback(() => {
    let image = Math.floor(Math.random() * IMAGES_PER_CATEGORY);
    while (image === images.computer || image === images.user) {
      image = Math.floor(Math.random() * IMAGES_PER_CATEGORY);
    }
    return image as ImageName;
  }, [images.computer, images.user]);

  const handleRefreshImage = useCallback(
    (e) => {
      setImages({
        ...images,
        [e.target.id]: randomImage(),
      });
    },
    [images, randomImage]
  );

  if (images.user === images.computer) {
    setImages({
      ...images,
      user: randomImage(),
    });
  }

  return { images, handleRefreshImage };
}

export default useImages;
