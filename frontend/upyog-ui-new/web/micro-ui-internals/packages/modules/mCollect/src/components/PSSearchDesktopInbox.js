import { Card, Loader } from "@upyog/digit-ui-react-components";
import React, {  useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getActionButton } from "../utils";
import ApplicationTable from "./inbox/ApplicationTable";
import InboxLinks from "./inbox/InboxLink";
import SearchApplication from "./inbox/search";
import NewSearchApplication from "./inbox/newSearch";

const PSSearchDesktopInbox = ({ tableConfig, filterComponent, columns,tableResult, setTableResult, ...props }) => {
    const { data } = props;
  const { t } = useTranslation();
  const [FilterComponent, setComp] = useState(() => Digit.ComponentRegistryService?.getComponent(filterComponent));
   const [businessIdToOwnerMappings, setBusinessIdToOwnerMappings] = useState({});
  // challans, workFlowData

  // const columns = React.useMemo(() => (props.isSearch ? tableConfig.searchColumns(props) : tableConfig.inboxColumns(props) || []), []);
  const GetCell = (value) => <span className="cell-text">{value}</span>;

  const GetSlaCell = (value) => {
    if (isNaN(value)) return <span className="sla-cell-success">0</span>;
    return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
  };

  const convertEpochToDate = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };
  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

  const GetMobCell = (value) => <span className="sla-cell">{value}</span>;
  const inboxColumns = () => 
    props.paymentSearchFlag ? 
  [
      {
      Header: t("UC_RECIEPT_NUMBER_LABEL"),
      Cell: ({ row }) => {
        return row?.original?.paymentDetails[0]?.receiptNumber ? GetCell(`${row?.original?.paymentDetails[0]?.receiptNumber}`) : "-";
      },
      mobileCell: (original) =>{
       
         GetMobCell(original?.paymentDetails[0]?.receiptNumber) || "-";
      }
    },
     {
      Header: t("UC_COMMON_TABLE_COL_PAYEE_NAME"),
      Cell: ({ row }) => {
        return GetCell(`${row.original?.payerName}`);
      },
      mobileCell: (original) => GetMobCell(original?.["payerName"]),
    },
    {
      Header: t("UC_TOTAL_AMOUNT"),
      Cell: ({ row }) => {
        return GetCell(t(`${row.original?.totalAmountPaid}`));
      },
      mobileCell: (original) => GetMobCell(original?.["totalAmountPaid"]),
    },
    {
      Header: t("UC_COMMON_TABLE_COL_STATUS"),
      Cell: ({ row }) => {
        const wf = row.original?.applicationStatus;
        return GetCell(t(`${row.original?.paymentStatus}`));
      },
      mobileCell: (original) => GetMobCell(original?.workflowData?.state?.["state"]),
    },
    {
      Header: t("UC_PAYMENT_DATE"),
      Cell: ({ row }) => {
        const dueDate = row.original?.dueDate === "NA" ? t("CS_NA") : 
        convertEpochToDate(row.original?.paymentDetails[0]?.receiptDate);
        return GetCell(t(`${dueDate}`));
      },
      mobileCell: (original) => GetMobCell(convertEpochToDate(original?.["dueDate"])),
    },
    {
      Header: t("UC_COMMON_TABLE_PAYEMENT_MODE"),
      Cell: ({ row }) => {
        return GetCell(`${row.original?.paymentMode}`);
      },
      mobileCell: (original) => GetMobCell(original?.["name"]),
    },
     {
      Header: t("UC_TABLE_COL_ACTION"),
      Cell: ({ row }) => {
        const amount = row.original?.totalAmountPaid;
        let action = "ACTIVE";
        // if (amount > 0) action = "COLLECT";
         if (row.original?.paymentStatus == "NEW") {
          return (
            <div>
              <span className="link">{getActionButton(row.original?.paymentDetails[0]?.businessService, row.original?.paymentDetails[0]?.bill['consumerCode'])}</span>
            </div>
          );
        } else {
          return GetCell(t(`${"CS_NA"}`));
        }
      },
      mobileCell: (original) => GetMobCell(original?.workflowData?.state?.["state"]),
    },
    ] : 
    [
    {
      Header: t("UC_CHALLAN_NUMBER"),
      Cell: ({ row }) => {
        return (
          <div>
            <span className="link">
              <Link to={`${props.parentRoute}/challansearch/` + row.original?.["challanNo"]}>{row.original?.["challanNo"]}</Link>
            </span>
          </div>
        );
      },
      mobileCell: (original) => GetMobCell(original?.["challanNo"]),
    },
    // {
    //   Header: t("UC_COMMON_TABLE_COL_PAYEE_NAME"),
    //   Cell: ({ row }) => {
        
    //     return GetCell(`${row.original?.["citizen"].name}`);
    //   },
    //   mobileCell: (original) => GetMobCell(original?.["name"]),
    // },
    {
      Header: t("UC_WARD_LABEL"),
      Cell: ({ row }) => {
        return GetCell(`${row.original?.ward}`);
      },
      mobileCell: (original) => GetMobCell(original?.ward),
    },
    // {
    //   Header: t("UC_PROPERTY_TYPE_LABEL"),
    //   Cell: ({ row }) => {
    //     return GetCell(`${row.original?.["additionalDetail"]?.propertType}`);
    //   },
    //   mobileCell: (original) => GetMobCell(original?.["additionalDetail"]?.propertType),
    // },
    // {
    //   Header: t("UC_SERVICE_CATEGORY_LABEL"),
    //   Cell: ({ row }) => {
    //     let code = stringReplaceAll(`${row.original?.["businessService"]}`, ".", "_");
    //     code = code.toUpperCase();
    //     return GetCell(t(`BILLINGSERVICE_BUSINESSSERVICE_${code}`));
    //   },
    //   mobileCell: (original) => GetMobCell(`BILLINGSERVICE_BUSINESSSERVICE_${original?.["businessService"]}`),
    // },
    
    // {
    //   Header: t("UC_RECIEPT_NUMBER_LABEL"),
    //   Cell: ({ row }) => {
    //     return row.original?.["receiptNumber"] ? GetCell(`${row.original?.["receiptNumber"]}`) : "-";
    //   },
    //   mobileCell: (original) => GetMobCell(original?.["receiptNumber"]) || "-",
    // },
    {
      Header: t("UC_DUE_DATE"),
      Cell: ({ row }) => {
        const dueDate = row.original?.dueDate === "NA" ? t("CS_NA") : convertEpochToDate(row.original?.dueDate);
        return GetCell(t(`${dueDate}`));
      },
      mobileCell: (original) => GetMobCell(convertEpochToDate(original?.["dueDate"])),
    },
    {
      Header: t("UC_TOTAL_AMOUNT"),
      Cell: ({ row }) => {
        return GetCell(t(`${row.original?.totalAmount}`));
      },
      mobileCell: (original) => GetMobCell(original?.["totalAmount"]),
    },
    {
      Header: t("UC_COMMON_TABLE_COL_STATUS"),
      Cell: ({ row }) => {
        const wf = row.original?.applicationStatus;
        return GetCell(t(`${row.original?.applicationStatus}`));
      },
      mobileCell: (original) => GetMobCell(original?.workflowData?.state?.["state"]),
    },
    {
      Header: t("UC_TABLE_COL_ACTION"),
      Cell: ({ row }) => {
        const amount = row.original?.totalAmount;
        let action = "ACTIVE";
        if (amount > 0) action = "COLLECT";
        if (action == "COLLECT") {
          return (
            <div>
              <span className="link">
                <Link
                  to={{
                    pathname: `/upyog-ui/employee/payment/collect/${row.original?.["businessService"]}/${row.original?.["challanNo"]}/tenantId=${row.original?.["tenantId"]}?workflow=mcollect`,
                  }}
                >
                  {t(`UC_${action}`)}
                </Link>
              </span>
            </div>
          );
        } else if (row.original?.applicationStatus == "PAID") {
          return (
            <div>
              <span className="link">{getActionButton(row.original?.["businessService"], row.original?.["challanNo"])}</span>
            </div>
          );
        } else {
          return GetCell(t(`${"CS_NA"}`));
        }
      },
      mobileCell: (original) => GetMobCell(original?.workflowData?.state?.["state"]),
    },
  ]
  ;


    let formedData = [];
  let res;
  let businessIdToOwnerMapping = {};
    // Fetching bill
useEffect(()=>{
   async function fetchMyAPI() {
      let businessIds = [];
      let businessServiceMap = {};
      let challanNumbers = [];
      let challanNums = [];

      tableResult?.forEach((item) => {
        challanNums = businessServiceMap[item.businessService] || [];
        challanNumbers = challanNums;
        challanNums.push(item.challanNo);
        businessServiceMap[item.businessService] = challanNums;
      });
      let processInstanceArray = [];

      for (var key in businessServiceMap) {
        let consumerCodes = businessServiceMap[key].toString();
        res = await Digit.PaymentService.fetchBill(props?.tenantId, { consumerCode: consumerCodes, businessService: key });
        processInstanceArray = processInstanceArray.concat(res.Bill);
        businessIdToOwnerMapping = {};
        processInstanceArray
          .filter((record) => record.businessService)
          .forEach((item) => {
            businessIdToOwnerMapping[item.consumerCode] = {
              businessService: item.businessService,
              totalAmount: item.totalAmount || 0,
              dueDate: item?.billDetails[0]?.expiryDate,
            };
          });
      }
      // setIsLoader(false);
      setBusinessIdToOwnerMappings(businessIdToOwnerMapping);
    }
    if (tableResult?.length > 0) {
      // setIsLoader(true);
      fetchMyAPI();
    }
}, [tableResult])

   tableResult?.map((data) => {
    formedData.push({
      challanNo: data?.challanNo,
      name: data?.citizen?.name,
      applicationStatus: data?.applicationStatus,
      ward: data?.additionalDetail?.ward,
      businessService: data?.businessService,
      totalAmount: businessIdToOwnerMappings[data.challanNo]?.totalAmount || 0,
      dueDate: businessIdToOwnerMappings[data.challanNo]?.dueDate || "NA",
      tenantId: data?.tenantId,
      receiptNumber:data?.receiptNumber
    });
  });


   return (
    <div className="inbox-container" style={{overflow: "auto"}}>
        
      {!props.isSearch && ( null
        // <div className="filters-container">
        //   {/* <InboxLinks parentRoute={props.parentRoute} businessService={props.businessService} /> */}
        //   <div>
        //     {
        //       <FilterComponent
        //         defaultSearchParams={props.defaultSearchParams}
        //         onFilterChange={props.onFilterChange}
        //         searchParams={props.searchParams}
        //         type="desktop"
        //       />
        //     }
        //   </div>
        // </div>
      )}
      <div style={{ flex: 1 }}>
        {/* <SearchApplication
          defaultSearchParams={props.defaultSearchParams}
          onSearch={props.onSearch}
          type="desktop"
          searchFields={props.searchFields}
          isInboxPage={!props?.isSearch}
          searchParams={props.searchParams}
        /> */}
        <NewSearchApplication
        defaultSearchParams={props.defaultSearchParams}
          onSearch={props.onSearch}
          type="desktop"
          searchFields={props.searchFields}
          isInboxPage={!props?.isSearch}
          searchParams={props.searchParams}
          paginationParams={props?.paginationParams}
          setTableResult={setTableResult}
          setIsLoader={props?.setIsLoader}
           tenantId={props?.tenantId}
            isMcollectAppChanged={props?.isMcollectAppChanged}
            paymentSearchFlag={props?.paymentSearchFlag}
        />
        <div className="result" style={{ marginLeft: !props?.isSearch ? "24px" : "", flex: 1 }}>
         
          {props?.isLoader  && <Loader />}
          {tableResult?.length> 0 && 
          
          <ApplicationTable
        t={t}
        data={props?.paymentSearchFlag ? tableResult : formedData}
        columns={inboxColumns(props?.paymentSearchFlag ? tableResult : formedData)}
        getCellProps={(cellInfo) => {
          return {
            style: {
              minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
              padding: "20px 18px",
              fontSize: "16px",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              width: "250px",
            },
          };
        }}
        onPageSizeChange={props.onPageSizeChange}
        currentPage={props.currentPage}
        onNextPage={props.onNextPage}
        onPrevPage={props.onPrevPage}
        onLastPage={props.onLastPage}
        onFirstPage={props.onFirstPage}
        pageSizeLimit={props.pageSizeLimit}
        onSort={props.onSort}
        disableSort={props.disableSort}
        sortParams={props.sortParams}
        totalRecords={props.totalRecords}
        
        manualPagination={false}
      />
}

        </div>
        
      </div>
    </div>
  );
}

export default PSSearchDesktopInbox