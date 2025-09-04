var INITIAL_RENDERING = !0,
  pubmaticOn = 0,
  BID_TIMEOUT = 2e3;
// apstagSlots = (pubSlots = []),
// APS_CONFIG = {
//   pubID: '2202a6a5-32cd-4e86-a8b6-48b0a3829463',
//   adServer: 'googletag',
//   bidTimeout: BID_TIMEOUT,
// };
// apstag.init(APS_CONFIG),P
(tndbgmsg = (e, t = '') => {
  console.log(
    '%cTNN',
    'font-weight:bold;color: white; background-color: #2a3e9d;padding: 4px;border-radius:4px;',
    e,
    t,
  );
}),
  (RENDER_ADS = (e) => {
    try {
      if (!e.length) return;
      googletag = window.googletag;
      let t = [],
        a = [],
        g = [];
      e.forEach((e) => {
        try {
          let t = e?.getAttribute('id'),
            o = JSON.parse(e?.getAttribute('data-dimensions')),
            d = e?.getAttribute('data-adunit'),
            i = { slotID: t, sizes: o, slotName: d };
          a.push(i), g.push(t);
        } catch (s) {
          tndbgmsg('ERROR : ', s);
        }
      });
      //  let o = pubmaticOn && window.OWT.registerExternalBidders(g);
      // debugger;
      googletag.cmd.push(() => {
        e.forEach((e, a) => {
          let g = e?.getAttribute('id'),
            o = JSON.parse(e?.getAttribute('data-dimensions')),
            d = e?.getAttribute('data-adunit');
          t[a] = googletag.defineSlot(d, o, g).addService(googletag.pubads());
        }),
          googletag.pubads().setCentering(!0),
          googletag.pubads().enableSingleRequest(),
          googletag.pubads().enableAsyncRendering(),
          googletag.pubads().setRequestNonPersonalizedAds(0),
          googletag.pubads().disableInitialLoad(),
          googletag.enableServices(),
          e.forEach((e) => {
            let t = e?.getAttribute('id');
            t && googletag.display(t);
          }),
          tndbgmsg('HHH a >', a),
          tndbgmsg('HHH t >', t);
        a &&
          t &&
          googletag.cmd.push(function () {
            googletag.pubads().refresh(t);
          });

        // Number of seconds to wait after the slot becomes viewable.
        var SECONDS_TO_WAIT_AFTER_VIEWABILITY = 30;
        googletag.pubads().addEventListener(
          'impressionViewable',
          function (event) {
            var slot = event.slot;
            setTimeout(function () {
              googletag.pubads().refresh([slot]);
            }, SECONDS_TO_WAIT_AFTER_VIEWABILITY * 1000);
          },
          { once: true },
        );

        // a &&
        //   t &&
        //   //pubmaticOn &&
        //   apstag.fetchBids({ slots: a || [], timeout: BID_TIMEOUT }, () => {
        //     //window.OWT.notifyExternalBiddingComplete(o),
        //     googletag.cmd.push(function () {
        //       apstag.setDisplayBids(), googletag.pubads().refresh(t);
        //     });
        //   });
      });
    } catch (d) {
      tndbgmsg('ADS ERROR : ', d);
    }
  });
//var PWT = {},
var googletag = googletag || {};
(googletag.cmd = googletag.cmd || []),
  // (PWT.jsLoaded = () => {
  //   var e = document.querySelectorAll('.dfp');
  //   'undefined' != typeof window &&
  //     e?.length > 0 &&
  //     INITIAL_RENDERING &&
  //     (RENDER_ADS(e || []), (INITIAL_RENDERING = !1));
  // }),
  (() => {
    // var e = document.createElement('script');
    // (e.async = !0),
    //   (e.id = 'dfppwt'),
    //   (e.type = 'text/javascript'),
    //   (e.src = `//ads.pubmatic.com/AdServer/js/pwt/156537/${
    //     document?.documentElement?.clientWidth < 720 ? 3401 : 445
    //   }/pwt.js`);
    // var t = document.getElementsByTagName('script')[0];
    // t.parentNode.insertBefore(e, t);
    var a = document.createElement('script');
    (a.id = 'dfpgpt'),
      (a.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js');
    var t = document.getElementsByTagName('script')[0];
    document.head.appendChild(a);

    a.onload = function () {
      var e = document.querySelectorAll('.dfp');
      'undefined' != typeof window &&
        e?.length > 0 &&
        INITIAL_RENDERING &&
        (RENDER_ADS(e || []), (INITIAL_RENDERING = !1));
    };
  })();
