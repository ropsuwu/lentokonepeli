import mysql.connector
sqlconnection = mysql.connector.connect(
    host='localhost',
    port='3306',
    database='flight_game',
    user='',
    password='',
    autocommit=True
)

def ensimatka():
    while True:
        nimi = input("Valitse aloitus maa antamalla maan nimi: ").lower()
        location1 = f"SELECT name FROM country WHERE name = '{nimi}'"
        print(location1)
        kursori = sqlconnection.cursor()
        kursori.execute(location1)
        rivi = kursori.fetchone()
        if rivi:
            return rivi[0]
        else:
            print("Maata ei löytynyt")
