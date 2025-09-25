import random


def flytoplace(distance, difficultyValue, nroOfSosigs):
    #The chance to die of a heart attack scales with the length of the flight and the amount of sausages eaten.
    #difficulty is very influential and will contribute to a much quicker or slower death
    #a flat 5% is deducted from the final total to encourage smart routing between sausage locations,
    # and to simulate having a heart attack on the plane but recieving medical attention due to landing fast enough
    chance = (difficultyValue * pow(distance * (nroOfSosigs/50), 0.8)) - 50
    #if the chance to die is over 20%, the player is asked for further confirmation
    if chance >= 0:
        confirm = input(f"Flying to this airport has a {chance/10:02f}% chance of resulting in death, are you sure you want to continue? (y/n): ").lower()
    else:
        confirm = "y"
    if confirm == "y":
        if random.randint(1, 1000) <= chance:
            return "death"
        else:
            return "success"
    else:
        return "cancelled"