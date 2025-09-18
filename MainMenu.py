import main

menuState = "main"
#expected values for 'menuState' are 'main', and 'scores'
currentScoreSection = 0

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
        #this should use 'currentScoreSection' to show different parts of the score table
        sqlResult = main.sqlquery(f"")
        for i in range(0,19,1):
            print(f"{sqlResult[i]}")
        print(f"Showing scores #{currentScoreSection+1}-#{currentScoreSection+20}.")
        ans = input(f"input '1' to move further in the list, '2' to move backward, or '3' to return to the mainmenu")
        if ans == 1:
            currentScoreSection+=1
        elif ans == 2:
            if currentScoreSection > 0:
                currentScoreSection-=1
        elif ans == 3:
            menuState = "main"
        else:
            "ERROR; Not a valid input."