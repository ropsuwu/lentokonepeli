def choosedifficulty():
    while True:
        difficulty = input("Choose a difficulty. Vegan (1), Bland (2), Deep Fried (3): ")
        if difficulty.lower() == "1" or difficulty.lower() == 'vegan':
            difficultyName = "vegan"
            difficultyValue = 0.3
            break
        elif difficulty.lower() == "2" or difficulty.lower() =='bland':
            difficultyName = "bland"
            difficultyValue = 1.0
            break
        elif difficulty.lower() == "3" or difficulty.lower() =='deep fried':
            difficultyName = "deep fried"
            difficultyValue = 2.0
            break
    return [difficultyName, difficultyValue]