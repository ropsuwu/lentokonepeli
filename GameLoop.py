import main
import EnsiMaa

def game():
    sausagesFound = []
    currentCountry = EnsiMaa
    difficulty = input("Choose a difficulty. Vegan (1), Bland (2), Deep Fried (3): ")
    if difficulty.lower() == 1 or 'vegan':
        difficulty = "vegan"
    elif difficulty.lower() == 2 or 'bland':
        difficulty = "bland"
    elif difficulty.lower() == 3 or 'deep fried':
        difficulty = "deep fried"
    while True:
        print(f"You are currently located in {currentCountry}.")
        print("The available actions are:")
        #available commands should be listed for the player here
        command = input("test: ").lower()
        #this adds the current countries sausage to the players list
        if command == "find sausage":
            nakki = main.sqlquery(f"SELECT sosig FROM country WHERE name='{currentCountry}'")
            if sausagesFound.__contains__(nakki):
                print("You have already eaten a sausage from this country!! :(")
            else:
                sausagesFound.append(nakki)
                print(f"You ate a {difficulty} {nakki}")
        #this checks if the player input an icao code or airport name.
        elif main.sqlquery(f"SELECT name FROM airport WHERE name='{command}' OR ident='{command}'"):
            currentCountry = main.sqlquery(f"SELECT country.name FROM country, airport WHERE country.iso_country = airport.iso_country AND (airport.name='{command}' OR ident='{command}')")