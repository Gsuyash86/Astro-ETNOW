export function getNewImageUrl({
  msid,
  imgWidth,
  imgHeight,
  is1x1Img = false,
  isArticleBanner = false,
  updatedAt,
}) {
  const imgurl = `https://images.etnownews.com/${
    !isArticleBanner ? "thumb" : "photo"
  }/msid-${msid}${updatedAt ? `,updatedat-${updatedAt}` : ""}${
    imgWidth ? `,width-${imgWidth}` : ""
  }${imgHeight ? `,height-${imgHeight}` : ""},${
    !is1x1Img && "resizemode-75"
  }/${msid}.jpg`;
  return imgurl;
}
