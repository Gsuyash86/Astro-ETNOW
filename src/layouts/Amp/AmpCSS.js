// exporting this tag css separately as this need not be pasred like converting img tag to amp-img
export const ampTagCSS = ``;

const ampCSSObj = {
  commonCSS: `.amp_dfp{text-align:center;position:relative;z-index:2} body .maincontainer + .amp-sidebar-mask{z-index:0}
  #native-share .amp-social-share-system{background: url("/assets/icons/svg/Share-floating-button.svg"); background-repeat: no-repeat; min-width: 40px;min-height: 40px;border-radius: 50%;background-size: 40px;outline:0;} #nativesmallicon #native-share .amp-social-share-system {background-color:transparent; box-shadow:none; background:url("/assets/images/share-icon-new.png"); background-repeat: no-repeat; background-size:24px auto; min-width:24px; min-height:24px; position:relative; top:0;}
  amp-sidebar#ampHamburger{width: 100%;max-width:100%;min-width:100%;background: white;}
  #ampHamburger div div > ul li:first-child { top:89px; zIndex: 1; }
.amp-sidebar-mask{z-index : 0 !important;} .box-gradient{height:210px;}
.box-gradient{height:210px;} 
.amp-flying-carpet-text-border{background-color:black;color:white;text-align:center;} [class*='ListCard-card-item-full--column-1'] span [class*='ListCard-card-item__image'] [amp-img-id*='undefinedimgid'] {object-fit : cover}
#ampbody #amp-next header {position:fixed;width:100%;left:0;} 
.adv-blocker {height: 250px;border:1px solid var(--adsBgColor); max-width: 300px; background-color: #fff; margin-left : auto; margin-right: auto; overflow: hidden;position: relative;display:flex;align-items:center;justify-content:center; margin-top: 10px;margin-bottom: 15px;} .adv-blocker:before{content: 'ADVERTISEMENT';font-size: 12px;line-height: 1;color: #000;width: 100%;text-align: center;position: absolute;top: 50%;margin-top: -7px;z-index: 1;left: 0;} header+[class*='atfAd'] .adv-blocker, header+[class*='mastHeadAd']+[class*='atfAd'] .adv-blocker {margin-top:0; margin-bottom:0;}
.amp-next-page-separator {width: 100%; display: flex; font-size: 12px; text-transform: capitalize; font-weight: 500; margin: 10px auto; position: relative; border-bottom:0; margin-bottom:15px; padding:15px 15px 0 15px;} .amp-next-page-separator::after, .amp-next-page-separator::before {content:''; align-self: center; position:absolute;} .amp-next-page-separator::before {width:100%; top:0; left:0; right:0; background-color: #d4d4d4; height:1px;} .amp-next-page-separator::after{left: 15px; top: 0; width: 0; height: 0; border-left: 13px solid transparent; border-right: 13px solid transparent; border-top: 10px solid #d4d4d4;}  
#ampbody #amp-next header {position:fixed;width:100%;left:0;} 
head + body > .maincontainer > #app > header {height:81px; margin-bottom:5px;}
 
 [id*='topicTabSelector'] [class*='hideheading'] {margin: 0 17px;}
 [id*='topicTabSelector'] {position : relative;}
 [id*='topicTabSelector']::before{content:'';position:absolute;left:0;top:-12px;background:#f2f2f2;width:100%;height:37px;}

 amp-selector[role=tablist].tabs-with-flex {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding: 0 15px;
  }
  [id*='topicTabSelector'] amp-selector[role=tablist].tabs-with-flex [class*='hideheading'] {margin-left: 0; margin-right: 0;}
  amp-selector[role=tablist].tabs-with-flex [role=tab] {
    position: relative;
    color: #717171;
    font-size: 1.125rem;
    margin-bottom:28px;
  }
  [id*='topicTabSelector'] amp-selector[role=tablist].tabs-with-flex [role=tab] {
    font-size:0.875rem
  }
  amp-selector[role=tablist].tabs-with-flex [role=tab][selected] {
    font-weight: bold;
    color: var(--textColor);
    outline:none;
  }
  amp-selector[role=tablist].tabs-with-flex [role=tabpanel] {
      display: none;
      width: 100%;
      order: 1; /* must be greater than the order of the tab buttons to flex to the next line */
      /* custom styling, feel free to change */
  }
  amp-selector[role=tablist].tabs-with-flex [role=tab][selected] + [role=tabpanel] {
      display: block;
  }

  amp-selector[role=tablist].tabs-with-selector [role=tab][selected]  {
      outline: none;
  }

  amp-selector[role=tablist].tabs-with-selector {
      display: flex;
  }
  amp-selector.tabpanels [role=tabpanel] {
    display: none;
    /* custom styling, feel free to change */
  }
  amp-selector.tabpanels [role=tabpanel][selected] {
    outline: none;
    display: block;
  }
  amp-selector[role=tablist] [role=tab][selected] + [role=tabpanel] {
    display: block;
    font-size:1rem;
    line-height:1.63;
    font-weight:500;
  }
 
 [class*=amp-podcast-wrap]{background : #000} [class*="podcast-image"]{height: 225px;}
[class*="h-50"]{height: 100px;justify-content: flex-start;} [id*="ampbody"] [class*="btnav-height"] {height : 48px; position: fixed;}
 [class*="global-liveTV-widget"] 
 [class*="social-wrapper"]{margin-top: -5px} [class*="liveTvPlayerAmp"] {overflow:hidden} [class*="poll-clear-bth"] [class*="PollBlogStyles-pollBg-grey"]{min-height: 100px;}

amp-iframe[class*="pwtscriptiframe"]{
  min-height:auto !important;
  visibility: hidden;
  position: absolute;
}
  [class*=mastHeadAd] [class*=amp_dfp] amp-ad {
    flex:1;
  }
 `,
};

const templateCSSObj = {
  astrology: ``,
};

const getAMPMainCSS = () => {
  let cssText = '';
  const ampCSSKeys = Object.keys(ampCSSObj);
  ampCSSKeys.forEach((key) => {
    cssText += ampCSSObj[key];
  });
  return cssText;
};

const getAMPTemplateCSS = (routeName) => {
  return templateCSSObj[routeName] || '';
};

export const getAMPGlobalCSS = (routeName) => {
  let pathValue = '';
  let cssText = getAMPMainCSS();

  if (
    (routeName.includes('/rashifal') && !routeName.includes('-article-')) ||
    routeName.includes('/topic') ||
    routeName === '/amp'
  ) {
    pathValue = 'astrology';
  } else if (
    routeName.includes('/cricket') &&
    !routeName.includes('-article-')
  ) {
    pathValue = 'cricket';
  } else if (routeName.includes('-article-')) {
    pathValue = 'webPushStyle';
  }
  cssText += getAMPTemplateCSS(pathValue);

  return cssText;
};
