import React, { useEffect } from "react";
import { loadAdScript, setGAValue } from "src/utils/common";
import { CHANNEL_MSID } from "src/constant/index";
function Player({
  nextVideo,
  isVideoStarted,
  onVideoEnded,
  socioId,
  isLearning = false,
  type,
  learnGp,
}) {
  let masterVideo = "";
  useEffect(() => {
    const videoPlayerListId = isLearning
      ? "videoPlayerList" + socioId + type
      : "videoPlayerList";
    loadAdScript();
    setTimeout(() => {
      if (
        JSON.parse(localStorage.getItem(videoPlayerListId)) != null &&
        typeof JSON.parse(localStorage.getItem(videoPlayerListId)) == "object"
      ) {
        let listing = JSON.parse(localStorage.getItem(videoPlayerListId))[0];

        if (import.meta.env.ISCOMPANION_AD_ACTIVE == "true") {
          if (!listing.isShort) {
            listing.config = {
              ...listing?.config,
              compAd: {
                width: 300,
                height: 250,
                container: document.getElementById(
                  `preroll-overlay${listing.id}`
                ),
              },
            };
          }
        }

        if (window.spl && window.spl.load) {
          window.spl.load(listing?.config, function (status, config) {
            if (status) {
              JSON.parse(localStorage.getItem(videoPlayerListId)).map(
                (item) => {
                  if (import.meta.env.ISCOMPANION_AD_ACTIVE == "true") {
                    if (!item.isShort) {
                      item.config = {
                        ...item?.config,
                        compAd: {
                          width: 300,
                          height: 250,
                          container: document.getElementById(
                            `preroll-overlay${item.id}`
                          ),
                        },
                      };
                    }
                  }

                  const playerID = isLearning
                    ? "player" + item.id + learnGp
                    : "player" + item.id;
                  const condition = isLearning ? true : !window[playerID];
                  if (condition) {
                    window[playerID] = new window.SWPlayer(item.config);
                    handleAdEvents(
                      window[playerID],
                      item.id,
                      item.msid,
                      item.categoryType,
                      item.title
                    );
                    handlePlayerEvents(
                      window[playerID],
                      item.id,
                      item.msid,
                      item.categoryType,
                      item.title
                    );
                  }
                }
              );
            }
          });
        }
        const playerEvents = {
          onInit: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            const playerID = isLearning
              ? "player" + slikeId + learnGp
              : "player" + slikeId;
            setTimeout(() => {
              if (
                listing.isShort &&
                listing.id === slikeId &&
                window[playerID]
              ) {
                window[playerID].play();
              }
            }, 5);
          },
          onPlayerError: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            setGAValue("event", "Player Error", {
              event_category: categoryType,
              event_label: title,
            });
          },
          onVideoStarted: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            isVideoStarted(eventData);

            setGAValue("event", "Play", {
              event_category: categoryType,
              event_label: title,
            });
          },
          onVideoResumed: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            setGAValue("event", "Resume", {
              event_category: categoryType,
              event_label: title,
            });
          },
          onVideoPaused: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            setGAValue("event", "Pause", {
              event_category: categoryType,
              event_label: title,
            });
          },
          onVideoMuted: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            setGAValue("event", "Mute", {
              event_category: categoryType,
              event_label: title,
            });
          },
          onVideoCompleted: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            setGAValue("event", "Complete", {
              event_category: categoryType,
              event_label: title,
            });
            nextVideo();
            if (typeof onVideoEnded === "function") {
              onVideoEnded();
            }
          },
          onVideoEnded: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            setGAValue("event", "End", {
              event_category: categoryType,
              event_label: title,
            });
            nextVideo();
            if (typeof onVideoEnded === "function") {
              onVideoEnded();
            }
          },
          onVideoProgress: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            try {
              const playerID = isLearning
                ? "player" + slikeId + learnGp
                : "player" + slikeId;
              if (
                window[playerID]?.instanceManager?.dockMode &&
                categoryType != "Live TV"
              ) {
                localStorage.setItem(
                  "pipPlayerData",
                  JSON.stringify({
                    title: title,
                    msid: msid,
                    id: slikeId,
                    categoryType: categoryType,
                    startTime: eventData?.currentTime,
                  })
                );

                // docked video
                localStorage.setItem(
                  "dockedVideo",
                  JSON.stringify({
                    msid: msid,
                    id: slikeId,
                    categoryType: categoryType,
                    title: title,
                    startTime: eventData?.currentTime,
                  })
                );
              }
            } catch (error) {
              console.log("Error", error);
            }
          },
          onDockEnter: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            localStorage.setItem("isDockOpen", true);
            let dom = localStorage.setItem(
              "dockedVideo",
              JSON.stringify({
                msid: msid,
                id: slikeId,
                categoryType: categoryType,
                title: title,
                startTime: eventData?.currentTime,
              })
            );

            if (import.meta.env.ISCOMPANION_AD_ACTIVE == "true") {
              let listItem = JSON.parse(
                localStorage.getItem(videoPlayerListId)
              ).filter((i) => i.id === slikeId)[0];
              masterVideo = document.getElementById(
                `preroll-overlay${listItem.id}`
              );
              if (masterVideo?.childNodes?.length > 0) {
                if (listItem?.isHome) {
                  masterVideo.classList.remove("rhs-player");
                }
                let rootElem;
                rootElem = !isMobile()
                  ? document.getElementsByClassName(
                      "__player __dock __dockBR __sml"
                    )[0]
                  : document.getElementsByClassName(
                      "__player __dock __dockBR __xS"
                    )[0];
                rootElem.appendChild(masterVideo);
              }
            }
            if (isMobile) {
              let el = document.getElementsByClassName(
                "__player __dock __dockBR __xS"
              );
              let elScrollTop = document.getElementById("scrollTop");
              let nativeShare = document.getElementById("native-share");
              if (
                document.getElementsByClassName(
                  "__player __dock __dockBR __xS"
                ) &&
                localStorage.getItem("bottomSticky") === "true"
              ) {
                el && el[0] && el[0].classList.add("bottomStickyPip");
                if (elScrollTop) {
                  elScrollTop.style.bottom = "324px";
                }
                if (nativeShare) {
                  nativeShare.style.bottom = "284px";
                }
              } else {
                el && el[0] && el[0].classList.remove("bottomStickyPip");
                if (elScrollTop) {
                  elScrollTop.style.bottom = "";
                }
                if (nativeShare) {
                  nativeShare.style.bottom = "";
                }
              }
            }
          },
          onUserClose: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (import.meta.env.ISCOMPANION_AD_ACTIVE == "true") {
              let companionAd = document?.getElementById(
                `preroll-overlay${slikeId}`
              );
              if (companionAd && companionAd?.childNodes?.length > 0) {
                companionAd.style.display = "none";
              }
            }
          },
          onDockExit: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            let rootElem = document.querySelector(".rootVideoContainer");

            if (import.meta.env.ISCOMPANION_AD_ACTIVE == "true") {
              let listItem = JSON.parse(
                localStorage.getItem(videoPlayerListId)
              ).filter((i) => i.id === slikeId)[0];
              let preroll = document.getElementById(
                `preroll-overlay${listItem.id}`
              );
              if (preroll?.childNodes?.length > 0) {
                if (listItem?.isHome) {
                  masterVideo.classList.add("rhs-player");
                }
                let elem;
                const contEl = isLearning
                  ? `masterVideoPlayer${slikeId}${type}`
                  : `masterVideoPlayer${slikeId}`;
                elem = document.getElementById(contEl);
                elem.appendChild(preroll);
              }
            }

            if (rootElem) {
              rootElem.innerHTML = "";
            }
            try {
              const playerID = isLearning
                ? "player" + slikeId + learnGp
                : "player" + slikeId;
              if (window[playerID] != undefined) {
                if (localStorage.getItem("isDockOpen")) {
                  localStorage.removeItem("isDockOpen");
                }
                if (localStorage.getItem("dockedVideo")) {
                  localStorage.removeItem("dockedVideo");
                }
              }
            } catch (error) {
              console.log("Error", error);
            }
            // scroll to top and share button position change accordingly botton sticky ad and pip open/close
            if (isMobile()) {
              let id =
                document.getElementsByClassName(
                  "__player bottomStickyPip __md"
                ) ||
                document.getElementsByClassName(
                  "__player bottomStickyPip __sml"
                );
              if (id.length != 0) {
                id[0].classList.remove("bottomStickyPip");
              }
              let elScrollTop = document.getElementById("scrollTop");
              let nativeShare = document.getElementById("native-share");

              if (elScrollTop) {
                elScrollTop.style.bottom = "";
              }
              if (nativeShare) {
                nativeShare.style.bottom = "";
              }
            }
          },
        };

        let adType = "pre";
        const adEvents = {
          onAdImpression: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adImpression";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });
          },
          onAdComplete: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adComplete";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });
          },
          onAdSkip: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adSkipped";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });
          },
          onAdError: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adError";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });
          },
          onAdClick: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adClick";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });
          },
          onAdResume: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adResume";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });

            if (import.meta.env.ISCOMPANION_AD_ACTIVE == "true") {
              let companionAd = document?.getElementById(
                `preroll-overlay${slikeId}`
              );
              if (companionAd?.childNodes?.length > 0) {
                if (companionAd) {
                  companionAd.style.display = "block";
                }
              }
            }
          },
          onAdStart: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adStart";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });
          },
          onAdPause: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adPaused";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });
          },
          onAdBlocked: (
            player,
            eventName,
            eventData,
            slikeId,
            msid,
            categoryType,
            title
          ) => {
            if (eventData.type != undefined) {
              adType = eventData.type;
            }
            const ea = adType + "-adBlocked";
            setGAValue("event", ea, {
              event_category: categoryType,
              event_label: title,
            });
          },
        };
        function handlePlayerEvents(
          player,
          slikeId,
          msid,
          categoryType,
          title
        ) {
          function eventToFunction(player, eventName, data) {
            var funcName = eventName.replace("spl", "on");
            data = Object.assign({}, data, player.store.video);
            if (playerEvents && typeof playerEvents[funcName] === "function") {
              playerEvents[funcName](
                player,
                funcName,
                data,
                slikeId,
                msid,
                categoryType,
                title
              );
            }
          }
          Object.keys(window.SWPlayer.Events).forEach((eventKey) => {
            var eventName = window.SWPlayer.Events[eventKey];
            player.on(eventName, eventToFunction.bind(null, player));
          });
        }
        function handleAdEvents(player, slikeId, msid, categoryType, title) {
          function eventToFunction(player, eventName, data) {
            var funcName = eventName.replace("spl", "on");
            var eventData = data || {};
            if (adEvents && typeof adEvents[funcName] === "function") {
              adEvents[funcName](
                player,
                funcName,
                eventData,
                slikeId,
                msid,
                categoryType,
                title
              );
            }
          }
          Object.keys(window.SWPlayer.AdEvents).forEach((eventKey) => {
            var eventName = window.SWPlayer.AdEvents[eventKey];
            player.on(eventName, eventToFunction.bind(null, player));
          });
        }
      }
    }, 500);
    return () => {
      try {
        if (localStorage.getItem("isDockOpen")) {
          let dockedVideo = JSON.parse(localStorage.getItem("dockedVideo"));
          if (dockedVideo) {
            localStorage.setItem(
              "pipPlayerData",
              JSON.stringify({
                title: dockedVideo?.title,
                msid: dockedVideo?.msid
                  ? dockedVideo?.msid
                  : CHANNEL_MSID[`${dockedVideo?.id}`],
                id: dockedVideo?.id,
                categoryType: dockedVideo?.categoryType,
                startTime: dockedVideo?.startTime,
              })
            );
          }
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
  }, []);

  return <></>;
}

Player.defaultProps = {
  youTubePlayerClose: () => {},
  handleClick: () => {},
  nextVideo: () => {},
  isVideoStarted: () => {},
  onVideoEnded: () => {},
};

export default Player;
