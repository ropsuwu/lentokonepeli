import mysql.connector
sqlconnection = mysql.connector.connect(
    host='localhost',
    port='3306',
    database='flight_game',
    user='roope',
    password='nakki',
    autocommit=True
)

def ensimatka():
    while True:
        nimi = input("Valitse aloitus maa antamalla maan nimi englanniksi: ").lower()
        location1 = f"SELECT name, iso_country FROM country WHERE name = '{nimi}'"
        kursori = sqlconnection.cursor()
        kursori.execute(location1)
        rivi = kursori.fetchone()
        if rivi:
            iso_code = rivi[1]

            # Haetaan ensimmäinen large_airport tästä maasta
            sql_airport = f"SELECT airport.name FROM airport WHERE airport.iso_country = '{iso_code}' AND airport.type = 'large_airport'"
            kursori.execute(sql_airport)
            kentta = kursori.fetchone()

            if kentta:
                return kentta[0], rivi[0]  # palautetaan (lentokentän nimi, maan nimi)
            else:
                print("Tästä maasta ei löytynyt large_airport -tyyppisiä kenttiä.")
        else:
            print("Maata ei löytynyt")





