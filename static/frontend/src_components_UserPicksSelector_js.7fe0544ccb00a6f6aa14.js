/*! For license information please see src_components_UserPicksSelector_js.7fe0544ccb00a6f6aa14.js.LICENSE.txt */
"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([["src_components_UserPicksSelector_js"],{"./src/components/UserPicksSelector.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "default": () => (/* binding */ UserPicksSelector)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _fetch_utils_fetchGet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fetch-utils/fetchGet */ "./src/components/fetch-utils/fetchGet.js");\n/* harmony import */ var _ApplicationContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ApplicationContext */ "./src/components/ApplicationContext.js");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./src/components/utils.js");\n/* harmony import */ var _fetch_utils_fetchPost__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fetch-utils/fetchPost */ "./src/components/fetch-utils/fetchPost.js");\n\n\n\n\n\nfunction UserPicksSelector() {\n  const {\n    setErrorMessage,\n    addErrorMessage,\n    setSuccessMessage,\n    setLoadingMessage,\n    currentSeason,\n    competitorsSortedNumber,\n    loggedIn,\n    user,\n    contextLoading,\n    selectPicksState\n  } = (0,_ApplicationContext__WEBPACK_IMPORTED_MODULE_2__.useApplicationContext)();\n  const [invalidPicks, setInvalidPicks] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([0, 0, 0, 0, 0]);\n  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);\n  const [userPicks, setUserPicks] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([0, 0, 0, 0, 0]);\n  const [userIndependentPick, setUserIndependentPick] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);\n  const [invalidIndependent, setInvalidIndependent] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);\n  const [userRookiePick, setUserRookiePick] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);\n  const [invalidRookie, setInvalidRookie] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);\n  const [picksWords, setPicksWords] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(["1st", "2nd", "3rd", "4th", "5th"]);\n  function resetInvalidPicks() {\n    setInvalidPicks([0, 0, 0, 0, 0]);\n    setInvalidRookie(false);\n    setInvalidIndependent(false);\n  }\n  function addUserPick(position, competitor) {\n    setUserPicks(prevUserPicks => {\n      const newUserPicks = [...prevUserPicks];\n      newUserPicks[position] = competitor;\n      return newUserPicks;\n    });\n  }\n  function addInvalidPicks(invalidPicks) {\n    setInvalidPicks(() => {\n      const newInvalidPicks = [...invalidPicks];\n      return newInvalidPicks;\n    });\n  }\n  async function submitPicks() {\n    setLoadingMessage("Loading...");\n    let picks = userPicks.map(pick => pick.id);\n    const picksResponse = await (0,_fetch_utils_fetchPost__WEBPACK_IMPORTED_MODULE_4__.submitUserPicks)(picks, userIndependentPick.id, userRookiePick.id);\n    resetInvalidPicks();\n    setLoadingMessage(false);\n    if (picksResponse.error) {\n      setErrorMessage("There has been an error submiting the picks.");\n      console.log(picksResponse.error);\n      return;\n    }\n    if (picksResponse.status === 201) {\n      setSuccessMessage("The picks have been successfully submited.");\n      return;\n    }\n    if (picksResponse.status === 400) {\n      if (picksResponse.picksAlreadySelected) {\n        setErrorMessage("Another user already has the same picks and order.");\n        return;\n      }\n      if (picksResponse.invalidPicks) {\n        for (let i = 0; i < picksResponse.invalidPicks.length; i++) {\n          if (picksResponse.invalidPicks[i] === true) {\n            setErrorMessage("Highlighted picks are invalid");\n          }\n        }\n        addInvalidPicks(picksResponse.invalidPicks);\n      }\n      if (picksResponse.invalidIndependent) {\n        setInvalidIndependent(true);\n        addErrorMessage("Selected independent rider is not an independent rider");\n      }\n      if (picksResponse.invalidRookie) {\n        setInvalidRookie(true);\n        addErrorMessage("Selected rookie is not rookie");\n      }\n    }\n  }\n  async function retrieveUserPicks() {\n    const userPicksResponse = await (0,_fetch_utils_fetchGet__WEBPACK_IMPORTED_MODULE_1__.getUserPicks)(currentSeason.id);\n    if (userPicksResponse.error) {\n      setErrorMessage("There has been an error loading the selected picks");\n      console.log(userPicksResponse.error);\n      return;\n    }\n    if (userPicksResponse.userPicks != null) {\n      // Sort the userPicks based on the \'position\' field\n      const sortedUserPicks = userPicksResponse.userPicks.sort((a, b) => a.position - b.position).map(pick => pick.competitor_points.competitor);\n      setUserPicks(sortedUserPicks);\n      if (userPicksResponse.independentPick != null) {\n        setUserIndependentPick(userPicksResponse.independentPick.competitor_points.competitor);\n      }\n      if (userPicksResponse.rookiePick != null) {\n        setUserRookiePick(userPicksResponse.rookiePick.competitor_points.competitor);\n      }\n    }\n  }\n  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    setLoadingMessage("Loading...");\n    retrieveUserPicks();\n    setLoading(false);\n    setLoadingMessage(false);\n  }, []);\n  if (loading || contextLoading) {\n    return null;\n  }\n  if (!loggedIn) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "You need to be logged in to select your picks.");\n  }\n  if (!selectPicksState) {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, "You can not select your picks at this moment.");\n  }\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card mt-4 rounded-15"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-header d-flex justify-content-center"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h3", null, "Season: ", currentSeason.year)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-body"\n  }, userPicks.map((userPick, i) => invalidPicks[i] == true ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "col d-flex justify-content-center",\n    key: `${picksWords[i]}-pick-dropdown-div`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card text-center mb-2"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-header"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {\n    className: "card-title text-muted"\n  }, picksWords[i], " Pick")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-body",\n    style: {\n      padding: "8px"\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "dropdown p-2"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {\n    className: "btn btn-outline-danger dropdown-toggle",\n    id: `${picksWords[i]}-pick-button`,\n    onClick: e => (0,_utils__WEBPACK_IMPORTED_MODULE_3__.toggleDropdown)(`${picksWords[i]}-pick-dropdown`, e, loggedIn)\n  }, userPicks[i] != 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, userPicks[i].first, " ", userPicks[i].last), userPicks[i] == 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, picksWords[i], " Pick")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {\n    className: "dropdown-menu",\n    id: `${picksWords[i]}-pick-dropdown`,\n    style: {\n      overflowY: "scroll",\n      maxHeight: "15rem"\n    }\n  }, competitorsSortedNumber.map(competitor => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {\n    key: `competitor-${competitor.competitor_points.competitor.id}`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {\n    className: "dropdown-item",\n    onClick: () => {\n      addUserPick(i, competitor.competitor_points.competitor);\n    }\n  }, competitor.competitor_points.competitor.first, " ", competitor.competitor_points.competitor.last)))))))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "col d-flex justify-content-center",\n    key: `${picksWords[i]}-pick-dropdown-div`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card text-center mb-2"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-header"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {\n    className: "card-title text-muted"\n  }, picksWords[i], " Pick")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-body",\n    style: {\n      padding: "8px"\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "dropdown p-2"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {\n    className: "btn btn-outline-secondary dropdown-toggle",\n    id: `${picksWords[i]}-pick-button`,\n    onClick: e => (0,_utils__WEBPACK_IMPORTED_MODULE_3__.toggleDropdown)(`${picksWords[i]}-pick-dropdown`, e, loggedIn)\n  }, userPicks[i] != 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, userPicks[i].first, " ", userPicks[i].last), userPicks[i] == 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, picksWords[i], " Pick")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {\n    className: "dropdown-menu",\n    id: `${picksWords[i]}-pick-dropdown`,\n    style: {\n      overflowY: "scroll",\n      maxHeight: "15rem"\n    }\n  }, competitorsSortedNumber.map(competitor => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {\n    key: `competitor-${competitor.competitor_points.competitor.id}`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {\n    className: "dropdown-item",\n    onClick: () => {\n      addUserPick(i, competitor.competitor_points.competitor);\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("small", null, "#", competitor.competitor_points.competitor.number), " ", competitor.competitor_points.competitor.first, " ", competitor.competitor_points.competitor.last))))))))), currentSeason.top_independent && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "col d-flex justify-content-center",\n    key: `independent-pick-dropdown-div`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card text-center mb-2"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-header"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {\n    className: "card-title text-muted"\n  }, "Independent Pick")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-body",\n    style: {\n      padding: "8px"\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "dropdown p-2"\n  }, invalidIndependent == true && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {\n    className: "btn btn-outline-danger dropdown-toggle",\n    id: `independent-pick-button`,\n    onClick: e => (0,_utils__WEBPACK_IMPORTED_MODULE_3__.toggleDropdown)(`independent-pick-dropdown`, e, loggedIn)\n  }, userIndependentPick != 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, userIndependentPick.first, " ", userIndependentPick.last), userIndependentPick == 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "Independent Pick")), invalidIndependent == false && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {\n    className: "btn btn-outline-secondary dropdown-toggle",\n    id: `independent-pick-button`,\n    onClick: e => (0,_utils__WEBPACK_IMPORTED_MODULE_3__.toggleDropdown)(`independent-pick-dropdown`, e, loggedIn)\n  }, userIndependentPick != 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, userIndependentPick.first, " ", userIndependentPick.last), userIndependentPick == 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "Independent Pick")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {\n    className: "dropdown-menu",\n    id: `independent-pick-dropdown`,\n    style: {\n      overflowY: "scroll",\n      maxHeight: "15rem"\n    }\n  }, competitorsSortedNumber.map(competitor => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {\n    key: `competitor-${competitor.competitor_points.competitor.id}`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {\n    className: "dropdown-item",\n    onClick: () => {\n      setUserIndependentPick(competitor.competitor_points.competitor);\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("small", null, "#", competitor.competitor_points.competitor.number), " ", competitor.competitor_points.competitor.first, " ", competitor.competitor_points.competitor.last)))))))), currentSeason.top_rookie && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "col d-flex justify-content-center",\n    key: `rookie-pick-dropdown-div`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card text-center mb-2"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-header"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h5", {\n    className: "card-title text-muted"\n  }, "Rookie Pick")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-body",\n    style: {\n      padding: "8px"\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "dropdown p-2"\n  }, invalidRookie == true && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {\n    className: "btn btn-outline-danger dropdown-toggle",\n    id: `rookie-pick-button`,\n    onClick: e => (0,_utils__WEBPACK_IMPORTED_MODULE_3__.toggleDropdown)(`rookie-pick-dropdown`, e, loggedIn)\n  }, userRookiePick != 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, userRookiePick.first, " ", userRookiePick.last), userRookiePick == 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "Rookie Pick")), invalidRookie == false && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {\n    className: "btn btn-outline-secondary dropdown-toggle",\n    id: `rookie-pick-button`,\n    onClick: e => (0,_utils__WEBPACK_IMPORTED_MODULE_3__.toggleDropdown)(`rookie-pick-dropdown`, e, loggedIn)\n  }, userRookiePick != 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, userRookiePick.first, " ", userRookiePick.last), userRookiePick == 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", null, "Rookie Pick")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {\n    className: "dropdown-menu",\n    id: `rookie-pick-dropdown`,\n    style: {\n      overflowY: "scroll",\n      maxHeight: "15rem"\n    }\n  }, competitorsSortedNumber.map(competitor => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {\n    key: `competitor-${competitor.competitor_points.competitor.id}`\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", {\n    className: "dropdown-item",\n    onClick: () => {\n      setUserRookiePick(competitor.competitor_points.competitor);\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("small", null, "#", competitor.competitor_points.competitor.number), " ", competitor.competitor_points.competitor.first, " ", competitor.competitor_points.competitor.last))))))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {\n    className: "card-footer d-flex justify-content-center"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {\n    className: "btn btn-primary",\n    onClick: () => submitPicks()\n  }, "Submit")));\n}\n\n//# sourceURL=webpack://frontend/./src/components/UserPicksSelector.js?')}}]);