import main
import EnsiMaa
import DifficultySelect
import FlightCalculator
import math

def removeshittis(string):
    string.replace(",","")
    string.replace("(,", "")
    string.replace(")", "")
    string.replace("[,", "")
    string.replace("]", "")
    return string
def game():
    sausagesFound = []
    diff = DifficultySelect.choosedifficulty()
    difficultyName = diff[0]
    difficultyValue = diff[1]
    #currentCountry = EnsiMaa.ensimatka()
    currentCountry = "Finland"
    #this could choose a random large airport from the selected country?
    currentAirport = "Helsinki Vantaa Airport"
    totalDistanceTravelled = 0
    while True:
        print(f"You are currently located in {currentCountry}.")
        print("The available actions are:")
        #available commands should be listed for the player here
        command = input("test: ").lower()
        #this adds the current country to the list of sausages eaten
        if command == "find sausage":
            nakki = main.sqlquery(f"SELECT sausage FROM country WHERE name='{currentCountry}'")[0][0]
            if sausagesFound.__contains__(currentCountry):
                print("You have already eaten a sausage from this country!! :(")
            else:
                sausagesFound.append(currentCountry)
                print(f"You ate a {difficultyName} {nakki}!")
        #this checks if the player input an icao code or airport name.
        elif main.sqlquery(f"SELECT name FROM airport WHERE name='{command}' OR ident='{command}'"):
            newAirportName = main.sqlquery(f"SELECT name FROM airport WHERE name='{command}' OR ident='{command}'")
            newAirportName = newAirportName[0][0]
            icao1 = main.sqlquery(f"SELECT ident FROM airport WHERE name='{command}' OR ident='{command}'")[0][0]
            icao2 = main.sqlquery(f"SELECT ident FROM airport WHERE name='{currentAirport}'")[0][0]
            distanceTravelled = float(main.valimatka(icao1, icao2))
            totalDistanceTravelled += distanceTravelled
            result = FlightCalculator.flytoplace(distanceTravelled, difficultyValue, sausagesFound.__len__())
            if result == "success":
                currentCountry = main.sqlquery(f"SELECT country.name FROM country, airport WHERE country.iso_country = airport.iso_country AND airport.name = '{newAirportName}'")[0][0]
                currentAirport = newAirportName
                print(f"You have arrived at {currentAirport} in {currentCountry}.")
            elif result == "cancelled":
                print(f"Flight to {newAirportName} cancelled.")
            elif result == "death":
                print(f"While on a plane to {newAirportName} you entered cardiac arrest and subsequently perished after eating a total of {sausagesFound.__len__()} sausages!")
                #some sort of ascii art could work here?

                #The players score is greatly influenced by difficulty, more so than the chance of death when travelling.
                # This means a higher difficulty will usually result in a greater score, even with worse performance.
                #Finding sausages is the primary objective in the game, which is why it is the most important component in calculating score
                #Travelling more distance during the game will slightly lower the players score,
                # though it is always better to get more sausages than to keep distance travelled low
                score = int(((pow(difficultyValue,2))*sausagesFound.__len__()*100)/math.log10(totalDistanceTravelled))
                scoreName = input("Enter name: ")
                idCount = main.sqlquery("SELECT COUNT(*) FROM game")[0][0]
                main.sqlquery(f"INSERT INTO game VALUES ({idCount+1}, '{difficultyName}', '{score}', '{scoreName}', '{currentAirport}, {currentCountry}')")
                break