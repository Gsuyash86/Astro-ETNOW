import type { MiddlewareHandler } from "astro";
import getRequestMappings from "./utils/requestLogic";
import { AmpScriptMapping } from "@utils/common";

export const onRequest: MiddlewareHandler = async (context, next) => {

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

  // 🔀 Rewrite for regular articles
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

    // Rewrite to AMP route first
    const rewriteResponse = context.rewrite(appendCommonParams(query));

    // If this is a rewrite, return it (no further processing needed)
    if (rewriteResponse) {
      return rewriteResponse;
    }
  }
  const response = await next();

  const isAmpRoute = path.includes('/amp') || context.url.pathname.includes('/amp');

  if (isAmpRoute) {
    console.log(`🎯 AMP route detected: ${context.url.pathname}`);

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      try {
        const html = await response.text();
        if (html.includes('<style>') || html.includes('<link')) {
          console.log('📄 Processing AMP HTML response...');
          const processedHTML = transformAmpHTML(html);

          // Return new response with processed HTML
          return new Response(processedHTML, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        }
      } catch (error) {
        console.error('❌ Error processing AMP response:', error);
      }
    }
  }

  return response;
};

function transformAmpHTML(html: string): string {
  console.log("🔄 Starting AMP HTML transformation...");

  let processedHTML = html;
  let newCSS = '';
  let existingAmpCSS = '';
  let processedCount = 0;

  // Step 1: Detect required AMP components and generate scripts
  const requiredScripts = detectAmpComponents(html);

  // Step 2: Find and extract existing amp-custom style
  const existingAmpCustomRegex = /<style\s+amp-custom[^>]*>([\s\S]*?)<\/style>/gi;
  let existingAmpMatch;

  while ((existingAmpMatch = existingAmpCustomRegex.exec(html)) !== null) {
    const existingTag = existingAmpMatch[0];
    const existingContent = existingAmpMatch[1].trim();

    console.log(`📋 Found existing amp-custom style: ${existingContent.substring(0, 80)}...`);

    // Remove the existing amp-custom tag
    processedHTML = processedHTML.replace(existingTag, '');
    existingAmpCSS = existingContent;
    processedCount++;
  }

  // Step 3: Extract ALL other inline styles (CSS modules, etc.)
  const styleRegex = /<style(?![^>]*amp-boilerplate)(?![^>]*amp-custom)[^>]*?>([\s\S]*?)<\/style>/gi;
  const stylesToRemove: Array<{ tag: string, content: string }> = [];
  let match;

  while ((match = styleRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const cssContent = match[1].trim();
    if (cssContent) {
      stylesToRemove.push({
        tag: fullTag,
        content: cssContent
      });
    }
  }

  // Step 4: Remove inline styles and collect CSS
  stylesToRemove.forEach((style) => {
    processedHTML = processedHTML.replace(style.tag,'');
    newCSS += `${style.content}`;
  });

  // Step 5: Remove external CSS links
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
  const linksToRemove = html.match(linkRegex) || [];

  linksToRemove.forEach((link) => {
    console.log(`🔗 Removing external CSS link: ${link.substring(0, 80)}...`);
    processedHTML = processedHTML.replace(link,'');
  });

  // Step 6: Inject required AMP scripts
  if (requiredScripts.length > 0) {
    const scriptTags = requiredScripts.join('\n  ');

    if (processedHTML.includes('</head>')) {
      // Insert scripts before closing head, but after existing scripts
      processedHTML = processedHTML.replace('</head>', `${scriptTags}\n</head>`);
      console.log(`📜 Injected ${requiredScripts.length} AMP scripts`);
    }
  }

  // Step 7: Combine existing amp-custom CSS with new CSS
  const combinedCSS = [existingAmpCSS, newCSS].filter(css => css.trim()).join(' ');

  if (combinedCSS.trim()) {
    const finalAmpCustomStyle = `  <style amp-custom>\n${combinedCSS.trim()}\n  </style>`;

    // Insert the combined amp-custom style in head (before the injected scripts)
    if (processedHTML.includes('</head>')) {
      const headClosePos = processedHTML.lastIndexOf('</head>');
      const beforeHead = processedHTML.substring(0, headClosePos);
      const afterHead = processedHTML.substring(headClosePos);

      processedHTML = beforeHead + finalAmpCustomStyle + '\n' + afterHead;

      console.log(`✅ AMP transformation successful:`);
      console.log(`   📦 Processed elements: ${processedCount}`);
      console.log(`   📜 Injected scripts: ${requiredScripts.length}`);
      console.log(`   📋 Existing AMP CSS: ${existingAmpCSS.length} chars`);
      console.log(`   📋 New CSS added: ${newCSS.length} chars`);
      console.log(`   📏 Total combined CSS: ${combinedCSS.length} characters`);

      // AMP CSS size validation
      if (combinedCSS.length > 50000) {
        console.warn(`⚠️ AMP CSS exceeds 50KB limit: ${combinedCSS.length}/50000 characters`);
        console.warn(`   - Existing: ${existingAmpCSS.length} chars`);
        console.warn(`   - Added: ${newCSS.length} chars`);
      }
    } else {
      console.error("❌ Could not find </head> tag to insert combined AMP CSS");
    }
  } else if (processedCount > 0 || requiredScripts.length > 0) {
    console.log("ℹ️ Processed elements or added scripts but no CSS to combine");
  } else {
    console.log("ℹ️ No processing needed for this AMP page");
  }

  return processedHTML;
}

function detectAmpComponents(html: string): string[] {
  const requiredScripts: string[] = [];
  const foundComponents = new Set<string>();
  // Always include v0.js (main AMP script)
  if (!html.includes('https://cdn.ampproject.org/v0.js')) {
    const v0Script = createScriptTag(AmpScriptMapping.v0);
    requiredScripts.push(`  ${v0Script}`);
    console.log(`📦 Added core AMP script: v0.js`);
  }

  // Scan for AMP components in HTML
  Object.keys(AmpScriptMapping).forEach(componentName => {
    if (componentName === 'v0') return; // Already handled above

    // Look for the component tag in HTML
    const componentRegex = new RegExp(`<${componentName}[^>]*>`, 'gi');

    if (componentRegex.test(html)) {
      foundComponents.add(componentName);

      // Check if script is already present
      const scriptConfig = AmpScriptMapping[componentName as keyof typeof AmpScriptMapping];
      if (!html.includes(scriptConfig.src)) {
        const scriptTag = createScriptTag(scriptConfig);
        requiredScripts.push(`  ${scriptTag}`);
        console.log(`📦 Added AMP script for: ${componentName}`);
      } else {
        console.log(`ℹ️ Script already present for: ${componentName}`);
      }
    }
  });

  if (foundComponents.size > 0) {
    console.log(`🎯 Found AMP components: ${Array.from(foundComponents).join(', ')}`);
  } else {
    console.log("ℹ️ No additional AMP components detected");
  }

  return requiredScripts;
}

function createScriptTag(config: any): string {
  let attributes = `src="${config.src}"`;

  if (config.async) {
    attributes += ' async';
  }

  if (config['custom-element']) {
    attributes += ` custom-element="${config['custom-element']}"`;
  }

  return `<script ${attributes}></script>`;
}