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

  return next();
};