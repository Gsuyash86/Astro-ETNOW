export default {
    //Genric scripts to be included in amp pages
    commonAMPScriptsKeys: [
      // 'v0',
      // 'amp-analytics',
      // 'amp-bind',
      // 'amp-sidebar',
      // 'amp-geo',
      // 'amp-ad',
      // 'amp-sticky-ad',
      // 'amp-social-share',
      // 'amp-flying-carpet',
      // 'amp-iframe',
    ],
    //This is amp boilerplate
    ampStyles: [
      {
        attr: {
          'amp-boilerplate': '',
        },
        content:
          'body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}',
      },
    ],
    //This is fallback of amp boilerplate, for browsers, in which script doesn;t work
    ampNoScripts: [
      {
        attr: {},
        content: `<style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style>`,
      },
    ],
    ampEventScript: {
      vars: {
        account: 'UA-64032556-14',
      },
      triggers: {
        trackPageview: {
          on: 'visible',
          request: 'pageview',
          extraUrlParams: {
            cd1: '',
            cd2: '',
            cd3: '',
            cd4: '',
            cd5: '',
          },
        },
        // trackingCustomClicks: {
        //   on: 'click',
        //   selector: '.trackCustomLinks',
        //   request: 'event',
        //   vars: {
        //     account: 'UA-64032556-12',
        //   },
        // },
        trackAnchorClicks: {
          on: 'click',
          selector: 'a[data-vars-event-category]',
          request: 'event',
          vars: {
            // eslint-disable-next-line no-template-curly-in-string
            eventCategory: '${eventCategory}',
            // eslint-disable-next-line no-template-curly-in-string
            eventAction: '${eventAction}',
            // eslint-disable-next-line no-template-curly-in-string
            eventLabel: '${eventLabel}',
            // eslint-disable-next-line no-template-curly-in-string
            eventValue: '${eventValue}',
          },
        },
      },
    },
    ampGA4EventScript: {
      vars: {
        GA4_MEASUREMENT_ID: '',
        GA4_ENDPOINT_HOSTNAME: 'www.google-analytics.com',
        DEFAULT_PAGEVIEW_ENABLED: true,
        GOOGLE_CONSENT_ENABLED: false,
        WEBVITALS_TRACKING: false,
        PERFORMANCE_TIMING_TRACKING: false,
        SEND_DOUBLECLICK_BEACON: false,
      },
      triggers: {
        trackPageview: {
          on: 'visible',
          request: 'page_view',
          vars: {
            event_name: 'page_view',
          },
        },
      },
    },
    // ampGA4DefaultScript: {
    //   vars: {
    //     gtag_id: 'G-FHL4HKFC2Z',
    //     config: {
    //       'G-FHL4HKFC2Z': {
    //         groups: 'default',
    //       },
    //     },
    //   },
    // },
    commonPreconnects: [
      'https://images.etnownews.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://c.amazon-adsystem.com',
      'https://securepubads.g.doubleclick.net',
      'https://ads.pubmatic.com',
      'https://www.timesnownews.com',
    ],
    commonDNSPrefetches: [
      'https://geoapi.tnn.in',
      'https://imasdk.googleapis.com',
      'https://tvid.in',
      'https://static.chartbeat.com',
      'https://mab.chartbeat.com',
      'https://ping.chartbeat.net',
      'https://tpc.googlesyndication.com',
      'https://sb.scorecardresearch.com',
      'https://www.googletagservices.com',
      'https://aax.amazon-adsystem.com',
      'https://onelinksmartscript.appsflyer.com',
      'https://ow.pubmatic.com',
      'https://hbopenbid.pubmatic.com/',
      'https://www18.smartadserver.com',
      'https://ib.adnxs.com',
      'https://acdn.adnxs.com',
      'https://adservice.google.com',
      'https://www.google.com',
      'https://adservice.google.co.in',
      'https://googleads.g.doubleclick.net',
      'https://tags.crwdcntrl.net',
      'https://bcp.crwdcntrl.net',
      'https://ampcid.google.com',
      'https://a.teads.tv',
      'https://fastlane.rubiconproject.com',
    ],
  };
  