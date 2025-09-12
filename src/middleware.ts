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

 
  let match = path.match(/^\/([^/]+)\/(.+)-(article)-(\d+)$/);
  if (match) {
    const [_, category, slug, article_type, id] = match;
    return context.rewrite(
      appendCommonParams(
        `/articleshow?category=${category}&slug=${slug}&article_type=${article_type}&id=${id}`
      )
    );
  }

  // 🔀 Rewrite for AMP articles
  match = path.match(/^\/([^/]+)\/(.+)-(article)-(\d+)\/amp$/);
  if (match) {
    const [_, category, slug, article_type, id] = match;
    return context.rewrite(
      appendCommonParams(
        `/amp/articleshow?category=${category}&slug=${slug}&article_type=${article_type}&id=${id}`
      )
    );
  }

  return next();
};