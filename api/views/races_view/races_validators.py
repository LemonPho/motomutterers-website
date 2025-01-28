from ...models import Season, CompetitorPosition, Competitor, SeasonCompetitorPosition
from ...serializers.serializers_util import sanitize_html
from ...serializers.competitors_serializers import CompetitorPositionWriteSerializer

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException

import os

RACE_TYPE_UPCOMING = 1
RACE_TYPE_FINAL = 2
RACE_TYPE_SPRINT = 3

# ---------------------// FUNCTIONS USED FOR CREATING RACES FROM LINKS //---------------------

#validate the link and data received
def validate_race_link_data(data):
    response = {
        "invalid_link": False,
        "invalid_season": False,
        "invalid_type": False,
        "link": None,
    }

    url = data.get("link")
    season_year = data.get("season_year")
    race_type = int(data.get("race_type"))

    try:
        season = Season.objects.filter(visible=True).get(year=season_year)
    except Season.DoesNotExist:
        season = False

    if not season:
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

    try:
        season_competitor_position = season.competitors.get(competitor_points__competitor__number=number)
    except SeasonCompetitorPosition.DoesNotExist:
        season_competitor_position = None

    if season_competitor_position is None:
        response["competitor_not_found"] = number
    else:
        response["competitor_points"]["competitor"] = season_competitor_position.competitor_points.competitor.id

    return response

def process_race_row(row, season):
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

    if position == "dnf" or position == "dns":
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
        response["competitor_not_found"] = number
    else:
        response["competitor_points"]["competitor"] = season_competitor_position.competitor_points.competitor.id
        response["competitor_points"]["points"] = points
        response["position"] = position

    return response
        
# ---------------------// FUNCTIONS THAT BUILD THE RACE DATA FROM THE LINK //--------------------- #

def generate_link_upcoming_data(data, season):
    response = {
        "timeout": False,
        "competitors_not_found": [],
        "data": {
            "title": "",
            "track": "",
            "timestamp": data.get("timestamp"),
            "is_sprint": False,
            "finalized": False,
            "qualifying_positions": [],
            "url": data.get("link")
        }
    }

    url = data.get("link")

    q1_url = url + "?st=Q1"
    q2_url = url + "?st=Q2"    

    #windows
    if os.name == "nt":
        browser = webdriver.Chrome()
    #linux
    else:
        service = Service("/usr/bin/chromedriver")
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-blink-features=AutomationControlled')

        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        browser = webdriver.Chrome(service=service, options=options)


    browser.get(q2_url)
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
        return response
        
    try:
        title = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".msnt-select__option.msnt-select__option--event.msnt-select__option--header"))).get_attribute("data-selection-title")
    except TimeoutException:
        response["timeout"] = True
        browser.quit()
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
    return response

def generate_link_final_data(data, season):
    response = {
        "timeout": False,
        "competitors_not_found": [],
        "data": {
            "title": "",
            "track": "",
            "timestamp": data.get("timestamp"),
            "is_sprint": False,
            "finalized": True,
            "competitors_positions": [],
            "url": data.get("link"),
        }
    }

    url = data.get("link")

    #start browser
    

    #windows
    if os.name == "nt":
        browser = webdriver.Chrome()
    #linux
    else:
        service = Service("/usr/bin/chromedriver")
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-blink-features=AutomationControlled')

        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        browser = webdriver.Chrome(service=service, options=options)


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
        table_row_response = process_race_row(table_row, season)
        
        if table_row_response["competitor_not_found"]:
            response["competitors_not_found"].append(table_row_response["competitor_not_found"])
        else:
            response["data"]["competitors_positions"].append({
                "competitor_points": {
                    "competitor": table_row_response["competitor_points"]["competitor"],
                    "points": table_row_response["competitor_points"]["points"],
                },
                "position": table_row_response["position"]
            })
        
    browser.quit()

    return response


def generate_link_sprint_data(data, season):
    response = {
        "timeout": False,
        "competitors_not_found": [],
        "data": {
            "title": "",
            "track": "",
            "timestamp": data.get("timestamp"),
            "is_sprint": False,
            "finalized": True,
            "competitors_positions": [],
            "url": data.get("link"),
        }
    }

    url = data.get("link")
    url += "?st=SPR"

    #start browser
    

    #windows
    if os.name == "nt":
        browser = webdriver.Chrome()
    #linux
    else:
        service = Service("/usr/bin/chromedriver")
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-blink-features=AutomationControlled')

        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        browser = webdriver.Chrome(service=service, options=options)


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
        table_row_response = process_race_row(table_row, season)
        
        if table_row_response["competitor_not_found"]:
            response["competitors_not_found"].append(table_row_response["competitor_not_found"])
        else:
            response["data"]["competitors_positions"].append({
                "competitor_points": {
                    "competitor": table_row_response["competitor_points"]["competitor"],
                    "points": table_row_response["competitor_points"]["points"],
                },
                "position": table_row_response["position"]
            })
        
    browser.quit()

    return response

def generate_link_race_data(data, season, is_sprint, is_final):
    if is_sprint:
        response = generate_link_sprint_data(data, season)
    elif is_final:
        response = generate_link_final_data(data, season)
    else:
        response = generate_link_upcoming_data(data, season)

    
    return response

def process_retrieve_race_result(race):
    response = {
        "timeout": False,
        "competitors_not_found": [],
        "data": {
            "competitors_positions": [],
            "standings": {},
        }
    }

    url = race.url

    #windows
    if os.name == "nt":
        browser = webdriver.Chrome()
    #linux
    else:
        service = Service("/usr/bin/chromedriver")
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-blink-features=AutomationControlled')

        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        browser = webdriver.Chrome(service=service, options=options)


    browser.get(url)
    delay = 10

    try:
        table = WebDriverWait(browser, delay).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".ms-table.ms-table--result")))
    except TimeoutException:
        response["timeout"] = True
        browser.quit()
        return response
    
    table_body = table.find_element(By.TAG_NAME, "tbody")
    table_rows = table_body.find_elements(By.TAG_NAME, "tr")

    for table_row in table_rows:
        table_row_response = process_race_row(table_row, race.season.first())
        
        if table_row_response["competitor_not_found"]:
            response["competitors_not_found"].append(table_row_response["competitor_not_found"])
        else:
            response["data"]["competitors_positions"].append({
                "competitor_points": {
                    "competitor": table_row_response["competitor_points"]["competitor"],
                    "points": table_row_response["competitor_points"]["points"],
                },
                "position": table_row_response["position"]
            })
        
    browser.quit()

    return response


#generates standings after race
def generate_race_standings(competitors_positions, season):
    response = {
        "data":{
            "users_picks": [],
        },
        "competitor_not_found": False,
    }

    standings = season.standings

    season_competitors = season.competitors.all()
    position = 1

    for standing in list(standings.users_picks.all()):
        points = 0
        for pick in list(standing.picks.all()):
            try:
                season_competitor = season_competitors.get(competitor_points__competitor=pick.competitor_points.competitor)
            except SeasonCompetitorPosition.DoesNotExist:
                print(f"did not find season competitor: {pick.competitor_points.competitor}")
                response["competitor_not_found"] = True
                return response
            
            try:
                competitor_position = competitors_positions.get(competitor_points__competitor=pick.competitor_points.competitor)
            except CompetitorPosition.DoesNotExist:
                print(f"Competitor: {pick.competitor_points.competitor.first} {pick.competitor_points.competitor.last} didn't compete in this race")
                competitor_position = None
            
            points += season_competitor.competitor_points.points
            if competitor_position is not None:
                points += competitor_position.competitor_points.points

        if season.top_independent:
            try:
                season_competitor = season_competitors.get(competitor_points__competitor=standing.independent_pick.competitor_points.competitor)
            except SeasonCompetitorPosition.DoesNotExist:
                response["competitor_not_found"] = True
                return response
            
            try:
                competitor_position = competitors_positions.get(competitor_points__competitor=standing.independent_pick.competitor_points.competitor)
            except CompetitorPosition.DoesNotExist:
                response["competitor_not_found"] = True
                return response
            
            points += season_competitor.competitor_points.points + competitor_position.competitor_points.points
            
        if season.top_rookie:
            try:
                season_competitor = season_competitors.get(competitor_points__competitor=standing.rookie_pick.competitor_points.competitor)
            except SeasonCompetitorPosition.DoesNotExist:
                response["competitor_not_found"] = True
                return response
            
            try:
                competitor_position = competitors_positions.get(competitor_points__competitor=standing.rookie_pick.competitor_points.competitor)
            except CompetitorPosition.DoesNotExist:
                response["competitor_not_found"] = True
                return response
            
            points += competitor_position.competitor_points.points + season_competitor.competitor_points.points

        #TODO: will need to figure out position change
        response["data"]["users_picks"].append({
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