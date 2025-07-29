from ...models import Season, CompetitorPosition, Competitor, SeasonCompetitorPosition
from ...utils import binary_search
from ...serializers.serializers_util import sanitize_html
from ...serializers.competitors_serializers import CompetitorPositionWriteSerializer

from ..selenium_status_view import create_selenium_status, check_selenium_status, close_selenium_status, ACTIVE_BROWSERS

from pyvirtualdisplay import Display
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException

import os
import psutil

RACE_TYPE_UPCOMING = 1
RACE_TYPE_FINAL = 2
RACE_TYPE_SPRINT = 3

RACE = 1
SPRINT_RACE = 2
GRID = 3

# ---------------------// FUNCTIONS USED FOR CREATING RACES FROM LINKS //---------------------

def validate_race_weekend_data(data):
    response = {
        "invalid_link": False,
        "invalid_season": False,
        "invalid_date": False,
        "url": None,
        "season": None,
    }

    url = data.get("url", False)
    season_year = data.get("season_year", False)
    start = data.get("start", False)
    end = data.get("end", False)

    if not url:
        response["invalid_link"] = True

    if not season_year:
        response["invalid_season"] = True

    if (not start or not end) or (end == start):
        response["invalid_date"] = True

    try:
        response["season"] = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        response["invalid_season"] = True

    url = sanitize_html(url)

    if "https://www.motorsport.com/motogp/results/" not in url:
        response["invalid_link"] = True

    if "?" in url:
        url = url.split("?")[0] #read up until the question mark

    response["url"] = url

    return response

#validate the link and data received
def validate_race_link_data(data):
    response = {
        "invalid_link": False,
        "invalid_season": False,
        "invalid_type": False,
        "link": None,
        "selenium_available": check_selenium_status(),
    }

    url = data.get("link")
    season_year = data.get("season_year")
    race_type = int(data.get("race_type"))

    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        response["invalid_season"] = True

    url = sanitize_html(url)

    if "https://www.motorsport.com/motogp/results/" not in url:
        response["invalid_link"] = True

    if "?" in url:
        url = url.split("?")[0] #read up until the question mark

    if race_type not in [RACE_TYPE_UPCOMING, RACE_TYPE_FINAL, RACE_TYPE_SPRINT]:
        response["invalid_type"] = True

    response["season"] = season
    response["link"] = url

    return response

# ---------------------// FUNCTIONS USED FOR PROCESSING TABLE ROWS FROM LINK //---------------------

def process_qualifying_row(row, season, position):
    response = {
        "competitor_points": {
            "competitor": None,
            "points": 0,
        },
        "position": position,
        "competitor_not_found": False,
    }

    number_element = row.find_element(By.CSS_SELECTOR, ".ms-table_cell.ms-table_field--number")
    number = int(number_element.find_element(By.CLASS_NAME, "ms-table_row-value").get_attribute('innerHTML'))

    season_competitors = list(season.competitors.all())
    season_competitors = sorted(season_competitors, key = lambda x: x.competitor_points.competitor.number)
    season_competitor = binary_search(season_competitors, number, lambda x: x.competitor_points.competitor.number)

    if season_competitor is None:
        response["competitor_not_found"] = number
    else:
        response["competitor_points"]["competitor"] = season_competitor.competitor_points.competitor.id

    return response

def process_race_row(row, season_competitors):
    response = {
        "competitor_points": {
            "competitor": None,
            "points": 0,
        },
        "position": 0,
        "competitor_not_found": False,
    }

    position_element = row.find_element(By.CSS_SELECTOR, ".ms-table_cell.ms-table_field--pos")
    number_element = row.find_element(By.CSS_SELECTOR, ".ms-table_cell.ms-table_field--number")
    points_element = row.find_element(By.CSS_SELECTOR, ".ms-table_cell.ms-table_field--points")

    position = position_element.find_element(By.CLASS_NAME, "ms-table_row-value").get_attribute("innerHTML")
    number = int(number_element.find_element(By.CLASS_NAME, "ms-table_row-value").get_attribute('innerHTML'))
    points = points_element.find_element(By.CLASS_NAME, "ms-table_row-value").get_attribute("innerHTML")

    if position == "dnf" or position == "dns" or position == "nc" or position == "dq":
        position = 0
    else:
        position = int(position)

    if points == "":
        points = 0
    else:
        points = int(points)

    season_competitor = binary_search(season_competitors, number, lambda x: x.competitor_points.competitor.number)

    if season_competitor is None:
        response["competitor_not_found"] = number
    else:
        response["competitor_points"]["competitor"] = season_competitor.competitor_points.competitor.id
        response["competitor_points"]["points"] = points
        response["position"] = position

    return response
        
# ---------------------// FUNCTIONS THAT BUILD THE RACE DATA FROM THE LINK //--------------------- #

def generate_qualifying_positions_data(url, season, request):
    response = {
        "timeout": False,
        "competitors_not_found": [],
        "data": {
            "qualifying_positions": [],
        }
    }

    q1_url = url + "?st=Q1"
    q2_url = url + "?st=Q2"

    display = None

    options = webdriver.ChromeOptions()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")

    #windows
    if os.name == "nt":
        browser = webdriver.Chrome()
    #linux
    else:
        display = Display(visible=0, size=(1920, 1080), use_xauth=True) #virtual display for gunicorn
        display.start()
        service = Service(executable_path="/usr/bin/chromedriver")
        browser = webdriver.Chrome(service=service, options=options)

    selenium_instance = create_selenium_status(pid=browser.service.process.pid, message="Retrieving qualifying positions", request=request, browser=browser)
    browser.get(q2_url)
    delay = 10

    try:
        table = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".ms-table.ms-table--result")))
    except TimeoutException:
        response["timeout"] = True
        browser.quit()
        close_selenium_status(selenium_instance)
        if display: display.stop()
        return response
        
    table_body = table.find_element(By.TAG_NAME, "tbody")
    table_rows = table_body.find_elements(By.TAG_NAME, "tr")

    position = 1

    for table_row in table_rows:
        table_row_response = process_qualifying_row(table_row, season, position)
        if table_row_response["competitor_not_found"]:
            response["competitors_not_found"].append(table_row_response["competitor_not_found"])
        else:
            response["data"]["qualifying_positions"].append({
                "competitor_points": {
                    "competitor": table_row_response["competitor_points"]["competitor"],
                    "points": 0,
                },
                "position": table_row_response["position"],
            })

            position += 1
    
    browser.get(q1_url)

    try:
        table = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".ms-table.ms-table--result")))
    except TimeoutException:
        response["timeout"] = True
        browser.quit()
        close_selenium_status(selenium_instance)
        if display: display.stop()
        return response

    table_body = table.find_element(By.TAG_NAME, "tbody")
    table_rows = table_body.find_elements(By.TAG_NAME, "tr")

    for i in range(2, len(table_rows)):
        table_row_response = process_qualifying_row(table_rows[i], season, position)
        if table_row_response["competitor_not_found"]:
            response["competitors_not_found"].append(table_row_response["competitor_not_found"])
        else:
            response["data"]["qualifying_positions"].append({
                "competitor_points": {
                    "competitor": table_row_response["competitor_points"]["competitor"],
                    "points": 0,
                },
                "position": table_row_response["position"],
            })

            position += 1

    browser.quit()
    close_selenium_status(selenium_instance)
    if display: display.stop()
    return response


def generate_race_data(race_weekend, is_sprint, request, season):
    response = {
        "timeout": False,
        "competitors_not_found": [],
        "selenium_busy": False,
        "race": {
            "competitors_positions": [],
            "is_sprint": is_sprint,
        }
    }

    display = None

    options = webdriver.ChromeOptions()
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")

    #windows
    if os.name == "nt":
        browser = webdriver.Chrome(options=options)
    #linux
    else:
        display = Display(0, (1920, 1080), use_xauth=True)
        display.start()
        service = Service(executable_path="/usr/bin/chromedriver")
        browser = webdriver.Chrome(service=service, options=options)

    selenium_instance = create_selenium_status(pid=browser.service.process.pid, message=f"Retrieving race result for {race_weekend.title}", request=request, browser=browser)

    if not selenium_instance:
        response["selenium_busy"] = True
        return response

    if not is_sprint:
        browser.get(race_weekend.url + "?st=RACE")
    else:
        browser.get(race_weekend.url + "?st=SPR")

    delay = 30

    try:
        table = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".ms-table.ms-table--result")))
    except TimeoutException:
        response["timeout"] = True
        browser.quit()
        close_selenium_status(selenium_instance)
        if display: display.stop()
        return response
    
    table_body = table.find_element(By.TAG_NAME, "tbody")
    table_rows = table_body.find_elements(By.TAG_NAME, "tr")

    season_competitors = list(season.competitors.all())
    season_competitors = sorted(season_competitors, key = lambda x:x.competitor_points.competitor.number)

    for table_row in table_rows:
        table_row_response = process_race_row(table_row, season_competitors)
        
        if table_row_response["competitor_not_found"]:
            response["competitors_not_found"].append(table_row_response["competitor_not_found"])
        else:
            response["race"]["competitors_positions"].append({
                "competitor_points": {
                    "competitor": table_row_response["competitor_points"]["competitor"],
                    "points": table_row_response["competitor_points"]["points"],
                },
                "position": table_row_response["position"]
            })
        
    browser.quit()
    close_selenium_status(selenium_instance)
    if display: display.stop()
    return response

#generates standings after race
def generate_race_weekend_standings(race_weekend, season):
    response = {
        "standings":{
            "users_picks": [],
        },
        "competitors_not_found": [],
    }

    standings = season.standings

    season_competitors = list(season.competitors.all())
    season_competitors = sorted(season_competitors, key = lambda x: x.competitor_points.competitor.id)
    race_competitors = list(race_weekend.race.competitors_positions.all())
    race_competitors = sorted(race_competitors, key = lambda x: x.competitor_points.competitor.id)
    sprint_race_competitors = list(race_weekend.sprint_race.competitors_positions.all())
    sprint_race_competitors = sorted(sprint_race_competitors, key = lambda x: x.competitor_points.competitor.id)

    position = 1

    for standing in list(standings.users_picks.all()):
        points = 0
        for pick in list(standing.picks.all()):
            season_competitor = binary_search(season_competitors, pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)
            if season_competitor is None: response["competitors_not_found"].add(pick.competitor_points.competitor.number)
            
            race_competitor = binary_search(race_competitors, pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)
            sprint_race_competitor = binary_search(sprint_race_competitors, pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)
            
            if season_competitor: points += season_competitor.competitor_points.points
            if race_competitor: points += race_competitor.competitor_points.points
            if sprint_race_competitor: points += sprint_race_competitor.competitor_points.points

        if season.top_independent:
            season_competitor = binary_search(season_competitors, standing.independent_pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)
            if season_competitor is None: response["competitors_not_found"].add(standing.independent_pick.competitor_points.competitor.number)
            
            race_competitor = binary_search(race_competitors, standing.independent_pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)
            sprint_race_competitor = binary_search(sprint_race_competitors, standing.independent_pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)
            
            if season_competitor: points += season_competitor.competitor_points.points
            if race_competitor: points += race_competitor.competitor_points.points
            if sprint_race_competitor: points += sprint_race_competitor.competitor_points.points
            
        if season.top_rookie:
            season_competitor = binary_search(season_competitors, standing.rookie_pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)
            if season_competitor is None: response["competitors_not_found"].add(standing.rookie_pick.competitor_points.competitor.number)
            
            race_competitor = binary_search(race_competitors, standing.rookie_pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)
            sprint_race_competitor = binary_search(sprint_race_competitors, standing.rookie_pick.competitor_points.competitor.id, lambda x: x.competitor_points.competitor.id)

            if season_competitor: points += season_competitor.competitor_points.points
            if race_competitor: points += race_competitor.competitor_points.points
            if sprint_race_competitor: points += sprint_race_competitor.competitor_points.points

        response["standings"]["users_picks"].append({
            "points": points,
            "user": standing.user.id,
            "position_change": 0,
            "position": position,
        })
        position += 1

    return response

        

# ---------------------// FUNCTIONS RELATED TO GENERATING RACE DATA FOR MANUALLY INPUTTED RACES //--------------------- #

#this function expects the competitors positions to arrive sorted!!
def validate_generate_complete_manual_race(data):
    response = {
        "race": {
            "title": data["race"]["title"],
            "track": data["race"]["track"],
            "timestamp": data["race"]["timestamp"],
            "is_sprint": data["race"]["is_sprint"],
            "finalized": data["race"]["finalized"],
            "competitors_positions": [],
        },
        "competitors_not_found": [],
        "invalid_competitors_positions_spacing": [],
    }

    points = [12, 9, 7, 6, 5, 4, 3, 2, 1] if data["race"]["is_sprint"] else [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    prev_competitor_position = {
        "competitor_points":{
            "competitor": None,
            "points": 0
        },
        "position": 0,
    }

    for i in range(0, len(data["competitors_positions"])):
        try:
            Competitor.objects.get(pk=data["competitors_positions"][i]["competitor_id"])
        except Competitor.DoesNotExist:
            response["competitors_not_found"].append(data["competitors_positions"][i]["competitor_id"])

        if data["competitors_positions"][i]["position"] == 0:
            response["race"]["competitors_positions"].append({
                "competitor_points": {
                    "competitor": data["competitors_positions"][i]["competitor_id"],
                    "points": 0,    
                },
                "position": data["competitors_positions"][i]["position"],
            })
        else:
            if data["competitors_positions"][i]["position"] - prev_competitor_position["position"] != 1:
                response["invalid_competitors_positions_spacing"].append(data["competitors_positions"][i]["competitor_id"])
                response['invalid_competitors_positions_spacing'].append(prev_competitor_position["competitor_id"])
            else:
                if data["competitors_positions"][i]["position"] <= len(points):
                    response["race"]["competitors_positions"].append({ 
                        "competitor_points": {
                            "competitor": data["competitors_positions"][i]["competitor_id"],
                            "points": points[data["competitors_positions"][i]["position"]-1],
                        },
                        "position": data["competitors_positions"][i]["position"],
                        })
                else:
                    response["race"]["competitors_positions"].append({ 
                        "competitor_points": {
                            "competitor": data["competitors_positions"][i]["competitor_id"],
                            "points": 0
                        },
                        "position": data["competitors_positions"][i]["position"],
                        })
                
        prev_competitor_position = data["competitors_positions"][i]

    return response