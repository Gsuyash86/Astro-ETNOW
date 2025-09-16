import React, { useEffect } from "react";

const MgIdComponent = ({
  url = "https://jsc.mgid.com/site/511800.js",
  divId = "1764598",
}) => {
  // url and div id https://jsc.mgid.com/site/511800.js 1764598
  useEffect(() => {
    const script = document.createElement("script");
    script.src = url;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return <div data-type="_mgwidget" data-widget-id={divId}></div>;
};

export default MgIdComponent;
