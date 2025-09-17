import type { MiddlewareHandler } from "astro";
import getRequestMappings from "./utils/requestLogic";

export const onRequest: MiddlewareHandler = (context, next) => {

  const requestMapping = getRequestMappings({
    headers: context.request.headers,
    query: context.url.searchParams,
    pathname: context.url.pathname, 
  });
  context.locals.isMobileView = requestMapping.isMobileView;
  context.locals.isPrimeUser = requestMapping.isPrimeUser;
  context.locals.isAppView = requestMapping.isAppView;
  context.locals.requestDomain = requestMapping.requestDomain;
  context.locals.akamaiHeader = requestMapping.akamaiHeader;
  context.locals.akamaiHeaderCountryCode = requestMapping.akamaiHeaderCountryCode;
  context.locals.isGlance = requestMapping.isGlance;

  const url = new URL(context.request.url);
  const path = url.pathname;

  const appendCommonParams = (url: string) => {
    const extra = new URLSearchParams({
      isMobileView: String(requestMapping.isMobileView),
      isPrimeUser: String(requestMapping.isPrimeUser),
      isAppView: String(requestMapping.isAppView),
      requestDomain: requestMapping.requestDomain ?? "",
      akamaiHeader: requestMapping.akamaiHeader ?? "",
      akamaiHeaderCountryCode: requestMapping.akamaiHeaderCountryCode ?? "",
      isGlance: String(requestMapping.isGlance),
    });
    return `${url}&${extra.toString()}`;
  };

 
  let match = path.match(/^\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?\/(.+)-(article)-(\d+)$/);
  if (match) {
    const [_, category, sub_category, sub_sub_category, slug, article_type, id] = match;
    let query = `/articleshow?category=${category}&slug=${slug}&article_type=${article_type}&id=${id}`;
    if (sub_category) query += `&sub_category=${sub_category}`;
    if (sub_sub_category) query += `&sub_sub_category=${sub_sub_category}`;
    return context.rewrite(appendCommonParams(query));
  }
  // 🔀 Rewrite for AMP articles
  match = path.match(/^\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?\/(.+)-(article)-(\d+)\/amp$/);
  if (match) {
    const [_, category, sub_category, sub_sub_category, slug, article_type, id] = match;
    let query = `/amp/articleshow?category=${category}&slug=${slug}&article_type=${article_type}&id=${id}`;
    if (sub_category) query += `&sub_category=${sub_category}`;
    if (sub_sub_category) query += `&sub_sub_category=${sub_sub_category}`;
    return context.rewrite(
      appendCommonParams(
        query
      )
    );
  }

  return next();
};