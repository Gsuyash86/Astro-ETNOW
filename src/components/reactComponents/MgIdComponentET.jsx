import React, { useEffect } from "react";

const MgIdComponentET = ({
  scriptID = "1424749",
  elementID = "1424749",
  type = "etnownews",
  isAppView,
}) => {
  //1424749
  useEffect(() => {
    if (!isAppView) {
      const script = document.createElement("script");
      script.src = `https://jsc.mgid.com/e/t/${type}.com.${scriptID}.js`;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);
  return (
    <>
      {!isAppView ? (
        <div>
          <div
            id={`M${
              type == "etnownews" ? 863117 : 912820
            }ScriptRootC${elementID}`}
          ></div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default MgIdComponentET;
