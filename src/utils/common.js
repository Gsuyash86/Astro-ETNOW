import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CONST from "../constant/index";
dayjs.extend(utc);
dayjs.extend(timezone);

export const getCustomDimensionsSSR = (app, navigation, seoData) => {
  let custom_dimension = null;
  let data = null;
  let pageType = "";
  const primeId =
    app &&
    Array.isArray(app?.response?.sections?.article_show?.data) &&
    app?.response?.sections?.article_show?.data?.length
      ? app?.response?.sections?.article_show?.data[0]?.primeid
      : undefined;

  const isPremiumArticle = primeId !== undefined && primeId !== null;
  let articleList = app?.response?.sections?.article_show?.data?.filter(
    (item) => item?.cmstype === "ARTICLE"
  );

  let pageTemplate = "";
  let allowGA4CD = false;
  let authors = "";

  if (articleList != undefined) {
    data = articleList[0];
    pageType = "consumption";
    pageTemplate = "article";
    allowGA4CD = true;
  }
  let returnCustomDimensionData = {};
  if (data != null) {
    let published_date = "";
    let contentType = "",
      showSeriesName = "",
      byLine = "",
      expert = "",
      contentSource = "";
    if (data && data.insertdate) {
      published_date = dayjs(data.insertdate).format("YYYY-MM-DD");
    } else {
      published_date = dayjs(
        data && data?.find((val) => val?.msid == seoData?.msid)?.insertdate
          ? data?.find((val) => val?.msid == seoData?.msid)?.insertdate
          : ""
      ).format("YYYY-MM-DD");
    }
    let activeArticle = "";
    if (data && data.cmstype) {
      activeArticle = data;
    } else {
      activeArticle = data && data?.find((val) => val?.msid == seoData?.msid);
    }
    let createdBy =
      activeArticle && activeArticle?.createdby ? activeArticle?.createdby : "";
    authors =
      activeArticle && activeArticle?.authors
        ? activeArticle?.authors?.[0]?.name
        : "";

    let contentFormat =
      activeArticle && activeArticle?.cmstype
        ? activeArticle?.cmstype?.charAt(0).toUpperCase() +
          activeArticle?.cmstype?.slice(1).toLowerCase()
        : "";
    byLine =
      activeArticle?.authors &&
      activeArticle?.authors?.length > 0 &&
      activeArticle?.authors[0]?.name
        ? activeArticle?.authors[0]?.name
        : "";
    expert = contentSource = activeArticle?.agency?.name
      ? activeArticle?.agency?.name
      : "";
    if (activeArticle && activeArticle.agency) {
      let agencyNames = ["ANI", "PTI", "IANS", "AP", "AFP", "REUTERS"];
      if (agencyNames.includes(activeArticle?.agency?.name)) {
        contentType = "Wire";
      } else {
        contentType = "Original";
      }
    }
    const category = navigation?.category || "";
    const sub_category = navigation?.subCategory || "";
    const sub_sub_category = navigation?.subSubCategory || "";
    const sub_sub_sub_category = navigation?.subSubSubCategory || "";
    custom_dimension = {
      dimension1: seoData.msid,
      dimension2: published_date,
      dimension3: pageType,
      dimension4: category,
      dimension5: sub_category,
      dimension6: contentFormat,
      dimension7: contentSource,
      dimension8: showSeriesName,
      dimension9: contentType,
      dimension10: createdBy,
      dimension11: byLine,
      dimension12: expert,
    };
    let articlePublishDate = seoData?.datePublished
      ? dayjs(seoData.datePublished).format("MMM D, YYYY#") +
        seoData.datePublished
      : "";
    let articleModifiedDate = seoData?.dateModified
      ? dayjs(seoData.dateModified).format("MMM D, YYYY#") +
        seoData.dateModified
      : "";
    let GA4CustomDimensions = {
      page_title: seoData?.title,
      page_template: pageTemplate || "",
      authors: createdBy,
      agency: expert || "",
      section: convertToTitleCase(category),
      subsection: convertToTitleCase(sub_category),
      subsection3: convertToTitleCase(sub_sub_category),
      subsection4: convertToTitleCase(sub_sub_sub_category),
      msid: seoData?.msid || "",
      published_date: articlePublishDate,
      last_update_date: articleModifiedDate,
      keywords: seoData?.keywords || "",
      ...(isPremiumArticle && { premium_article: true }),
    };
    returnCustomDimensionData = { custom_dimension: custom_dimension };
    if (allowGA4CD)
      returnCustomDimensionData = {
        ...returnCustomDimensionData,
        GA4CustomDimensions,
      };
  }
  // Build minimal GA4 custom dimensions for product pages and similar templates
  else if (allowGA4CD) {
    const category = navigation?.category || "";
    const sub_category = navigation?.sub_category || "";
    const sub_sub_category = navigation?.sub_sub_category || "";
    const sub_sub_sub_category = navigation?.sub_sub_sub_category || "";
    let articlePublishDate = seoData?.datePublished
      ? dayjs(seoData.datePublished).format("MMM D, YYYY#") +
        seoData.datePublished
      : "";
    let articleModifiedDate = seoData?.dateModified
      ? dayjs(seoData.dateModified).format("MMM D, YYYY#") +
        seoData.dateModified
      : "";
    const GA4CustomDimensions = {
      page_title: seoData?.title,
      page_template: pageTemplate || "",
      authors: "",
      agency: "",
      section: convertToTitleCase(category),
      subsection: convertToTitleCase(sub_category),
      subsection3: convertToTitleCase(sub_sub_category),
      subsection4: convertToTitleCase(sub_sub_sub_category),
      msid: seoData?.msid || "",
      published_date: articlePublishDate,
      last_update_date: articleModifiedDate,
      keywords: seoData?.keywords || "",
    };
    returnCustomDimensionData = { GA4CustomDimensions };
  }
  return returnCustomDimensionData;
};

export const convertToTitleCase = (inputString) => {
  const words = inputString?.split("-");
  const titleCaseWords = words?.map(
    (word) => word?.charAt(0).toUpperCase() + word?.slice(1)
  );
  return titleCaseWords.join(" ");
};

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

export function generateDataListFromPath(category) {
  const dataList = [
    {
      label: "Business News",
      seopath: import.meta.env.WEBAPP_BASE_URL,
    },
  ];

  if (category) {
    dataList.push({
      label: category,
      seopath: `${import.meta.env.WEBAPP_BASE_URL}/${category}`,
    });
  }
  return dataList;
}
const ALPHA_INDEX = {
  "&lt": "<",
  "&gt": ">",
  "&quot": '"',
  "&apos": "'",
  "&amp": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&amp;": "&",
};

export const decodeHtml = function decodeHtml(str) {
  if (!str || !str.length) {
    return "";
  }
  return str?.replace(/&#?[0-9a-zA-Z]+;?/g, (s) => {
    if (s.charAt(1) === "#") {
      const code =
        s.charAt(2).toLowerCase() === "x"
          ? parseInt(s.substr(3), 16)
          : parseInt(s.substr(2), 10);

      if (Number.isNaN(code) || code < -32768 || code > 65535) {
        return "";
      }
      return String.fromCharCode(code);
    }
    return ALPHA_INDEX[s] || s;
  });
};
export const getSlug = (storyType) => CONST?.ARTICLESLUGMAP?.[storyType];

export const NAVIGATION_GROUPS = [
  {
    section: "News & Current Affairs",
    icon: "newsIcon",
    titles: ["Latest", "News", "Delhi Elections 2025", "Education News"],
  },
  {
    section: "Business & Finance",
    icon: "businessIcon",
    titles: [
      "Corporates",
      "Money",
      "Brand Stories",
      "Infrastructure",
      "Real Estate",
    ],
  },
  {
    section: "Market & Investment",
    icon: "marketIcon",
    titles: [
      "Market Overview",
      "Market News",
      "Indices",
      "Stocks",
      "IPO",
      "Mutual Funds",
      "Economy",
      "Crypto Now",
      "Crypto Insights",
      "Budget 2025",
      "Income Tax",
    ],
  },
  {
    section: "Lifestyle & Culture",
    icon: "lifestyleIcon",
    titles: [
      "ET Now Luxe",
      "Entertainment",
      "Web Stories",
      "Photos",
      "Videos",
      "Shows",
    ],
  },
  {
    section: "Tech & Innovation",
    icon: "techIcon",
    titles: ["Technology", "Auto"],
  },
  {
    section: "Career & Inspiration",
    icon: "careerIcon",
    titles: ["Success Stories", "Jobs"],
  },
  {
    section: "Sports & Leisure",
    icon: "sportsIcon",
    titles: ["Sports"],
  },
];

export const displayTime = (timestamp) => {
  let time = "";

  // convert ms → total seconds
  const totalSeconds = Math.floor(timestamp / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  time = `${hours > 0 ? (hours < 10 ? "0" + hours : hours) + ":" : ""}${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;

  return time;
};

export const getUrl = (item) => {
  return (
    item?.overridelink ||
    `${import.meta.env.WEBAPP_BASE_URL}/${item?.seopath}-${getSlug(
      item?.cmstype
    )}-${item?.msid}`
  );
};

export const formatDate = (date, format) => {
  return dayjs.tz(Number(date), "Asia/Calcutta").format(format);
};
