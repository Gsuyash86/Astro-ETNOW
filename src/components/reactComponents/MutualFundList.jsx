import React, { useState } from "react";
import CommonGridBox from "@components/common/wrappers/commonGridBox/CommonGridBox.astro";
import Link from "@components/common/link/Link.astro";
import MutualFundCard from "@components/common/mutualFundCard/MutualFundCard.astro";

const MutualFundList = ({ mFCategoriesLandingData }) => {
  const [data, setData] = useState(mFCategoriesLandingData);
  const fetchData = async (year) => {
    const response = await fetch(
      `https://azapisfinancials.etnownews.com/api/et/mf-ranking?classcode=00099&yearReturn=${year}YEARRET&perPage=10`
    );
    const mfData = await response.json();
    setData(mfData?.response?.items);
  };
  const handleChange = (e) => {
    const year = e.target.value;
    fetchData();
  };

  return (
    <CommonGridBox
      gridType="divGridBox"
      changeStyle={""}
      inLineStyle={{ marginBottom: "0px", gap: "24px" }}
    >
      {mFCategoriesLandingData?.map((item) => (
        <Link link={`/${item?.seopath}`}>
          <MutualFundCard
            iconConfig={{
              iconUrl: item?.AMC_CODE,
            }}
            companyConfig={{
              tag: "p",
              text: item?.S_NAME,
              changeStyle: "font-size-16",
              fontWeight: "500",
              isLineClamp: true,
              inLineStyle: {
                lineHeight: "1.375",
                color: "#000000",
              },
            }}
            categoryConfig={{
              tag: "p",
              text: item?.mutualFundDetailsResponse?.category || "-",
              changeStyle: "font-size-14",
              fontWeight: "500",
              isLineClamp: true,
              inLineStyle: {
                lineHeight: "1.2",
                color: "#7C7E8C",
              },
            }}
            aum={item?.totalAUM}
            nav={item?.navRs}
            returns={{
              value:
                typeof item?.Return === "number"
                  ? item.Return.toFixed(2)
                  : "--" + "%",
              isUp: item?.Return > 0,
            }}
            assetType={item?.mutualFundDetailsResponse?.assetType}
          />
        </Link>
      ))}
    </CommonGridBox>
  );
};

export default MutualFundList;
