import dayjs from "dayjs";
import CONST from "../constant/index";

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

export const seoDefaultMeta = {
  title:
    'Business News, Finance News, Latest Business News Today Updates | ET Now',
  description:
    'ET Now: Read here all the latest news of Business, Finance, Markets from India and around the world on ET Now.',
  keywords:
    'ET Now, Business News, Latest Business News, Finance News, Markets News, Market News, Business News Today, Finance News Today, India Business News, World Business News',
};

export const NOT_FOUND_META_DETAIL = {
    title: '404 Page Not Found | ET Now',
    description: '404 Page Not Found on ET Now',
    keywords: '404 page, 404 page not found, ET Now',
    robots: 'noindex, nofollow',
    canonical: 'https://www.etnownews.com/404'
};

export const IMG_OG_DEFAULT = `${process.env.PUBLIC_PHOTO_API}/photo/msid-95762555/95762555.jpg`
export const IMG_DEFAULT = `${process.env.PUBLIC_PHOTO_API}/photo/msid-95598012/95598012.jpg`

export const DEFAULT_IMAGE_WIDTH = 200;
export const DEFAULT_IMAGE_HEIGHT = 200;

export const LOGO_MSID = 111599270; 

export const ampGA4 = (ga4Id) => {
  let ampGA4DefaultScript = {
    vars: {
      gtag_id: ga4Id,
      config: {
        [ga4Id]: {
          groups: 'default',
        },
      },
    },
  };
  return ampGA4DefaultScript;
};


export function removeHtmlTags(strParam) {
  let str = typeof strParam !== 'undefined' ? strParam : '';
  str = str?.replace(/&lt;/g, '<');
  str = str?.replace(/&gt;/g, '>');
  str = str?.replace(/&lt;\//g, '>');
  str = str?.replace(/<[^>]*>?/gm, '');
  str = str?.replace(/&amp;/g, '&');
   str = str?.replace(/&nbsp;/g, ' ');
  return str;
}

// adding 'form' breaks format in font declaration css
const tagsToBeCoverted = ['img', 'iframe'];

export function parseCSS(cssText) {
  let parsedCSSText = cssText;
  parsedCSSText = parsedCSSText.replace(/!important/g, '');
  tagsToBeCoverted.forEach((tagName) => {
    parsedCSSText = parsedCSSText.replace(
      new RegExp(` ${tagName}`, 'g'),
      () => ` amp-${tagName}`,
    );
    parsedCSSText = parsedCSSText.replace(
      new RegExp(`}${tagName}`, 'g'),
      () => `}amp-${tagName}`,
    );
  });
  return parsedCSSText;
}

export const PUBMATIC_PROFILE_ID_WEB = '9741';
export const PUBMATIC_PROFILE_ID_MWEB = '9741';

export const PUBMATIC_PROFILE_ID_AMP = '8938';
export const PUBMATIC_PUB_ID_AMP = '156537';

export const AmpScriptMapping = {
  v0: {
    src: 'https://cdn.ampproject.org/v0.js',
    async: true,
  },
  'amp-analytics': {
    src: 'https://cdn.ampproject.org/v0/amp-analytics-0.1.js',
    'custom-element': 'amp-analytics',
    async: true,
  },
  'amp-bind': {
    src: 'https://cdn.ampproject.org/v0/amp-bind-0.1.js',
    'custom-element': 'amp-bind',
    async: true,
  },
  'amp-sidebar': {
    src: 'https://cdn.ampproject.org/v0/amp-sidebar-0.1.js',
    'custom-element': 'amp-sidebar',
    async: true,
  },
  'amp-ad': {
    src: 'https://cdn.ampproject.org/v0/amp-ad-0.1.js',
    'custom-element': 'amp-ad',
    async: true,
  },
  'amp-sticky-ad': {
    src: 'https://cdn.ampproject.org/v0/amp-sticky-ad-1.0.js',
    'custom-element': 'amp-sticky-ad',
    async: true,
  },
  'amp-next-page': {
    src: 'https://cdn.ampproject.org/v0/amp-next-page-1.0.js',
    'custom-element': 'amp-next-page',
    async: true,
  },
  'amp-geo': {
    src: 'https://cdn.ampproject.org/v0/amp-geo-0.1.js',
    'custom-element': 'amp-geo',
    async: true,
  },
  'amp-install-serviceworker': {
    src: 'https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js',
    async: true,
    'custom-element': 'amp-install-serviceworker',
  },
  'amp-twitter': {
    src: 'https://cdn.ampproject.org/v0/amp-twitter-0.1.js',
    async: true,
    'custom-element': 'amp-twitter',
  },
  'amp-facebook-page': {
    src: 'https://cdn.ampproject.org/v0/amp-facebook-page-0.1.js',
    async: true,
    'custom-element': 'amp-facebook-page',
  },
  'amp-social-share': {
    src: 'https://cdn.ampproject.org/v0/amp-social-share-0.1.js',
    'custom-element': 'amp-social-share',
    async: true,
  },
  'amp-youtube': {
    src: 'https://cdn.ampproject.org/v0/amp-youtube-0.1.js',
    'custom-element': 'amp-youtube',
    async: true,
  },
  'amp-flying-carpet': {
    src: 'https://cdn.ampproject.org/v0/amp-fx-flying-carpet-0.1.js',
    'custom-element': 'amp-fx-flying-carpet',
    async: true,
  },
  'amp-instagram': {
    src: 'https://cdn.ampproject.org/v0/amp-instagram-0.1.js',
    async: true,
    'custom-element': 'amp-instagram',
  },
  'amp-selector': {
    src: 'https://cdn.ampproject.org/v0/amp-selector-0.1.js',
    async: true,
    'custom-element': 'amp-selector',
  },
  'amp-carousel': {
    src: 'https://cdn.ampproject.org/v0/amp-carousel-0.1.js',
    async: true,
    'custom-element': 'amp-carousel',
  },
  'amp-web-push': {
    src: 'https://cdn.ampproject.org/v0/amp-web-push-0.1.js',
    async: true,
    'custom-element': 'amp-web-push',
  },
  'amp-audio': {
    src: 'https://cdn.ampproject.org/v0/amp-audio-0.1.js',
    async: true,
    'custom-element': 'amp-audio',
  },
  'amp-iframe': {
    src: 'https://cdn.ampproject.org/v0/amp-iframe-0.1.js',
    async: true,
    'custom-element': 'amp-iframe',
  },
  'amp-web-push': {
    src: 'https://cdn.ampproject.org/v0/amp-web-push-0.1.js',
    async: true,
    'custom-element': 'amp-web-push',
  },
  'amp-consent': {
    src: 'https://cdn.ampproject.org/v0/amp-consent-0.1.js',
    async: true,
    'custom-element': 'amp-consent',
  },
};

export function extractAmpTags(html) {
  const regex = /<(amp-[a-z0-9-]+)/gi;
  const tags = new Set();
  let match;
  while ((match = regex.exec(html)) !== null) {
    tags.add(match[1]);
  }
  return Array.from(tags);
}

export function generateAmpScripts(tags) {
  const required = ["v0", ...tags.filter(tag => AmpScriptMapping[tag])];
  return required
    .map(tag => {
      const config = AmpScriptMapping[tag];
      if (!config) return "";
      const attrs = Object.entries(config)
        .map(([key, value]) => (value === true ? key : `${key}="${value}"`))
        .join(" ");
      return `<script ${attrs}></script>`;
    })
    .join("\n");
}
