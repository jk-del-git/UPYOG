import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Label,Dropdown, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker } from "@upyog/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { filter } from "lodash";
// import Dropdown from "../../../../../react-components/src/atoms/Dropdown.js"

const NewSearchApplication = ({ onSearch, type, onClose, searchFields, searchParams,paginationParams,  isInboxPage, defaultSearchParams, 
  setTableResult, tenantId, isMcollectAppChanged,
  paymentSearchFlag, setIsLoader
 }) => {
  const cities = Digit.Hooks.mcollect.usemcollectTenants();
      const getCities = () => cities?.filter((e) => e.code === Digit.ULBService.getCurrentTenantId()) || [];
      const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID");
      const data = Digit.Hooks.mcollect.useCommonMDMS(stateCode, "common-masters", ["HierarchyType"]);
        const type1 = data &&  data.data &&  data.data[`common-masters`] && data.data[`common-masters`]["HierarchyType"] && data.data[`common-masters`]["HierarchyType"][0];
      const { t } = useTranslation();
       const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    getCities()[0]?.code,
    type1 && type1.code.toLowerCase(),
    {
      enabled: !!getCities()[0],
    },
    t
  );

  
      const { register, handleSubmit, reset, watch, control } = useForm({
        defaultValues: searchParams,
      });
      const mobileView = innerWidth <= 640;


//  const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.mcollect.useMCollectSearch({
//         tenantId,
//         filters: { ...searchParams, ...paginationParams },
//         isMcollectAppChanged,
//       });
 
    
      const onSubmitInput = (data) => {
         
        if(!paymentSearchFlag){
          const customSearchParams = {
          fromDate : data?.fromDate ? Date.parse(data?.fromDate) : null,
          toDate : data?.toDate ? Date.parse(data?.toDate) : null,
          ward : data?.wardNo?.code ? data?.wardNo?.code : null,
          mobileNumber : data?.mobileNumber ? data?.mobileNumber : null,
          receiptNumber : data?.receiptNumber ? data?.receiptNumber : null,
          challanNo : data?.challanNo ? data?.challanNo : null
        }
        
        try {
          setIsLoader(true);
          Digit.MCollectService.search({tenantId,filters:{
            ...customSearchParams
            ,...paginationParams}})
        .then((data1)=>{
          setTableResult(data1?.challans)
          setIsLoader(false)
          
          
        }).catch((e)=>{
          
          
        })
        } catch (error) {
          
        }
        }
        else{
          
           const paymentSearchPayload = {
          fromDate : data?.fromDate ? Date.parse(data?.fromDate) : null,
          toDate : data?.toDate ? Date.parse(data?.toDate) : null,
          // ward : data?.wardNo?.code ? data?.wardNo?.code : null,
          // mobileNumber : data?.mobileNumber ? data?.mobileNumber : null,
          // receiptNumber : data?.receiptNumber ? data?.receiptNumber : null,
          // challanNo : data?.challanNo ? data?.challanNo : null
          
        }
        try {
          setIsLoader(true);
          Digit.PaymentService.paymentStatusSearch({tenantId,filters:{
            ...paymentSearchPayload
            ,...paginationParams}})
            .then((data1)=>{
          setTableResult(data1?.Payments)
          setIsLoader(false);
          
          
        }).catch((e)=>{
          
        })
        } catch (error) {
          
          
        }
        }
      };
    
      function clearSearch() {
        const resetValues = searchFields.reduce((acc, field) => ({ ...acc, [field?.name]: "" }), {});
        reset(resetValues);
        const _newParams = { ...searchParams };
        _newParams.delete = [];
        searchFields.forEach((e) => {
          _newParams.delete.push(e?.name);
        });
    
        onSearch({ ..._newParams });
      }
    
      const clearAll = (mobileView) => {
        const mobileViewStyles = mobileView ? { margin: 0 } : {};
        return (
          <LinkLabel style={{ marginRight:"10px",display: "inline", ...mobileViewStyles }} onClick={clearSearch}>
            {t("UC_CLEAR_SEARCH_LABEL")}
          </LinkLabel>
        );
      };


      const renderSearchComponents = (input) => {
        switch (input.type) {
          case 'date':
            return  (<Controller
                              render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                              name={input.name}
                              control={control}
                              defaultValue={null}
                            />)
            break;
          case 'select' : 
          return (
           
            <Controller
                          name={input.name}
                          // rules={{ required: t("REQUIRED_FIELD") }}
                          defaultValue={null}
                          control={control}
                          render={(props) => (
                             <div className="field-container">
                            <Dropdown
                              className="form-field"
                              selected={props.value}
                              isMandatory={true}
                              //errorStyle={(localFormState.touched.financialYear && errors?.financialYear?.message) ? true : false}
                              // disable={financialYearOptions?.length === 1}
                              // option={["Residential","Commercial"]}
                          
                              option={fetchedLocalities || []}
                              select={props.onChange}
                              optionKey="i18nkey"
                              onBlur={props.onBlur}
                              disable={false}
                              t={t}
                              // style={{width:'100% !important'}}
                              style={{ width: "100%" }}
                              heightFlag={true}
                              
                            />
                            </div>
                          )}
                        />
                        
          )
          break;
          default:
            return (
                            <div className="field-container">
                              {input?.componentInFront ? (
                                <span className="citizen-card-input citizen-card-input--front" style={{ flex: "none" }}>
                                  {input?.componentInFront}
                                </span>
                              ) : null}
                              <TextInput {...input} inputRef={register} watch={watch} shouldUpdate={true} />
                            </div>
                          )
            break;
        }
      }


       return (
          <form onSubmit={handleSubmit(onSubmitInput)}>
            <React.Fragment>
              <div className="search-container" style={{ width: "auto", marginLeft: isInboxPage ? "24px" : "revert" }}>
                <div className="search-complaint-container">
                  {(type === "mobile" || mobileView) && (
                    <div className="complaint-header">
                      <h2>{t("ES_COMMON_SEARCH_BY")}</h2>
                      <span onClick={onClose}>
                        <CloseSvg />
                      </span>
                    </div>
                  )}
                  <div className={"complaint-input-container for-pt " + (!(type === "desktop" && !mobileView ) ? "for-search" : "")} style={{ width: "100%",display:"grid" }}>
                    {searchFields
                      ?.filter((e) => true)
                      ?.map((input, index) => (
                        <div key={input.name} className="input-fields">
                        <span key={index} className={"complaint-input"}>  {/* //{index === 0 ? "complaint-input" : "mobile-input"} */}
                          <Label>{input.label}</Label>
                          {/* {input.type !== "date" ? (
                            <div className="field-container">
                              {input?.componentInFront ? (
                                <span className="citizen-card-input citizen-card-input--front" style={{ flex: "none" }}>
                                  {input?.componentInFront}
                                </span>
                              ) : null}
                              <TextInput {...input} inputRef={register} watch={watch} shouldUpdate={true} />
                            </div>
                          ) : (
                            <Controller
                              render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                              name={input.name}
                              control={control}
                              defaultValue={null}
                            />
                          )} */}
                          {renderSearchComponents(input)}
                          {" "}
                        </span>
                        </div>
                      ))}
                      {type === "desktop" && !mobileView && (
                        <div style={{ gridColumn: "2/3", textAlign: "right", paddingTop: "10px",marginRight:"10px !important" }} className="input-fields">
                        <div>{clearAll()}</div>
                        </div>
                      )}
                      {type === "desktop" && !mobileView &&
                    <div style={{ maxWidth: "unset", marginLeft: "unset" }} className="search-submit-wrapper">
                      <SubmitBar
                        className="submit-bar-search"
                        label={t("UC_SEARCH_LABEL")}
                        submit
                      />
                      {!isInboxPage && <div>{clearAll()}</div>}
                    </div>}
                  </div>
                </div>
              </div>
              {(type === "mobile" || mobileView) && (
                <ActionBar className="clear-search-container">
                  <button className="clear-search" style={{ flex: 1 }}>
                    {clearAll(mobileView)}
                  </button>
                  <SubmitBar label={t("UC_SEARCH_LABEL")} style={{ flex: 1 }} submit={true} />
                </ActionBar>
              )}
            </React.Fragment>
         </form>
        );
}

export default NewSearchApplication;