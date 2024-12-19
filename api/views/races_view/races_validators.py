from ...models import Season, CompetitorPosition, Competitor, SeasonCompetitorPosition
from ...serializers.serializers_util import sanitize_html

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException

def validate_race_upcoming_link_data(data):
    response = {
        "invalid_link": False,
        "invalid_season": False,
        "season": None,
    }

def validate_race_link_data(data):
    response = {
        "invalidLink": False,
        "invalidSeason": False,
        "is_sprint": False,
    }

    url = data.get("link")
    season_year = data.get("season_year")

    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        season = False

    if url[-3:] == 'SPR':
        response["is_sprint"] = True

    if not season:
        response["invalidSeason"] = True

    response["season"] = season

    return response

def generate_table_race_data(data, season, is_sprint):
    response = {
        "timeout": False,
        "competitors_not_found": [],
        "data": {
            "title": "",
            "track": "",
            "timestamp": data.get("timestamp"),
            "is_sprint": is_sprint,
            "finalized": True,
            "competitors_positions": [],
        }
    }

    url = data.get("link")
    url = sanitize_html(url)

    #start browser
    #service = Service("/usr/bin/chromedriver")

    options = webdriver.ChromeOptions()
    options.add_argument('--disable-blink-features=AutomationControlled')

    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")

    #browser = webdriver.Chrome(service=service, options=options)
    browser = webdriver.Chrome(options=options)
    browser.get(url)
    delay = 10

    try:
        table = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".ms-table.ms-table--result")))
    except TimeoutException:
        response["timeout"] = True
        browser.quit()
        return response
        
    try:
        title = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".msnt-select__option.msnt-select__option--event.msnt-select__option--header"))).get_attribute("data-selection-title")
    except TimeoutException:
        response["timeout"] = True
        browser.quit()
        return response

        
    response["data"]["title"] = title
    
    table_body = table.find_element(By.TAG_NAME, "tbody")
    table_rows = table_body.find_elements(By.TAG_NAME, "tr")

    for table_row in table_rows:
        position_element = table_row.find_element(By.CSS_SELECTOR, ".ms-table_cell.ms-table_field--pos")
        number_element = table_row.find_element(By.CSS_SELECTOR, ".ms-table_cell.ms-table_field--number")
        points_element = table_row.find_element(By.CSS_SELECTOR, ".ms-table_cell.ms-table_field--points")

        position = position_element.find_element(By.CLASS_NAME, "ms-table_row-value").get_attribute("innerHTML")
        number = int(number_element.find_element(By.CLASS_NAME, "ms-table_row-value").get_attribute('innerHTML'))
        points = points_element.find_element(By.CLASS_NAME, "ms-table_row-value").get_attribute("innerHTML")

        if position == "dnf":
            position = 0
        else:
            position = int(position)

        if points == "":
            points = 0
        else:
            points = int(points)

        try:
            season_competitor_position = season.competitors.get(competitor_points__competitor__number=number)
        except SeasonCompetitorPosition.DoesNotExist:
            season_competitor_position = None

        if season_competitor_position is None:
            response["competitors_not_found"].append(number)
        else:
            response["data"]["competitors_positions"].append({
                "competitor_points": {
                    "competitor_id": season_competitor_position.competitor_points.competitor.id,
                    "points": points,
                },
                "position": position,
            })
        
    browser.quit()

    return response

#generates standings after race
def generate_race_standings():
    pass

#this function expects the competitors positions to arrive sorted!!
def validate_generate_competitors_positions(data, is_sprint):
    response = {
        "invalid_competitors_positions_spacing": [],
        "competitors_not_found": [],
        "new_competitors_positions_data": [],
    }

    points = [12, 9, 7, 6, 5, 4, 3, 2, 1] if is_sprint else [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    prev_competitor_position = {
        "competitor_points":{
            "competitor_id": None,
            "points": 0
        },
        "position": 0,
    }

    for i in range(0, len(data)):
        try:
            Competitor.objects.get(pk=data[i]["competitor_id"])
        except Competitor.DoesNotExist:
            response["competitors_not_found"].append(data[i]["competitor_id"])

        if data[i]["position"] == 0:
            response["new_competitors_positions_data"].append({
                "competitor_points": {
                    "competitor_id": data[i]["competitor_id"],
                    "points": 0,    
                },
                "position": data[i]["position"],
            })
        else:
            if data[i]["position"] - prev_competitor_position["position"] != 1:
                response["invalid_competitors_positions_spacing"].append(data[i]["competitor_id"])
                response['invalid_competitors_positions_spacing'].append(prev_competitor_position["competitor_id"])
            else:
                if data[i]["position"] <= len(points):
                    response["new_competitors_positions_data"].append({ 
                        "competitor_points": {
                            "competitor_id": data[i]["competitor_id"],
                            "points": points[data[i]["position"]-1],
                        },
                        "position": data[i]["position"],
                        })
                else:
                    response["new_competitors_positions_data"].append({ 
                        "competitor_points": {
                            "competitor_id": data[i]["competitor_id"],
                            "points": 0
                        },
                        "position": data[i]["position"],
                        })
                
        prev_competitor_position = data[i]

    return response