import main
import GameLoop

def printscores():
    sqlresult = main.sqlquery(f"SELECT screen_name, difficulty, sausagenum, high_score, location FROM game")
    for i in range(0, sqlresult.__len__(), 1):
        print(f"{sqlresult[i]}")

menuState = "main"
#expected values for 'menuState' are 'main', and 'scores'

while True:
    if menuState == "main":
        ans = input("Please input '1' to start a new game, '2' to view highscores, or '3' to exit the game: ")
        if ans == "1":
            #start the game
            GameLoop.game()
        elif ans == "2":
            #switch to highscore menu
            printscores()
            menuState = "scores"
        elif ans == "3":
            quit()
        else:
            "ERROR; Not a valid input."
    elif menuState == "scores":
        ans = input(f"input '1' to return to the mainmenu")
        if ans == "1":
            menuState = "main"
        else:
            "ERROR; Not a valid input."