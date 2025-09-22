import main

menuState = "main"
#expected values for 'menuState' are 'main', and 'scores'

while True:
    if menuState == "main":
        ans = input("Please input '1' to start a new game, '2' to view highscores, or '3' to exit the game")
        if ans == 1:
            #start the game

        elif ans == 2:
            #switch to highscore menu
           menuState = "scores"
        elif ans == 3:
            quit()
        else:
            "ERROR; Not a valid input."
    elif menuState == "scores":
        sqlResult = main.sqlquery(f"SELECT name, difficulty, score FROM highscores")
        for i in range(0,sqlResult.__len__(),1):
            print(f"{sqlResult[i]}")
        ans = input(f"input '1' to return to the mainmenu")
        if ans == 1:
            menuState = "main"
        else:
            "ERROR; Not a valid input."