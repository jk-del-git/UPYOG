import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@upyog/digit-ui-react-components";

import DesktopInbox from "../../../components/DesktopInbox";
import MobileInbox from "../../../components/MobileInbox";
import PSSearchDesktopInbox from "../../../components/PSSearchDesktopInbox";

const DetailedCollectionSearch = ({
  parentRoute,
  businessService = "PT",
  initialStates = {},
  filterComponent,
  isInbox,
  rawWfHandler,
  rawSearchHandler,
  combineResponse,
  wfConfig,
  searchConfig,
  middlewaresWf,
  middlewareSearch,
}) => {
  const [tableResult, setTableResult] = useState([]);
     const tenantId = Digit.ULBService.getCurrentTenantId();
        
          let isMcollectAppChanged = Digit.SessionStorage.get("isMcollectAppChanged");
          const { t } = useTranslation();
          const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
          const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
          const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "createdTime", desc: false }]);
          const { isLoading, isError: isCountError, error: counterror, data: countData } = Digit.Hooks.mcollect.useMCollectCount(tenantId);
        
          const [searchParams, setSearchParams] = useState(() => {
            return initialStates.searchParams || {};
          });
        
          const [businessIdToOwnerMappings, setBusinessIdToOwnerMappings] = useState({});
          const [isLoader, setIsLoader] = useState(false);
        
          let isMobile = window.Digit.Utils.browser.isMobile();
          let paginationParams = isMobile
            ? { limit: 100, offset: 0, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
            : { limit: null, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };
        
          const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.mcollect.useMCollectSearch({
            tenantId,
            filters: { ...searchParams, ...paginationParams },
            isMcollectAppChanged,
          });
        
          let formedData = [];
          let res;
          let businessIdToOwnerMapping = {};
        
          
        
          data?.challans?.map((data) => {
            formedData.push({
              challanNo: data?.challanNo,
              name: data?.citizen?.name,
              applicationStatus: data?.applicationStatus,
              businessService: data?.businessService,
              totalAmount: businessIdToOwnerMappings[data.challanNo]?.totalAmount || 0,
              dueDate: businessIdToOwnerMappings[data.challanNo]?.dueDate || "NA",
              tenantId: data?.tenantId,
              receiptNumber:data?.receiptNumber
            });
          });
        
          useEffect(() => {
            setPageOffset(0);
          }, [searchParams]);
        
          const fetchNextPage = () => {
            setPageOffset((prevState) => prevState + pageSize);
          };
        
          const fetchPrevPage = () => {
            setPageOffset((prevState) => prevState - pageSize);
          };
        
          const fetchLastPage = () => {
            setPageOffset(data?.totalCount && Math.ceil(data?.totalCount / 10) * 10 - pageSize);
          };
        
          const fetchFirstPage = () => {
            setPageOffset((prevState) => 0);
          };
        
          const handleFilterChange = (filterParam) => {
            let keys_to_delete = filterParam.delete;
            let _new = {};
            if (isMobile) {
              _new = { ...filterParam };
              // setSearchParams({
              //   businessService: [],
              //   status: []
              // })
            } else {
              _new = { ...searchParams, ...filterParam };
            }
            // let _new = { ...searchParams, ...filterParam };
            // if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
            // delete filterParam.delete;
            if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
            delete _new.delete;
            delete filterParam.delete;
            setSearchParams({ ..._new });
          };
        
          const handleSort = useCallback((args) => {
            if (args.length === 0) return;
            setSortParams(args);
          }, []);
        
          const handlePageSizeChange = (e) => {
            setPageSize(Number(e.target.value));
          };
        
          const getSearchFields = () => {
             return [
      // {
      //   label: t("UC_CHALLAN_NUMBER"),
      //   name: "challanNo",
      // },
      {
        label: t("UC_WARD_LABEL"),
        name: "wardNo",
        type : 'select',
      },
      // {
      //   label: t("UC_MOBILE_NUMBER_LABEL"),
      //   name: "mobileNumber",
      //   maxlength: 10,
      //   pattern: "[6-9][0-9]{9}",
      //   title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
      //   componentInFront: "+91",
      // },
      // {
      //   label: t("UC_RECIEPT_NUMBER_LABEL"),
      //   name: "receiptNumber",
      // },
       {
            label: t("UC_FROM_DATE_LABEL"),
            name: "fromDate",
            type:'date'
          },
          {
            label: t("UC_TO_DATE_LABEL"),
            name: "toDate",
            type:'date'
          },
          // {
          //   label: t("UC_MAPPING_STATUS_LABEL"),
          //   name: "mappingStatus",
          // },
    ];
          };
    if (isMobile) {
      return (
        <MobileInbox
          data={formedData}
          defaultSearchParams={initialStates.searchParams}
          isLoading={hookLoading}
          isSearch={!isInbox}
          searchFields={getSearchFields()}
          onFilterChange={handleFilterChange}
          onSearch={handleFilterChange}
          onSort={handleSort}
          parentRoute={parentRoute}
          searchParams={searchParams}
          sortParams={sortParams}
          //linkPrefix={`${parentRoute}/application-details/`}
          tableConfig={rest?.tableConfig}
          filterComponent={filterComponent}
        />
        // <div></div>
      );
    } else {
      return (
        <div>
          {isInbox && <Header styles={{marginLeft:"2%"}}>{t("UC_DETAILED_COLLECTION_SEARCH")}</Header>}
          <PSSearchDesktopInbox
           tenantId={tenantId}
           isMcollectAppChanged={isMcollectAppChanged}
            businessService={businessService}
            data={formedData}
            tableConfig={rest?.tableConfig}
            isLoading={hookLoading}
            defaultSearchParams={initialStates.searchParams}
            isSearch={!isInbox}
            onFilterChange={handleFilterChange}
            searchFields={getSearchFields()}
            onSearch={handleFilterChange}
            onSort={handleSort}
            onNextPage={fetchNextPage}
            onPrevPage={fetchPrevPage}
            onLastPage={fetchLastPage}
            onFirstPage={fetchFirstPage}
            currentPage={Math.floor(pageOffset / pageSize)}
            pageSizeLimit={pageSize}
            disableSort={false}
            onPageSizeChange={handlePageSizeChange}
            parentRoute={parentRoute}
            searchParams={searchParams}
             paginationParams={paginationParams}
            sortParams={sortParams}
            totalRecords={data?.totalCount}
            filterComponent={filterComponent}
            isLoader={isLoader}
            setIsLoader={setIsLoader}
            paymentSearchFlag={false}
            tableResult={tableResult}
            setTableResult={setTableResult}
          />
        </div>
      );
    }
}

export default DetailedCollectionSearch;