from ...models import Season, Competitor, CompetitorPoints
from ...serializers import sanitize_html

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.service import Service

import re


def validate_competitor_data(data):
    result = {
        "season_not_found": False,
        "rider_exists": False,
        "season": None,
    }

    year = int(data["season"])
    number = int(data["competitor_points"]["competitor"]["number"])
    
    try:
        season = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        result["season_not_found"] = True
        return result
    
    result["season"] = season
    
    competitor_positions = season.competitors.filter(competitor_points__competitor__number=number)

    if competitor_positions.count() != 0:
        result["rider_exists"] = True
        return result
    
    return result

def generate_competitor_points_data(competitor, points):
    result = {
        "competitor_id": competitor.id,
        "points": 0,
        "competitor_not_found": False,
        "points_not_valid": False,
    }

    try:
        temp_competitor = Competitor.objects.get(pk = competitor.id)
    except Competitor.DoesNotExist:
        result["competitor_not_found"] = True
        return result
    

    if points < 0:
        result["points_not_valid"] = True
        return result
    
    result["points"] = points

    return result

def generate_season_competitor_position_data(competitor_points, year, independent):
    result = {
        "season_not_found": False,
        "competitor_points_not_found": False,
        "competitor_points_id": competitor_points.id,
        "independent": independent,
    }

    try:
        season = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        result["season_not_found"] = True
        return result
    
    try:
        temp_competitor_points = CompetitorPoints.objects.get(pk = competitor_points.id)
    except CompetitorPoints.DoesNotExist:
        result["competitor_points_not_found"] = True
        return result
    
    
    return result

def validate_season_competitors_data(data):
    response = {
        "invalidLink": False,
        "invalidSeason": False,
        "timeout": False,
        "season": None,
    }

    year = data.get("year")
    url = data.get("url")
    url = sanitize_html(url)

    try:
        season = Season.objects.filter(visible=True).get(year=year)
    except Season.DoesNotExist:
        season = False

    if not season:
        response["invalidSeason"] = True

    if url.find("riders/motogp") == -1 and url.find("championship-standings") == -1:
        response["invalidLink"] = True

    response["season"] = season

    return response

def generate_competitor_table_data(url, season):
    response = {
        "timeout": False,
        "data": [],
    }

    #linux chromium
    service = Service("/usr/bin/chromedriver")

    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")

    browser = webdriver.Chrome(service=service, options=options)
    browser.get(url)
    delay = 10

    if url.find("riders/motogp") >= 0:
        try:
            motogp_rider_container = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".rider-grid__motogp.js-listing-container")))
            table = motogp_rider_container.find_element(By.CSS_SELECTOR, ".rider-list__container.js-lazy-load-images")
        except TimeoutException:
            response["timeout"] = True
            return response
        
        table_rows = table.find_elements(By.TAG_NAME, "a")
        
        for i in range(0, len(table_rows)):
            rider_data_container = table_rows[i].find_element(By.CLASS_NAME, "rider-list__info-container")

            competitor_url = table_rows[i].get_attribute("href")
            temp_name = competitor_url[33:]
            temp_first_name = temp_name.split("-")[0].capitalize()
            temp_name = temp_name[len(temp_first_name)+1:]
            temp_last_name = temp_name.split("/")[0].capitalize()

            temp_number = rider_data_container.find_element(By.CLASS_NAME, "rider-list__info-hashtag").get_attribute("innerHTML")
            temp_number = re.search(r'\d+', temp_number)
            temp_number = int(temp_number.group())

            response["data"].append({
                "competitor_points": {
                    "competitor": {
                        "first": temp_first_name,
                        "last": temp_last_name,
                        "number": temp_number,
                    },
                    "points": 0,
                },
                "position": i+1,
                "season": season.id,
            })
    elif url.find("championship-standings") >= 0:
        try:
            table = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.XPATH, "/html/body/main/div/section[2]/div[2]/div[2]/div[1]/table")))
            table_rows = WebDriverWait(table, delay).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "standings-table__body-row")))
        except TimeoutException:
            response["timeout"] = True
            return response

        for i in range(0, len(table_rows)):
            temp_first_name = ""
            temp_last_name = ""
            temp_number = 0

            temp_number = table_rows[i].find_element(By.CLASS_NAME, "standings-table__body-cell--number").get_attribute("innerHTML")
            competitor_url = table_rows[i].find_element(By.CLASS_NAME, "standings-table__rider-link").get_attribute("href")
            temp_name = competitor_url[33:]
            temp_first_name = temp_name.split("-")[0].capitalize()
            temp_name = temp_name[len(temp_first_name)+1:]
            temp_last_name = temp_name.split("/")[0].capitalize()

            response["data"].append({
                "competitor_points": {
                    "competitor": {
                        "first": temp_first_name,
                        "last": temp_last_name,
                        "number": temp_number,
                    },
                    "points": 0,
                },
                "position": i+1,
                "season": season.id,
            })

    else:
        response["timeout"] = True

    browser.quit()
    return response