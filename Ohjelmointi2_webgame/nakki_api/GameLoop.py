import main
import EnsiMaa
import DifficultySelect
import FlightCalculator
import math
import Blentokenttahaku
from random import shuffle

def game(mods):
    lives = 1
    sausagesFound = []
    diff = DifficultySelect.choosedifficulty()
    print("")
    difficultyName = diff[0]
    difficultyValue = diff[1]
    printtext("Enter 'h' or 'help' for list of available commands", mods)
    print("")
    if mods["estart"]:
        currentAirport = main.sqlquery("SELECT name FROM airport WHERE ident ='AT13'")[0][0]
        currentCountry = "Antarctica"
        for i in range(1,5):
            sausagesFound.append(f"sosig{i}")
        printtext("Good luck.", mods)
    else:
        currentAirport, currentCountry = EnsiMaa.ensimatka()
        #currentCountry = "Finland"
        #this could choose a random airport from the selected country?
    totalDistanceTravelled = 0
    printtext(f"You are currently located in {currentCountry}.", mods)
    print("")
    Blentokenttahaku.run_nearest_airports(currentAirport, sausagesFound, mods)
    while True:
        print("")
        command = input("Enter command: ").lower()
        if command == "h" or command == "help":
            printtext(f"You are currently located at {currentAirport} in {currentCountry}.", mods)
            print("")
            Blentokenttahaku.run_nearest_airports(currentAirport, sausagesFound, mods)
            printtext("Available actions:\n\""
                      "find sausage\"\n"
                      "Enter airport name or ICAO code.\n"
                      "Type 'help' or h to see available actions.\n"
                      "> ", mods)
        #TESTCOMMANDS
        #///
        elif command == "find sausage" or command == "find":
            nakki = main.sqlquery(f"SELECT sausage FROM country WHERE name='{currentCountry}'")[0][0]
            if sausagesFound.__contains__(currentCountry):
                printtext("You have already eaten this country's sausage! :(", mods)
            elif nakki is None:
                printtext("You can't find any sausages around here. :(", mods)
            else:
                # this adds the current country to the list of sausages eaten
                sausagesFound.append(currentCountry)
                printtext(f"You ate a {difficultyName} {nakki}!", mods)
        #this checks if the player input an icao code or airport name.
        elif main.sqlquery(f"SELECT name FROM airport WHERE name='{command}' OR ident='{command}'"):
            newAirportName = main.sqlquery(f"SELECT name FROM airport WHERE name='{command}' OR ident='{command}'")[0][0]
            icao1 = main.sqlquery(f"SELECT ident FROM airport WHERE name='{command}' OR ident='{command}'")[0][0]
            icao2 = main.sqlquery(f"SELECT ident FROM airport WHERE name='{currentAirport}'")[0][0]
            distanceTravelled = float(main.valimatka(icao1, icao2))
            totalDistanceTravelled += distanceTravelled
            result = FlightCalculator.flytoplace(distanceTravelled, difficultyValue, sausagesFound.__len__(), mods)
            if result == "success":
                currentCountry = main.sqlquery(f"SELECT country.name FROM country, airport WHERE country.iso_country = airport.iso_country AND airport.name = '{newAirportName}'")[0][0]
                currentAirport = newAirportName
                printtext(f"You have arrived at {currentAirport} in {currentCountry}.", mods)
                print("")
                Blentokenttahaku.run_nearest_airports(currentAirport, sausagesFound, mods)
            elif result == "cancelled":
                printtext(f"Flight to {newAirportName} cancelled.", mods)
            elif result == "death":
                if mods["2hearted"] and lives==1:
                    input(f"While on a plane to {newAirportName} you entered cardiac arrest. One of your hearts is now unusable! (continue)")
                    print("")
                    lives=0
                    currentCountry = main.sqlquery(f"SELECT country.name FROM country, airport WHERE country.iso_country = airport.iso_country AND airport.name = '{newAirportName}'")[0][0]
                    currentAirport = newAirportName
                    printtext(f"You have arrived at {currentAirport} in {currentCountry}.", mods)
                    Blentokenttahaku.run_nearest_airports(currentAirport, sausagesFound, mods)
                else:
                    print("")
                    printtext(f"While on a plane to {newAirportName} you entered cardiac arrest and subsequently perished after eating a total of {sausagesFound.__len__()} sausages!", mods)
                    #some sort of ascii art could work here?

                    #The players score is greatly influenced by difficulty, more so than the chance of death when travelling.
                    # This means a higher difficulty will usually result in a greater score, even with worse performance comparatively.
                    #Finding sausages is the primary objective in the game, which is why it is the most important component in calculating score
                    #Travelling more distance during the game will slightly lower the players score,
                    # though it is always better to get more sausages than to keep distance travelled low
                    score = int(((pow(difficultyValue,2))*sausagesFound.__len__()*100)/math.log10(totalDistanceTravelled))
                    print("")
                    printtext(f"Your final SAUSAGE FEST score was {score}", mods)
                    scoreName = input("Enter name: ")
                    idCount = main.sqlquery("SELECT COUNT(*) FROM game")[0][0]+1
                    while True:
                        exists = main.sqlquery(f"SELECT id FROM game WHERE id = {idCount}")
                        if exists:
                            idCount+=1
                        else:
                            break
                    main.sqlquery(f"INSERT INTO game VALUES ({idCount}, '{difficultyName}', {sausagesFound.__len__()},'{score}', '{scoreName}', '{currentAirport}, {currentCountry}')")
                    break

def printtext(string, mods):
    if mods['dyslexia']:
        text = shuffle_word(string)
        print(text)
    else:
        print(string)

def shuffle_word(word):
    word = list(word)
    shuffle(word)
    return ''.join(word)