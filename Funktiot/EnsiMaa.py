import mysql.connector
sqlconnection = mysql.connector.connect(
    host='localhost',
    port='3306',
    database='flight_game',
    user='',
    password='',
    autocommit=True
)

maaNimi = input("Valitse aloitus maa antamalla maan nimi: ").lower()
def ensimatka(Nimi):
    location1 = f"SELECT name FROM country WHERE name = '{Nimi}'"
    print(location1)
    kursori = sqlconnection.cursor()
    kursori.execute(location1)
    rivi = kursori.fetchone()
    if rivi:
        print(f"Aloitat maasta: {rivi[0]}")
    else:
        print("Maata ei löytynyt")
