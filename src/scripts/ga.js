import config from './serverConfig';

export const gtagScript = (trackingobj) => {
  return `(function(i,s,o,g,r,a,m)
         {i['GoogletagmanagerObject']=r;
         i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleTrackingId}','gtag');
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.analytics.googleTrackingId}', ${JSON.stringify(
    trackingobj ? trackingobj : {},
  )});

        if (window.TimesGDPR && TimesGDPR.common.consentModule.gdprCallback){
            TimesGDPR.common.consentModule.gdprCallback(function(dataObj){
                if (!!dataObj.isEUuser){
                    gtag('set', 'anonymizeIp', true);
                }
                gtag('send', 'pageview');
            });
        }`;
};

export const ga4TagScript = (ga4CustomDimension, ga4TrackingId) => {
  let ga4customEvents = '';
  if (ga4CustomDimension) {
    ga4customEvents = `gtag('event', 'custom_page_view', ${JSON.stringify(
      ga4CustomDimension ? ga4CustomDimension : {},
    )});`;
  }
  // const customPara = JSON.stringify(ga4CustomDimension ? ga4CustomDimension : {});
  const customPara = ga4CustomDimension ? ga4CustomDimension : {};
  return `(function(i,s,o,g,r,a,m)
             {i['GoogletagmanagerObject']=r;
             i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.googletagmanager.com/gtag/js?id=${ga4TrackingId}','gtag');
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

               // Define a global function before CDP script loads
          window.tgCdpCustomParams = function (params) {
            //console.log("tgCdpCustomParams called with data:", params);
            
            let customParams = localStorage.getItem('customParams');
            
            try {
              customParams = customParams ? JSON.parse(customParams) : {};
            } catch (e) {
              console.error("Error parsing customParams from localStorage:", e);
              customParams = {};
            }
 
            if (params && typeof params === "object") {
              localStorage.setItem('customParams', JSON.stringify(params));
              customParams = params;
            }
 
            window.cdpCustomParams = {
              cdp_audience: customParams.cdp_audience || "",
              cdp_mrk: customParams.cdp_mrk || "",
              bs_flag: customParams.bs_flag || false,
              cntx_keys: customParams.cntx_keys || [],
              cntx_cmp: customParams.cntx_cmp || [],
              gender: customParams.gender || "",
              age_grp: customParams.age_grp || "",
            };
 
            if (typeof setCustomParams === "function") {
              setCustomParams(window.cdpCustomParams);
            }
          };

            window.getCookieValue = function(cookieName) {
              var cookiesArray = document.cookie.split(';');
              for (var i = 0; i < cookiesArray.length; i++) {
                var cookie = cookiesArray[i].trim();
                // Check if this cookie starts with the name we're looking for
                if (cookie.indexOf(cookieName + '=') === 0) {
                  // Return the value of the cookie
                  return cookie.substring(cookieName.length + 1);
                }
              }
              // If cookie not found, return null
              return null;
            };
            
            var s = document.createElement("script");
            var el = document.getElementsByTagName("script")[0];
            s.src = 'https://watch.sociofyme.com/timescdp/cdtrk.js';
            s.async = true;
            el.parentNode.insertBefore(s, el);
            s.onload = function () {
              var tg_ppid = getCookieValue('tg_ppid');
              var tg_uuid = getCookieValue('tg_uuid');
              if(!!tg_ppid === false) console.log("tg_ppid value on sociowatch initial load = ",tg_ppid);
              if(!!tg_uuid === false) console.log("tg_uuid value on sociowatch initial load = ",tg_uuid);

              gtag('config', '${ga4TrackingId}', { tg_ppid: tg_ppid, tg_uuid: tg_uuid, ...${JSON.stringify(customPara)} });
            }
            s.onerror = function () {
              console.log("Error while loading sociowatch script");
              gtag('config', '${ga4TrackingId}', ${JSON.stringify(customPara)});
            }
           `;
};
