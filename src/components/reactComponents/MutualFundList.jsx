import React, { useState } from "react";
import "./MutualFundList.css";

const MutualFundList = ({ mFCategoriesLandingData }) => {
  const [data, setData] = useState(mFCategoriesLandingData);
  const fetchData = async (year) => {
    const response = await fetch(
      `https://apifinancials.etnownews.com/api/et/mf-ranking?classcode=00099&yearReturn=${year}YEARRET&perPage=10`
    );
    const mfData = await response.json();
    setData(mfData?.response?.items);
  };
  const handleChange = (e) => {
    const year = e.target.value;
    fetchData(year);
  };

  return (
    <div class="">
      <h3>Mutual Funds</h3>
      <div class="MutualFundsList-module__filter ">
        <p
          class="Typography-module__font-size-14  Typography-module__black  Typography-module__font-weight-400  Typography-module__default-paragraph "
          style={{
            lineHeight: "1.2",
            color: "#878787",
            textTransform: "uppercase",
          }}
        >
          Return period
        </p>
        <select
          class="MutualFundsList-module__select "
          onChange={handleChange}
          name="mf-dropdown"
        >
          <option value="1">1Y</option>
          <option value="3">3Y</option>
          <option value="5">5Y</option>
        </select>
      </div>
      <p
        class="Typography-module__font-size-12  Typography-module__black  Typography-module__font-weight-400  Typography-module__default-paragraph "
        style={{ lineHeight: "1.2", color: "#68656B", marginBottom: "16px" }}
      >
        List of Best Funds in India sorted by Returns
      </p>
      <div class="undefined">
        <div
          class="CommonGridBox-module__d-grid  undefined"
          style={{ marginBottom: "0px", gap: "24px" }}
        >
          {data?.map((item) => (
            <a
              href="/mutual-funds/mirae-asset-nyse-fang-etf-fof-g-direct-plan-mutual-fund-45497"
              title=""
              class=""
              key={item.SCHEMECODE}
            >
              <div class="MutualFundCard-module__box ">
                <div class="MutualFundCard-module__box-top ">
                  <i>
                    <img
                      src="https://times-network.s3.ap-southeast-1.amazonaws.com/et-now-stocks/MF+house+logos/400033.png"
                      alt="fund icon"
                    />
                  </i>
                  <p
                    class="Typography-module__font-size-16  Typography-module__black  Typography-module__font-weight-500  Typography-module__default-paragraph "
                    style={{ lineHeight: "1.375", color: "#000000" }}
                  >
                    {item?.S_NAME}
                  </p>
                  <ul class="MutualFundCard-module__box-category ">
                    <li>
                      <p
                        class="Typography-module__font-size-14  Typography-module__black  Typography-module__font-weight-500  Typography-module__default-paragraph "
                        style={{ lineHeight: "1.2", color: "#7C7E8C" }}
                      >
                        {item?.mutualFundDetailsResponse?.assetType}
                      </p>
                    </li>
                    <li>
                      <p
                        class="Typography-module__font-size-14  Typography-module__black  Typography-module__font-weight-500  Typography-module__default-paragraph "
                        style={{ lineHeight: "1.2", color: "#7C7E8C" }}
                      >
                        {item?.mutualFundDetailsResponse?.category}
                      </p>
                    </li>
                  </ul>
                </div>
                <ul class="MutualFundCard-module__box-bottom ">
                  <li>
                    <p
                      class="Typography-module__font-size-12  Typography-module__black  Typography-module__font-weight-400  Typography-module__default-paragraph "
                      style={{
                        lineHeight: "1.2",
                        color: "#878787",
                        marginBottom: "4px",
                      }}
                    >
                      AUM
                    </p>
                    <p
                      class="Typography-module__font-size-14  Typography-module__black  Typography-module__font-weight-500  Typography-module__default-paragraph "
                      style={{ lineHeight: "1.2", color: "#26232C" }}
                    >
                      {item?.totalAUM}
                    </p>
                  </li>
                  <li>
                    <p
                      class="Typography-module__font-size-12  Typography-module__black  Typography-module__font-weight-400  Typography-module__default-paragraph "
                      style={{
                        lineHeight: "1.2",
                        color: "#878787",
                        marginBottom: "4px",
                      }}
                    >
                      Returns (p.a)
                    </p>
                    <div class="StockPriceMovement-module__default  StockPriceMovement-module__up ">
                      <p
                        class="Typography-module__font-size-14  Typography-module__black  Typography-module__font-weight-700  Typography-module__default-paragraph "
                        style={{ color: "inherit" }}
                      >
                        {Number(item.Return).toFixed(2)} %
                      </p>
                    </div>
                  </li>
                  <li>
                    <p
                      class="Typography-module__font-size-12  Typography-module__black  Typography-module__font-weight-400  Typography-module__default-paragraph "
                      style={{
                        lineHeight: "1.2",
                        color: "#878787",
                        marginBottom: "4px",
                      }}
                    >
                      NAV
                    </p>
                    <p
                      class="Typography-module__font-size-14  Typography-module__black  Typography-module__font-weight-500  Typography-module__default-paragraph "
                      style={{ lineHeight: "1.2", color: "#26232C" }}
                    >
                      {item?.navRs}
                    </p>
                  </li>
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div class="MutualFundsList-module__load-more ">
        <a
          href="/mutual-funds/mutual-fund-performance"
          title=""
          class=""
          style={{ width: "145px", height: "39px", padding: "0px" }}
        >
          Show more
        </a>
      </div>
    </div>
  );
};

export default MutualFundList;
