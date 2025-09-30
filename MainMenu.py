import main
import GameLoop
def printscores():
    sqlresult = main.sqlquery(f"SELECT screen_name, difficulty, sausagenum, high_score, location FROM game ORDER BY sausagenum DESC")
    for i in range(0, sqlresult.__len__(), 1):
        print(f"{sqlresult[i]}")

menuState = "main"
<<<<<<< Updated upstream
mods = {
    "2hearted": False,
    "estart": False,
    "colourblind": "Off",
    "dyslexia": False,
}
cbmodes = ["Off", "Protanopia", "Deuteranopia", "Tritanopia"]
=======
>>>>>>> Stashed changes
#expected values for 'menuState' are 'main', 'scores', and 'mods'

while True:
    if menuState == "main":
<<<<<<< Updated upstream
        ans = input("(1) Start a new game\n"
                    "(2) Change game modifiers\n"
                    "(3) View highscores\n"
                    "(4) Exit the game\n>")
=======
        ans = input("(1) Start a new game\n(2) Change game modifiers\n(3) View highscores\n(4) Exit the game\n> ")
>>>>>>> Stashed changes
        if ans == "1":
            #start the game
            GameLoop.game(mods)
        elif ans == "2":
<<<<<<< Updated upstream
            #switch to modifiers menu
=======
>>>>>>> Stashed changes
            menuState = "mods"
        elif ans == "3":
            #switch to highscore menu
            menuState = "scores"
        elif ans == "4":
            quit()
        else:
            print("ERROR; Not a valid input.")
    elif menuState == "mods":
<<<<<<< Updated upstream
        ans = input(f"(1) Two hearts: {mods['2hearted']}\n"
                    f"(2) Extreme start: {mods['estart']}\n"
                    #a 'daily run' type modifier could work here
                    f"(8) Colour Blind Mode: {mods['colourblind']}\n"
                    f"(9) Dyslexia: {mods['dyslexia']}\n"
                    f"(0/enter) Return to the main-menu\n"
                    f"> ")
        if ans == "0" or ans == "":
            menuState = "main"
        elif ans == "1":
            mods["2hearted"] = not mods["2hearted"]
        elif ans == "2":
            mods["estart"] = not mods["estart"]
        elif ans == "8":
            mods["colourblind"] = cbmodes[(cbmodes.index(mods["colourblind"])+1)%4]
        elif ans == "9":
            mods["dyslexia"] = not mods["dyslexia"]
=======
        print(f"")
>>>>>>> Stashed changes
    elif menuState == "scores":
        printscores()
        ans = input(f"Return to the main-menu by pressing enter")
        menuState = "main"
