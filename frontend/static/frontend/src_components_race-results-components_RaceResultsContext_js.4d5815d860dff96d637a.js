/*! For license information please see src_components_race-results-components_RaceResultsContext_js.4d5815d860dff96d637a.js.LICENSE.txt */
"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["src_components_race-results-components_RaceResultsContext_js"],{"./src/components/race-results-components/RaceResultsContext.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ RaceResultsContextProvider),\n/* harmony export */   useRaceResultsContext: () => (/* binding */ useRaceResultsContext)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router-dom/dist/index.js");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ "./node_modules/react-router/dist/index.js");\n/* harmony import */ var _fetch_utils_fetchGet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../fetch-utils/fetchGet */ "./src/components/fetch-utils/fetchGet.js");\n/* harmony import */ var _ApplicationContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ApplicationContext */ "./src/components/ApplicationContext.js");\n\n\n\n\nconst RaceResultsContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)();\nfunction RaceResultsContextProvider() {\n  const {\n    setErrorMessage,\n    setSuccessMessage\n  } = (0,_ApplicationContext__WEBPACK_IMPORTED_MODULE_2__.useApplicationContext)();\n  const [raceResults, setRaceResults] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n  const [raceResultsLoading, setRaceResultsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n  const [raceResultDetails, setRaceResultDetails] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);\n  const [raceResultDetailsLoading, setRaceResultDetailsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n  const [raceResultComments, setRaceResultComments] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n  const [raceResultCommentsLoading, setRaceResultCommentsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n  const [seasonList, setSeasonList] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n  const [seasonListLoading, setSeasonListLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n  const [selectedSeason, setSelectedSeason] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);\n  const [currentPage, setCurrentPage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);\n  const [searchParams] = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_3__.useSearchParams)();\n  async function retrieveRaceResults() {\n    setRaceResultsLoading(true);\n    const seasonYear = searchParams.get("season");\n    if (seasonYear == null) {\n      return;\n    }\n    const raceResultsResponse = await (0,_fetch_utils_fetchGet__WEBPACK_IMPORTED_MODULE_1__.getRaceResults)(seasonYear);\n    if (raceResultsResponse.error) {\n      setErrorMessage("There was an error loading the race results");\n      return;\n    }\n    if (raceResultsResponse.status === 404) {\n      setErrorMessage("Be sure to select a valid season");\n      return;\n    }\n    if (raceResultsResponse.status != 200) {\n      setErrorMessage("Be sure your request is valid");\n      return;\n    }\n    setRaceResults(raceResultsResponse.raceResults);\n    setRaceResultsLoading(false);\n  }\n  async function retrieveRaceResultDetails(id) {\n    setRaceResultDetailsLoading(true);\n    const raceResultDetailsResponse = await (0,_fetch_utils_fetchGet__WEBPACK_IMPORTED_MODULE_1__.getRace)(id);\n    if (raceResultDetailsResponse.error) {\n      setErrorMessage("There was an error loading the race result");\n      return;\n    }\n    if (raceResultDetailsResponse.status === 404) {\n      setErrorMessage("Race result was not found");\n      return;\n    }\n    if (raceResultDetailsResponse.status != 200) {\n      setErrorMessage("There was an error loading the race result");\n      return;\n    }\n    setRaceResultDetails(raceResultDetailsResponse.race);\n    setRaceResultDetailsLoading(false);\n  }\n  async function retrieveRaceResultComments(id) {\n    setRaceResultCommentsLoading(true);\n    const raceResultCommentsResponse = await (0,_fetch_utils_fetchGet__WEBPACK_IMPORTED_MODULE_1__.getRaceComments)(id);\n    if (raceResultCommentsResponse.error) {\n      setErrorMessage("There was an error loading the race result");\n      return;\n    }\n    if (raceResultCommentsResponse.status === 404) {\n      setErrorMessage("Race result was not found");\n      return;\n    }\n    if (raceResultCommentsResponse.status != 200) {\n      setErrorMessage("There was an error loading the race comments");\n      return;\n    }\n    setRaceResultComments(raceResultCommentsResponse.comments);\n    setRaceResultCommentsLoading(false);\n  }\n  async function retrieveSeasonList() {\n    setSeasonListLoading(true);\n    const seasonListResponse = await (0,_fetch_utils_fetchGet__WEBPACK_IMPORTED_MODULE_1__.getSeasonsSimple)();\n    if (seasonListResponse.error || seasonListResponse.status != 200) {\n      setErrorMessage("There was an error loading the season list");\n      return;\n    }\n    setSeasonList(seasonListResponse.seasons);\n    setSeasonListLoading(false);\n  }\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(RaceResultsContext.Provider, {\n    value: {\n      raceResults,\n      raceResultsLoading,\n      raceResultDetails,\n      raceResultDetailsLoading,\n      seasonList,\n      seasonListLoading,\n      selectedSeason,\n      setSelectedSeason,\n      raceResultComments,\n      raceResultCommentsLoading,\n      retrieveRaceResults,\n      retrieveRaceResultDetails,\n      retrieveSeasonList,\n      retrieveRaceResultComments\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__.Outlet, null));\n}\nfunction useRaceResultsContext() {\n  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(RaceResultsContext);\n}\n\n//# sourceURL=webpack://frontend/./src/components/race-results-components/RaceResultsContext.js?')}}]);