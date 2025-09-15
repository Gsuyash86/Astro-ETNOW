// onetap.js

import CONST from "@constant/index";

const SSO_AUTH = CONST.SSO_AUTH;
  
let currentUserState = {};
let userInfo = { showIcon: true };
  
// ----------------- Script Loader -----------------
  export function checkScriptLoad() {
    const existingScript = document.getElementById("jssoCrossWalk");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://jssocdnstg.indiatimes.com/crosswalk/jsso_crosswalk_legacy_0.6.8.min.js";
      script.id = "jssoCrossWalk";
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        getCurrentUser();
      };
    } else {
      getCurrentUser();
    }
  }
  
  // ----------------- User Functions -----------------
  function getCurrentUser() {
    const jsso = new JssoCrosswalk(
      SSO_AUTH.CHANNEL,
      SSO_AUTH.PLATFORM,
      SSO_AUTH.SSO_BASEURL,
      SSO_AUTH.SOCIAL_APP_BASEURL
    );
  
    jsso.getValidLoggedInUser((res) => {
      if (res.status === "SUCCESS") {
        updateCurrentUserState(res.data);
        getUserDetails(jsso);
      } else {
        updateCurrentUserState({});
        userInfo.showIcon = true;
        loadGoogleScript();
      }
    });
  }
  
  function makeOneTapCall(userData) {
    const pathname = window.location.pathname;
    let categoryStr = pathname === "" ? "home" : pathname.split("/")[1] || "home";
    let regex = /-/g;
  
    const userObj = {
      ...userData,
      newsletter_category: categoryStr.replace(regex, ""),
      identifier: "one tap"
    };
    console.log("Submitting one-tap user data:", userObj);
    // TODO: call API to submit user data
  }
  
  export function onOneTapSignedIn(response) {
    const jsso = new JssoCrosswalk(
      SSO_AUTH.CHANNEL,
      SSO_AUTH.PLATFORM,
      SSO_AUTH.SSO_BASEURL,
      SSO_AUTH.SOCIAL_APP_BASEURL
    );
  
    const credential = response && response.credential;
    const data = decodeJwtResponse(credential);
  
    jsso.gpOneTapLogin(credential, (oneTapRes) => {
      updateCurrentUserState(oneTapRes.data);
      getUserDetails(jsso);
      makeOneTapCall(data);
    });
  }
  
  function redirectionAfterOneTapLogin() {
    const pathname = window.location.pathname;
  
    const blockedPaths = [
      "/signup/email",
      "/signup/phone",
      "/login/phone",
      "/login/email",
      "/otp/verify",
      "/otp",
      "/forgot-password",
      "/forgot-password/new"
    ];
  
    if (blockedPaths.includes(pathname)) {
      let url = localStorage.getItem("redirectSection")
        ? localStorage.getItem("redirectSection").replace("?rec=1", "")
        : "/";
      localStorage.removeItem("redirectSection");
      history.pushState({}, "", url);
    } else {
      window.location.href = `${getDomain()}${window.location.pathname}`;
    }
  }
  
  function isOneTapPopRequired() {
    const pathname = window.location.pathname;
    const blockedPaths = [
      "/signup/email",
      "/signup/phone",
      "/login/email",
      "/otp/verify",
      "/otp",
      "/forgot-password",
      "/forgot-password/new",
      "/presite"
    ];
    return blockedPaths.includes(pathname) ? false : true;
  }
  
  function initializeGSI() {
    if (isOneTapPopRequired()) {
      google.accounts.id.initialize({
        client_id: SSO_AUTH.SOCIAL_APP.GOOGLE.G_CLIENT_ID,
        callback: (response) => response && onOneTapSignedIn(response),
        cancel_on_tap_outside: false
      });
      google.accounts.id.prompt((notification) => {
        console.log(notification);
      });
    }
  }
  
  function loadGoogleScript() {
    document.addEventListener(
      "scroll",
      () => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.defer = true;
        script.onload = () => {
          initializeGSI();
        };
        document.body.appendChild(script);
      },
      { once: true }
    );
  }
  
  // ----------------- Helpers -----------------
  function getLastDigit(num) {
    return +(num + "").slice(-4);
  }
  
  function getUniqueName(number) {
    let userName = localStorage.getItem("userName");
    if (!userName) {
      const lastFourDigits = getLastDigit(number);
      userName = "Guest" + lastFourDigits;
      localStorage.setItem("userName", userName);
    }
    return userName;
  }
  
  function getUserDetails(jsso) {
    jsso.getUserDetails(function (info) {
      if (info.status === "SUCCESS") {
        if (info.data && info.data.firstName) {
          if (info.data.firstName === "Guest") {
            if (
              info.data.mobileData &&
              info.data.mobileData.Verified &&
              info.data.mobileData.Verified.mobile
            ) {
              info.data.firstName = getUniqueName(
                info.data.mobileData.Verified.mobile
              );
            }
          }
          info.data.showIcon = true;
        }
        userInfo = info.data;
        localStorage.setItem("userInfo", JSON.stringify(info));
        localStorage.setItem("currentUser", JSON.stringify({ valid: true }));
      } else {
        userInfo.showIcon = true;
      }
    });
  }
  
  function updateCurrentUserState(state) {
    currentUserState = state;
  }
  